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
    setSelectedLocationId
  } = useStock();

  const isViewer = currentUser?.role === 'VIEWER';
  const [activeSubTab, setActiveSubTab] = useState<'batch' | 'single' | 'history'>(isViewer ? 'history' : 'batch');

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

  // ---- State for Single / Unitary Mode ----
  const [singleItemId, setSingleItemId] = useState<string>(() => items[0]?.id || '');
  
  const [singleCategoryFilter, setSingleCategoryFilter] = useState<'EPI_EPC' | 'ERGONOMICO'>('EPI_EPC');
  const [singleType, setSingleType] = useState<MovementType>('SAIDA');
  const [singleQty, setSingleQty] = useState<number>(1);
  const [singleAdjustMode, setSingleAdjustMode] = useState<'DELTA' | 'FINAL'>('DELTA');
  const [singleAdjustQty, setSingleAdjustQty] = useState<number>(0);
  const [singleReason, setSingleReason] = useState<string>('Entregas aos Colaboradores');
  const [singleDestinationLocationId, setSingleDestinationLocationId] = useState('');
  const [singleEmployeeName, setSingleEmployeeName] = useState<string>('');
  const [singleEmployeeRole, setSingleEmployeeRole] = useState<string>('');
  const [singleEmployeeReg, setSingleEmployeeReg] = useState<string>('');
  const [singleNotes, setSingleNotes] = useState<string>('');
  const [singleSuccessMsg, setSingleSuccessMsg] = useState<string | null>(null);
  const [singleErrorMsg, setSingleErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (singleErrorMsg) {
      const timer = setTimeout(() => setSingleErrorMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [singleErrorMsg]);

  useEffect(() => {
    if (singleSuccessMsg) {
      const timer = setTimeout(() => setSingleSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [singleSuccessMsg]);

  const filteredSingleItems = useMemo(() => {
    return (items || []).filter(i => {
      if (!i) return false;
      const matchLoc = selectedLocationId === 'ALL' || !selectedLocationId || i.locationId === selectedLocationId || i.locationId === 'ALL';
      let matchCat = true;
      if (singleCategoryFilter === 'ERGONOMICO') {
        matchCat = i.type === 'ERGONOMICO' || (i.category || '').toLowerCase().includes('ergonômic') || (i.category || '').toLowerCase().includes('ergonomic');
      } else {
        matchCat = i.type !== 'ERGONOMICO' && !(i.category || '').toLowerCase().includes('ergonômic') && !(i.category || '').toLowerCase().includes('ergonomic');
      }
      return matchLoc && matchCat;
    });
  }, [items, selectedLocationId, singleCategoryFilter]);

  const handleSingleReasonChange = (newReason: string) => {
    setSingleReason(newReason);
    if (newReason === 'Ajuste de Estoque / Contagem Física') {
      setSingleType('AJUSTE' as any);
      setSingleAdjustQty(0);
    } else {
      const isEntrada = newReason.toLowerCase().includes('recebimento') || newReason.toLowerCase().includes('entrada');
      setSingleType(isEntrada ? 'ENTRADA' : 'SAIDA');
    }
  };

  const selectedSingleItem = items.find(i => i.id === singleItemId);

  const calculatedSingleAdjustment = useMemo(() => {
    const currentStock = selectedSingleItem?.quantity || 0;
    const val = singleAdjustQty || 0;

    let target = currentStock;
    let diff = 0;

    if (singleAdjustMode === 'DELTA') {
      target = Math.max(0, currentStock + val);
      diff = val;
    } else {
      target = Math.max(0, val);
      diff = target - currentStock;
    }

    return {
      targetStock: target,
      diff,
      val
    };
  }, [selectedSingleItem, singleAdjustQty, singleAdjustMode]);

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleErrorMsg(null);
    setSingleSuccessMsg(null);

    if (!singleItemId) {
      setSingleErrorMsg('Selecione um EPI.');
      return;
    }

    if (singleReason === 'Ajuste de Estoque / Contagem Física' || singleType === ('AJUSTE' as any)) {
      const targetQty = calculatedSingleAdjustment.targetStock;

      const res = await adjustStock({
        itemId: singleItemId,
        newQuantity: targetQty,
        reason: singleReason,
        notes: singleNotes,
      });

      if (res.success) {
        setSingleSuccessMsg(`Ajuste de estoque do item "${selectedSingleItem?.name}" registrado com sucesso! Novo saldo: ${targetQty} ${selectedSingleItem?.unit || 'un'}.`);
        setSingleAdjustQty(0);
        setSingleNotes('');
      } else {
        setSingleErrorMsg(res.error || 'Erro ao registrar ajuste de estoque.');
      }
      return;
    }

    if (singleQty <= 0) {
      setSingleErrorMsg('A quantidade deve ser maior que zero.');
      return;
    }

    if (singleReason === 'Movimentação de estoque') {
      if (!singleDestinationLocationId) {
        setSingleErrorMsg('Selecione para qual estoque o item será transferido.');
        return;
      }
      
      const res = await transferStock({
        itemId: singleItemId,
        toLocationId: singleDestinationLocationId,
        quantity: singleQty,
        reason: 'Transferência Avulsa / Movimentação de Estoque',
        employeeName: currentUser.name
      });
      
      if (res.success) {
        setSingleSuccessMsg(`Item transferido com sucesso para o novo almoxarifado.`);
        setSingleQty(1);
        setSingleNotes('');
      } else {
        setSingleErrorMsg(res.error || 'Erro ao registrar transferência.');
      }
      return;
    }

    const res = await registerSingleMovement({
      itemId: singleItemId,
      type: singleType,
      quantity: singleQty,
      reason: singleReason,
      employeeName: singleEmployeeName,
      employeeRole: singleEmployeeRole,
      employeeRegistration: singleEmployeeReg,
      notes: singleNotes,
    });

    if (res.success) {
      setSingleSuccessMsg(`Movimentação de ${singleQty} ${selectedSingleItem?.unit || 'un'} registrada com sucesso!`);
      setSingleQty(1);
      setSingleNotes('');
    } else {
      setSingleErrorMsg(res.error || 'Erro ao registrar movimentação.');
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
        <div>
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
                <span>Lançamento em Lote</span>
              </button>

              <button
                id="subtab-single"
                onClick={() => setActiveSubTab('single')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  activeSubTab === 'single'
                    ? 'bg-[#660099] text-white shadow-sm shadow-purple-950/20'
                    : 'text-slate-600 hover:text-[#660099]'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Lançamento Avulso</span>
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
                    <option value="ALL">🏢 Todos os Almoxarifados (Visão Ampla)</option>
                    {(locations || []).map(loc => (
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
                    Itens Homologados ({batchLocationItems.length} disponíveis)
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

              {batchLocationItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum EPI cadastrado neste almoxarifado. Cadastre EPIs ou selecione outra localidade.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-white border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 w-12 text-center">Foto</th>
                        <th className="py-3 px-4">EPI & CA</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4 text-center">Saldo Atual</th>
                        <th className="py-3 px-4 w-36 text-center">Tipo</th>
                        <th className="py-3 px-4 w-32 text-center bg-purple-50/70 text-[#660099]">
                          {batchDefaultType === 'AJUSTE' ? (batchAdjustMode === 'DELTA' ? 'Variação (+/-)' : 'Nova Qtd') : 'QTDE'}
                        </th>
                        <th className="py-3 px-4 text-center">Novo Saldo (Diferença)</th>
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
                            <td className="py-2.5 px-4 text-center">
                              <img 
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=150'} 
                                alt={item.name} 
                                className="w-8 h-8 rounded-full object-cover border border-purple-100 mx-auto" 
                              />
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">CA {item.caNumber} • {item.brand || 'Vivo'}</div>
                            </td>

                            <td className="py-2.5 px-4 text-slate-600 text-xs">{item.category}</td>

                            <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                              {item.quantity} {item.unit}
                            </td>

                            <td className="py-2.5 px-4 text-center">
                              <select
                                value={entryType}
                                onChange={(e) => handleBatchTypeChange(item.id, e.target.value as MovementType)}
                                className={`text-xs font-semibold px-2 py-1 rounded border focus:outline-none ${
                                  entryType === 'SAIDA' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                                    : entryType === 'AJUSTE'
                                      ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
                                      : 'bg-purple-50 border-purple-200 text-[#660099]'
                                }`}
                              >
                                <option value="SAIDA">Saída</option>
                                <option value="ENTRADA">Entrada</option>
                                <option value="AJUSTE">Ajuste de Estoque</option>
                              </select>
                            </td>

                            <td className="py-2.5 px-4 text-center bg-purple-50/30">
                              <input
                                id={`batch-input-qty-${item.id}`}
                                type="number"
                                step="1"
                                min={entryType === 'SAIDA' ? "0" : (isAjuste && batchAdjustMode === 'DELTA' ? undefined : "0")}
                                max={entryType === 'SAIDA' ? item.quantity : 9999}
                                placeholder={isAjuste ? (batchAdjustMode === 'DELTA' ? "0 (ex: -2 ou 5)" : String(item.quantity)) : "0"}
                                value={rawEntry?.qtyStr !== undefined ? rawEntry.qtyStr : (rawEntry?.qty !== undefined && rawEntry?.qty !== 0 ? String(rawEntry.qty) : '')}
                                onChange={(e) => handleBatchQtyChange(item.id, e.target.value)}
                                className={`w-28 text-center py-1.5 px-2 font-mono font-bold text-sm border rounded-lg focus:ring-2 focus:ring-[#660099] focus:outline-none transition-all ${
                                  isInvalid 
                                    ? 'border-rose-500 bg-rose-50 text-rose-700' 
                                    : isMoved 
                                      ? 'border-[#660099] bg-white text-[#660099] shadow-sm' 
                                      : 'border-slate-300 bg-white text-slate-700'
                                }`}
                              />
                            </td>

                            <td className="py-2.5 px-4 text-center font-mono text-xs">
                              {isMoved ? (
                                <div className="flex flex-col items-center">
                                  <span className={`font-bold ${isInvalid ? 'text-rose-600 font-extrabold' : 'text-slate-900'}`}>
                                    {projectedStock} {item.unit}
                                  </span>
                                  <span className={`text-[10px] font-bold ${diff >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
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
                  <span>Concluir Lançamento em Lote</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODO AVULSO (UNITÁRIO)                                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'single' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-purple-100 p-6 shadow-xs">
          <div className="border-b border-purple-50 pb-4 mb-5">
            <h2 className="text-lg font-bold text-slate-900">Lançamento de Movimentação Individual</h2>
            <p className="text-xs text-slate-500 mt-0.5">Registre uma entrega avulsa, devolução, descarte ou entrada de estoque pontual.</p>
          </div>

          {singleSuccessMsg && (
            <div className="mb-5 p-4 bg-purple-50 border border-purple-200 text-[#660099] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#660099] shrink-0" />
              <span>{singleSuccessMsg}</span>
            </div>
          )}

          {singleErrorMsg && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{singleErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitSingle} className="space-y-4 text-xs sm:text-sm">
            
            {/* Location & Category filters for Item Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
              <div>
                <label className="block text-slate-600 text-xs font-bold mb-1">Filtrar por Almoxarifado</label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="ALL">🏢 Todos os Almoxarifados</option>
                  {(locations || []).map(loc => (
                    <option key={loc.id} value={loc.id}>📍 {loc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 text-xs font-bold mb-1">Filtrar por Categoria</label>
                <select
                  value={singleCategoryFilter}
                  onChange={(e) => setSingleCategoryFilter(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="EPI_EPC">EPI / EPC</option>
                  <option value="ERGONOMICO">Ergonômicos</option>
                </select>
              </div>
            </div>

            {/* Item Selector */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Equipamento de Proteção (EPI) *</label>
              <select
                id="single-item-select"
                value={singleItemId}
                onChange={(e) => setSingleItemId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                required
              >
                {filteredSingleItems.length === 0 ? (
                  <option value="">Nenhum EPI encontrado com esses filtros</option>
                ) : (
                  filteredSingleItems.map(i => {
                    const loc = (locations || []).find(l => l.id === i.locationId);
                    return (
                      <option key={i.id} value={i.id}>
                        {i.name} (CA: {i.caNumber || 'N/A'}) • Saldo: {i.quantity} {i.unit || 'un'} • {loc?.name || 'Local'}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            {/* Movement Type & Qty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Tipo</label>
                <select
                  value={singleType}
                  onChange={(e) => {
                    const newT = e.target.value as any;
                    setSingleType(newT);
                    if (newT === 'AJUSTE') {
                      setSingleReason('Ajuste de Estoque / Contagem Física');
                      setSingleAdjustQty(0);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                >
                  <option value="SAIDA">Saída</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="AJUSTE">Ajuste de Estoque</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {singleReason === 'Ajuste de Estoque / Contagem Física' || singleType === ('AJUSTE' as any)
                    ? (singleAdjustMode === 'DELTA' ? `Variação do Ajuste (+ / -) (${selectedSingleItem?.unit || 'un'}) *` : `Novo Saldo Final Apurado (${selectedSingleItem?.unit || 'un'}) *`)
                    : `Quantidade (${selectedSingleItem?.unit || 'un'}) *`}
                </label>
                {singleReason === 'Ajuste de Estoque / Contagem Física' || singleType === ('AJUSTE' as any) ? (
                  <input
                    id="single-qty-input"
                    type="number"
                    step="1"
                    min={singleAdjustMode === 'DELTA' ? undefined : "0"}
                    placeholder={singleAdjustMode === 'DELTA' ? "0 (ex: -2 ou 5)" : String(selectedSingleItem?.quantity || 0)}
                    value={singleAdjustQty || ''}
                    onChange={(e) => setSingleAdjustQty(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                    required
                  />
                ) : (
                  <input
                    id="single-qty-input"
                    type="number"
                    min="1"
                    value={singleQty}
                    onChange={(e) => setSingleQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none"
                    required
                  />
                )}
              </div>
            </div>

            {/* Helper box and mode toggle for AJUSTE mode */}
            {(singleReason === 'Ajuste de Estoque / Contagem Física' || singleType === ('AJUSTE' as any)) && selectedSingleItem && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-xl border border-purple-100 text-xs">
                  <span className="font-bold text-[#660099]">Modo do Ajuste:</span>
                  <div className="flex flex-wrap bg-white p-0.5 rounded-lg border border-purple-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setSingleAdjustMode('DELTA')}
                      className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                        singleAdjustMode === 'DELTA' ? 'bg-[#660099] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-[#660099]'
                      }`}
                    >
                      📊 Variação (+ / -) (ex: -2 ou +5)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSingleAdjustMode('FINAL')}
                      className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                        singleAdjustMode === 'FINAL' ? 'bg-[#660099] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-[#660099]'
                      }`}
                    >
                      🔢 Saldo Final Apurado (ex: 40)
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center justify-between font-medium">
                  <div>
                    <span className="text-slate-600 block text-[11px]">Estoque Cadastrado no Sistema:</span>
                    <strong className="text-slate-900 text-sm">{selectedSingleItem.quantity} {selectedSingleItem.unit || 'un'}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-600 block text-[11px]">Variação do Ajuste:</span>
                    <strong className={`text-sm font-mono ${calculatedSingleAdjustment.diff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {calculatedSingleAdjustment.diff >= 0 ? `+${calculatedSingleAdjustment.diff}` : `${calculatedSingleAdjustment.diff}`} {selectedSingleItem.unit || 'un'}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-600 block text-[11px]">Novo Saldo Apurado:</span>
                    <strong className="text-[#660099] text-sm font-bold font-mono">
                      {calculatedSingleAdjustment.targetStock} {selectedSingleItem.unit || 'un'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Motivo ou tipo de operação *</label>
              <select
                value={singleReason}
                onChange={(e) => handleSingleReasonChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none font-medium"
                required
              >
                <option value="Entregas aos Colaboradores">Entregas aos Colaboradores (Saída)</option>
                <option value="Recebimento de material">Recebimento de material (Entrada)</option>
                <option value="Ajuste de Estoque / Contagem Física">Ajuste de Estoque / Contagem Física</option>
                <option value="Movimentação de estoque">Movimentação de estoque (Saída/Transferência)</option>
              </select>
            </div>

            {singleReason === 'Movimentação de estoque' && (
              <div>
                <label className="block text-[#660099] font-bold mb-1.5">Para qual estoque vai? *</label>
                <select
                  value={singleDestinationLocationId}
                  onChange={(e) => setSingleDestinationLocationId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-[#660099] font-semibold focus:ring-2 focus:ring-[#660099] focus:outline-none"
                >
                  <option value="">Selecione o destino...</option>
                  {locations.filter(l => l.id !== selectedSingleItem?.locationId).map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Employee Data (for NR-6 compliance) */}
            <div className="p-4 bg-[#FAF7FC] border border-purple-100 rounded-xl space-y-3">
              <span className="text-[11px] font-bold text-[#660099] uppercase tracking-wider block">
                Dados do Colaborador / Recebedor (Para Ficha NR-6)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={singleEmployeeName}
                    onChange={(e) => setSingleEmployeeName(e.target.value)}
                    placeholder="Ex: Marcos Vinicius"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Matrícula / RE</label>
                  <input
                    type="text"
                    value={singleEmployeeReg}
                    onChange={(e) => setSingleEmployeeReg(e.target.value)}
                    placeholder="Ex: VIV-8821"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Função / Cargo</label>
                <input
                  type="text"
                  value={singleEmployeeRole}
                  onChange={(e) => setSingleEmployeeRole(e.target.value)}
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
                value={singleNotes}
                onChange={(e) => setSingleNotes(e.target.value)}
                placeholder="Observações sobre condição do EPI, substituição periódica, etc."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#660099] focus:outline-none text-xs"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                id="btn-submit-single-movement"
                type="submit"
                className="px-6 py-2.5 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-bold text-sm shadow-md shadow-purple-950/20 transition-all active:scale-95"
              >
                Registrar Movimentação
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
