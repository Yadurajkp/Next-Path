import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      role: body.email.startsWith("admin@") ? "admin" : "student",
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
      config,
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

  if (url.includes("/auth/register") && method === "post") {
    const body =
      typeof config.data === "string"
        ? JSON.parse(config.data)
        : config.data;

    localStorage.setItem("np_user", JSON.stringify(body));
    localStorage.setItem("np_token", "mock_token");

    return Promise.reject({
      config,
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
    const user = JSON.parse(localStorage.getItem("np_user") || "{}");

    return Promise.reject({
      config,
      __MOCK__: true,
      response: {
        status: 200,
        data: user,
      },
    });
  }

  // UPDATE PROFILE

  if (url.includes("/user/update") && method === "put") {
    const updates =
      typeof config.data === "string"
        ? JSON.parse(config.data)
        : config.data;

    const user = JSON.parse(localStorage.getItem("np_user") || "{}");

    const updated = {
      ...user,
      ...updates,
    };

    localStorage.setItem("np_user", JSON.stringify(updated));

    return Promise.reject({
      config,
      __MOCK__: true,
      response: {
        status: 200,
        data: updated,
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
