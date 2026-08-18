import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/api';
import { Employee } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmailComposerModal } from '../../components/email/EmailComposerModal';
import { useNotification } from '../../context/NotificationContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Mail,
  MapPin,
  Send,
  CheckSquare,
  Square,
} from 'lucide-react';
import { motion } from 'motion/react';

export const EmployeesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Query state
  const search = searchParams.get('search') || '';
  const department = searchParams.get('department') || 'All';
  const sort = searchParams.get('sort') || 'name_asc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [totalEmployees, setTotalEmployees] = useState(0);

  // Email Composer state
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [selectedEmailEmpIds, setSelectedEmailEmpIds] = useState<string[]>([]);

  // Drawer & Modal state
  const [selectedEmpDrawer, setSelectedEmpDrawer] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [deletingEmpId, setDeletingEmpId] = useState<string | null>(null);

  // Form input state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    salary: 130000,
    experience: 5,
    gender: 'Female',
    tenure: 2,
    performanceScore: 4.5,
    location: 'San Francisco, CA',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployees({ search, department, sort, page, limit: 10 });
      setEmployees(res.employees);
      setTotalEmployees(res.total);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, department, sort, page]);

  const updateQuery = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleToggleSelectForEmail = (id: string) => {
    setSelectedEmailEmpIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllForEmail = () => {
    if (selectedEmailEmpIds.length === employees.length) {
      setSelectedEmailEmpIds([]);
    } else {
      setSelectedEmailEmpIds(employees.map((e) => e.id));
    }
  };

  const handleOpenEmailForSingle = (empId: string) => {
    setSelectedEmailEmpIds([empId]);
    setIsEmailComposerOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      role: '',
      department: 'Engineering',
      email: '',
      salary: 130000,
      experience: 5,
      gender: 'Female',
      tenure: 2,
      performanceScore: 4.5,
      location: 'San Francisco, CA',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmp(emp);
    setFormData({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      email: emp.email,
      salary: emp.salary,
      experience: emp.experience,
      gender: emp.gender,
      tenure: emp.tenure,
      performanceScore: emp.performanceScore,
      location: emp.location || 'San Francisco, CA',
    });
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await updateEmployee(editingEmp.id, formData);
        addToast('Employee Updated', `Updated records for ${formData.name}`, 'success');
        setEditingEmp(null);
      } else {
        await createEmployee(formData);
        addToast('Employee Added', `Created employee profile for ${formData.name}`, 'success');
        setIsAddModalOpen(false);
      }
      loadData();
    } catch (err) {
      addToast('Operation Failed', 'Could not save employee details.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmpId) return;
    try {
      await deleteEmployee(deletingEmpId);
      addToast('Profile Deleted', 'Employee record removed from organization database.', 'info');
      setDeletingEmpId(null);
      loadData();
    } catch (err) {
      addToast('Error', 'Failed to delete record.', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Employee Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
              {totalEmployees} Records
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, and inspect employee metrics across all business units.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Email Broadcast button */}
          <button
            id="btn-open-group-email"
            onClick={() => setIsEmailComposerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Email Selective Group ({selectedEmailEmpIds.length})</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="btn-view-table"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              id="btn-view-grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>

          <button
            id="btn-add-employee"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="employee-search-filter"
              type="text"
              value={search}
              onChange={(e) => updateQuery('search', e.target.value)}
              placeholder="Search by name, role..."
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-dept-filter"
              value={department}
              onChange={(e) => updateQuery('department', e.target.value)}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="select-sort-filter"
            value={sort}
            onChange={(e) => updateQuery('sort', e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="salary_desc">Salary (High to Low)</option>
            <option value="performance_desc">Performance Rating</option>
          </select>
        </div>
      </div>

      {/* Main Content View (Table or Grid) */}
      {loading ? (
        <LoadingSkeleton count={5} height="h-16" />
      ) : employees.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Employees Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No employees matching your current search criteria. Try adjusting filters.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="overflow-x-auto bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl shadow-xs">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-4 px-4 w-10">
                  <button onClick={handleSelectAllForEmail} title="Select/Deselect All for Email">
                    {selectedEmailEmpIds.length === employees.length && employees.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4">Employee</th>
                <th className="py-4 px-4">Department & Role</th>
                <th className="py-4 px-4">Salary</th>
                <th className="py-4 px-4">Performance</th>
                <th className="py-4 px-4">Promotion Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
              {employees.map((emp) => {
                const isCheckedForEmail = selectedEmailEmpIds.includes(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 px-4">
                      <button onClick={() => handleToggleSelectForEmail(emp.id)}>
                        {isCheckedForEmail ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-blue-500 transition-all"
                        />
                        <div>
                          <button
                            id={`emp-name-btn-${emp.id}`}
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors text-left"
                          >
                            {emp.name}
                          </button>
                          <p className="text-[11px] text-slate-400 font-mono">{emp.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{emp.role}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{emp.department}</p>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ${emp.salary.toLocaleString()}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{emp.performanceScore}</span> / 5.0
                    </td>

                    <td className="py-4 px-4">
                      {emp.promotionEligibility ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          Eligible
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEmailForSingle(emp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Send Direct Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-view-drawer-${emp.id}`}
                          onClick={() => setSelectedEmpDrawer(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Quick Drawer Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-edit-${emp.id}`}
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-${emp.id}`}
                          onClick={() => setDeletingEmpId(emp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <motion.div
              key={emp.id}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-blue-500 transition-all"
                    />
                    <div>
                      <h3
                        onClick={() => navigate(`/employees/${emp.id}`)}
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm cursor-pointer transition-colors"
                      >
                        {emp.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp.role}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{emp.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Compensation:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">${emp.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Performance Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{emp.performanceScore} / 5.0</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <button
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Full Profile &rarr;
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEmailForSingle(emp.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedEmpDrawer(emp)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(emp)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingEmpId(emp.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* QUICK PROFILE DRAWER */}
      <Drawer
        id="drawer-employee-preview"
        isOpen={!!selectedEmpDrawer}
        onClose={() => setSelectedEmpDrawer(null)}
        title={selectedEmpDrawer?.name || ''}
        subtitle={`${selectedEmpDrawer?.role} · ${selectedEmpDrawer?.department}`}
      >
        {selectedEmpDrawer && (
          <div className="space-y-6 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedEmpDrawer.avatar}
                alt={selectedEmpDrawer.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div>
                <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {selectedEmpDrawer.email}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {selectedEmpDrawer.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Salary</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  ${selectedEmpDrawer.salary.toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">Performance Score</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedEmpDrawer.performanceScore} / 5.0
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-900 dark:text-white text-sm">Key Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedEmpDrawer.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const id = selectedEmpDrawer.id;
                setSelectedEmpDrawer(null);
                navigate(`/employees/${id}`);
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all text-center"
            >
              Open Full Employee Profile &rarr;
            </button>
          </div>
        )}
      </Drawer>

      {/* EMAIL COMPOSER MODAL */}
      <EmailComposerModal
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        allEmployees={employees}
        preSelectedEmployeeIds={selectedEmailEmpIds}
      />

      {/* ADD / EDIT EMPLOYEE MODAL */}
      <Modal
        id="modal-add-edit-employee"
        isOpen={isAddModalOpen || !!editingEmp}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEmp(null);
        }}
        title={editingEmp ? `Edit Profile: ${editingEmp.name}` : 'Add New Employee Profile'}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs text-slate-800 dark:text-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Alex Morgan"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Role Title</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Staff AI Engineer"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex.morgan@company.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Base Salary ($)</label>
              <input
                type="number"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Performance Score (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.performanceScore}
                onChange={(e) => setFormData({ ...formData, performanceScore: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingEmp(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        id="modal-delete-confirm"
        isOpen={!!deletingEmpId}
        onClose={() => setDeletingEmpId(null)}
        title="Confirm Employee Profile Removal"
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
          <p>
            Are you sure you want to permanently delete this employee record from the system database?
            This operation is logged for auditing compliance.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDeletingEmpId(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
