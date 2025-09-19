import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
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

// Types for Manage Athletes
interface AthleteProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  sport: string;
  category: 'Junior' | 'Senior' | 'Youth' | 'Masters';
  state: string;
  district: string;
  coachName?: string;
  emergencyContact: string;
  registrationDate: string;
  isActive: boolean;
  isVerified: boolean;
  performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  achievements: string[];
  medicalClearance: boolean;
  lastActivity: string;
  totalTests: number;
  averageScore: number;
}

interface AthleteStats {
  totalAthletes: number;
  activeAthletes: number;
  verifiedAthletes: number;
  newThisMonth: number;
}

// Dummy athlete data
const dummyAthletes: AthleteProfile[] = [
  {
    id: 'ATH001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 9876543210',
    dateOfBirth: '2000-05-15',
    gender: 'MALE',
    sport: 'Cricket',
    category: 'Senior',
    state: 'Maharashtra',
    district: 'Mumbai',
    coachName: 'Coach Sharma',
    emergencyContact: '+91 9876543211',
    registrationDate: '2024-01-15T10:30:00Z',
    isActive: true,
    isVerified: true,
    performanceLevel: 'Advanced',
    achievements: ['State Championship 2023', 'District Best Player 2024'],
    medicalClearance: true,
    lastActivity: '2024-03-18T14:30:00Z',
    totalTests: 12,
    averageScore: 87.5
  },
  {
    id: 'ATH002',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 9876543220',
    dateOfBirth: '2002-08-22',
    gender: 'FEMALE',
    sport: 'Badminton',
    category: 'Junior',
    state: 'Delhi',
    district: 'New Delhi',
    coachName: 'Coach Gupta',
    emergencyContact: '+91 9876543221',
    registrationDate: '2024-02-01T09:15:00Z',
    isActive: true,
    isVerified: true,
    performanceLevel: 'Elite',
    achievements: ['National Junior Champion 2023', 'Asian Youth Games Gold 2024'],
    medicalClearance: true,
    lastActivity: '2024-03-17T10:15:00Z',
    totalTests: 18,
    averageScore: 94.2
  },
  {
    id: 'ATH003',
    firstName: 'Arjun',
    lastName: 'Singh',
    email: 'arjun.singh@gmail.com',
    phone: '+91 9876543230',
    dateOfBirth: '1998-12-10',
    gender: 'MALE',
    sport: 'Hockey',
    category: 'Senior',
    state: 'Punjab',
    district: 'Ludhiana',
    coachName: 'Coach Singh',
    emergencyContact: '+91 9876543231',
    registrationDate: '2023-11-20T16:45:00Z',
    isActive: true,
    isVerified: false,
    performanceLevel: 'Intermediate',
    achievements: ['Regional Tournament Winner 2023'],
    medicalClearance: true,
    lastActivity: '2024-03-16T16:45:00Z',
    totalTests: 8,
    averageScore: 76.8
  },
  {
    id: 'ATH004',
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'sneha.patel@gmail.com',
    phone: '+91 9876543240',
    dateOfBirth: '2001-03-28',
    gender: 'FEMALE',
    sport: 'Swimming',
    category: 'Senior',
    state: 'Gujarat',
    district: 'Ahmedabad',
    coachName: 'Coach Marina',
    emergencyContact: '+91 9876543241',
    registrationDate: '2024-01-08T11:20:00Z',
    isActive: true,
    isVerified: true,
    performanceLevel: 'Advanced',
    achievements: ['State Swimming Championship 2023', 'Best Technique Award 2024'],
    medicalClearance: true,
    lastActivity: '2024-03-15T11:20:00Z',
    totalTests: 15,
    averageScore: 91.3
  },
  {
    id: 'ATH005',
    firstName: 'Vikash',
    lastName: 'Yadav',
    email: 'vikash.yadav@gmail.com',
    phone: '+91 9876543250',
    dateOfBirth: '2003-07-05',
    gender: 'MALE',
    sport: 'Football',
    category: 'Junior',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    emergencyContact: '+91 9876543251',
    registrationDate: '2024-03-01T13:10:00Z',
    isActive: false,
    isVerified: false,
    performanceLevel: 'Beginner',
    achievements: [],
    medicalClearance: false,
    lastActivity: '2024-03-10T08:30:00Z',
    totalTests: 2,
    averageScore: 65.0
  },
  {
    id: 'ATH006',
    firstName: 'Kavya',
    lastName: 'Reddy',
    email: 'kavya.reddy@gmail.com',
    phone: '+91 9876543260',
    dateOfBirth: '1999-11-18',
    gender: 'FEMALE',
    sport: 'Tennis',
    category: 'Senior',
    state: 'Telangana',
    district: 'Hyderabad',
    coachName: 'Coach Wilson',
    emergencyContact: '+91 9876543261',
    registrationDate: '2023-09-12T15:30:00Z',
    isActive: true,
    isVerified: true,
    performanceLevel: 'Advanced',
    achievements: ['State Ranking No. 3', 'Tennis Academy Graduate'],
    medicalClearance: true,
    lastActivity: '2024-03-14T13:45:00Z',
    totalTests: 20,
    averageScore: 88.7
  },
  {
    id: 'ATH007',
    firstName: 'Rohit',
    lastName: 'Mehta',
    email: 'rohit.mehta@gmail.com',
    phone: '+91 9876543270',
    dateOfBirth: '2004-01-12',
    gender: 'MALE',
    sport: 'Athletics',
    category: 'Youth',
    state: 'Rajasthan',
    district: 'Jaipur',
    coachName: 'Coach Kumar',
    emergencyContact: '+91 9876543271',
    registrationDate: '2024-02-20T10:00:00Z',
    isActive: true,
    isVerified: true,
    performanceLevel: 'Intermediate',
    achievements: ['Youth State Record Holder 100m'],
    medicalClearance: true,
    lastActivity: '2024-03-19T09:00:00Z',
    totalTests: 6,
    averageScore: 82.1
  }
];

const ManageAthletes: React.FC = () => {
  const [athletes, setAthletes] = useState<AthleteProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteProfile[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [stats, setStats] = useState<AthleteStats>({
    totalAthletes: 0,
    activeAthletes: 0,
    verifiedAthletes: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    loadAthletes();
  }, []);

  useEffect(() => {
    filterAthletes();
    calculateStats();
  }, [athletes, searchQuery, selectedSport, selectedCategory, selectedStatus]);

  const loadAthletes = async () => {
    try {
      console.log('Loading athletes data...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAthletes(dummyAthletes);
      console.log(`Loaded ${dummyAthletes.length} athletes`);
    } catch (error) {
      console.error('Error loading athletes:', error);
      Alert.alert("Error", "Failed to load athletes data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAthletes();
    setRefreshing(false);
  };

  const filterAthletes = () => {
    let filtered = athletes;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(athlete => athlete.sport === selectedSport);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(athlete => athlete.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus === 'active') {
      filtered = filtered.filter(athlete => athlete.isActive);
    } else if (selectedStatus === 'inactive') {
      filtered = filtered.filter(athlete => !athlete.isActive);
    } else if (selectedStatus === 'verified') {
      filtered = filtered.filter(athlete => athlete.isVerified);
    } else if (selectedStatus === 'unverified') {
      filtered = filtered.filter(athlete => !athlete.isVerified);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(athlete =>
        athlete.firstName.toLowerCase().includes(query) ||
        athlete.lastName.toLowerCase().includes(query) ||
        athlete.email.toLowerCase().includes(query) ||
        athlete.id.toLowerCase().includes(query) ||
        athlete.sport.toLowerCase().includes(query) ||
        athlete.state.toLowerCase().includes(query)
      );
    }

    // Sort by last activity (most recent first)
    filtered.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );

    setFilteredAthletes(filtered);
  };

  const calculateStats = () => {
    const total = athletes.length;
    const active = athletes.filter(a => a.isActive).length;
    const verified = athletes.filter(a => a.isVerified).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = athletes.filter(a => {
      const regDate = new Date(a.registrationDate);
      return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    }).length;

    setStats({
      totalAthletes: total,
      activeAthletes: active,
      verifiedAthletes: verified,
      newThisMonth
    });
  };

  const handleAthleteAction = (athleteId: string, action: 'activate' | 'deactivate' | 'verify' | 'unverify' | 'delete') => {
    const athlete = athletes.find(a => a.id === athleteId);
    if (!athlete) return;

    const actionText = {
      activate: 'activate',
      deactivate: 'deactivate',
      verify: 'verify',
      unverify: 'unverify',
      delete: 'delete'
    }[action];

    Alert.alert(
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Athlete`,
      `Are you sure you want to ${actionText} ${athlete.firstName} ${athlete.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
          style: action === 'delete' ? 'destructive' : 'default',
          onPress: () => updateAthleteStatus(athleteId, action)
        }
      ]
    );
  };

  const updateAthleteStatus = (athleteId: string, action: string) => {
    if (action === 'delete') {
      setAthletes(prevAthletes => prevAthletes.filter(a => a.id !== athleteId));
      Alert.alert("Success", "Athlete deleted successfully!");
      return;
    }

    setAthletes(prevAthletes =>
      prevAthletes.map(athlete =>
        athlete.id === athleteId
          ? {
              ...athlete,
              isActive: action === 'activate' ? true : action === 'deactivate' ? false : athlete.isActive,
              isVerified: action === 'verify' ? true : action === 'unverify' ? false : athlete.isVerified,
            }
          : athlete
      )
    );

    Alert.alert("Success", `Athlete ${action}d successfully!`);
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

  const getAge = (dateOfBirth: string) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 'N/A';
    }
  };

  const getPerformanceLevelColor = (level: string) => {
    switch (level) {
      case 'Elite': return '#8B5CF6';
      case 'Advanced': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Beginner': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Junior': return '#3B82F6';
      case 'Senior': return '#10B981';
      case 'Youth': return '#8B5CF6';
      case 'Masters': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const renderAthleteCard = ({ item }: { item: AthleteProfile }) => (
    <TouchableOpacity
      style={styles.athleteCard}
      onPress={() => {
        setSelectedAthlete(item);
        setShowDetailModal(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.athleteBasicInfo}>
          <Text style={styles.athleteName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.athleteId}>ID: {item.id}</Text>
          <Text style={styles.athleteEmail}>{item.email}</Text>
        </View>
        <View style={styles.statusIndicators}>
          <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#10B981' : '#EF4444' }]} />
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.athleteDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.sportText}>{item.sport}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '15' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
              {item.category}
            </Text>
          </View>
        </View>
        
        <Text style={styles.locationText}>{item.district}, {item.state}</Text>
        
        <View style={styles.performanceRow}>
          <View style={[styles.performanceBadge, { backgroundColor: getPerformanceLevelColor(item.performanceLevel) + '15' }]}>
            <Text style={[styles.performanceText, { color: getPerformanceLevelColor(item.performanceLevel) }]}>
              {item.performanceLevel}
            </Text>
          </View>
          <Text style={styles.avgScore}>Avg: {item.averageScore}%</Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>Age: {getAge(item.dateOfBirth)}</Text>
          <Text style={styles.statText}>Tests: {item.totalTests}</Text>
          <Text style={styles.statText}>
            Last Active: {formatDate(item.lastActivity)}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {!item.isVerified && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.verifyBtn]}
            onPress={() => handleAthleteAction(item.id, 'verify')}
          >
            <Text style={styles.verifyBtnText}>Verify</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, item.isActive ? styles.deactivateBtn : styles.activateBtn]}
          onPress={() => handleAthleteAction(item.id, item.isActive ? 'deactivate' : 'activate')}
        >
          <Text style={[styles.actionBtnText, { color: item.isActive ? '#EF4444' : '#10B981' }]}>
            {item.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Athlete Details</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetailModal(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {selectedAthlete && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>
                    {selectedAthlete.firstName} {selectedAthlete.lastName}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.phone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date of Birth</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedAthlete.dateOfBirth)} (Age: {getAge(selectedAthlete.dateOfBirth)})
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Gender</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.gender}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Emergency Contact</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.emergencyContact}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Sports Information</Text>
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Sport</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.sport}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.category}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Performance Level</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.performanceLevel}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Coach</Text>
                  <Text style={styles.detailValue}>{selectedAthlete.coachName || 'Not Assigned'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Performance Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{selectedAthlete.totalTests}</Text>
                  <Text style={styles.statLabel}>Total Tests</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{selectedAthlete.averageScore}%</Text>
                  <Text style={styles.statLabel}>Average Score</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{selectedAthlete.achievements.length}</Text>
                  <Text style={styles.statLabel}>Achievements</Text>
                </View>
              </View>
            </View>

            {selectedAthlete.achievements.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {selectedAthlete.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Text style={styles.achievementText}>🏆 {achievement}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.editBtn]}
                onPress={() => Alert.alert('Edit', 'Edit functionality would open here')}
              >
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.deleteBtn]}
                onPress={() => {
                  setShowDetailModal(false);
                  handleAthleteAction(selectedAthlete.id, 'delete');
                }}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
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
      <Text style={styles.emptyStateEmoji}>👥</Text>
      <Text style={styles.emptyStateTitle}>No Athletes Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'Try adjusting your search criteria' : 'No athletes match your current filters'}
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
          <Text style={styles.headerTitle}>Manage Athletes</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading athletes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sports = [...new Set(athletes.map(a => a.sport))];
  const categories = [...new Set(athletes.map(a => a.category))];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Athletes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Add', 'Add new athlete functionality')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Dashboard */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalAthletes}</Text>
            <Text style={styles.statLabel}>Total Athletes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeAthletes}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.verifiedAthletes}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.newThisMonth}</Text>
            <Text style={styles.statLabel}>New This Month</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, ID, sport, or location..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Sport:</Text>
          <FilterButton value="all" label="All" count={athletes.length} selectedValue={selectedSport} onPress={setSelectedSport} />
          {sports.map(sport => (
            <FilterButton 
              key={sport} 
              value={sport} 
              label={sport} 
              count={athletes.filter(a => a.sport === sport).length}
              selectedValue={selectedSport} 
              onPress={setSelectedSport} 
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Status:</Text>
          <FilterButton value="all" label="All" count={athletes.length} selectedValue={selectedStatus} onPress={setSelectedStatus} />
          <FilterButton value="active" label="Active" count={stats.activeAthletes} selectedValue={selectedStatus} onPress={setSelectedStatus} />
          <FilterButton value="verified" label="Verified" count={stats.verifiedAthletes} selectedValue={selectedStatus} onPress={setSelectedStatus} />
          <FilterButton value="unverified" label="Unverified" count={athletes.filter(a => !a.isVerified).length} selectedValue={selectedStatus} onPress={setSelectedStatus} />
        </View>
      </ScrollView>

      {/* Athletes List */}
      <FlatList
        data={filteredAthletes}
        renderItem={renderAthleteCard}
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

      {renderDetailModal()}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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
  athleteBasicInfo: {
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
    marginBottom: 2,
  },
  athleteEmail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusIndicators: {
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  athleteDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  avgScore: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  verifyBtn: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activateBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
  },
  deactivateBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EF4444',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailGrid: {
    gap: 12,
  },
  detailItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  achievementItem: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#3B82F6',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
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

export default ManageAthletes;