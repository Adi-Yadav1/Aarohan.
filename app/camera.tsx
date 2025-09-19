// import { Camera } from "expo-camera";
// import React, { useEffect, useState } from "react";
// import {
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const CameraScreen: React.FC = () => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [cameraOpen, setCameraOpen] = useState(false);
//   const [cameraType, setCameraType] = useState<typeof Camera.Constants.Type>(
//     Camera.Constants.Type.back
//   );

//   useEffect(() => {
//     // Ask for camera permission
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return (
//       <View style={styles.center}>
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (hasPermission === false) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           Camera access denied. Please enable it in settings.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {!cameraOpen ? (
//         <View style={styles.center}>
//           <TouchableOpacity
//             style={styles.openButton}
//             onPress={() => setCameraOpen(true)}
//           >
//             <Text style={styles.openButtonText}>Open Camera</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={styles.cameraWrapper}>
//           <Camera style={styles.camera} type={cameraType} />

//           {/* Toggle front/back camera */}
//           <TouchableOpacity
//             style={[styles.actionButton, { left: 20 }]}
//             onPress={() =>
//               setCameraType((prev) =>
//                 prev === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               )
//             }
//           >
//             <Text style={styles.buttonText}>Flip</Text>
//           </TouchableOpacity>

//           {/* Close camera */}
//           <TouchableOpacity
//             style={[styles.actionButton, { right: 20 }]}
//             onPress={() => setCameraOpen(false)}
//           >
//             <Text style={styles.buttonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default CameraScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: { color: "red", textAlign: "center" },
//   openButton: {
//     backgroundColor: "#2563eb",
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 12,
//   },
//   openButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   cameraWrapper: { flex: 1 },
//   camera: { flex: 1 },
//   actionButton: {
//     position: "absolute",
//     bottom: 40,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
// });
