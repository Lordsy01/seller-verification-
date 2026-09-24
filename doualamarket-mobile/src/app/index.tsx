import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../features/auth/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#145C3F" />
      </View>
    );
  }

  return user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />;
}