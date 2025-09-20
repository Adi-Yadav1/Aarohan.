import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Type definitions
interface Test {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'measurement' | 'strength' | 'agility' | 'endurance';
  estimatedTime: string;
}

interface TestSelectionProps {
  onTestSelect?: (test: Test) => void;
}

const { width } = Dimensions.get('window');

import { useRouter } from 'expo-router';

const TestSelection: React.FC<TestSelectionProps> = ({ onTestSelect }) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const router = useRouter();

  // Test data with AI-powered exercises
  const tests: Test[] = [
    {
      id: '1',
      name: 'Squats',
      description: 'AI-powered squat rep counting with form analysis',
      icon: '🏋️‍♂️',
      category: 'strength',
      estimatedTime: '5 min',
    },
    {
      id: '2',
      name: 'Push-ups',
      description: 'Automated push-up counter with pose detection',
      icon: '💪',
      category: 'strength',
      estimatedTime: '5 min',
    },
    {
      id: '3',
      name: 'Running',
      description: 'Track steps, distance, and time with phone sensors',
      icon: '🏃‍♂️',
      category: 'endurance',
      estimatedTime: '15 min',
    },
    {
      id: '4',
      name: 'Flexibility',
      description: 'Touch toe test with flexibility rating',
      icon: '�‍♀️',
      category: 'agility',
      estimatedTime: '3 min',
    },
    {
      id: '5',
      name: 'Sit-ups',
      description: 'Core strength with automated rep counting',
      icon: '🏃‍♀️',
      category: 'strength',
      estimatedTime: '5 min',
    },
    {
      id: '6',
      name: 'Vertical Jump',
      description: 'Measure jump height with AI motion tracking',
      icon: '🦘',
      category: 'agility',
      estimatedTime: '3 min',
    },

  ];

  const getCategoryColor = (category: Test['category']) => {
    switch (category) {
      case 'measurement':
        return '#6366F1';
      case 'strength':
        return '#EF4444';
      case 'agility':
        return '#F59E0B';
      case 'endurance':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };
  
  const handletest = () => {
    if (selectedTests.length > 0) {
      const selectedTest = tests.find(test => selectedTests[0] === test.id);
      const exerciseType = getExerciseType(selectedTest?.name || '');
      router.push({
        pathname: '/camera',
        params: {
          exerciseType: exerciseType,
          testName: selectedTest?.name || 'Exercise',
          testId: selectedTest?.id || '1'
        }
      });
    }
  };

  const getExerciseType = (testName: string): string => {
    switch (testName.toLowerCase()) {
      case 'squats': return 'squats';
      case 'push-ups': return 'pushups';
      case 'running': return 'running';
      case 'flexibility': return 'flexibility';
      case 'sit-ups': return 'situps';
      case 'vertical jump': return 'vertical_jump';
      default: return 'squats';
    }
  };
  const handleTestPress = (test: Test) => {
    const isSelected = selectedTests.includes(test.id);
    
    if (isSelected) {
      setSelectedTests(prev => prev.filter(id => id !== test.id));
    } else {
      setSelectedTests(prev => [...prev, test.id]);
    }
    
    onTestSelect?.(test);
  };

  const renderTestCard = (test: Test) => {
    const isSelected = selectedTests.includes(test.id);
    const categoryColor = getCategoryColor(test.category);

    return (
      <TouchableOpacity
        key={test.id}
        style={[
          styles.testCard,
          isSelected && { ...styles.selectedCard, borderColor: categoryColor }
        ]}
        onPress={() => handleTestPress(test)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <Text style={styles.iconText}>{test.icon}</Text>
          </View>
          <View style={styles.testInfo}>
            <Text style={styles.testName}>{test.name}</Text>
            <Text style={styles.testDescription}>{test.description}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>
              {test.category.charAt(0).toUpperCase() + test.category.slice(1)}
            </Text>
          </View>
          <Text style={styles.timeEstimate}>{test.estimatedTime}</Text>
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
        <Text style={styles.title}>Test Selection</Text>
        <Text style={styles.subtitle}>
          Choose the fitness tests you want to complete
        </Text>
        {selectedTests.length > 0 && (
          <Text style={styles.selectedCount}>
            {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
          </Text>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tests.map(renderTestCard)}
      </ScrollView>

      {selectedTests.length > 0 && (
        <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={handletest}>
          <Text style={styles.startButtonText}>
            Start Selected Tests ({selectedTests.length})
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
  testCard: {
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
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  timeEstimate: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
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

export default TestSelection;
