import React, { useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Building2,
  Warehouse,
  HardHat,
  Armchair,
  Boxes,
  ArrowUpRight, 
  ArrowDownLeft, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  Clock, 
  Plus, 
  ChevronRight,
  Shield,
  Zap,
  ArrowRight,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useStock } from '../context/StockContext';
import { TabType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

interface DashboardProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenNewItem: () => void;
  onOpenQuickBatch: () => void;
  onOpenDeliverKit: (kitId: string, locationId: string) => void;
}

const COLORS = ['#660099', '#9933CC', '#b266ff', '#d9b3ff', '#f2e6ff'];

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenNewItem,
  onOpenQuickBatch,
  onOpenDeliverKit,
}) => {
  const { 
    items, 
    locations, 
    kits, 
    movements, 
    selectedLocationId, 
    getAllKitsAvailability,
    getKitAvailabilityForLocation,
    currentUser,
    setSelectedLocationId,
    isCurrentUserAdmin,
    isCurrentUserController
  } = useStock();

  const userLocationIds = useMemo(() => currentUser?.locationIds || [], [currentUser]);
  const userName = useMemo(() => {
    const rawName = currentUser?.name || '';
    if (!rawName.trim()) return 'Usuário';
    return rawName.split(' ')[0] || 'Usuário';
  }, [currentUser]);

  // Filter items by active location
  const filteredItems = items.filter(item => 
    selectedLocationId === 'ALL' || item.locationId === selectedLocationId
  );

  const activeLocationName = selectedLocationId === 'ALL' 
    ? 'Todas as Localidades' 
    : locations.find(l => l.id === selectedLocationId)?.name || 'Localidade';

  // KPIs
  const totalUnits = filteredItems.reduce((acc, item) => acc + item.quantity, 0);
  const criticalItems = filteredItems.filter(item => item.quantity <= item.minQuantity);
  const zeroItems = filteredItems.filter(item => item.quantity === 0);

  const totalLocations = locations.length;
  const episCount = items.filter(item => item.category !== 'Ergonômico').length;
  const ergonomicsCount = items.filter(item => item.category === 'Ergonômico').length;

  // Kits reports for the selected location or first location
  const targetLocForKits = selectedLocationId === 'ALL' 
    ? (locations[0]?.id || '') 
    : selectedLocationId;

  const kitReports = kits.map(kit => {
    if (!targetLocForKits) return null;
    return getKitAvailabilityForLocation(kit.id, targetLocForKits);
  }).filter(Boolean);

  // Charts Data
  const topItemsByVolume = useMemo(() => {
    return [...filteredItems]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(i => {
        const rawName = i.name || '';
        return { 
          name: rawName.length > 20 ? rawName.substring(0, 20) + '...' : rawName, 
          quantity: i.quantity || 0 
        };
      });
  }, [filteredItems]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    filteredItems.forEach(i => {
      const cat = i.category || 'Outros';
      cats[cat] = (cats[cat] || 0) + (i.quantity || 0);
    });
    return Object.keys(cats)
      .map(k => ({ name: k, value: cats[k] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredItems]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Bem-vindo, {userName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#660099] border border-purple-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#660099] animate-pulse"></span>
              {activeLocationName}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 min-w-[200px] md:min-w-[280px]">
          <select
            id="dash-location-select"
            value={selectedLocationId}
            disabled={!userLocationIds.includes('ALL') && userLocationIds.length === 1}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className={`w-full text-sm font-semibold text-slate-800 bg-white border border-purple-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#660099] focus:outline-none cursor-pointer shadow-sm hover:border-[#660099] transition-all ${
              !userLocationIds.includes('ALL') && userLocationIds.length === 1 ? 'opacity-80 bg-slate-50 cursor-not-allowed' : ''
            }`}
          >
            {isCurrentUserAdmin || userLocationIds.includes('ALL') ? (
              <>
                <option value="ALL">🏢 Todas as Localidades ({locations.length})</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.name}
                  </option>
                ))}
              </>
            ) : (
              <>
                {userLocationIds.length > 1 && (
                  <option value="ALL">🏢 Todas as Suas Localidades</option>
                )}
                {locations.filter(l => userLocationIds.includes(l.id)).map(loc => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.name} (Seu Estoque)
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Locations */}
        <div className="bg-gradient-to-br from-[#660099] to-[#9933CC] rounded-2xl p-6 shadow-lg relative overflow-hidden text-white border border-purple-500/30 transition-transform hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Total de Estoques</span>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Warehouse className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-extrabold">{totalLocations}</span>
            <span className="text-sm font-medium text-purple-200">almoxarifados</span>
          </div>
        </div>

        {/* EPI's */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white border border-blue-500/30 transition-transform hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">EPI's Cadastrados</span>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <HardHat className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-extrabold">{episCount}</span>
            <span className="text-sm font-medium text-blue-200">itens</span>
          </div>
        </div>

        {/* Ergonomics */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white border border-emerald-500/30 transition-transform hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Ergonômicos</span>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Armchair className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-extrabold">{ergonomicsCount}</span>
            <span className="text-sm font-medium text-emerald-100">itens</span>
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white border border-amber-500/30 transition-transform hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Volumetria Total</span>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Boxes className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-extrabold">{totalUnits.toLocaleString('pt-BR')}</span>
            <span className="text-sm font-medium text-amber-100">unidades totais</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Items by Volume Chart */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#660099]" />
            <h2 className="text-lg font-bold text-slate-800">Ranking: Itens com Maior Saldo</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItemsByVolume} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="quantity" radius={[6, 6, 0, 0]} name="Quantidade">
                  {topItemsByVolume.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume by Category Chart */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-[#660099]" />
            <h2 className="text-lg font-bold text-slate-800">Volumetria por Categoria</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Unidades">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Critical Alerts & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Critical Stock */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-800">Estoque Crítico</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">
              {criticalItems.length} itens abaixo do mínimo
            </span>
          </div>

          {criticalItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Nenhum item em estado crítico!
            </div>
          ) : (
            <div className="space-y-3">
              {criticalItems.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">CA: {item.caNumber} • {item.category}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="font-mono font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded text-xs">
                      {item.quantity} {item.unit}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Mínimo: {item.minQuantity}</p>
                  </div>
                </div>
              ))}
              {criticalItems.length > 4 && (
                <button onClick={() => onNavigateTab('items')} className="w-full text-center text-xs font-bold text-[#660099] pt-2">
                  Ver todos os {criticalItems.length} itens
                </button>
              )}
            </div>
          )}
        </div>

        {/* Kits Automation Insight */}
        <div className="bg-gradient-to-br from-slate-900 via-[#26003b] to-slate-950 text-white rounded-2xl p-6 shadow-lg border border-purple-900/50 flex flex-col">
          <div className="flex items-center gap-3 border-b border-purple-900/60 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Disponibilidade de Kits
              </h2>
              <span className="text-[11px] text-purple-300">Análise Automática de Gargalo</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {kitReports.length === 0 ? (
              <div className="text-center py-6 text-purple-300/60">
                Nenhuma regra de kit configurada ou analisável nesta localidade.
              </div>
            ) : (
              <div className="space-y-4">
                {kitReports.slice(0, 3).map((report, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">{report.kitName}</h3>
                      {report.limitingItem ? (
                        <p className="text-[11px] text-amber-400 truncate flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" /> Gargalo: {report.limitingItem.itemName}
                        </p>
                      ) : (
                        <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Estoque balanceado
                        </p>
                      )}
                    </div>
                    <div className="text-center shrink-0">
                      <div className="text-2xl font-black text-purple-200">{report.maxCompleteKits}</div>
                      <div className="text-[9px] uppercase tracking-wider text-purple-400">Montáveis</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button onClick={() => onNavigateTab('kits')} className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">
            Gerenciar Composições de Kits
          </button>
        </div>

      </div>

    </div>
  );
};
