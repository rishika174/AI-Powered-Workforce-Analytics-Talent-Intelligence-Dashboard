import React, { useState, useEffect } from 'react';
import { fetchEmployees } from '../../services/api';
import { Employee, EmailCampaign } from '../../types';
import { EmailComposerModal } from '../../components/email/EmailComposerModal';
import { useNotification } from '../../context/NotificationContext';
import {
  Mail,
  Send,
  Users,
  Copy,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
} from 'lucide-react';

export const EmailBroadcastPage: React.FC = () => {
  const { addToast } = useNotification();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [preSelectedIds, setPreSelectedIds] = useState<string[]>([]);

  // Dispatched Email Log History
  const [sentCampaigns, setSentCampaigns] = useState<EmailCampaign[]>([
    {
      id: 'EML-1092',
      subject: 'Schedule Request: Q3 Executive Performance Review',
      body: 'Performance review details dispatched to selective department heads...',
      recipientsCount: 14,
      recipientNames: ['Dr. Alex Morgan', 'Marcus Vance', 'Sarah Jenkins'],
      sentAt: 'Today, 09:30 AM',
      sender: 'hr-admin@workforce.ai',
      status: 'Delivered',
      templateName: 'Performance Review Notice',
    },
    {
      id: 'EML-1088',
      subject: 'Urgent: Upcoming Engineering Department All-Hands',
      body: 'Engineering roadmap review and town hall agenda dispatched.',
      recipientsCount: 480,
      recipientNames: ['Engineering Team'],
      sentAt: 'Yesterday, 02:15 PM',
      sender: 'hr-admin@workforce.ai',
      status: 'Delivered',
      templateName: 'Department All-Hands Sync',
    },
    {
      id: 'EML-1075',
      subject: 'Congratulations on Your Career Advancement',
      body: 'Promotion readiness letters sent to high performing staff engineers.',
      recipientsCount: 6,
      recipientNames: ['Elena Rostova', 'David Chen'],
      sentAt: 'Aug 1, 2026',
      sender: 'hr-admin@workforce.ai',
      status: 'Delivered',
      templateName: 'Promotion Recognition',
    },
  ]);

  useEffect(() => {
    fetchEmployees().then((res) => setEmployees(res.employees));
  }, []);

  const handleOpenComposerForDept = (dept: string) => {
    const ids = employees
      .filter((e) => dept === 'All' || e.department === dept)
      .map((e) => e.id);
    setPreSelectedIds(ids);
    setIsComposerOpen(true);
  };

  const handleCampaignCreated = (campaign: EmailCampaign) => {
    setSentCampaigns((prev) => [campaign, ...prev]);
  };

  const handleCopyDeptEmails = (deptName: string) => {
    const list = employees
      .filter((e) => deptName === 'All' || e.department === deptName)
      .map((e) => e.email)
      .join(', ');

    if (!list) {
      addToast('No Emails Found', `No email addresses found for ${deptName}.`, 'info');
      return;
    }

    navigator.clipboard.writeText(list);
    addToast('Emails Copied', `Copied ${deptName} team emails to clipboard.`, 'success');
  };

  return (
    <div className="space-y-8 pb-12 text-slate-800 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Selective Email Broadcast & Communications Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dispatch personalized notices, performance review schedules, and department announcements.
          </p>
        </div>

        <button
          onClick={() => {
            setPreSelectedIds([]);
            setIsComposerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Selective Email Broadcast</span>
        </button>
      </div>

      {/* Quick Group Dispatch Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Quick Department Broadcast Groups
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Engineering', count: 480, desc: 'Technical & Systems FTEs' },
            { name: 'Data Science', count: 210, desc: 'AI & Data Operations' },
            { name: 'Product', count: 180, desc: 'Product Managers & Design' },
            { name: 'Sales', count: 290, desc: 'Enterprise Sales & AMs' },
          ].map((group) => (
            <div
              key={group.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{group.name} Team</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                    {group.count} FTEs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{group.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/80 text-xs">
                <button
                  onClick={() => handleCopyDeptEmails(group.name)}
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy List
                </button>

                <button
                  onClick={() => handleOpenComposerForDept(group.name)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 transition-all flex items-center gap-1 text-[11px]"
                >
                  <Send className="w-3 h-3" /> Email Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatched Email Campaign History Table */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recent HR Email Campaigns Log
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit log of dispatched selective email communications
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-slate-50 dark:bg-slate-800">
                <th className="py-3 px-4">Campaign ID</th>
                <th className="py-3 px-4">Subject & Template</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Sent Time</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80 text-slate-700 dark:text-slate-200">
              {sentCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{camp.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{camp.subject}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{camp.templateName || 'Custom Broadcast'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white">{camp.recipientsCount} Employees</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{camp.sentAt}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{camp.sender}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {camp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        allEmployees={employees}
        preSelectedEmployeeIds={preSelectedIds}
        onEmailSent={handleCampaignCreated}
      />
    </div>
  );
};
