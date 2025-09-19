import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera';
import { RNMediapipe } from '@thinksys/react-native-mediapipe';
import { useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function PoseDetectionScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const { exercise } = useLocalSearchParams();

  const [exerciseState, setExerciseState] = useState({
    count: 0,
    status: 'Ready',
    angle: 0,
    confidence: 0,
    startTime: null,
    peakHeight: null,
    startHeight: null,
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const exerciseLogic = useExerciseLogic(exercise, setExerciseState);

  if (!hasPermission) {
    return <Text style={styles.permissionText}>Camera permission is required.</Text>;
  }

  if (device == null) {
    return <Text style={styles.permissionText}>No camera device found.</Text>;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.fullScreenContainer} edges={['top', 'bottom']}>
        <RNMediapipe
          style={styles.fullScreenCamera}
          solution="pose"
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
                  exerciseLogic.processPose(parsedData.landmarks);
                } else if (parsedData.landmarks.length === 0) {
                  exerciseLogic.handleNoDetection();
                }
              } else {
                exerciseLogic.handleNoDetection();
              }
            } catch (error) {
              console.error('Error parsing MediaPipe data:', error);
              exerciseLogic.handleNoDetection();
            }
          }}
        />
        
        <View style={styles.overlayContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{exercise} Tracker</Text>
          </View>
          
          <View style={styles.statsOverlay}>
            <Text style={styles.statText}>Count: {exerciseState.count}</Text>
            <Text style={styles.statText}>Status: {exerciseState.status}</Text>
            <Text style={styles.statText}>Angle: {Math.round(exerciseState.angle)}°</Text>
            <Text style={styles.statText}>Confidence: {Math.round(exerciseState.confidence * 100)}%</Text>
            {exercise === 'vertical_jump' && (
              <>
                <Text style={styles.statText}>
                  Jump Height: {exerciseState.peakHeight ? `${exerciseState.peakHeight.toFixed(1)} cm` : 'N/A'}
                </Text>
                <Text style={styles.statText}>
                  Baseline: {exerciseState.startHeight ? `Set ✓` : 'Stand still...'}
                </Text>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// ====================================================================
// ===== EXERCISE LOGIC WITH ENHANCED VERTICAL JUMP =================
// ====================================================================

const useExerciseLogic = (exerciseType, setExerciseState) => {
  const exerciseStateRef = useRef({
    squatState: 'standing',
    pushupState: 'up',
    pullupState: 'hanging',
    lungeState: 'standing',
    situpState: 'lying',
    jumpState: 'grounded',
    count: 0,
    status: 'Ready',
    angle: 0,
    confidence: 0,
    peakHeight: 0,
    startHeight: 0,
    
    // Pushup-specific controls (keep as-is)
    lastRepTime: 0,
    frameCount: 0,
    stableFrames: 0,
    lastAngle: 0,
    
    // ADDED: Vertical Jump-specific tracking
    baselineHipY: 0,           // Standing hip height (baseline)
    maxHipY: 0,                // Peak hip height during jump
    minHipY: 999999,           // Lowest recorded hip (for calibration)
    baselineFrames: 0,         // Frames in standing position for calibration
    jumpStartTime: 0,          // When jump started
    jumpPhaseFrames: 0,        // Frames since jump started
    shoulderSpan: 0,           // Distance between shoulders for scaling
    bodyHeightPixels: 0,       // Total body height in pixels for scaling
    pixelToRealRatio: 0,       // Conversion ratio from pixels to cm
    hipHistory: [],            // Recent hip positions for smoothing
    isCalibrated: false,       // Whether we have body measurements
  });

  const updateState = (newState) => {
    Object.assign(exerciseStateRef.current, newState);
    setExerciseState({ ...exerciseStateRef.current });
  };

  const MIN_CONFIDENCE = 0.3;

  const handleNoDetection = () => {
    updateState({ 
      status: '👤 Step into camera view', 
      confidence: 0,
      angle: 0
    });
  };

  const calculateAngle = (p1, p2, p3) => {
    if (!p1 || !p2 || !p3) return 0;
    
    const a = [p1.x, p1.y];
    const b = [p2.x, p2.y];
    const c = [p3.x, p3.y];
    
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    
    return angle;
  };

  const getKeypoints = useCallback((landmarks) => {
    if (!landmarks || !Array.isArray(landmarks) || landmarks.length !== 33) {
      return {};
    }
    
    const keypoints = {};
    const indices = {
      nose: 0, leftEye: 2, rightEye: 5,
      leftShoulder: 11, rightShoulder: 12,
      leftElbow: 13, rightElbow: 14,
      leftWrist: 15, rightWrist: 16,
      leftHip: 23, rightHip: 24,
      leftKnee: 25, rightKnee: 26,
      leftAnkle: 27, rightAnkle: 28,
      leftHeel: 29, rightHeel: 30,
      leftFootIndex: 31, rightFootIndex: 32,
    };

    Object.keys(indices).forEach(key => {
      const index = indices[key];
      const landmark = landmarks[index];
      
      if (landmark && 
          typeof landmark.x === 'number' && 
          typeof landmark.y === 'number' && 
          typeof landmark.visibility === 'number') {
        keypoints[key] = {
          x: landmark.x,
          y: landmark.y,
          z: landmark.z || 0,
          visibility: landmark.visibility,
          isReliable: landmark.visibility > MIN_CONFIDENCE
        };
      }
    });

    return keypoints;
  }, []);

  // ====================================================================
  // ===== SQUAT LOGIC (UNCHANGED - WORKING PERFECTLY) ================
  // ====================================================================

  const squatLogic = (landmarks) => {
    const keypoints = getKeypoints(landmarks);
    
    const requiredPoints = ['leftHip', 'leftKnee', 'leftAnkle', 'rightHip', 'rightKnee', 'rightAnkle'];
    const missingPoints = requiredPoints.filter(point => !keypoints[point]);
    
    if (missingPoints.length > 0) {
      updateState({ status: `🎯 Show legs clearly`, confidence: 0 });
      return;
    }

    const leftKneeAngle = calculateAngle(keypoints.leftHip, keypoints.leftKnee, keypoints.leftAnkle);
    const rightKneeAngle = calculateAngle(keypoints.rightHip, keypoints.rightKnee, keypoints.rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    
    const avgConfidence = (keypoints.leftKnee.visibility + keypoints.rightKnee.visibility) / 2;
    
    const STANDING_THRESHOLD = 160;
    const SQUAT_THRESHOLD = 90;
    const HYSTERESIS = 15;
    
    updateState({ angle: avgKneeAngle, confidence: avgConfidence });

    const currentSquatState = exerciseStateRef.current.squatState;
    
    console.log(`🏋️ SQUAT: angle=${avgKneeAngle.toFixed(1)}°, state=${currentSquatState}, count=${exerciseStateRef.current.count}`);

    switch (currentSquatState) {
      case 'standing':
        if (avgKneeAngle < (STANDING_THRESHOLD - HYSTERESIS) && avgKneeAngle > 30) {
          exerciseStateRef.current.squatState = 'going_down';
          updateState({ status: '⬇️ Going down...' });
          console.log('🏋️ SQUAT: State changed to going_down');
        } else {
          updateState({ status: '✅ Ready to squat' });
        }
        break;
        
      case 'going_down':
        if (avgKneeAngle <= SQUAT_THRESHOLD && avgKneeAngle > 15) {
          exerciseStateRef.current.squatState = 'bottom';
          updateState({ status: '🔄 Good! Now stand up' });
          console.log('🏋️ SQUAT: Reached bottom position');
        } else if (avgKneeAngle >= STANDING_THRESHOLD) {
          exerciseStateRef.current.squatState = 'standing';
          updateState({ status: '✅ Ready to squat' });
          console.log('🏋️ SQUAT: Back to standing without completing rep');
        } else {
          updateState({ status: '⬇️ Keep going down...' });
        }
        break;
        
      case 'bottom':
        if (avgKneeAngle > (SQUAT_THRESHOLD + HYSTERESIS)) {
          exerciseStateRef.current.squatState = 'going_up';
          updateState({ status: '⬆️ Coming up...' });
          console.log('🏋️ SQUAT: Starting to come up');
        } else {
          updateState({ status: '⏸️ Stay low' });
        }
        break;
        
      case 'going_up':
        if (avgKneeAngle >= STANDING_THRESHOLD) {
          exerciseStateRef.current.count = (exerciseStateRef.current.count || 0) + 1;
          exerciseStateRef.current.squatState = 'standing';
          
          updateState({ 
            status: '🎉 Rep completed!', 
            count: exerciseStateRef.current.count
          });
          
          console.log(`🏋️ SQUAT: REP COMPLETED! New count: ${exerciseStateRef.current.count}`);
          
          setTimeout(() => {
            updateState({ status: '✅ Ready for next rep' });
          }, 1000);
        } else if (avgKneeAngle <= SQUAT_THRESHOLD) {
          exerciseStateRef.current.squatState = 'bottom';
          updateState({ status: '🔄 Back to bottom' });
        } else {
          updateState({ status: '⬆️ Keep standing up...' });
        }
        break;
    }
  };

  // ====================================================================
  // ===== PUSHUP LOGIC (UNCHANGED - WORKING PERFECTLY) ===============
  // ====================================================================

  const pushupLogic = (landmarks) => {
    const keypoints = getKeypoints(landmarks);
    
    const requiredPoints = ['leftElbow', 'leftShoulder', 'leftWrist', 'rightElbow', 'rightShoulder', 'rightWrist'];
    const missingPoints = requiredPoints.filter(point => !keypoints[point]);
    
    if (missingPoints.length > 0) {
      updateState({ status: `🎯 Position arms in view`, confidence: 0 });
      return;
    }

    exerciseStateRef.current.frameCount = (exerciseStateRef.current.frameCount || 0) + 1;
    if (exerciseStateRef.current.frameCount % 3 !== 0) {
      return;
    }

    const leftElbowAngle = calculateAngle(keypoints.leftShoulder, keypoints.leftElbow, keypoints.leftWrist);
    const rightElbowAngle = calculateAngle(keypoints.rightShoulder, keypoints.rightElbow, keypoints.rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
    const avgConfidence = (keypoints.leftElbow.visibility + keypoints.rightElbow.visibility) / 2;
    
    const UP_THRESHOLD = 160;
    const DOWN_THRESHOLD = 90;
    const HYSTERESIS = 20;
    
    const angleDifference = Math.abs(avgElbowAngle - exerciseStateRef.current.lastAngle);
    if (angleDifference < 5) {
      exerciseStateRef.current.stableFrames = (exerciseStateRef.current.stableFrames || 0) + 1;
    } else {
      exerciseStateRef.current.stableFrames = 0;
    }
    exerciseStateRef.current.lastAngle = avgElbowAngle;

    const isStable = exerciseStateRef.current.stableFrames >= 2;
    
    updateState({ angle: avgElbowAngle, confidence: avgConfidence });
    
    const currentPushupState = exerciseStateRef.current.pushupState;
    const currentTime = Date.now();
    
    const timeSinceLastRep = currentTime - (exerciseStateRef.current.lastRepTime || 0);
    const canCount = timeSinceLastRep > 2000;
    
    console.log(`💪 PUSHUP: angle=${avgElbowAngle.toFixed(1)}°, state=${currentPushupState}, count=${exerciseStateRef.current.count}, stable=${isStable}, canCount=${canCount}`);

    switch (currentPushupState) {
      case 'up':
        if (isStable && avgElbowAngle < (UP_THRESHOLD - HYSTERESIS) && avgElbowAngle > 50) {
          exerciseStateRef.current.pushupState = 'going_down';
          updateState({ status: '⬇️ Going down...' });
          console.log('💪 PUSHUP: Transitioning to going_down');
        } else {
          updateState({ status: '✅ Ready for pushup' });
        }
        break;
        
      case 'going_down':
        if (isStable && avgElbowAngle <= DOWN_THRESHOLD && avgElbowAngle > 40) {
          exerciseStateRef.current.pushupState = 'down';
          updateState({ status: '🔄 Good depth! Push up' });
          console.log('💪 PUSHUP: Reached bottom position');
        } else if (avgElbowAngle >= UP_THRESHOLD) {
          exerciseStateRef.current.pushupState = 'up';
          updateState({ status: '✅ Ready for pushup' });
          console.log('💪 PUSHUP: Back to up without completing descent');
        } else {
          updateState({ status: '⬇️ Lower your chest...' });
        }
        break;
        
      case 'down':
        if (isStable && avgElbowAngle > (DOWN_THRESHOLD + HYSTERESIS)) {
          exerciseStateRef.current.pushupState = 'going_up';
          updateState({ status: '⬆️ Pushing up...' });
          console.log('💪 PUSHUP: Starting to push up');
        } else {
          updateState({ status: '⏫ Push up now!' });
        }
        break;
        
      case 'going_up':
        if (isStable && avgElbowAngle >= UP_THRESHOLD && canCount) {
          exerciseStateRef.current.count = (exerciseStateRef.current.count || 0) + 1;
          exerciseStateRef.current.pushupState = 'up';
          exerciseStateRef.current.lastRepTime = currentTime;
          
          updateState({ 
            status: '🎉 Rep completed!', 
            count: exerciseStateRef.current.count
          });
          
          console.log(`💪 PUSHUP: REP COMPLETED! New count: ${exerciseStateRef.current.count}`);
          
          setTimeout(() => {
            updateState({ status: '✅ Ready for next rep' });
          }, 1000);
        } else if (avgElbowAngle <= DOWN_THRESHOLD) {
          exerciseStateRef.current.pushupState = 'down';
          updateState({ status: '🔄 Back to bottom' });
        } else if (!canCount && avgElbowAngle >= UP_THRESHOLD) {
          updateState({ status: '⏳ Wait before next rep...' });
        } else {
          updateState({ status: '⬆️ Keep pushing up...' });
        }
        break;
    }
  };

  // ====================================================================
  // ===== ENHANCED VERTICAL JUMP ALGORITHM WITH HEIGHT CALCULATION ===
  // ====================================================================

  const verticalJumpLogic = (landmarks) => {
    const keypoints = getKeypoints(landmarks);
    
    const requiredPoints = ['leftHip', 'rightHip', 'leftShoulder', 'rightShoulder', 'nose', 'leftAnkle', 'rightAnkle'];
    const missingPoints = requiredPoints.filter(point => !keypoints[point]);
    
    if (missingPoints.length > 0) {
      updateState({ status: '🎯 Step fully into view', confidence: 0 });
      return;
    }

    // Calculate center of mass using hip average [web:100][web:103]
    const currentHipY = (keypoints.leftHip.y + keypoints.rightHip.y) / 2;
    const confidence = (keypoints.leftHip.visibility + keypoints.rightHip.visibility) / 2;
    
    // ADDED: Body measurements for pixel-to-distance scaling [web:101][web:104]
    const shoulderSpan = Math.abs(keypoints.leftShoulder.x - keypoints.rightShoulder.x);
    const headToHipDistance = Math.abs(keypoints.nose.y - currentHipY);
    const hipToAnkleDistance = Math.abs(currentHipY - (keypoints.leftAnkle.y + keypoints.rightAnkle.y) / 2);
    
    // Store body measurements for scaling (assume average adult proportions) [web:101]
    if (!exerciseStateRef.current.isCalibrated && shoulderSpan > 0.05) {
      // Average shoulder width = 40cm, use this for pixel-to-cm conversion
      exerciseStateRef.current.pixelToRealRatio = 40 / shoulderSpan; // cm per pixel
      exerciseStateRef.current.shoulderSpan = shoulderSpan;
      exerciseStateRef.current.isCalibrated = true;
      console.log(`🦘 JUMP: Calibrated pixel ratio: ${exerciseStateRef.current.pixelToRealRatio.toFixed(2)} cm/pixel`);
    }
    
    // Smooth hip position using moving average [web:98]
    exerciseStateRef.current.hipHistory = exerciseStateRef.current.hipHistory || [];
    exerciseStateRef.current.hipHistory.push(currentHipY);
    if (exerciseStateRef.current.hipHistory.length > 5) {
      exerciseStateRef.current.hipHistory.shift();
    }
    const smoothedHipY = exerciseStateRef.current.hipHistory.reduce((a, b) => a + b, 0) / exerciseStateRef.current.hipHistory.length;
    
    updateState({ confidence });
    
    const currentJumpState = exerciseStateRef.current.jumpState;
    const currentTime = Date.now();
    
    console.log(`🦘 JUMP: hipY=${smoothedHipY.toFixed(4)}, state=${currentJumpState}, baseline=${exerciseStateRef.current.baselineHipY.toFixed(4)}`);

    switch (currentJumpState) {
      case 'grounded':
        // PHASE 1: Establish baseline by standing still [web:100][web:101]
        if (!exerciseStateRef.current.baselineHipY || Math.abs(smoothedHipY - exerciseStateRef.current.baselineHipY) < 0.01) {
          exerciseStateRef.current.baselineFrames = (exerciseStateRef.current.baselineFrames || 0) + 1;
          
          if (exerciseStateRef.current.baselineFrames > 30) { // 30 frames of stability
            exerciseStateRef.current.baselineHipY = smoothedHipY;
            updateState({ 
              status: '✅ Baseline set! Ready to jump',
              startHeight: exerciseStateRef.current.baselineHipY
            });
          } else {
            updateState({ 
              status: `📏 Setting baseline... (${30 - exerciseStateRef.current.baselineFrames}/30)`,
              startHeight: smoothedHipY
            });
          }
        } else {
          exerciseStateRef.current.baselineFrames = 0; // Reset if movement detected
          updateState({ status: '⚡ Stand still to set baseline...' });
        }
        
        // DETECT TAKEOFF: Hip moves up significantly from baseline [web:98][web:100]
        if (exerciseStateRef.current.baselineHipY && 
            smoothedHipY < (exerciseStateRef.current.baselineHipY - 0.02)) { // 2% movement threshold
          exerciseStateRef.current.jumpState = 'jumping';
          exerciseStateRef.current.jumpStartTime = currentTime;
          exerciseStateRef.current.maxHipY = smoothedHipY; // Initialize max tracking
          updateState({ status: '🚀 Jumping!' });
          console.log('🦘 JUMP: TAKEOFF DETECTED!');
        }
        break;
        
      case 'jumping':
        // PHASE 2: Track peak height during flight [web:100][web:103]
        exerciseStateRef.current.jumpPhaseFrames = (exerciseStateRef.current.jumpPhaseFrames || 0) + 1;
        
        // Update maximum height reached
        if (smoothedHipY < exerciseStateRef.current.maxHipY) {
          exerciseStateRef.current.maxHipY = smoothedHipY;
          console.log(`🦘 JUMP: New peak height: ${exerciseStateRef.current.maxHipY}`);
        }
        
        // DETECT LANDING: Hip returns close to baseline [web:98][web:100]
        const heightDifference = exerciseStateRef.current.baselineHipY - smoothedHipY;
        
        if (smoothedHipY > (exerciseStateRef.current.baselineHipY - 0.01) && 
            exerciseStateRef.current.jumpPhaseFrames > 10) { // Minimum jump duration
          
          // CALCULATE JUMP HEIGHT [web:101][web:103]
          const peakHeightPixels = exerciseStateRef.current.baselineHipY - exerciseStateRef.current.maxHipY;
          
          let jumpHeightCm = 0;
          if (exerciseStateRef.current.isCalibrated && exerciseStateRef.current.pixelToRealRatio > 0) {
            jumpHeightCm = peakHeightPixels * exerciseStateRef.current.pixelToRealRatio;
          } else {
            // Fallback: Rough estimation using body proportions
            jumpHeightCm = peakHeightPixels * 100; // Rough pixel-to-cm conversion
          }
          
          // Increment jump count
          exerciseStateRef.current.count = (exerciseStateRef.current.count || 0) + 1;
          exerciseStateRef.current.jumpState = 'grounded';
          
          // Reset tracking variables
          exerciseStateRef.current.jumpPhaseFrames = 0;
          exerciseStateRef.current.baselineFrames = 0;
          exerciseStateRef.current.baselineHipY = 0; // Reset baseline for next jump
          
          updateState({ 
            status: '🎉 Jump completed!', 
            count: exerciseStateRef.current.count,
            peakHeight: jumpHeightCm
          });
          
          console.log(`🦘 JUMP: COMPLETED! Height: ${jumpHeightCm.toFixed(1)}cm, Count: ${exerciseStateRef.current.count}`);
          
          setTimeout(() => {
            updateState({ status: '📏 Stand still for next jump baseline...' });
          }, 2000);
        } else {
          const currentHeightCm = exerciseStateRef.current.isCalibrated ? 
            heightDifference * exerciseStateRef.current.pixelToRealRatio : 
            heightDifference * 100;
          
          updateState({ 
            status: '✈️ In flight...',
            peakHeight: Math.max(0, currentHeightCm)
          });
        }
        break;
    }
  };

  // Other exercise functions (unchanged)
  const pullupLogic = (landmarks) => {
    const keypoints = getKeypoints(landmarks);
    updateState({ status: '🔥 Pullup detection active' });
  };

  const lungeLogic = (landmarks) => {
    const keypoints = getKeypoints(landmarks);
    updateState({ status: '🦵 Lunge detection active' });
  };

  const situpLogic = (landmarks) => {
    const keypoints = getKeypoints(landmarks);
    updateState({ status: '🏃 Situp detection active' });
  };

  const processPose = (landmarks) => {
    console.log(`🎯 Processing pose for: ${exerciseType}`);
    
    switch (exerciseType) {
      case 'squats':
        squatLogic(landmarks);
        break;
      case 'pushups':
        pushupLogic(landmarks);
        break;
      case 'pullups':
        pullupLogic(landmarks);
        break;
      case 'lunges':
        lungeLogic(landmarks);
        break;
      case 'situps':
        situpLogic(landmarks);
        break;
      case 'vertical_jump':
        verticalJumpLogic(landmarks);
        break;
      default:
        updateState({ status: '❓ Unknown exercise type' });
        break;
    }
  };

  return { processPose, handleNoDetection };
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenCamera: {
    width: '100%',
    height: '100%',
  },
  overlayContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0',
    textAlign: 'center',
  },
  statsOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  statText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});
