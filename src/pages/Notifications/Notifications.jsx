import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { Loader2, Bell, Briefcase, Clock, Info, CheckCheck } from 'lucide-react';

const typeConfig = {
  recommendation: { icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50', label: 'Recommendation' },
  reminder:       { icon: Clock,     color: 'text-amber-600',   bg: 'bg-amber-50',   label: 'Reminder' },
  update:         { icon: Info,      color: 'text-accent-600',  bg: 'bg-accent-50',  label: 'Update' },
};

const FILTERS = ['All', 'Recommendation', 'Reminder', 'Update'];

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');

  useEffect(() => {
    api.get(ENDPOINTS.NOTIFICATIONS).then((r) => setNotifs(r.data)).finally(() => setLoading(false));
  }, []);

  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));

  const filtered = notifs.filter((n) =>
    filter === 'All' || typeConfig[n.type]?.label === filter
  );
  const unreadCount = notifs.filter((n) => !n.read).length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Notifications</h1>
          <p className="text-slate-500 text-sm">
            You have <strong className="text-primary-600">{unreadCount} unread</strong> notification{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm gap-1.5">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${
              filter === f ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const cfg  = typeConfig[n.type] || typeConfig.update;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-card-md border-l-4 ${
                n.read ? 'border-l-transparent opacity-75' : 'border-l-primary-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-bold ${n.read ? 'text-slate-600' : 'text-slate-800'}`}>{n.title}</p>
                        {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{n.message}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`badge ${
                      n.type === 'recommendation' ? 'badge-primary' :
                      n.type === 'reminder'       ? 'badge-warning' : 'badge-accent'
                    }`}>{cfg.label}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-16">
          <Bell size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No notifications here.</p>
          <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
