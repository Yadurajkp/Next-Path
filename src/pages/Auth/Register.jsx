import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, GraduationCap, Briefcase } from 'lucide-react';

const roles = [
  { value: 'student',    label: 'Student',    icon: GraduationCap, desc: 'Currently studying / recent graduate' },
  { value: 'job_seeker', label: 'Job Seeker', icon: Briefcase,     desc: 'Looking for career opportunities' },
];

export default function Register() {
  const { register } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!form.name  || form.name.trim().length < 2)   e.name     = 'Full name is required (min 2 chars)';
    if (!form.email || !form.email.includes('@'))      e.email    = 'Valid email is required';
    if (!form.password || form.password.length < 6)   e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      success('Account created! Welcome to NextPath AI 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-accent-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-2xl">NextPath <span className="text-primary-600">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Start your AI-powered career journey today</p>
        </div>

        <div className="card shadow-card-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                      form.role === r.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <r.icon size={20} />
                    <div>
                      <p className="font-semibold text-sm">{r.label}</p>
                      <p className="text-xs opacity-75">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="Aryan Mehta"
                  className={`input-field pl-10 ${errors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="reg-password" name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <p className="text-xs text-slate-500">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
