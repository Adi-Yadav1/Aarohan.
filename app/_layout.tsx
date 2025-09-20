import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import CurvedNavbar from '../components/CurverdNavbar';
import { AthleteProvider } from '../contexts/AthleteContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import SplashScreen from './splashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();


  
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 3 seconds to let animations complete
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);
   const segments = useSegments();

  // Show navbar on specific pages
  const currentRoute = segments[0];
  const routesWithNavbar = ['Home', 'home', 'test', 'sports', 'performance', 'socialmedia', 'ProfileSettings'];
  const showNavbar = routesWithNavbar.includes(currentRoute as string);

  

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider>
      <AthleteProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View style={styles.container}>
            <Stack initialRouteName="loginSign">
            <Stack.Screen name="loginSign" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="Home" options={{ headerShown: false }} />
            <Stack.Screen name="test" options={{ headerShown: false }} />
            <Stack.Screen name="socialmedia" options={{ headerShown: false }} />
            <Stack.Screen name="adminHome" options={{ headerShown: false }} />
            <Stack.Screen name="athletesList" options={{ headerShown: false }} />
            <Stack.Screen name="submissionsReceived" options={{ headerShown: false }} />
            <Stack.Screen name="pendingVerification" options={{ headerShown: false }} />
            <Stack.Screen name="reviewSubmissions" options={{ headerShown: false }} />
            <Stack.Screen name="manageAthletes" options={{ headerShown: false }} />
            <Stack.Screen name="testResults" options={{ headerShown: false }} />
            <Stack.Screen name="generateReports" options={{ headerShown: false }} />
            <Stack.Screen name="createpost" options={{ headerShown: false }} />
            <Stack.Screen name="forgotPass" options={{ headerShown: false }} />
            <Stack.Screen name="kheloIndia" options={{ headerShown: false }} />
            <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
            <Stack.Screen name="performance" options={{ headerShown: false }} />
            <Stack.Screen name="badges" options={{ headerShown: false }} />
            <Stack.Screen name="sports" options={{ headerShown: false }} />
            <Stack.Screen name="leaderboards" options={{ headerShown: false }} />
            <Stack.Screen name="ProfileSettings" options={{ headerShown: false }} />
            <Stack.Screen name="chatbot" options={{ headerShown: false }} />
            <Stack.Screen name="academylocater" options={{ headerShown: false }} />
            <Stack.Screen name="camera" options={{ headerShown: false }} />
            <Stack.Screen name="training" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="types" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            </Stack>
            {showNavbar && <CurvedNavbar />}
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AthleteProvider>
    </LanguageProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
