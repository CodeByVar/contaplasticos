import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPrincipal } from './components/DashboardPrincipal';
import { RawMaterialsView } from './components/RawMaterialsView';
import { BatchEntriesView } from './components/BatchEntriesView';
import { ProductionOrdersView } from './components/ProductionOrdersView';
import { ScrapControlView } from './components/ScrapControlView';
import { SuppliersView } from './components/SuppliersView';
import { ReportsView } from './components/ReportsView';
import { UsersConfigView } from './components/UsersConfigView';
import { RoleSimulator } from './components/RoleSimulator';
import { InteractiveDemo } from './components/InteractiveDemo';
import { mockUsers } from './data/mockData';
import { apiConfig } from './services/api';
import type { UserProfile } from './types';
import { Menu, X, Shield, Activity, RefreshCw } from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isApiOnline, setIsApiOnline] = useState<boolean>(false);
  const [isCheckingApi, setIsCheckingApi] = useState<boolean>(false);

  const checkBackendStatus = async () => {
    setIsCheckingApi(true);
    const status = await apiConfig.checkHealth();
    setIsApiOnline(status.online);
    setIsCheckingApi(false);
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 15000); // Check cada 15 segs
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          currentUser={currentUser}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-slate-950 shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <span className="font-bold text-white text-sm">Menú de Navegación</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              activeSection={activeSection}
              setActiveSection={(s) => {
                setActiveSection(s);
                setIsMobileMenuOpen(false);
              }}
              currentUser={currentUser}
              onOpenRoleModal={() => {
                setIsRoleModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">Plataforma ERP /</span>
              <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wide">
                {activeSection === 'dashboard' ? 'Dashboard Principal (Punto 3)' : activeSection.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* API Status Badge */}
            <button
              onClick={checkBackendStatus}
              title={`API Backend NestJS: ${isApiOnline ? 'En Vivo (Conectado :3000)' : 'Modo Mock / Offline'}. Clic para verificar.`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                isApiOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Activity className={`w-3 h-3 ${isApiOnline ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span className="hidden sm:inline font-bold">
                {isApiOnline ? 'API REST: Live :3000' : 'API: Modo Mock'}
              </span>
              <RefreshCw className={`w-2.5 h-2.5 ml-0.5 ${isCheckingApi ? 'animate-spin' : 'opacity-60'}`} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Persona 2 (Web)</span>
            </div>

            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rol:</span>
              <span>{currentUser.role}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeSection === 'dashboard' && (
            <DashboardPrincipal
              currentUser={currentUser}
              onOpenRoleModal={() => setIsRoleModalOpen(true)}
              onNavigateSection={(sec) => setActiveSection(sec)}
            />
          )}

          {(activeSection === 'materias-primas' || activeSection === 'inventario' || activeSection === 'lotes') && (
            <RawMaterialsView />
          )}

          {(activeSection === 'registrar-materia' || activeSection === 'entradas') && (
            <BatchEntriesView />
          )}

          {(activeSection === 'salidas' || activeSection === 'produccion' || activeSection === 'ordenes' || activeSection === 'consumo') && (
            <ProductionOrdersView />
          )}

          {activeSection === 'merma' && (
            <ScrapControlView />
          )}

          {activeSection === 'proveedores' && (
            <SuppliersView />
          )}

          {(activeSection === 'reportes' || activeSection === 'movimientos') && (
            <ReportsView />
          )}

          {(activeSection === 'usuarios' || activeSection === 'configuracion') && (
            <UsersConfigView />
          )}

          {/* Demo interactiva general de apoyo */}
          {activeSection === 'demo-interactiva' && (
            <InteractiveDemo />
          )}
        </main>
      </div>

      {/* Role & Auth Simulator Modal */}
      <RoleSimulator
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

    </div>
  );
}

export default App;
