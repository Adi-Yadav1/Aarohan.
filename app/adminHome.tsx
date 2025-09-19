import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Type definitions
interface DashboardMetrics {
  totalAthletes: number;
  submissionsReceived: number;
  pendingVerifications: number;
  activeTests: number;
  completedTests: number;
  averageScore: number;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'submission' | 'verification';
  athlete: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'rejected';
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const { width } = Dimensions.get('window');

// Simulated JSON data (replace with your JSON file or endpoint as needed)
const metricsJson: DashboardMetrics = {
  totalAthletes: 1247,
  submissionsReceived: 856,
  pendingVerifications: 23,
  activeTests: 145,
  completedTests: 711,
  averageScore: 78.5,
};

const recentActivityJson: RecentActivity[] = [
  {
    id: '1',
    type: 'registration',
    athlete: 'Sarah Johnson',
    timestamp: '2 minutes ago',
    status: 'completed',
  },
  {
    id: '2',
    type: 'submission',
    athlete: 'Mike Chen',
    timestamp: '5 minutes ago',
    status: 'pending',
  },
  {
    id: '3',
    type: 'verification',
    athlete: 'Emily Davis',
    timestamp: '12 minutes ago',
    status: 'completed',
  },
  {
    id: '4',
    type: 'submission',
    athlete: 'Alex Rodriguez',
    timestamp: '18 minutes ago',
    status: 'pending',
  },
];

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAthletes: 0,
    submissionsReceived: 0,
    pendingVerifications: 0,
    activeTests: 0,
    completedTests: 0,
    averageScore: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data from JSON (simulate API)
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate fetching from JSON
    setMetrics(metricsJson);
    setRecentActivity(recentActivityJson);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Review Submissions',
      subtitle: `${metrics.pendingVerifications} pending`,
      icon: '📋',
      color: '#F59E0B',
      onPress: () => console.log('Review submissions'),
    },
    {
      id: '2',
      title: 'Manage Athletes',
      subtitle: `${metrics.totalAthletes} registered`,
      icon: '👥',
      color: '#3B82F6',
      onPress: () => console.log('Manage athletes'),
    },
    {
      id: '3',
      title: 'Test Results',
      subtitle: `${metrics.completedTests} completed`,
      icon: '📊',
      color: '#10B981',
      onPress: () => console.log('View test results'),
    },
    {
      id: '4',
      title: 'Generate Reports',
      subtitle: 'Export data',
      icon: '📈',
      color: '#8B5CF6',
      onPress: () => console.log('Generate reports'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return '👤';
      case 'submission':
        return '📝';
      case 'verification':
        return '✅';
      default:
        return '📋';
    }
  };

  const renderMetricCard = (title: string, value: number | string, subtitle: string, color: string, trend?: string) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        {trend && (
          <View style={[styles.trendIndicator, { backgroundColor: color + '15' }]}>
            <Text style={[styles.trendText, { color }]}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Fitness Assessment Management</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Key Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Total Athletes',
              metrics.totalAthletes.toLocaleString(),
              'Registered users',
              '#3B82F6',
              '+12%'
            )}
            {renderMetricCard(
              'Submissions Received',
              metrics.submissionsReceived.toLocaleString(),
              'Test submissions',
              '#10B981',
              '+8%'
            )}
            {renderMetricCard(
              'Pending Verifications',
              metrics.pendingVerifications,
              'Awaiting review',
              '#F59E0B',
              '-15%'
            )}
          </View>
        </View>

        {/* Additional Metrics */}
        <View style={styles.section}>
          <View style={styles.additionalMetrics}>
            {renderMetricCard(
              'Active Tests',
              metrics.activeTests,
              'In progress',
              '#8B5CF6'
            )}
            {renderMetricCard(
              'Completed Tests',
              metrics.completedTests,
              'Finished assessments',
              '#06B6D4'
            )}
            {renderMetricCard(
              'Average Score',
              `${metrics.averageScore}%`,
              'Overall performance',
              '#EF4444'
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  <Text style={styles.quickActionIconText}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>
                    {getActivityIcon(activity.type)}
                  </Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    <Text style={styles.athleteName}>{activity.athlete}</Text>
                    {activity.type === 'registration' && ' registered as new athlete'}
                    {activity.type === 'submission' && ' submitted test results'}
                    {activity.type === 'verification' && ' completed verification'}
                  </Text>
                  <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(activity.status) },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.systemStatus}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>All systems operational</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>Database connection: Normal</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.statusText}>Backup service: Scheduled maintenance</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  metricsGrid: {
    gap: 16,
  },
  additionalMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
    flex: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  trendIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: (width - 56) / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 20,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  athleteName: {
    fontWeight: '600',
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  systemStatus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
  },
});

export default AdminDashboard;
