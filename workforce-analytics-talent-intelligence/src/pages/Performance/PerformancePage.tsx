import React from 'react';
import {
  Award,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MOCK_GOALS, MOCK_EMPLOYEES } from '../../data/mockData';

export const PerformancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Module 8: Performance & Productivity Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Performance Scorecards & OKRs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time KPI tracking, goal progress monitoring, productivity scoring, and annual review scorecards.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center shrink-0">
          <span className="block text-xl font-bold text-emerald-400">4.35 / 5.0</span>
          <span className="text-[10px] text-slate-300 font-medium">Org Avg Performance</span>
        </div>
      </div>

      {/* Goal & OKR Progress List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Key Goals & OKR Tracker
          </h2>

          <div className="space-y-4">
            {MOCK_GOALS.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{g.title}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Assigned to: {g.employeeName} &bull; Target: {g.targetDate}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      g.status === 'On Track'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {g.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-blue-600 dark:text-blue-400">{g.progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${g.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Leaderboard Scorecards */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Top Performer Scorecards
          </h2>

          <div className="space-y-3">
            {MOCK_EMPLOYEES.slice(0, 4).map((emp) => (
              <div
                key={emp.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{emp.name}</h4>
                    <p className="text-[10px] text-slate-500">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{emp.performanceScore} / 5.0</span>
                  <span className="block text-[9px] text-emerald-600 font-bold">Promotion Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
