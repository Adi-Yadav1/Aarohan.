import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LanguageContext } from "../contexts/LanguageContext";

// News Item Interface
interface NewsItem {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  date: string;
  description?: string;
  descriptionHindi?: string;
  downloadUrl?: string;
  isImportant?: boolean;
}

// News Categories
const NEWS_CATEGORIES = [
  { key: 'all', label: 'All News', labelHindi: 'सभी समाचार' },
  { key: 'notifications', label: 'Notifications', labelHindi: 'अधिसूचनाएं' },
  { key: 'athlete-updates', label: 'Athlete Updates', labelHindi: 'खिलाड़ी अपडेट' },
  { key: 'protocols', label: 'Protocols', labelHindi: 'प्रोटोकॉल' },
  { key: 'tenders', label: 'Tenders', labelHindi: 'निविदाएं' },
  { key: 'events', label: 'Events', labelHindi: 'कार्यक्रम' },
  { key: 'announcements', label: 'Announcements', labelHindi: 'घोषणाएं' },
];

// Sample News Data (based on the webpage content)
const NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    title: 'Discipline wise Participation in all edition of Khelo India Games',
    titleHindi: 'खेलो इंडिया खेलों के सभी संस्करणों में अनुशासन-वार भागीदारी',
    category: 'announcements',
    date: '2024-12-20',
    description: 'Comprehensive participation statistics across all Khelo India Games editions',
    descriptionHindi: 'खेलो इंडिया खेलों के सभी संस्करणों में व्यापक भागीदारी आंकड़े',
    isImportant: true,
  },
  {
    id: '2',
    title: 'Induction Notification of Khelo India Athletes - Athletics discipline',
    titleHindi: 'खेलो इंडिया एथलीट की प्रेरणा अधिसूचना - एथलेटिक्स विषय',
    category: 'athlete-updates',
    date: '2024-12-19',
    description: 'New athletes inducted into Khelo India scheme for Athletics discipline',
    descriptionHindi: 'एथलेटिक्स अनुशासन के लिए खेलो इंडिया योजना में नए एथलीट शामिल',
  },
  {
    id: '3',
    title: 'Weedout Notification of Khelo India Athletes - Table Tennis discipline',
    titleHindi: 'खेलो इंडिया एथलीट की निष्कासन अधिसूचना - टेबल टेनिस विषय',
    category: 'athlete-updates',
    date: '2024-12-18',
    description: 'Athletes removed from Khelo India scheme in Table Tennis discipline',
    descriptionHindi: 'टेबल टेनिस अनुशासन में खेलो इंडिया योजना से एथलीटों को हटाया गया',
  },
  {
    id: '4',
    title: 'Induction, Weedout, Retention Protocols - Table Tennis discipline',
    titleHindi: 'प्रेरणा, निष्कासन, प्रतिधारण प्रोटोकॉल - टेबल टेनिस विषय',
    category: 'protocols',
    date: '2024-12-17',
    description: 'Updated protocols for athlete management in Table Tennis',
    descriptionHindi: 'टेबल टेनिस में एथलीट प्रबंधन के लिए अद्यतन प्रोटोकॉल',
  },
  {
    id: '5',
    title: 'EOI FOR SELECTION OF EVENT MANAGEMENT AGENCY (EMA) FOR KHELO DELHI GAMES',
    titleHindi: 'खेलो दिल्ली खेलों के लिए इवेंट मैनेजमेंट एजेंसी (ईएमए) के चयन के लिए ईओआई',
    category: 'tenders',
    date: '2024-12-16',
    description: 'Expression of Interest for Event Management Agency selection',
    descriptionHindi: 'इवेंट मैनेजमेंट एजेंसी के चयन के लिए रुचि की अभिव्यक्ति',
    downloadUrl: 'https://kheloindia.gov.in/uploads/sample.pdf',
  },
  {
    id: '6',
    title: 'Application for Technical Officials for KIYG 2025 Bihar (Mallakhamb Sports)',
    titleHindi: 'केआईवाईजी 2025 बिहार के लिए तकनीकी अधिकारियों के लिए आवेदन (मल्लखंब खेल)',
    category: 'notifications',
    date: '2024-12-15',
    description: 'Technical officials recruitment for Khelo India Youth Games 2025',
    descriptionHindi: 'खेलो इंडिया यूथ गेम्स 2025 के लिए तकनीकी अधिकारियों की भर्ती',
  },
  {
    id: '7',
    title: 'Hockey Sports Science and Sports Specific Test with Benchmarks',
    titleHindi: 'हॉकी स्पोर्ट्स साइंस और बेंचमार्क के साथ खेल विशिष्ट परीक्षा',
    category: 'protocols',
    date: '2024-12-14',
    description: 'Scientific testing protocols and benchmarks for Hockey discipline',
    descriptionHindi: 'हॉकी अनुशासन के लिए वैज्ञानिक परीक्षण प्रोटोकॉल और बेंचमार्क',
  },
  {
    id: '8',
    title: 'List of Khelo India Accredited Academies (KIAAs) as on 08.11.2024',
    titleHindi: '08.11.2024 तक खेलो इंडिया मान्यता प्राप्त अकादमियों (केआईएए) की सूची',
    category: 'announcements',
    date: '2024-11-08',
    description: 'Updated list of all accredited academies under Khelo India scheme',
    descriptionHindi: 'खेलो इंडिया योजना के तहत सभी मान्यता प्राप्त अकादमियों की अद्यतन सूची',
    isImportant: true,
  },
];

const KheloIndiaScreen: React.FC = () => {
  const { language, t } = useContext(LanguageContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState(NEWS_DATA);

  // Filter news based on category and search query
  React.useEffect(() => {
    let filtered = NEWS_DATA;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.titleHindi.includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.descriptionHindi && item.descriptionHindi.includes(query))
      );
    }
    
    setFilteredNews(filtered);
  }, [selectedCategory, searchQuery]);

  const handleDownload = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert(
          language === 'hindi' ? 'त्रुटि' : 'Error',
          language === 'hindi' ? 'दस्तावेज़ खोलने में असमर्थ' : 'Unable to open document'
        );
      });
    }
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.newsCard} activeOpacity={0.7}>
      <View style={styles.newsHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryText}>
            {NEWS_CATEGORIES.find(cat => cat.key === item.category)?.[language === 'hindi' ? 'labelHindi' : 'label'] || item.category}
          </Text>
        </View>
        {item.isImportant && (
          <View style={styles.importantBadge}>
            <Ionicons name="star" size={12} color="#fff" />
          </View>
        )}
      </View>
      
      <Text style={styles.newsTitle}>
        {language === 'hindi' ? item.titleHindi : item.title}
      </Text>
      
      {(item.description || item.descriptionHindi) && (
        <Text style={styles.newsDescription}>
          {language === 'hindi' ? (item.descriptionHindi || item.description) : (item.description || item.descriptionHindi)}
        </Text>
      )}
      
      <View style={styles.newsFooter}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        {item.downloadUrl && (
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={() => handleDownload(item.downloadUrl)}
          >
            <Ionicons name="download-outline" size={16} color="#2563eb" />
            <Text style={styles.downloadText}>
              {language === 'hindi' ? 'डाउनलोड' : 'Download'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'notifications': '#f59e0b',
      'athlete-updates': '#10b981',
      'protocols': '#8b5cf6',
      'tenders': '#ef4444',
      'events': '#06b6d4',
      'announcements': '#6366f1',
    };
    return colors[category] || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'hindi' 
      ? date.toLocaleDateString('hi-IN')
      : date.toLocaleDateString('en-IN');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hindi' ? 'खेलो इंडिया समाचार' : 'Khelo India News'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'hindi' ? 'समाचार खोजें...' : 'Search news...'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {NEWS_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.key && styles.selectedCategoryText
            ]}>
              {language === 'hindi' ? category.labelHindi : category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.newsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateText}>
              {language === 'hindi' ? 'कोई समाचार नहीं मिला' : 'No news found'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  categoryContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedCategory: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  newsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  importantBadge: {
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  downloadText: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
    marginTop: 16,
  },
});

export default KheloIndiaScreen;