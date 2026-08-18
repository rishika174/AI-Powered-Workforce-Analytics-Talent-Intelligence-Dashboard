import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  UserCheck,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { MOCK_SHIFTS, MOCK_SHIFT_SWAPS } from '../../data/mockData';
import { ShiftSchedule, ShiftSwapRequest } from '../../types';
import { motion } from 'motion/react';

export const ShiftsPage: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftSchedule[]>(MOCK_SHIFTS);
  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>(MOCK_SHIFT_SWAPS);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const handleRunAIShiftAllocation = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setAiNotice('AI Shift Allocation Solver completed! 100% shifts balanced across 1,473 staff with zero labor law violations.');
      setTimeout(() => setAiNotice(null), 5000);
    }, 1500);
  };

  const handleApproveSwap = (swapId: string) => {
    setSwaps(swaps.map((s) => (s.id === swapId ? { ...s, status: 'Approved' } : s)));
  };

  const handleRejectSwap = (swapId: string) => {
    setSwaps(swaps.map((s) => (s.id === swapId ? { ...s, status: 'Rejected' } : s)));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Module 3: Intelligent Shift & Rotational Scheduling
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Automated Shift Allocation & Swaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Rotational shift management, overtime compliance limits, automated shift solver, and peer swap workflows.
          </p>
        </div>

        <button
          id="btn-run-ai-shift-solver"
          onClick={handleRunAIShiftAllocation}
          disabled={isGeneratingAI}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-xs text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {isGeneratingAI ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>Run AI Automatic Shift Allocation</span>
        </button>
      </div>

      {aiNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{aiNotice}</span>
        </div>
      )}

      {/* Grid Layout for Shift Schedule & Swap Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Shift Roster */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Today's Shift Roster & Overtime Allocations
            </h2>
            <span className="text-xs font-semibold text-slate-500">4 Active Shifts</span>
          </div>

          <div className="space-y-3">
            {shifts.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{s.employeeName}</span>
                    {s.assignedByAI && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI Assigned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.department}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                  <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 inline mr-1.5" />
                    {s.shiftName}
                  </div>

                  {s.overtimeAllocatedHours > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      OT: +{s.overtimeAllocatedHours} hrs
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Shift Swap Approval Workflow */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Shift Swap Approval Requests
            </h2>

            <div className="space-y-4">
              {swaps.map((sw) => (
                <div
                  key={sw.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{sw.requesterName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sw.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : sw.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {sw.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Wants to swap shift on <strong className="text-slate-900 dark:text-white">{sw.shiftDate}</strong> with{' '}
                    <strong className="text-slate-900 dark:text-white">{sw.peerName}</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                    "{sw.reason}"
                  </p>

                  {sw.status === 'Pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleApproveSwap(sw.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectSwap(sw.id)}
                        className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs">
            <span className="font-bold block mb-0.5">Overtime Compliance Policy</span>
            <span>Maximum weekly overtime is capped at 15 hours per employee in accordance with regional labor laws.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
