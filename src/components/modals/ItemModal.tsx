import React, { useState, useEffect } from 'react';
import { X, Upload, Package, ShieldCheck, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { EpiItem, CategoryType } from '../../types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: EpiItem | null;
  defaultType?: 'EPI' | 'EPC' | 'ERGONOMICO';
}

const CATEGORIES: CategoryType[] = [
  'Proteção da Cabeça',
  'Proteção Visual e Facial',
  'Proteção Auditiva',
  'Proteção Respiratória',
  'Proteção das Mãos e Braços',
  'Proteção dos Pés e Pernas',
  'Proteção contra Quedas (Altura)',
  'Vestimentas e Corpo Inteiro',
  'Ergonomia',
];

const DEFAULT_SAMPLE_IMAGES: { [key in CategoryType]: string } = {
  'Proteção da Cabeça': 'https://images.unsplash.com/photo-1578873375969-d71a6e38ea3c?w=400&auto=format&fit=crop&q=80',
  'Proteção Visual e Facial': 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&auto=format&fit=crop&q=80',
  'Proteção Auditiva': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
  'Proteção Respiratória': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&auto=format&fit=crop&q=80',
  'Proteção das Mãos e Braços': 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400&auto=format&fit=crop&q=80',
  'Proteção dos Pés e Pernas': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
  'Proteção contra Quedas (Altura)': 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=400&auto=format&fit=crop&q=80',
  'Vestimentas e Corpo Inteiro': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=80',
  'Ergonomia': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80',
};

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, itemToEdit, defaultType = 'EPI' }) => {
  const { locations, addItem, updateItem, selectedLocationId } = useStock();

  const [type, setType] = useState<'EPI' | 'EPC' | 'ERGONOMICO'>(defaultType);
  const [name, setName] = useState('');
  const [caNumber, setCaNumber] = useState('');
  const [caValidity, setCaValidity] = useState('');
  const [category, setCategory] = useState<CategoryType>('Proteção da Cabeça');
  const [unit, setUnit] = useState<'un' | 'par' | 'cj' | 'pct'>('un');
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [minQuantity, setMinQuantity] = useState<number>(5);
  const [locationId, setLocationId] = useState<string>(locations[0]?.id || '');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setType(itemToEdit.type || defaultType);
      setName(itemToEdit.name);
      setCaNumber(itemToEdit.caNumber);
      setCaValidity(itemToEdit.caValidity || '');
      setCategory(itemToEdit.category);
      setUnit(itemToEdit.unit);
      setImageUrl(itemToEdit.imageUrl);
      setQuantity(itemToEdit.quantity);
      setMinQuantity(itemToEdit.minQuantity);
      setLocationId(itemToEdit.locationId);
      setCostPrice(itemToEdit.costPrice || 0);
      setBrand(itemToEdit.brand || '');
      setDescription(itemToEdit.description || '');
    } else {
      setType(defaultType);
      setName('');
      setCaNumber('');
      setCaValidity('');
      const defaultCat = defaultType === 'ERGONOMICO' ? 'Ergonomia' : 'Proteção da Cabeça';
      setCategory(defaultCat);
      setUnit('un');
      setImageUrl(DEFAULT_SAMPLE_IMAGES[defaultCat]);
      setQuantity(20);
      setMinQuantity(5);
      setLocationId(selectedLocationId !== 'ALL' ? selectedLocationId : (locations[0]?.id || ''));
      setCostPrice(35);
      setBrand('');
      setDescription('');
    }
  }, [itemToEdit, isOpen, locations, selectedLocationId, defaultType]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: 'EPI' | 'EPC' | 'ERGONOMICO') => {
    setType(newType);
    if (newType === 'ERGONOMICO') {
      handleCategoryChange('Ergonomia');
    } else if (category === 'Ergonomia') {
      handleCategoryChange('Proteção da Cabeça');
    }
  };

  const handleCategoryChange = (newCat: CategoryType) => {
    setCategory(newCat);
    if (!itemToEdit && (!imageUrl || Object.values(DEFAULT_SAMPLE_IMAGES).includes(imageUrl))) {
      setImageUrl(DEFAULT_SAMPLE_IMAGES[newCat] || '');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !locationId) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type,
        name: name.trim(),
        caNumber: caNumber.trim().toUpperCase(),
        caValidity,
        category,
        unit,
        imageUrl: imageUrl || DEFAULT_SAMPLE_IMAGES[category],
        quantity: Number(quantity),
        minQuantity: Number(minQuantity),
        locationId,
        costPrice: Number(costPrice) || 0,
        brand: brand.trim(),
        description: description.trim(),
      };

      if (itemToEdit) {
        await updateItem(itemToEdit.id, payload);
      } else {
        await addItem(payload);
      }

      onClose();
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-purple-100 shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-purple-900 bg-[#660099] flex items-center justify-between shrink-0">
          <h3 className="font-bold text-white text-lg tracking-tight">
            {itemToEdit 
              ? (itemToEdit.type === 'ERGONOMICO' ? 'Editar Ergonômico' : 'Editar Dados do Item') 
              : (defaultType === 'ERGONOMICO' ? 'Cadastrar Novo Ergonômico' : 'Cadastrar Novo EPI / EPC')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden text-xs sm:text-sm">
          
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Type, Name & CA Number */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tipo *</label>
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white text-slate-900 font-medium"
                >
                  <option value="EPI">EPI</option>
                  <option value="EPC">EPC</option>
                  <option value="ERGONOMICO">Ergonômico</option>
                </select>
              </div>

              <div className={type === 'ERGONOMICO' ? "sm:col-span-3" : "sm:col-span-2"}>
                <label className="block text-slate-700 font-bold mb-1">Nome do Item *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={type === 'ERGONOMICO' ? "Ex: Suporte de Notebook" : "Ex: Capacete de Segurança Classe B..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white text-slate-900 font-medium"
                  required
                />
              </div>

              {type !== 'ERGONOMICO' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nº CA</label>
                  <input
                    type="text"
                    value={caNumber}
                    onChange={(e) => setCaNumber(e.target.value)}
                    placeholder="Ex: 31469"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white font-mono font-bold text-slate-900"
                  />
                </div>
              )}
            </div>

          {/* Category, Unit and Validity */}
          <div className={`grid grid-cols-1 ${type === 'ERGONOMICO' ? 'sm:grid-cols-1' : 'sm:grid-cols-3'} gap-3`}>
            {type !== 'ERGONOMICO' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Categoria de Proteção *</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900 font-medium"
                >
                  {CATEGORIES.filter(cat => cat !== 'Ergonomia').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Unidade de Medida *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900 font-medium"
              >
                <option value="un">Unidade (un)</option>
                <option value="par">Par (par)</option>
                <option value="cj">Conjunto (cj)</option>
                <option value="pct">Pacote (pct)</option>
              </select>
            </div>

            {type !== 'ERGONOMICO' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Validade do CA</label>
                <input
                  type="date"
                  value={caValidity}
                  onChange={(e) => setCaValidity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Location, Quantity, Min Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF7FC] rounded-xl border border-purple-100">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Almoxarifado Vinculado *</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900 font-medium"
                required
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Estoque Atual *</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] font-mono font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Estoque Mínimo (Alerta) *</label>
              <input
                type="number"
                min="0"
                value={minQuantity}
                onChange={(e) => setMinQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] font-mono font-bold text-amber-700"
                required
              />
            </div>
          </div>

          {/* Brand & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fabricante / Marca</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: 3M, MSA, Marluvas, Danny"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Custo Médio Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">Foto do Equipamento</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {imageUrl && !Object.values(DEFAULT_SAMPLE_IMAGES).includes(imageUrl) ? (
                <div className="relative group shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl(DEFAULT_SAMPLE_IMAGES[category])}
                    className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-rose-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Sem Foto</span>
                </div>
              )}
              
              <div className="flex-1 w-full">
                <label className="flex flex-col items-center justify-center w-full h-20 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-[#660099] hover:bg-purple-50 focus:outline-none">
                  <span className="flex flex-col sm:flex-row items-center space-x-2 text-center sm:text-left">
                    <Upload className="w-5 h-5 text-[#660099] mb-1 sm:mb-0" />
                    <span className="font-medium text-slate-600 text-sm">
                      Clique para anexar do seu dispositivo
                    </span>
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Carregue imagens nos formatos JPG, PNG ou GIF.</p>
              </div>
            </div>
          </div>

            {/* Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Descrição / Especificações Técnicas</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Fabricado em polietileno com absorvedor de impacto e jugular de fixação..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-purple-50 flex items-center justify-end gap-2 shrink-0 bg-[#FAF7FC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-bold shadow-sm shadow-purple-950/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Salvando...' : (itemToEdit ? 'Salvar Alterações' : 'Cadastrar EPI')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
