import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  BrainCircuit,
  FileSpreadsheet,
  Bot,
  UserCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Fingerprint,
  Calendar,
  CalendarDays,
  CreditCard,
  Target,
  Activity,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onToggleAssistant,
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Attendance & Clock-In', path: '/attendance', icon: Fingerprint },
    { name: 'Shift Management', path: '/shifts', icon: Calendar },
    { name: 'Leave & Timesheets', path: '/leave-timesheets', icon: CalendarDays },
    { name: 'Payroll Input', path: '/payroll', icon: CreditCard },
    { name: 'AI Workforce Planning', path: '/workforce-planning', icon: BrainCircuit },
    { name: 'Performance & Goals', path: '/performance', icon: Target },
    { name: 'Employee Profiles', path: '/employees', icon: Users },
    { name: 'Email Broadcast', path: '/email', icon: Mail },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Integrations & Security', path: '/integrations', icon: ShieldCheck },
    { name: 'AI HR Chatbot', path: '#assistant', icon: Bot, isAction: true },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wider uppercase truncate">
                  WORKFORCE<span className="text-blue-600 dark:text-blue-400">.AI</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate">
                  HR Command Center
                </span>
              </div>
            )}
          </div>

          <button
            id="btn-collapse-sidebar"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden lg:block shrink-0"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Enterprise Organization Pill */}
        {!isCollapsed && (
          <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Acme Global Inc.</p>
                <p className="text-[10px] text-slate-400 truncate">Enterprise Edition &bull; SOC2</p>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              PRO
            </span>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Enterprise Navigation
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  id={`nav-btn-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={onToggleAssistant}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                  {!isCollapsed && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-200/60 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 uppercase">
                      Live
                    </span>
                  )}
                </button>
              );
            }

            return (
              <NavLink
                key={item.name}
                id={`nav-link-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all relative ${
                    isCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                  }`
                }
                title={isCollapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    {!isCollapsed && <span>{item.name}</span>}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-2 bottom-2 w-1 bg-blue-400 rounded-r-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Widget */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>SOC2 Type II Certified</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time workforce analytics & executive reporting suite.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
