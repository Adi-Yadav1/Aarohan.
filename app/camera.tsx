import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNMediapipe } from '@thinksys/react-native-mediapipe';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

interface Keypoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface ExerciseState {
  count: number;
  status: string;
  angle: number;
  confidence: number;
  peakHeight: number;
  startHeight: number;
}

// Exercise Logic Hook
const useExerciseLogic = (exerciseType: string, setExerciseState: (state: ExerciseState) => void) => {
  const [squatState, setSquatState] = useState('standing');
  const [pushupState, setPushupState] = useState('up');
  const [situpState, setSitupState] = useState('down');
  const [jumpState, setJumpState] = useState('grounded');

  const stateRef = useRef({ 
    count: 0, 
    status: 'Ready', 
    angle: 0, 
    confidence: 0, 
    peakHeight: 0, 
    startHeight: 0,
    lastStepTime: 0
  });

  const updateState = (newState: Partial<ExerciseState>) => {
    stateRef.current = { ...stateRef.current, ...newState };
    setExerciseState(stateRef.current as ExerciseState);
  };

  const MIN_CONFIDENCE = 0.5;

  const calculateAngle = (p1: Keypoint, p2: Keypoint, p3: Keypoint): number => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  };

  const indices = {
    nose: 0, leftEye: 1, rightEye: 2, leftEar: 3, rightEar: 4,
    leftShoulder: 11, rightShoulder: 12, leftElbow: 13, rightElbow: 14,
    leftWrist: 15, rightWrist: 16, leftHip: 23, rightHip: 24,
    leftKnee: 25, rightKnee: 26, leftAnkle: 27, rightAnkle: 28,
    leftHeel: 29, rightHeel: 30, leftFootIndex: 31, rightFootIndex: 32
  };

  const getKeypoints = useCallback((landmarks: any[]) => {
    const keypoints: any = {};
    for (const [key, index] of Object.entries(indices)) {
      if (landmarks[index] && landmarks[index].visibility > MIN_CONFIDENCE) {
        keypoints[key] = {
          x: landmarks[index].x,
          y: landmarks[index].y,
          z: landmarks[index].z,
          visibility: landmarks[index].visibility,
        };
      }
    }
    return keypoints;
  }, []);

  const runningLogic = (landmarks: any[]) => {
    const keypoints = getKeypoints(landmarks);
    if (!keypoints.leftAnkle || !keypoints.rightAnkle || !keypoints.leftKnee || !keypoints.rightKnee) {
      updateState({ status: 'Position yourself properly for step detection', confidence: 0 });
      return;
    }

    const leftAnkleY = keypoints.leftAnkle.y;
    const rightAnkleY = keypoints.rightAnkle.y;
    const leftKneeY = keypoints.leftKnee.y;
    const rightKneeY = keypoints.rightKnee.y;
    
    const leftLegLift = Math.abs(leftKneeY - leftAnkleY);
    const rightLegLift = Math.abs(rightKneeY - rightAnkleY);
    const legMovementDiff = Math.abs(leftLegLift - rightLegLift);
    
    const confidence = (keypoints.leftAnkle.visibility + keypoints.rightAnkle.visibility + 
                       keypoints.leftKnee.visibility + keypoints.rightKnee.visibility) / 4;

    updateState({ 
      confidence: confidence,
      status: 'Running - Keep moving!',
      angle: legMovementDiff * 100
    });

    if (legMovementDiff > 0.08 && confidence > 0.7) {
      const currentTime = Date.now();
      if (!stateRef.current.lastStepTime || currentTime - stateRef.current.lastStepTime > 300) {
        stateRef.current.count++;
        stateRef.current.lastStepTime = currentTime;
        updateState({ 
          count: stateRef.current.count, 
          status: `Steps: ${stateRef.current.count}` 
        });
      }
    }
  };

  const flexibilityLogic = (landmarks: any[]) => {
    const keypoints = getKeypoints(landmarks);
    if (!keypoints.leftWrist || !keypoints.rightWrist || !keypoints.leftAnkle || !keypoints.rightAnkle) {
      updateState({ status: 'Stand straight, hands visible', confidence: 0 });
      return;
    }

    const leftHandToFoot = Math.sqrt(
      Math.pow(keypoints.leftWrist.x - keypoints.leftAnkle.x, 2) + 
      Math.pow(keypoints.leftWrist.y - keypoints.leftAnkle.y, 2)
    );
    
    const rightHandToFoot = Math.sqrt(
      Math.pow(keypoints.rightWrist.x - keypoints.rightAnkle.x, 2) + 
      Math.pow(keypoints.rightWrist.y - keypoints.rightAnkle.y, 2)
    );

    const avgDistance = (leftHandToFoot + rightHandToFoot) / 2;
    const confidence = (keypoints.leftWrist.visibility + keypoints.rightWrist.visibility + 
                       keypoints.leftAnkle.visibility + keypoints.rightAnkle.visibility) / 4;

    const EXCELLENT_THRESHOLD = 0.15;
    const GOOD_THRESHOLD = 0.25;
    const FAIR_THRESHOLD = 0.35;

    let flexibilityStatus = '';
    let rating = 0;

    if (avgDistance < EXCELLENT_THRESHOLD) {
      flexibilityStatus = 'EXCELLENT! Perfect toe touch!';
      rating = 5;
      stateRef.current.count = 5;
    } else if (avgDistance < GOOD_THRESHOLD) {
      flexibilityStatus = 'GOOD flexibility';
      rating = 4;
      stateRef.current.count = 4;
    } else if (avgDistance < FAIR_THRESHOLD) {
      flexibilityStatus = 'FAIR - Keep stretching!';
      rating = 3;
      stateRef.current.count = 3;
    } else {
      flexibilityStatus = 'Keep trying to reach your toes';
      rating = avgDistance < 0.5 ? 2 : 1;
      stateRef.current.count = rating;
    }

    updateState({ 
      confidence: confidence,
      status: flexibilityStatus,
      angle: avgDistance * 100,
      count: stateRef.current.count
    });
  };

  const squatLogic = (landmarks: any[]) => {
    const keypoints = getKeypoints(landmarks);
    if (!keypoints.leftKnee || !keypoints.rightKnee || !keypoints.leftHip || !keypoints.rightHip || !keypoints.leftAnkle || !keypoints.rightAnkle) {
      updateState({ status: 'Position yourself properly for squat detection', confidence: 0 });
      return;
    }

    const leftKneeAngle = calculateAngle(keypoints.leftHip, keypoints.leftKnee, keypoints.leftAnkle);
    const rightKneeAngle = calculateAngle(keypoints.rightHip, keypoints.rightKnee, keypoints.rightAnkle);
    const avgAngle = (leftKneeAngle + rightKneeAngle) / 2;
    const avgConfidence = (keypoints.leftKnee.visibility + keypoints.rightKnee.visibility) / 2;

    updateState({ angle: avgAngle, confidence: avgConfidence });

    const SQUAT_THRESHOLD = 90;
    const STANDING_THRESHOLD = 160;

    switch (squatState) {
      case 'standing':
        if (avgAngle < SQUAT_THRESHOLD) {
          setSquatState('squatting');
          updateState({ status: 'Going down...' });
        }
        break;
      case 'squatting':
        if (avgAngle > STANDING_THRESHOLD) {
          stateRef.current.count++;
          setSquatState('standing');
          updateState({ status: 'Squat completed!', count: stateRef.current.count });
        }
        break;
    }
  };

  const pushupLogic = (landmarks: any[]) => {
    const keypoints = getKeypoints(landmarks);
    if (!keypoints.leftShoulder || !keypoints.rightShoulder || !keypoints.leftElbow || !keypoints.rightElbow || !keypoints.leftWrist || !keypoints.rightWrist) {
      updateState({ status: 'Position yourself properly for pushup detection', confidence: 0 });
      return;
    }

    const leftElbowAngle = calculateAngle(keypoints.leftShoulder, keypoints.leftElbow, keypoints.leftWrist);
    const rightElbowAngle = calculateAngle(keypoints.rightShoulder, keypoints.rightElbow, keypoints.rightWrist);
    const avgAngle = (leftElbowAngle + rightElbowAngle) / 2;
    const avgConfidence = (keypoints.leftElbow.visibility + keypoints.rightElbow.visibility) / 2;

    updateState({ angle: avgAngle, confidence: avgConfidence });

    const PUSHUP_THRESHOLD = 90;
    const UP_THRESHOLD = 160;

    switch (pushupState) {
      case 'up':
        if (avgAngle < PUSHUP_THRESHOLD) {
          setPushupState('down');
          updateState({ status: 'Going down...' });
        }
        break;
      case 'down':
        if (avgAngle > UP_THRESHOLD) {
          stateRef.current.count++;
          setPushupState('up');
          updateState({ status: 'Push-up completed!', count: stateRef.current.count });
        }
        break;
    }
  };

  const situpLogic = (landmarks: any[]) => {
    const keypoints = getKeypoints(landmarks);
    if (!keypoints.nose || !keypoints.leftHip || !keypoints.rightHip) {
      updateState({ status: 'Lie down for sit-up detection', confidence: 0 });
      return;
    }

    const noseY = keypoints.nose.y;
    const hipY = (keypoints.leftHip.y + keypoints.rightHip.y) / 2;
    const verticalDisplacement = hipY - noseY;
    const confidence = (keypoints.nose.visibility + keypoints.leftHip.visibility + keypoints.rightHip.visibility) / 3;

    updateState({ angle: verticalDisplacement * 100, confidence, status: 'Doing sit-ups' });

    const UP_THRESHOLD = 0.2;
    const DOWN_THRESHOLD = 0.5;

    switch (situpState) {
      case 'down':
        if (verticalDisplacement < DOWN_THRESHOLD) {
          setSitupState('going_up');
          updateState({ status: 'Going up...' });
        }
        break;
      case 'going_up':
        if (verticalDisplacement < UP_THRESHOLD) {
          setSitupState('up');
          updateState({ status: 'Hold position' });
        } else if (verticalDisplacement > DOWN_THRESHOLD) {
          setSitupState('down');
          updateState({ status: 'Ready' });
        }
        break;
      case 'up':
        if (verticalDisplacement > UP_THRESHOLD) {
          setSitupState('going_down');
          updateState({ status: 'Coming down...' });
        }
        break;
      case 'going_down':
        if (verticalDisplacement > DOWN_THRESHOLD) {
          stateRef.current.count++;
          setSitupState('down');
          updateState({ status: 'Sit-up completed!', count: stateRef.current.count });
        }
        break;
    }
  };

  const verticalJumpLogic = (landmarks: any[]) => {
    const keypoints = getKeypoints(landmarks);
    if (!keypoints.leftHip || !keypoints.rightHip) {
      updateState({ status: 'Stand in view for jump detection', confidence: 0 });
      return;
    }

    const currentHipY = (keypoints.leftHip.y + keypoints.rightHip.y) / 2;
    const confidence = (keypoints.leftHip.visibility + keypoints.rightHip.visibility) / 2;

    if (stateRef.current.startHeight === 0) {
      stateRef.current.startHeight = currentHipY;
      updateState({ startHeight: currentHipY });
    }

    updateState({ confidence });

    switch (jumpState) {
      case 'grounded':
        if (currentHipY < stateRef.current.startHeight - 0.05) {
          setJumpState('jumping');
          updateState({ status: 'Jumping!' });
        }
        break;
      case 'jumping':
        const verticalDisplacement = stateRef.current.startHeight - currentHipY;
        if (verticalDisplacement > stateRef.current.peakHeight) {
          stateRef.current.peakHeight = verticalDisplacement * 100; // Convert to cm
          updateState({ peakHeight: stateRef.current.peakHeight });
        }
        if (currentHipY > stateRef.current.startHeight * 0.95) {
          stateRef.current.count++;
          setJumpState('grounded');
          updateState({ status: 'Jump landed!', count: stateRef.current.count });
        }
        break;
    }
  };

  const processPose = (landmarks: any[]) => {
    switch (exerciseType) {
      case 'running':
        runningLogic(landmarks);
        break;
      case 'flexibility':
        flexibilityLogic(landmarks);
        break;
      case 'squats':
        squatLogic(landmarks);
        break;
      case 'pushups':
        pushupLogic(landmarks);
        break;
      case 'situps':
        situpLogic(landmarks);
        break;
      case 'vertical_jump':
        verticalJumpLogic(landmarks);
        break;
      default:
        updateState({ status: 'Exercise type not supported yet' });
        break;
    }
  };

  return { processPose };
};

const CameraScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const exerciseType = params.exerciseType as string || 'running';
  const testName = params.testName as string || 'Exercise';
  
  // Redirect running exercises to the dedicated running screen
  useEffect(() => {
    if (exerciseType === 'running') {
      router.replace({
        pathname: '/running',
        params: { testName }
      });
      return;
    }
  }, [exerciseType, router, testName]);

  // Don't render camera interface for running
  if (exerciseType === 'running') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Redirecting to running tracker...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [exerciseState, setExerciseState] = useState<ExerciseState>({
    count: 0,
    status: 'Ready',
    angle: 0,
    confidence: 0,
    peakHeight: 0,
    startHeight: 0
  });

  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    duration: 0,
  });

  const timerRef = useRef<any>(null);

  const { processPose } = useExerciseLogic(exerciseType, setExerciseState);

  // Timer effect
  useEffect(() => {
    if (workoutStarted) {
      timerRef.current = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workoutStarted]);

  const startWorkout = () => {
    setShowTips(false);
    setWorkoutStarted(true);
    Alert.alert("Workout Started!", `${exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)} detection is now active!`);
  };

  const viewTips = () => {
    setShowTips(true);
  };

  const endWorkout = async () => {
    try {
      // Calculate additional metrics
      const distance = exerciseType === 'running' ? (exerciseState.count * 0.762).toFixed(1) : 0; // meters per step
      const kcal = exerciseType === 'running' ? Math.floor(exerciseState.count * 0.04) : Math.floor(sessionData.duration / 60 * 5); // rough calorie estimation
      const height = exerciseType === 'vertical_jump' ? exerciseState.peakHeight : 0;
      
      const workoutData = {
        exerciseType,
        count: exerciseState.count,
        duration: sessionData.duration,
        distance: distance,
        kcal: kcal,
        height: height,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        `workout_${Date.now()}`, 
        JSON.stringify(workoutData)
      );

      let resultMessage = `${exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)} completed!\n` +
        `Reps/Count: ${exerciseState.count}\n` +
        `Duration: ${formatTime(sessionData.duration)}\n` +
        `Calories: ${kcal} kcal`;

      if (exerciseType === 'running') {
        resultMessage += `\nDistance: ${distance}m`;
      }
      if (exerciseType === 'vertical_jump' && height > 0) {
        resultMessage += `\nJump Height: ${height.toFixed(1)}cm`;
      }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* MediaPipe Camera for pose detection */}
      <RNMediapipe
        style={styles.camera}
        onLandmark={(data) => {
          try {
            let parsedData;
            if (typeof data === 'string') {
              parsedData = JSON.parse(data);
            } else {
              parsedData = data;
            }
            
            if (parsedData && parsedData.landmarks && Array.isArray(parsedData.landmarks)) {
              if (parsedData.landmarks.length === 33) {
                if (workoutStarted) {
                  processPose(parsedData.landmarks);
                }
              } else if (parsedData.landmarks.length === 0) {
                setExerciseState(prev => ({ ...prev, status: 'No person detected', confidence: 0 }));
              }
            } else {
              setExerciseState(prev => ({ ...prev, status: 'No person detected', confidence: 0 }));
            }
          } catch (error) {
            console.error('Error parsing MediaPipe data:', error);
            setExerciseState(prev => ({ ...prev, status: 'Detection error', confidence: 0 }));
          }
        }}
      />
      
      {/* UI Overlay */}
      <View style={styles.overlayContainer}>
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

        {/* Exercise Info */}
        <View style={styles.feedbackOverlay}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.countText}>{exerciseState.count}</Text>
            <Text style={styles.exerciseTypeText}>{exerciseType.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{exerciseState.status}</Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { width: `${exerciseState.confidence * 100}%` }
                ]} 
              />
            </View>
          </View>

          {exerciseType === 'running' && (
            <View style={styles.runningStats}>
              <Text style={styles.statText}>Steps: {exerciseState.count}</Text>
              <Text style={styles.statText}>Distance: {(exerciseState.count * 0.762).toFixed(1)}m</Text>
              <Text style={styles.statText}>Time: {formatTime(sessionData.duration)}</Text>
            </View>
          )}

          {exerciseType === 'flexibility' && (
            <View style={styles.flexibilityStats}>
              <Text style={styles.statText}>Flexibility Rating: {exerciseState.count}/5</Text>
              <Text style={styles.flexibilityHint}>
                {exerciseState.count >= 5 ? 'Excellent!' : 
                 exerciseState.count >= 4 ? 'Good!' : 
                 exerciseState.count >= 3 ? 'Fair' : 'Keep trying!'}
              </Text>
            </View>
          )}

          {exerciseType === 'vertical_jump' && (
            <View style={styles.jumpStats}>
              <Text style={styles.statText}>Jumps: {exerciseState.count}</Text>
              <Text style={styles.statText}>Best Height: {exerciseState.peakHeight > 0 ? `${exerciseState.peakHeight.toFixed(1)}cm` : 'N/A'}</Text>
              <Text style={styles.statText}>Time: {formatTime(sessionData.duration)}</Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!workoutStarted ? (
            <TouchableOpacity 
              style={[styles.controlButton, styles.startButton]}
              onPress={startWorkout}
            >
              <Text style={styles.controlButtonText}>🏃 Start Workout</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.workoutControls}>
              <Text style={styles.workoutText}>● WORKOUT ACTIVE</Text>
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
            <Text style={styles.modalTitle}>Exercise Instructions</Text>
          </View>
          
          <ExerciseTips exerciseType={exerciseType} />
          
          <View style={styles.modalFooter}>
            {!workoutStarted ? (
              <TouchableOpacity 
                style={[styles.controlButton, styles.startButton]}
                onPress={startWorkout}
              >
                <Text style={styles.controlButtonText}>🏃 Start Workout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.controlButton, styles.continueButton]}
                onPress={() => setShowTips(false)}
              >
                <Text style={styles.controlButtonText}>Continue Workout</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  feedbackOverlay: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  exerciseInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countText: {
    color: '#00ff88',
    fontSize: 48,
    fontWeight: 'bold',
  },
  exerciseTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceBar: {
    width: 100,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 4,
  },
  runningStats: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  flexibilityStats: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  jumpStats: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  flexibilityHint: {
    color: '#00ff88',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
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
    backgroundColor: '#22c55e',
  },
  endButton: {
    backgroundColor: '#dc2626',
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
    color: '#22c55e',
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
    backgroundColor: '#22c55e',
  },
});
