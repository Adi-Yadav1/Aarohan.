import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { RNMediapipe } from '@thinksys/react-native-mediapipe';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Request camera permissions when the app starts
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  if (!hasPermission) {
    return <Text style={styles.permissionText}>Camera permission is required.</Text>;
  }

  // The onLandmark callback will receive the pose data from MediaPipe.
  const handlePoseData = (data) => {
    // Here you can process the data, e.g., count squats, check form, etc.
    // The data object will contain the 33 landmarks and their coordinates.
    console.log('MediaPipe Pose Data:', data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Pose Detection</Text>
      <RNMediapipe
        style={styles.camera}
        onLandmark={handlePoseData}
        // You can add more props here to customize the detection,
        // e.g., to show/hide specific body parts.
      />
      <Text style={styles.instructionText}>
        Stand in front of the camera to start pose detection.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  camera: {
    width: '90%',
    height: '60%',
    borderColor: '#00ff00',
    borderWidth: 2,
    borderRadius: 10,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  instructionText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 20,
  },
});