// Replace 192.168.X.X with your PC's actual IPv4 address!
export const API_BASE_URL = 'http://192.168.137.1/material_supplier/backend/public/index.php/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
