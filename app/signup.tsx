import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

const SignupScreen: React.FC = () => {
  // All required fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // Optional
  const [loading, setLoading] = useState(false);

  // For password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // For date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState<Date | undefined>(undefined);

  // For state dropdown
  const [showStateModal, setShowStateModal] = useState(false);

  const handleButton = () => {
    router.push("/loginSign" as any);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      // Format as YYYY-MM-DD
      const iso = selectedDate.toISOString().split("T")[0];
      setDateOfBirth(iso);
    }
  };

  const handleSignup = async () => {
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !gender ||
      !phone ||
      !state ||
      !district ||
      !address ||
      !location ||
      !sport ||
      !category
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate gender
    const allowedGenders = ["MALE", "FEMALE", "OTHER"];
    if (!allowedGenders.includes(gender.trim().toUpperCase())) {
      Alert.alert("Error", "Gender must be MALE, FEMALE, or OTHER");
      return;
    }

    // Prepare sportInterest as an array
    const sportInterest = sport
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (sportInterest.length === 0) {
      Alert.alert("Error", "Please enter at least one sport");
      return;
    }

    // Prepare payload as per your Prisma schema (dateOfBirth optional)
    const athletePayload: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      category: category.trim(),
      gender: gender.trim().toUpperCase(),
      location: location.trim(),
      district: district.trim(),
      state: state.trim(),
      sportInterest,
    };
    if (dateOfBirth) {
      athletePayload.dateOfBirth = dateOfBirth.trim();
    }

    const payload = {
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim(),
      address: address.trim(),
      athlete: athletePayload,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://sai-backend-3-1tq7.onrender.com/api/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Account created successfully!");
        router.push("/loginSign" as any);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.log(error?.response?.data);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>AAROHAN</Text>
              </View>
              <Text style={styles.welcomeText}>Create Your Account</Text>
              <Text style={styles.subtitle}>
                Join the{" "}
                <Text style={styles.brand}>Aarohan</Text> Athlete Community!
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputLeft]}
                  placeholder="First Name"
                  placeholderTextColor="#000000"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                />
                <TextInput
                  style={[styles.input, styles.inputRight]}
                  placeholder="Last Name"
                  placeholderTextColor="#000000"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#000000"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#000000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loading}
              />
              <View style={styles.row}>
                <Pressable
                  style={[styles.input, styles.inputLeft, { justifyContent: "center" }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: dateOfBirth ? "#1f2937" : "#9ca3af" }}>
                    {dateOfBirth ? dateOfBirth : "Date of Birth (optional)"}
                  </Text>
                </Pressable>
                <TextInput
                  style={[styles.input, styles.inputRight]}
                  placeholder="Gender (Male/Female/Other)"
                  placeholderTextColor="#000000"
                  value={gender}
                  onChangeText={setGender}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              {/* Date Picker Modal */}
              {showDatePicker && (
                <DateTimePicker
                  value={dateObj || new Date(2000, 0, 1)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
              <Pressable
                style={styles.input}
                onPress={() => setShowStateModal(true)}
              >
                <Text
                  style={{
                    color: state ? "#1f2937" : "#9ca3af",
                  }}
                >
                  {state ? state : "Select State"}
                </Text>
              </Pressable>
              {/* State Dropdown Modal */}
              <Modal
                visible={showStateModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowStateModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <ScrollView>
                      {STATES.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.stateOption}
                          onPress={() => {
                            setState(item);
                            setShowStateModal(false);
                          }}
                        >
                          <Text style={styles.stateText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.closeModalBtn}
                      onPress={() => setShowStateModal(false)}
                    >
                      <Text style={styles.closeModalText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <TextInput
                style={styles.input}
                placeholder="District"
                placeholderTextColor="#000000"
                value={district}
                onChangeText={setDistrict}
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Complete Address"
                placeholderTextColor="#000000"
                value={address}
                onChangeText={setAddress}
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Training Location/Area"
                placeholderTextColor="#000000"
                value={location}
                onChangeText={setLocation}
                editable={!loading}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputLeft]}
                  placeholder="Your Sports (e.g. Cricket, Football)"
                  placeholderTextColor="#000000"
                  value={sport}
                  onChangeText={setSport}
                  editable={!loading}
                />
                <TextInput
                  style={[styles.input, styles.inputRight]}
                  placeholder="Athlete Category"
                  placeholderTextColor="#000000"
                  value={category}
                  onChangeText={setCategory}
                  editable={!loading}
                />
              </View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#000000"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#000000"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirm((prev) => !prev)}
                >
                  <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
                    {showConfirm ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  loading && styles.signupButtonDisabled,
                ]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? "Creating..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Links */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleButton} style={styles.linkButton}>
                <Text style={styles.linkText}>
                  Already have an account?{" "}
                  <Text style={styles.linkTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms</Text> &{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e0e7ff",
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
    marginBottom: 28,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    marginBottom: 10,
    backgroundColor: "#2563eb",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 2,
  },
  brand: {
    color: "#2563eb",
    fontWeight: "700",
    letterSpacing: 1,
  },
  formContainer: {
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  inputLeft: {
    flex: 1,
    marginRight: 8,
  },
  inputRight: {
    flex: 1,
    marginLeft: 8,
  },
  input: {
    height: 50,
    borderColor: "#c7d2fe",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1f2937",
    backgroundColor: "#f8fafc",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: "center",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eyeButton: {
    position: "absolute",
    right: 18,
    top: 12,
    padding: 4,
    zIndex: 2,
  },
  signupButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.7,
  },
  signupButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
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
    fontWeight: "700",
  },
  termsText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
  termsLink: {
    color: "#2563eb",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "80%",
    maxHeight: "70%",
    alignItems: "center",
  },
  stateOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    width: "100%",
  },
  stateText: {
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center",
  },
  closeModalBtn: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeModalText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});