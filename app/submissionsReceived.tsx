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
import { Submission, useAthleteContext } from '../contexts/AthleteContext';

// Dummy submissions data
const dummySubmissions: Submission[] = [
  {
    _id: 'sub1',
    athleteId: '1',
    athlete: {
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
        category: 'Senior'
      }
    },
    testType: 'Fitness Assessment',
    score: 85,
    submissionDate: '2024-03-10T14:30:00Z',
    status: 'pending',
    documents: ['certificate.pdf', 'medical_report.pdf']
  },
  {
    _id: 'sub2',
    athleteId: '2',
    athlete: {
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
        category: 'Junior'
      }
    },
    testType: 'Skill Assessment',
    score: 92,
    submissionDate: '2024-03-08T09:15:00Z',
    status: 'approved',
    documents: ['skill_video.mp4']
  },
  {
    _id: 'sub3',
    athleteId: '3',
    athlete: {
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
        category: 'Senior'
      }
    },
    testType: 'Performance Test',
    score: 78,
    submissionDate: '2024-03-05T16:45:00Z',
    status: 'pending',
    documents: ['performance_data.xlsx']
  },
  {
    _id: 'sub4',
    athleteId: '4',
    athlete: {
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
        category: 'Senior'
      }
    },
    testType: 'Endurance Test',
    score: 88,
    submissionDate: '2024-03-12T11:20:00Z',
    status: 'rejected',
    documents: ['endurance_report.pdf'],
    notes: 'Incomplete documentation'
  },
  {
    _id: 'sub5',
    athleteId: '5',
    athlete: {
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
        category: 'Junior'
      }
    },
    testType: 'Agility Test',
    score: 95,
    submissionDate: '2024-03-15T13:10:00Z',
    status: 'pending',
    documents: ['agility_video.mp4', 'stats.pdf']
  }
];

const SubmissionsReceived: React.FC = () => {
  const { submissions, setSubmissions, approveSubmission, rejectSubmission } = useAthleteContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchQuery, selectedFilter]);

  const loadSubmissions = async () => {
    try {
      console.log('Loading dummy submissions data...');
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load dummy data if not already loaded
      if (submissions.length === 0) {
        setSubmissions(dummySubmissions);
      }
      
      console.log(`Loaded ${dummySubmissions.length} dummy submissions`);
      
    } catch (err: any) {
      console.error('Error loading submissions:', err);
      Alert.alert("Error", "Failed to load submissions data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing submissions data...');
    await new Promise(resolve => setTimeout(resolve, 500));
    await loadSubmissions();
    setRefreshing(false);
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(submission => {
        const athleteName = `${submission.athlete.profile.firstName} ${submission.athlete.profile.lastName}`.toLowerCase();
        const email = submission.athlete.email.toLowerCase();
        const testType = submission.testType.toLowerCase();
        const sport = submission.athlete.profile.sport.toLowerCase();

        return athleteName.includes(query) || 
               email.includes(query) || 
               testType.includes(query) || 
               sport.includes(query);
      });
    }

    setFilteredSubmissions(filtered);
  };

  const handleApprove = (submissionId: string) => {
    Alert.alert(
      "Approve Submission",
      "Are you sure you want to approve this submission?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          onPress: () => {
            approveSubmission(submissionId);
            Alert.alert("Success", "Submission approved successfully!");
          }
        }
      ]
    );
  };

  const handleReject = (submissionId: string) => {
    Alert.prompt(
      "Reject Submission",
      "Please provide a reason for rejection:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject", 
          onPress: (reason: string | undefined) => {
            rejectSubmission(submissionId, reason || 'No reason provided');
            Alert.alert("Success", "Submission rejected!");
          }
        }
      ],
      'plain-text',
      'Incomplete documentation or invalid data'
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const renderSubmissionCard = ({ item }: { item: Submission }) => (
    <View style={styles.submissionCard}>
      <View style={styles.cardHeader}>
        <View style={styles.athleteInfo}>
          <Text style={styles.athleteName}>
            {`${item.athlete.profile.firstName} ${item.athlete.profile.lastName}`}
          </Text>
          <Text style={styles.athleteEmail}>{item.athlete.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.testInfo}>
          <Text style={styles.testType}>{item.testType}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score: </Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.score) }]}>
              {item.score}/100
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sport</Text>
            <Text style={styles.detailValue}>{item.athlete.profile.sport}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>State</Text>
            <Text style={styles.detailValue}>{item.athlete.profile.state}</Text>
          </View>
        </View>

        {item.documents && item.documents.length > 0 && (
          <View style={styles.documentsContainer}>
            <Text style={styles.documentsLabel}>Documents: </Text>
            <Text style={styles.documentsText}>{item.documents.join(', ')}</Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes: </Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.submissionDate}>
            Submitted: {formatDate(item.submissionDate)}
          </Text>
          
          {item.status === 'pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleApprove(item._id)}
              >
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleReject(item._id)}
              >
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>📋</Text>
      <Text style={styles.emptyStateTitle}>No Submissions Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search criteria' : 'No submissions have been received yet'}
      </Text>
    </View>
  );

  const FilterButton = ({ filter, label, count }: { filter: typeof selectedFilter; label: string; count: number }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.activeFilterButton]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterButtonText, selectedFilter === filter && styles.activeFilterButtonText]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submissions Received</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading submissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submissions Received</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by athlete name, email, test type, or sport..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        <FilterButton filter="all" label="All" count={submissions.length} />
        <FilterButton filter="pending" label="Pending" count={pendingCount} />
        <FilterButton filter="approved" label="Approved" count={approvedCount} />
        <FilterButton filter="rejected" label="Rejected" count={rejectedCount} />
      </View>

      {/* Submissions List */}
      <FlatList
        data={filteredSubmissions}
        renderItem={renderSubmissionCard}
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
    paddingTop: 16,
  },
  submissionCard: {
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
    fontSize: 16,
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
  testInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  testType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
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
  documentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  documentsLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  documentsText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  notesContainer: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  notesText: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 2,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 4,
  },
  submissionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  approveButtonText: {
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

export default SubmissionsReceived;