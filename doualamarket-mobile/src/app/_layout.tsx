import { Slot } from 'expo-router';
import { AuthProvider } from '../features/auth/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}