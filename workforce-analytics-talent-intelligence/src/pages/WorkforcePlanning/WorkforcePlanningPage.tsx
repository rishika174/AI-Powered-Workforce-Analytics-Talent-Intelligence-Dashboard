import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Users,
  Target,
  Smile,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { MOCK_FORECASTS, MOCK_SKILL_MATRIX, MOCK_EMPLOYEES } from '../../data/mockData';

export const WorkforcePlanningPage: React.FC = () => {
  const highRiskEmployees = MOCK_EMPLOYEES.filter((e) => (e.attritionRiskScore || 0) >= 70);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Module 7: AI Predictive Workforce Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Workforce Planning, Attrition & Skill Gap AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            12-Month headcount demand forecasting, AI staffing recommendations, flight risk prediction models, and skill gap matrices.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
            <span className="block text-xl font-bold text-purple-300">94.6%</span>
            <span className="text-[10px] text-slate-300 font-medium">Model Accuracy Score</span>
          </div>
        </div>
      </div>

      {/* Demand Forecasting Chart & AI Staffing Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Headcount Demand Forecasting vs Capacity
              </h2>
              <p className="text-xs text-slate-500">AI predicted workforce expansion requirements for 2026-2027.</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FORECASTS}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} domain={[1400, 1800]} />
                <Tooltip />
                <Area type="monotone" dataKey="predictedDemand" name="AI Required Demand" stroke="#9333EA" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
                <Area type="monotone" dataKey="actualHeadcount" name="Current Headcount" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> AI Staffing Recommendations
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
              <span className="font-bold text-purple-900 dark:text-purple-200 block">Engineering Scale-Up</span>
              <p className="text-slate-600 dark:text-slate-300">
                Recommend hiring +18 Senior Platform & AI Engineers by Q4 to meet high-volume project demand.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-200 block">Data Science Upskilling</span>
              <p className="text-slate-600 dark:text-slate-300">
                Bridge 12% skill gap in Cloud Security Architecture via internal certification bootcamps.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Sales Load Balancing</span>
              <p className="text-slate-600 dark:text-slate-300">
                Redistribute Fortune 500 accounts in Sales to reduce travel burnout and decrease flight risk by 40%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attrition Risk & Skill Gap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attrition Risk Diagnostics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" /> High Flight-Risk Attrition Diagnostics
          </h2>

          <div className="space-y-3">
            {highRiskEmployees.map((emp) => (
              <div
                key={emp.id}
                className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{emp.name}</h4>
                      <p className="text-[10px] text-slate-500">{emp.role} &bull; {emp.department}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs">
                    {emp.attritionRiskScore}% Flight Risk
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <span className="font-bold block text-[10px] uppercase text-rose-800 dark:text-rose-300 mb-1">
                    AI Identified Drivers:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {emp.flightRiskDrivers?.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Matrix & Competency Gaps */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" /> Competency Skill Gap Analysis
          </h2>

          <div className="space-y-3">
            {MOCK_SKILL_MATRIX.map((sk) => (
              <div key={sk.skillName} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{sk.skillName}</span>
                  <span className={sk.criticalGap ? 'text-rose-600 font-extrabold' : 'text-slate-600 dark:text-slate-400'}>
                    {sk.currentProficiencyPct}% / {sk.targetProficiencyPct}% Target {sk.criticalGap && '(Critical Gap)'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${sk.criticalGap ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${sk.currentProficiencyPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
