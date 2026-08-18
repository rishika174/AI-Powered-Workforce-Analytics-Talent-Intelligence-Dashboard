import React, { useState } from 'react';
import {
  Fingerprint,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  Filter,
  Sparkles,
  Download,
  Users,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { MOCK_ATTENDANCE } from '../../data/mockData';
import { AttendanceRecord } from '../../types';

export const AttendancePage: React.FC = () => {
  const [attendanceList] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  const departments = ['All', ...Array.from(new Set(attendanceList.map((a) => a.department)))];

  const filteredAttendance = attendanceList.filter((a) => {
    const matchesSearch =
      a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || a.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalPresent = attendanceList.length;
  const onTimeCount = attendanceList.filter((a) => a.status === 'On-Time').length;
  const lateCount = attendanceList.filter((a) => a.status === 'Late').length;
  const anomalyCount = attendanceList.filter((a) => a.status === 'Anomaly').length;

  const handleExportCSV = () => {
    const headers = 'Employee ID,Employee Name,Department,Date,Check-In Time,Method,Location,Status,Late Minutes\n';
    const rows = filteredAttendance
      .map(
        (a) =>
          `"${a.employeeId}","${a.employeeName}","${a.department}","${a.date}","${a.checkIn}","${a.method}","${a.location}","${a.status}",${a.lateMinutes}`
      )
      .join('\n');

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${headers}${rows}`);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Employee_Attendance_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Module 2: Attendance Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employee Attendance Logs & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Complete organization-wide employee attendance stream, biometric check-in logs, geofence verification, and AI anomaly alerts.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            id="btn-export-attendance-csv"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Attendance Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Checked-In</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalPresent}</p>
          <span className="text-[10px] text-slate-400 font-medium">Logged Today</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">On-Time Staff</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{onTimeCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{((onTimeCount / totalPresent) * 100).toFixed(1)}% On-Time Rate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Late Arrivals</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{lateCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Grace Period Exceeded</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">AI Anomaly Alerts</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{anomalyCount}</p>
          <span className="text-[10px] text-rose-600 font-bold">Location / Face Mismatch</span>
        </div>
      </div>

      {/* Main Employee Attendance Stream Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Employee Attendance Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time attendance records, biometric timestamps, geofence verification, and anomaly alerts.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee..."
                className="pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-hidden"
            >
              <option value="All">All Departments</option>
              {departments.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="On-Time">On-Time</option>
              <option value="Late">Late</option>
              <option value="Anomaly">Anomaly Alerts</option>
            </select>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3">Check-In Time</th>
                <th className="p-3">Method</th>
                <th className="p-3">Location / Device</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{rec.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{rec.employeeId}</div>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{rec.department}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{rec.checkIn}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {rec.method}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{rec.location}</td>
                  <td className="p-3">
                    {rec.status === 'On-Time' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        On-Time
                      </span>
                    )}
                    {rec.status === 'Late' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                        Late (+{rec.lateMinutes}m)
                      </span>
                    )}
                    {rec.status === 'Anomaly' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> AI Anomaly Alert
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No attendance records found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
