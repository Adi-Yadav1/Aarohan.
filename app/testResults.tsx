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
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Types for Test Results
interface TestResult {
  id: string;
  athleteId: string;
  athleteName: string;
  testName: string;
  testType: 'Fitness' | 'Skill' | 'Endurance' | 'Speed' | 'Strength' | 'Mental' | 'Technical';
  sport: string;
  testDate: string;
  duration: number; // in minutes
  overallScore: number;
  maxScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  status: 'completed' | 'in-progress' | 'failed' | 'retake-required';
  metrics: {
    [key: string]: {
      value: number;
      unit: string;
      benchmark?: number;
      category: 'excellent' | 'good' | 'average' | 'needs-improvement';
    };
  };
  recommendations: string[];
  conducterBy: string;
  notes?: string;
}

interface TestStatistics {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  topPerformers: number;
  needsImprovement: number;
}

// Dummy test results data
const dummyTestResults: TestResult[] = [
  {
    id: 'TR001',
    athleteId: 'ATH001',
    athleteName: 'Rajesh Kumar',
    testName: 'Cricket Batting Assessment',
    testType: 'Skill',
    sport: 'Cricket',
    testDate: '2024-03-18T10:30:00Z',
    duration: 45,
    overallScore: 87,
    maxScore: 100,
    grade: 'A',
    status: 'completed',
    metrics: {
      'Batting Average': {
        value: 45.2,
        unit: 'runs',
        benchmark: 40,
        category: 'excellent'
      },
      'Strike Rate': {
        value: 125,
        unit: '%',
        benchmark: 120,
        category: 'excellent'
      },
      'Technique Score': {
        value: 85,
        unit: '/100',
        benchmark: 75,
        category: 'good'
      },
      'Footwork': {
        value: 78,
        unit: '/100',
        benchmark: 70,
        category: 'good'
      }
    },
    recommendations: [
      'Continue practicing different shot variations',
      'Work on footwork against spin bowling',
      'Improve shot selection in pressure situations'
    ],
    conducterBy: 'Coach Sharma',
    notes: 'Excellent overall performance. Shows great potential for higher level cricket.'
  },
  {
    id: 'TR002',
    athleteId: 'ATH002',
    athleteName: 'Priya Sharma',
    testName: 'Badminton Agility & Speed Test',
    testType: 'Speed',
    sport: 'Badminton',
    testDate: '2024-03-17T14:15:00Z',
    duration: 30,
    overallScore: 94,
    maxScore: 100,
    grade: 'A+',
    status: 'completed',
    metrics: {
      'Court Coverage Speed': {
        value: 3.2,
        unit: 'seconds',
        benchmark: 3.5,
        category: 'excellent'
      },
      'Reaction Time': {
        value: 0.18,
        unit: 'seconds',
        benchmark: 0.20,
        category: 'excellent'
      },
      'Smash Speed': {
        value: 285,
        unit: 'km/h',
        benchmark: 260,
        category: 'excellent'
      },
      'Endurance Score': {
        value: 92,
        unit: '/100',
        benchmark: 80,
        category: 'excellent'
      }
    },
    recommendations: [
      'Maintain current training intensity',
      'Focus on consistency in tournament play',
      'Add strength training for power improvement'
    ],
    conducterBy: 'Coach Gupta',
    notes: 'Outstanding performance across all metrics. Ready for national level competition.'
  },
  {
    id: 'TR003',
    athleteId: 'ATH003',
    athleteName: 'Arjun Singh',
    testName: 'Hockey Endurance Assessment',
    testType: 'Endurance',
    sport: 'Hockey',
    testDate: '2024-03-16T09:00:00Z',
    duration: 60,
    overallScore: 76,
    maxScore: 100,
    grade: 'B+',
    status: 'completed',
    metrics: {
      'VO2 Max': {
        value: 52,
        unit: 'ml/kg/min',
        benchmark: 55,
        category: 'good'
      },
      'Running Speed': {
        value: 15.2,
        unit: 'km/h',
        benchmark: 16,
        category: 'average'
      },
      'Stick Work': {
        value: 82,
        unit: '/100',
        benchmark: 75,
        category: 'good'
      },
      'Game Awareness': {
        value: 75,
        unit: '/100',
        benchmark: 70,
        category: 'good'
      }
    },
    recommendations: [
      'Increase cardio training frequency',
      'Work on sprint intervals',
      'Focus on stick handling under fatigue'
    ],
    conducterBy: 'Coach Singh',
    notes: 'Good overall fitness but needs improvement in speed and agility.'
  },
  {
    id: 'TR004',
    athleteId: 'ATH004',
    athleteName: 'Sneha Patel',
    testName: 'Swimming Stroke Analysis',
    testType: 'Technical',
    sport: 'Swimming',
    testDate: '2024-03-15T16:30:00Z',
    duration: 40,
    overallScore: 91,
    maxScore: 100,
    grade: 'A',
    status: 'completed',
    metrics: {
      'Freestyle Time (100m)': {
        value: 58.2,
        unit: 'seconds',
        benchmark: 60,
        category: 'excellent'
      },
      'Stroke Efficiency': {
        value: 89,
        unit: '/100',
        benchmark: 80,
        category: 'excellent'
      },
      'Breathing Technique': {
        value: 92,
        unit: '/100',
        benchmark: 85,
        category: 'excellent'
      },
      'Turn Technique': {
        value: 85,
        unit: '/100',
        benchmark: 75,
        category: 'good'
      }
    },
    recommendations: [
      'Perfect the flip turn technique',
      'Work on underwater dolphin kicks',
      'Maintain stroke rate consistency'
    ],
    conducterBy: 'Coach Marina',
    notes: 'Excellent technique and timing. Minor improvements needed in turns.'
  },
  {
    id: 'TR005',
    athleteId: 'ATH005',
    athleteName: 'Vikash Yadav',
    testName: 'Football Fitness Test',
    testType: 'Fitness',
    sport: 'Football',
    testDate: '2024-03-14T11:00:00Z',
    duration: 50,
    overallScore: 65,
    maxScore: 100,
    grade: 'C+',
    status: 'retake-required',
    metrics: {
      'Sprint Speed (30m)': {
        value: 4.2,
        unit: 'seconds',
        benchmark: 3.8,
        category: 'needs-improvement'
      },
      'Agility Score': {
        value: 68,
        unit: '/100',
        benchmark: 75,
        category: 'needs-improvement'
      },
      'Ball Control': {
        value: 72,
        unit: '/100',
        benchmark: 70,
        category: 'average'
      },
      'Passing Accuracy': {
        value: 78,
        unit: '%',
        benchmark: 75,
        category: 'good'
      }
    },
    recommendations: [
      'Increase sprint training intensity',
      'Work on agility ladder drills',
      'Focus on first touch improvement',
      'Retake test after 4 weeks of training'
    ],
    conducterBy: 'Coach Kumar',
    notes: 'Below benchmark in key areas. Requires focused training before retesting.'
  },
  {
    id: 'TR006',
    athleteId: 'ATH006',
    athleteName: 'Kavya Reddy',
    testName: 'Tennis Serve & Volley Test',
    testType: 'Skill',
    sport: 'Tennis',
    testDate: '2024-03-13T15:45:00Z',
    duration: 35,
    overallScore: 88,
    maxScore: 100,
    grade: 'A',
    status: 'completed',
    metrics: {
      'Serve Speed': {
        value: 165,
        unit: 'km/h',
        benchmark: 150,
        category: 'excellent'
      },
      'Serve Accuracy': {
        value: 82,
        unit: '%',
        benchmark: 75,
        category: 'good'
      },
      'Volley Precision': {
        value: 89,
        unit: '/100',
        benchmark: 80,
        category: 'excellent'
      },
      'Court Movement': {
        value: 86,
        unit: '/100',
        benchmark: 80,
        category: 'good'
      }
    },
    recommendations: [
      'Work on second serve consistency',
      'Improve net approach timing',
      'Practice cross-court volleys'
    ],
    conducterBy: 'Coach Wilson',
    notes: 'Strong serve and volley game. Good tournament potential.'
  }
];

const TestResults: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTestType, setSelectedTestType] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [statistics, setStatistics] = useState<TestStatistics>({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    topPerformers: 0,
    needsImprovement: 0
  });

  useEffect(() => {
    loadTestResults();
  }, []);

  useEffect(() => {
    filterResults();
    calculateStatistics();
  }, [testResults, searchQuery, selectedTestType, selectedSport, selectedStatus]);

  const loadTestResults = async () => {
    try {
      console.log('Loading test results...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResults(dummyTestResults);
      console.log(`Loaded ${dummyTestResults.length} test results`);
    } catch (error) {
      console.error('Error loading test results:', error);
      Alert.alert("Error", "Failed to load test results");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTestResults();
    setRefreshing(false);
  };

  const handleViewDetails = (testResult: TestResult) => {
    const detailsText = `
📊 TEST DETAILS:
▫ Test: ${testResult.testName}
▫ Athlete: ${testResult.athleteName}
▫ Date: ${formatDate(testResult.testDate)}
▫ Duration: ${testResult.duration} minutes
▫ Score: ${testResult.overallScore}/${testResult.maxScore} (${testResult.grade})

📈 KEY METRICS:
${Object.entries(testResult.metrics).map(([key, metric]) => 
  `▫ ${key}: ${metric.value} ${metric.unit} (${metric.category})`
).join('\n')}

💡 RECOMMENDATIONS:
${testResult.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

📝 NOTES:
${testResult.notes || 'No additional notes'}

👨‍🏫 Conducted by: ${testResult.conducterBy}
    `;

    Alert.alert("Test Details", detailsText, [
      { text: "Close", style: "cancel" },
      { text: "Export Report", onPress: () => Alert.alert("Export", "Report export functionality would be implemented here") }
    ]);
  };

  const handleScheduleRetake = (testResult: TestResult) => {
    Alert.alert(
      "Schedule Retake",
      `Schedule a retake for ${testResult.athleteName}'s ${testResult.testName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Next Week", 
          onPress: () => {
            // Update test status to scheduled for retake
            setTestResults(prevResults => 
              prevResults.map(result => 
                result.id === testResult.id 
                  ? { ...result, status: 'in-progress', notes: `Retake scheduled for next week - ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}` }
                  : result
              )
            );
            Alert.alert("Success", `Retake scheduled for ${testResult.athleteName} next week!`);
          }
        },
        { 
          text: "Next Month", 
          onPress: () => {
            setTestResults(prevResults => 
              prevResults.map(result => 
                result.id === testResult.id 
                  ? { ...result, status: 'in-progress', notes: `Retake scheduled for next month - ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}` }
                  : result
              )
            );
            Alert.alert("Success", `Retake scheduled for ${testResult.athleteName} next month!`);
          }
        },
        { 
          text: "Custom Date", 
          onPress: () => {
            Alert.alert("Custom Date", "Custom date selection would open a date picker here", [
              { text: "OK", onPress: () => {
                setTestResults(prevResults => 
                  prevResults.map(result => 
                    result.id === testResult.id 
                      ? { ...result, status: 'in-progress', notes: 'Retake scheduled for custom date (date picker would be used)' }
                      : result
                  )
                );
                Alert.alert("Success", "Custom retake date has been set!");
              }}
            ]);
          }
        }
      ]
    );
  };

  const filterResults = () => {
    let filtered = testResults;

    // Filter by test type
    if (selectedTestType !== 'all') {
      filtered = filtered.filter(result => result.testType === selectedTestType);
    }

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(result => result.sport === selectedSport);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(result => result.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(result =>
        result.athleteName.toLowerCase().includes(query) ||
        result.testName.toLowerCase().includes(query) ||
        result.athleteId.toLowerCase().includes(query) ||
        result.sport.toLowerCase().includes(query) ||
        result.conducterBy.toLowerCase().includes(query)
      );
    }

    // Sort by test date (most recent first)
    filtered.sort((a, b) => 
      new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
    );

    setFilteredResults(filtered);
  };

  const calculateStatistics = () => {
    const total = testResults.length;
    const completed = testResults.filter(r => r.status === 'completed').length;
    const average = total > 0 
      ? testResults.reduce((sum, r) => sum + r.overallScore, 0) / total 
      : 0;
    const topPerformers = testResults.filter(r => r.overallScore >= 90).length;
    const needsImprovement = testResults.filter(r => r.overallScore < 70).length;

    setStatistics({
      totalTests: total,
      completedTests: completed,
      averageScore: Math.round(average * 10) / 10,
      topPerformers,
      needsImprovement
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return '#8B5CF6';
      case 'A': return '#10B981';
      case 'B+': return '#059669';
      case 'B': return '#F59E0B';
      case 'C+': return '#EF4444';
      case 'C': return '#DC2626';
      case 'D': return '#991B1B';
      case 'F': return '#7F1D1D';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#3B82F6';
      case 'failed': return '#EF4444';
      case 'retake-required': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getMetricCategoryColor = (category: string) => {
    switch (category) {
      case 'excellent': return '#10B981';
      case 'good': return '#059669';
      case 'average': return '#F59E0B';
      case 'needs-improvement': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleExportResults = () => {
    Alert.alert(
      "Export Results",
      "Choose export format:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "PDF Report", onPress: () => Alert.alert("Info", "PDF export functionality would be implemented here") },
        { text: "Excel Sheet", onPress: () => Alert.alert("Info", "Excel export functionality would be implemented here") },
        { text: "CSV Data", onPress: () => Alert.alert("Info", "CSV export functionality would be implemented here") }
      ]
    );
  };

  const renderTestResultCard = ({ item }: { item: TestResult }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => Alert.alert("Details", `Full test details for ${item.testName} would open here`)}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.testBasicInfo}>
          <Text style={styles.testName}>{item.testName}</Text>
          <Text style={styles.athleteName}>{item.athleteName}</Text>
          <Text style={styles.testMeta}>{item.sport} • {formatDate(item.testDate)}</Text>
        </View>
        <View style={styles.scoreSection}>
          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
            <Text style={styles.gradeText}>{item.grade}</Text>
          </View>
          <Text style={styles.score}>{item.overallScore}/{item.maxScore}</Text>
        </View>
      </View>

      {/* Status and Type */}
      <View style={styles.testTypeRow}>
        <View style={styles.testTypeBadge}>
          <Text style={styles.testTypeText}>{item.testType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsSection}>
        <Text style={styles.metricsTitle}>Key Performance Metrics:</Text>
        <View style={styles.metricsGrid}>
          {Object.entries(item.metrics).slice(0, 4).map(([key, metric]) => (
            <View key={key} style={styles.metricItem}>
              <Text style={styles.metricName}>{key}</Text>
              <Text style={[styles.metricValue, { color: getMetricCategoryColor(metric.category) }]}>
                {metric.value} {metric.unit}
              </Text>
              <View style={[styles.categoryDot, { backgroundColor: getMetricCategoryColor(metric.category) }]} />
            </View>
          ))}
        </View>
      </View>

      {/* Conducted By and Duration */}
      <View style={styles.testDetails}>
        <Text style={styles.conductedBy}>Conducted by: {item.conducterBy}</Text>
        <Text style={styles.duration}>Duration: {item.duration} minutes</Text>
      </View>

      {/* Recommendations Preview */}
      {item.recommendations.length > 0 && (
        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Top Recommendation:</Text>
          <Text style={styles.recommendationText} numberOfLines={2}>
            • {item.recommendations[0]}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'retake-required' && (
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => handleScheduleRetake(item)}
          >
            <Text style={styles.retakeText}>Schedule Retake</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
      <Text style={styles.emptyStateEmoji}>📊</Text>
      <Text style={styles.emptyStateTitle}>No Test Results Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search criteria' : 'No test results match your current filters'}
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
          <Text style={styles.headerTitle}>Test Results</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading test results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const testTypes = [...new Set(testResults.map(r => r.testType))];
  const sports = [...new Set(testResults.map(r => r.sport))];
  const statusOptions = [...new Set(testResults.map(r => r.status))];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Results</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportResults}>
          <Text style={styles.exportButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics Dashboard */}
      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{statistics.totalTests}</Text>
              <Text style={styles.statLabel}>Total Tests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{statistics.completedTests}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{statistics.averageScore}%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{statistics.topPerformers}</Text>
              <Text style={styles.statLabel}>Top Performers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{statistics.needsImprovement}</Text>
              <Text style={styles.statLabel}>Need Improvement</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by athlete, test name, sport, or conductor..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Type:</Text>
          <FilterButton value="all" label="All" count={testResults.length} selectedValue={selectedTestType} onPress={setSelectedTestType} />
          {testTypes.map(type => (
            <FilterButton 
              key={type} 
              value={type} 
              label={type} 
              count={testResults.filter(r => r.testType === type).length}
              selectedValue={selectedTestType} 
              onPress={setSelectedTestType} 
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Sport:</Text>
          <FilterButton value="all" label="All" count={testResults.length} selectedValue={selectedSport} onPress={setSelectedSport} />
          {sports.map(sport => (
            <FilterButton 
              key={sport} 
              value={sport} 
              label={sport} 
              count={testResults.filter(r => r.sport === sport).length}
              selectedValue={selectedSport} 
              onPress={setSelectedSport} 
            />
          ))}
        </View>
      </ScrollView>

      {/* Results List */}
      <FlatList
        data={filteredResults}
        renderItem={renderTestResultCard}
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
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 16,
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
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
  filtersScroll: {
    backgroundColor: '#FFFFFF',
    maxHeight: 50,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
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
  resultCard: {
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
  testBasicInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  athleteName: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 2,
  },
  testMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scoreSection: {
    alignItems: 'flex-end',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  score: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  testTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  testTypeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  testTypeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricsSection: {
    marginBottom: 12,
  },
  metricsTitle: {
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
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    minWidth: (width - 80) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricName: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  testDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  conductedBy: {
    fontSize: 12,
    color: '#6B7280',
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
  },
  recommendationsSection: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: '#92400E',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: 12,
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

export default TestResults;