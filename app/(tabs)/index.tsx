import { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TriangleAlert,
  Phone,
  Video,
  Users,
  FileText,
  User,
} from "lucide-react-native";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [volumeDownCount, setVolumeDownCount] = useState(0);
  const [emergencyContact, setEmergencyContact] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location as any);

      // Fetch user's emergency contact
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setEmergencyContact(user.emergencyContact);
        }
      } catch (error) {
        console.error("Failed to load emergency contact:", error);
      }
    })();
  }, []);

  const handleSOS = async () => {
    if (!location) {
      alert("Location not available");
      return;
    }

    if (!emergencyContact) {
      alert("Emergency contact not set. Please set it in your profile.");
      return;
    }

    const message = `🚨 SOS ALERT 🚨
Google Maps Location: https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;

    try {
      const payload = new URLSearchParams();
      payload.append(
        "token",
        "909316362717460957872c9cf32a5a721c8785998094cb1da059"
      );
      payload.append("to", emergencyContact);
      payload.append("message", message);

      const response = await axios.post(
        "https://api.bdbulksms.net/api.php",
        payload
      );

      console.log("SMS sent response:", response.data);

      alert("SOS SMS sent successfully!");
    } catch (error) {
      console.error("SMS sending error:", error);
      alert("Failed to send SMS. Please try again.");
    }
  };
  const navigationCards = [
    {
      title: "Helplines",
      icon: Phone,
      route: "/helplines",
      color: "#FF6B6B",
    },
    {
      title: "Training",
      icon: Video,
      route: "/training",
      color: "#4ECDC4",
    },
    {
      title: "Community",
      icon: Users,
      route: "/community",
      color: "#45B7D1",
    },
    {
      title: "Report",
      icon: FileText,
      route: "/report",
      color: "#96CEB4",
    },
    {
      title: "Profile",
      icon: User,
      route: "/profile",
      color: "#FFEEAD",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOS}
            onLongPress={handleSOS}
          >
            <TriangleAlert size={64} color="#fff" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          <Text style={styles.helpText}>Press and hold for emergency</Text>
          <Text style={styles.infoText}>
            {Platform.OS === "web"
              ? "Press arrow down key 3 times quickly to activate SOS"
              : "Triple press volume down button to activate SOS"}
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {navigationCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => router.push(card.route as any)}
            >
              <card.icon size={32} color="#fff" />
              <Text style={styles.cardText}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  sosButton: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    borderRadius: (Dimensions.get("window").width * 0.6) / 2,
    backgroundColor: "#FF4B6A",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  helpText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  card: {
    width: "47%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});
