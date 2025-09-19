import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "https://sai-backend-3-1tq7.onrender.com/api/social";
const TOKEN_KEY = "token";

const CreatePostScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setMedia({
        uri: asset.uri,
        type: asset.type ? `image/${asset.type}` : "image/jpeg",
        name: asset.fileName || `photo.${asset.uri.split('.').pop()}`,
      });
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Validation", "Content is required.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      let formData = new FormData();
      if (title.trim()) formData.append("title", title);
      formData.append("content", content);
      if (media) {
        formData.append("media", {
          uri: media.uri,
          type: media.type,
          name: media.name,
        } as any);
      }

      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      Alert.alert("Success", "Post created successfully!");
      setTitle("");
      setContent("");
      setMedia(null);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Post</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Title (optional)"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          placeholderTextColor="#94a3b8"
        />
        {media && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: media.uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setMedia(null)}
            >
              <Feather name="x" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.mediaBtn} onPress={pickImage}>
          <Feather name="image" size={20} color="#2563eb" />
          <Text style={styles.mediaBtnText}>
            {media ? "Change Image" : "Add Image"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    padding: 18,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e0e7ef",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  mediaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ef",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  mediaBtnText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  imagePreview: {
    width: 180,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  removeImageBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 2,
    zIndex: 2,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.2,
  },
});