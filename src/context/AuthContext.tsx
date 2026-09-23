import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  pushLocalDataToCloud,
  pullCloudDataToLocal,
  setupCloudRealtimeSync,
} from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncStatusMessage: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
  pullNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSyncing: false,
  lastSyncTime: null,
  syncStatusMessage: '',
  login: async () => {},
  logout: async () => {},
  syncNow: async () => {},
  pullNow: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // When user signs in, automatically pull latest or push initial
        try {
          setIsSyncing(true);
          setSyncStatusMessage('Menyinkronkan data dengan Firebase Cloud...');
          
          // First pull any cloud data
          const result = await pullCloudDataToLocal(currentUser);
          
          // If cloud was empty, push local data up to seed it
          if (result.schoolsCount === 0 && result.plansCount === 0 && result.commitmentsCount === 0) {
            await pushLocalDataToCloud(currentUser);
            setSyncStatusMessage('Data awal lokal berhasil dicadangkan ke Cloud Firebase.');
          } else {
            setSyncStatusMessage('Data cloud berhasil disinkronkan ke perangkat ini.');
          }

          setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        } catch (err: any) {
          console.warn('[Sync] Auto initial sync notice:', err?.message || err);
          setSyncStatusMessage('Koneksi cloud siap');
        } finally {
          setIsSyncing(false);
        }
      } else {
        setSyncStatusMessage('');
      }
    });

    return () => unsubscribe();
  }, []);

  // Setup realtime listeners whenever user is logged in
  useEffect(() => {
    if (!user) return;
    const cleanup = setupCloudRealtimeSync(user, (msg) => {
      setSyncStatusMessage(msg);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    });
    return () => cleanup();
  }, [user]);

  // Listen to local app changes and auto-push to cloud if user is signed in
  useEffect(() => {
    if (!user) return;
    let timer: any = null;

    const handleLocalUpdate = (e: any) => {
      if (e?.detail?.key === 'ALL_FIREBASE_SYNC') return; // avoid echo loop
      // Debounce push to prevent flooding
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          setIsSyncing(true);
          await pushLocalDataToCloud(user);
          setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          setSyncStatusMessage('Perubahan tersimpan otomatis di Cloud Firebase');
        } catch (err) {
          console.warn('[Cloud Sync] Auto-save error:', err);
        } finally {
          setIsSyncing(false);
        }
      }, 1500);
    };

    window.addEventListener('app_storage_updated', handleLocalUpdate);
    return () => {
      window.removeEventListener('app_storage_updated', handleLocalUpdate);
      clearTimeout(timer);
    };
  }, [user]);

  const login = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMessage('Menghubungkan ke Google...');
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
      // Push local data to ensure everything is in the cloud
      await pushLocalDataToCloud(loggedUser);
      setSyncStatusMessage('Berhasil masuk & tersinkronkan ke Cloud Firebase!');
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.error('Login error:', err);
      setSyncStatusMessage('Gagal masuk: ' + (err.message || 'Dibatalkan'));
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setSyncStatusMessage('Telah keluar dari akun Google.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const syncNow = async () => {
    if (!user) return;
    try {
      setIsSyncing(true);
      setSyncStatusMessage('Mengirim seluruh data lokal ke Cloud...');
      await pushLocalDataToCloud(user);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setSyncStatusMessage('Seluruh data berhasil dicadangkan ke Cloud Firebase!');
    } catch (err: any) {
      setSyncStatusMessage('Gagal sinkronisasi: ' + (err.message || 'Koneksi error'));
    } finally {
      setIsSyncing(false);
    }
  };

  const pullNow = async () => {
    if (!user) return;
    try {
      setIsSyncing(true);
      setSyncStatusMessage('Mengambil data terbaru dari Cloud...');
      const res = await pullCloudDataToLocal(user);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setSyncStatusMessage(
        `Berhasil memuat ${res.schoolsCount} sekolah, ${res.plansCount} RTL, dan ${res.commitmentsCount} komitmen dari Cloud!`
      );
    } catch (err: any) {
      setSyncStatusMessage('Gagal memuat data: ' + (err.message || 'Koneksi error'));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSyncing,
        lastSyncTime,
        syncStatusMessage,
        login,
        logout,
        syncNow,
        pullNow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
