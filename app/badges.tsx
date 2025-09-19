import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface BadgeEntry {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof iconMap;
  achieved: boolean;
  date?: string;
}

const iconMap = {
  star: "star-circle",
  trophy: "trophy-award",
  run: "run-fast",
  dumbbell: "dumbbell",
  medal: "medal",
  fire: "fire",
  heart: "heart",
  shield: "shield-check",
  lightning: "lightning-bolt",
  target: "target",
  flag: "flag-checkered",
  diamond: "diamond-stone",
  rocket: "rocket",
  crown: "crown",
  leaf: "leaf",
  basketball: "basketball",
  soccer: "soccer",
  swimmer: "swim",
  bike: "bike",
  whistle: "whistle",
  "calendar-check": "calendar-check",
};

const dummyBadges: BadgeEntry[] = [
  {
    id: "1",
    name: "Speedster",
    description: "Completed 20m Sprint under 3.2s",
    icon: "run",
    achieved: true,
    date: "2025-09-01",
  },
  {
    id: "2",
    name: "Strength Champ",
    description: "Standing Long Jump over 2m",
    icon: "dumbbell",
    achieved: true,
    date: "2025-08-28",
  },
  {
    id: "3",
    name: "Endurance Pro",
    description: "Yo-Yo Test Level 15+",
    icon: "fire",
    achieved: true,
    date: "2025-08-25",
  },
  {
    id: "4",
    name: "Shot Put Star",
    description: "Shot Put over 9m",
    icon: "star",
    achieved: false,
  },
  {
    id: "5",
    name: "Consistency",
    description: "No missed tests for 2 months",
    icon: "calendar-check",
    achieved: true,
    date: "2025-08-10",
  },
  {
    id: "6",
    name: "Rising Star",
    description: "Improved in 3 consecutive tests",
    icon: "rocket",
    achieved: true,
    date: "2025-07-30",
  },
  {
    id: "7",
    name: "All Rounder",
    description: "Top 5 in all categories",
    icon: "crown",
    achieved: false,
  },
  {
    id: "8",
    name: "Team Player",
    description: "Participated in team event",
    icon: "soccer",
    achieved: true,
    date: "2025-07-15",
  },
  {
    id: "9",
    name: "Marathoner",
    description: "Completed 10km run",
    icon: "run",
    achieved: false,
  },
  {
    id: "10",
    name: "Sharp Shooter",
    description: "Perfect score in accuracy test",
    icon: "target",
    achieved: false,
  },
  {
    id: "11",
    name: "Defender",
    description: "No fouls in 5 matches",
    icon: "shield",
    achieved: true,
    date: "2025-06-20",
  },
  {
    id: "12",
    name: "Green Athlete",
    description: "Participated in eco event",
    icon: "leaf",
    achieved: true,
    date: "2025-06-10",
  },
  {
    id: "13",
    name: "Basketball Ace",
    description: "Scored 30+ points in a game",
    icon: "basketball",
    achieved: false,
  },
  {
    id: "14",
    name: "Soccer Hero",
    description: "Hat-trick in a match",
    icon: "soccer",
    achieved: false,
  },
  {
    id: "15",
    name: "Swim Champ",
    description: "Won swimming competition",
    icon: "swimmer",
    achieved: true,
    date: "2025-05-15",
  },
  {
    id: "16",
    name: "Cyclist",
    description: "Completed 50km cycling",
    icon: "bike",
    achieved: false,
  },
  {
    id: "17",
    name: "Whistle Master",
    description: "Refereed 10 matches",
    icon: "whistle",
    achieved: true,
    date: "2025-05-01",
  },
  {
    id: "18",
    name: "Diamond Performer",
    description: "Top 1% in leaderboard",
    icon: "diamond",
    achieved: false,
  },
  {
    id: "19",
    name: "Lightning Fast",
    description: "Fastest sprint in event",
    icon: "lightning",
    achieved: true,
    date: "2025-04-20",
  },
  {
    id: "20",
    name: "Trophy Winner",
    description: "Won a tournament",
    icon: "trophy",
    achieved: true,
    date: "2025-04-10",
  },
];

const getBadgeColor = (achieved: boolean) => (achieved ? "#059669" : "#cbd5e1");

const BadgesScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const renderItem = ({ item }: { item: BadgeEntry }) => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: getBadgeColor(item.achieved) }]}>
        <MaterialCommunityIcons
          name={((iconMap[item.icon] || "star-circle") as React.ComponentProps<typeof MaterialCommunityIcons>["name"])}
          size={32}
          color={item.achieved ? "#fff" : "#64748b"}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        {item.achieved && item.date && (
          <Text style={styles.date}>Achieved: {item.date}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
      </View>
      <FlatList
        data={dummyBadges}
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

export default BadgesScreen;

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
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  desc: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#059669",
    marginTop: 2,
    fontWeight: "600",
  },
});