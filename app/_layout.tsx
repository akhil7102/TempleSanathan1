import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FF9933" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="temple/[id]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="map" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="submit" />
        <Stack.Screen name="about" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="category/[type]" />
        <Stack.Screen name="admin" />
      </Stack>
    </SafeAreaProvider>
  );
}