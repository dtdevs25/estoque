import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, AlertCircle, EyeOff, Eye, CheckCircle2 } from 'lucide-react';
import * as apiService from '../services/api';
import logoApp from '../../Logos/logo.png';
import logoVivo from '../../Logos/logovivo.png';

// Reuse the background from LoginView
const VIVO_FLOATING_LOGOS = [
  { id: 1, style: { top: '6%', left: '6%' }, size: 'h-20 sm:h-28', opacity: 'opacity-20', duration: 11, y: [-15, 15, -15], x: [-10, 10, -10], rotate: [-6, 8, -6] },
  { id: 2, style: { top: '8%', right: '8%' }, size: 'h-16 sm:h-24', opacity: 'opacity-20', duration: 14, y: [15, -15, 15], x: [10, -10, 10], rotate: [8, -8, 8] },
  { id: 3, style: { bottom: '8%', left: '8%' }, size: 'h-18 sm:h-26', opacity: 'opacity-20', duration: 12, y: [-18, 18, -18], x: [12, -12, 12], rotate: [-8, 6, -8] },
  { id: 4, style: { bottom: '10%', right: '10%' }, size: 'h-24 sm:h-36', opacity: 'opacity-22', duration: 13, y: [20, -20, 20], x: [-15, 15, -15], rotate: [10, -10, 10] },
  { id: 5, style: { top: '48%', left: '4%' }, size: 'h-14 sm:h-20', opacity: 'opacity-15', duration: 10, y: [-12, 12, -12], x: [8, -8, 8], rotate: [-10, 10, -10] },
  { id: 6, style: { top: '45%', right: '5%' }, size: 'h-14 sm:h-20', opacity: 'opacity-15', duration: 15, y: [12, -12, 12], x: [-8, 8, -8], rotate: [10, -10, 10] },
];

export const ResetPasswordView: React.FC = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) setToken(urlToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.auth.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Token inválido ou expirado. Solicite um novo link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2a0040] via-[#660099] to-[#1a0029] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <motion.div animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-10 left-12 w-80 sm:w-96 h-80 sm:h-96 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none" />
      <motion.div animate={{ y: [0, 35, 0], x: [0, -25, 0], scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-10 right-12 w-[22rem] sm:w-[30rem] h-[22rem] sm:h-[30rem] bg-fuchsia-600/25 rounded-full blur-[120px] pointer-events-none" />
      
      {VIVO_FLOATING_LOGOS.map((item) => (
        <motion.img key={item.id} src={logoVivo} alt="" style={item.style} animate={{ y: item.y, x: item.x, rotate: item.rotate }} transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut' }} className={\`absolute \${item.size} \${item.opacity} brightness-0 invert pointer-events-none object-contain\`} />
      ))}

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full max-w-sm relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-10 min-h-[500px] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/20 blur-2xl rounded-full pointer-events-none" />
          
          <div className="text-center pt-2 pb-6 relative">
            <div className="flex items-center justify-center gap-3.5 mb-3">
              <img src={logoVivo} alt="Vivo" className="h-9 object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
              <div className="h-7 w-px bg-white/30" />
              <img src={logoApp} alt="Logo" className="h-11 object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
            </div>
            <p className="text-purple-200/90 text-sm font-semibold tracking-wide">Redefinição de Senha</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center my-auto">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Senha Definida!</h3>
                <p className="text-purple-200 text-sm">Sua senha foi alterada com sucesso. Você já pode acessar o sistema.</p>
              </div>
              <button onClick={handleGoToLogin} className="w-full py-3.5 bg-white text-[#660099] font-extrabold rounded-xl transition-all shadow-xl hover:bg-purple-50 active:scale-[0.99] mt-4">
                Ir para o Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 relative my-auto">
              {errorMessage && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 bg-rose-500/20 border border-rose-400/40 text-rose-100 px-4 py-3 rounded-xl text-xs backdrop-blur-md">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-200" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all text-sm font-medium" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-200 hover:text-white transition-colors p-1" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-200" />
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all text-sm font-medium" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-200 hover:text-white transition-colors p-1" tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white text-[#660099] font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-purple-50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-3 text-sm tracking-wide">
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-[#660099]/30 border-t-[#660099] rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Definir Senha</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button type="button" onClick={handleGoToLogin} className="text-xs text-purple-200 hover:text-white font-bold underline transition-colors">Voltar ao login</button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
