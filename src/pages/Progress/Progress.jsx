import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ProgressRing from '../../components/common/ProgressRing';
import ProgressBar from '../../components/common/ProgressBar';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Loader2, Flame, BookOpen, ClipboardCheck, Target, Calendar } from 'lucide-react';

const barColors = ['#6366f1','#818cf8','#6366f1','#a5b4fc','#6366f1','#818cf8','#c7d2fe'];

export default function Progress() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(ENDPOINTS.PROGRESS).then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  const stats = [
    { label: 'Day Streak',            value: data.streak,               icon: Flame,         color: 'text-rose-600',    bg: 'bg-rose-50',    suffix: '🔥' },
    { label: 'Courses Completed',     value: data.coursesCompleted,      icon: BookOpen,      color: 'text-amber-600',   bg: 'bg-amber-50',   suffix: '' },
    { label: 'Assessments Done',      value: data.assessmentsCompleted,  icon: ClipboardCheck,color: 'text-accent-600',  bg: 'bg-accent-50',  suffix: '' },
    { label: 'Overall Progress',      value: `${data.overallProgress}%`, icon: Target,        color: 'text-primary-600', bg: 'bg-primary-50', suffix: '' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Progress Tracking</h1>
        <p className="text-slate-500 text-sm">Monitor your learning activity, streaks, and goal completion.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-800">{s.value}{s.suffix}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Area chart */}
        <div className="card">
          <h2 className="section-title mb-1">Weekly Learning Hours</h2>
          <p className="section-subtitle mb-5">Hours spent this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.weeklyActivity} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(v) => [`${v}h`, 'Hours']} />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fill="url(#pGrad)"
                dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="card">
          <h2 className="section-title mb-1">Daily Activity Breakdown</h2>
          <p className="section-subtitle mb-5">Hours per day distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weeklyActivity} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(v) => [`${v}h`, 'Hours']} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {data.weeklyActivity.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overall ring */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="section-title mb-1">Career Readiness</h2>
            <p className="section-subtitle">How ready you are for your target career</p>
          </div>
          <ProgressRing percent={data.overallProgress} size={100} strokeWidth={8} color="#6366f1" />
        </div>
      </div>

      {/* Goals */}
      <div className="card">
        <h2 className="section-title mb-5">Goal Progress</h2>
        <div className="space-y-5">
          {data.goals.map((g) => (
            <div key={g.id} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <Target size={16} className="text-primary-500 shrink-0" />
                  <p className="font-semibold text-slate-800 text-sm">{g.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar size={12} /> Due {g.dueDate}
                  </span>
                  <span className="font-bold text-primary-600 text-sm">{g.progress}%</span>
                </div>
              </div>
              <ProgressBar
                value={g.progress}
                color={g.progress >= 70 ? 'bg-emerald-500' : g.progress >= 40 ? 'bg-primary-500' : 'bg-amber-500'}
                height="h-3"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
