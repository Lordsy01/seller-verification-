import { Slot } from 'expo-router';
import { AuthProvider } from '../features/auth/AuthContext';
import { CartProvider } from '../features/orders/CartContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Slot />
      </CartProvider>
    </AuthProvider>
  );
}