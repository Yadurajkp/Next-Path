import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import { User, GraduationCap, Star, Target, Plus, X, Save, Loader2, Edit2 } from 'lucide-react';

const SKILL_SUGGESTIONS = ['Python', 'JavaScript', 'React', 'SQL', 'Machine Learning', 'Data Analysis', 'Java', 'Node.js', 'AWS', 'Docker', 'Figma', 'Excel'];
const INTEREST_OPTIONS   = ['Technology', 'Data Science', 'Design', 'Business', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Research', 'Entrepreneurship', 'Arts', 'Engineering'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { success, error }   = useNotification();

  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [profile, setProfile]   = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newEdu, setNewEdu]     = useState({ degree: '', institution: '', year: '' });
  const [showEduForm, setShowEduForm] = useState(false);

  useEffect(() => {
    api.get(ENDPOINTS.PROFILE).then((res) => setProfile(res.data));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(ENDPOINTS.UPDATE_PROFILE, profile);
      updateUser(res.data);
      success('Profile updated successfully!');
      setEditing(false);
    } catch {
      error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    const s = skill || newSkill.trim();
    if (s && !profile.skills.includes(s)) {
      setProfile((p) => ({ ...p, skills: [...p.skills, s] }));
    }
    setNewSkill('');
  };

  const removeSkill = (skill) => setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const toggleInterest = (i) => {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(i) ? p.interests.filter((x) => x !== i) : [...p.interests, i],
    }));
  };

  const addEducation = () => {
    if (!newEdu.degree || !newEdu.institution) return;
    setProfile((p) => ({ ...p, education: [...p.education, { id: Date.now().toString(), ...newEdu }] }));
    setNewEdu({ degree: '', institution: '', year: '' });
    setShowEduForm(false);
  };

  const removeEducation = (id) => setProfile((p) => ({ ...p, education: p.education.filter((e) => e.id !== id) }));

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title text-2xl">My Profile</h1>
          <p className="section-subtitle">Manage your personal information and career preferences</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-secondary">
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Avatar + Basic */}
      <div className="card flex items-center gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-md">
          {profile.name?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
          <p className="text-slate-500 text-sm">{profile.email}</p>
          <span className="badge-primary mt-1.5 capitalize">{profile.role?.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Education */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GraduationCap size={20} className="text-primary-500" />
            <h2 className="font-bold text-slate-800 text-lg">Education</h2>
          </div>
          {editing && (
            <button onClick={() => setShowEduForm(!showEduForm)} className="btn-ghost text-primary-600">
              <Plus size={16} /> Add
            </button>
          )}
        </div>

        {showEduForm && editing && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Degree / Certificate</label>
                <input className="input-field" placeholder="B.Tech Computer Science"
                  value={newEdu.degree} onChange={(e) => setNewEdu((p) => ({ ...p, degree: e.target.value }))} />
              </div>
              <div>
                <label className="label">Institution</label>
                <input className="input-field" placeholder="IIT Delhi"
                  value={newEdu.institution} onChange={(e) => setNewEdu((p) => ({ ...p, institution: e.target.value }))} />
              </div>
              <div>
                <label className="label">Year</label>
                <input className="input-field" placeholder="2024"
                  value={newEdu.year} onChange={(e) => setNewEdu((p) => ({ ...p, year: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addEducation} className="btn-primary text-sm">Add Entry</button>
              <button onClick={() => setShowEduForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        {profile.education.length === 0 && <p className="text-sm text-slate-400">No education entries yet.</p>}
        <div className="space-y-3">
          {profile.education.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-800 text-sm">{e.degree}</p>
                <p className="text-xs text-slate-500">{e.institution} · {e.year}</p>
              </div>
              {editing && (
                <button onClick={() => removeEducation(e.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2.5">
          <Star size={20} className="text-amber-500" />
          <h2 className="font-bold text-slate-800 text-lg">Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 badge-primary py-1 px-3">
              {s}
              {editing && (
                <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
        {editing && (
          <div>
            <div className="flex gap-2 mb-3">
              <input className="input-field" placeholder="Add a skill..." value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
              <button onClick={() => addSkill()} className="btn-primary shrink-0">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.filter((s) => !profile.skills.includes(s)).map((s) => (
                <button key={s} onClick={() => addSkill(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2.5">
          <User size={20} className="text-accent-500" />
          <h2 className="font-bold text-slate-800 text-lg">Interests</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((i) => {
            const active = profile.interests.includes(i);
            return (
              <button key={i} onClick={() => editing && toggleInterest(i)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-150 ${
                  active
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                } ${!editing ? 'cursor-default' : ''}`}>
                {i}
              </button>
            );
          })}
        </div>
      </div>

      {/* Career Goals */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2.5">
          <Target size={20} className="text-primary-500" />
          <h2 className="font-bold text-slate-800 text-lg">Career Goals</h2>
        </div>
        {editing ? (
          <textarea rows={3}
            className="input-field resize-none"
            value={profile.careerGoals}
            onChange={(e) => setProfile((p) => ({ ...p, careerGoals: e.target.value }))}
            placeholder="Describe your career aspirations..."
          />
        ) : (
          <p className="text-slate-600 text-sm leading-relaxed">{profile.careerGoals || 'No career goals set yet.'}</p>
        )}
      </div>
    </div>
  );
}
