import React, { useState } from 'react';
import {
  CalendarDays,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Sparkles,
  Calendar,
  Layers,
  Search,
  Filter,
  UserCheck,
} from 'lucide-react';
import { MOCK_LEAVES, MOCK_TIMESHEETS } from '../../data/mockData';
import { LeaveRequest, TimesheetEntry, LeaveBalance } from '../../types';

export const LeaveTimesheetsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Leave' | 'Timesheet' | 'Holidays'>('Leave');
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(MOCK_TIMESHEETS);
  const [leaveSearch, setLeaveSearch] = useState('');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<string>('All');

  // Leave Balances Overview for Organization
  const balances: LeaveBalance = {
    casualLeave: { used: 3, total: 12 },
    sickLeave: { used: 1, total: 10 },
    earnedLeave: { used: 5, total: 15 },
    unpaidLeave: { used: 0, total: 30 },
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
  };

  const handleRejectLeave = (id: string) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l)));
  };

  const handleApproveTimesheet = (id: string) => {
    setTimesheets(timesheets.map((t) => (t.id === id ? { ...t, status: 'Approved' } : t)));
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchesSearch =
      l.employeeName.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.employeeId.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.department.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(leaveSearch.toLowerCase());
    const matchesStatus = leaveStatusFilter === 'All' || l.status === leaveStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> HR Oversight: Leave & Timesheet Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Organization Leave Requests & Timesheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Monitor company-wide employee leave requests, review pending applications, track project timesheets, and inspect holiday schedules.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 shrink-0">
          <button
            onClick={() => setActiveTab('Leave')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'Leave' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Leave Oversight
          </button>
          <button
            onClick={() => setActiveTab('Timesheet')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'Timesheet' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Timesheet Logs
          </button>
          <button
            onClick={() => setActiveTab('Holidays')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'Holidays' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Holiday Calendar
          </button>
        </div>
      </div>

      {/* Leave Management View */}
      {activeTab === 'Leave' && (
        <div className="space-y-6">
          {/* Leave Balances / Category Allocation Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Casual Leave Policy', bal: balances.casualLeave, color: 'border-blue-500 text-blue-600 dark:text-blue-400' },
              { name: 'Sick Leave Policy', bal: balances.sickLeave, color: 'border-rose-500 text-rose-600 dark:text-rose-400' },
              { name: 'Earned Leave Policy', bal: balances.earnedLeave, color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' },
              { name: 'Unpaid Leave Policy', bal: balances.unpaidLeave, color: 'border-amber-500 text-amber-600 dark:text-amber-400' },
            ].map((b) => (
              <div
                key={b.name}
                className={`bg-white dark:bg-slate-900 border-l-4 ${b.color} border-y border-r border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs`}
              >
                <p className="text-xs font-bold text-slate-500">{b.name}</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {b.bal.total} <span className="text-xs font-normal text-slate-400">Annual Quota</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Avg Utilized: {b.bal.used} Days</p>
              </div>
            ))}
          </div>

          {/* Full Width Leave Applications Table & HR Approvals */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Employee Leave Applications & Review Queue
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review, approve, or decline employee leave applications submitted across all departments.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leaveSearch}
                    onChange={(e) => setLeaveSearch(e.target.value)}
                    placeholder="Search employee or department..."
                    className="pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={leaveStatusFilter}
                  onChange={(e) => setLeaveStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLeaves.map((l) => (
                <div
                  key={l.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{l.employeeName}</span>
                      <span className="text-xs text-slate-400 font-mono">({l.employeeId})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {l.department}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {l.leaveType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Duration:</span> {l.startDate} to {l.endDate} ({l.totalDays} {l.totalDays === 1 ? 'Day' : 'Days'}) &bull;{' '}
                      <span className="font-semibold">Reason:</span> "{l.reason}"
                    </p>
                    <p className="text-[10px] text-slate-400">Applied on: {l.appliedAt}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {l.status === 'Pending' ? (
                      <>
                        <button
                          id={`btn-approve-leave-${l.id}`}
                          onClick={() => handleApproveLeave(l.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          id={`btn-reject-leave-${l.id}`}
                          onClick={() => handleRejectLeave(l.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300/40'
                        }`}
                      >
                        {l.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{l.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredLeaves.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">No leave applications found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timesheet View */}
      {activeTab === 'Timesheet' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Work Logs & Client Billing</h3>
              <p className="text-xs text-slate-500">Project-wise hours and manager approval workflow.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Hours Worked</th>
                  <th className="p-3">Client Billable</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {timesheets.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{t.employeeName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{t.date}</td>
                    <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{t.project}</td>
                    <td className="p-3 font-bold">{t.hoursWorked} hrs</td>
                    <td className="p-3 font-bold text-emerald-600">{t.clientBillingHours} hrs</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          t.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {t.status === 'Submitted' && (
                        <button
                          onClick={() => handleApproveTimesheet(t.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Holiday Calendar View */}
      {activeTab === 'Holidays' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" /> 2026 Enterprise Holiday Calendar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { date: 'Labor Day', day: 'Mon, Sep 7, 2026', type: 'National Holiday' },
              { date: 'Thanksgiving Break', day: 'Thu-Fri, Nov 26-27, 2026', type: 'Company Holiday' },
              { date: 'Year-End Festivities', day: 'Dec 25 - Jan 1, 2027', type: 'Global Closure' },
            ].map((h) => (
              <div key={h.date} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {h.type}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">{h.date}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{h.day}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
