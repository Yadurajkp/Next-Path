import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const interestCategories = [
  { id: 'tech',         label: 'Technology',         icon: '💻', desc: 'Software, AI, Cybersecurity, Cloud' },
  { id: 'data',         label: 'Data Science',        icon: '📊', desc: 'Analytics, ML, Statistics, BI' },
  { id: 'design',       label: 'Design & UX',         icon: '🎨', desc: 'UI/UX, Graphic Design, Branding' },
  { id: 'business',     label: 'Business Strategy',   icon: '📈', desc: 'Management, Consulting, Operations' },
  { id: 'finance',      label: 'Finance & Fintech',   icon: '💰', desc: 'Banking, Investment, Crypto' },
  { id: 'healthcare',   label: 'Healthcare & Bio',    icon: '🏥', desc: 'Medicine, Biotech, Mental Health' },
  { id: 'education',    label: 'Education & Research',icon: '📚', desc: 'Teaching, Academia, E-learning' },
  { id: 'marketing',    label: 'Marketing & Growth',  icon: '📣', desc: 'Digital Marketing, SEO, Content' },
  { id: 'product',      label: 'Product Management',  icon: '🗂️', desc: 'Product Strategy, Roadmaps, Agile' },
  { id: 'legal',        label: 'Law & Policy',        icon: '⚖️', desc: 'Legal Tech, Compliance, IP Law' },
  { id: 'arts',         label: 'Arts & Media',        icon: '🎬', desc: 'Film, Journalism, Photography' },
  { id: 'engineering',  label: 'Core Engineering',    icon: '⚙️', desc: 'Mechanical, Civil, Electronics' },
];

const workStyles = [
  { id: 'remote',      label: 'Fully Remote',        icon: '🏠' },
  { id: 'hybrid',      label: 'Hybrid',              icon: '🔄' },
  { id: 'office',      label: 'Office-Based',        icon: '🏢' },
  { id: 'any',         label: 'No Preference',       icon: '✨' },
];

const teamSizes = [
  { id: 'solo',    label: 'Solo / Freelance' },
  { id: 'small',   label: 'Small Team (2–10)' },
  { id: 'medium',  label: 'Mid-size (11–100)' },
  { id: 'large',   label: 'Large Corp (100+)' },
];

export default function InterestAnalysis() {
  const { success } = useNotification();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [workStyle, setWorkStyle] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleInterest = (id) =>
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    await api.post(ENDPOINTS.SUBMIT_INTERESTS, { interests: selected, workStyle, teamSize });
    success('Interests saved! Updating your career recommendations...');
    setTimeout(() => navigate('/careers'), 1500);
  };

  const canSubmit = selected.length >= 3 && workStyle && teamSize;

  return (
    <div className="max-w-3xl animate-slide-up">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Interest Analysis</h1>
        <p className="text-slate-500 text-sm">Select at least 3 interest areas and answer work-style questions to fine-tune your career recommendations.</p>
      </div>

      {/* Interest grid */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 text-lg">What are you passionate about?</h2>
          <span className={`badge ${selected.length >= 3 ? 'badge-success' : 'badge-slate'}`}>
            {selected.length} / 3+ selected
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {interestCategories.map((cat) => {
            const active = selected.includes(cat.id);
            return (
              <button key={cat.id} onClick={() => toggleInterest(cat.id)}
                className={`relative flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                  active ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}>
                {active && <CheckCircle size={16} className="absolute top-2.5 right-2.5 text-primary-600" />}
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className={`font-semibold text-sm ${active ? 'text-primary-700' : 'text-slate-800'}`}>{cat.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Work style */}
      <div className="card mb-5">
        <h2 className="font-bold text-slate-800 text-lg mb-4">Preferred Work Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {workStyles.map((w) => (
            <button key={w.id} onClick={() => setWorkStyle(w.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                workStyle === w.id ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              <span className="text-2xl">{w.icon}</span>
              <span className="text-xs font-semibold text-center">{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Team size */}
      <div className="card mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-4">Preferred Team / Company Size</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {teamSizes.map((t) => (
            <button key={t.id} onClick={() => setTeamSize(t.id)}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                teamSize === t.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Validation hint */}
      {!canSubmit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
          Select at least 3 interests, a work style, and a team size to continue.
        </div>
      )}

      <button onClick={handleSubmit} disabled={!canSubmit || submitting} className="btn-primary w-full py-3 text-base">
        {submitting
          ? <><Loader2 size={18} className="animate-spin" /> Analysing...</>
          : <>Analyse My Interests <ArrowRight size={18} /></>}
      </button>
    </div>
  );
}
