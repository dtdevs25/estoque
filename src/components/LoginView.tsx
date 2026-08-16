import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useStock } from '../context/StockContext';
import * as apiService from '../services/api';
import logoApp from '../../Logos/logo.png';
import logoVivo from '../../Logos/logovivo.png';

export const LoginView: React.FC = () => {
  const { login } = useStock();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Por favor, informe sua senha.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotEmail.trim()) {
      setForgotError('Por favor, informe o seu e-mail cadastrado.');
      return;
    }

    setForgotLoading(true);
    try {
      await apiService.auth.forgotPassword(forgotEmail.trim().toLowerCase());
      setForgotSuccess(true);
    } catch {
      setForgotError('Erro ao enviar solicitação. Tente novamente em instantes.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-slate-50 to-purple-200/60 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 transition-all">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-5">
              <img src={logoVivo} alt="Vivo" className="h-7 object-contain" />
              <div className="h-6 w-px bg-slate-200" />
              <img src={logoApp} alt="EstoqueEPI" className="h-10 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">EstoqueEPI</h1>
            <p className="text-slate-500 text-sm mt-1">Gestão Inteligente de Estoque e EPIs</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#660099] focus:border-transparent transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#660099] focus:border-transparent transition-all text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#660099] focus:ring-[#660099] cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Lembrar-me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotSuccess(false);
                  setForgotError('');
                  setForgotEmail('');
                }}
                className="text-xs text-[#660099] font-bold hover:underline transition-colors cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#660099] hover:bg-[#52007a] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer badge */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#660099]" />
              <span>Ambiente Seguro e Autenticado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standardized Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Standardized Purple Header */}
            <div className="bg-[#660099] px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                <span>Recuperar Senha</span>
              </h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {forgotSuccess ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">E-mail de recuperação enviado!</h4>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto">
                    Se o e-mail informado estiver cadastrado em nosso sistema, você receberá o link para redefinição em instantes.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsForgotModalOpen(false)}
                      className="px-6 py-2.5 bg-[#660099] text-white font-bold rounded-xl hover:bg-[#52007a] transition-all shadow-md cursor-pointer"
                    >
                      Voltar ao Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Digite seu e-mail cadastrado. Enviaremos as instruções necessárias para você redefinir sua senha com segurança.
                  </p>

                  {forgotError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2.5 rounded-xl text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 text-xs font-bold mb-1">
                      Seu E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="seu.email@empresa.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#660099] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Standardized Modal Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-5 py-2.5 bg-[#660099] text-white font-bold rounded-xl hover:bg-[#52007a] transition-colors text-sm disabled:opacity-60 cursor-pointer shadow-md"
                    >
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
