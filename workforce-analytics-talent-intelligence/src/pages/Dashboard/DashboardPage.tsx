import React, { useEffect, useState } from 'react';
import { fetchKPIOverview, fetchEmployees } from '../../services/api';
import { KPIOverview, Employee } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Users,
  TrendingDown,
  Award,
  Building2,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Layers,
  Check,
  RefreshCw,
  Activity,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { RealtimeWorkflowBar } from '../../components/workflow/RealtimeWorkflowBar';
import { UserBiometricClockInWidget } from '../../components/dashboard/UserBiometricClockInWidget';

export const DashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<KPIOverview | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'Q3 2026' | 'YTD' | '12 Months'>('Q3 2026');
  const [growthViewMode, setGrowthViewMode] = useState<'flow' | 'net'>('flow');
  const [deptViewMode, setDeptViewMode] = useState<'headcount' | 'budget'>('headcount');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [isApplyingStrategy, setIsApplyingStrategy] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpiData, empData] = await Promise.all([
          fetchKPIOverview(),
          fetchEmployees(),
        ]);
        setKpis(kpiData);
        setEmployees(empData.employees);
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApplyStrategy = (strategyTitle: string) => {
    setIsApplyingStrategy(strategyTitle);
    setTimeout(() => {
      setIsApplyingStrategy(null);
      setActionSuccessMessage(`Strategy "${strategyTitle}" applied successfully across relevant teams.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }, 1200);
  };

  if (loading || !kpis) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton count={4} height="h-32" />
      </div>
    );
  }

  const PIE_COLORS = ['#2563EB', '#0284C7', '#7C3AED', '#059669', '#D97706', '#DB2777', '#9333EA'];

  const deptOverview = (kpis.departmentDistribution || []).map((d) => ({
    name: d.name,
    count: d.count,
    avgSalary: kpis.avgSalary || 0,
    budget: `$${((d.count * (kpis.avgSalary || 0)) / 1000000).toFixed(1)}M`,
  }));

  const netGrowthData = (kpis.hiringTrend || []).map((item) => ({
    month: item.month,
    hired: item.hired,
    departed: item.departed,
    netGrowth: item.hired - item.departed,
  }));

  return (
    <div className="space-y-8 pb-12 text-slate-800 dark:text-slate-100">
      {/* Action Notification Toast */}
      <AnimatePresence>
        {actionSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-xl max-w-md font-medium text-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Executive Control & Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-6 lg:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" /> AURA Intelligence Platform
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Org Health: 94/100
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workforce Intelligence Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Real-time employee metrics across <strong className="text-slate-800 dark:text-slate-200">{kpis.totalEmployees.toLocaleString()} global FTEs</strong>. Retention rate sits at <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{(100 - kpis.attritionRate).toFixed(1)}%</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {(['Q3 2026', 'YTD', '12 Months'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              id="btn-dash-view-directory"
              onClick={() => navigate('/employees')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Employee Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personal Biometric & Multi-Modal Check-In Widget for Logged-In User */}
      <UserBiometricClockInWidget />

      {/* Real-Time Automated Workforce Workflow Simulator Bar */}
      <RealtimeWorkflowBar />

      {/* 2. Structured Executive KPI Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Core Enterprise Metrics ({timeframe})
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Updated 5m ago · Automated Feed</span>
        </div>

        {/* Primary 4-Card Executive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            id="stat-total-emp"
            title="Total Active Employees"
            value={kpis.totalEmployees.toLocaleString()}
            change="+8.4% YoY"
            isPositive={true}
            subtitle="72% Hybrid · 28% Remote"
            icon={Users}
            iconBgColor="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900"
            iconTextColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            id="stat-attrition-rate"
            title="Annual Attrition Rate"
            value={`${kpis.attritionRate}%`}
            change="-1.2% vs Benchmark"
            isPositive={true}
            badgeText="Healthy"
            badgeType="success"
            subtitle="Benchmark: 5.4%"
            icon={TrendingDown}
            iconBgColor="bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900"
            iconTextColor="text-emerald-600 dark:text-emerald-400"
          />

          <StatCard
            id="stat-avg-performance"
            title="Avg Performance Score"
            value={`${kpis.avgPerformance} / 5.0`}
            change="+0.2 pts Q/Q"
            isPositive={true}
            badgeText="High Band"
            badgeType="info"
            subtitle="88% Meet/Exceed"
            icon={Award}
            iconBgColor="bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900"
            iconTextColor="text-indigo-600 dark:text-indigo-400"
          />

          <StatCard
            id="stat-avg-salary"
            title="Avg Compensation"
            value={`$${(kpis.avgSalary / 1000).toFixed(1)}k`}
            change="+4.5% Equity"
            isPositive={true}
            subtitle="92% Market Parity"
            icon={DollarSign}
            iconBgColor="bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900"
            iconTextColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Secondary Operational Metric Band */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Business Units</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{kpis.totalDepartments} Divisions</p>
            </div>
            <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Promotion Rate</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{kpis.promotionRate}% / yr</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Satisfaction Score</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">4.6 / 5.0</p>
            </div>
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Retention Rate</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{(100 - kpis.attritionRate).toFixed(1)}%</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 opacity-80" />
          </div>
        </div>
      </div>

      {/* 3. Primary Visual Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Hiring vs Turnover Flow
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly onboarding velocity compared to exit telemetry
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setGrowthViewMode('flow')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    growthViewMode === 'flow'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Flow
                </button>
                <button
                  onClick={() => setGrowthViewMode('net')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    growthViewMode === 'net'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Net Growth
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-xs">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Hired (YTD)</p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">+441 Hired</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Departed</p>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">-84 Departed</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Net Expansion</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+357 Headcount</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {growthViewMode === 'flow' ? (
                <AreaChart data={kpis.hiringTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDeparted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Area
                    name="Hired"
                    type="monotone"
                    dataKey="hired"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHired)"
                  />
                  <Area
                    name="Departed"
                    type="monotone"
                    dataKey="departed"
                    stroke="#64748B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDeparted)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={netGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar name="Net Growth" dataKey="netGrowth" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Unit Distribution */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Business Unit Distribution
              </h2>

              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold">
                <button
                  onClick={() => setDeptViewMode('headcount')}
                  className={`px-2 py-1 rounded transition-all ${
                    deptViewMode === 'headcount'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Headcount
                </button>
                <button
                  onClick={() => setDeptViewMode('budget')}
                  className={`px-2 py-1 rounded transition-all ${
                    deptViewMode === 'budget'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Payroll
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Headcount share & annual payroll allocation</p>
          </div>

          {deptViewMode === 'headcount' ? (
            <div className="h-52 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpis.departmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {kpis.departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptOverview.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis type="number" stroke="#64748B" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="avgSalary" fill="#0284C7" radius={[0, 6, 6, 0]} name="Avg Salary ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto pr-1">
            {kpis.departmentDistribution.map((dept, idx) => {
              const pct = Math.round((dept.count / (kpis.totalEmployees || 1)) * 100);
              return (
                <div key={dept.name} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">{dept.count}</span>
                    <span className="text-[10px]">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Department Overview & Compensation Matrix */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Department Compensation & Headcount Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cross-departmental headcount and payroll allocation</p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            Explore Analytics <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-slate-50 dark:bg-slate-800">
                <th className="py-3 px-3">Business Unit</th>
                <th className="py-3 px-3">Headcount</th>
                <th className="py-3 px-3">Avg Salary</th>
                <th className="py-3 px-3">Est Payroll</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80 text-slate-700 dark:text-slate-200">
              {deptOverview.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 dark:text-slate-400">
                    No department data available. Connect your backend API or add employee profiles.
                  </td>
                </tr>
              ) : (
                deptOverview.map((dept) => (
                  <tr key={dept.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {dept.name}
                    </td>
                    <td className="py-3 px-3 font-mono">{dept.count} FTEs</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">${dept.avgSalary.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-blue-700 dark:text-blue-400 font-bold">{dept.budget}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/employees?department=${dept.name}`)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-[11px] font-semibold transition-all border border-slate-200 dark:border-slate-600"
                      >
                        Filter Team
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Strategic Recommendations */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AURA Executive Strategy Recommendations
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Data-driven workforce optimizations</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              2 Initiatives Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    COMPENSATION REALIGNMENT
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">High ROI</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Senior Staff Compensation Review</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Engineering and Data Science teams display market alignment opportunities.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono">Est Budget: +$42k/yr</span>
                <button
                  onClick={() => handleApplyStrategy('Senior Staff Compensation Review')}
                  disabled={isApplyingStrategy === 'Senior Staff Compensation Review'}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  {isApplyingStrategy === 'Senior Staff Compensation Review' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Apply Strategy</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    LEADERSHIP DEVELOPMENT
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">High Potential</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Executive Leadership Cohort</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Identify top-performing team managers for the annual Leadership Mentorship Cohort.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono">2 Key Leaders</span>
                <button
                  onClick={() => handleApplyStrategy('Executive Leadership Cohort')}
                  disabled={isApplyingStrategy === 'Executive Leadership Cohort'}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  {isApplyingStrategy === 'Executive Leadership Cohort' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Enroll Leaders</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Need custom workforce reports? Ask <strong className="text-slate-900 dark:text-white">AURA Chatbot</strong> or check out the <strong className="text-slate-900 dark:text-white">Reports</strong> section.
            </span>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 transition-all text-xs shrink-0 border border-blue-200 dark:border-blue-800"
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};
