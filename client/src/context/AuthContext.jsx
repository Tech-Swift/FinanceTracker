/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../lib/utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      axios.get('/users/profile')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post('/users/login', { email, password });
      const { token } = res.data;

      localStorage.setItem('token', token);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const profileRes = await axios.get('/users/profile');
      setUser(profileRes.data);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const signup = async ({ name, email, password, confirmPassword }) => {
    try {
      await axios.post('/users/signup', { name, email, password, confirmPassword });
      return true;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post('users/forgot-password', { email });
      return true;
    } catch (err) {
      console.error("Forgot password Failed:", err);
      return false;
    }
  };

  const resetPassword = async (email) => {
    try{
      await axios.post('users/reset-password', { email });
      return true;
    } catch (err) {
      console.error("Reset password failed :" , err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, forgotPassword, resetPassword}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
