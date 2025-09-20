// Chatbot.tsx - Fitness AI Chatbot component
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const CHATBOT_API_URL = 'https://f2d0c162292a.ngrok-free.app/';

/*
Available API Endpoints:
- GET  / - API documentation and status
- POST /chat - Main chat endpoint for frontend
- POST /ask - Legacy endpoint (redirects to /chat)
- GET  /health - System health check
- GET  /stats - System statistics
- GET  /pipeline/status - Pipeline status
- POST /pipeline/refresh - Refresh data pipeline
- GET  /ask/<question> - Primary RAG LLM endpoint (used in this app)
*/

export default function ChatbotScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  type Message = {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isError?: boolean;
  };

  // Function to get welcome message based on language
  const getWelcomeMessage = () => {
    if (t.language === 'हिन्दी') {
      return "नमस्ते! मैं आरोहन का RAG-पावर्ड फिटनेस AI सहायक हूं। मैं व्यायाम, खेल तकनीक, फिटनेस टिप्स, पोषण और स्वास्थ्य के बारे में सवालों का जवाब दे सकता हूं। आप क्या जानना चाहते हैं?";
    }
    return "Hello! I'm your RAG-powered fitness AI assistant from Aarohan. I can answer questions about exercises, sports techniques, fitness tips, nutrition, and health using my knowledge base. What would you like to know?";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Function to call Chatbot API using the /ask endpoint
  const callChatbotAPI = async (userMessage: string) => {
    try {
      // Encode the question to handle special characters and spaces
      const encodedQuestion = encodeURIComponent(userMessage);
      
      const response = await fetch(`${CHATBOT_API_URL}/ask/${encodedQuestion}`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response formats from RAG LLM
      if (data.response) {
        return data.response;
      } else if (data.answer) {
        return data.answer;
      } else if (data.message) {
        return data.message;
      } else if (typeof data === 'string') {
        return data;
      } else {
        throw new Error('Invalid response format from RAG API');
      }
    } catch (error) {
      console.error('RAG Chatbot API Error:', error);
      throw error;
    }
  };

  // Function to check API health status
  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${CHATBOT_API_URL}/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        console.log('RAG API is healthy');
        return true;
      } else {
        console.warn('RAG API health check failed');
        return false;
      }
    } catch (error) {
      console.error('RAG API health check error:', error);
      return false;
    }
  };

  // Check API health on component mount
  useEffect(() => {
    checkAPIHealth();
  }, []);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => [
      {
        id: 1,
        text: getWelcomeMessage(),
        isUser: false,
        timestamp: new Date(),
      },
      ...prev.slice(1) // Keep all messages except the first welcome message
    ]);
  }, [t]);

  // Function to send message
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call Chatbot API
      const aiResponse = await callChatbotAPI(userMessage.text);
      
      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the RAG knowledge base. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      Alert.alert('Connection Error', 'Failed to get response from RAG API. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Function to format timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t.fitnessAssistant}</Text>
          <Text style={styles.headerSubtitle}>{t.askAnything}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.statusIndicator}>●</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText,
                message.isError && styles.errorMessageText,
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.timestamp,
                message.isUser ? styles.userTimestamp : styles.aiTimestamp,
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>{t.aiThinking}</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputSection}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t.typeMessage}
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>{t.send}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  statusIndicator: {
    color: '#00ff88',
    fontSize: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#333',
  },
  errorMessageText: {
    color: '#FF3B30',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  inputSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8f8f8',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

