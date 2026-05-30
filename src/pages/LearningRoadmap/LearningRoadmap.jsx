import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { Loader2, CheckCircle, Clock, Lock, ExternalLink, BookOpen, Video, Wrench, Globe } from 'lucide-react';

const statusConfig = {
  completed:   { label: 'Completed',   color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
  'in-progress':{ label: 'In Progress', color: 'bg-primary-500', textColor: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200', icon: Clock },
  upcoming:    { label: 'Upcoming',    color: 'bg-slate-300',   textColor: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   icon: Lock },
};

const resourceIcon = (type) => {
  switch (type) {
    case 'Course': return <Video size={13} />;
    case 'Book':   return <BookOpen size={13} />;
    case 'Tool':   return <Wrench size={13} />;
    default:       return <Globe size={13} />;
  }
};

export default function LearningRoadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(['r1']);

  useEffect(() => {
    api.get(ENDPOINTS.ROADMAP)
      .then((r) => setRoadmap(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleComplete = (id) =>
    setCompleted((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const getStatus = (item) => {
    if (completed.includes(item.id)) return 'completed';
    return item.status;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  const completedCount = roadmap.filter((r) => completed.includes(r.id)).length;

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Learning Roadmap</h1>
        <p className="text-slate-500 text-sm">Your personalised path to becoming a <strong className="text-primary-600">Data Scientist</strong>.</p>
      </div>

      {/* Progress summary */}
      <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm mb-1">Roadmap Progress</p>
            <p className="text-3xl font-extrabold">{completedCount} / {roadmap.length} <span className="text-lg font-semibold text-primary-100">milestones</span></p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-extrabold">{Math.round((completedCount / roadmap.length) * 100)}%</p>
            <p className="text-primary-200 text-sm">complete</p>
          </div>
        </div>
        <div className="mt-4 bg-primary-500/40 rounded-full h-2.5 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${(completedCount / roadmap.length) * 100}%` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-slate-200 to-slate-100" />

        <div className="space-y-6">
          {roadmap.map((item, index) => {
            const status = getStatus(item);
            const cfg    = statusConfig[status];
            const Icon   = cfg.icon;
            const isLocked = status === 'upcoming' && index > 0 && getStatus(roadmap[index - 1]) !== 'completed';

            return (
              <div key={item.id} className="relative flex gap-5">
                {/* Timeline dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${cfg.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon size={20} className="text-white" />
                </div>

                {/* Card */}
                <div className={`flex-1 card border-2 ${cfg.border} ${cfg.bg} pb-5`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-0.5">{item.week}</p>
                      <h2 className="font-bold text-slate-800 text-lg">{item.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        status === 'completed' ? 'badge-success' : status === 'in-progress' ? 'badge-primary' : 'badge-slate'
                      }`}>
                        {cfg.label}
                      </span>
                      <button
                        onClick={() => toggleComplete(item.id)}
                        disabled={isLocked}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-all duration-200 ${
                          status === 'completed'
                            ? 'border-emerald-400 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-600'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {status === 'completed' ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {item.resources.map((r) => (
                        <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-primary-400 hover:text-primary-600 transition-all duration-150 shadow-sm">
                          {resourceIcon(r.type)}
                          {r.name}
                          <ExternalLink size={10} className="opacity-50" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
