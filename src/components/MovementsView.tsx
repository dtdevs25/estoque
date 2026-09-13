import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardList, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  User, 
  FileSpreadsheet, 
  Clock,
  Filter,
  PlusCircle,
  PackageCheck
} from 'lucide-react';
import { useStock } from '../context/StockContext';
import { sharepoint } from '../services/api';
import { MovementType, BatchMovementEntry } from '../types';

interface BatchEntryItem {
  qty: number;
  qtyStr?: string;
  notes: string;
  type: MovementType;
}

export const MovementsView: React.FC = () => {
  const { 
    items, 
    locations, 
    movements, 
    selectedLocationId,
    registerBatchMovement,
    registerSingleMovement,
    currentUser,
    transferStock,
    adjustStock,
    setSelectedLocationId,
    refreshData,
    userAccessibleLocations,
    kits,
    findAllItemsForComponent
  } = useStock();

  const isViewer = currentUser?.role === 'VIEWER';
  const [activeSubTab, setActiveSubTab] = useState<'batch' | 'kit' | 'history'>(isViewer ? 'history' : 'batch');

  // ---- State for Batch / Daily Closing Mode ----
  
  const [batchCategoryFilter, setBatchCategoryFilter] = useState<'EPI_EPC' | 'ERGONOMICO'>('EPI_EPC');
  const [batchSearchQuery, setBatchSearchQuery] = useState<string>('');
  const [batchDate, setBatchDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [batchReason, setBatchReason] = useState('Entregas aos Colaboradores');
  const [batchEmployee, setBatchEmployee] = useState('Almoxarife Vivo');
  const [batchRole, setBatchRole] = useState('Equipe Técnica / Operacional');
  const [batchDestinationLocationId, setBatchDestinationLocationId] = useState('');
  const [batchDefaultType, setBatchDefaultType] = useState<MovementType>('SAIDA');
  const [batchAdjustMode, setBatchAdjustMode] = useState<'DELTA' | 'FINAL'>('DELTA');
  const [batchEntries, setBatchEntries] = useState<Record<string, BatchEntryItem>>({});
  const [batchSuccessMsg, setBatchSuccessMsg] = useState<string | null>(null);
  const [batchErrorMsg, setBatchErrorMsg] = useState<string | null>(null);

  // Auto-dismiss notification messages after 5 seconds
  useEffect(() => {
    if (batchErrorMsg) {
      const timer = setTimeout(() => setBatchErrorMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [batchErrorMsg]);

  useEffect(() => {
    if (batchSuccessMsg) {
      const timer = setTimeout(() => setBatchSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [batchSuccessMsg]);;

  // Items for batch location & category filter
  const batchLocationItems = useMemo(() => {
    return (items || []).filter(i => {
      if (!i) return false;
      // Location Filter
      const matchLoc = selectedLocationId === 'ALL' || !selectedLocationId || i.locationId === selectedLocationId || i.locationId === 'ALL';
      
      // Category Filter
      let matchCat = true;
      if (batchCategoryFilter === 'ERGONOMICO') {
        matchCat = i.type === 'ERGONOMICO' || (i.category || '').toLowerCase().includes('ergonômic') || (i.category || '').toLowerCase().includes('ergonomic');
      } else {
        matchCat = i.type !== 'ERGONOMICO' && !(i.category || '').toLowerCase().includes('ergonômic') && !(i.category || '').toLowerCase().includes('ergonomic');
      }

      // Search Query Filter
      const q = (batchSearchQuery || '').trim().toLowerCase();
      const matchSearch = !q || (i.name || '').toLowerCase().includes(q) || (i.caNumber || '').toLowerCase().includes(q);

      return matchLoc && matchCat && matchSearch;
    });
  }, [items, selectedLocationId, batchCategoryFilter, batchSearchQuery]);

  const handleBatchReasonChange = (newReason: string) => {
    setBatchReason(newReason);
    if (newReason === 'Ajuste de Estoque / Contagem Física') {
      const targetType: MovementType = 'AJUSTE';
      setBatchDefaultType(targetType);
      setBatchEntries(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] = {
            qty: 0,
            qtyStr: '',
            notes: next[key]?.notes || '',
            type: targetType,
          };
        });
        return next;
      });
    } else {
      const isEntrada = newReason.toLowerCase().includes('recebimento') || newReason.toLowerCase().includes('entrada');
      const targetType: MovementType = isEntrada ? 'ENTRADA' : 'SAIDA';
      
      setBatchDefaultType(targetType);
      setBatchEntries(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] = {
            ...next[key],
            type: targetType,
          };
        });
        return next;
      });
    }
  };

  const handleBatchQtyChange = (itemId: string, qtyStr: string) => {
    const val = parseInt(qtyStr, 10);
    const qty = isNaN(val) ? 0 : val;
    setBatchEntries(prev => ({
      ...prev,
      [itemId]: {
        qty,
        qtyStr,
        notes: prev[itemId]?.notes || '',
        type: prev[itemId]?.type || batchDefaultType,
      }
    }));
  };

  const handleBatchTypeChange = (itemId: string, type: MovementType) => {
    setBatchEntries(prev => {
      return {
        ...prev,
        [itemId]: {
          qty: 0,
          notes: prev[itemId]?.notes || '',
          type,
        }
      };
    });
  };

  const handleBatchNotesChange = (itemId: string, notes: string) => {
    setBatchEntries(prev => ({
      ...prev,
      [itemId]: {
        qty: prev[itemId]?.qty || 0,
        notes,
        type: prev[itemId]?.type || batchDefaultType,
      }
    }));
  };

  const handleClearBatchForm = () => {
    setBatchEntries({});
    setBatchSuccessMsg(null);
    setBatchErrorMsg(null);
  };

  // Active items being moved in batch
  const activeBatchEntries = useMemo(() => {
    return (Object.entries(batchEntries) as [string, BatchEntryItem][]).filter(([itemId, e]) => {
      const item = items.find(i => i.id === itemId);
      if (!item) return false;
      if (e.type === 'AJUSTE') {
        const rawStr = (e.qtyStr !== undefined ? e.qtyStr : (e.qty !== undefined ? String(e.qty) : '')).trim();
        const val = parseInt(rawStr, 10);
        if (isNaN(val) || rawStr === '') return false;

        if (batchAdjustMode === 'DELTA' || rawStr.startsWith('-') || rawStr.startsWith('+')) {
          return val !== 0;
        } else {
          return val !== item.quantity;
        }
      }
      return e.qty > 0;
    });
  }, [batchEntries, items, batchAdjustMode]);

  const activeBatchCount = activeBatchEntries.length;

  const activeBatchTotalUnits = activeBatchEntries.reduce((acc, [itemId, e]) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return acc;
    if (e.type === 'AJUSTE') {
      const rawStr = (e.qtyStr !== undefined ? e.qtyStr : (e.qty !== undefined ? String(e.qty) : '')).trim();
      const val = parseInt(rawStr, 10);
      if (isNaN(val) || rawStr === '') return acc;

      if (batchAdjustMode === 'DELTA' || rawStr.startsWith('-') || rawStr.startsWith('+')) {
        return acc + Math.abs(val);
      } else {
        return acc + Math.abs(val - item.quantity);
      }
    }
    return acc + e.qty;
  }, 0);

  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setBatchErrorMsg(null);
    setBatchSuccessMsg(null);

    if (batchReason === 'Movimentação de estoque' && !batchDestinationLocationId) {
      setBatchErrorMsg('Selecione para qual estoque os itens serão transferidos.');
      return;
    }

    const validEntries: BatchMovementEntry[] = [];

    for (const [itemId, data] of (Object.entries(batchEntries) as [string, BatchEntryItem][])) {
      const item = items.find(i => i.id === itemId);
      if (!item) continue;

      if (data.type === 'AJUSTE') {
        const rawStr = (data.qtyStr !== undefined ? data.qtyStr : (data.qty !== undefined ? String(data.qty) : '')).trim();
        const val = parseInt(rawStr, 10);
        if (!isNaN(val) && rawStr !== '') {
          let targetStock = item.quantity;
          if (batchAdjustMode === 'DELTA' || rawStr.startsWith('-') || rawStr.startsWith('+')) {
            targetStock = Math.max(0, item.quantity + val);
          } else {
            targetStock = Math.max(0, val);
          }

          if (targetStock !== item.quantity) {
            validEntries.push({
              itemId,
              quantity: Math.abs(targetStock - item.quantity),
              newQuantity: targetStock,
              type: 'AJUSTE',
              notes: data.notes,
            });
          }
        }
      } else if (data.qty > 0) {
        if (data.type === 'SAIDA' && data.qty > item.quantity) {
          setBatchErrorMsg(`Saldo insuficiente para o item "${item.name}". Disponível: ${item.quantity}, Solicitado: ${data.qty}.`);
          return;
        }

        validEntries.push({
          itemId,
          quantity: data.qty,
          type: data.type,
          notes: data.notes,
        });
      }
    }

    if (validEntries.length === 0) {
      setBatchErrorMsg('Insira ou altere a quantidade de pelo menos um EPI para lançar no lote.');
      return;
    }

    if (batchReason === 'Movimentação de estoque') {
      let count = 0;
      for (const entry of validEntries) {
        if (entry.type === 'SAIDA' && entry.quantity > 0) {
          await transferStock({
            itemId: entry.itemId,
            toLocationId: batchDestinationLocationId,
            quantity: entry.quantity,
            reason: 'Transferência em lote / Movimentação de Estoque',
            employeeName: currentUser.name
          });
          count++;
        }
      }
      setBatchSuccessMsg(`Sucesso! Foram transferidos ${count} itens.`);
      setBatchEntries({});
      setTimeout(() => setBatchSuccessMsg(null), 6000);
      return;
    }

    const res = await registerBatchMovement({
      locationId: selectedLocationId,
      entries: validEntries,
      reason: batchReason,
      employeeName: currentUser.name,
      employeeRole: batchRole,
      isDailyClosing: true,
      customDate: new Date(batchDate + 'T18:00:00').toISOString(),
    });

    if (res.success) {
      setBatchSuccessMsg(`Sucesso! Foram registradas ${res.count} movimentações. Sincronizando com SharePoint...`);
      setBatchEntries({});
      
      // Auto-trigger SharePoint sync in the background
      try {
        const locationCodes = selectedLocationId === 'ALL' 
          ? locations.filter(l => l.code.startsWith('SPO-')).map(l => l.code)
          : [locations.find(l => l.id === selectedLocationId)?.code].filter(Boolean) as string[];
        
        await sharepoint.push(locationCodes.length ? locationCodes : undefined);
        setBatchSuccessMsg(`Sucesso! Movimentações registradas e planilha SharePoint atualizada com os novos saldos.`);
      } catch (err) {
        console.error('Erro na sincronização automática:', err);
        setBatchSuccessMsg(`Sucesso! Movimentações registradas. (Aviso: A planilha SharePoint será atualizada automaticamente na próxima janela programada).`);
      }

      setTimeout(() => setBatchSuccessMsg(null), 8000);
    } else {
      setBatchErrorMsg(res.error || 'Erro ao processar lote.');
    }
  };

  // ---- State for Kit / Por Kit Mode ----
  const [kitSelectedId, setKitSelectedId] = useState<string>('');
  const [kitQuantity, setKitQuantity] = useState<number>(1);
  const [kitReason, setKitReason] = useState<string>('Entrega de Kit (NR-6)');
  const [kitEmployeeName, setKitEmployeeName] = useState<string>('');
  const [kitEmployeeRole, setKitEmployeeRole] = useState<string>('');
  const [kitEmployeeReg, setKitEmployeeReg] = useState<string>('');
  const [kitNotes, setKitNotes] = useState<string>('');
  const [kitSuccessMsg, setKitSuccessMsg] = useState<string | null>(null);
  const [kitErrorMsg, setKitErrorMsg] = useState<string | null>(null);
  const [kitEntries, setKitEntries] = useState<Record<number, { selectedItemId: string, quantity: number }>>({});

  useEffect(() => {
    if (kitErrorMsg) {
      const timer = setTimeout(() => setKitErrorMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [kitErrorMsg]);

  useEffect(() => {
    if (kitSuccessMsg) {
      const timer = setTimeout(() => setKitSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [kitSuccessMsg]);

  const selectedKit = useMemo(() => kits.find(k => k.id === kitSelectedId), [kits, kitSelectedId]);

  // When kit or kit quantity changes, recalculate default entries
  useEffect(() => {
    if (!selectedKit) {
      setKitEntries({});
      return;
    }
    const newEntries: Record<number, { selectedItemId: string, quantity: number }> = {};
    selectedKit.components.forEach((comp, idx) => {
      const matchingItems = findAllItemsForComponent(comp.itemId, comp.itemName, selectedLocationId);
      const defaultItem = matchingItems.length > 0 ? matchingItems[0].id : '';
      newEntries[idx] = {
        selectedItemId: defaultItem,
        quantity: comp.requiredQuantity * kitQuantity
      };
    });
    setKitEntries(newEntries);
  }, [selectedKit, kitQuantity, selectedLocationId]);

  const handleSubmitKit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKitErrorMsg(null);
    setKitSuccessMsg(null);

    if (!selectedKit) {
      setKitErrorMsg('Selecione um Kit.');
      return;
    }

    if (!selectedLocationId || selectedLocationId === 'ALL') {
      setKitErrorMsg('Selecione um Almoxarifado.');
      return;
    }

    const batchEntries = [];
    for (let i = 0; i < selectedKit.components.length; i++) {
      const entry = kitEntries[i];
      if (!entry) continue;
      if (!entry.selectedItemId) {
        setKitErrorMsg(`Nenhum item válido selecionado para o componente "${selectedKit.components[i].itemName}".`);
        return;
      }
      if (entry.quantity > 0) {
        batchEntries.push({
          itemId: entry.selectedItemId,
          quantity: entry.quantity,
          type: 'ENTREGA_KIT' as const,
          notes: kitNotes
        });
      }
    }

    if (batchEntries.length === 0) {
      setKitErrorMsg('Nenhum item para registrar entrega (todas as quantidades estão zeradas).');
      return;
    }

    const res = await registerBatchMovement({
      locationId: selectedLocationId,
      entries: batchEntries,
      reason: kitReason,
      employeeName: kitEmployeeName,
      employeeRole: kitEmployeeRole,
      employeeRegistration: kitEmployeeReg,
      notes: kitNotes,
      isDailyClosing: false
    });

    if (res.success) {
      setKitSuccessMsg(`Entrega de ${kitQuantity}x "${selectedKit.name}" registrada com sucesso!`);
      setKitQuantity(1);
      setKitNotes('');
    } else {
      setKitErrorMsg(res.error || 'Erro ao registrar entrega de kit.');
    }
  };

  // ---- State for History & Filters ----
  const [historySearch, setHistorySearch] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('ALL');
  

  const filteredHistory = useMemo(() => {
    return movements.filter(m => {
      if (selectedLocationId !== 'ALL' && m.locationId !== selectedLocationId) return false;
      if (historyTypeFilter !== 'ALL' && m.type !== historyTypeFilter) return false;

      if (historySearch.trim() !== '') {
        const q = historySearch.toLowerCase();
        const matchItem = m.itemName.toLowerCase().includes(q);
        const matchCa = m.itemCa.toLowerCase().includes(q);
        const matchEmp = (m.employeeName || '').toLowerCase().includes(q);
        const matchReason = (m.reason || '').toLowerCase().includes(q);
        const matchNotes = (m.notes || '').toLowerCase().includes(q);
        if (!matchItem && !matchCa && !matchEmp && !matchReason && !matchNotes) return false;
      }
      return true;
    });
  }, [movements, selectedLocationId, historyTypeFilter, historySearch]);

  const handleExportCSV = () => {
    const headers = ['Data/Hora', 'Tipo', 'EPI', 'CA', 'Localidade', 'Qtd', 'Saldo Anterior', 'Saldo Atual', 'Motivo', 'Colaborador/Responsavel', 'Observacoes'];
    const rows = filteredHistory.map(m => [
      `"${new Date(m.createdAt).toLocaleString('pt-BR')}"`,
      `"${m.type}"`,
      `"${m.itemName.replace(/"/g, '""')}"`,
      `"${m.itemCa}"`,
      `"${m.locationName.replace(/"/g, '""')}"`,
      m.quantity,
      m.previousStock,
      m.currentStock,
      `"${(m.reason || '').replace(/"/g, '""')}"`,
      `"${(m.employeeName || '').replace(/"/g, '""')}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vivo-extrato-movimentacoes-epi-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Entregas & Movimentações
          </h1>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex bg-[#FAF7FC] p-1.5 rounded-xl border border-purple-100 text-xs sm:text-sm font-semibold">

          {!isViewer && (
            <>
              <button
                id="subtab-batch"
                onClick={() => setActiveSubTab('batch')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  activeSubTab === 'batch'
                    ? 'bg-[#660099] text-white shadow-sm shadow-purple-950/20'
                    : 'text-slate-600 hover:text-[#660099]'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Em Lote</span>
              </button>

              <button
                id="subtab-kit"
                onClick={() => setActiveSubTab('kit')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  activeSubTab === 'kit'
                    ? 'bg-[#660099] text-white shadow-sm shadow-purple-950/20'
                    : 'text-slate-600 hover:text-[#660099]'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Por Kit</span>
              </button>
            </>
          )}

          <button
            id="subtab-history"
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeSubTab === 'history'
                ? 'bg-[#660099] text-white shadow-sm shadow-purple-950/20'
                : 'text-slate-600 hover:text-[#660099]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Histórico</span>
          </button>
        </div>
      </div>



      {/* ========================================================================= */}
      {/* 1. MODO DIÁRIO / LOTE (CONSOLIDADO DO ALMOXARIFE)                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'batch' && (
        <div className="space-y-5">

          {batchSuccessMsg && (
            <div className="p-4 bg-purple-50 border border-purple-200 text-[#660099] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#660099] shrink-0" />
              <span>{batchSuccessMsg}</span>
            </div>
          )}

          {batchErrorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{batchErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitBatch} className="space-y-5 pb-24">
            
            {/* Header Configuration Box */}
            <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-purple-50 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#660099]" />
                Configurações da Sessão de Fechamento Vivo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
                
                {/* Location select */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Localidade / Almoxarifado *</label>
                  <select
                    id="batch-location-select"
                    value={selectedLocationId}
                    onChange={(e) => {
                      setSelectedLocationId(e.target.value);
                      setBatchEntries({});
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                    required
                  >
                    <option value="" disabled selected={selectedLocationId === 'ALL'}>
                      Selecione um almoxarifado...
                    </option>
                    {(userAccessibleLocations || []).map(loc => (
                      <option key={loc.id} value={loc.id}>
                        📍 {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Data de Referência</label>
                  <input
                    id="batch-date-input"
                    type="date"
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Motivo / Tipo de Operação</label>
                  <select
                    id="batch-reason-input"
                    value={batchReason}
                    onChange={(e) => handleBatchReasonChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  >
                    <option value="Entregas aos Colaboradores">Entregas aos Colaboradores (Saída)</option>
                    <option value="Recebimento de material">Recebimento de material (Entrada)</option>
                    <option value="Ajuste de Estoque / Contagem Física">Ajuste de Estoque / Contagem Física</option>
                    <option value="Movimentação de estoque">Movimentação de estoque (Saída/Transferência)</option>
                  </select>
                </div>

                {/* Default Type */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Tipo (Aplicar a todos)</label>
                  <select
                    value={batchDefaultType}
                    onChange={(e) => {
                      const newType = e.target.value as MovementType;
                      setBatchDefaultType(newType);
                      setBatchEntries(prev => {
                        const next = { ...prev };
                        Object.keys(next).forEach(key => {
                          next[key] = {
                            qty: 0,
                            qtyStr: '',
                            notes: next[key]?.notes || '',
                            type: newType,
                          };
                        });
                        return next;
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  >
                    <option value="SAIDA">Saída</option>
                    <option value="ENTRADA">Entrada</option>
                    <option value="AJUSTE">Ajuste de Estoque</option>
                  </select>
                </div>

              </div>

              {(batchReason === 'Ajuste de Estoque / Contagem Física' || batchDefaultType === 'AJUSTE') && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-purple-50 p-2.5 rounded-xl border border-purple-100 mt-2 text-xs">
                  <span className="font-bold text-[#660099]">Modo do Ajuste em Lote:</span>
                  <div className="flex flex-wrap bg-white p-0.5 rounded-lg border border-purple-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setBatchAdjustMode('DELTA')}
                      className={`px-3 py-1 rounded-md transition-all font-semibold ${
                        batchAdjustMode === 'DELTA' ? 'bg-[#660099] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-[#660099]'
                      }`}
                    >
                      📊 Variação (+ / -) (ex: -2 ou +5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchAdjustMode('FINAL')}
                      className={`px-3 py-1 rounded-md transition-all font-semibold ${
                        batchAdjustMode === 'FINAL' ? 'bg-[#660099] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-[#660099]'
                      }`}
                    >
                      🔢 Saldo Final Apurado (ex: 40)
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-purple-50">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Responsável pela Movimentação</label>
                  <input
                    type="text"
                    value={currentUser?.name || ''}
                    disabled
                    className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                </div>
                {batchReason === 'Movimentação de estoque' ? (
                  <div>
                    <label className="block text-[#660099] font-bold mb-1">Para qual estoque vai? *</label>
                    <select
                      value={batchDestinationLocationId}
                      onChange={(e) => setBatchDestinationLocationId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-[#660099] font-semibold focus:ring-2 focus:ring-[#660099] focus:outline-none"
                    >
                      <option value="">Selecione o destino...</option>
                      {(locations || []).filter(l => l.id !== selectedLocationId).map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Setor / Equipe Beneficiária</label>
                    <input
                      type="text"
                      value={batchRole}
                      onChange={(e) => setBatchRole(e.target.value)}
                      placeholder="Ex: Equipe de Fibra Óptica & Campo"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Fast Batch Entry Table */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-purple-100 bg-[#FAF7FC] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Itens ({selectedLocationId === 'ALL' || !selectedLocationId ? '0' : batchLocationItems.length})
                  </h3>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setBatchCategoryFilter('EPI_EPC')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        batchCategoryFilter === 'EPI_EPC' ? 'bg-white text-[#660099] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      EPI / EPC
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchCategoryFilter('ERGONOMICO')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        batchCategoryFilter === 'ERGONOMICO' ? 'bg-white text-[#660099] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ergonômicos
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Buscar por nome ou C.A..."
                    value={batchSearchQuery}
                    onChange={(e) => setBatchSearchQuery(e.target.value)}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs w-44 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleClearBatchForm}
                    title="Limpar formulário"
                    aria-label="Limpar formulário"
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedLocationId === 'ALL' || !selectedLocationId ? (
                <div className="p-8 text-center text-rose-600 font-bold text-sm bg-rose-50 m-4 rounded-xl border border-rose-200 shadow-sm">
                  ⚠️ Por favor, selecione um almoxarifado específico nas configurações acima. Não é possível fazer lançamento em lote para todos os estoques simultaneamente.
                </div>
              ) : batchLocationItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum EPI cadastrado neste almoxarifado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                        <th className="py-2 px-2 w-10 text-center">Foto</th>
                        <th className="py-2 px-2">EPI & CA</th>
                        <th className="py-2 px-2 hidden sm:table-cell">Categoria</th>
                        <th className="py-2 px-2 text-center">Saldo</th>
                        <th className="py-2 px-2 w-24 text-center">Tipo</th>
                        <th className="py-2 px-2 w-28 text-center bg-purple-50/70 text-[#660099]">
                          {batchDefaultType === 'AJUSTE' ? (batchAdjustMode === 'DELTA' ? '(+/-)' : 'Nova') : 'QTD'}
                        </th>
                        <th className="py-2 px-2 text-center hidden sm:table-cell">Novo Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {batchLocationItems.map(item => {
                        const rawEntry = batchEntries[item.id];
                        const entryType = rawEntry?.type || batchDefaultType;
                        const isAjuste = entryType === 'AJUSTE';
                        
                        let projectedStock = item.quantity;
                        let isMoved = false;
                        let isInvalid = false;
                        let diff = 0;

                        if (isAjuste) {
                          const rawStr = (rawEntry?.qtyStr !== undefined ? rawEntry.qtyStr : (rawEntry?.qty !== undefined ? String(rawEntry.qty) : '')).trim();
                          const val = parseInt(rawStr, 10);
                          const hasValue = !isNaN(val) && rawStr !== '';

                          if (hasValue) {
                            if (batchAdjustMode === 'DELTA' || rawStr.startsWith('-') || rawStr.startsWith('+')) {
                              projectedStock = Math.max(0, item.quantity + val);
                              diff = val;
                            } else {
                              projectedStock = Math.max(0, val);
                              diff = projectedStock - item.quantity;
                            }
                            isMoved = diff !== 0;
                          } else {
                            projectedStock = item.quantity;
                            diff = 0;
                            isMoved = false;
                          }
                          isInvalid = projectedStock < 0;
                        } else {
                          const qty = rawEntry?.qty || 0;
                          const isOut = entryType === 'SAIDA';
                          projectedStock = isOut ? item.quantity - qty : item.quantity + qty;
                          isMoved = qty > 0;
                          isInvalid = isOut && projectedStock < 0;
                          diff = isOut ? -qty : qty;
                        }

                        return (
                          <tr 
                            key={item.id} 
                            className={`transition-colors ${
                              isMoved ? 'bg-purple-50/50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2 px-2 text-center">
                              <img 
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=150'} 
                                alt={item.name} 
                                className="w-8 h-8 rounded-full object-cover border border-purple-100 mx-auto" 
                              />
                            </td>
                            <td className="py-2 px-2 max-w-[120px] sm:max-w-none truncate">
                              <div className="font-bold text-slate-900 truncate" title={item.name}>{item.name}</div>
                              <div className="text-[9px] text-slate-400 font-mono truncate">CA {item.caNumber} • {item.brand || 'Vivo'}</div>
                            </td>

                            <td className="py-2 px-2 text-slate-500 text-[10px] hidden sm:table-cell truncate max-w-[100px]" title={item.category}>
                              {item.category.substring(0, 15)}{item.category.length > 15 ? '...' : ''}
                            </td>

                            <td className="py-2 px-2 text-center font-mono font-bold text-slate-800">
                              {item.quantity}
                              <span className="text-[9px] text-slate-500 ml-0.5">{item.unit}</span>
                            </td>

                            <td className="py-2 px-1 text-center">
                              <select
                                value={entryType}
                                onChange={(e) => handleBatchTypeChange(item.id, e.target.value as MovementType)}
                                className={`text-[10px] font-semibold px-1 py-1 w-full max-w-[80px] rounded border focus:outline-none ${
                                  entryType === 'SAIDA' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                                    : entryType === 'AJUSTE'
                                      ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
                                      : 'bg-purple-50 border-purple-200 text-[#660099]'
                                }`}
                              >
                                <option value="SAIDA">Saída</option>
                                <option value="ENTRADA">Entrada</option>
                                <option value="AJUSTE">Ajuste</option>
                              </select>
                            </td>

                            <td className="py-2 px-1 text-center bg-purple-50/30">
                              <input
                                id={`batch-input-qty-${item.id}`}
                                type="number"
                                step="1"
                                min={entryType === 'SAIDA' ? "0" : (isAjuste && batchAdjustMode === 'DELTA' ? undefined : "0")}
                                max={entryType === 'SAIDA' ? item.quantity : 9999}
                                placeholder={isAjuste ? (batchAdjustMode === 'DELTA' ? "+/-" : String(item.quantity)) : "0"}
                                value={rawEntry?.qtyStr !== undefined ? rawEntry.qtyStr : (rawEntry?.qty !== undefined && rawEntry?.qty !== 0 ? String(rawEntry.qty) : '')}
                                onChange={(e) => handleBatchQtyChange(item.id, e.target.value)}
                                className={`w-full max-w-[60px] text-center py-1 px-1 font-mono font-bold text-[11px] sm:text-xs border rounded-md focus:ring-2 focus:ring-[#660099] focus:outline-none transition-all mx-auto block ${
                                  isInvalid 
                                    ? 'border-rose-500 bg-rose-50 text-rose-700' 
                                    : isMoved 
                                      ? 'border-[#660099] bg-white text-[#660099] shadow-sm' 
                                      : 'border-slate-300 bg-white text-slate-700'
                                }`}
                              />
                            </td>

                            <td className="py-2 px-2 text-center font-mono text-[10px] hidden sm:table-cell">
                              {isMoved ? (
                                <div className="flex flex-col items-center">
                                  <span className={`font-bold ${isInvalid ? 'text-rose-600 font-extrabold' : 'text-slate-900'}`}>
                                    {projectedStock} <span className="text-[9px] text-slate-500">{item.unit}</span>
                                  </span>
                                  <span className={`text-[9px] font-bold ${diff >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                    ({diff >= 0 ? `+${diff}` : diff})
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* Sticky Submit Action Bar (aligned inside content area, next to sidebar) */}
            <div className="sticky bottom-3 z-30 bg-white/95 backdrop-blur-md border border-purple-200 shadow-2xl rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">
              <div className="text-xs text-slate-600">
                Total selecionado para gravação: <strong className="text-[#660099] font-mono text-sm">{activeBatchTotalUnits} unidades</strong> em <strong className="text-slate-900">{activeBatchCount} EPIs</strong>.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearBatchForm}
                  title="Limpar formulário"
                  aria-label="Limpar formulário"
                  className="p-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  id="btn-submit-batch-movement"
                  type="submit"
                  disabled={activeBatchCount === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-[#660099] hover:bg-[#52007a] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-purple-950/20 transition-all active:scale-95 cursor-pointer"
                >
                  <PackageCheck className="w-5 h-5" />
                  <span>Concluir</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODO POR KIT (ENTREGA EM MASSA BASEADA EM KIT)                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'kit' && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-purple-100 p-6 shadow-xs">
          <div className="border-b border-purple-50 pb-4 mb-5">
            <h2 className="text-lg font-bold text-slate-900">Entrega por Kit</h2>
            <p className="text-xs text-slate-500 mt-0.5">Selecione um kit cadastrado para preencher automaticamente os itens e quantidades.</p>
          </div>

          {kitSuccessMsg && (
            <div className="mb-5 p-4 bg-purple-50 border border-purple-200 text-[#660099] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#660099] shrink-0" />
              <span>{kitSuccessMsg}</span>
            </div>
          )}

          {kitErrorMsg && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{kitErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitKit} className="space-y-6 text-xs sm:text-sm">
            
            {/* Header / Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Localidade / Almoxarifado *</label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  required
                >
                  <option value="" disabled selected={selectedLocationId === 'ALL'}>Selecione...</option>
                  {(userAccessibleLocations || []).map(loc => (
                    <option key={loc.id} value={loc.id}>📍 {loc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Qual Kit será entregue? *</label>
                <select
                  value={kitSelectedId}
                  onChange={(e) => setKitSelectedId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  required
                >
                  <option value="">Selecione um Kit...</option>
                  {(kits || []).map(k => (
                    <option key={k.id} value={k.id}>📦 {k.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Quantidade de Kits *</label>
                <input
                  type="number"
                  min="1"
                  value={kitQuantity}
                  onChange={(e) => setKitQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Components List */}
            {selectedKit && (
              <div className="border border-purple-100 rounded-2xl overflow-hidden bg-slate-50/50">
                <div className="bg-purple-50/50 px-4 py-3 border-b border-purple-100 flex items-center justify-between">
                  <span className="font-bold text-[#660099]">Itens do Kit: {selectedKit.name}</span>
                  <span className="text-xs text-slate-500 font-medium">Você pode ajustar as quantidades abaixo, se necessário.</span>
                </div>
                
                <div className="p-4 space-y-4">
                  {selectedKit.components.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Este kit não possui componentes configurados.</p>
                  ) : (
                    selectedKit.components.map((comp, idx) => {
                      const entry = kitEntries[idx] || { selectedItemId: '', quantity: 0 };
                      const availableItems = findAllItemsForComponent(comp.itemId, comp.itemName, selectedLocationId);
                      
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                          
                          <div className="flex-1 w-full">
                            <span className="block text-xs font-bold text-slate-600 mb-1">Componente do Kit</span>
                            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-medium truncate">
                              {comp.itemName} (Padrão: {comp.requiredQuantity} {comp.unit})
                            </div>
                          </div>

                          <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-[#660099] mb-1">EPI Específico (Escolha o tamanho) *</label>
                            <select
                              value={entry.selectedItemId}
                              onChange={(e) => setKitEntries(prev => ({ ...prev, [idx]: { ...prev[idx], selectedItemId: e.target.value } }))}
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#660099] focus:outline-none ${!entry.selectedItemId ? 'border-rose-300 text-rose-600' : 'border-purple-200 text-slate-800'}`}
                              required
                            >
                              <option value="" disabled>Selecione um tamanho/variante...</option>
                              {availableItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name} • Saldo: {item.quantity}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-full sm:w-28 shrink-0">
                            <label className="block text-xs font-bold text-slate-600 mb-1 text-center">Qtd Entregue</label>
                            <input
                              type="number"
                              min="0"
                              value={entry.quantity}
                              onChange={(e) => setKitEntries(prev => ({ ...prev, [idx]: { ...prev[idx], quantity: parseInt(e.target.value) || 0 } }))}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-[#660099] focus:ring-2 focus:ring-[#660099] focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Employee Data (for NR-6 compliance) */}
            <div className="p-4 bg-[#FAF7FC] border border-purple-100 rounded-xl space-y-3 mt-6">
              <span className="text-[11px] font-bold text-[#660099] uppercase tracking-wider block">
                Dados do Colaborador / Recebedor (Para Ficha NR-6)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={kitEmployeeName}
                    onChange={(e) => setKitEmployeeName(e.target.value)}
                    placeholder="Ex: Marcos Vinicius"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Matrícula / RE</label>
                  <input
                    type="text"
                    value={kitEmployeeReg}
                    onChange={(e) => setKitEmployeeReg(e.target.value)}
                    placeholder="Ex: VIV-8821"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Função / Cargo</label>
                <input
                  type="text"
                  value={kitEmployeeRole}
                  onChange={(e) => setKitEmployeeRole(e.target.value)}
                  placeholder="Ex: Técnico de Campo / Instalador"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Observações Adicionais</label>
              <textarea
                rows={2}
                value={kitNotes}
                onChange={(e) => setKitNotes(e.target.value)}
                placeholder="Ex: Colaborador substituiu kit rasgado."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none text-xs"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                id="btn-submit-kit-movement"
                type="submit"
                disabled={!selectedKit || selectedKit.components.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-[#660099] hover:bg-[#52007a] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-extrabold text-sm shadow-md shadow-purple-950/20 transition-all active:scale-95 cursor-pointer"
              >
                <PackageCheck className="w-5 h-5" />
                Registrar Entrega de Kit
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HISTÓRICO GERAL AUDITÁVEL                                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar histórico..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660099]"
                />
              </div>

              <div>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660099]"
                >
                  <option value="ALL">Todas as Localidades</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={historyTypeFilter}
                  onChange={(e) => setHistoryTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660099]"
                >
                  <option value="ALL">Todos os Tipos</option>
                  <option value="SAIDA">Saídas / Entregas</option>
                  <option value="ENTRADA">Entradas / Compras</option>
                  <option value="AJUSTE">Ajuste de Estoque / Inventário</option>
                  <option value="TRANSFERENCIA_SAIDA">Transferências</option>
                  <option value="ENTREGA_KIT">Entrega de Kits</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#660099] border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>

            </div>
          </div>

          {/* Movements History Table */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Nenhuma movimentação corresponde aos filtros selecionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FAF7FC] border-b border-purple-100 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Data / Hora</th>
                      <th className="py-3.5 px-4">Tipo</th>
                      <th className="py-3.5 px-4">EPI & CA</th>
                      <th className="py-3.5 px-4">Almoxarifado</th>
                      <th className="py-3.5 px-4 text-center">Movimentado</th>
                      <th className="py-3.5 px-4 text-center">Evolução do Saldo</th>
                      <th className="py-3.5 px-4">Motivo / Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map(mov => {
                      const isOut = mov.type === 'SAIDA';
                      const isAjuste = mov.type === 'AJUSTE';
                      const prevStock = (mov as any).previousQuantity ?? mov.previousStock ?? '-';
                      const currStock = (mov as any).newQuantity ?? mov.currentStock ?? '-';

                      const dateFormatted = new Date(mov.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={mov.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-500 text-xs whitespace-nowrap">
                            {dateFormatted}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              mov.type === 'SAIDA' ? 'bg-rose-100 text-rose-700' :
                              mov.type === 'ENTRADA' ? 'bg-purple-100 text-[#660099]' :
                              mov.type === 'AJUSTE' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {mov.type === 'AJUSTE' ? 'AJUSTE' : mov.type}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{mov.itemName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">CA: {mov.itemCa || 'N/A'}</span>
                          </td>

                          <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                            {mov.locationName}
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-extrabold whitespace-nowrap">
                            <span className={isAjuste ? 'text-amber-800' : isOut ? 'text-rose-600' : 'text-[#660099]'}>
                              {isAjuste ? `±${mov.quantity}` : isOut ? `-${mov.quantity}` : `+${mov.quantity}`}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center font-mono text-xs whitespace-nowrap">
                            <span className="text-slate-500">{prevStock}</span>
                            <span className="text-slate-400 mx-1">→</span>
                            <strong className="text-slate-900 font-bold">{currStock}</strong>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{mov.reason}</div>
                            {mov.employeeName && (
                              <div className="text-[11px] text-slate-500">
                                Colaborador: <span className="font-semibold text-slate-700">{mov.employeeName}</span> {mov.employeeRole && `(${mov.employeeRole})`}
                              </div>
                            )}
                            {mov.notes && (
                              <div className="text-[10px] text-slate-400 italic mt-0.5">{mov.notes}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
