// ProfileSettings.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LANG_KEY = "appLanguage_v1";
const TOKEN_KEY = "token";

const AVAILABLE_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
];

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>("en");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANG_KEY);
        if (savedLang) setLanguage(savedLang);

        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) {
          router.push("/loginSign");
          return;
        }

        const response = await axios.get(
          "https://sai-backend-3-1tq7.onrender.com/api/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          const user = response.data.data.user;
          setProfile(user);
          setEmail(user.email || "");
          setRole(user.role || "");
          if (user.profile) {
            setFirstName(user.profile.firstName || "");
            setLastName(user.profile.lastName || "");
            // setDateOfBirth(
            //   user.athlete.dateOfBirth
            //     ? user.athlete.dateOfBirth.split("T")[0]
            //     : ""
            // );
            setGender(user.profile.gender || "");
            // setPhone(user.profile.phone || "");  
            setState(user.profile.state || "");
            setDistrict(user.profile.district || "");
            setSport(user.profile.sport || "");
            setCategory(user.profile.category || "");
          }
        } else {
          Alert.alert("Error", "Failed to load profile.");
        }
      } catch (err) {
        Alert.alert("Error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    // Profile update not implemented (API does not support it in your schema)
    Alert.alert("Info", "Profile update is not implemented in this demo.");
    await AsyncStorage.setItem(LANG_KEY, language);
  };

  const onLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(LANG_KEY);
            router.push("/loginSign");
          } catch (err) {
            router.push("/loginSign");
          }
        },
      },
    ]);
  };

  const openLanguageModal = () => setModalVisible(true);
  const pickLanguage = (code: string) => {
    setLanguage(code);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Profile & Settings</Text>
              <Text style={styles.subtitle}>Your profile details</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role</Text>
                <TextInput
                  style={styles.input}
                  value={role}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={dateOfBirth}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={gender}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>District</Text>
                <TextInput
                  style={styles.input}
                  value={district}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Sport</Text>
                <TextInput
                  style={styles.input}
                  value={sport}
                  editable={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.input}
                  value={category}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>App Language</Text>
                <TouchableOpacity style={styles.selectInput} onPress={openLanguageModal}>
                  <Text style={styles.selectText}>
                    {
                      AVAILABLE_LANGUAGES.find((l) => l.code === language)?.label ??
                      "Select language"
                    }
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Language selector modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Choose language</Text>
              {AVAILABLE_LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[
                    styles.langRow,
                    language === l.code && styles.langRowActive,
                  ]}
                  onPress={() => pickLanguage(l.code)}
                >
                  <Text
                    style={[
                      styles.langText,
                      language === l.code && styles.langTextActive,
                    ]}
                  >
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 32, justifyContent: "center" },

  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#0f172a", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#64748b", textAlign: "center" },

  formContainer: { marginTop: 8 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8, marginLeft: 4 },
  input: {
    height: 54,
    borderColor: "#d1d5db",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  selectInput: {
    height: 54,
    borderColor: "#d1d5db",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  selectText: { fontSize: 16, color: "#111827" },

  saveButton: {
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: { color: "#ef4444", fontSize: 16, fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
  langRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  langRowActive: { backgroundColor: "#eef2ff" },
  langText: { fontSize: 16, color: "#0f172a" },
  langTextActive: { color: "#2563eb", fontWeight: "700" },
  modalClose: { marginTop: 12, alignItems: "center", paddingVertical: 12 },
  modalCloseText: { color: "#64748b", fontWeight: "600" },
});
