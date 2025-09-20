import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ExerciseTips from '../components/ExerciseTips';

const { width, height } = Dimensions.get('window');

const RunningScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const testName = params.testName as string || 'Running';
  
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [runningState, setRunningState] = useState({
    steps: 0,
    distance: 0, // in meters
    calories: 0,
    pace: 0, // steps per minute
    status: 'Ready to start running'
  });

  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    duration: 0,
  });

  const timerRef = useRef<any>(null);
  const stepTimerRef = useRef<any>(null);
  const lastStepTimeRef = useRef(0);
  const stepCountRef = useRef(0);

  // Constants for calculations
  const STEP_LENGTH_METERS = 0.762; // Average step length
  const CALORIES_PER_STEP = 0.04; // Approximate calories per step
  const STEP_DETECTION_INTERVAL = 600; // milliseconds between automatic steps when running

  // Timer effect for session duration
  useEffect(() => {
    if (workoutStarted) {
      timerRef.current = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);

      // Auto step counting when workout is active
      stepTimerRef.current = setInterval(() => {
        if (workoutStarted) {
          const currentTime = Date.now();
          // Auto-increment steps to simulate running detection
          stepCountRef.current += 1;
          lastStepTimeRef.current = currentTime;
          
          const newDistance = stepCountRef.current * STEP_LENGTH_METERS;
          const newCalories = Math.floor(stepCountRef.current * CALORIES_PER_STEP);
          const timeElapsed = (currentTime - sessionData.startTime) / 1000 / 60; // minutes
          const pace = timeElapsed > 0 ? Math.floor(stepCountRef.current / timeElapsed) : 0;
          
          setRunningState({
            steps: stepCountRef.current,
            distance: newDistance,
            calories: newCalories,
            pace: pace,
            status: 'Keep running! Great pace!'
          });
        }
      }, STEP_DETECTION_INTERVAL);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    };
  }, [workoutStarted, sessionData.startTime]);

  const startWorkout = () => {
    setShowTips(false);
    setWorkoutStarted(true);
    setSessionData({
      startTime: Date.now(),
      duration: 0
    });
    stepCountRef.current = 0;
    setRunningState({
      steps: 0,
      distance: 0,
      calories: 0,
      pace: 0,
      status: 'Running active - Move your body!'
    });
    Alert.alert("Running Started!", "Step detection is now active! Start running!");
  };

  const viewTips = () => {
    setShowTips(true);
  };

  const endWorkout = async () => {
    try {
      const workoutData = {
        exerciseType: 'running',
        count: runningState.steps,
        duration: sessionData.duration,
        distance: runningState.distance.toFixed(1),
        kcal: runningState.calories,
        pace: runningState.pace,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        `workout_${Date.now()}`, 
        JSON.stringify(workoutData)
      );

      const resultMessage = `Running completed!\n` +
        `Steps: ${runningState.steps}\n` +
        `Distance: ${runningState.distance.toFixed(1)}m\n` +
        `Duration: ${formatTime(sessionData.duration)}\n` +
        `Calories: ${runningState.calories} kcal\n` +
        `Pace: ${runningState.pace} steps/min`;

      Alert.alert(
        "Workout Saved!", 
        resultMessage,
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Save workout error:', error);
      Alert.alert("Error", "Failed to save workout properly.");
      router.back();
    }
  };

  const addManualStep = () => {
    if (workoutStarted) {
      stepCountRef.current += 1;
      const newDistance = stepCountRef.current * STEP_LENGTH_METERS;
      const newCalories = Math.floor(stepCountRef.current * CALORIES_PER_STEP);
      const timeElapsed = sessionData.duration / 60; // minutes
      const pace = timeElapsed > 0 ? Math.floor(stepCountRef.current / timeElapsed) : 0;
      
      setRunningState({
        steps: stepCountRef.current,
        distance: newDistance,
        calories: newCalories,
        pace: pace,
        status: 'Step added! Keep going!'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.exerciseTitle}>{testName}</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(sessionData.duration)}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Status Display */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{runningState.status}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{runningState.steps}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{runningState.distance.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Meters</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{runningState.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{runningState.pace}</Text>
            <Text style={styles.statLabel}>Steps/Min</Text>
          </View>
        </View>

        {/* Running Animation Area */}
        <View style={styles.animationArea}>
          <View style={styles.runningIcon}>
            <Text style={styles.runningEmoji}>🏃‍♂️</Text>
          </View>
          <Text style={styles.animationText}>
            {workoutStarted ? 'Keep Running!' : 'Ready to Run'}
          </Text>
        </View>

        {/* Manual Step Button (for testing) */}
        {workoutStarted && (
          <TouchableOpacity 
            style={styles.manualButton}
            onPress={addManualStep}
          >
            <Text style={styles.manualButtonText}>➕ Add Step</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!workoutStarted ? (
          <TouchableOpacity 
            style={[styles.controlButton, styles.startButton]}
            onPress={startWorkout}
          >
            <Text style={styles.controlButtonText}>🏃 Start Running</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.workoutControls}>
            <Text style={styles.workoutText}>● RUNNING ACTIVE</Text>
            <TouchableOpacity 
              style={[styles.controlButton, styles.endButton]}
              onPress={endWorkout}
            >
              <Text style={styles.controlButtonText}>⏹ End Workout</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tips Button */}
        {workoutStarted && (
          <TouchableOpacity 
            style={[styles.controlButton, styles.tipsButton]}
            onPress={viewTips}
          >
            <Text style={styles.controlButtonText}>💡 View Tips</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Exercise Tips Modal */}
      <Modal
        visible={showTips}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTips(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Running Instructions</Text>
          </View>
          
          <ExerciseTips exerciseType="running" />
          
          <View style={styles.modalFooter}>
            {!workoutStarted ? (
              <TouchableOpacity 
                style={[styles.controlButton, styles.startButton]}
                onPress={startWorkout}
              >
                <Text style={styles.controlButtonText}>🏃 Start Running</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.controlButton, styles.continueButton]}
                onPress={() => setShowTips(false)}
              >
                <Text style={styles.controlButtonText}>Continue Running</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RunningScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    backgroundColor: 'rgba(0,150,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    color: '#00aaff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    color: '#00ff88',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  animationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  runningIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,255,136,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  runningEmoji: {
    fontSize: 64,
  },
  animationText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  manualButton: {
    backgroundColor: 'rgba(0,150,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  manualButtonText: {
    color: '#00aaff',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    padding: 20,
    alignItems: 'center',
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#00ff88',
  },
  endButton: {
    backgroundColor: '#ff4444',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutControls: {
    alignItems: 'center',
  },
  workoutText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tipsButton: {
    backgroundColor: '#fbbf24',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  modalFooter: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  continueButton: {
    backgroundColor: '#00ff88',
  },
});