import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface ExerciseTip {
  title: string;
  dos: string[];
  donts: string[];
  safetyTips: string[];
}

interface ExerciseTipsProps {
  exerciseType: string;
}

const exerciseTips: Record<string, ExerciseTip> = {
  running: {
    title: 'Running Tips',
    dos: [
      'Keep your head up and look forward',
      'Land on the middle of your foot, not your heel',
      'Keep arms relaxed at 90-degree angle',
      'Maintain steady breathing rhythm',
      'Start with a comfortable pace',
      'Stay hydrated before and after'
    ],
    donts: [
      'Don\'t overstride or take too long steps',
      'Don\'t clench your fists while running',
      'Don\'t look down at your feet',
      'Don\'t hold your breath',
      'Don\'t run through sharp pain',
      'Don\'t skip warm-up'
    ],
    safetyTips: [
      'Warm up with light jogging or walking',
      'Cool down with stretching',
      'Stay aware of your surroundings',
      'Stop if you feel dizzy or nauseous'
    ]
  },
  squats: {
    title: 'Squat Tips',
    dos: [
      'Keep your chest up and core engaged',
      'Push your hips back before bending knees',
      'Keep knees aligned with toes',
      'Go down until thighs are parallel to floor',
      'Drive through your heels to stand up',
      'Keep your weight balanced'
    ],
    donts: [
      'Don\'t let knees cave inward',
      'Don\'t round your back',
      'Don\'t let knees extend past toes',
      'Don\'t bounce at the bottom',
      'Don\'t rush the movement',
      'Don\'t hold your breath'
    ],
    safetyTips: [
      'Start with bodyweight only',
      'Focus on form over speed',
      'Stop if you feel knee or back pain',
      'Keep feet shoulder-width apart'
    ]
  },
  pushups: {
    title: 'Push-up Tips',
    dos: [
      'Keep your body in a straight line',
      'Place hands slightly wider than shoulders',
      'Lower chest to just above ground',
      'Keep core engaged throughout',
      'Push up in one smooth motion',
      'Breathe out as you push up'
    ],
    donts: [
      'Don\'t let hips sag or pike up',
      'Don\'t flare elbows too wide (45° max)',
      'Don\'t do partial reps',
      'Don\'t crane your neck up',
      'Don\'t rush the movement',
      'Don\'t forget to breathe'
    ],
    safetyTips: [
      'Start on knees if needed',
      'Keep wrists aligned under shoulders',
      'Stop if you feel wrist or shoulder pain',
      'Focus on controlled movements'
    ]
  },
  situps: {
    title: 'Sit-up Tips',
    dos: [
      'Keep knees bent and feet flat',
      'Place hands behind head lightly',
      'Engage core to lift up',
      'Come up to about 45 degrees',
      'Control the descent',
      'Keep chin slightly tucked'
    ],
    donts: [
      'Don\'t pull on your neck',
      'Don\'t come all the way up',
      'Don\'t hold your breath',
      'Don\'t arch your back',
      'Don\'t use momentum',
      'Don\'t do too many too fast'
    ],
    safetyTips: [
      'Start with fewer reps',
      'Focus on quality over quantity',
      'Stop if you feel neck or back strain',
      'Consider crunches as an alternative'
    ]
  },
  flexibility: {
    title: 'Flexibility Tips',
    dos: [
      'Warm up before stretching',
      'Hold stretches for 15-30 seconds',
      'Breathe deeply and relax',
      'Stretch slowly and gradually',
      'Focus on major muscle groups',
      'Stay consistent with practice'
    ],
    donts: [
      'Don\'t bounce while stretching',
      'Don\'t stretch to the point of pain',
      'Don\'t hold your breath',
      'Don\'t compare to others',
      'Don\'t skip days completely',
      'Don\'t force positions'
    ],
    safetyTips: [
      'Stop if you feel sharp pain',
      'Progress gradually over time',
      'Listen to your body',
      'Consider yoga or guided sessions'
    ]
  },
  vertical_jump: {
    title: 'Vertical Jump Tips',
    dos: [
      'Start with feet shoulder-width apart',
      'Bend knees and load your glutes',
      'Swing arms up for momentum',
      'Explode up with full force',
      'Land softly on balls of feet',
      'Use your core for stability'
    ],
    donts: [
      'Don\'t land stiff-legged',
      'Don\'t jump without warming up',
      'Don\'t ignore proper landing form',
      'Don\'t attempt if feeling dizzy',
      'Don\'t do too many in a row',
      'Don\'t jump on hard surfaces only'
    ],
    safetyTips: [
      'Warm up with light jumping',
      'Ensure clear overhead space',
      'Rest between attempts',
      'Stop if you feel joint pain'
    ]
  }
};

const ExerciseTips: React.FC<ExerciseTipsProps> = ({ exerciseType }) => {
  const { t } = useLanguage();
  const tips = exerciseTips[exerciseType];
  
  if (!tips) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.exerciseTips}</Text>
        <Text style={styles.noTips}>Tips for this exercise will be available soon!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{tips.title}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ {t.dosDonts}</Text>
        {tips.dos.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❌ DON'Ts</Text>
        {tips.donts.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛡️ {t.safetyTips}</Text>
        {tips.safetyTips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    color: '#00aaff',
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  noTips: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ExerciseTips;