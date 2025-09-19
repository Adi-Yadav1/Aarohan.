import React, { useState } from "react";
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";

interface PerformanceEntry {
  id: string;
  testName: string;
  date: string;
  score: string;
  unit: string;
  category: string;
  improvement: number; // percentage
  remarks?: string;
}

const dummyPerformanceHistory: PerformanceEntry[] = [
  {
    id: "1",
    testName: "20m Sprint",
    date: "2025-09-01",
    score: "3.2",
    unit: "seconds",
    category: "SPEED",
    improvement: 5,
    remarks: "Good acceleration",
  },
  {
    id: "2",
    testName: "Standing Long Jump",
    date: "2025-08-28",
    score: "2.1",
    unit: "meters",
    category: "STRENGTH",
    improvement: 2,
    remarks: "Stable landing",
  },
  {
    id: "3",
    testName: "Yo-Yo Intermittent Recovery",
    date: "2025-08-25",
    score: "Level 15",
    unit: "level",
    category: "ENDURANCE",
    improvement: 3,
    remarks: "Improved stamina",
  },
  {
    id: "4",
    testName: "Shot Put",
    date: "2025-08-20",
    score: "8.5",
    unit: "meters",
    category: "STRENGTH",
    improvement: 1,
    remarks: "Needs more power",
  },
  {
    id: "5",
    testName: "20m Sprint",
    date: "2025-08-15",
    score: "3.3",
    unit: "seconds",
    category: "SPEED",
    improvement: 0,
    remarks: "Maintain form",
  },
  {
    id: "6",
    testName: "Standing Long Jump",
    date: "2025-08-10",
    score: "2.0",
    unit: "meters",
    category: "STRENGTH",
    improvement: 1,
    remarks: "Better takeoff",
  },
  {
    id: "7",
    testName: "Yo-Yo Intermittent Recovery",
    date: "2025-08-05",
    score: "Level 14",
    unit: "level",
    category: "ENDURANCE",
    improvement: 2,
    remarks: "Keep pushing",
  },
  {
    id: "8",
    testName: "Shot Put",
    date: "2025-08-01",
    score: "8.3",
    unit: "meters",
    category: "STRENGTH",
    improvement: 0,
    remarks: "Work on technique",
  },
  {
    id: "9",
    testName: "20m Sprint",
    date: "2025-07-28",
    score: "3.4",
    unit: "seconds",
    category: "SPEED",
    improvement: -1,
    remarks: "Slight drop",
  },
  {
    id: "10",
    testName: "Standing Long Jump",
    date: "2025-07-25",
    score: "1.95",
    unit: "meters",
    category: "STRENGTH",
    improvement: 0,
    remarks: "Consistent",
  },
  {
    id: "11",
    testName: "Yo-Yo Intermittent Recovery",
    date: "2025-07-20",
    score: "Level 13",
    unit: "level",
    category: "ENDURANCE",
    improvement: 1,
    remarks: "Good effort",
  },
  {
    id: "12",
    testName: "Shot Put",
    date: "2025-07-15",
    score: "8.1",
    unit: "meters",
    category: "STRENGTH",
    improvement: -1,
    remarks: "Focus on grip",
  },
  {
    id: "13",
    testName: "20m Sprint",
    date: "2025-07-10",
    score: "3.5",
    unit: "seconds",
    category: "SPEED",
    improvement: 0,
    remarks: "Maintain speed",
  },
  {
    id: "14",
    testName: "Standing Long Jump",
    date: "2025-07-05",
    score: "1.93",
    unit: "meters",
    category: "STRENGTH",
    improvement: -1,
    remarks: "Needs more power",
  },
  {
    id: "15",
    testName: "Yo-Yo Intermittent Recovery",
    date: "2025-07-01",
    score: "Level 12",
    unit: "level",
    category: "ENDURANCE",
    improvement: 0,
    remarks: "Stable",
  },
  {
    id: "16",
    testName: "Shot Put",
    date: "2025-06-28",
    score: "8.0",
    unit: "meters",
    category: "STRENGTH",
    improvement: 0,
    remarks: "Keep practicing",
  },
  {
    id: "17",
    testName: "20m Sprint",
    date: "2025-06-25",
    score: "3.6",
    unit: "seconds",
    category: "SPEED",
    improvement: -1,
    remarks: "Work on start",
  },
  {
    id: "18",
    testName: "Standing Long Jump",
    date: "2025-06-20",
    score: "1.90",
    unit: "meters",
    category: "STRENGTH",
    improvement: -1,
    remarks: "Needs more lift",
  },
  {
    id: "19",
    testName: "Yo-Yo Intermittent Recovery",
    date: "2025-06-15",
    score: "Level 11",
    unit: "level",
    category: "ENDURANCE",
    improvement: -1,
    remarks: "Push harder",
  },
  {
    id: "20",
    testName: "Shot Put",
    date: "2025-06-10",
    score: "7.9",
    unit: "meters",
    category: "STRENGTH",
    improvement: -1,
    remarks: "Needs more strength",
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "SPEED":
      return "#2563eb";
    case "STRENGTH":
      return "#059669";
    case "ENDURANCE":
      return "#f59e42";
    default:
      return "#64748b";
  }
};

const PerformanceHistoryScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const renderItem = ({ item }: { item: PerformanceEntry }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={[styles.testName, { color: getCategoryColor(item.category) }]}>
          {item.testName}
        </Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.score}>
          {item.score} <Text style={styles.unit}>{item.unit}</Text>
        </Text>
        <Text
          style={[
            styles.improvement,
            { color: item.improvement > 0 ? "#059669" : item.improvement < 0 ? "#ef4444" : "#64748b" },
          ]}
        >
          {item.improvement > 0
            ? `+${item.improvement}%`
            : item.improvement < 0
            ? `${item.improvement}%`
            : "0%"}
        </Text>
      </View>
      <Text style={styles.remarks}>{item.remarks}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance History</Text>
      </View>
      <FlatList
        data={dummyPerformanceHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563eb"]} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default PerformanceHistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  testName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  date: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  score: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  unit: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  improvement: {
    fontSize: 15,
    fontWeight: "700",
  },
  remarks: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
});