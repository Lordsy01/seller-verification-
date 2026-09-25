import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/orders/CartContext';

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const isActive = (key: string) => pathname.includes(key);

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/home')}>
          <Ionicons
            name={isActive('home') ? 'home' : 'home-outline'}
            size={22}
            color={isActive('home') ? '#fff' : '#D9E6DF'}
          />
          <Text style={[styles.label, isActive('home') && styles.labelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/saved')}>
          <Ionicons
            name={isActive('saved') ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isActive('saved') ? '#fff' : '#D9E6DF'}
          />
          <Text style={[styles.label, isActive('saved') && styles.labelActive]}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerButton} onPress={() => router.push('/(tabs)/chat')}>
          <Ionicons name="chatbubble" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/cart')}>
          <View>
            <Ionicons
              name={isActive('cart') ? 'cart' : 'cart-outline'}
              size={20}
              color={isActive('cart') ? '#fff' : '#D9E6DF'}
            />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.label, isActive('cart') && styles.labelActive]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#D9E6DF" />
          <Text style={styles.label}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#145C3F',
    width: '94%',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingTop: 2,
  },
  label: {
    fontSize: 10,
    color: '#D9E6DF',
    fontWeight: '600',
  },
  labelActive: {
    color: '#fff',
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0C419',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -26,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#BA1A1A',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});