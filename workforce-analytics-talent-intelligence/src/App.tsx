import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { AiAssistant } from './components/chatbot/AiAssistant';

// Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EmployeesPage } from './pages/Employees/EmployeesPage';
import { EmployeeProfilePage } from './pages/Employees/EmployeeProfilePage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { EmailBroadcastPage } from './pages/Email/EmailBroadcastPage';
import { AttendancePage } from './pages/Attendance/AttendancePage';
import { ShiftsPage } from './pages/Shifts/ShiftsPage';
import { LeaveTimesheetsPage } from './pages/LeaveTimesheets/LeaveTimesheetsPage';
import { PayrollPage } from './pages/Payroll/PayrollPage';
import { WorkforcePlanningPage } from './pages/WorkforcePlanning/WorkforcePlanningPage';
import { PerformancePage } from './pages/Performance/PerformancePage';
import { IntegrationsSecurityPage } from './pages/IntegrationsSecurity/IntegrationsSecurityPage';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onToggleAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Top Navbar */}
      <Navbar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
      />

      {/* Main Content View Container */}
      <div
        className={`flex-1 transition-all duration-300 pt-20 pb-8 w-full ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <main className="min-h-[calc(100vh-160px)]">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/shifts" element={<ShiftsPage />} />
              <Route path="/leave-timesheets" element={<LeaveTimesheetsPage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/workforce-planning" element={<WorkforcePlanningPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:id" element={<EmployeeProfilePage />} />
              <Route path="/email" element={<EmailBroadcastPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/integrations" element={<IntegrationsSecurityPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>

      {/* AI Assistant Floating Widget */}
      <AiAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppLayout />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
