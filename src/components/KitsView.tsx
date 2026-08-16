import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  Package, 
  Edit3, 
  Trash2, 
  Calculator, 
  Building2,
  ShieldCheck,
  Boxes
} from 'lucide-react';
import { useStock } from '../context/StockContext';
import { EpiKit } from '../types';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';

interface KitsViewProps {
  onOpenNewKit: () => void;
  onOpenEditKit: (kit: EpiKit) => void;
  onOpenDeliverKit: (kitId: string, locationId: string) => void;
}

export const KitsView: React.FC<KitsViewProps> = ({
  onOpenNewKit,
  onOpenEditKit,
  onOpenDeliverKit,
}) => {
  const { 
    kits, 
    locations, 
    deleteKit,
    currentUser,
    isCurrentUserAdmin,
    getKitAvailabilityForLocation
  } = useStock();

  const [activeLocId, setActiveLocId] = useState<string>(() => locations[0]?.id || '');
  const [targetKitsSimulation, setTargetKitsSimulation] = useState<number>(10);
  const [selectedKitForSimulation, setSelectedKitForSimulation] = useState<string>(() => kits[0]?.id || '');

  const canEdit = isCurrentUserAdmin || currentUser?.role === 'CONTROLLER';
  const canDelete = isCurrentUserAdmin;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<EpiKit | null>(null);

  const handleDeleteKit = (kit: EpiKit) => {
    setKitToDelete(kit);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (kitToDelete) {
      await deleteKit(kitToDelete.id);
      setDeleteModalOpen(false);
      setKitToDelete(null);
    }
  };

  // Availability report for simulation
  const simReport = selectedKitForSimulation && activeLocId 
    ? getKitAvailabilityForLocation(selectedKitForSimulation, activeLocId) 
    : null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Kits Cadastrados
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-[#660099] border border-purple-200">
              {(kits || []).length} {(kits || []).length === 1 ? 'Kit' : 'Kits'} no Catálogo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kits homologados da empresa disponíveis para entrega em qualquer almoxarifado.
          </p>
        </div>

        {canEdit && (
          <button
            id="btn-create-new-kit"
            onClick={onOpenNewKit}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-semibold text-sm shadow-sm shadow-purple-950/20 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Kit
          </button>
        )}
      </div>

      {/* Kits List Grid */}
      {(kits || []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-[#660099] flex items-center justify-center mx-auto">
            <Boxes className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Nenhum Kit Cadastrado Ainda</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre os kits homologados da empresa (ex: Kit Trabalho em Altura, Kit Eletricista, Kit Fibra Óptica) para realizar entregas aos colaboradores.
            </p>
          </div>
          {canEdit && (
            <button
              onClick={onOpenNewKit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Criar Primeiro Kit
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(kits || []).map(kit => (
            <div 
              key={kit.id}
              className="bg-white rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                
                {/* Kit Header */}
                <div className="p-5 border-b border-purple-50 bg-[#FAF7FC] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#660099] bg-purple-100 px-2 py-0.5 rounded border border-purple-200 uppercase tracking-wider">
                        {kit.category || 'Kit Padrão'}
                      </span>
                      {kit.code && <span className="text-xs font-mono text-slate-400">{kit.code}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{kit.name}</h3>
                    {kit.description && <p className="text-xs text-slate-500 mt-0.5">{kit.description}</p>}
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-100/70 text-[#660099] border border-purple-200 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                {/* Kit Components Table */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <span>Componentes Integrantes do Kit</span>
                    <span>Qtd Por Kit</span>
                  </div>

                  <div className="space-y-2">
                    {kit.components && kit.components.length > 0 ? (
                      kit.components.map((comp, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#660099] border border-purple-100 flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <span className="font-bold text-slate-900 truncate">{comp.itemName}</span>
                          </div>

                          <div className="font-mono font-extrabold text-xs text-[#660099] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                            {comp.requiredQuantity || comp.quantity || 1} {comp.unit || 'un'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Nenhum componente especificado.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              {(canEdit || canDelete) && (
                <div className="p-4 bg-[#FAF7FC] border-t border-purple-50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => onOpenEditKit(kit)}
                        className="p-2 text-slate-600 hover:text-[#660099] hover:bg-purple-100/50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Editar componentes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Editar
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteKit(kit)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Excluir kit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </button>
                    )}
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => onOpenDeliverKit(kit.id, locations[0]?.id || '')}
                      className="px-4 py-2 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Entregar Kit
                    </button>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Simulator Section */}
      {(kits || []).length > 0 && (
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-purple-50 pb-3">
            <div className="p-2 rounded-lg bg-purple-50 text-[#660099]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Simulador de Estoque por Almoxarifado</h3>
              <p className="text-xs text-slate-500">
                Verifique a capacidade de montagem e saldo de componentes de um Kit em um almoxarifado específico.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Kit em Análise</label>
              <select
                value={selectedKitForSimulation}
                onChange={(e) => setSelectedKitForSimulation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099]"
              >
                {(kits || []).map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Almoxarifado / Unidade</label>
              <select
                value={activeLocId}
                onChange={(e) => setActiveLocId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099]"
              >
                {(locations || []).map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Meta de Kits Desejada</label>
              <input
                type="number"
                min="1"
                max="5000"
                value={targetKitsSimulation}
                onChange={(e) => setTargetKitsSimulation(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] font-mono font-bold"
              />
            </div>
          </div>

          {simReport && (
            <div className="mt-4 pt-4 border-t border-purple-50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Capacidade máxima no almoxarifado: <strong className="text-[#660099] font-mono font-bold text-sm">{simReport.maxCompleteKits || 0} kits</strong>
                </span>
                <span className="font-bold text-slate-500">Balanço do Almoxarifado:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(simReport.componentDetails || []).map((comp, i) => {
                  const neededTotal = (comp.required || 1) * targetKitsSimulation;
                  const deficit = Math.max(0, neededTotal - (comp.available || 0));
                  const isSatisfied = deficit === 0;

                  return (
                    <div key={i} className={`p-3 rounded-xl border text-xs ${
                      isSatisfied ? 'bg-purple-50/60 border-purple-200' : 'bg-rose-50/70 border-rose-200'
                    }`}>
                      <div className="font-bold text-slate-800 truncate">{comp.itemName}</div>
                      <div className="mt-2 flex justify-between text-[11px]">
                        <span className="text-slate-500">Saldo: {comp.available || 0}</span>
                        <span className="text-slate-500">Necessário: {neededTotal}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Falta Comprar:</span>
                        <strong className={`font-mono text-sm ${isSatisfied ? 'text-[#660099]' : 'text-rose-700 font-extrabold'}`}>
                          {isSatisfied ? '0 (OK)' : `+${deficit} ${comp.unit || 'un'}`}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setKitToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Composição de Kit"
        itemName={kitToDelete ? kitToDelete.name : ''}
      />

    </div>
  );
};
