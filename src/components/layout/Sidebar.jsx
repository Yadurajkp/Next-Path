import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, ClipboardList, Lightbulb,
  Briefcase, TrendingUp, Map, BarChart2, Bell,
  Shield, LogOut, X, Zap,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile',       icon: User,            label: 'My Profile' },
  { to: '/assessment',    icon: ClipboardList,   label: 'Skill Assessment' },
  { to: '/interests',     icon: Lightbulb,       label: 'Interest Analysis' },
  { to: '/careers',       icon: Briefcase,       label: 'Career Matches' },
  { to: '/skill-gap',     icon: TrendingUp,      label: 'Skill Gap' },
  { to: '/roadmap',       icon: Map,             label: 'Learning Roadmap' },
  { to: '/progress',      icon: BarChart2,       label: 'My Progress' },
  { to: '/notifications', icon: Bell,            label: 'Notifications' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-100 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">NextPath</span>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-md">AI</span>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>

        {/* User chip */}
        <div className="px-4 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <Shield size={18} className="shrink-0" />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={18} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
