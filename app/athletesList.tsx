import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const TOKEN_KEY = "token";

// Type definitions
interface AthleteProfile {
  firstName: string;
  lastName: string;
  gender: string;
  state: string;
  district: string;
  sport: string;
  category: string;
  dateOfBirth?: string;
}

interface Athlete {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: AthleteProfile;
}

interface ApiResponse {
  success: boolean;
  data: {
    users: Athlete[];
    totalCount: number;
    page: number;
    totalPages: number;
  };
  message: string;
}

// Dummy data for testing
const dummyAthletes: Athlete[] = [
  {
    _id: '1',
    email: 'rajesh.kumar@gmail.com',
    role: 'athlete',
    isVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    profile: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      gender: 'MALE',
      state: 'Maharashtra',
      district: 'Mumbai',
      sport: 'Cricket',
      category: 'Senior',
      dateOfBirth: '1995-05-20'
    }
  },
  {
    _id: '2',
    email: 'priya.sharma@gmail.com',
    role: 'athlete',
    isVerified: false,
    createdAt: '2024-01-20T14:45:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    profile: {
      firstName: 'Priya',
      lastName: 'Sharma',
      gender: 'FEMALE',
      state: 'Delhi',
      district: 'New Delhi',
      sport: 'Badminton',
      category: 'Junior',
      dateOfBirth: '2000-08-12'
    }
  },
  {
    _id: '3',
    email: 'arjun.singh@gmail.com',
    role: 'athlete',
    isVerified: true,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
    profile: {
      firstName: 'Arjun',
      lastName: 'Singh',
      gender: 'MALE',
      state: 'Punjab',
      district: 'Ludhiana',
      sport: 'Hockey',
      category: 'Senior',
      dateOfBirth: '1998-03-15'
    }
  },
  {
    _id: '4',
    email: 'sneha.patel@gmail.com',
    role: 'athlete',
    isVerified: true,
    createdAt: '2024-02-10T16:20:00Z',
    updatedAt: '2024-02-10T16:20:00Z',
    profile: {
      firstName: 'Sneha',
      lastName: 'Patel',
      gender: 'FEMALE',
      state: 'Gujarat',
      district: 'Ahmedabad',
      sport: 'Swimming',
      category: 'Senior',
      dateOfBirth: '1997-11-30'
    }
  },
  {
    _id: '5',
    email: 'vikash.yadav@gmail.com',
    role: 'athlete',
    isVerified: false,
    createdAt: '2024-02-15T11:10:00Z',
    updatedAt: '2024-02-15T11:10:00Z',
    profile: {
      firstName: 'Vikash',
      lastName: 'Yadav',
      gender: 'MALE',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      sport: 'Football',
      category: 'Junior',
      dateOfBirth: '2001-07-08'
    }
  },
  {
    _id: '6',
    email: 'anita.reddy@gmail.com',
    role: 'athlete',
    isVerified: true,
    createdAt: '2024-02-18T13:30:00Z',
    updatedAt: '2024-02-18T13:30:00Z',
    profile: {
      firstName: 'Anita',
      lastName: 'Reddy',
      gender: 'FEMALE',
      state: 'Telangana',
      district: 'Hyderabad',
      sport: 'Tennis',
      category: 'Senior',
      dateOfBirth: '1996-12-05'
    }
  },
  {
    _id: '7',
    email: 'rohit.joshi@gmail.com',
    role: 'athlete',
    isVerified: false,
    createdAt: '2024-02-22T08:45:00Z',
    updatedAt: '2024-02-22T08:45:00Z',
    profile: {
      firstName: 'Rohit',
      lastName: 'Joshi',
      gender: 'MALE',
      state: 'Karnataka',
      district: 'Bangalore',
      sport: 'Basketball',
      category: 'Junior',
      dateOfBirth: '2002-04-18'
    }
  },
  {
    _id: '8',
    email: 'kavya.nair@gmail.com',
    role: 'athlete',
    isVerified: true,
    createdAt: '2024-02-25T15:20:00Z',
    updatedAt: '2024-02-25T15:20:00Z',
    profile: {
      firstName: 'Kavya',
      lastName: 'Nair',
      gender: 'FEMALE',
      state: 'Kerala',
      district: 'Kochi',
      sport: 'Athletics',
      category: 'Senior',
      dateOfBirth: '1999-09-22'
    }
  },
  {
    _id: '9',
    email: 'amit.gupta@gmail.com',
    role: 'athlete',
    isVerified: false,
    createdAt: '2024-03-01T12:15:00Z',
    updatedAt: '2024-03-01T12:15:00Z',
    profile: {
      firstName: 'Amit',
      lastName: 'Gupta',
      gender: 'MALE',
      state: 'Rajasthan',
      district: 'Jaipur',
      sport: 'Wrestling',
      category: 'Senior',
      dateOfBirth: '1994-01-10'
    }
  },
  {
    _id: '10',
    email: 'pooja.mehta@gmail.com',
    role: 'athlete',
    isVerified: true,
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    profile: {
      firstName: 'Pooja',
      lastName: 'Mehta',
      gender: 'FEMALE',
      state: 'Haryana',
      district: 'Gurgaon',
      sport: 'Volleyball',
      category: 'Junior',
      dateOfBirth: '2000-06-14'
    }
  }
];

const AthletesList: React.FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadAthletes();
  }, []);

  useEffect(() => {
    filterAthletes();
  }, [athletes, searchQuery]);

  const loadAthletes = async () => {
    try {
      setError('');
      console.log('Loading dummy athletes data...');
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load dummy data
      setAthletes(dummyAthletes);
      console.log(`Loaded ${dummyAthletes.length} dummy athletes`);
      
    } catch (err: any) {
      console.error('Error loading athletes:', err);
      setError('Failed to load athletes data');
      Alert.alert("Error", "Failed to load athletes data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing athletes data...');
    // Simulate refresh with slight delay
    await new Promise(resolve => setTimeout(resolve, 500));
    await loadAthletes();
    setRefreshing(false);
  };

  const filterAthletes = () => {
    if (!searchQuery.trim()) {
      setFilteredAthletes(athletes);
      return;
    }

    const filtered = athletes.filter(athlete => {
      const fullName = `${athlete.profile?.firstName || ''} ${athlete.profile?.lastName || ''}`.toLowerCase();
      const email = athlete.email.toLowerCase();
      const sport = athlete.profile?.sport?.toLowerCase() || '';
      const state = athlete.profile?.state?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      return fullName.includes(query) || 
             email.includes(query) || 
             sport.includes(query) || 
             state.includes(query);
    });

    setFilteredAthletes(filtered);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? '#10B981' : '#F59E0B';
  };

  const getStatusText = (isVerified: boolean) => {
    return isVerified ? 'Verified' : 'Pending';
  };

  const renderAthleteCard = ({ item }: { item: Athlete }) => (
    <TouchableOpacity style={styles.athleteCard} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.athleteInfo}>
          <Text style={styles.athleteName}>
            {`${item.profile?.firstName || 'N/A'} ${item.profile?.lastName || ''}`}
          </Text>
          <Text style={styles.athleteEmail}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.isVerified) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.isVerified) }]}>
            {getStatusText(item.isVerified)}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sport</Text>
            <Text style={styles.detailValue}>{item.profile?.sport || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{item.profile?.category || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>State</Text>
            <Text style={styles.detailValue}>{item.profile?.state || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{item.profile?.gender || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.joinedDate}>
            Joined: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>👥</Text>
      <Text style={styles.emptyStateTitle}>No Athletes Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search criteria' : 'No athletes have registered yet'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Athletes List</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading athletes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Athletes List</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search athletes by name, email, sport, or state..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredAthletes.length}</Text>
          <Text style={styles.statLabel}>
            {searchQuery ? 'Matching' : 'Total'} Athletes
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredAthletes.filter(a => a.isVerified).length}
          </Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredAthletes.filter(a => !a.isVerified).length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Athletes List */}
      <FlatList
        data={filteredAthletes}
        renderItem={renderAthleteCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    paddingTop: 16,
  },
  athleteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  athleteInfo: {
    flex: 1,
  },
  athleteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  athleteEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 4,
  },
  joinedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default AthletesList;