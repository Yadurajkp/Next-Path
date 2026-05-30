import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Zap, ArrowRight, BarChart2, Map, Briefcase, TrendingUp,
  Star, ChevronRight, CheckCircle, Users, Award, Target
} from 'lucide-react';

const features = [
  { icon: Briefcase,  color: 'bg-primary-50 text-primary-600',  title: 'AI Career Matching',      desc: 'Get career recommendations tailored to your unique skills, interests, and goals with match percentages.' },
  { icon: TrendingUp, color: 'bg-accent-50 text-accent-600',    title: 'Skill Gap Analysis',       desc: 'Instantly identify the gaps between your current skills and what your dream career demands.' },
  { icon: Map,        color: 'bg-amber-50 text-amber-600',      title: 'Learning Roadmaps',        desc: 'Follow personalised week-by-week roadmaps with curated resources, courses, and milestones.' },
  { icon: BarChart2,  color: 'bg-emerald-50 text-emerald-600',  title: 'Progress Tracking',        desc: 'Track your learning streaks, completed goals, and overall career readiness in real time.' },
  { icon: Target,     color: 'bg-rose-50 text-rose-600',        title: 'Interest Analysis',        desc: 'Discover careers aligned with your passions through our structured interest analysis quiz.' },
  { icon: Award,      color: 'bg-violet-50 text-violet-600',    title: 'Skill Assessments',        desc: 'Rate yourself across 50+ skills in guided multi-step assessments to calibrate recommendations.' },
];

const steps = [
  { num: '01', title: 'Build Your Profile',       desc: 'Tell us about your education, skills, and career goals.' },
  { num: '02', title: 'Complete Assessments',     desc: 'Take skill and interest assessments to train the AI engine.' },
  { num: '03', title: 'Get Your Career Roadmap',  desc: 'Receive personalised recommendations and a step-by-step learning plan.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Now: Data Scientist at Flipkart', text: 'NextPath AI identified data science as my top match at 94%. The roadmap helped me land my dream job in 8 months!', rating: 5 },
  { name: 'Rahul G.', role: 'Now: Full Stack Dev at Razorpay', text: 'The skill gap analysis was eye-opening. I knew exactly what to learn. The structured roadmap made all the difference.', rating: 5 },
  { name: 'Ananya R.', role: 'Now: Product Manager at Swiggy', text: 'I was confused about my career direction. NextPath AI gave me clarity and confidence to pivot into product management.', rating: 5 },
];

const stats = [
  { value: '50K+', label: 'Students Guided' },
  { value: '94%',  label: 'Satisfaction Rate' },
  { value: '200+', label: 'Career Paths' },
  { value: '8mo',  label: 'Avg. Time to Job' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">NextPath</span>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-md">AI</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost hidden sm:inline-flex">Sign In</Link>
                <Link to="/register" className="btn-primary">Get Started Free <ArrowRight size={16} /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/40 to-accent-50/30 pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap size={14} /> AI-Powered Career Guidance
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Discover Your{' '}
            <span className="gradient-text">Perfect Career Path</span>
            {' '}with AI
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            NextPath AI analyses your skills, interests, and goals to recommend the best career paths — complete with personalised skill gap analysis and learning roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Start For Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Sign In
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Powerful AI tools to guide your career journey from exploration to employment.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover group">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-primary-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-500">Three simple steps to your ideal career path.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <ChevronRight size={24} className="hidden md:block absolute top-6 -right-4 text-slate-300" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-5 shadow-md">
                  {s.num}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-lg text-slate-500">Join thousands who found their path with NextPath AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card border-slate-100 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Find Your Path?</h2>
          <p className="text-primary-100 text-lg mb-8">Create your free account and get personalised career recommendations in under 10 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              Get Started — It's Free <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-primary-200 text-sm">
            {['No credit card', 'Cancel anytime', '100% free plan'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle size={14} /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-white">NextPath AI</span>
          </div>
          <p className="text-sm text-center">© 2026 NextPath AI. Empowering careers with artificial intelligence.</p>
          <div className="flex gap-5 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
