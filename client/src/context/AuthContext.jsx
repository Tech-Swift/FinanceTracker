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
      axios
        .get('/users/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
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

      const profileRes = await axios.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileRes.data);
      return true;
    } catch (err) {
      return false;
    }
  };

  const signup = async ({ name, email, password, confirmPassword }) => {
    try {
      await axios.post('/users/signup', { name, email, password, confirmPassword });
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
