import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeById } from '../../services/api';
import { Employee } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmailComposerModal } from '../../components/email/EmailComposerModal';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchEmployeeById(id);
        setEmployee(data);
      } catch (e) {
        console.error('Error loading employee:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton count={3} height="h-40" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employee Profile Not Found</h2>
        <button
          onClick={() => navigate('/employees')}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700"
        >
          Return to Employee Directory
        </button>
      </div>
    );
  }

  const performanceHistoryData = [
    { year: '2023', score: 4.1 },
    { year: '2024', score: 4.4 },
    { year: '2025', score: 4.6 },
    { year: '2026', score: employee.performanceScore },
  ];

  return (
    <div className="space-y-8 pb-12 text-slate-800 dark:text-slate-100">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </button>

        <button
          onClick={() => setIsEmailComposerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Send Direct HR Email</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-20 h-20 rounded-xl object-cover ring-4 ring-slate-100 dark:ring-slate-700 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{employee.name}</h1>
                {employee.promotionEligibility && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Promotion Eligible
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">{employee.role}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {employee.department}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> {employee.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {employee.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Metrics & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metrics */}
        <div className="space-y-6">
          {/* Key Metrics Box */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Compensation & Rating Summary
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Base Salary</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  ${employee.salary.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Performance Score</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {employee.performanceScore} / 5.0
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Tenure</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{employee.tenure} Years</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Attendance Rate</p>
                <p className="text-base font-bold text-sky-600 dark:text-sky-400 mt-0.5">{employee.attendance}%</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reporting Manager:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{employee.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Last Review Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{employee.lastReviewDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance Timeline & Skills (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Timeline Chart */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Performance Score Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Annual performance rating progression</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="year" stroke="#64748B" fontSize={11} />
                  <YAxis domain={[0, 5]} stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {performanceHistoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === performanceHistoryData.length - 1 ? '#0284C7' : '#2563EB'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills & Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Technical Competencies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Strategic Initiatives</h4>
              <div className="space-y-2 text-xs">
                {employee.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold">{proj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailComposerModal
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        allEmployees={[employee]}
        preSelectedEmployeeIds={[employee.id]}
      />
    </div>
  );
};
