import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (userData) => {
    const res = await axios.post('/api/users/register', userData);
    localStorage.setItem('token', res.data.token);
    loadUser();
  };

  const login = async (userData) => {
    const res = await axios.post('/api/users/login', userData);
    localStorage.setItem('token', res.data.token);
    loadUser();
  };

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const res = await axios.get(`/api/users/me`, {
        headers: {
          'x-auth-token': token
        }
      });
      setUser(res.data);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };