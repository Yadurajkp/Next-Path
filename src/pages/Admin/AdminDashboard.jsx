import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Users, Activity, ClipboardList, TrendingUp, Search, Loader2, Shield } from 'lucide-react';

const STATUS_COLORS = { active: 'badge-success', inactive: 'badge-slate' };
const ROLE_COLORS   = { student: 'badge-primary', job_seeker: 'badge-accent', admin: 'badge-warning' };

const barGradient = ['#6366f1','#7c3aed','#6366f1','#4f46e5','#818cf8',
  '#6366f1','#4338ca','#6366f1','#818cf8','#a5b4fc','#6366f1','#4f46e5'];

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get(ENDPOINTS.ADMIN_STATS).then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  const kpis = [
    { label: 'Total Users',        value: stats.totalUsers.toLocaleString(),  icon: Users,         color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Active Users',       value: stats.activeUsers.toLocaleString(), icon: Activity,      color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Assessments Today',  value: stats.assessmentsToday,             icon: ClipboardList, color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Avg. Match Score',   value: `${stats.avgMatchScore}%`,          icon: TrendingUp,    color: 'text-accent-600',  bg: 'bg-accent-50' },
  ];

  const filteredUsers = stats.recentUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Platform overview and user management</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${k.bg} flex items-center justify-center shrink-0`}>
              <k.icon size={22} className={k.color} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">{k.value}</p>
              <p className="text-xs text-slate-500">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly signups chart */}
      <div className="card">
        <h2 className="section-title mb-1">Monthly Signups</h2>
        <p className="section-subtitle mb-5">New user registrations over the past 12 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.monthlySignups} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
              formatter={(v) => [v, 'New Users']}
            />
            <Bar dataKey="users" radius={[6, 6, 0, 0]}>
              {stats.monthlySignups.map((_, i) => (
                <Cell key={i} fill={barGradient[i % barGradient.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User table */}
      <div className="card">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div>
            <h2 className="section-title">Recent Users</h2>
            <p className="section-subtitle">Latest registered accounts</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input-field pl-9 w-56" placeholder="Search users..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Role</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 hidden sm:table-cell">
                    <span className={`badge ${ROLE_COLORS[u.role] || 'badge-slate'} capitalize`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 text-xs hidden md:table-cell">{u.joined}</td>
                  <td className="py-3.5 px-3">
                    <span className={`badge ${STATUS_COLORS[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="py-3.5 px-3 hidden lg:table-cell">
                    <div className="flex gap-1.5">
                      <button className="text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors">View</button>
                      <button className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-lg font-medium hover:bg-red-100 transition-colors">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No users match your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity log */}
      <div className="card">
        <h2 className="section-title mb-4">Recent Platform Activity</h2>
        <div className="space-y-3">
          {[
            { text: 'Priya S. completed Skill Assessment',       time: '2m ago',   dot: 'bg-emerald-500' },
            { text: 'Rahul G. registered a new account',         time: '15m ago',  dot: 'bg-primary-500' },
            { text: 'AI engine updated career recommendations',  time: '1h ago',   dot: 'bg-accent-500' },
            { text: 'Sneha P. bookmarked "Data Scientist"',      time: '2h ago',   dot: 'bg-amber-500' },
            { text: 'System: 148 assessments completed today',   time: '3h ago',   dot: 'bg-violet-500' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <span className={`w-2 h-2 rounded-full ${a.dot} shrink-0`} />
              <p className="flex-1 text-sm text-slate-700">{a.text}</p>
              <span className="text-xs text-slate-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
