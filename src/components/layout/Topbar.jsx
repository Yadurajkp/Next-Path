import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, Search, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-4 shrink-0 z-10">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden btn-ghost p-2 -ml-2">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search careers, skills, courses..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 flex-1 outline-none"
        />
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <Link to="/notifications" className="relative btn-ghost p-2">
        <Bell size={20} className="text-slate-600" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </Link>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize leading-tight">{user?.role?.replace('_', ' ')}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400 hidden md:block" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-lg border border-slate-100 py-1 z-50 animate-fade-in">
            <Link to="/profile" onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <Settings size={15} className="text-slate-400" /> Settings
            </Link>
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
