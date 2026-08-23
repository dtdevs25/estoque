import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Calculator, 
  Boxes,
  Grid,
  List
} from 'lucide-react';
import { useStock, stripSizeFromName } from '../context/StockContext';
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
    deleteKit,
    currentUser,
    isCurrentUserAdmin,
    getKitAvailabilityForLocation,
    selectedLocationId
  } = useStock();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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



  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Kits Cadastrados
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-[#660099] border border-purple-200">
              {(kits || []).length} {(kits || []).length === 1 ? 'Kit' : 'Kits'} no Catálogo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-slate-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#660099] shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
              title="Visualização em Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#660099] shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
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
      </div>

      {/* Kits List Grid / Table */}
      {(kits || []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-[#660099] flex items-center justify-center mx-auto">
            <Boxes className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Nenhum Kit Cadastrado Ainda</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre os kits homologados da empresa para realizar entregas aos colaboradores.
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
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(kits || []).map(kit => {
            const avail = getKitAvailabilityForLocation(kit.id, selectedLocationId);
            const kitsDisponiveis = avail?.maxCompleteKits || 0;

            return (
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

                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 text-[#660099] border border-purple-200 shrink-0 min-w-[80px]">
                    <span className="text-2xl font-black">{kitsDisponiveis}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Montáveis</span>
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
                            <span className="font-bold text-slate-900 truncate">{stripSizeFromName(comp.itemName)}</span>
                          </div>

                          <div className="font-mono font-extrabold text-xs text-[#660099] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                            {comp.requiredQuantity || (comp as any).quantity || 1} {comp.unit || 'un'}
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
                  <div className="flex items-center gap-1.5">
                    {canEdit && (
                      <button
                        onClick={() => onOpenEditKit(kit)}
                        className="p-2 text-slate-600 hover:text-[#660099] hover:bg-purple-100/60 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-purple-200"
                        title="Editar kit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteKit(kit)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                        title="Excluir kit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )
        })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-[#FAF7FC] border-b border-purple-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Código / Categoria</th>
                  <th className="py-3.5 px-4">Nome do Kit</th>
                  <th className="py-3.5 px-4">Componentes</th>
                  <th className="py-3.5 px-4 text-center">Montáveis</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(kits || []).map((kit) => {
                  const avail = getKitAvailabilityForLocation(kit.id, selectedLocationId);
                  const kitsDisponiveis = avail?.maxCompleteKits || 0;
                  return (
                  <tr key={kit.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#660099] text-xs">
                          {kit.category || 'Kit Padrão'}
                        </span>
                        {kit.code && <span className="text-[11px] font-mono text-slate-400">{kit.code}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{kit.name}</div>
                      {kit.description && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">{kit.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {(kit.components || []).slice(0, 3).map((c, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                            {stripSizeFromName(c.itemName)} ({c.requiredQuantity || (c as any).quantity || 1} {c.unit || 'un'})
                          </span>
                        ))}
                        {(kit.components || []).length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[#660099] text-[11px] font-bold">
                            +{(kit.components || []).length - 3} mais
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <span className="px-3 py-1 text-sm font-bold bg-purple-100 text-[#660099] rounded-lg">
                          {kitsDisponiveis}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {canEdit && (
                          <button
                            onClick={() => onOpenEditKit(kit)}
                            className="p-2 text-slate-600 hover:text-[#660099] hover:bg-purple-100/60 rounded-xl transition-colors cursor-pointer"
                            title="Editar kit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteKit(kit)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Excluir kit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
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
