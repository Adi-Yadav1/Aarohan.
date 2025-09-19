// import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Dummy academy data
const DUMMY_ACADEMIES = [
  {
    id: "1",
    name: "Elite Sports Academy",
    address: "Sector 14, Sonipat, Haryana",
    sport: "Cricket, Football",
    distance: "2.1 km",
  },
  {
    id: "2",
    name: "Champions Cricket Academy",
    address: "Model Town, Sonipat, Haryana",
    sport: "Cricket",
    distance: "3.5 km",
  },
  {
    id: "3",
    name: "Future Stars Academy",
    address: "Civil Lines, Sonipat, Haryana",
    sport: "Basketball, Volleyball",
    distance: "1.8 km",
  },
  {
    id: "4",
    name: "Pro Football Academy",
    address: "Rai, Sonipat, Haryana",
    sport: "Football",
    distance: "4.2 km",
  },
  {
    id: "5",
    name: "Golden Gloves Boxing Academy",
    address: "Old GT Road, Sonipat, Haryana",
    sport: "Boxing, MMA",
    distance: "2.9 km",
  },
  {
    id: "6",
    name: "Swift Badminton Center",
    address: "Subhash Nagar, Sonipat, Haryana",
    sport: "Badminton",
    distance: "1.5 km",
  },
];

const AcademyLocater = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sports Academy Locator</Text>
          <Text style={styles.subtitle}>Find nearby sports academies in your area</Text>
        </View>

        <View style={styles.academiesList}>
          <Text style={styles.heading}>
            Nearby Sports Academies ({DUMMY_ACADEMIES.length})
          </Text>
          
          {DUMMY_ACADEMIES.map((academy) => (
            <TouchableOpacity
              key={academy.id}
              style={styles.academyCard}
              onPress={() => {
                // Handle navigation to maps
                console.log('Navigate to:', academy.name);
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.academyName}>{academy.name}</Text>
                <Text style={styles.distance}>{academy.distance}</Text>
              </View>
              <Text style={styles.sportType}>{academy.sport}</Text>
              <Text style={styles.academyAddress}>{academy.address}</Text>
              <View style={styles.actionContainer}>
                <Text style={styles.tapToNavigate}>Tap to navigate →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcademyLocater;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  academiesList: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  academyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  academyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
    flex: 1,
  },
  distance: {
    fontSize: 12,
    fontWeight: "500",
    color: "#059669",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sportType: {
    fontSize: 13,
    fontWeight: "500",
    color: "#7c3aed",
    marginBottom: 4,
  },
  academyAddress: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  tapToNavigate: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "500",
  },
});

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied.");
//         setLoading(false);
//         return;
//       }

//       try {
//         let loc = await Location.getCurrentPositionAsync({});
//         setLocation(loc);
//         loadDummyAcademies();
//       } catch (error) {
//         setLocation({
//           coords: {
//             latitude: 28.9845,
//             longitude: 77.0151,
//           },
//         });
//         loadDummyAcademies();
//       }

//       setLoading(false);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const loadDummyAcademies = () => {
//     setTimeout(() => {
//       setAcademies(DUMMY_ACADEMIES);
//     }, 500);
//   };

//   const openMaps = (lat: number, lng: number, label: string) => {
//     const url =
//       Platform.OS === "ios"
//         ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
//         : `geo:${lat},${lng}?q=${encodeURIComponent(label)}`;
//     Linking.openURL(url);
//   };

//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ) => {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const d = R * c; // Distance in km
//     return d.toFixed(1);
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#2563eb" />
//         <Text style={{ marginTop: 12 }}>Loading academies...</Text>
//       </View>
//     );
//   }

//   if (errorMsg) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "red" }}>{errorMsg}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {location && (
//         <MapView
//           style={styles.map}
//           provider={PROVIDER_GOOGLE}
//           initialRegion={{
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}
//           showsUserLocation
//         >
//           {academies.map((academy) => (
//             <Marker
//               key={academy.id}
//               coordinate={{
//                 latitude: academy.latitude,
//                 longitude: academy.longitude,
//               }}
//               title={academy.name}
//               description={`${academy.sport} • ${academy.address}`}
//               onCalloutPress={() =>
//                 openMaps(academy.latitude, academy.longitude, academy.name)
//               }
//               pinColor="#2563eb"
//             />
//           ))}
//         </MapView>
//       )}

//       <View style={styles.listContainer}>
//         <Text style={styles.heading}>
//           Nearby Sports Academies ({academies.length})
//         </Text>
//         <FlatList
//           data={academies}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.academyCard}
//               onPress={() =>
//                 openMaps(item.latitude, item.longitude, item.name)
//               }
//             >
//               <View style={styles.cardHeader}>
//                 <Text style={styles.academyName}>{item.name}</Text>
//                 {location && (
//                   <Text style={styles.distance}>
//                     {calculateDistance(
//                       location.coords.latitude,
//                       location.coords.longitude,
//                       item.latitude,
//                       item.longitude
//                     )}{" "}
//                     km
//                   </Text>
//                 )}
//               </View>
//               <Text style={styles.sportType}>{item.sport}</Text>
//               <Text style={styles.academyAddress}>{item.address}</Text>
//               <View style={styles.actionContainer}>
//                 <Text style={styles.tapToNavigate}>Tap to navigate →</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           ListEmptyComponent={
//             <Text
//               style={{
//                 color: "#64748b",
//                 textAlign: "center",
//                 marginTop: 16,
//               }}
//             >
//               No academies found nearby.
//             </Text>
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//     </View>
//   );
// };

// export default AcademyLocater;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },
//   map: {
//     flex: 1,
//     minHeight: 300,
//   },
//   listContainer: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     marginTop: -24,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//     maxHeight: "50%",
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 16,
//   },
//   academyCard: {
//     backgroundColor: "#f1f5f9",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 4,
//   },
//   academyName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2563eb",
//     flex: 1,
//   },
//   distance: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#059669",
//     backgroundColor: "#ecfdf5",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   sportType: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#7c3aed",
//     marginBottom: 4,
//   },
//   academyAddress: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 8,
//   },
//   actionContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   tapToNavigate: {
//     fontSize: 12,
//     color: "#2563eb",
//     fontWeight: "500",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8fafc",
//   },
// });