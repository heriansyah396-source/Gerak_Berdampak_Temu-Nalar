import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { HomeView } from './components/HomeView';
import { RootProblemsView } from './components/RootProblemsView';
import { GerakView } from './components/GerakView';
import { BerdampakView } from './components/BerdampakView';
import { LabSoalView } from './components/LabSoalView';
import { StrategiesView } from './components/StrategiesView';
import { ReflectionView } from './components/ReflectionView';
import { RtlView } from './components/RtlView';
import { ImpactDashboardView } from './components/ImpactDashboardView';
import { PrintModal } from './components/PrintModal';
import { HelpModal } from './components/HelpModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { AuthProvider } from './context/AuthContext';
import { initializeStorage } from './utils/storage';

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('beranda');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printTargetSchool, setPrintTargetSchool] = useState<string>('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  const handleOpenPrintModal = (schoolName?: unknown) => {
    if (typeof schoolName === 'string' && schoolName.trim() !== '') {
      setPrintTargetSchool(schoolName);
    } else {
      setPrintTargetSchool('');
    }
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setPrintTargetSchool('');
  };

  // Initialize storage with defaults on initial render
  useEffect(() => {
    initializeStorage();
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleNavigate = (tab: NavTab) => {
    setCurrentTab(tab);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar for Desktop */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        onOpenPrintModal={handleOpenPrintModal}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onResetData={() => window.location.reload()}
      />

      {/* Main Content Area */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenPrintModal={handleOpenPrintModal}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentTab === 'beranda' && (
            <HomeView onNavigate={handleNavigate} onOpenPrintModal={handleOpenPrintModal} />
          )}

          {currentTab === 'akar-masalah' && (
            <RootProblemsView onNavigate={handleNavigate} />
          )}

          {currentTab === 'alur-gerak' && (
            <GerakView onNavigate={handleNavigate} />
          )}

          {currentTab === 'siklus-berdampak' && (
            <BerdampakView onNavigate={handleNavigate} />
          )}

          {currentTab === 'laboratorium-soal' && (
            <LabSoalView onNavigate={handleNavigate} />
          )}

          {currentTab === 'strategi-pembelajaran' && (
            <StrategiesView onNavigate={handleNavigate} />
          )}

          {currentTab === 'instrumen-refleksi' && (
            <ReflectionView onNavigate={handleNavigate} />
          )}

          {currentTab === 'rencana-tindak-lanjut' && (
            <RtlView onNavigate={handleNavigate} onOpenPrintModal={handleOpenPrintModal} />
          )}

          {currentTab === 'dashboard-dampak' && (
            <ImpactDashboardView onNavigate={handleNavigate} onOpenPrintModal={handleOpenPrintModal} />
          )}
        </main>

        {/* Footer */}
        <footer className="p-6 bg-white border-t border-slate-200 text-xs text-slate-500 text-center space-y-1">
          <div>
            <strong>GERAK BERDAMPAK: Temu Nalar Literasi-Numerasi</strong> • Pendampingan Pengawas Sekolah
          </div>
          <div>
            Wilayah Dampingan: Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang • Pengembang: Heriansyah., S.Si., S.Pd., M.Pd
          </div>
        </footer>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        onOpenPrintModal={handleOpenPrintModal}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onResetData={() => window.location.reload()}
      />

      {/* Print Document Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={handleClosePrintModal}
        defaultSchool={printTargetSchool}
      />

      {/* Backup & Restore Data Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataChanged={() => window.location.reload()}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
