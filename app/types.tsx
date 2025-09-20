import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// The ExerciseSelectionScreen component is now the default export of this file.
// It is what will be rendered on the "Home" tab.
export default function ExerciseSelectionScreen() {
  const exercises = [
    { name: 'Squats', url: 'squats' },
    { name: 'Push-ups', url: 'pushups' },
    { name: 'Running', url: 'running' },
    { name: 'Flexibility', url: 'flexibility' },
    { name: 'Sit-ups', url: 'situps' },
    { name: 'Vertical Jump Height', url: 'vertical_jump' },
  ];

  return (
    <SafeAreaView style={styles.selectionContainer}>
      <Text style={styles.title}>Choose Your Exercise</Text>
      
     
      
      <View style={styles.buttonGrid}>
        {exercises.map((item) => (
          <TouchableOpacity
            key={item.url}
            style={styles.exerciseButton}
            onPress={() => router.push({ pathname: '/camera', params: { exerciseType: item.url } })}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  exerciseButton: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    minWidth: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  authButtonContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
});
