import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { InteractiveDemo } from './components/InteractiveDemo';
import { ArchitectureView } from './components/ArchitectureView';
import { ApiDocsView } from './components/ApiDocsView';
import { RoleSimulator } from './components/RoleSimulator';
import { Footer } from './components/Footer';
import { mockMaterials, mockUsers } from './data/mockData';
import type { UserProfile } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'architecture' | 'api-docs'>('landing');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openLoginModal={() => setIsRoleModalOpen(true)}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <>
            <HeroSection
              materials={mockMaterials}
              onOpenDemo={() => setActiveTab('dashboard')}
              onOpenApiDocs={() => setActiveTab('api-docs')}
            />
            <FeaturesSection />
            <ArchitectureView />
          </>
        )}

        {activeTab === 'dashboard' && (
          <InteractiveDemo />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

        {activeTab === 'api-docs' && (
          <ApiDocsView />
        )}
      </main>

      {/* Role & Auth Simulator Modal */}
      <RoleSimulator
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
