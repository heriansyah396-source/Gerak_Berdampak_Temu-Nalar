import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  getDocFromServer,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  SchoolProgressItem,
  ActionPlanItem,
  MicroCommitment,
  DocPhoto,
} from './types';
import {
  getSchoolProgress,
  saveSchoolProgress,
  getActionPlans,
  saveActionPlans,
  getMicroCommitments,
  saveMicroCommitment,
  getDocPhotos,
  saveDocPhoto,
  getSupervisorProfile,
  saveSupervisorProfile,
  SupervisorProfileData,
} from './utils/storage';

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 2. Strict Error Handler conforming to SKILL.md
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 3. Test Connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection test: client is currently offline.');
    }
  }
}
testConnection();

// Helper to sanitize document IDs to match rules: ^[a-zA-Z0-9_\-]+$
export const sanitizeDocId = (id: string): string => {
  return id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 120);
};

// 4. Authentication Methods
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user profile document
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(
      userDocRef,
      {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Pengawas Pembina',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// 5. Cloud Synchronization Logic
// Sync local data to Firestore for a specific user
export const pushLocalDataToCloud = async (user: User): Promise<{
  schoolsCount: number;
  plansCount: number;
  commitmentsCount: number;
  photosCount: number;
}> => {
  if (!user) throw new Error('User belum login');

  const userId = user.uid;
  const schools = getSchoolProgress();
  const plans = getActionPlans();
  const commitments = getMicroCommitments();
  const photos = getDocPhotos();
  const supervisor = getSupervisorProfile();

  // Save Supervisor Profile
  try {
    const supRef = doc(db, 'supervisor_profiles', userId);
    await setDoc(
      supRef,
      {
        userId,
        name: supervisor.name || user.displayName || 'Pengawas Pembina',
        nip: supervisor.nip || '',
        title: supervisor.title || 'Pengawas Sekolah Madya',
        district: supervisor.district || 'Tellu Limpoe',
        kab: supervisor.kab || 'Sidenreng Rappang',
        prov: supervisor.prov || 'Sulawesi Selatan',
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `supervisor_profiles/${userId}`);
  }

  // Push Schools in batches
  for (const s of schools) {
    const rawId = `${userId}_sch_${s.id || s.schoolName}`;
    const docId = sanitizeDocId(rawId);
    try {
      await setDoc(doc(db, 'school_progress', docId), {
        ...s,
        id: docId,
        userId,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `school_progress/${docId}`);
    }
  }

  // Push Action Plans
  for (const p of plans) {
    const rawId = `${userId}_plan_${p.id}`;
    const docId = sanitizeDocId(rawId);
    try {
      await setDoc(doc(db, 'action_plans', docId), {
        ...p,
        id: docId,
        userId,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `action_plans/${docId}`);
    }
  }

  // Push Micro-Commitments
  for (const c of commitments) {
    const rawId = `${userId}_mc_${c.id}`;
    const docId = sanitizeDocId(rawId);
    try {
      await setDoc(doc(db, 'micro_commitments', docId), {
        ...c,
        id: docId,
        userId,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `micro_commitments/${docId}`);
    }
  }

  // Push Documentation Photos (skip heavy photos if base64 too big)
  for (const ph of photos) {
    const rawId = `${userId}_ph_${ph.id}`;
    const docId = sanitizeDocId(rawId);
    try {
      await setDoc(doc(db, 'doc_photos', docId), {
        ...ph,
        id: docId,
        userId,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `doc_photos/${docId}`);
    }
  }

  return {
    schoolsCount: schools.length,
    plansCount: plans.length,
    commitmentsCount: commitments.length,
    photosCount: photos.length,
  };
};

// Pull cloud data from Firestore for the current user and update local storage
export const pullCloudDataToLocal = async (user: User): Promise<{
  schoolsCount: number;
  plansCount: number;
  commitmentsCount: number;
  photosCount: number;
}> => {
  if (!user) throw new Error('User belum login');

  const userId = user.uid;

  // 1. Supervisor Profile
  try {
    const supSnap = await getDoc(doc(db, 'supervisor_profiles', userId));
    if (supSnap.exists()) {
      const data = supSnap.data() as SupervisorProfileData;
      saveSupervisorProfile({
        name: data.name || '',
        nip: data.nip || '',
        title: data.title || '',
        district: data.district || '',
        kab: data.kab || '',
        prov: data.prov || '',
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `supervisor_profiles/${userId}`);
  }

  // 2. School Progress
  let cloudSchools: SchoolProgressItem[] = [];
  try {
    const qSchools = query(
      collection(db, 'school_progress'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(qSchools);
    if (!snap.empty) {
      cloudSchools = snap.docs.map((d) => d.data() as SchoolProgressItem);
      saveSchoolProgress(cloudSchools);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'school_progress');
  }

  // 3. Action Plans
  let cloudPlans: ActionPlanItem[] = [];
  try {
    const qPlans = query(
      collection(db, 'action_plans'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(qPlans);
    if (!snap.empty) {
      cloudPlans = snap.docs.map((d) => d.data() as ActionPlanItem);
      saveActionPlans(cloudPlans);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'action_plans');
  }

  // 4. Micro-Commitments
  let cloudCommitments: MicroCommitment[] = [];
  try {
    const qMc = query(
      collection(db, 'micro_commitments'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(qMc);
    if (!snap.empty) {
      cloudCommitments = snap.docs.map((d) => d.data() as MicroCommitment);
      // Save into local storage
      const current = getMicroCommitments();
      // merge with priority to cloud items
      const mergedMap = new Map<string, MicroCommitment>();
      current.forEach((c) => mergedMap.set(c.id, c));
      cloudCommitments.forEach((c) => mergedMap.set(c.id, c));
      const mergedList = Array.from(mergedMap.values());
      localStorage.setItem('gerak_berdampak_micro_commitments', JSON.stringify(mergedList));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'micro_commitments');
  }

  // 5. Documentation Photos
  let cloudPhotos: DocPhoto[] = [];
  try {
    const qPhotos = query(
      collection(db, 'doc_photos'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(qPhotos);
    if (!snap.empty) {
      cloudPhotos = snap.docs.map((d) => d.data() as DocPhoto);
      cloudPhotos.forEach((ph) => saveDocPhoto(ph));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'doc_photos');
  }

  // Notify UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app_storage_updated', {
        detail: { key: 'ALL_FIREBASE_SYNC', timestamp: Date.now() },
      })
    );
  }

  return {
    schoolsCount: cloudSchools.length,
    plansCount: cloudPlans.length,
    commitmentsCount: cloudCommitments.length,
    photosCount: cloudPhotos.length,
  };
};

// 6. Realtime Firestore Listeners
export const setupCloudRealtimeSync = (
  user: User,
  onSyncStatus?: (status: string) => void
): (() => void) => {
  const unsubscribers: Unsubscribe[] = [];
  const userId = user.uid;

  try {
    // Listen to School Progress
    const qSchools = query(
      collection(db, 'school_progress'),
      where('userId', '==', userId)
    );
    const unsubSchools = onSnapshot(
      qSchools,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as SchoolProgressItem);
          saveSchoolProgress(items);
          if (onSyncStatus) onSyncStatus('Sekolah tersinkronisasi');
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'school_progress');
      }
    );
    unsubscribers.push(unsubSchools);

    // Listen to Action Plans
    const qPlans = query(
      collection(db, 'action_plans'),
      where('userId', '==', userId)
    );
    const unsubPlans = onSnapshot(
      qPlans,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as ActionPlanItem);
          saveActionPlans(items);
          if (onSyncStatus) onSyncStatus('RTL tersinkronisasi');
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'action_plans');
      }
    );
    unsubscribers.push(unsubPlans);

    // Listen to Micro Commitments
    const qMc = query(
      collection(db, 'micro_commitments'),
      where('userId', '==', userId)
    );
    const unsubMc = onSnapshot(
      qMc,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => d.data() as MicroCommitment);
          const current = getMicroCommitments();
          const map = new Map<string, MicroCommitment>();
          current.forEach((c) => map.set(c.id, c));
          items.forEach((c) => map.set(c.id, c));
          const merged = Array.from(map.values());
          localStorage.setItem('gerak_berdampak_micro_commitments', JSON.stringify(merged));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('app_storage_updated', {
                detail: { key: 'gerak_berdampak_micro_commitments', data: merged },
              })
            );
          }
          if (onSyncStatus) onSyncStatus('Komitmen tersinkronisasi');
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'micro_commitments');
      }
    );
    unsubscribers.push(unsubMc);
  } catch (err) {
    console.error('Failed to setup realtime listeners:', err);
  }

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
};
