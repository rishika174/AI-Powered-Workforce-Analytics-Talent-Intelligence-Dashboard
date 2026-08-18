import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Sparkles,
  Calculator,
  RefreshCw,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { MOCK_PAYROLL } from '../../data/mockData';
import { PayrollRecord } from '../../types';
import confetti from 'canvas-confetti';

export const PayrollPage: React.FC = () => {
  const [payrollList, setPayrollList] = useState<PayrollRecord[]>(MOCK_PAYROLL);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleRunPayrollSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('Payroll successfully synchronized with live attendance, overtime logs, and leave deductions for 1,473 employees!');
      confetti({ particleCount: 50, spread: 50 });
      setTimeout(() => setSyncNotice(null), 5000);
    }, 1400);
  };

  const handleDownloadPayslip = (employeeName: string) => {
    const csvContent = `data:text/csv;charset=utf-8,Employee Name,Base Salary,Overtime Pay,Bonus,Net Pay\n${employeeName},15416,450,2500,18366`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payslip_${employeeName.replace(/\s+/g, '_')}_July2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Module 6: Automated Payroll Input Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Payroll Input Automation & Payslips
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time attendance synchronization, automated overtime calculations, leave deductions, incentives, and exportable payslips.
          </p>
        </div>

        <button
          id="btn-sync-payroll"
          onClick={handleRunPayrollSync}
          disabled={isSyncing}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
          <span>Run Attendance & Payroll Sync</span>
        </button>
      </div>

      {syncNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Monthly Gross Payroll</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">$17,005,800</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Synced with Workday & ADP</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Calculated Overtime Pay</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">$485,200</p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">1,240 Overtime Hours Logged</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Incentives & Performance Bonuses</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">$1,120,500</p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Auto-calculated via KPI scorecards</span>
        </div>
      </div>

      {/* Payroll Input Records Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" /> Employee Payroll Input breakdown
          </h2>
          <button
            onClick={() => handleDownloadPayslip('All_Employees')}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Payroll Summary (CSV)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Base Monthly Salary</th>
                <th className="p-3">Overtime Pay</th>
                <th className="p-3">Incentive / Bonus</th>
                <th className="p-3">Leave Deduction</th>
                <th className="p-3">Net Payable</th>
                <th className="p-3">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payrollList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {p.employeeName}
                    <span className="block text-[10px] text-slate-400 font-normal">{p.department}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">${p.baseSalary.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">+${p.overtimePay.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">+${p.incentivesBonus.toLocaleString()}</td>
                  <td className="p-3 font-semibold text-rose-600">-${p.leaveDeduction.toLocaleString()}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">${p.netPay.toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDownloadPayslip(p.employeeName)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold hover:bg-teal-100 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
