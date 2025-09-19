import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CurvedNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', route: '/home', icon: '🏠' },
    { name: 'Sports', route: '/sports', icon: '⚽' },
    { name: 'chatbot', route: '/Chatbot', icon: '🤖' },
    { name: 'Social', route: '/socialmedia', icon: '👥' },
    { name: 'Profile', route: '/ProfileSetting', icon: '👤' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.navItem,
              pathname === item.route && styles.activeNavItem
            ]}
            onPress={() => handleNavigation(item.route)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[
              styles.navText,
              pathname === item.route && styles.activeNavText
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CurvedNavbar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});



