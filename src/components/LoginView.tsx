import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound, CheckCircle2, X } from 'lucide-react';
import { useStock } from '../context/StockContext';
import * as apiService from '../services/api';
import logoApp from '../../Logos/logo.png';
import logoVivo from '../../Logos/logovivo.png';

// Configuration for 16 floating Vivo background logos
const VIVO_FLOATING_LOGOS = [
  { id: 1, style: { top: '3%', left: '4%' }, size: 'h-20 sm:h-32', opacity: 'opacity-25', duration: 10, y: [-20, 30, -20], x: [-10, 20, -10], rotate: [-8, 12, -8] },
  { id: 2, style: { bottom: '4%', right: '5%' }, size: 'h-24 sm:h-44', opacity: 'opacity-25', duration: 13, y: [20, -40, 20], x: [15, -25, 15], rotate: [12, -15, 12] },
  { id: 3, style: { top: '20%', right: '6%' }, size: 'h-16 sm:h-24', opacity: 'opacity-20', duration: 15, y: [-30, 25, -30], x: [-20, 25, -20], rotate: [0, -20, 0] },
  { id: 4, style: { bottom: '18%', left: '3%' }, size: 'h-14 sm:h-22', opacity: 'opacity-20', duration: 12, y: [35, -25, 35], x: [25, -20, 25], rotate: [20, 0, 20] },
  { id: 5, style: { top: '42%', left: '16%' }, size: 'h-12 sm:h-18', opacity: 'opacity-18', duration: 9, y: [-15, 20, -15], x: [15, -15, 15], rotate: [-15, 15, -15] },
  { id: 6, style: { top: '8%', right: '28%' }, size: 'h-16 sm:h-24', opacity: 'opacity-18', duration: 16, y: [20, -20, 20], x: [-12, 18, -12], rotate: [10, -10, 10] },
  { id: 7, style: { bottom: '2%', left: '42%' }, size: 'h-18 sm:h-28', opacity: 'opacity-22', duration: 14, y: [-25, 25, -25], x: [25, -25, 25], rotate: [-5, 15, -5] },
  { id: 8, style: { top: '28%', left: '3%' }, size: 'h-12 sm:h-16', opacity: 'opacity-15', duration: 11, y: [15, -20, 15], x: [-15, 12, -15], rotate: [-10, 10, -10] },
  { id: 9, style: { bottom: '32%', right: '4%' }, size: 'h-16 sm:h-20', opacity: 'opacity-18', duration: 13.5, y: [-20, 18, -20], x: [12, -18, 12], rotate: [15, -8, 15] },
  { id: 10, style: { top: '2%', left: '42%' }, size: 'h-14 sm:h-18', opacity: 'opacity-15', duration: 17, y: [18, -25, 18], x: [8, -12, 8], rotate: [-12, 18, -12] },
  { id: 11, style: { bottom: '12%', left: '26%' }, size: 'h-16 sm:h-22', opacity: 'opacity-18', duration: 12.5, y: [-12, 30, -12], x: [-12, 22, -12], rotate: [8, -18, 8] },
  { id: 12, style: { top: '62%', right: '20%' }, size: 'h-12 sm:h-16', opacity: 'opacity-15', duration: 10.5, y: [22, -18, 22], x: [-18, 15, -18], rotate: [-15, 12, -15] },
  { id: 13, style: { top: '14%', left: '70%' }, size: 'h-14 sm:h-20', opacity: 'opacity-20', duration: 14.5, y: [-18, 22, -18], x: [20, -15, 20], rotate: [12, -12, 12] },
  { id: 14, style: { bottom: '42%', left: '68%' }, size: 'h-10 sm:h-14', opacity: 'opacity-14', duration: 8.5, y: [12, -15, 12], x: [-10, 12, -10], rotate: [-6, 14, -6] },
  { id: 15, style: { top: '78%', left: '78%' }, size: 'h-16 sm:h-24', opacity: 'opacity-20', duration: 15.5, y: [-25, 20, -25], x: [18, -18, 18], rotate: [18, -14, 18] },
  { id: 16, style: { top: '48%', right: '82%' }, size: 'h-14 sm:h-18', opacity: 'opacity-15', duration: 11.5, y: [15, -22, 15], x: [-14, 16, -14], rotate: [-10, 16, -10] },
];

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2a0040] via-[#660099] to-[#1a0029] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
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
        className="absolute top-10 left-12 w-80 sm:w-96 h-80 sm:h-96 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none"
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
        className="absolute bottom-10 right-12 w-[22rem] sm:w-[30rem] h-[22rem] sm:h-[30rem] bg-fuchsia-600/25 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Render 16 Floating Animated Vivo Background Logos */}
      {VIVO_FLOATING_LOGOS.map((item) => (
        <motion.img
          key={item.id}
          src={logoVivo}
          alt=""
          style={item.style}
          animate={{
            y: item.y,
            x: item.x,
            rotate: item.rotate,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute ${item.size} ${item.opacity} brightness-0 invert pointer-events-none object-contain`}
        />
      ))}

      {/* Main Glassmorphism Login Card — Taller & 100% Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[350px] sm:max-w-sm relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 min-h-[480px] sm:min-h-[510px] flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle Top Glow inside Card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/20 blur-2xl rounded-full pointer-events-none" />

          {/* White Logos Header */}
          <div className="text-center pt-2 pb-2 relative">
            <div className="flex items-center justify-center gap-3.5 mb-3">
              <img
                src={logoVivo}
                alt="Vivo"
                className="h-8 sm:h-9 object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]"
              />
              <div className="h-6 sm:h-7 w-px bg-white/30" />
              <img
                src={logoApp}
                alt="Logo"
                className="h-10 sm:h-11 object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]"
              />
            </div>
            <p className="text-purple-200/90 text-xs sm:text-sm font-semibold tracking-wide">Gestão de EPI</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5 relative my-auto py-2">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-rose-500/20 border border-rose-400/40 text-rose-100 px-3.5 py-2.5 rounded-xl text-xs backdrop-blur-md"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-purple-100 text-xs font-bold uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-100 text-xs font-bold uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-12 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all text-sm font-medium"
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
        </div>
      </motion.div>

      {/* Standardized Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            {/* Standardized Purple Header */}
            <div className="bg-[#660099] px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Recuperar Senha</span>
              </h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {forgotSuccess ? (
                <div className="text-center py-3 space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">E-mail enviado!</h4>
                  <p className="text-slate-600 text-xs max-w-xs mx-auto">
                    Se o e-mail informado estiver cadastrado, você receberá o link para redefinição em instantes.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsForgotModalOpen(false)}
                      className="px-5 py-2.5 bg-[#660099] text-white font-bold text-sm rounded-xl hover:bg-[#52007a] transition-all shadow-md cursor-pointer"
                    >
                      Voltar ao Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Digite seu e-mail cadastrado. Enviaremos as instruções para você redefinir sua senha com segurança.
                  </p>

                  {forgotError && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs">
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
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-4 py-2 bg-[#660099] text-white font-bold rounded-xl hover:bg-[#52007a] transition-colors text-xs disabled:opacity-60 cursor-pointer shadow-md"
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
