import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import api from '../../shared/api/api';
import { useAuth } from './AuthContext';

type Role = 'buyer' | 'seller';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(params.role === 'seller' ? 'seller' : 'buyer');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup', { name, email, password, role });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { email, otp });
      await login(res.data.user, res.data.token);
      router.replace(
        res.data.user.role === 'seller' ? '/(seller)/verify-upload' : '/(tabs)/home'
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>DoualaMarket</Text>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>

        <TextInput
          style={[styles.input, styles.otpInput]}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          autoFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Continue</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>DoualaMarket</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join as a buyer or vendor</Text>

        <View style={styles.roleToggle}>
          {(['buyer', 'seller'] as Role[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleBtn, role === r && styles.roleBtnActive]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                {r === 'seller' ? 'Vendor' : 'Buyer'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input} placeholder="Email" autoCapitalize="none"
          keyboardType="email-address" value={email} onChangeText={setEmail}
        />
        <TextInput
          style={styles.input} placeholder="Password" secureTextEntry
          value={password} onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7F8FC' },
  logo: { fontSize: 20, fontWeight: '800', color: '#145C3F', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#5B5F6B', marginTop: 4, marginBottom: 20 },
  roleToggle: { flexDirection: 'row', backgroundColor: '#EDEEF5', borderRadius: 8, padding: 4, marginBottom: 20 },
  roleBtn: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#145C3F' },
  roleBtnText: { fontWeight: '600', color: '#5B5F6B' },
  roleBtnTextActive: { color: '#fff' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3E5F0', borderRadius: 8, padding: 14, marginBottom: 14, fontSize: 15 },
  otpInput: { textAlign: 'center', fontSize: 22, letterSpacing: 8 },
  button: { backgroundColor: '#145C3F', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  error: { color: '#BA1A1A', marginBottom: 10 },
});