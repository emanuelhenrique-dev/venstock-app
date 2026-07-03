import { SplashScreen, Stack } from 'expo-router';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts
} from '@expo-google-fonts/poppins';
import { colors } from '@/theme';
import { useEffect } from 'react';
import { Loading } from '@/components/Loading';
import { SQLiteProvider } from 'expo-sqlite';
import { migrate } from '@/database/migrate';
import { AuthProvider } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return <Loading height={300} width={300} />;

  return (
    <AuthProvider>
      <SQLiteProvider databaseName="venstock.db" onInit={migrate}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.white }
          }}
        >
          <Stack.Screen name="logIn" options={{ animation: 'none' }} />
          <Stack.Screen name="(dashboard)" options={{ animation: 'none' }} />
          <Stack.Screen
            name="edit-profile"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="new-category"
            options={{
              presentation: 'modal', // Isso faz ela subir de baixo no iOS/Android moderno
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="new-product"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="statistics-view"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
        </Stack>
      </SQLiteProvider>
    </AuthProvider>
  );
}
