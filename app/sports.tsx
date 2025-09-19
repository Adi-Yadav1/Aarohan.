import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

// Type definitions
interface Sport {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'racket' | 'combat' | 'strength' | 'team' | 'endurance' | 'water';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
}

interface SportsSelectionProps {
  onSportSelect?: (sport: Sport) => void;
}

const { width } = Dimensions.get('window');

const SportsSelection: React.FC<SportsSelectionProps> = ({ onSportSelect }) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const router = useRouter();

  // Sports data
  const sports: Sport[] = [
    {
      id: '1',
      name: 'Badminton',
      description: 'Fast-paced racket sport with shuttlecock',
      icon: '🏸',
      category: 'racket',
      difficulty: 'Beginner',
      equipment: 'Racket, Shuttlecock'
    },
    {
      id: '2',
      name: 'Boxing',
      description: 'Combat sport focusing on punching techniques',
      icon: '🥊',
      category: 'combat',
      difficulty: 'Intermediate',
      equipment: 'Gloves, Punching Bag'
    },
    {
      id: '3',
      name: 'Weight Lifting',
      description: 'Strength training with barbells and dumbbells',
      icon: '🏋️‍♂️',
      category: 'strength',
      difficulty: 'Intermediate',
      equipment: 'Weights, Barbell'
    },
    {
      id: '4',
      name: 'Basketball',
      description: 'Team sport with shooting and dribbling',
      icon: '🏀',
      category: 'team',
      difficulty: 'Beginner',
      equipment: 'Basketball, Hoop'
    },
    {
      id: '5',
      name: 'Soccer',
      description: 'World\'s most popular team sport',
      icon: '⚽',
      category: 'team',
      difficulty: 'Beginner',
      equipment: 'Soccer Ball, Goals'
    },
    {
      id: '6',
      name: 'Tennis',
      description: 'Classic racket sport played on court',
      icon: '🎾',
      category: 'racket',
      difficulty: 'Intermediate',
      equipment: 'Racket, Tennis Ball'
    },
    {
      id: '7',
      name: 'Swimming',
      description: 'Full-body water-based exercise',
      icon: '🏊‍♂️',
      category: 'water',
      difficulty: 'Beginner',
      equipment: 'Pool, Swimwear'
    },
    {
      id: '8',
      name: 'Cycling',
      description: 'Endurance sport on bicycle',
      icon: '🚴‍♂️',
      category: 'endurance',
      difficulty: 'Beginner',
      equipment: 'Bicycle, Helmet'
    },
    {
      id: '9',
      name: 'Martial Arts',
      description: 'Traditional combat and self-defense',
      icon: '🥋',
      category: 'combat',
      difficulty: 'Advanced',
      equipment: 'Uniform, Belt'
    },
    {
      id: '10',
      name: 'Table Tennis',
      description: 'Fast indoor racket sport',
      icon: '🏓',
      category: 'racket',
      difficulty: 'Beginner',
      equipment: 'Paddle, Ball, Table'
    },
    {
      id: '11',
      name: 'Running',
      description: 'Cardiovascular endurance activity',
      icon: '🏃‍♂️',
      category: 'endurance',
      difficulty: 'Beginner',
      equipment: 'Running Shoes'
    },
    {
      id: '12',
      name: 'Volleyball',
      description: 'Team sport with net and spiking',
      icon: '🏐',
      category: 'team',
      difficulty: 'Intermediate',
      equipment: 'Volleyball, Net'
    }
  ];

  const getCategoryColor = (category: Sport['category']) => {
    switch (category) {
      case 'racket':
        return '#6366F1';
      case 'combat':
        return '#EF4444';
      case 'strength':
        return '#F59E0B';
      case 'team':
        return '#10B981';
      case 'endurance':
        return '#8B5CF6';
      case 'water':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  const getDifficultyColor = (difficulty: Sport['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleStartTraining = () => {
    // Navigate to training or sport-specific page
    router.push('/training'); // Adjust route as needed
  };

  const handleSportPress = (sport: Sport) => {
    const isSelected = selectedSports.includes(sport.id);
    
    if (isSelected) {
      setSelectedSports(prev => prev.filter(id => id !== sport.id));
    } else {
      setSelectedSports(prev => [...prev, sport.id]);
    }
    
    onSportSelect?.(sport);
  };

  const renderSportCard = (sport: Sport) => {
    const isSelected = selectedSports.includes(sport.id);
    const categoryColor = getCategoryColor(sport.category);
    const difficultyColor = getDifficultyColor(sport.difficulty);

    return (
      <TouchableOpacity
        key={sport.id}
        style={[
          styles.sportCard,
          isSelected && { ...styles.selectedCard, borderColor: categoryColor }
        ]}
        onPress={() => handleSportPress(sport)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <Text style={styles.iconText}>{sport.icon}</Text>
          </View>
          <View style={styles.sportInfo}>
            <Text style={styles.sportName}>{sport.name}</Text>
            <Text style={styles.sportDescription}>{sport.description}</Text>
            <Text style={styles.equipment}>Equipment: {sport.equipment}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.badgeContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>
                {sport.category.charAt(0).toUpperCase() + sport.category.slice(1)}
              </Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyText}>{sport.difficulty}</Text>
            </View>
          </View>
        </View>

        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: categoryColor }]}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sports Selection</Text>
        <Text style={styles.subtitle}>
          Choose the sports you want to practice and improve
        </Text>
        {selectedSports.length > 0 && (
          <Text style={styles.selectedCount}>
            {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
          </Text>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sports.map(renderSportCard)}
      </ScrollView>

      {selectedSports.length > 0 && (
        <TouchableOpacity 
          style={styles.startButton} 
          activeOpacity={0.8} 
          onPress={handleStartTraining}
        >
          <Text style={styles.startButtonText}>
            Start Training ({selectedSports.length})
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 10,
  },
  selectedCount: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    backgroundColor: '#FEFEFE',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  sportInfo: {
    flex: 1,
  },
  sportName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sportDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 6,
  },
  equipment: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SportsSelection;