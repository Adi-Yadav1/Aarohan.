import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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

const { width } = Dimensions.get('window');

// Types for Review Submissions
interface TestSubmission {
  id: string;
  athleteName: string;
  athleteId: string;
  email: string;
  testType: string;
  sport: string;
  submissionDate: string;
  score: number;
  maxScore: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'needs-revision';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  documents: string[];
  performanceMetrics: {
    speed?: number;
    accuracy?: number;
    endurance?: number;
    technique?: number;
  };
}

interface ReviewComment {
  id: string;
  submissionId: string;
  reviewer: string;
  comment: string;
  timestamp: string;
  type: 'note' | 'suggestion' | 'concern' | 'approval';
}

// Dummy data for test submissions
const dummySubmissions: TestSubmission[] = [
  {
    id: 'sub001',
    athleteName: 'Rajesh Kumar',
    athleteId: 'ATH001',
    email: 'rajesh.kumar@gmail.com',
    testType: 'Speed & Agility Assessment',
    sport: 'Cricket',
    submissionDate: '2024-03-18T14:30:00Z',
    score: 87,
    maxScore: 100,
    status: 'pending',
    priority: 'high',
    documents: ['speed_test_video.mp4', 'agility_report.pdf', 'coach_notes.txt'],
    performanceMetrics: {
      speed: 92,
      accuracy: 85,
      endurance: 78,
      technique: 88
    }
  },
  {
    id: 'sub002',
    athleteName: 'Priya Sharma',
    athleteId: 'ATH002',
    email: 'priya.sharma@gmail.com',
    testType: 'Technical Skills Evaluation',
    sport: 'Badminton',
    submissionDate: '2024-03-17T10:15:00Z',
    score: 94,
    maxScore: 100,
    status: 'reviewing',
    priority: 'medium',
    reviewedBy: 'Coach Suresh',
    reviewDate: '2024-03-18T09:00:00Z',
    documents: ['technique_video.mp4', 'skill_assessment.pdf'],
    performanceMetrics: {
      speed: 88,
      accuracy: 96,
      technique: 94
    }
  },
  {
    id: 'sub003',
    athleteName: 'Arjun Singh',
    athleteId: 'ATH003',
    email: 'arjun.singh@gmail.com',
    testType: 'Endurance Test',
    sport: 'Hockey',
    submissionDate: '2024-03-16T16:45:00Z',
    score: 76,
    maxScore: 100,
    status: 'needs-revision',
    priority: 'medium',
    reviewedBy: 'Dr. Mehta',
    reviewDate: '2024-03-17T14:20:00Z',
    comments: 'Good endurance but technique needs improvement. Resubmit with corrected form.',
    documents: ['endurance_data.xlsx', 'heart_rate_monitor.csv'],
    performanceMetrics: {
      endurance: 82,
      technique: 65,
      speed: 75
    }
  },
  {
    id: 'sub004',
    athleteName: 'Sneha Patel',
    athleteId: 'ATH004',
    email: 'sneha.patel@gmail.com',
    testType: 'Swimming Performance',
    sport: 'Swimming',
    submissionDate: '2024-03-15T11:20:00Z',
    score: 91,
    maxScore: 100,
    status: 'approved',
    priority: 'low',
    reviewedBy: 'Coach Marina',
    reviewDate: '2024-03-16T10:30:00Z',
    comments: 'Excellent technique and timing. Approved for advanced training.',
    documents: ['swim_times.pdf', 'stroke_analysis.mp4'],
    performanceMetrics: {
      speed: 93,
      technique: 91,
      endurance: 89
    }
  },
  {
    id: 'sub005',
    athleteName: 'Vikash Yadav',
    athleteId: 'ATH005',
    email: 'vikash.yadav@gmail.com',
    testType: 'Fitness Assessment',
    sport: 'Football',
    submissionDate: '2024-03-19T08:30:00Z',
    score: 83,
    maxScore: 100,
    status: 'pending',
    priority: 'urgent',
    documents: ['fitness_report.pdf', 'medical_clearance.pdf'],
    performanceMetrics: {
      speed: 85,
      endurance: 87,
      accuracy: 78,
      technique: 82
    }
  },
  {
    id: 'sub006',
    athleteName: 'Kavya Reddy',
    athleteId: 'ATH006',
    email: 'kavya.reddy@gmail.com',
    testType: 'Psychological Assessment',
    sport: 'Tennis',
    submissionDate: '2024-03-14T13:45:00Z',
    score: 88,
    maxScore: 100,
    status: 'rejected',
    priority: 'low',
    reviewedBy: 'Dr. Psychology',
    reviewDate: '2024-03-15T15:00:00Z',
    comments: 'Incomplete psychological evaluation. Missing stress test results.',
    documents: ['psych_eval.pdf'],
    performanceMetrics: {
      accuracy: 90,
      technique: 85
    }
  }
];

const ReviewSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [filteredSubmissions, setFilteredSubmissions] = useState<TestSubmission[]>([]);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchQuery, selectedStatus, selectedPriority]);

  const loadSubmissions = async () => {
    try {
      console.log('Loading submissions for review...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissions(dummySubmissions);
      console.log(`Loaded ${dummySubmissions.length} submissions`);
    } catch (error) {
      console.error('Error loading submissions:', error);
      Alert.alert("Error", "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === selectedStatus);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(sub => sub.priority === selectedPriority);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.athleteName.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.testType.toLowerCase().includes(query) ||
        sub.sport.toLowerCase().includes(query) ||
        sub.athleteId.toLowerCase().includes(query)
      );
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
    });

    setFilteredSubmissions(filtered);
  };

  const handleReviewSubmission = (submissionId: string, action: 'approve' | 'reject' | 'needs-revision') => {
    const submission = submissions.find(sub => sub.id === submissionId);
    if (!submission) return;

    const actionText = action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'mark as needs revision';
    
    if (action === 'approve') {
      Alert.alert(
        "Approve Submission",
        `Are you sure you want to approve ${submission.athleteName}'s ${submission.testType}?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Approve", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Approved - meets all requirements');
              Alert.alert("Success", "Submission has been approved!");
            }
          }
        ]
      );
    } else if (action === 'reject') {
      Alert.alert(
        "Reject Submission",
        `Select a reason for rejecting ${submission.athleteName}'s ${submission.testType}:`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Insufficient Evidence", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Rejected - insufficient evidence provided');
              Alert.alert("Success", "Submission has been rejected - insufficient evidence!");
            }
          },
          { 
            text: "Invalid Documentation", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Rejected - invalid or incomplete documentation');
              Alert.alert("Success", "Submission has been rejected - invalid documentation!");
            }
          },
          { 
            text: "Does not meet criteria", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Rejected - does not meet minimum criteria');
              Alert.alert("Success", "Submission has been rejected - does not meet criteria!");
            }
          }
        ]
      );
    } else if (action === 'needs-revision') {
      Alert.alert(
        "Request Revision",
        `Select what needs to be revised in ${submission.athleteName}'s ${submission.testType}:`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Additional Documentation", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Revision needed - please provide additional documentation');
              Alert.alert("Success", "Revision requested - additional documentation needed!");
            }
          },
          { 
            text: "Improve Test Results", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Revision needed - test results need improvement');
              Alert.alert("Success", "Revision requested - test results need improvement!");
            }
          },
          { 
            text: "Correct Information", 
            onPress: () => {
              updateSubmissionStatus(submissionId, action, 'Revision needed - please correct information provided');
              Alert.alert("Success", "Revision requested - information correction needed!");
            }
          }
        ]
      );
    }
  };

  const updateSubmissionStatus = (submissionId: string, status: string, comments?: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              status: status as any,
              reviewedBy: 'Admin User',
              reviewDate: new Date().toISOString(),
              comments: comments || sub.comments
            }
          : sub
      )
    );
    
    Alert.alert("Success", "Submission review updated successfully!");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
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
      case 'reviewing': return '#3B82F6';
      case 'needs-revision': return '#F59E0B';
      case 'urgent': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#65A30D';
      default: return '#6B7280';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return '#10B981';
    if (percentage >= 75) return '#F59E0B';
    if (percentage >= 60) return '#EF4444';
    return '#DC2626';
  };

  const renderSubmissionCard = ({ item }: { item: TestSubmission }) => (
    <View style={styles.submissionCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.athleteInfo}>
          <Text style={styles.athleteName}>{item.athleteName}</Text>
          <Text style={styles.athleteId}>ID: {item.athleteId}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Test Info */}
      <View style={styles.testInfo}>
        <Text style={styles.testType}>{item.testType}</Text>
        <Text style={styles.sport}>{item.sport}</Text>
        <Text style={styles.submissionDate}>Submitted: {formatDate(item.submissionDate)}</Text>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score: </Text>
        <Text style={[styles.score, { color: getScoreColor(item.score, item.maxScore) }]}>
          {item.score}/{item.maxScore}
        </Text>
        <Text style={styles.percentage}>
          ({Math.round((item.score / item.maxScore) * 100)}%)
        </Text>
      </View>

      {/* Performance Metrics */}
      {item.performanceMetrics && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsLabel}>Performance Metrics:</Text>
          <View style={styles.metricsGrid}>
            {Object.entries(item.performanceMetrics).map(([key, value]) => (
              <View key={key} style={styles.metricItem}>
                <Text style={styles.metricKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Text style={styles.metricValue}>{value}%</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Documents */}
      <View style={styles.documentsContainer}>
        <Text style={styles.documentsLabel}>Documents ({item.documents.length}):</Text>
        <Text style={styles.documentsList} numberOfLines={2}>
          {item.documents.join(', ')}
        </Text>
      </View>

      {/* Review Info */}
      {item.reviewedBy && (
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewedBy}>Reviewed by: {item.reviewedBy}</Text>
          <Text style={styles.reviewDate}>{formatDate(item.reviewDate!)}</Text>
          {item.comments && (
            <Text style={styles.comments}>{item.comments}</Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      {item.status === 'pending' || item.status === 'reviewing' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleReviewSubmission(item.id, 'approve')}
          >
            <Text style={styles.approveButtonText}>✓ Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.revisionButton]}
            onPress={() => handleReviewSubmission(item.id, 'needs-revision')}
          >
            <Text style={styles.revisionButtonText}>⚠ Revision</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReviewSubmission(item.id, 'reject')}
          >
            <Text style={styles.rejectButtonText}>✗ Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.completedActions}>
          <Text style={styles.completedText}>Review completed</Text>
        </View>
      )}
    </View>
  );

  const FilterButton = ({ value, label, count, selectedValue, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedValue === value && styles.activeFilterButton]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.filterButtonText, selectedValue === value && styles.activeFilterText]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>📋</Text>
      <Text style={styles.emptyStateTitle}>No Submissions Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search criteria' : 'No submissions match your current filters'}
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
          <Text style={styles.headerTitle}>Review Submissions</Text>
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
  const reviewingCount = submissions.filter(s => s.status === 'reviewing').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;
  const revisionCount = submissions.filter(s => s.status === 'needs-revision').length;

  const urgentCount = submissions.filter(s => s.priority === 'urgent').length;
  const highCount = submissions.filter(s => s.priority === 'high').length;
  const mediumCount = submissions.filter(s => s.priority === 'medium').length;
  const lowCount = submissions.filter(s => s.priority === 'low').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Submissions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by athlete name, ID, test type, or sport..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterSectionTitle}>Status</Text>
        <View style={styles.filtersContainer}>
          <FilterButton value="all" label="All" count={submissions.length} selectedValue={selectedStatus} onPress={setSelectedStatus} />
          <FilterButton value="pending" label="Pending" count={pendingCount} selectedValue={selectedStatus} onPress={setSelectedStatus} />
          <FilterButton value="reviewing" label="Reviewing" count={reviewingCount} selectedValue={selectedStatus} onPress={setSelectedStatus} />
          <FilterButton value="needs-revision" label="Revision" count={revisionCount} selectedValue={selectedStatus} onPress={setSelectedStatus} />
        </View>
      </View>

      {/* Priority Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterSectionTitle}>Priority</Text>
        <View style={styles.filtersContainer}>
          <FilterButton value="all" label="All" count={submissions.length} selectedValue={selectedPriority} onPress={setSelectedPriority} />
          <FilterButton value="urgent" label="Urgent" count={urgentCount} selectedValue={selectedPriority} onPress={setSelectedPriority} />
          <FilterButton value="high" label="High" count={highCount} selectedValue={selectedPriority} onPress={setSelectedPriority} />
          <FilterButton value="medium" label="Medium" count={mediumCount} selectedValue={selectedPriority} onPress={setSelectedPriority} />
        </View>
      </View>

      {/* Submissions List */}
      <FlatList
        data={filteredSubmissions}
        renderItem={renderSubmissionCard}
        keyExtractor={(item) => item.id}
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
  filtersSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  activeFilterText: {
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
    marginBottom: 2,
  },
  athleteId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  testInfo: {
    marginBottom: 12,
  },
  testType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  sport: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  percentage: {
    fontSize: 14,
    color: '#6B7280',
  },
  metricsContainer: {
    marginBottom: 12,
  },
  metricsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  metricKey: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  documentsContainer: {
    marginBottom: 12,
  },
  documentsLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  documentsList: {
    fontSize: 12,
    color: '#374151',
  },
  reviewInfo: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  reviewedBy: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  comments: {
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  revisionButton: {
    backgroundColor: '#F59E0B',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  revisionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  completedActions: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  completedText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
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

export default ReviewSubmissions;