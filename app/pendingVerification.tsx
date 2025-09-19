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
import { Athlete, useAthleteContext } from '../contexts/AthleteContext';

const PendingVerification: React.FC = () => {
  const { athletes, setAthletes, verifyAthlete, rejectAthlete } = useAthleteContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);
  const pendingAthletes = athletes.filter(athlete => !athlete.isVerified);

  useEffect(() => {
    loadPendingAthletes();
  }, []);

  useEffect(() => {
    filterAthletes();
  }, [athletes, searchQuery]);

  const loadPendingAthletes = async () => {
    try {
      console.log('Loading pending verification athletes...');
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log(`Found ${pendingAthletes.length} athletes pending verification`);
      
    } catch (err: any) {
      console.error('Error loading pending athletes:', err);
      Alert.alert("Error", "Failed to load pending verification data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing pending verification data...');
    await new Promise(resolve => setTimeout(resolve, 500));
    await loadPendingAthletes();
    setRefreshing(false);
  };

  const filterAthletes = () => {
    let filtered = pendingAthletes;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(athlete => {
        const fullName = `${athlete.profile.firstName} ${athlete.profile.lastName}`.toLowerCase();
        const email = athlete.email.toLowerCase();
        const sport = athlete.profile.sport.toLowerCase();
        const state = athlete.profile.state.toLowerCase();
        const district = athlete.profile.district.toLowerCase();

        return fullName.includes(query) || 
               email.includes(query) || 
               sport.includes(query) || 
               state.includes(query) ||
               district.includes(query);
      });
    }

    setFilteredAthletes(filtered);
  };

  const handleVerify = (athleteId: string) => {
    const athlete = athletes.find(a => a._id === athleteId);
    if (!athlete) return;

    Alert.alert(
      "Verify Athlete",
      `Are you sure you want to verify ${athlete.profile.firstName} ${athlete.profile.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Verify", 
          onPress: () => {
            verifyAthlete(athleteId);
            Alert.alert(
              "Success", 
              `${athlete.profile.firstName} ${athlete.profile.lastName} has been verified successfully!`
            );
          }
        }
      ]
    );
  };

  const handleReject = (athleteId: string) => {
    const athlete = athletes.find(a => a._id === athleteId);
    if (!athlete) return;

    Alert.alert(
      "Reject Verification",
      `Select a reason for rejecting ${athlete.profile.firstName} ${athlete.profile.lastName}'s verification:`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Incomplete Profile", 
          onPress: () => {
            rejectAthlete(athleteId, 'Incomplete profile information provided');
            Alert.alert(
              "Rejected", 
              `${athlete.profile.firstName} ${athlete.profile.lastName}'s verification has been rejected due to incomplete profile.`
            );
          }
        },
        { 
          text: "Invalid Documents", 
          onPress: () => {
            rejectAthlete(athleteId, 'Invalid or missing documents submitted');
            Alert.alert(
              "Rejected", 
              `${athlete.profile.firstName} ${athlete.profile.lastName}'s verification has been rejected due to invalid documents.`
            );
          }
        },
        { 
          text: "Does not meet criteria", 
          onPress: () => {
            rejectAthlete(athleteId, 'Does not meet verification criteria');
            Alert.alert(
              "Rejected", 
              `${athlete.profile.firstName} ${athlete.profile.lastName}'s verification has been rejected - does not meet criteria.`
            );
          }
        }
      ]
    );
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

  const getRegistrationDays = (dateString: string) => {
    try {
      const registrationDate = new Date(dateString);
      const today = new Date();
      const diffTime = today.getTime() - registrationDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'junior': return '#3B82F6';
      case 'senior': return '#10B981';
      case 'youth': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'MALE' ? '👨' : '👩';
  };

  const renderAthleteCard = ({ item }: { item: Athlete }) => {
    const daysPending = getRegistrationDays(item.createdAt);
    
    return (
      <View style={styles.athleteCard}>
        <View style={styles.cardHeader}>
          <View style={styles.athleteInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.genderIcon}>{getGenderIcon(item.profile.gender)}</Text>
              <Text style={styles.athleteName}>
                {`${item.profile.firstName} ${item.profile.lastName}`}
              </Text>
            </View>
            <Text style={styles.athleteEmail}>{item.email}</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Pending</Text>
            <Text style={styles.pendingDays}>{daysPending}d</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.sportInfo}>
            <View style={styles.sportContainer}>
              <Text style={styles.sportLabel}>Sport</Text>
              <Text style={styles.sportValue}>{item.profile.sport}</Text>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.profile.category) + '15' }]}>
              <Text style={[styles.categoryText, { color: getCategoryColor(item.profile.category) }]}>
                {item.profile.category}
              </Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>State</Text>
              <Text style={styles.detailValue}>{item.profile.state}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>District</Text>
              <Text style={styles.detailValue}>{item.profile.district}</Text>
            </View>
          </View>

          <View style={styles.registrationInfo}>
            <Text style={styles.registrationLabel}>Registered on: </Text>
            <Text style={styles.registrationDate}>{formatDate(item.createdAt)}</Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.verifyButton]}
                onPress={() => handleVerify(item._id)}
              >
                <Text style={styles.verifyButtonText}>✓ Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleReject(item._id)}
              >
                <Text style={styles.rejectButtonText}>✗ Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>✅</Text>
      <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'No athletes match your search criteria' : 'No athletes are pending verification at this time'}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{pendingAthletes.length}</Text>
        <Text style={styles.statLabel}>Pending Verification</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{athletes.filter(a => a.isVerified).length}</Text>
        <Text style={styles.statLabel}>Verified Athletes</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {pendingAthletes.length > 0 ? Math.round(pendingAthletes.reduce((sum, athlete) => 
            sum + getRegistrationDays(athlete.createdAt), 0) / pendingAthletes.length) : 0}
        </Text>
        <Text style={styles.statLabel}>Avg. Wait Days</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pending Verification</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading pending verifications...</Text>
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
        <Text style={styles.headerTitle}>Pending Verification</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, sport, or location..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
            colors={['#F59E0B']}
            tintColor="#F59E0B"
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={renderListHeader}
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
  listContainer: {
    padding: 20,
    paddingTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  athleteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  genderIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  athleteEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  pendingDays: {
    fontSize: 10,
    color: '#92400E',
    marginTop: 2,
  },
  cardBody: {
    marginTop: 8,
  },
  sportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportContainer: {
    flex: 1,
  },
  sportLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  sportValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
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
  registrationInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  registrationLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  registrationDate: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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

export default PendingVerification;