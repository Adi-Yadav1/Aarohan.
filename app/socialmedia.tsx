import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Interfaces matching your response
interface Media {
  id: string;
  url: string;
  mimeType: string;
  type: string;
}

interface Author {
  id: string;
  email: string;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  createdAt: string;
}

interface Like {
  id: string;
  user: Author;
}

interface Post {
  id: string;
  author: Author;
  title?: string | null;
  content: string;
  isFlagged?: boolean;
  isRemoved?: boolean;
  createdAt: string;
  media: Media[];
  comments: Comment[];
  likes: Like[];
}

const API_URL = "https://sai-backend-3-1tq7.onrender.com/api/social/posts";
const TOKEN_KEY = "token";
const LIKE_API = (postId: string) =>
  `https://sai-backend-3-1tq7.onrender.com/api/social/posts/${postId}/like`;

import { router } from "expo-router";

const SocialMedia: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [userId, setUserId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const response = await axios.get(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPosts(response.data.data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load posts.");
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Get userId from AsyncStorage (set this after login/signup in your app)
    AsyncStorage.getItem("userId").then(setUserId);
  }, []);

  const handleLike = async (postId: string, liked: boolean) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        Alert.alert("Error", "You must be logged in to like posts.");
        return;
      }
      if (!liked) {
        // Like the post
        await axios.post(LIKE_API(postId), {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Unlike the post
        await axios.delete(LIKE_API(postId), {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchPosts();
    } catch (err) {
      Alert.alert("Error", "Failed to update like.");
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    Alert.alert("Comment", `Commented: ${text}`);
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCreatePost = () => {
    router.push('/createpost')
  };

  const renderMedia = (media: Media[]) => {
    if (!media || !media.length) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
        {media.map((m) => (
          <Image
            key={m.id}
            source={{ uri: m.url }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    );
  };

  const renderComments = (comments: Comment[]) => {
    if (!comments || !comments.length) return null;
    return (
      <View style={styles.commentsSection}>
        {comments.slice(0, 2).map((c) => (
          <View key={c.id} style={styles.commentRow}>
            <Text style={styles.commentAuthor}>
              <Feather name="user" size={13} color="#2563eb" /> {c.author?.email || "User"}:
            </Text>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        ))}
        {comments.length > 2 && (
          <Text style={styles.moreComments}>View all {comments.length} comments</Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Post }) => {
    if (!item || !Array.isArray(item.likes)) return null;
    const likes = Array.isArray(item.likes) ? item.likes : [];
    const liked = !!likes.find(
      (like) => like.user && userId && like.user.id === userId
    );
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={24} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.authorName}>{item.author.email}</Text>
            <Text style={styles.postDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
        {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
        <Text style={styles.content}>{item.content}</Text>
        {renderMedia(item.media)}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => handleLike(item.id, liked)}
            style={styles.actionBtn}
          >
            <MaterialCommunityIcons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#ef4444" : "#2563eb"}
              style={{ marginRight: 2 }}
            />
            <Text style={styles.actionText}>{item.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Feather name="message-circle" size={20} color="#2563eb" style={{ marginRight: 2 }} />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
        {renderComments(item.comments)}
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#94a3b8"
            value={commentText[item.id] || ""}
            onChangeText={(text) =>
              setCommentText((prev) => ({ ...prev, [item.id]: text }))
            }
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => handleComment(item.id)}
          >
            <Feather name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12, color: "#2563eb", fontWeight: "600" }}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {/* Floating Create Post Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Feather name="plus" size={32} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchPosts();
          }} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#64748b" }}>No posts found.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SocialMedia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e0e7ef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  postDate: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 4,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  content: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 8,
    marginTop: 2,
    lineHeight: 22,
  },
  mediaRow: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 2,
  },
  mediaImage: {
    width: 220,
    height: 140,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: "#e0e7ef",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 2,
    gap: 18,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 15,
    color: "#2563eb",
    fontWeight: "700",
    marginLeft: 2,
  },
  commentsSection: {
    marginTop: 8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 4,
  },
  commentAuthor: {
    fontWeight: "700",
    color: "#2563eb",
    fontSize: 13,
    marginRight: 2,
  },
  commentText: {
    color: "#334155",
    fontSize: 14,
  },
  moreComments: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e0e7eb",
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#2563eb",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    zIndex: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
});