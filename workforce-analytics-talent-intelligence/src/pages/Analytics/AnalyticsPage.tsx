import React, { useEffect, useState } from 'react';
import { fetchEmployees, fetchKPIOverview } from '../../services/api';
import { Employee, KPIOverview } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  Users,
  Award,
  TrendingUp,
  AlertCircle,
  Database,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('12m');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [kpis, setKpis] = useState<KPIOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, kpiRes] = await Promise.all([
          fetchEmployees({ limit: 500 }),
          fetchKPIOverview(),
        ]);
        setEmployees(empRes.employees);
        setKpis(kpiRes);
      } catch (err) {
        console.error('Error loading analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton count={3} height="h-48" />
      </div>
    );
  }

  // Calculate dynamic department salary data
  const deptMap: Record<string, { totalSalary: number; count: number; min: number; max: number }> = {};
  employees.forEach((emp) => {
    const d = emp.department || 'Unassigned';
    if (!deptMap[d]) {
      deptMap[d] = { totalSalary: 0, count: 0, min: Infinity, max: -Infinity };
    }
    deptMap[d].totalSalary += emp.salary || 0;
    deptMap[d].count += 1;
    if (emp.salary < deptMap[d].min) deptMap[d].min = emp.salary;
    if (emp.salary > deptMap[d].max) deptMap[d].max = emp.salary;
  });

  const deptSalaryData = Object.keys(deptMap).map((d) => ({
    department: d,
    avgSalary: Math.round(deptMap[d].totalSalary / deptMap[d].count),
    minSalary: deptMap[d].min === Infinity ? 0 : deptMap[d].min,
    maxSalary: deptMap[d].max === -Infinity ? 0 : deptMap[d].max,
    headcount: deptMap[d].count,
  }));

  // Calculate gender diversity data
  const genderCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    const g = emp.gender || 'Other';
    genderCounts[g] = (genderCounts[g] || 0) + 1;
  });

  const totalG = employees.length || 1;
  const genderColors = ['#2563EB', '#0284C7', '#9333EA', '#10B981'];
  const genderDiversityData = Object.keys(genderCounts).map((g, i) => ({
    name: g,
    value: parseFloat(((genderCounts[g] / totalG) * 100).toFixed(1)),
    color: genderColors[i % genderColors.length],
  }));

  // Calculate tenure / experience data
  const expMap: Record<number, { totalSal: number; totalPerf: number; count: number }> = {};
  employees.forEach((emp) => {
    const exp = Math.round(emp.experience || 1);
    if (!expMap[exp]) expMap[exp] = { totalSal: 0, totalPerf: 0, count: 0 };
    expMap[exp].totalSal += emp.salary || 0;
    expMap[exp].totalPerf += emp.performanceScore || 0;
    expMap[exp].count += 1;
  });

  const experienceVsSalary = Object.keys(expMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((exp) => ({
      exp,
      salary: Math.round(expMap[exp].totalSal / expMap[exp].count),
      perf: parseFloat((expMap[exp].totalPerf / expMap[exp].count).toFixed(1)),
    }));

  return (
    <div className="space-y-8 pb-12 text-slate-800 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Workforce Analytics Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics directly derived from your connected backend database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setTimeframe('6m')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeframe === '6m'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeframe('12m')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeframe === '12m'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              12 Months
            </button>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <Database className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto opacity-80" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Backend Data Connected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            The analytics engine is ready to generate real-time metrics, salary benchmarks, and headcount distribution as soon as you connect your AWS / MongoDB API or add employee records.
          </p>
        </div>
      ) : (
        /* Grid Charts Section */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Distribution by Department */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Department Compensation Benchmarks
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Average base salary across connected business units</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptSalaryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="department" stroke="#64748B" fontSize={11} angle={-20} textAnchor="end" />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Avg Base Salary']}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="avgSalary" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Experience vs Salary Correlation */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  Experience vs Compensation Curve
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Career progression curve relative to years in industry</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experienceVsSalary} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="exp" stroke="#64748B" fontSize={11} unit=" Yrs" />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Compensation']}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="salary" fill="#0284C7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gender & Diversity Representation */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Gender & Diversity Representation Ratio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Organization-wide representation balance</p>
            </div>

            <div className="h-56 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDiversityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderDiversityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, 'Representation']}
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {genderDiversityData.map((d) => (
                <div key={d.name} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold">{d.name}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{d.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

