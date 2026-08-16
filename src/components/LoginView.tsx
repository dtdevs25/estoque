import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound, CheckCircle2, ShieldCheck, X, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#2a0040] via-[#660099] to-[#1a0029] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Animated Floating Background Orbs / Vivo Symbols */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 left-12 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          y: [0, 35, 0],
          x: [0, -25, 0],
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 right-12 w-[30rem] h-[30rem] bg-fuchsia-600/25 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          y: [-15, 20, -15],
          x: [-10, 15, -10],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-400/20 rounded-full blur-[90px] pointer-events-none"
      />

      {/* Floating Animated Vivo Decorative Particle Shapes */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-16 right-20 text-white/10 pointer-events-none hidden md:block"
      >
        <Sparkles className="w-24 h-24" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-16 left-20 text-white/10 pointer-events-none hidden md:block"
      >
        <Sparkles className="w-28 h-28" />
      </motion.div>

      {/* Main Glassmorphism Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
          {/* Subtle Top Glow inside Card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/20 blur-2xl rounded-full pointer-events-none" />

          {/* White Logos Header */}
          <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={logoVivo}
                alt="Vivo"
                className="h-8 object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
              />
              <div className="h-6 w-px bg-white/30" />
              <img
                src={logoApp}
                alt="EstoqueEPI"
                className="h-11 object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">EstoqueEPI</h1>
            <p className="text-purple-200/90 text-sm mt-1 font-medium">Gestão de Equipamentos & Almoxarifado</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5 relative">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-rose-500/20 border border-rose-400/40 text-rose-100 px-4 py-3 rounded-xl text-sm backdrop-blur-md"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-200" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-200" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-200 hover:text-white transition-colors p-1 cursor-pointer"
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
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-400 cursor-pointer"
                />
                <span className="text-xs text-purple-200 font-medium">Lembrar-me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotSuccess(false);
                  setForgotError('');
                  setForgotEmail('');
                }}
                className="text-xs text-purple-200 hover:text-white font-bold underline transition-colors cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-[#660099] font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-purple-50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-3 text-sm tracking-wide"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-[#660099]/30 border-t-[#660099] rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge Footer */}
          <div className="mt-8 pt-6 border-t border-white/15 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-purple-100 font-medium backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Acesso Seguro com Criptografia</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Standardized Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
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
                    Se o e-mail informado estiver cadastrado, você receberá o link para redefinição em instantes.
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
          </motion.div>
        </div>
      )}
    </div>
  );
};
