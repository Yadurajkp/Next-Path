import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import ProgressBar from '../../components/common/ProgressBar';
import { ChevronRight, ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';

const steps = [
  {
    id: 'programming', title: 'Programming & Development',
    desc: 'Rate your proficiency in programming languages and development tools.',
    skills: ['Python', 'JavaScript', 'Java', 'SQL', 'React / Angular / Vue'],
  },
  {
    id: 'data', title: 'Data & Analytics',
    desc: 'How comfortable are you with data-related skills?',
    skills: ['Data Analysis', 'Machine Learning', 'Statistics', 'Data Visualization', 'Excel / Sheets'],
  },
  {
    id: 'design', title: 'Design & Creativity',
    desc: 'Assess your creative and design capabilities.',
    skills: ['UI/UX Design', 'Figma / Adobe XD', 'Graphic Design', 'Video Editing', 'Content Creation'],
  },
  {
    id: 'business', title: 'Business & Management',
    desc: 'Rate your business and soft skills.',
    skills: ['Project Management', 'Communication', 'Leadership', 'Marketing', 'Finance Basics'],
  },
  {
    id: 'cloud', title: 'Cloud & Infrastructure',
    desc: 'Evaluate your technical infrastructure knowledge.',
    skills: ['AWS / Azure / GCP', 'Docker / Kubernetes', 'Linux / Terminal', 'Networking', 'Cybersecurity'],
  },
];

export default function SkillAssessment() {
  const { success } = useNotification();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [ratings, setRatings]  = useState({});
  const [submitting, setSubmitting] = useState(false);

  const step = steps[current];
  const totalRated = Object.keys(ratings).length;
  const totalSkills = steps.reduce((acc, s) => acc + s.skills.length, 0);

  const setRating = (skill, val) => setRatings((p) => ({ ...p, [skill]: val }));

  const canNext = step.skills.every((s) => ratings[s] !== undefined);

  const handleSubmit = async () => {
    setSubmitting(true);
    await api.post(ENDPOINTS.SUBMIT_ASSESSMENT, { ratings });
    success('Assessment submitted! Generating your career matches...');
    setTimeout(() => navigate('/careers'), 1500);
  };

  return (
    <div className="max-w-2xl animate-slide-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Skill Assessment</h1>
        <p className="text-slate-500 text-sm">Rate yourself honestly — this powers your AI career recommendations.</p>
      </div>

      {/* Overall progress */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Overall Progress</span>
          <span className="text-sm font-bold text-primary-600">{totalRated} / {totalSkills} skills rated</span>
        </div>
        <ProgressBar value={totalRated} max={totalSkills} color="bg-primary-500" height="h-2.5" />
        <div className="flex gap-1 mt-3">
          {steps.map((s, i) => (
            <div key={s.id} className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
              i < current ? 'bg-primary-500' : i === current ? 'bg-primary-300' : 'bg-slate-200'
            }`} />
          ))}
        </div>
      </div>

      {/* Step card */}
      <div className="card mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-primary">Step {current + 1} of {steps.length}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{step.title}</h2>
        <p className="text-slate-500 text-sm mb-6">{step.desc}</p>

        <div className="space-y-6">
          {step.skills.map((skill) => (
            <div key={skill}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">{skill}</label>
                <span className={`text-sm font-bold ${ratings[skill] !== undefined ? 'text-primary-600' : 'text-slate-400'}`}>
                  {ratings[skill] !== undefined ? `${ratings[skill]}/10` : 'Not rated'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-12">Beginner</span>
                <input
                  type="range" min={1} max={10} step={1}
                  value={ratings[skill] ?? 1}
                  onChange={(e) => setRating(skill, Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-slate-200 accent-primary-600 cursor-pointer"
                />
                <span className="text-xs text-slate-400 w-10 text-right">Expert</span>
              </div>
              <div className="flex justify-between mt-1 px-12">
                {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <button key={n} onClick={() => setRating(skill, n)}
                    className={`w-6 h-6 rounded-full text-xs font-semibold transition-all duration-150 ${
                      ratings[skill] === n ? 'bg-primary-600 text-white scale-110' : 'bg-slate-100 text-slate-500 hover:bg-primary-100 hover:text-primary-600'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((p) => p - 1)}
          disabled={current === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ChevronLeft size={18} /> Previous
        </button>

        {current < steps.length - 1 ? (
          <button onClick={() => setCurrent((p) => p + 1)} disabled={!canNext} className="btn-primary">
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!canNext || submitting} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><CheckCircle size={16} /> Submit Assessment</>}
          </button>
        )}
      </div>
    </div>
  );
}
