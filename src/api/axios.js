import axios from 'axios';

import axios from 'axios';

const api = axios.create({
  // Keep requests relative so the mock interceptor handles them.
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_USER = {
  id: 'u001',
  name: 'Aryan Mehta',
  email: 'aryan@example.com',
  role: 'student',
  avatar: null,
  education: [
    { id: 'e1', degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2024' },
  ],
  skills: ['Python', 'JavaScript', 'Machine Learning', 'SQL', 'React'],
  interests: ['Technology', 'Data Science', 'Entrepreneurship'],
  careerGoals: 'Become a Data Scientist at a leading tech company within 2 years.',
  joinedAt: '2025-09-01',
};

const MOCK_CAREERS = [
  {
    id: 'c1', title: 'Data Scientist', domain: 'Technology', match: 92,
    salary: '₹12–22 LPA', growth: 'Very High', icon: '🧪',
    description: 'Analyse complex data to help companies make data-driven decisions.',
    requiredSkills: ['Python', 'ML', 'Statistics', 'SQL', 'Data Visualization'],
  },
  {
    id: 'c2', title: 'Full Stack Developer', domain: 'Technology', match: 85,
    salary: '₹10–18 LPA', growth: 'High', icon: '💻',
    description: 'Build end-to-end web applications using modern frameworks.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'TypeScript'],
  },
  {
    id: 'c3', title: 'AI/ML Engineer', domain: 'Technology', match: 80,
    salary: '₹14–28 LPA', growth: 'Very High', icon: '🤖',
    description: 'Design and deploy machine learning models in production environments.',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Cloud', 'MLOps'],
  },
  {
    id: 'c4', title: 'Product Manager', domain: 'Business', match: 74,
    salary: '₹15–30 LPA', growth: 'High', icon: '📋',
    description: 'Lead cross-functional teams to build and launch successful products.',
    requiredSkills: ['Strategy', 'Communication', 'Analytics', 'Agile', 'UX'],
  },
  {
    id: 'c5', title: 'Cybersecurity Analyst', domain: 'Technology', match: 68,
    salary: '₹8–16 LPA', growth: 'High', icon: '🔐',
    description: 'Protect systems and data from digital threats and vulnerabilities.',
    requiredSkills: ['Networking', 'SIEM', 'Ethical Hacking', 'Linux', 'SOC'],
  },
  {
    id: 'c6', title: 'UX Designer', domain: 'Design', match: 61,
    salary: '₹7–15 LPA', growth: 'Moderate', icon: '🎨',
    description: 'Create intuitive, accessible user experiences for digital products.',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'CSS'],
  },
];

const MOCK_SKILL_GAP = {
  targetCareer: 'Data Scientist',
  userSkills:    { Python: 8, SQL: 7, Statistics: 5, ML: 6, 'Data Visualization': 4, Cloud: 3 },
  requiredSkills:{ Python: 9, SQL: 8, Statistics: 9, ML: 9, 'Data Visualization': 8, Cloud: 7 },
};

const MOCK_ROADMAP = [
  {
    id: 'r1', week: 'Week 1–2', title: 'Statistics Fundamentals', status: 'completed',
    resources: [
      { name: 'Khan Academy Statistics', url: 'https://khanacademy.org', type: 'Course' },
      { name: 'Think Stats (Book)', url: '#', type: 'Book' },
    ],
  },
  {
    id: 'r2', week: 'Week 3–5', title: 'Advanced Python for Data Science', status: 'in-progress',
    resources: [
      { name: 'Python for Data Analysis', url: 'https://wesmckinney.com/book', type: 'Book' },
      { name: 'Kaggle Python Course', url: 'https://kaggle.com/learn', type: 'Course' },
    ],
  },
  {
    id: 'r3', week: 'Week 6–8', title: 'Machine Learning with Scikit-Learn', status: 'upcoming',
    resources: [
      { name: 'Hands-On ML (Aurélien Géron)', url: '#', type: 'Book' },
      { name: 'Coursera ML Specialization', url: 'https://coursera.org', type: 'Course' },
    ],
  },
  {
    id: 'r4', week: 'Week 9–11', title: 'Data Visualization Mastery', status: 'upcoming',
    resources: [
      { name: 'Matplotlib & Seaborn Docs', url: 'https://matplotlib.org', type: 'Docs' },
      { name: 'Tableau Public', url: 'https://public.tableau.com', type: 'Tool' },
    ],
  },
  {
    id: 'r5', week: 'Week 12+', title: 'Capstone Project + Cloud Deployment', status: 'upcoming',
    resources: [
      { name: 'AWS SageMaker', url: 'https://aws.amazon.com/sagemaker', type: 'Tool' },
      { name: 'Kaggle Competitions', url: 'https://kaggle.com/competitions', type: 'Platform' },
    ],
  },
];

const MOCK_PROGRESS = {
  overallProgress: 62,
  streak: 14,
  coursesCompleted: 4,
  assessmentsCompleted: 3,
  weeklyActivity: [
    { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3 }, { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },  { day: 'Fri', hours: 2 }, { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 1 },
  ],
  goals: [
    { id: 'g1', title: 'Complete ML Specialization', progress: 65, dueDate: '2026-08-01' },
    { id: 'g2', title: 'Build 3 Portfolio Projects', progress: 33, dueDate: '2026-09-01' },
    { id: 'g3', title: 'Land Data Scientist Internship', progress: 20, dueDate: '2026-10-01' },
  ],
};

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'recommendation', title: 'New Career Match Found!', message: 'AI Engineer matches 80% of your profile.', time: '5m ago', read: false },
  { id: 'n2', type: 'reminder', title: 'Complete Your Skill Assessment', message: 'You have not completed the advanced Python quiz.', time: '2h ago', read: false },
  { id: 'n3', type: 'update', title: 'Roadmap Updated', message: 'Your Data Science roadmap has been updated with new resources.', time: '1d ago', read: true },
  { id: 'n4', type: 'reminder', title: 'Weekly Goal Check-in', message: 'You\'re 65% through your ML course goal. Keep going!', time: '2d ago', read: true },
  { id: 'n5', type: 'recommendation', title: 'Trending: Cloud Computing', message: 'Cloud skills are in high demand. Consider adding AWS to your roadmap.', time: '3d ago', read: true },
];

const MOCK_ADMIN_STATS = {
  totalUsers: 2847,
  activeUsers: 1203,
  assessmentsToday: 148,
  avgMatchScore: 74,
  monthlySignups: [
    { month: 'Jan', users: 180 }, { month: 'Feb', users: 220 }, { month: 'Mar', users: 290 },
    { month: 'Apr', users: 340 }, { month: 'May', users: 410 }, { month: 'Jun', users: 480 },
    { month: 'Jul', users: 390 }, { month: 'Aug', users: 520 }, { month: 'Sep', users: 610 },
    { month: 'Oct', users: 540 }, { month: 'Nov', users: 680 }, { month: 'Dec', users: 720 },
  ],
  recentUsers: [
    { id: 'u1', name: 'Priya Sharma', email: 'priya@ex.com', role: 'student', joined: '2026-05-28', status: 'active' },
    { id: 'u2', name: 'Rahul Gupta', email: 'rahul@ex.com', role: 'job_seeker', joined: '2026-05-27', status: 'active' },
    { id: 'u3', name: 'Sneha Patel', email: 'sneha@ex.com', role: 'student', joined: '2026-05-26', status: 'inactive' },
    { id: 'u4', name: 'Vikram Singh', email: 'vikram@ex.com', role: 'job_seeker', joined: '2026-05-25', status: 'active' },
    { id: 'u5', name: 'Ananya Roy', email: 'ananya@ex.com', role: 'student', joined: '2026-05-24', status: 'active' },
  ],
};

// ─── Mock interceptor ─────────────────────────────────────────────────────────
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('np_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config._mock = true;
  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config?._mock) return Promise.reject(error);

  await delay(500);
  const url = config.url || '';
  const method = config.method?.toLowerCase();

  // Auth
  if (url.includes('/auth/login') && method === 'post') {
  const { email, password } = JSON.parse(
    config.data || '{}'
  );

  if (email && password) {
    const isAdmin = email.includes('admin');

    const loggedUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'student',
      avatar: null,
      education: [],
      skills: [],
      interests: [],
      careerGoals: '',
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      'np_user',
      JSON.stringify(loggedUser)
    );

    return {
      data: {
        token: 'mock_jwt_token_xyz',
        user: loggedUser,
      },
    };
  }

  return Promise.reject({
    response: {
      data: {
        message: 'Invalid credentials',
      },
    },
  });
}
  if (url.includes('/auth/register') && method === 'post') {
    return { data: { token: 'mock_jwt_token_xyz', user: { ...MOCK_USER, ...JSON.parse(config.data || '{}') } } };
  }
  // User
  if (url.includes('/user/profile')) {
  const storedUser = JSON.parse(
    localStorage.getItem('np_user') || '{}'
  );

  return {
    data: {
      id: storedUser.id || Date.now().toString(),
      name: storedUser.name || '',
      email: storedUser.email || '',
      role: storedUser.role || 'student',
      avatar: storedUser.avatar || null,

      education: storedUser.education || [],
      skills: storedUser.skills || [],
      interests: storedUser.interests || [],
      careerGoals: storedUser.careerGoals || '',
      joinedAt: storedUser.joinedAt || new Date().toISOString(),
    },
  };
}
  if (url.includes('/user/update') && method === 'put') {
  const updates = JSON.parse(config.data || '{}');

  const currentUser = JSON.parse(
    localStorage.getItem('np_user') || '{}'
  );

  const updatedUser = {
    ...currentUser,
    ...updates,
  };

  localStorage.setItem(
    'np_user',
    JSON.stringify(updatedUser)
  );

  return {
    data: updatedUser,
  };
}
  // Careers
  if (url.includes('/careers/recommendations')) return { data: MOCK_CAREERS };
  if (url.includes('/careers/skill-gap')) return { data: MOCK_SKILL_GAP };
  // Roadmap
  if (url.includes('/roadmap')) return { data: MOCK_ROADMAP };
  // Progress
  if (url.includes('/progress')) return { data: MOCK_PROGRESS };
  // Notifications
  if (url.includes('/notifications')) return { data: MOCK_NOTIFICATIONS };
  // Admin
  if (url.includes('/admin/stats')) return { data: MOCK_ADMIN_STATS };
  // Assessment submit
  if (url.includes('/assessment/submit')) return { data: { message: 'Assessment submitted successfully!', redirect: '/careers' } };
  // Interests submit
  if (url.includes('/interests/submit')) return { data: { message: 'Interests saved!', redirect: '/careers' } };

  return { data: { message: 'OK' } };
});

export default api;
