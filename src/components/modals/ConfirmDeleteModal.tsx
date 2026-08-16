import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-rose-100 shadow-2xl max-w-md w-full flex flex-col overflow-hidden my-8 transform transition-all">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-purple-900 bg-[#660099] flex items-center justify-between shrink-0">
          <h3 className="font-bold text-white text-lg tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Você está prestes a excluir <strong className="text-slate-900">{itemName}</strong> do banco de dados. 
            Esta ação <strong className="text-rose-600 font-bold">não poderá ser desfeita</strong> e os dados serão removidos permanentemente.
          </p>
          <p className="text-sm font-semibold text-rose-700">
            Deseja continuar com a exclusão?
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-purple-50 flex items-center justify-end gap-2 shrink-0 bg-[#FAF7FC]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-bold shadow-sm shadow-purple-900/20 transition-all cursor-pointer text-sm"
          >
            Sim, Excluir
          </button>
        </div>

      </div>
    </div>
  );
};
