import React from 'react';
import { ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 px-4 border-t border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Enterprise SaaS Workforce Analytics Platform &copy; {new Date().getFullYear()}</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Database className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>REST API Express Backend</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>End-to-End Encrypted Data</span>
        </span>
      </div>
    </footer>
  );
};
