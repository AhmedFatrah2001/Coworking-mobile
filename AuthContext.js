import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from './config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userInfo = await AsyncStorage.getItem('user');
        setUser(JSON.parse(userInfo));
      }
    };
    loadUser();
  }, []);

  const login = async (username, password) => {
    const requestBody = { username, password };
    console.log('Login Request Body:', requestBody);

    const response = await axios.post(`${config.apiUrl}/api/auth/login`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token, username: userName, email, role, userId } = response.data;
    const user = { username: userName, email, role, userId };
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const register = async (username, email, password) => {
    const requestBody = { username, email, password, role: 'USER' };
    console.log('Register Request Body:', requestBody);

    const response = await axios.post(`${config.apiUrl}/api/auth/register`, requestBody);
    if (response.status === 200) {
      alert('User registered successfully!');
    }
  };

  const logout = async (navigation) => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    axios.defaults.headers.common['Authorization'] = '';
    setUser(null);
    navigation.navigate('Login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
