/**
 * SharePointSyncPanel
 * ─────────────────────────────────────────────────────────────────────────────
 * Painel de integração com o SharePoint via Power Automate + Office Scripts.
 * Exibe o status da integração, lista de locations SPO e permite disparar
 * sincronizações manualmente (App → SharePoint).
 *
 * O fluxo inverso (SharePoint → App) é acionado pelo Power Automate
 * automaticamente (agendado ou manual) e não precisa de interação aqui.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CloudOff,
  Loader2,
  Share2,
  Building2,
  ChevronDown,
  ChevronUp,
  Send,
  Info,
  Download,
} from 'lucide-react';
import { sharepoint } from '../services/api';

interface SpoLocation {
  id: string;
  name: string;
  code: string;
  responsibleName?: string;
}

interface SyncStatus {
  integration: {
    secretConfigured: boolean;
    webhookConfigured: boolean;
    webhookPullConfigured: boolean;
    ready: boolean;
  };
  spoLocations: SpoLocation[];
}

interface SyncResult {
  location: string;
  sent: number;
  paStatus: number;
}

export const SharePointSyncPanel: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const [syncing, setSyncing] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [lastSyncResult, setLastSyncResult] = useState<{ results: SyncResult[]; at: string } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [pulling, setPulling] = useState(false);
  const [lastPullResult, setLastPullResult] = useState<{ totalUpdated: number; totalMatched: number; summary: any[]; at: string } | null>(null);
  const [pullError, setPullError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState(false);

  // Carrega o status da integração
  const loadStatus = useCallback(async () => {
    setLoadingStatus(true);
    setErrorStatus(null);
    try {
      const data = await sharepoint.status();
      setStatus(data);
      // Por padrão, seleciona todas as locations SPO
      setSelectedCodes([]);
    } catch (e: any) {
      setErrorStatus(e.message || 'Erro ao carregar status.');
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  const toggleLocation = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    setLastSyncResult(null);
    try {
      const result = await sharepoint.push(selectedCodes.length ? selectedCodes : undefined);
      setLastSyncResult({ results: result.results, at: new Date().toLocaleString('pt-BR') });
    } catch (e: any) {
      setSyncError(e.message || 'Erro ao sincronizar.');
    } finally {
      setSyncing(false);
    }
  };

  const handlePull = async () => {
    setPulling(true);
    setPullError(null);
    setLastPullResult(null);
    try {
      const result = await sharepoint.pull();
      setLastPullResult({ ...result, at: new Date().toLocaleString('pt-BR') });
    } catch (e: any) {
      setPullError(e.message || 'Erro ao puxar dados do SharePoint.');
    } finally {
      setPulling(false);
    }
  };

  // ── Renderização do estado de carregamento ────────────────────────────────
  if (loadingStatus) {
    return (
      <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs flex items-center gap-3 text-slate-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
        Verificando integração SharePoint...
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
          <XCircle className="w-4 h-4" />
          Erro ao verificar integração: {errorStatus}
        </div>
        <button
          onClick={loadStatus}
          className="mt-3 text-xs text-red-500 hover:text-red-700 underline cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { integration, spoLocations } = status!;

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="p-5 flex items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-sm shrink-0">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm">
                Sincronização SharePoint
              </span>
              {/* Badge de status */}
              {integration.ready ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Configurado
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                  <AlertTriangle className="w-3 h-3" /> Configuração pendente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {spoLocations.length > 0
                ? `${spoLocations.length} location(s) SPO cadastrada(s) — clique para expandir`
                : 'Nenhuma location SPO cadastrada (code deve começar com "SPO-")'}
            </p>
          </div>
        </button>

        {/* Botões de ação no header */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); loadStatus(); }}
            title="Atualizar status"
            className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Conteúdo expandido ─────────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-purple-50 p-5 space-y-5">

          {/* Checklist de configuração */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status da Configuração</p>
            <ConfigItem
              ok={integration.secretConfigured}
              label="SHAREPOINT_WEBHOOK_SECRET configurado"
            />
            <ConfigItem
              ok={integration.webhookConfigured}
              label="POWER_AUTOMATE_WEBHOOK_URL (PUSH) configurado"
            />
            <ConfigItem
              ok={integration.webhookPullConfigured}
              label="POWER_AUTOMATE_WEBHOOK_PULL_URL (PULL) configurado"
            />
            <ConfigItem
              ok={spoLocations.length > 0}
              label={`Locations SPO cadastradas: ${spoLocations.length} encontrada(s)`}
            />
          </div>

          {/* Sem locations SPO → aviso */}
          {spoLocations.length === 0 && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Cadastre as locations SPO primeiro.</strong><br />
                Acesse <em>Almoxarifados → Novo Almoxarifado</em> e use o code no formato{' '}
                <code className="bg-amber-100 px-1 rounded font-mono">SPO-CAIUBI</code>,{' '}
                <code className="bg-amber-100 px-1 rounded font-mono">SPO-BARRA-FUNDA</code>, etc.
                O nome da coluna na planilha é derivado automaticamente do code.
              </div>
            </div>
          )}

          {/* Seleção de locations para sincronizar */}
          {spoLocations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">Selecionar Locations para Sincronizar:</p>
                <button
                  onClick={() => setSelectedCodes([])}
                  className="text-[11px] text-purple-600 hover:text-purple-800 cursor-pointer font-medium"
                >
                  Selecionar Todas
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {spoLocations.map(loc => {
                  const isSelected = selectedCodes.length === 0 || selectedCodes.includes(loc.code);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => toggleLocation(loc.code)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-400 bg-purple-50 ring-1 ring-purple-300'
                          : 'border-slate-200 bg-slate-50 hover:border-purple-200'
                      }`}
                    >
                      <Building2
                        className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`}
                      />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
                          {loc.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 truncate">{loc.code}</p>
                      </div>
                      <div className={`ml-auto w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors ${
                        isSelected ? 'bg-purple-600 border-purple-600' : 'border-slate-300 bg-white'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botões de ação: PULL e PUSH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* PULL: SharePoint → App */}
            <button
              onClick={handlePull}
              disabled={pulling || syncing || !integration.webhookPullConfigured || spoLocations.length === 0}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
                integration.webhookPullConfigured && spoLocations.length > 0 && !pulling && !syncing
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.98] cursor-pointer'
                  : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
              }`}
            >
              {pulling ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Lendo planilha...</>
              ) : (
                <><Download className="w-4 h-4" /> SharePoint → App</>  
              )}
            </button>

            {/* PUSH: App → SharePoint */}
            <button
              onClick={handleSync}
              disabled={syncing || pulling || !integration.webhookConfigured || spoLocations.length === 0}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                integration.webhookConfigured && spoLocations.length > 0 && !syncing && !pulling
                  ? 'bg-gradient-to-r from-purple-700 to-[#660099] hover:from-purple-800 hover:to-purple-900 text-white shadow-sm shadow-purple-900/30 active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {syncing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                <><Send className="w-4 h-4" /> App → SharePoint</>
              )}
            </button>
          </div>

          {/* Nota informativa */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span>
              <strong>SharePoint → App</strong>: lê a planilha e atualiza o banco (seguro, somente leitura na planilha).<br/>
              <strong>App → SharePoint</strong>: envia os dados do app para a planilha (requer Flow de escrita configurado).
            </span>
          </div>

          {/* Resultado do PULL */}
          {lastPullResult && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pull concluído — {lastPullResult.at}
              </p>
              <div className="flex gap-4 text-[11px] text-emerald-700 font-mono mb-1">
                <span>✓ {lastPullResult.totalMatched} encontrados</span>
                <span>↑ {lastPullResult.totalUpdated} atualizados</span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {lastPullResult.summary?.map((s: any, i: number) => (
                  <div key={i} className="text-[10px] bg-white rounded-lg p-2 border border-emerald-100">
                    <span className="font-bold text-emerald-800">{s.location}</span>
                    <span className="text-emerald-600 ml-2">
                      {s.updated} atualizados · {s.skipped} sem alteração · {s.notFound?.length || 0} não encontrados
                    </span>
                    {s.notFound?.length > 0 && (
                      <p className="text-amber-600 mt-0.5 text-[9px]">
                        Não encontrados: {s.notFound.slice(0, 3).join(', ')}{s.notFound.length > 3 ? ` +${s.notFound.length - 3}` : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erro do PULL */}
          {pullError && (
            <div className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <CloudOff className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">Erro ao puxar dados:</p>
                <p className="font-normal">{pullError}</p>
              </div>
            </div>
          )}

          {/* Resultado do PUSH */}
          {lastSyncResult && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sincronização enviada com sucesso — {lastSyncResult.at}
              </p>
              <div className="space-y-1">
                {lastSyncResult.results.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] text-emerald-700">
                    <span className="font-medium">{r.location}</span>
                    <span className="font-mono">
                      {r.paStatus === 200 || r.paStatus === 202
                        ? `✓ ${r.sent} itens enviados`
                        : r.paStatus === -1
                        ? '✗ Timeout / erro de rede'
                        : `HTTP ${r.paStatus}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erro de sincronização */}
          {syncError && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <CloudOff className="w-4 h-4 shrink-0" />
              {syncError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Sub-componente: item de checklist ────────────────────────────────────────
const ConfigItem: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div className="flex items-start gap-2 text-xs">
    {ok ? (
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
    ) : (
      <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
    )}
    <span className={ok ? 'text-slate-700' : 'text-red-600'}>{label}</span>
  </div>
);
