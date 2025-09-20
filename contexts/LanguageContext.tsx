// LanguageContext.tsx - Context for managing app language and translations
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const LANG_KEY = "appLanguage_v1";

export type Language = 'en' | 'hi';

// Translation interface
export interface Translations {
  // Navigation and Common
  home: string;
  sports: string;
  chatbot: string;
  social: string;
  profile: string;
  settings: string;
  back: string;
  save: string;
  cancel: string;
  loading: string;
  error: string;
  success: string;
  
  // Exercise and Sports
  running: string;
  squats: string;
  pushups: string;
  situps: string;
  flexibility: string;
  verticalJump: string;
  startWorkout: string;
  viewTips: string;
  exerciseTips: string;
  dosDonts: string;
  safetyTips: string;
  
  // Chatbot
  fitnessAssistant: string;
  askAnything: string;
  typeMessage: string;
  send: string;
  aiThinking: string;
  connectionError: string;
  
  // Profile and Settings
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  state: string;
  district: string;
  sport: string;
  category: string;
  language: string;
  logout: string;
  
  // Exercise Instructions
  warmUp: string;
  coolDown: string;
  properForm: string;
  breathe: string;
  hydrate: string;
  
  // Running specific
  steps: string;
  distance: string;
  calories: string;
  duration: string;
  pace: string;
  startRun: string;
  stopRun: string;
  pauseRun: string;
  resumeRun: string;
  
  // Greetings and Time-based
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  
  // Home Screen Actions
  startFitnessTest: string;
  readyToChallenge: string;
  performanceHistory: string;
  viewDetails: string;
  totalTests: string;
  currentRank: string;
  totalBadges: string;
  improvement: string;
  recentActivity: string;
  lastTest: string;
  
  // Dashboard Stats
  testsCompleted: string;
  rank: string;
  badges: string;
  progressPercent: string;
  
  // Common Actions
  view: string;
  start: string;
  continue: string;
  complete: string;
  retry: string;
  
  // Time expressions
  today: string;
  yesterday: string;
  weekAgo: string;
  monthAgo: string;
  
  // Sports Selection
  selectSport: string;
  chooseFavorite: string;
  equipment: string;
  difficulty: string;
  beginner: string;
  intermediate: string;
  advanced: string;
}

// English translations
const englishTranslations: Translations = {
  // Navigation and Common
  home: 'Home',
  sports: 'Sports',
  chatbot: 'Chatbot',
  social: 'Social',
  profile: 'Profile',
  settings: 'Settings',
  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
  
  // Exercise and Sports
  running: 'Running',
  squats: 'Squats',
  pushups: 'Push-ups',
  situps: 'Sit-ups',
  flexibility: 'Flexibility',
  verticalJump: 'Vertical Jump',
  startWorkout: 'Start Workout',
  viewTips: 'View Tips',
  exerciseTips: 'Exercise Tips',
  dosDonts: "Do's & Don'ts",
  safetyTips: 'Safety Tips',
  
  // Chatbot
  fitnessAssistant: 'Fitness AI Assistant',
  askAnything: 'Ask me anything about fitness!',
  typeMessage: 'Type your message...',
  send: 'Send',
  aiThinking: 'AI is thinking...',
  connectionError: 'Connection Error',
  
  // Profile and Settings
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  phone: 'Phone',
  state: 'State',
  district: 'District',
  sport: 'Sport',
  category: 'Category',
  language: 'Language',
  logout: 'Logout',
  
  // Exercise Instructions
  warmUp: 'Warm Up',
  coolDown: 'Cool Down',
  properForm: 'Proper Form',
  breathe: 'Breathe',
  hydrate: 'Stay Hydrated',
  
  // Running specific
  steps: 'Steps',
  distance: 'Distance',
  calories: 'Calories',
  duration: 'Duration',
  pace: 'Pace',
  startRun: 'Start Run',
  stopRun: 'Stop Run',
  pauseRun: 'Pause',
  resumeRun: 'Resume',
  
  // Greetings and Time-based
  goodMorning: 'Good Morning',
  goodAfternoon: 'Good Afternoon',
  goodEvening: 'Good Evening',
  
  // Home Screen Actions
  startFitnessTest: 'Start Fitness Test',
  readyToChallenge: 'Ready to challenge yourself?',
  performanceHistory: 'Performance History',
  viewDetails: 'View Details',
  totalTests: 'Total Tests',
  currentRank: 'Current Rank',
  totalBadges: 'Total Badges',
  improvement: 'Improvement',
  recentActivity: 'Recent Activity',
  lastTest: 'Last Test',
  
  // Dashboard Stats
  testsCompleted: 'Tests Completed',
  rank: 'Rank',
  badges: 'Badges',
  progressPercent: 'Progress',
  
  // Common Actions
  view: 'View',
  start: 'Start',
  continue: 'Continue',
  complete: 'Complete',
  retry: 'Retry',
  
  // Time expressions
  today: 'Today',
  yesterday: 'Yesterday',
  weekAgo: 'A week ago',
  monthAgo: 'A month ago',
  
  // Sports Selection
  selectSport: 'Select Sport',
  chooseFavorite: 'Choose your favorite sports',
  equipment: 'Equipment',
  difficulty: 'Difficulty',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// Hindi translations
const hindiTranslations: Translations = {
  // Navigation and Common
  home: 'होम',
  sports: 'खेल',
  chatbot: 'चैटबॉट',
  social: 'सोशल',
  profile: 'प्रोफाइल',
  settings: 'सेटिंग्स',
  back: 'वापस',
  save: 'सहेजें',
  cancel: 'रद्द करें',
  loading: 'लोड हो रहा है',
  error: 'त्रुटि',
  success: 'सफलता',
  
  // Exercise and Sports
  running: 'दौड़ना',
  squats: 'स्क्वैट्स',
  pushups: 'पुश-अप्स',
  situps: 'सिट-अप्स',
  flexibility: 'लचीलापन',
  verticalJump: 'ऊर्ध्वाधर कूद',
  startWorkout: 'व्यायाम शुरू करें',
  viewTips: 'सुझाव देखें',
  exerciseTips: 'व्यायाम सुझाव',
  dosDonts: 'करें और न करें',
  safetyTips: 'सुरक्षा सुझाव',
  
  // Chatbot
  fitnessAssistant: 'फिटनेस AI सहायक',
  askAnything: 'फिटनेस के बारे में कुछ भी पूछें!',
  typeMessage: 'अपना संदेश लिखें...',
  send: 'भेजें',
  aiThinking: 'AI सोच रहा है...',
  connectionError: 'कनेक्शन त्रुटि',
  
  // Profile and Settings
  firstName: 'पहला नाम',
  lastName: 'अंतिम नाम',
  email: 'ईमेल',
  dateOfBirth: 'जन्म तिथि',
  gender: 'लिंग',
  phone: 'फोन',
  state: 'राज्य',
  district: 'जिला',
  sport: 'खेल',
  category: 'श्रेणी',
  language: 'भाषा',
  logout: 'लॉगआउट',
  
  // Exercise Instructions
  warmUp: 'वार्म अप',
  coolDown: 'कूल डाउन',
  properForm: 'सही तरीका',
  breathe: 'सांस लें',
  hydrate: 'हाइड्रेट रहें',
  
  // Running specific
  steps: 'कदम',
  distance: 'दूरी',
  calories: 'कैलोरी',
  duration: 'अवधि',
  pace: 'गति',
  startRun: 'दौड़ना शुरू करें',
  stopRun: 'दौड़ना बंद करें',
  pauseRun: 'रोकें',
  resumeRun: 'जारी रखें',
  
  // Greetings and Time-based
  goodMorning: 'शुभ प्रभात',
  goodAfternoon: 'नमस्कार',
  goodEvening: 'शुभ संध्या',
  
  // Home Screen Actions
  startFitnessTest: 'फिटनेस टेस्ट शुरू करें',
  readyToChallenge: 'चुनौती के लिए तैयार हैं?',
  performanceHistory: 'प्रदर्शन इतिहास',
  viewDetails: 'विवरण देखें',
  totalTests: 'कुल टेस्ट',
  currentRank: 'वर्तमान रैंक',
  totalBadges: 'कुल बैज',
  improvement: 'सुधार',
  recentActivity: 'हाल की गतिविधि',
  lastTest: 'अंतिम टेस्ट',
  
  // Dashboard Stats
  testsCompleted: 'पूर्ण टेस्ट',
  rank: 'रैंक',
  badges: 'बैज',
  progressPercent: 'प्रगति',
  
  // Common Actions
  view: 'देखें',
  start: 'शुरू करें',
  continue: 'जारी रखें',
  complete: 'पूर्ण करें',
  retry: 'पुनः प्रयास करें',
  
  // Time expressions
  today: 'आज',
  yesterday: 'कल',
  weekAgo: 'एक सप्ताह पहले',
  monthAgo: 'एक महीने पहले',
  
  // Sports Selection
  selectSport: 'खेल चुनें',
  chooseFavorite: 'अपने पसंदीदा खेल चुनें',
  equipment: 'उपकरण',
  difficulty: 'कठिनाई',
  beginner: 'शुरुआती',
  intermediate: 'मध्यम',
  advanced: 'उन्नत',
};

const translations = {
  en: englishTranslations,
  hi: hindiTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANG_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Save language when it changes
  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANG_KEY, newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};