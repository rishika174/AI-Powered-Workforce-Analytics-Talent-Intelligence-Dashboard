import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileText,
  Sparkles,
  RefreshCw,
  Fingerprint,
  Database,
  Server,
  CreditCard,
  MessageSquare,
  Share2,
  Camera,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { MOCK_INTEGRATIONS, MOCK_AUDIT_LOGS } from '../../data/mockData';
import { IntegrationStatus, SecurityAuditLog } from '../../types';

export const IntegrationsSecurityPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(MOCK_INTEGRATIONS);
  const [logs] = useState<SecurityAuditLog[]>(MOCK_AUDIT_LOGS);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleTestConnection = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setIsSyncing(null);
      setIntegrations(
        integrations.map((i) => (i.id === id ? { ...i, status: 'Connected', lastSync: 'Just now' } : i))
      );
    }, 1200);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fingerprint': return Fingerprint;
      case 'Camera': return Camera;
      case 'Database': return Database;
      case 'Server': return Server;
      case 'CreditCard': return CreditCard;
      case 'MessageSquare': return MessageSquare;
      case 'Share2': return Share2;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Modules & Integrations Hub & Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Integrations, RBAC Security & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Biometric devices, SAP, Oracle HRMS, Workday, Teams, Slack, Active Directory connectors, MFA status, Audit logs, and GDPR readiness.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center shrink-0">
          <span className="block text-xl font-bold text-emerald-400">8 / 8 Active</span>
          <span className="text-[10px] text-slate-300 font-medium">Enterprise Integrations</span>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Connected Enterprise Systems & Hardware
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((item) => {
            const Icon = getIcon(item.iconName);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.provider}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Sync: {item.lastSync}</span>
                  <button
                    onClick={() => handleTestConnection(item.id)}
                    disabled={isSyncing === item.id}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isSyncing === item.id ? <RefreshCw className="w-3 h-3 animate-spin inline" /> : 'Test Connection'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Audit Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Security & GDPR Compliance
          </h2>

          <div className="space-y-2.5 text-xs">
            {[
              { title: 'Role-Based Access Control (RBAC)', desc: 'Strict granular permissions for Admin, Manager & ESS views', ok: true },
              { title: 'Multi-Factor Authentication (MFA)', desc: 'Enforced for all HR & Admin user sessions', ok: true },
              { title: 'AES-256 Data Encryption', desc: 'Encrypted in transit (TLS 1.3) and at rest', ok: true },
              { title: 'GDPR Right to Forget & Audit Trails', desc: 'Automated data retention and removal workflows', ok: true },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{c.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Audit Logs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" /> Immutable Security Audit Logs
          </h2>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Triggered by <strong className="text-slate-700 dark:text-slate-300">{log.user}</strong> &bull; IP: {log.ipAddress}
                  </p>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
