import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
  Button,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

// 👉 Change this to your Django backend (use IP if testing on real phone)
const API_BASE_URL = "http://10.5.8.183:8000/api/auth";


const LoginScreen: React.FC = () => {
  const [role, setRole] = useState<"admin" | "athlete">("admin");
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!contact || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    if (!validateEmail(contact.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Call Django JWT login endpoint
      const response = await axios.post(
        `${API_BASE_URL}/token/`,
        {
          email: contact.trim(),
          password: password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const { access, refresh } = response.data;

        // Save tokens securely
        await AsyncStorage.setItem("access_token", access);
        await AsyncStorage.setItem("refresh_token", refresh);

        console.log("✅ Login successful, token:", access);

        // 🔹 Optionally fetch user role from a protected endpoint
        const userResponse = await axios.get(`${API_BASE_URL}/me/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        const userRole = userResponse.data.role; // e.g. "ADMIN" or "ATHLETE"

        if (userRole === "ADMIN") {
          router.push("/adminHome");
        } else {
          router.push("/home");
        }
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  const handleButton = () => {
    router.push("/home");
  };
  const handleButtonAdmin = () => {
    router.push("/adminHome");
  };

  const handleForgot = () => {
    Alert.alert("Info", "Forgot password screen will be created soon");
  };

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
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>
             <Button
        title="User Home "
        onPress={handleButton}
      />
             <Button
        title="Admin HOme"
        onPress={handleButtonAdmin}
      />
        
            <View style={styles.roleSwitch}>
              <TouchableOpacity
                style={[styles.roleButton, role === "admin" && styles.activeRole]}
                onPress={() => setRole("admin")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "admin" && styles.activeRoleText,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "athlete" && styles.activeRole,
                ]}
                onPress={() => setRole("athlete")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "athlete" && styles.activeRoleText,
                  ]}
                >
                  Athlete
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor="#94a3b8"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: 16 }}
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Links */}
            <View style={styles.footer}>
              {role === "athlete" && (
                <TouchableOpacity
                  onPress={handleSignup}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkText}>
                    Don't have an account?{" "}
                    <Text style={styles.linkTextBold}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.linkButton} onPress={handleForgot}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "400",
  },
  roleSwitch: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeRole: {
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  roleText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  activeRoleText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderColor: "#d1d5db",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  linkText: {
    color: "#64748b",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "400",
  },
  linkTextBold: {
    color: "#2563eb",
    fontWeight: "600",
  },
  forgotPasswordText: {
    color: "#2563eb",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
  },
});
