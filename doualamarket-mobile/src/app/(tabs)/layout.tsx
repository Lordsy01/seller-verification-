import { Tabs } from 'expo-router';
import CustomTabBar from '../../shared/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <CustomTabBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}