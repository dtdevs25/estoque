import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, Box, Eye, Building2, Mail, Briefcase, CheckCircle2, User } from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { AppUser, UserRole } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: AppUser | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { locations, addUser, updateUser } = useStock();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('CONTROLLER');
  const [locationIds, setLocationIds] = useState<string[]>(['ALL']);
  const [department, setDepartment] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'CONTROLLER');
      setLocationIds(Array.isArray(userToEdit.locationIds) ? userToEdit.locationIds : ['ALL']);
      setDepartment(userToEdit.department || '');
      setNotes(userToEdit.notes || '');
      setStatus(userToEdit.status || 'ATIVO');
    } else {
      setName('');
      setEmail('');
      setRole('CONTROLLER');
      setLocationIds(['ALL']);
      setDepartment('');
      setNotes('');
      setStatus('ATIVO');
    }
  }, [userToEdit, isOpen, locations]);

  if (!isOpen) return null;

  const safeLocationIds = Array.isArray(locationIds) ? locationIds : ['ALL'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Preencha o nome e e-mail do usuário.');
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      locationIds: role === 'ADMIN' ? ['ALL'] : (safeLocationIds.length === 0 ? ['ALL'] : safeLocationIds),
      department: department.trim(),
      notes: notes.trim(),
      status,
    };

    if (userToEdit) {
      updateUser(userToEdit.id, payload);
    } else {
      addUser(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-purple-100 shadow-2xl max-w-xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900 bg-[#660099] flex items-center justify-between shrink-0">
          <h3 className="font-bold text-white text-base sm:text-lg tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-200" />
            <span>{userToEdit ? 'Editar Usuário & Permissões' : 'Cadastrar Novo Usuário'}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden text-xs sm:text-sm">
          
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silveira"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">E-mail Corporativo *</label>
                  {userToEdit && (
                    <button
                      type="button"
                      onClick={() => alert(`Link de redefinição de senha enviado para ${email}`)}
                      className="text-[10px] text-[#660099] hover:text-[#52007a] font-bold underline px-1 cursor-pointer"
                    >
                      Reenviar Senha
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos.silveira@telefonica.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] focus:bg-white text-slate-900 font-medium"
                  required
                />
                {!userToEdit && (
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#660099]" /> O usuário receberá um e-mail para criar a senha.
                  </p>
                )}
              </div>
            </div>

            {/* Role Selector with Visual Cards */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Nível de Acesso (Perfil) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('ADMIN');
                    setLocationIds(['ALL']);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'ADMIN'
                      ? 'border-[#660099] bg-purple-50/80 ring-2 ring-[#660099]'
                      : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#660099] text-white flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    {role === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#660099]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Administrador</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Acesso total: gerencia usuários, todos os almoxarifados e configurações.
                    </p>
                  </div>
                </button>

                {/* Controller */}
                <button
                  type="button"
                  onClick={() => setRole('CONTROLLER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'CONTROLLER'
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Box className="w-4 h-4" />
                    </div>
                    {role === 'CONTROLLER' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Controlador</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Gerencia e movimenta o estoque específico vinculado.
                    </p>
                  </div>
                </button>

                {/* Viewer */}
                <button
                  type="button"
                  onClick={() => setRole('VIEWER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'VIEWER'
                      ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-700'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                    {role === 'VIEWER' && <CheckCircle2 className="w-4 h-4 text-slate-800" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Visualizador</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Somente leitura: consulta saldos, histórico e kits sem poder alterar.
                    </p>
                  </div>
                </button>

              </div>
            </div>

            {/* Linked Location (Almoxarifado Vinculado) */}
            <div className="p-3 bg-[#FAF7FC] rounded-xl border border-purple-100">
              <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                <span>Almoxarifado Vinculado ao Usuário *</span>
                {role === 'ADMIN' && (
                  <span className="text-[10px] text-[#660099] font-semibold bg-purple-100 px-2 py-0.5 rounded">
                    Admin tem acesso global
                  </span>
                )}
              </label>

              {role === 'ADMIN' ? (
                <div className="p-2.5 bg-white border border-purple-200 rounded-lg text-xs font-semibold text-[#660099] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#660099]" />
                  <span>🏢 Todas as Localidades (Acesso Irrestrito)</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="max-h-36 overflow-y-auto bg-white border border-slate-200 rounded-lg p-2 space-y-1 scrollbar-thin">
                    <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-xs font-medium text-slate-800">
                      <input 
                        type="checkbox"
                        checked={safeLocationIds.includes('ALL')}
                        onChange={(e) => {
                          if (e.target.checked) setLocationIds(['ALL']);
                          else setLocationIds([]);
                        }}
                        className="rounded border-slate-300 text-[#660099] focus:ring-[#660099]"
                      />
                      🏢 Todos os Almoxarifados (Visão Ampla)
                    </label>
                    {locations.map(loc => (
                      <label key={loc.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-xs font-medium text-slate-800">
                        <input 
                          type="checkbox"
                          checked={safeLocationIds.includes(loc.id) && !safeLocationIds.includes('ALL')}
                          disabled={safeLocationIds.includes('ALL')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocationIds(prev => (Array.isArray(prev) ? prev : []).filter(id => id !== 'ALL').concat(loc.id));
                            } else {
                              setLocationIds(prev => (Array.isArray(prev) ? prev : []).filter(id => id !== loc.id));
                            }
                          }}
                          className="rounded border-slate-300 text-[#660099] focus:ring-[#660099]"
                        />
                        📍 {loc.name} ({loc.code})
                      </label>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {role === 'CONTROLLER' 
                      ? 'O controlador poderá operar o estoque apenas nas localidades selecionadas.'
                      : 'O visualizador consultará os saldos e relatórios dos almoxarifados selecionados.'}
                  </span>
                </div>
              )}
            </div>

            {/* Department & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Departamento / Área</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Operações de Campo, SESMT, Logística"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Status da Conta</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'ATIVO' | 'INATIVO')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900 font-medium"
                >
                  <option value="ATIVO">🟢 Ativo (Acesso Liberado)</option>
                  <option value="INATIVO">🔴 Inativo (Bloqueado)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Observações Internas</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Responsável pelo recebimento diário de materiais e inventário físico..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#660099] text-slate-900 text-xs"
              />
            </div>

          </div>

          {/* Fixed Footer Actions */}
          <div className="shrink-0 bg-[#FAF7FC] p-4 border-t border-purple-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer text-xs sm:text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#660099] hover:bg-[#52007a] text-white rounded-xl font-extrabold shadow-md shadow-purple-950/20 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
            >
              {userToEdit ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
