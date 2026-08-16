import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { EpiKit, KitComponent } from '../../types';

interface KitModalProps {
  isOpen: boolean;
  onClose: () => void;
  kitToEdit?: EpiKit | null;
}

export const KitModal: React.FC<KitModalProps> = ({ isOpen, onClose, kitToEdit }) => {
  const { items, addKit, updateKit } = useStock();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Telecom & Fibra');
  const [type, setType] = useState<'EPI_EPC' | 'ERGONOMICO'>('EPI_EPC');
  const [description, setDescription] = useState('');
  const [components, setComponents] = useState<KitComponent[]>([]);

  // Unique list of item templates (distinct by name or CA)
  const uniqueItemOptions = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; caNumber: string; unit: string }>();
    items.forEach(i => {
      const isErgonomico = i.type === 'ERGONOMICO';
      const matchesType = type === 'ERGONOMICO' ? isErgonomico : !isErgonomico;

      if (matchesType && !map.has(i.name)) {
        map.set(i.name, {
          id: i.id,
          name: i.name,
          caNumber: i.caNumber,
          unit: i.unit,
        });
      }
    });
    return Array.from(map.values());
  }, [items, type]);

  useEffect(() => {
    if (kitToEdit) {
      setName(kitToEdit.name);
      setCode(kitToEdit.code);
      setCategory(kitToEdit.category || 'Telecom & Fibra');
      setType(kitToEdit.type || 'EPI_EPC');
      setDescription(kitToEdit.description);
      setComponents(kitToEdit.components);
    } else {
      setName('');
      setCode('KIT-VIV-' + Math.floor(100 + Math.random() * 900));
      setCategory('Telecom & Fibra');
      setType('EPI_EPC');
      setDescription('');
      if (uniqueItemOptions.length >= 2) {
        setComponents([
          {
            itemId: uniqueItemOptions[0]?.id || '',
            itemName: uniqueItemOptions[0]?.name || '',
            requiredQuantity: 1,
            unit: uniqueItemOptions[0]?.unit || 'un',
          },
          {
            itemId: uniqueItemOptions[1]?.id || '',
            itemName: uniqueItemOptions[1]?.name || '',
            requiredQuantity: 1,
            unit: uniqueItemOptions[1]?.unit || 'un',
          }
        ]);
      } else {
        setComponents([]);
      }
    }
  }, [kitToEdit, isOpen, uniqueItemOptions]);

  if (!isOpen) return null;

  const handleAddComponent = () => {
    if (uniqueItemOptions.length === 0) return;
    const defaultOpt = uniqueItemOptions[0];
    setComponents(prev => [
      ...prev,
      {
        itemId: defaultOpt.id,
        itemName: defaultOpt.name,
        requiredQuantity: 1,
        unit: defaultOpt.unit,
      }
    ]);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleComponentItemChange = (index: number, itemId: string) => {
    const selected = uniqueItemOptions.find(opt => opt.id === itemId);
    if (!selected) return;

    setComponents(prev => prev.map((comp, idx) => {
      if (idx === index) {
        return {
          ...comp,
          itemId: selected.id,
          itemName: selected.name,
          unit: selected.unit,
        };
      }
      return comp;
    }));
  };

  const handleComponentQtyChange = (index: number, qty: number) => {
    const validQty = Math.max(1, qty);
    setComponents(prev => prev.map((comp, idx) => {
      if (idx === index) {
        return { ...comp, requiredQuantity: validQty };
      }
      return comp;
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Informe o nome do Kit de EPI.');
      return;
    }

    if (components.length === 0) {
      alert('Adicione pelo menos um componente ao Kit.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim().toUpperCase() || 'KIT-VIV-' + Math.floor(100 + Math.random() * 900),
        category: category.trim(),
        type,
        description: description.trim(),
        components: components.map(c => ({
          itemId: c.itemId,
          itemName: c.itemName,
          quantity: c.requiredQuantity || c.quantity || 1,
          requiredQuantity: c.requiredQuantity || c.quantity || 1,
          unit: c.unit || 'un',
        })),
      };

      if (kitToEdit) {
        await updateKit(kitToEdit.id, payload);
      } else {
        await addKit(payload);
      }

      onClose();
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar Kit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-purple-100 shadow-2xl max-w-2xl w-full overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-purple-900 bg-[#660099] flex items-center justify-between shrink-0">
          <h3 className="font-bold text-white text-lg tracking-tight">
            {kitToEdit ? 'Editar Composição do Kit Vivo' : 'Criar Nova Composição de Kit Vivo'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tipo de Kit *</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as any);
                  setComponents([]); // reset components when type changes
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white text-slate-900 font-medium"
              >
                <option value="EPI_EPC">EPIs e EPCs</option>
                <option value="ERGONOMICO">Ergonômicos</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Nome do Kit *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'ERGONOMICO' ? "Ex: Kit Home Office Básico" : "Ex: Kit Técnico de Instalação Fibra & Altura"}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white text-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Código do Kit</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: KIT-FIBRA-01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Categoria Operacional</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Telecom & Fibra, Altura, Manutenção Elétrica"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Finalidade / Aplicação</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Conjunto padrão para instalação externa em postes e fachadas"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900"
              />
            </div>
          </div>

          {/* Components Builder Section */}
          <div className="pt-2 border-t border-purple-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Itens Componentes do Kit</h4>
                <p className="text-xs text-slate-500">Defina os EPIs e a quantidade necessária de cada um para compor 1 kit.</p>
              </div>

              <button
                type="button"
                onClick={handleAddComponent}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#660099] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Item
              </button>
            </div>

            {components.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-purple-200 text-xs">
                Nenhum componente adicionado. Clique no botão acima para adicionar EPIs a este kit.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {components.map((comp, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF7FC] border border-purple-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                    
                    {/* Item Selector */}
                    <div className="flex-1 min-w-0">
                      <select
                        value={comp.itemId}
                        onChange={(e) => handleComponentItemChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium truncate focus:ring-2 focus:ring-[#660099]"
                      >
                        {uniqueItemOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name} ({opt.caNumber})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity Needed */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-slate-500 font-medium">Qtd:</span>
                      <input
                        type="number"
                        min="1"
                        value={comp.requiredQuantity}
                        onChange={(e) => handleComponentQtyChange(idx, parseInt(e.target.value, 10) || 1)}
                        className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#660099]"
                      />
                      <span className="text-slate-500 text-xs">{comp.unit}</span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="Remover componente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-purple-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-bold shadow-sm shadow-purple-950/20 transition-all cursor-pointer"
            >
              {kitToEdit ? 'Salvar Kit' : 'Criar Kit de EPI'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
