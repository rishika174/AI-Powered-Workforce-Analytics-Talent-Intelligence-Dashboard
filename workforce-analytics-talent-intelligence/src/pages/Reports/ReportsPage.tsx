import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { fetchEmployees } from '../../services/api';
import { Employee } from '../../types';

export const ReportsPage: React.FC = () => {
  const { addToast } = useNotification();
  const [reportType, setReportType] = useState('headcount');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees().then((res) => setEmployees(res.employees));
  }, []);

  const handleExportCSV = () => {
    let filtered = [...employees];
    if (departmentFilter !== 'All') {
      filtered = filtered.filter((e) => e.department === departmentFilter);
    }

    if (filtered.length === 0) {
      addToast('No Data Available', 'No records match filter criteria for export.', 'info');
      return;
    }

    const headers = ['ID', 'Name', 'Role', 'Department', 'Salary', 'PerformanceScore', 'TenureYears'];
    const rows = filtered.map((e) => [
      e.id,
      `"${e.name}"`,
      `"${e.role}"`,
      `"${e.department}"`,
      e.salary,
      e.performanceScore,
      `${e.tenure} yrs`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workforce_report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Download Started', 'Generated workforce dataset export file.', 'success');
  };

  const handleExportExcel = () => {
    handleExportCSV();
    addToast('Excel Export Ready', 'Downloaded spreadsheet format dataset.', 'success');
  };

  const handlePrintPDF = () => {
    window.print();
    addToast('Print PDF Ready', 'Sent formatted workforce audit page to system print preview.', 'info');
  };

  return (
    <div className="space-y-8 pb-12 text-slate-800 dark:text-slate-100 print:p-0">
      {/* Printable Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Executive Report Generator & Export Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export audit-ready CSV, Excel, or PDF reports for executive board meetings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>CSV Export</span>
          </button>
          <button
            id="btn-export-excel"
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Excel Download</span>
          </button>
          <button
            id="btn-print-pdf"
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Report Focus</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
            >
              <option value="headcount">Workforce Headcount & Tenure Audit</option>
              <option value="compensation">Compensation & Equity Audit</option>
              <option value="performance">Performance & Promotion Matrix</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Department Scope</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview Document Canvas */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-8 shadow-xs space-y-6 print:shadow-none print:border-none">
        {/* Report Document Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              CONFIDENTIAL EXECUTIVE REPORT
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Workforce Intelligence Audit Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated on {new Date().toLocaleDateString()} · Organization: Global Tech SaaS Corp
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-mono">
            <p>Report ID: RPT-2026-904</p>
            <p>Scope: {departmentFilter}</p>
          </div>
        </div>

        {/* Report Preview Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Performance</th>
                <th className="p-3">Tenure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No employee records loaded.
                  </td>
                </tr>
              ) : (
                employees
                  .filter((e) => departmentFilter === 'All' || e.department === departmentFilter)
                  .map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{emp.id}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{emp.role}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{emp.department}</td>
                      <td className="p-3 font-mono font-bold">${emp.salary.toLocaleString()}</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {emp.performanceScore} / 5.0
                      </td>
                      <td className="p-3 font-mono">
                        {emp.tenure} Years
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
