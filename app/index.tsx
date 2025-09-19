import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to loginSign screen
  return <Redirect href="/loginSign" />;
}