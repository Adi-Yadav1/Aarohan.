import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get('window');

// Type definitions for dashboard data
interface UserStats {
  totalTests: number;
  currentRank: number;
  totalBadges: number;
  lastTestDate: string;
  improvementPercentage: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface RecentActivity {
  id: string;
  type: 'test_completed' | 'badge_earned' | 'rank_improved';
  title: string;
  subtitle: string;
  emoji: string;
  timestamp: string;
}

interface DashboardData {
  user: UserProfile;
  stats: UserStats;
  recentActivities: RecentActivity[];
}

const mockData: DashboardData = {
  user: {
    id: "fallback_user",
    name: "Aditya Yadav",
    email: "demo@example.com"
  },
  stats: {
    totalTests: 5,
    currentRank: 10,
    totalBadges: 3,
    lastTestDate: "1 week ago",
    improvementPercentage: 8
  },
  recentActivities: [
    {
      id: "fallback_1",
      type: "test_completed",
      title: "Demo: Test completed successfully!",
      subtitle: "This is fallback demo data",
      emoji: "🎯",
      timestamp: "2024-01-15T10:30:00Z"
    }
  ]
};

const HomeScreen: React.FC = () => {
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Time update effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      setCurrentTime(time);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load mock data on mount
  useEffect(() => {
    setDashboardData(mockData);
    setLoading(false);
  }, []);

  // Refresh handler (just reloads mock data)
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDashboardData(mockData);
      setRefreshing(false);
    }, 500);
  };

  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatLastTestDate = (dateString: string) => {
    if (dateString.includes('ago')) return dateString;
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Navigation handlers
  const handleStartTest = async () => {
    router.push('/types');
  };

  const handleViewHistory = () => {
    router.push('/performance');
  };

  const handleLeaderboards = () => {
    router.push('/leaderboards');
  };

  const handleProfile = () => {
    console.log('Navigating to ProfileSettings...');
    router.push('/ProfileSettings');
  };

  const handleBadges = () => {
    router.push('/badges');
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{dashboardData?.user.name || "User"}</Text>
            <Text style={styles.currentTime}>{currentTime}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{dashboardData?.stats.totalTests || 0}</Text>
            <Text style={styles.statsLabel}>Tests Completed</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>#{dashboardData?.stats.currentRank || 0}</Text>
            <Text style={styles.statsLabel}>Current Rank</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{dashboardData?.stats.totalBadges || 0}</Text>
            <Text style={styles.statsLabel}>Badges Earned</Text>
          </View>
        </View>

        {/* Quick Action - Start Test */}
        <View style={styles.quickActionContainer}>
          <TouchableOpacity style={styles.startTestButton} onPress={handleStartTest}>
            <View style={styles.startTestIcon}>
              <Text style={styles.startTestEmoji}>🏃‍♂️</Text>
            </View>
            <View style={styles.startTestContent}>
              <Text style={styles.startTestTitle}>Start Fitness Test</Text>
              <Text style={styles.startTestSubtitle}>Ready to challenge yourself?</Text>
            </View>
            <Text style={styles.startTestArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Main Navigation Cards */}
        <View style={styles.navigationContainer}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          
          <View style={styles.cardGrid}>
            {/* Performance History Card */}
            <TouchableOpacity style={styles.navCard} onPress={handleViewHistory}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>📊</Text>
              </View>
              <Text style={styles.cardTitle}>Performance History</Text>
              <Text style={styles.cardSubtitle}>Track your progress</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>
                  Last: {formatLastTestDate(dashboardData?.stats.lastTestDate || "Never")}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Leaderboards Card */}
            <TouchableOpacity style={styles.navCard} onPress={handleLeaderboards}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🏆</Text>
              </View>
              <Text style={styles.cardTitle}>Leaderboards</Text>
              <Text style={styles.cardSubtitle}>See top performers</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Rank #{dashboardData?.stats.currentRank || 0}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardGrid}>
            {/* Badges Card */}
            <TouchableOpacity style={styles.navCard} onPress={handleBadges}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🎖️</Text>
              </View>
              <Text style={styles.cardTitle}>Badges</Text>
              <Text style={styles.cardSubtitle}>Your achievements</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{dashboardData?.stats.totalBadges || 0} earned</Text>
              </View>
            </TouchableOpacity>

            {/* Profile Card */}
            <TouchableOpacity style={styles.navCard} onPress={handleProfile}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>⚙️</Text>
              </View>
              <Text style={styles.cardTitle}>Profile</Text>
              <Text style={styles.cardSubtitle}>Settings & info</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>Manage</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 && (
          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {dashboardData.recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <Text style={styles.activityEmoji}>{activity.emoji}</Text>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 24,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  errorBannerText: {
    fontSize: 14,
    color: "#92400e",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
  },
  currentTime: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "400",
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  profileIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
  },
  statsLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  quickActionContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  startTestButton: {
    backgroundColor: "#059669",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startTestIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  startTestEmoji: {
    fontSize: 24,
  },
  startTestContent: {
    flex: 1,
    marginLeft: 16,
  },
  startTestTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  startTestSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  startTestArrow: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
  navigationContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  navCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 140,
    justifyContent: "space-between",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 12,
  },
  cardBadge: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  cardBadgeText: {
    fontSize: 10,
    color: "#0369a1",
    fontWeight: "600",
  },
  recentActivity: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  activityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  activityEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  activitySubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
});