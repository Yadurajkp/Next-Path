import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CAREERS = [
  {
    id: "1",
    title: "Data Scientist",
    match: 92,
    domain: "Technology",
    icon: "🧪",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    match: 88,
    domain: "Technology",
    icon: "💻",
  },
  {
    id: "3",
    title: "AI Engineer",
    match: 84,
    domain: "Technology",
    icon: "🤖",
  },
];

const PROGRESS = {
  overallProgress: 62,
  streak: 14,
  coursesCompleted: 4,

  goals: [
    {
      id: "1",
      title: "Complete ML Course",
      progress: 65,
    },
    {
      id: "2",
      title: "Build Portfolio",
      progress: 40,
    },
    {
      id: "3",
      title: "Get Internship",
      progress: 25,
    },
  ],
};

api.interceptors.request.use(async (config) => {
  await delay(300);

  const url = config.url || "";
  const method = config.method?.toLowerCase();

  // LOGIN

  if (url.includes("/auth/login") && method === "post") {
    const body =
      typeof config.data === "string"
        ? JSON.parse(config.data)
        : config.data;

    const user = {
      id: Date.now().toString(),
      name: body.email.split("@")[0],
      email: body.email,
      role: body.email.startsWith("admin@")
        ? "admin"
        : "student",
      avatar: null,
      education: [],
      skills: [],
      interests: [],
      careerGoals: "",
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem("np_user", JSON.stringify(user));
    localStorage.setItem("np_token", "mock_token");

    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: {
          token: "mock_token",
          user,
        },
      },
    });
  }

  // REGISTER

  if (url.includes("/auth/register")) {
    const body =
      typeof config.data === "string"
        ? JSON.parse(config.data)
        : config.data;

    localStorage.setItem("np_user", JSON.stringify(body));
    localStorage.setItem("np_token", "mock_token");

    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: {
          token: "mock_token",
          user: body,
        },
      },
    });
  }

  // PROFILE

  if (url.includes("/user/profile")) {
    const user = JSON.parse(
      localStorage.getItem("np_user") || "{}"
    );

    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: user,
      },
    });
  }

  // UPDATE

  if (url.includes("/user/update")) {
    const updates =
      typeof config.data === "string"
        ? JSON.parse(config.data)
        : config.data;

    const user = JSON.parse(
      localStorage.getItem("np_user") || "{}"
    );

    const updated = {
      ...user,
      ...updates,
    };

    localStorage.setItem(
      "np_user",
      JSON.stringify(updated)
    );

    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: updated,
      },
    });
  }

  // CAREER RECOMMENDATIONS

  if (url.includes("/careers/recommendations")) {
    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: CAREERS,
      },
    });
  }

  // PROGRESS

  if (url.includes("/progress")) {
    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: PROGRESS,
      },
    });
  }

  // ROADMAP

  if (url.includes("/roadmap")) {
    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: [],
      },
    });
  }

  // SKILL GAP

  if (url.includes("/careers/skill-gap")) {
    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: {},
      },
    });
  }

  // NOTIFICATIONS

  if (url.includes("/notifications")) {
    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: [],
      },
    });
  }

  // ADMIN

  if (url.includes("/admin")) {
    return Promise.reject({
      __MOCK__: true,
      response: {
        status: 200,
        data: {},
      },
    });
  }

  const token = localStorage.getItem("np_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.__MOCK__) {
      return Promise.resolve(error.response);
    }

    return Promise.reject(error);
  }
);

export default api;
