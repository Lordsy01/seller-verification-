import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../shared/api/api';
import { useAuth } from './AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      await login(res.data.user, res.data.token);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      // console.log('LOGIN ERROR:', JSON.stringify(err, null, 2));
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DoualaMarket</Text>
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <Link href="/(auth)/signup" style={styles.link}>
        Don't have an account? Sign Up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7F8FC' },
  logo: { fontSize: 20, fontWeight: '800', color: '#145C3F', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 24 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3E5F0', borderRadius: 8, padding: 14, marginBottom: 14, fontSize: 15 },
  button: { backgroundColor: '#145C3F', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  error: { color: '#BA1A1A', marginBottom: 10 },
  link: { color: '#145C3F', marginTop: 20, textAlign: 'center', fontWeight: '600' },
});