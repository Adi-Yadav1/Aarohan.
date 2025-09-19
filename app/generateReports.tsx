import { router } from "expo-router";
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Types for Reports
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Performance' | 'Analytics' | 'Administrative' | 'Financial' | 'Training';
  format: 'PDF' | 'Excel' | 'CSV' | 'Dashboard';
  estimatedTime: number; // in minutes
  lastGenerated?: string;
  generationCount: number;
  isPopular: boolean;
  requiredFields: string[];
  icon: string;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  generatedBy: string;
  generatedAt: string;
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  format: string;
  fileSize?: number; // in MB
  downloadUrl?: string;
  parameters: {
    dateRange: {
      startDate: string;
      endDate: string;
    };
    filters: {
      [key: string]: any;
    };
  };
}

interface ReportStats {
  totalReports: number;
  thisMonth: number;
  pending: number;
  popularTemplate: string;
}

// Dummy report templates
const dummyReportTemplates: ReportTemplate[] = [
  {
    id: 'RPT001',
    name: 'Athletic Performance Summary',
    description: 'Comprehensive report on athlete performance metrics, test results, and improvement trends',
    category: 'Performance',
    format: 'PDF',
    estimatedTime: 5,
    lastGenerated: '2024-03-18T14:30:00Z',
    generationCount: 47,
    isPopular: true,
    requiredFields: ['Date Range', 'Sport Selection', 'Athlete Category'],
    icon: '📊'
  },
  {
    id: 'RPT002',
    name: 'Training Progress Analytics',
    description: 'Detailed analysis of training programs, attendance, and progress tracking',
    category: 'Training',
    format: 'Excel',
    estimatedTime: 8,
    lastGenerated: '2024-03-17T10:15:00Z',
    generationCount: 32,
    isPopular: true,
    requiredFields: ['Date Range', 'Training Program', 'Coach Selection'],
    icon: '📈'
  },
  {
    id: 'RPT003',
    name: 'Academy Financial Report',
    description: 'Financial overview including expenses, revenue, athlete fees, and budget analysis',
    category: 'Financial',
    format: 'PDF',
    estimatedTime: 12,
    lastGenerated: '2024-03-16T16:45:00Z',
    generationCount: 18,
    isPopular: false,
    requiredFields: ['Financial Year', 'Department', 'Expense Category'],
    icon: '💰'
  },
  {
    id: 'RPT004',
    name: 'Athlete Registration Report',
    description: 'Summary of athlete registrations, demographics, and verification status',
    category: 'Administrative',
    format: 'Excel',
    estimatedTime: 3,
    lastGenerated: '2024-03-15T09:20:00Z',
    generationCount: 25,
    isPopular: true,
    requiredFields: ['Date Range', 'Registration Status', 'Age Group'],
    icon: '👥'
  },
  {
    id: 'RPT005',
    name: 'Competition Results Analysis',
    description: 'Detailed analysis of competition participation and results across different sports',
    category: 'Analytics',
    format: 'Dashboard',
    estimatedTime: 6,
    lastGenerated: '2024-03-14T13:10:00Z',
    generationCount: 15,
    isPopular: false,
    requiredFields: ['Competition Type', 'Date Range', 'Sport Category'],
    icon: '🏆'
  },
  {
    id: 'RPT006',
    name: 'Coach Performance Evaluation',
    description: 'Assessment of coach effectiveness, athlete progress under coaching, and feedback analysis',
    category: 'Performance',
    format: 'PDF',
    estimatedTime: 10,
    lastGenerated: '2024-03-13T11:30:00Z',
    generationCount: 12,
    isPopular: false,
    requiredFields: ['Evaluation Period', 'Coach Selection', 'Performance Metrics'],
    icon: '🎯'
  },
  {
    id: 'RPT007',
    name: 'Equipment & Facility Usage',
    description: 'Report on equipment utilization, facility bookings, and maintenance schedules',
    category: 'Administrative',
    format: 'Excel',
    estimatedTime: 4,
    lastGenerated: '2024-03-12T15:20:00Z',
    generationCount: 8,
    isPopular: false,
    requiredFields: ['Date Range', 'Facility Type', 'Equipment Category'],
    icon: '🏟️'
  },
  {
    id: 'RPT008',
    name: 'Monthly Activity Dashboard',
    description: 'Interactive dashboard showing key metrics, trends, and performance indicators',
    category: 'Analytics',
    format: 'Dashboard',
    estimatedTime: 2,
    lastGenerated: '2024-03-18T08:00:00Z',
    generationCount: 67,
    isPopular: true,
    requiredFields: ['Month Selection', 'Department Filter'],
    icon: '📋'
  }
];

// Dummy generated reports
const dummyGeneratedReports: GeneratedReport[] = [
  {
    id: 'GR001',
    templateId: 'RPT001',
    templateName: 'Athletic Performance Summary',
    generatedBy: 'Admin Singh',
    generatedAt: '2024-03-18T14:30:00Z',
    status: 'completed',
    format: 'PDF',
    fileSize: 2.4,
    downloadUrl: 'https://example.com/reports/performance_summary.pdf',
    parameters: {
      dateRange: {
        startDate: '2024-02-01',
        endDate: '2024-02-29'
      },
      filters: {
        sport: 'All Sports',
        category: 'Senior Athletes'
      }
    }
  },
  {
    id: 'GR002',
    templateId: 'RPT002',
    templateName: 'Training Progress Analytics',
    generatedBy: 'Coach Kumar',
    generatedAt: '2024-03-18T12:15:00Z',
    status: 'generating',
    format: 'Excel',
    parameters: {
      dateRange: {
        startDate: '2024-03-01',
        endDate: '2024-03-18'
      },
      filters: {
        program: 'Advanced Training',
        coach: 'All Coaches'
      }
    }
  },
  {
    id: 'GR003',
    templateId: 'RPT008',
    templateName: 'Monthly Activity Dashboard',
    generatedBy: 'Admin Patel',
    generatedAt: '2024-03-17T16:45:00Z',
    status: 'completed',
    format: 'Dashboard',
    fileSize: 0.8,
    downloadUrl: 'https://example.com/dashboards/activity_march',
    parameters: {
      dateRange: {
        startDate: '2024-03-01',
        endDate: '2024-03-17'
      },
      filters: {
        department: 'All Departments'
      }
    }
  },
  {
    id: 'GR004',
    templateId: 'RPT004',
    templateName: 'Athlete Registration Report',
    generatedBy: 'Admin Singh',
    generatedAt: '2024-03-16T10:20:00Z',
    status: 'failed',
    format: 'Excel',
    parameters: {
      dateRange: {
        startDate: '2024-01-01',
        endDate: '2024-03-16'
      },
      filters: {
        status: 'Pending Verification',
        ageGroup: '18-25'
      }
    }
  }
];

const GenerateReports: React.FC = () => {
  const [reportTemplates] = useState<ReportTemplate[]>(dummyReportTemplates);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(dummyGeneratedReports);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [filteredTemplates, setFilteredTemplates] = useState<ReportTemplate[]>(reportTemplates);
  
  // Report generation form states
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showGenerateForm, setShowGenerateForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    dateRange: {
      startDate: '',
      endDate: ''
    },
    filters: {}
  });

  React.useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, reportTemplates]);

  const filterTemplates = () => {
    let filtered = reportTemplates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    }

    // Sort by popularity and generation count
    filtered.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.generationCount - a.generationCount;
    });

    setFilteredTemplates(filtered);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Performance': return '#8B5CF6';
      case 'Analytics': return '#3B82F6';
      case 'Administrative': return '#10B981';
      case 'Financial': return '#F59E0B';
      case 'Training': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'generating': return '#3B82F6';
      case 'failed': return '#EF4444';
      case 'scheduled': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      dateRange: {
        startDate: '',
        endDate: ''
      },
      filters: {}
    });
    setShowGenerateForm(true);
  };

  const processReportGeneration = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    
    const newReport: GeneratedReport = {
      id: `GR${Date.now()}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      generatedBy: 'Admin User',
      generatedAt: new Date().toISOString(),
      status: 'generating',
      format: selectedTemplate.format,
      parameters: formData
    };

    // Add to generated reports
    setGeneratedReports(prev => [newReport, ...prev]);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratedReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'completed', fileSize: Math.random() * 5 + 0.5, downloadUrl: `https://example.com/reports/${newReport.id}` }
          : report
      ));
      setLoading(false);
      setShowGenerateForm(false);
      Alert.alert("Success", `${selectedTemplate.name} has been generated successfully!`);
    }, 3000);
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    if (report.status === 'completed' && report.downloadUrl) {
      Alert.alert("Download", `Downloading ${report.templateName}...`);
    } else {
      Alert.alert("Error", "Report is not ready for download");
    }
  };

  const handleRetryGeneration = (report: GeneratedReport) => {
    setGeneratedReports(prev => prev.map(r => 
      r.id === report.id ? { ...r, status: 'generating' } : r
    ));
    
    setTimeout(() => {
      setGeneratedReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, status: 'completed', fileSize: Math.random() * 5 + 0.5, downloadUrl: `https://example.com/reports/${r.id}` }
          : r
      ));
      Alert.alert("Success", "Report generated successfully!");
    }, 2000);
  };

  const renderTemplateCard = ({ item }: { item: ReportTemplate }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleGenerateReport(item)}
    >
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <View style={styles.templateTitleRow}>
            <Text style={styles.templateIcon}>{item.icon}</Text>
            <View style={styles.templateTitleContainer}>
              <Text style={styles.templateName}>{item.name}</Text>
              {item.isPopular && <View style={styles.popularBadge}><Text style={styles.popularText}>Popular</Text></View>}
            </View>
          </View>
          <Text style={styles.templateDescription}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.templateMeta}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '15' }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>{item.category}</Text>
        </View>
        <Text style={styles.formatText}>{item.format}</Text>
      </View>

      <View style={styles.templateStats}>
        <Text style={styles.statText}>⏱️ ~{item.estimatedTime} min</Text>
        <Text style={styles.statText}>📊 Generated {item.generationCount} times</Text>
      </View>

      {item.lastGenerated && (
        <Text style={styles.lastGenerated}>Last generated: {formatDate(item.lastGenerated)}</Text>
      )}

      <View style={styles.requiredFields}>
        <Text style={styles.requiredFieldsTitle}>Required fields:</Text>
        <Text style={styles.requiredFieldsList}>{item.requiredFields.join(', ')}</Text>
      </View>

      <TouchableOpacity 
        style={styles.generateButton}
        onPress={() => handleGenerateReport(item)}
      >
        <Text style={styles.generateButtonText}>Generate Report</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGeneratedReport = ({ item }: { item: GeneratedReport }) => (
    <View style={styles.reportHistoryCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <Text style={styles.reportName}>{item.templateName}</Text>
          <Text style={styles.reportMeta}>
            Generated by {item.generatedBy} • {formatDate(item.generatedAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.reportDetails}>
        <Text style={styles.reportFormat}>Format: {item.format}</Text>
        {item.fileSize && <Text style={styles.reportSize}>Size: {item.fileSize.toFixed(1)} MB</Text>}
      </View>

      <View style={styles.reportParameters}>
        <Text style={styles.parametersTitle}>Parameters:</Text>
        <Text style={styles.parametersText}>
          {item.parameters.dateRange.startDate} to {item.parameters.dateRange.endDate}
        </Text>
        <Text style={styles.parametersText}>
          Filters: {Object.entries(item.parameters.filters).map(([key, value]) => `${key}: ${value}`).join(', ')}
        </Text>
      </View>

      <View style={styles.reportActions}>
        {item.status === 'completed' && (
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={() => handleDownloadReport(item)}
          >
            <Text style={styles.downloadButtonText}>📥 Download</Text>
          </TouchableOpacity>
        )}
        {item.status === 'failed' && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => handleRetryGeneration(item)}
          >
            <Text style={styles.retryButtonText}>🔄 Retry</Text>
          </TouchableOpacity>
        )}
        {item.status === 'generating' && (
          <View style={styles.generatingIndicator}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.generatingText}>Generating...</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderGenerateForm = () => {
    if (!showGenerateForm || !selectedTemplate) return null;

    return (
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Generate {selectedTemplate.name}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGenerateForm(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContent}>
            <Text style={styles.fieldLabel}>Date Range *</Text>
            <View style={styles.dateRangeContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="Start Date (YYYY-MM-DD)"
                value={formData.dateRange.startDate}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, startDate: text }
                }))}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="End Date (YYYY-MM-DD)"
                value={formData.dateRange.endDate}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, endDate: text }
                }))}
              />
            </View>

            <Text style={styles.fieldLabel}>Additional Filters</Text>
            {selectedTemplate.requiredFields.map((field, index) => (
              <TextInput
                key={index}
                style={styles.filterInput}
                placeholder={`Enter ${field}`}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  filters: { ...prev.filters, [field]: text }
                }))}
              />
            ))}

            <Text style={styles.estimatedTime}>
              Estimated generation time: ~{selectedTemplate.estimatedTime} minutes
            </Text>
          </ScrollView>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowGenerateForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={processReportGeneration}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Generate Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const categories = [...new Set(reportTemplates.map(t => t.category))];
  const reportStats: ReportStats = {
    totalReports: generatedReports.length,
    thisMonth: generatedReports.filter(r => 
      new Date(r.generatedAt).getMonth() === new Date().getMonth()
    ).length,
    pending: generatedReports.filter(r => r.status === 'generating').length,
    popularTemplate: reportTemplates.find(t => t.isPopular)?.name || 'N/A'
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Reports</Text>
        <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert("Help", "Report generation guidelines and help information would appear here")}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportStats.totalReports}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportStats.thisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reportStats.pending}</Text>
              <Text style={styles.statLabel}>Generating</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
          onPress={() => setActiveTab('templates')}
        >
          <Text style={[styles.tabText, activeTab === 'templates' && styles.activeTabText]}>
            Report Templates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Generation History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'templates' && (
        <>
          {/* Search */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search report templates..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === 'all' && styles.activeCategoryButton]}
                onPress={() => setSelectedCategory('all')}
              >
                <Text style={[styles.categoryButtonText, selectedCategory === 'all' && styles.activeCategoryText]}>
                  All ({reportTemplates.length})
                </Text>
              </TouchableOpacity>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategory === category && styles.activeCategoryButton]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.categoryButtonText, selectedCategory === category && styles.activeCategoryText]}>
                    {category} ({reportTemplates.filter(t => t.category === category).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Templates List */}
          <FlatList
            data={filteredTemplates}
            renderItem={renderTemplateCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {activeTab === 'history' && (
        <FlatList
          data={generatedReports}
          renderItem={renderGeneratedReport}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderGenerateForm()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryScroll: {
    backgroundColor: '#FFFFFF',
    maxHeight: 50,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
    paddingTop: 16,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  templateHeader: {
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  templateIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  templateTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  popularBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  templateMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formatText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lastGenerated: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  requiredFields: {
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  requiredFieldsTitle: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600',
    marginBottom: 2,
  },
  requiredFieldsList: {
    fontSize: 11,
    color: '#0369A1',
  },
  generateButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reportHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reportDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  reportFormat: {
    fontSize: 12,
    color: '#6B7280',
  },
  reportSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  reportParameters: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  parametersTitle: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 4,
  },
  parametersText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  generatingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  generatingText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContent: {
    padding: 20,
    maxHeight: 400,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterInput: {
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GenerateReports;