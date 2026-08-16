import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  User, 
  Phone, 
  Package, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  Layers,
  ArrowRight,
  ShieldAlert,
  Grid,
  List
} from 'lucide-react';
import { useStock } from '../context/StockContext';
import { Location } from '../types';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';

interface LocationsViewProps {
  onOpenNewLocation: () => void;
  onOpenEditLocation: (location: Location) => void;
  onSelectLocationForViewing: (locationId: string) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  onOpenNewLocation,
  onOpenEditLocation,
  onSelectLocationForViewing,
}) => {
  const { 
    locations, 
    items, 
    kits, 
    getKitAvailabilityForLocation, 
    deleteLocation,
    isCurrentUserAdmin,
    currentUser
  } = useStock();

  const canEdit = isCurrentUserAdmin || currentUser?.role === 'CONTROLLER';
  const canDelete = isCurrentUserAdmin;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleDelete = (location: Location) => {
    if (!canDelete) {
      alert('Apenas Administradores do sistema podem excluir almoxarifados.');
      return;
    }
    setLocationToDelete(location);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      const res = deleteLocation(locationToDelete.id);
      if (!res.success) {
        alert(res.message || 'Não foi possível excluir esta localidade.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Almoxarifados
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-[#660099] border border-purple-200">
              {locations.length} {locations.length === 1 ? 'local' : 'locais'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <button
              id="btn-add-new-location"
              onClick={onOpenNewLocation}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-semibold text-sm shadow-sm shadow-purple-950/20 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Almoxarifado
            </button>
          ) : (
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5">
              <span>Perfil Atual: <strong>{currentUser.role}</strong></span>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-slate-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#660099] shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
              title="Visualização em Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#660099] shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Locations Cards Grid */}
      {viewMode === 'grid' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(loc => {
          const locItems = items.filter(i => i.locationId === loc.id);
          const totalUnits = locItems.reduce((sum, i) => sum + i.quantity, 0);
          const criticalCount = locItems.filter(i => i.quantity <= i.minQuantity).length;

          // Kit capabilities for this location
          const kitsCapabilities = kits.map(k => getKitAvailabilityForLocation(k.id, loc.id)).filter(Boolean);
          const isUserAssigned = currentUser.locationIds.includes(loc.id) || currentUser.locationIds.includes('ALL');

          return (
            <div 
              key={loc.id}
              className={`bg-white rounded-2xl border shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group ${
                isUserAssigned ? 'border-[#660099] ring-1 ring-[#660099]' : 'border-purple-100/90 hover:border-purple-300'
              }`}
            >
              <div>
                
                {/* Header */}
                <div className="p-5 border-b border-purple-50 bg-[#FAF7FC]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#660099] flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-wider">{loc.code}</span>
                          {isUserAssigned && (
                            <span className="text-[9px] font-bold bg-[#660099] text-white px-1.5 py-0.2 rounded-full">
                              Seu Estoque
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{loc.name}</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{loc.description}</p>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 text-xs">
                  
                  {/* Address and Responsible */}
                  <div className="space-y-2 text-slate-600">
                    {loc.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate">{loc.address}</span>
                      </div>
                    )}
                    {loc.responsibleName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Almoxarife: <strong className="text-slate-800">{loc.responsibleName}</strong></span>
                      </div>
                    )}
                    {loc.responsibleContact && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{loc.responsibleContact}</span>
                      </div>
                    )}
                  </div>

                  {/* Stock Metrics Box */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-50">
                    <div className="p-2.5 rounded-xl bg-[#FAF7FC] border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total em Estoque</span>
                      <strong className="text-base font-extrabold text-slate-900">{totalUnits}</strong>
                      <span className="text-[10px] text-slate-500 block">{locItems.length} EPIs cadastrados</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FAF7FC] border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Status de Estoque</span>
                      <strong className={`text-base font-extrabold ${criticalCount > 0 ? 'text-amber-600' : 'text-[#660099]'}`}>
                        {criticalCount > 0 ? `${criticalCount} em alerta` : '100% Regular'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">níveis de reposição</span>
                    </div>
                  </div>

                  {/* Top Kits Available here */}
                  <div className="pt-2 border-t border-purple-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                      Capacidade de Kits Montáveis
                    </span>
                    <div className="space-y-1.5">
                      {kitsCapabilities.slice(0, 3).map((rep, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-slate-50">
                          <span className="text-slate-700 font-medium truncate max-w-[170px]">{rep?.kitName}</span>
                          <span className="font-mono font-bold text-[#660099] bg-purple-100 px-1.5 py-0.2 rounded">
                            {rep?.maxCompleteKits} kits
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-3 bg-[#FAF7FC] border-t border-purple-50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {canEdit && (
                    <button
                      onClick={() => onOpenEditLocation(loc)}
                      className="p-1.5 text-slate-600 hover:text-[#660099] rounded-lg transition-colors cursor-pointer"
                      title="Editar informações"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                      <button
                        onClick={() => handleDelete(loc)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                        title="Excluir localidade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                </div>

                <button
                  onClick={() => onSelectLocationForViewing(loc.id)}
                  className="px-3 py-1.5 text-xs font-bold text-[#660099] bg-purple-100/60 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Filtrar Este Estoque <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Almoxarifado</th>
                  <th className="py-3.5 px-4 text-center">EPIs Cadastrados</th>
                  <th className="py-3.5 px-4 text-center">Total Unidades</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {locations.map(loc => {
                  const locItems = items.filter(i => i.locationId === loc.id);
                  const totalUnits = locItems.reduce((sum, i) => sum + i.quantity, 0);
                  const criticalCount = locItems.filter(i => i.quantity <= i.minQuantity).length;
                  const isUserAssigned = currentUser.locationIds.includes(loc.id) || currentUser.locationIds.includes('ALL');

                  return (
                    <tr key={loc.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{loc.name} <span className="text-purple-600 uppercase text-[10px] bg-purple-50 px-1 rounded ml-1">{loc.code}</span></span>
                          <span className="text-[11px] text-slate-500">{loc.responsibleName || 'Sem almoxarife'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{locItems.length}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">{totalUnits}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${criticalCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#660099] text-white'}`}>
                          {criticalCount > 0 ? `${criticalCount} em alerta` : '100% Regular'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <button
                              onClick={() => onOpenEditLocation(loc)}
                              className="p-1.5 text-slate-600 hover:text-[#660099] rounded-lg transition-colors cursor-pointer"
                              title="Editar informações"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(loc)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                              title="Excluir localidade"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectLocationForViewing(loc.id)}
                            className="p-1.5 text-slate-600 hover:text-[#660099] rounded-lg transition-colors cursor-pointer"
                            title="Filtrar Este Estoque"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
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
          setLocationToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Almoxarifado"
        itemName={locationToDelete ? locationToDelete.name : ''}
      />

    </div>
  );
};
