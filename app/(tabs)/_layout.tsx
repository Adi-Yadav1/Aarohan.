import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      {/* You would add more tabs here if needed */}
    </Tabs>
  );
}
