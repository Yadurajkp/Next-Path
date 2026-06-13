
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedToken = localStorage.getItem('np_token');
      const storedUser = localStorage.getItem('np_user');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      // Safely restore user from localStorage
      if (
        storedUser &&
        storedUser !== 'undefined' &&
        storedUser !== 'null'
      ) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Invalid stored user:', err);
          localStorage.removeItem('np_user');
        }
      }

      // Refresh latest profile from backend
      try {
        const response = await api.get(ENDPOINTS.PROFILE);

        if (response.data) {
          setUser(response.data);

          localStorage.setItem(
            'np_user',
            JSON.stringify(response.data)
          );
        }
      } catch (error) {
        console.error('Profile refresh failed:', error);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);

      localStorage.removeItem('np_token');
      localStorage.removeItem('np_user');

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post(
      ENDPOINTS.LOGIN,
      {
        email,
        password,
      }
    );

    const authToken = response.data.token;
    const loggedInUser = response.data.user;

    localStorage.setItem('np_token', authToken);

    localStorage.setItem(
      'np_user',
      JSON.stringify(loggedInUser ?? null)
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (payload) => {
    const response = await api.post(
      ENDPOINTS.REGISTER,
      payload
    );

    const authToken = response.data.token;
    const registeredUser = response.data.user;

    localStorage.setItem('np_token', authToken);

    localStorage.setItem(
      'np_user',
      JSON.stringify(registeredUser ?? null)
    );

    setUser(registeredUser);

    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('np_token');
    localStorage.removeItem('np_user');

    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((currentUser) => {
      const updatedUser = {
        ...(currentUser || {}),
        ...updates,
      };

      localStorage.setItem(
        'np_user',
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  const refreshUser = async () => {
    try {
      const response = await api.get(
        ENDPOINTS.PROFILE
      );

      if (response.data) {
        setUser(response.data);

        localStorage.setItem(
          'np_user',
          JSON.stringify(response.data)
        );

        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Refresh user failed:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};

