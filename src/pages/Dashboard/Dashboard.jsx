import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ProgressRing from '../../components/common/ProgressRing';
import ProgressBar from '../../components/common/ProgressBar';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Briefcase, TrendingUp, BookOpen, Award, ArrowRight,
  Flame, Bell, ClipboardList, Lightbulb, ChevronRight, Loader2
} from 'lucide-react';

const activityData = [
  { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3 }, { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4 },  { day: 'Fri', hours: 2 }, { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 1 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [careers, setCareers] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(ENDPOINTS.RECOMMENDATIONS),
      api.get(ENDPOINTS.PROGRESS),
    ]).then(([cRes, pRes]) => {
      setCareers(cRes.data.slice(0, 3));
      setProgress(pRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const quickStats = [
    { label: 'Top Match',          value: careers[0] ? `${careers[0].match}%` : '—', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Skills Assessed',    value: '28',  icon: ClipboardList, color: 'text-accent-600',   bg: 'bg-accent-50' },
    { label: 'Courses Completed',  value: progress?.coursesCompleted ?? '—', icon: BookOpen,     color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Day Streak',         value: progress ? `${progress.streak}🔥` : '—', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white shadow-card-md">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Good evening 👋</p>
            <h1 className="text-2xl font-extrabold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-primary-100 text-sm">Your career journey is {progress?.overallProgress ?? 0}% complete. Keep going!</p>
          </div>
          <ProgressRing percent={progress?.overallProgress ?? 0} size={88} strokeWidth={7} color="#fff" label={true} />
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link to="/assessment" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200">
            <ClipboardList size={15} /> Take Assessment
          </Link>
          <Link to="/careers" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200">
            <Briefcase size={15} /> View Careers
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Weekly Activity</h2>
              <p className="section-subtitle">Hours spent learning this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(v) => [`${v}h`, 'Hours']}
              />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorHours)" dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Notifications</h2>
            <Link to="/notifications" className="text-sm text-primary-600 hover:underline font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { title: 'New Career Match!',      time: '5m ago',  dot: 'bg-primary-500' },
              { title: 'Complete Assessment',    time: '2h ago',  dot: 'bg-amber-500' },
              { title: 'Roadmap Updated',        time: '1d ago',  dot: 'bg-accent-500' },
            ].map((n) => (
              <div key={n.title} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{n.title}</p>
                  <p className="text-xs text-slate-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Career Matches */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">Top Career Matches</h2>
            <p className="section-subtitle">Based on your profile and assessments</p>
          </div>
          <Link to="/careers" className="btn-ghost text-primary-600 gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {careers.map((c) => (
            <Link to="/careers" key={c.id} className="group p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/40 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{c.icon}</span>
                <span className="badge-primary">{c.match}% match</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-slate-500">{c.domain}</p>
              <div className="mt-3">
                <ProgressBar value={c.match} color="bg-primary-500" height="h-1.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">Active Goals</h2>
            <p className="section-subtitle">Your current learning objectives</p>
          </div>
          <Link to="/progress" className="btn-ghost text-primary-600 gap-1">Track <ChevronRight size={16} /></Link>
        </div>
        <div className="space-y-4">
          {(progress?.goals ?? []).map((g) => (
            <div key={g.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-slate-700 truncate">{g.title}</p>
                  <span className="text-sm font-bold text-primary-600 ml-2">{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} color="bg-primary-500" height="h-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
