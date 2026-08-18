import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { getStoredBackendUrl } from '../../services/api';
import { BackendApiModal } from '../common/BackendApiModal';
import { CommandPaletteModal } from '../common/CommandPaletteModal';
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
  ChevronDown,
  UserCheck,
  Layers,
  Server,
  Sun,
  Moon,
  Mail,
  Command,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleAssistant: () => void;
  onGlobalSearch?: (query: string) => void;
  isSidebarCollapsed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleAssistant,
  onGlobalSearch,
  isSidebarCollapsed = false,
}) => {
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const { theme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isConnected = !!getStoredBackendUrl();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onGlobalSearch) {
      onGlobalSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/employees?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 h-16 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md z-30 flex items-center justify-between px-4 lg:px-8 shadow-xs transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
        }`}
      >
        {/* Search Input / Command Palette Trigger */}
        <div className="relative flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={() => setShowCommandPalette(true)}
              placeholder="Search employees, skills, or roles..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-16 py-2 text-xs lg:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setShowCommandPalette(true)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              title="Open Command Palette"
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </button>
          </form>
        </div>

        {/* Right Navbar Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center shadow-xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Email Broadcast Quick Shortcut */}
          <button
            id="btn-navbar-email"
            onClick={() => navigate('/email')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center shadow-xs"
            title="Selective Email Broadcast"
          >
            <Mail className="w-4 h-4" />
          </button>

          {/* AWS / MongoDB API Connection Button */}
          <button
            onClick={() => setShowApiModal(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isConnected
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isConnected ? 'AWS Backend Connected' : 'Connect AWS API (0s active)'}
            </span>
          </button>

          {/* AI Assistant Quick Trigger */}
          <button
            id="btn-open-assistant"
            onClick={onToggleAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:scale-102 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">Ask AURA AI</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-ping" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 text-slate-800 dark:text-slate-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Live System Alerts
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold border border-blue-100 dark:border-blue-900">
                      {notifications.length} Active
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No new alerts.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
                        >
                          <p className="font-semibold text-blue-700 dark:text-blue-400">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Menu */}
          {user && (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[120px]">{user.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 text-xs text-slate-700 dark:text-slate-200"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/email');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left font-medium"
                    >
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Selective Email Broadcast</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/reports');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left font-medium"
                    >
                      <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Executive Reports</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* Backend API Modal */}
      <BackendApiModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onConnected={() => {
          setShowApiModal(false);
          window.location.reload();
        }}
      />

      {/* Global Executive Command Palette Modal */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onToggleAssistant={onToggleAssistant}
      />
    </>
  );
};
