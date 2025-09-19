import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to tabs by default (home with pose detection)
  return <Redirect href="/(tabs)" />;
}