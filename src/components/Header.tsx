import React, { useState } from 'react';
import { 
  Menu, 
  LogOut, 
  ShieldCheck, 
  Shield, 
  Box, 
  Eye, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Building2, 
  UserCheck 
} from 'lucide-react';
import { useStock } from '../context/StockContext';
import { TabType, UserRole } from '../types';
import logoApp from '../../Logos/logo.png';
import logoVivo from '../../Logos/logovivo.png';

interface HeaderProps {
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
  onNavigateUsers?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isCollapsed,
  onNavigateUsers,
  onLogout
}) => {
  const { 
    currentUser, 
    currentUserId, 
    setCurrentUserId, 
    users, 
    locations,
    logout
  } = useStock();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
    logout();
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-[#660099] border border-purple-200">
            <Shield className="w-3 h-3 text-[#660099]" />
            Admin
          </span>
        );
      case 'CONTROLLER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
            <Box className="w-3 h-3 text-blue-700" />
            Controlador
          </span>
        );
      case 'VIEWER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300">
            <Eye className="w-3 h-3 text-slate-600" />
            Visualizador
          </span>
        );
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-[#4a0072] to-[#660099] border-b border-purple-900 sticky top-0 z-30 shadow-md h-16">
        <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between">
          
          {/* Left Side: Sidebar Toggle (Mobile) & Logos */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Sidebar toggle button */}
            <button
              id="header-toggle-sidebar-btn"
              onClick={onToggleSidebar}
              className="lg:hidden w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer border border-white/10"
              title="Alternar Menu Lateral"
              aria-label="Abrir ou recolher menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logos */}
            <div className="flex items-center gap-4">
              <img src={logoApp} alt="Logo App" className="h-10 w-auto brightness-0 invert object-contain" />
              <div className="h-6 w-[1.5px] bg-white/30 hidden sm:block" />
              <img src={logoVivo} alt="Logo Vivo" className="h-6 w-auto brightness-0 invert object-contain hidden sm:block" />
            </div>
          </div>

          {/* Right Side: Sair (Logout) Button Only */}
          <div className="flex items-center">
            {/* Logout Button */}
            <button
              id="header-logout-btn"
              onClick={() => setShowLogoutModal(true)}
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white/10 hover:bg-rose-500 hover:text-white text-white/90 transition-all shadow-sm active:scale-95 cursor-pointer border border-white/10"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#660099] flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-[#660099]" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Encerrar Sessão no Vivo EPI Control
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Deseja realmente sair do sistema? Seus dados permanecem seguros no seu navegador.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                id="cancel-logout-btn"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="confirm-logout-btn"
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#660099] hover:bg-[#52007a] rounded-xl shadow-md shadow-purple-950/20 transition-all active:scale-95 cursor-pointer"
              >
                Confirmar Saída
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
