import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.role}>{user?.role}</Text>

      {user?.role === 'seller' && user?.verificationStatus === 'approved' && (
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => router.push('/(seller)/post-product')}
        >
          <Text style={styles.postButtonText}>+ Post a Product</Text>
        </TouchableOpacity>
      )}

      {user?.role === 'seller' && user?.verificationStatus !== 'approved' && (
        <TouchableOpacity
          style={styles.postButton} 
          onPress={() => router.push('/(seller)/verify-upload')}
        >
          <Text style={styles.postButtonText}>Check Verification Status</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#F7F8FC' },
  name: { fontSize: 22, fontWeight: '700' },
  email: { fontSize: 14, color: '#5B5F6B', marginTop: 4 },
  role: { fontSize: 13, color: '#145C3F', marginTop: 4, textTransform: 'capitalize' },
  postButton: { backgroundColor: '#F0C419', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 30 },
  postButtonText: { color: '#14171F', fontWeight: '700' },
  button: { backgroundColor: '#BA1A1A', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 14 },
  buttonText: { color: '#fff', fontWeight: '600' },
});