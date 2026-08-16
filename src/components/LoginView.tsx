import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { useStock } from '../context/StockContext';
import * as apiService from '../services/api';
import logoApp from '../../Logos/logo.png';
import logoVivo from '../../Logos/logovivo.png';

export const LoginView: React.FC = () => {
  const { login } = useStock();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('E-mail e senha são obrigatórios.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail.trim()) { setForgotError('Informe seu e-mail.'); return; }
    setForgotLoading(true);
    try {
      await apiService.auth.forgotPassword(forgotEmail.trim().toLowerCase());
      setForgotSuccess(true);
    } catch {
      setForgotError('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logoVivo} alt="Vivo" className="h-8 mx-auto mb-4 opacity-80" />
            <img src={logoApp} alt="EstoqueEPI" className="h-14 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestão de EPIs</h1>
            <p className="text-purple-300/80 text-sm mt-1">Faça login para acessar o sistema</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-purple-200 text-sm font-semibold">Senha</label>
                <button
                  type="button"
                  onClick={() => { setIsForgotModalOpen(true); setForgotSuccess(false); setForgotError(''); setForgotEmail(''); }}
                  className="text-xs text-purple-400 hover:text-purple-200 underline transition-colors cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#660099] hover:bg-[#52007a] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-purple-400/50 text-xs mt-6">
            Sistema protegido — acesso autorizado apenas
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-[#660099] p-5 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> Recuperar Senha
              </h3>
              <button onClick={() => setIsForgotModalOpen(false)} className="text-purple-200 hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="p-6">
              {forgotSuccess ? (
                <div className="text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="text-slate-700 font-semibold">E-mail enviado!</p>
                  <p className="text-slate-500 text-sm">Verifique sua caixa de entrada e siga as instruções.</p>
                  <button onClick={() => setIsForgotModalOpen(false)} className="mt-4 px-6 py-2 bg-[#660099] text-white rounded-xl font-bold cursor-pointer">Fechar</button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-slate-600">Informe seu e-mail e enviaremos um link para redefinir sua senha.</p>
                  {forgotError && <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{forgotError}</p>}
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#660099] text-slate-900"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsForgotModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer">Cancelar</button>
                    <button type="submit" disabled={forgotLoading} className="flex-1 py-2 bg-[#660099] text-white rounded-xl font-bold disabled:opacity-60 cursor-pointer">
                      {forgotLoading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
