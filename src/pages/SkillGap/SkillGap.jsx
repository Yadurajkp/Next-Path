import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ProgressBar from '../../components/common/ProgressBar';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const severityConfig = {
  high:   { badge: 'badge-danger',   icon: AlertTriangle, color: 'text-red-500',    label: 'High Gap' },
  medium: { badge: 'badge-warning',  icon: Info,          color: 'text-amber-500',  label: 'Medium Gap' },
  low:    { badge: 'badge-success',  icon: CheckCircle,   color: 'text-emerald-500',label: 'Low Gap' },
};

const getSeverity = (user, req) => {
  const gap = req - user;
  if (gap >= 4) return 'high';
  if (gap >= 2) return 'medium';
  return 'low';
};

export default function SkillGap() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(ENDPOINTS.SKILL_GAP)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  const skills = Object.keys(data.userSkills);
  const radarData = skills.map((s) => ({
    skill: s,
    You:      data.userSkills[s],
    Required: data.requiredSkills[s],
  }));

  const gapRows = skills.map((s) => ({
    skill:    s,
    user:     data.userSkills[s],
    required: data.requiredSkills[s],
    gap:      data.requiredSkills[s] - data.userSkills[s],
    severity: getSeverity(data.userSkills[s], data.requiredSkills[s]),
  })).sort((a, b) => b.gap - a.gap);

  const highGaps   = gapRows.filter((r) => r.severity === 'high').length;
  const medGaps    = gapRows.filter((r) => r.severity === 'medium').length;
  const readiness  = Math.round(
    (skills.reduce((acc, s) => acc + Math.min(data.userSkills[s] / data.requiredSkills[s], 1), 0) / skills.length) * 100
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Skill Gap Analysis</h1>
        <p className="text-slate-500 text-sm">Target career: <strong className="text-primary-600">{data.targetCareer}</strong></p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Career Readiness',  value: `${readiness}%`, color: 'text-primary-600',  bg: 'bg-primary-50' },
          { label: 'High Priority Gaps',value: highGaps,        color: 'text-red-600',      bg: 'bg-red-50' },
          { label: 'Medium Priority',   value: medGaps,         color: 'text-amber-600',    bg: 'bg-amber-50' },
          { label: 'Skills Analysed',   value: skills.length,   color: 'text-accent-600',   bg: 'bg-accent-50' },
        ].map((s) => (
          <div key={s.label} className={`card ${s.bg}`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="card">
          <h2 className="section-title mb-1">Skill Comparison Radar</h2>
          <p className="section-subtitle mb-5">Your skills vs. {data.targetCareer} requirements</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Radar name="You" dataKey="You" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Required" dataKey="Required" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} strokeWidth={2} strokeDasharray="4 2" />
              <Legend />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Gap table */}
        <div className="card">
          <h2 className="section-title mb-1">Gap Details</h2>
          <p className="section-subtitle mb-5">Skills ranked by priority gap</p>
          <div className="space-y-4">
            {gapRows.map((row) => {
              const cfg  = severityConfig[row.severity];
              const Icon = cfg.icon;
              return (
                <div key={row.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={cfg.color} />
                      <span className="text-sm font-medium text-slate-700">{row.skill}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{row.user} / {row.required}</span>
                      <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    {/* Required bar */}
                    <div className="absolute inset-y-0 left-0 bg-accent-200 rounded-full"
                      style={{ width: `${(row.required / 10) * 100}%` }} />
                    {/* User bar */}
                    <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                      row.severity === 'high' ? 'bg-red-400' : row.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} style={{ width: `${(row.user / 10) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended actions */}
      <div className="card">
        <h2 className="section-title mb-4">Recommended Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gapRows.filter((r) => r.severity !== 'low').map((row) => (
            <div key={row.skill} className={`p-4 rounded-xl border-l-4 ${
              row.severity === 'high' ? 'bg-red-50 border-red-400' : 'bg-amber-50 border-amber-400'
            }`}>
              <p className="font-semibold text-slate-800 text-sm mb-1">{row.skill}</p>
              <p className="text-xs text-slate-600 mb-2">
                {row.severity === 'high' ? 'Critical gap — prioritise this skill immediately.' : 'Moderate gap — improve over the next few weeks.'}
              </p>
              <span className={`badge ${row.severity === 'high' ? 'badge-danger' : 'badge-warning'}`}>
                +{row.gap} levels needed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
