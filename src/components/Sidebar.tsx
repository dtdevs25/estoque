import React, { useState } from 'react';
import { 
  BarChart3,
  HardHat,
  Armchair,
  ArrowRightLeft,
  Boxes,
  Warehouse,
  UserCog,
  MapPin, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Shield,
  Box,
  Eye,
  Settings,
  Lock
} from 'lucide-react';
import { useStock } from '../context/StockContext';
import { TabType, UserRole } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenQuickBatchModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onOpenQuickBatchModal
}) => {
  const { 
    locations, 
    selectedLocationId, 
    setSelectedLocationId, 
    items,
    users,
    currentUser,
    setCurrentUserId,
    isCurrentUserAdmin,
    isCurrentUserController,
    isCurrentUserViewer,
    userAccessibleLocations,
    exportBackupJSON,
    importBackupJSON,
    resetToDefaultData
  } = useStock();

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);

  // Critical stock count
  const criticalItemsCount = items.filter(i => {
    const isLocMatch = selectedLocationId === 'ALL' || i.locationId === selectedLocationId;
    return isLocMatch && i.quantity <= i.minQuantity;
  }).length;

  const topMenuItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: BarChart3,
      badge: null,
      description: 'Visão executiva e KPIs'
    },
    {
      id: 'movements' as TabType,
      label: 'Movimentações',
      icon: ArrowRightLeft,
      badge: null,
      description: 'Entradas e saídas'
    }
  ];

  const registrationsMenuItems = [
    {
      id: 'items' as TabType,
      label: 'EPI\'s e EPC\'s',
      icon: HardHat,
      badge: criticalItemsCount > 0 ? (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
          {criticalItemsCount}
        </span>
      ) : null,
      description: 'Catálogo e saldos'
    },
    {
      id: 'ergonomics' as TabType,
      label: 'Ergonômicos',
      icon: Armchair,
      badge: null,
      description: 'Itens ergonômicos'
    },
    {
      id: 'kits' as TabType,
      label: 'Kits',
      icon: Boxes,
      badge: null,
      description: 'Análise de disponibilidade'
    }
  ];

  const adminMenuItems = [
    {
      id: 'locations' as TabType,
      label: 'Almoxarifados',
      icon: Warehouse,
      badge: (
        <span className="text-[11px] text-slate-400 font-medium">
          {locations.length}
        </span>
      ),
      description: 'Obras e estoques locais'
    },
    {
      id: 'users' as TabType,
      label: 'Usuários & Acessos',
      icon: UserCog,
      badge: (
        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-[#660099]">
          {users.length}
        </span>
      ),
      description: 'Perfis e vínculo de estoque'
    }
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const getUserRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3 h-3 text-[#660099]" />;
      case 'CONTROLLER':
        return <Box className="w-3 h-3 text-blue-600" />;
      case 'VIEWER':
        return <Eye className="w-3 h-3 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-16 bottom-0 left-0 z-40 bg-white border-r border-slate-200 shadow-sm flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Setinha Lateral (Arrow Toggle Button attached directly on the side of menu for desktop & mobile) */}
        <button
          id="sidebar-side-arrow-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-4 top-5 z-50 w-8 h-8 bg-[#660099] hover:bg-[#52007a] text-white border-2 border-white shadow-lg shadow-purple-950/30 rounded-full items-center justify-center cursor-pointer transition-all duration-200 hover:scale-115 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#660099]/40 group"
          title={isCollapsed ? "Clique na setinha para abrir o menu lateral" : "Clique na setinha para fechar o menu lateral"}
          aria-label="Abrir ou fechar menu lateral"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="w-4 h-4 stroke-[3] transition-transform group-hover:-translate-x-0.5" />
          )}
        </button>


        {/* Setinha para fechar no Mobile */}
        {isMobileOpen && (
          <button
            id="sidebar-mobile-close-arrow"
            onClick={() => setIsMobileOpen(false)}
            className="flex lg:hidden absolute -right-3.5 top-4 z-50 w-7 h-7 bg-[#660099] text-white border border-white shadow-md rounded-full items-center justify-center cursor-pointer active:scale-90"
            title="Fechar menu lateral"
            aria-label="Fechar menu lateral"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
        )}

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto scrollbar-thin">
          {topMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                className={`w-full group flex items-center rounded-xl transition-all duration-150 cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3 justify-between'
                } ${
                  isActive
                    ? 'bg-[#660099] text-white shadow-sm font-semibold shadow-purple-900/20'
                    : 'text-slate-600 hover:bg-purple-50 hover:text-[#660099] font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#660099]'
                  }`} />
                  
                  {!isCollapsed && (
                    <span className="text-sm truncate">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <div className="shrink-0 ml-auto">
                    {item.badge}
                  </div>
                )}
              </button>
            );
          })}

          {/* Cadastros Accordion */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setIsCadastrosOpen(!isCadastrosOpen);
              }}
              title={isCollapsed ? "Cadastros" : undefined}
              className={`w-full group flex items-center rounded-xl transition-all duration-150 cursor-pointer ${
                isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3 justify-between'
              } text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-bold uppercase tracking-wider text-[10px]`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Boxes className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Cadastros</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-3 h-3 transition-transform ${isCadastrosOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {(!isCollapsed && isCadastrosOpen) && (
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-purple-50 ml-5 py-1">
                {registrationsMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full group flex items-center rounded-lg transition-all duration-150 cursor-pointer px-3 py-2 gap-3 justify-between ${
                        isActive
                          ? 'bg-purple-50 text-[#660099] font-bold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#660099]' : 'text-slate-400 group-hover:text-slate-600'
                        }`} />
                        <span className="text-xs truncate">{item.label}</span>
                      </div>
                      {item.badge && <div className="shrink-0 ml-auto">{item.badge}</div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Administração Accordion */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                setIsAdminOpen(!isAdminOpen);
              }}
              title={isCollapsed ? "Administração" : undefined}
              className={`w-full group flex items-center rounded-xl transition-all duration-150 cursor-pointer ${
                isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3 justify-between'
              } text-slate-600 hover:bg-purple-50 hover:text-[#660099] font-medium`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Settings className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-[#660099] transition-transform group-hover:scale-105" />
                {!isCollapsed && <span className="text-sm truncate">Administração</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {(!isCollapsed && isAdminOpen) && (
              <div className="mt-1 pl-4 space-y-1 relative before:absolute before:left-[21px] before:top-0 before:bottom-0 before:w-[1.5px] before:bg-purple-100">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-purple-50 text-[#660099] font-semibold'
                          : 'text-slate-600 hover:bg-purple-50 hover:text-[#660099] font-medium'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#660099]' : 'text-slate-400'}`} />
                      <span className="text-sm truncate">{item.label}</span>
                      {item.badge && <div className="shrink-0 ml-auto scale-90">{item.badge}</div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* Bottom Panel: User Profile & Role + Backup & Data Settings */}
        <div className="p-2.5 border-t border-slate-200 bg-slate-50/70 space-y-2">
          
          {/* User Profile Card with Quick Switch Dropdown */}
          <div className="relative">
            {!isCollapsed ? (
              <div
                className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white border border-purple-100 shadow-2xs"
                title="Usuário atual"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  currentUser.role === 'ADMIN' 
                    ? 'bg-purple-100 text-[#660099]' 
                    : currentUser.role === 'CONTROLLER'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name || 'Usuário'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                    {getUserRoleIcon(currentUser.role)}
                    <span>
                      {currentUser.role === 'ADMIN' ? 'Administrador' : currentUser.role === 'CONTROLLER' ? 'Controlador' : 'Visualizador'}
                    </span>
                  </div>
                </div>

                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Sessão Ativa" />
              </div>
            ) : (
              <div
                className="w-full flex justify-center p-2 rounded-xl bg-white border border-purple-100 text-[#660099] font-bold text-xs"
                title={`Usuário: ${currentUser?.name || 'Usuário'} (${currentUser.role})`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentUser.role === 'ADMIN' 
                    ? 'bg-purple-100 text-[#660099]' 
                    : currentUser.role === 'CONTROLLER'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>





        </div>
      </aside>
    </>
  );
};
