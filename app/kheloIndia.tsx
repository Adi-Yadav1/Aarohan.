import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const KHELO_INDIA_URL = "https://kheloindia.gov.in/";

const KheloIndiaScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Khelo India</Text>
      </View>
      <WebView
        source={{ uri: KHELO_INDIA_URL }}
        style={styles.webview}
        startInLoadingState
      />
    </SafeAreaView>
  );
};

export default KheloIndiaScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  webview: {
    flex: 1,
  },
});