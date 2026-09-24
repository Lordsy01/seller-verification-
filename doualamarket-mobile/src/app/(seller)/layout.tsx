import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="verify-upload" options={{ title: 'Verification' }} />
      <Stack.Screen name="post-product" options={{ title: 'Post Product' }} />
    </Stack>
  );
}