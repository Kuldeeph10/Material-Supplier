import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../services/api';

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const data = await apiCall('/auth/me');
        setUser(data.user);
      } catch (e: any) {
        await AsyncStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    try {
      setLoginError('');
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (e: any) {
      setLoginError(e.message);
    }
  };

  if (loading) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" /></View>;
  }

  if (!user) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Manager Login</Text>
        {loginError ? <Text style={styles.error}>{loginError}</Text> : null}
        
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.note}>Note: Make sure to update the IP address in src/services/api.js first!</Text>
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4f46e5' }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: () => <Text>📊</Text> }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: () => <Text>📦</Text> }} />
      <Tabs.Screen name="create" options={{ title: 'Create', tabBarIcon: () => <Text>➕</Text> }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0f172a' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#ef4444', marginBottom: 15, textAlign: 'center' },
  note: { marginTop: 20, color: '#64748b', textAlign: 'center', fontSize: 12 }
});
