import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { MobileNavigation } from './components/MobileNavigation';
import { ToastContainer } from './components/Toast';
import { LevelUpModal } from './components/LevelUpModal';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { CharacterPage } from './pages/CharacterPage';
import { ShopPage } from './pages/ShopPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLandingOrAuth = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Container */}
      <main className={`flex-1 ${isLandingOrAuth ? '' : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12'}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation />

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <LevelUpModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication Pages (Redirect to /dashboard if already signed in) */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <SignupPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Protected Game Pages */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quests"
                element={
                  <ProtectedRoute>
                    <QuestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/character"
                element={
                  <ProtectedRoute>
                    <CharacterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop"
                element={
                  <ProtectedRoute>
                    <ShopPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <InventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <ProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={<AdminPortalPage />}
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}
