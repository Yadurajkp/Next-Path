import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ProgressRing from '../../components/common/ProgressRing';
import ProgressBar from '../../components/common/ProgressBar';
import { Loader2, Search, Bookmark, BookmarkCheck, TrendingUp, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const DOMAINS = ['All', 'Technology', 'Business', 'Design'];

const matchColor = (m) => {
  if (m >= 85) return '#10b981';
  if (m >= 70) return '#6366f1';
  if (m >= 55) return '#f59e0b';
  return '#ef4444';
};

export default function CareerRecommendations() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [domain, setDomain]   = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [saved, setSaved]     = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get(ENDPOINTS.RECOMMENDATIONS)
      .then((r) => setCareers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = careers.filter((c) => {
    const matchesDomain = domain === 'All' || c.domain === domain;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesPct    = c.match >= minMatch;
    return matchesDomain && matchesSearch && matchesPct;
  });

  const toggleSave = (id) =>
    setSaved((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Career Recommendations</h1>
        <p className="text-slate-500 text-sm">AI-powered matches based on your skills, interests, and goals.</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-48">
            <label className="label">Search</label>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pl-9" placeholder="e.g. Data Scientist..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          {/* Domain */}
          <div>
            <label className="label">Domain</label>
            <div className="flex gap-2 flex-wrap">
              {DOMAINS.map((d) => (
                <button key={d} onClick={() => setDomain(d)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${
                    domain === d ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Min match */}
          <div className="min-w-40">
            <label className="label">Min Match: <strong className="text-primary-600">{minMatch}%</strong></label>
            <input type="range" min={0} max={90} step={5} value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-full accent-primary-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">Showing <strong className="text-slate-700">{filtered.length}</strong> career{filtered.length !== 1 ? 's' : ''}</p>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((c) => {
          const isExpanded = expanded === c.id;
          const isSaved    = saved.includes(c.id);
          return (
            <div key={c.id} className="card hover:shadow-card-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Ring */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <ProgressRing percent={c.match} size={80} strokeWidth={7} color={matchColor(c.match)} />
                  <span className="text-xs font-semibold text-slate-500">Match Score</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xl">{c.icon}</span>
                        <h2 className="text-lg font-bold text-slate-800">{c.title}</h2>
                        <span className={`badge ${c.match >= 85 ? 'badge-success' : c.match >= 70 ? 'badge-primary' : 'badge-warning'}`}>
                          {c.match >= 85 ? 'Excellent' : c.match >= 70 ? 'Good' : 'Fair'} Match
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{c.description}</p>
                    </div>
                    <button onClick={() => toggleSave(c.id)}
                      className={`shrink-0 p-2 rounded-xl border-2 transition-all duration-200 ${
                        isSaved ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 text-slate-400 hover:border-primary-300'
                      }`}>
                      {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <DollarSign size={14} className="text-emerald-500" />
                      <span className="font-medium">{c.salary}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <TrendingUp size={14} className="text-primary-500" />
                      <span className="font-medium">Growth: {c.growth}</span>
                    </div>
                    <span className="badge-slate">{c.domain}</span>
                  </div>

                  {/* Required skills */}
                  <div className="flex flex-wrap gap-2">
                    {c.requiredSkills.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expand */}
              <button onClick={() => setExpanded(isExpanded ? null : c.id)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                {isExpanded ? <><ChevronUp size={16} /> Show less</> : <><ChevronDown size={16} /> Show skill breakdown</>}
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fade-in">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Your Skill Match Breakdown</h3>
                  {c.requiredSkills.map((skill, i) => {
                    const userRating = [8, 7, 5, 6, 4][i % 5];
                    const reqRating  = 9;
                    const pct = Math.round((userRating / reqRating) * 100);
                    return (
                      <div key={skill} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-36 truncate">{skill}</span>
                        <div className="flex-1">
                          <ProgressBar value={pct} color={pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-400'} height="h-2" />
                        </div>
                        <span className={`text-xs font-bold w-10 text-right ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-600 font-semibold">No careers match your filters.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting the domain or minimum match percentage.</p>
        </div>
      )}
    </div>
  );
}
