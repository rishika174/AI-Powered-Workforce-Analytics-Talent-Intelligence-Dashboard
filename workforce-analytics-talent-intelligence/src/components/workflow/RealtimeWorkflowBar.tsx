import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  Fingerprint,
  Cpu,
  Calculator,
  FileCheck,
  CreditCard,
  LayoutDashboard,
  Bell,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const WORKFLOW_STEPS = [
  { id: 1, name: 'Check-In', desc: 'Biometric, Face, GPS, QR code check-in', icon: Fingerprint },
  { id: 2, name: 'Record', desc: 'Attendance auto-logged in cloud DB', icon: Clock },
  { id: 3, name: 'AI Anomaly Validation', desc: 'AI verifies geofence & face match', icon: Cpu },
  { id: 4, name: 'Shift & Overtime', desc: 'Rotational shift & OT calculation', icon: Calculator },
  { id: 5, name: 'Leave Routing', desc: 'Auto-route pending leave requests', icon: FileCheck },
  { id: 6, name: 'Timesheet Sync', desc: 'Work log billing hours generated', icon: FileCheck },
  { id: 7, name: 'Payroll Auto-Input', desc: 'Salary, OT & bonuses computed', icon: CreditCard },
  { id: 8, name: 'HR Dashboard Live', desc: 'Headcount & analytics update', icon: LayoutDashboard },
  { id: 9, name: 'Manager Alerts', desc: 'Actionable flight risk alerts sent', icon: Bell },
  { id: 10, name: 'Auto-Report Export', desc: 'Daily PDF/CSV summary generated', icon: FileSpreadsheet },
];

export const RealtimeWorkflowBar: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStartWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedSteps([]);
    setCurrentStep(1);

    let step = 1;
    const interval = setInterval(() => {
      setCompletedSteps((prev) => [...prev, step]);
      step += 1;
      if (step <= 10) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setCurrentStep(null);
        setIsRunning(false);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Real-Time Automated Workforce Engine
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            10-Step End-to-End Automation Loop: Check-In &rarr; AI Validation &rarr; Shift/OT Calc &rarr; Payroll &rarr; Live Dashboards
          </p>
        </div>

        <button
          id="btn-run-workflow-simulation"
          onClick={handleStartWorkflow}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Simulating Step {currentStep}/10...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run Live 10-Step Workflow</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {WORKFLOW_STEPS.map((s) => {
          const Icon = s.icon;
          const isDone = completedSteps.includes(s.id);
          const isCurrent = currentStep === s.id;

          return (
            <motion.div
              key={s.id}
              animate={isCurrent ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ repeat: isCurrent ? Infinity : 0, duration: 0.8 }}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Step {s.id}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-xs leading-snug">{s.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
