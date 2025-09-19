import React, { useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl?: string;
  sport: string;
  score: number;
  unit: string;
  rank: number;
  category: string;
}

const dummyLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Manthan Gohil",
    avatarUrl: "",
    sport: "20m Sprint",
    score: 3.1,
    unit: "seconds",
    rank: 1,
    category: "SPEED",
  },
  {
    id: "2",
    name: "Aditya Sharma",
    avatarUrl: "",
    sport: "Standing Long Jump",
    score: 2.2,
    unit: "meters",
    rank: 2,
    category: "STRENGTH",
  },
  {
    id: "3",
    name: "Priya Singh",
    avatarUrl: "",
    sport: "Yo-Yo Intermittent Recovery",
    score: 16,
    unit: "level",
    rank: 3,
    category: "ENDURANCE",
  },
  {
    id: "4",
    name: "Rahul Verma",
    avatarUrl: "",
    sport: "Shot Put",
    score: 9.1,
    unit: "meters",
    rank: 4,
    category: "STRENGTH",
  },
  {
    id: "5",
    name: "Sneha Patil",
    avatarUrl: "",
    sport: "20m Sprint",
    score: 3.2,
    unit: "seconds",
    rank: 5,
    category: "SPEED",
  },
  {
    id: "6",
    name: "Amit Kumar",
    avatarUrl: "",
    sport: "Standing Long Jump",
    score: 2.15,
    unit: "meters",
    rank: 6,
    category: "STRENGTH",
  },
  {
    id: "7",
    name: "Riya Mehta",
    avatarUrl: "",
    sport: "Yo-Yo Intermittent Recovery",
    score: 15,
    unit: "level",
    rank: 7,
    category: "ENDURANCE",
  },
  {
    id: "8",
    name: "Vikas Yadav",
    avatarUrl: "",
    sport: "Shot Put",
    score: 8.9,
    unit: "meters",
    rank: 8,
    category: "STRENGTH",
  },
  {
    id: "9",
    name: "Kavya Joshi",
    avatarUrl: "",
    sport: "20m Sprint",
    score: 3.3,
    unit: "seconds",
    rank: 9,
    category: "SPEED",
  },
  {
    id: "10",
    name: "Sahil Khan",
    avatarUrl: "",
    sport: "Standing Long Jump",
    score: 2.1,
    unit: "meters",
    rank: 10,
    category: "STRENGTH",
  },
  {
    id: "11",
    name: "Anjali Gupta",
    avatarUrl: "",
    sport: "Yo-Yo Intermittent Recovery",
    score: 14,
    unit: "level",
    rank: 11,
    category: "ENDURANCE",
  },
  {
    id: "12",
    name: "Deepak Saini",
    avatarUrl: "",
    sport: "Shot Put",
    score: 8.7,
    unit: "meters",
    rank: 12,
    category: "STRENGTH",
  },
  {
    id: "13",
    name: "Meena Kumari",
    avatarUrl: "",
    sport: "20m Sprint",
    score: 3.4,
    unit: "seconds",
    rank: 13,
    category: "SPEED",
  },
  {
    id: "14",
    name: "Rohit Singh",
    avatarUrl: "",
    sport: "Standing Long Jump",
    score: 2.05,
    unit: "meters",
    rank: 14,
    category: "STRENGTH",
  },
  {
    id: "15",
    name: "Pooja Rani",
    avatarUrl: "",
    sport: "Yo-Yo Intermittent Recovery",
    score: 13,
    unit: "level",
    rank: 15,
    category: "ENDURANCE",
  },
  {
    id: "16",
    name: "Suresh Kumar",
    avatarUrl: "",
    sport: "Shot Put",
    score: 8.5,
    unit: "meters",
    rank: 16,
    category: "STRENGTH",
  },
  {
    id: "17",
    name: "Nisha Patel",
    avatarUrl: "",
    sport: "20m Sprint",
    score: 3.5,
    unit: "seconds",
    rank: 17,
    category: "SPEED",
  },
  {
    id: "18",
    name: "Arjun Yadav",
    avatarUrl: "",
    sport: "Standing Long Jump",
    score: 2.0,
    unit: "meters",
    rank: 18,
    category: "STRENGTH",
  },
  {
    id: "19",
    name: "Komal Sharma",
    avatarUrl: "",
    sport: "Yo-Yo Intermittent Recovery",
    score: 12,
    unit: "level",
    rank: 19,
    category: "ENDURANCE",
  },
  {
    id: "20",
    name: "Rakesh Kumar",
    avatarUrl: "",
    sport: "Shot Put",
    score: 8.3,
    unit: "meters",
    rank: 20,
    category: "STRENGTH",
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

const LeaderboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const renderItem = ({ item }: { item: LeaderboardEntry }) => (
    <View style={styles.card}>
      <View style={styles.rankCircle}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>
      <Image
        source={
          item.avatarUrl
            ? { uri: item.avatarUrl }
            : require("../assets/images/avator.png")
        }
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.sport, { color: getCategoryColor(item.category) }]}>
          {item.sport}
        </Text>
      </View>
      <View style={styles.scoreBox}>
        <Text style={styles.score}>
          {item.score} <Text style={styles.unit}>{item.unit}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
      </View>
      <FlatList
        data={dummyLeaderboard}
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

export default LeaderboardScreen;

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rankCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e0e7ef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#e0e7ef",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  sport: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  scoreBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  score: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
  },
  unit: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
});