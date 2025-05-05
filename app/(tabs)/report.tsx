import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  MapPin,
  FileText,
  Upload,
  ImageIcon,
} from "lucide-react-native";

export default function ReportScreen() {
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [createdBy, setCreatedBy] = useState<string>("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
          setCreatedBy(parsed._id);
        }
      } catch (err) {
        console.log("Failed to load user ID", err);
      }
    };

    fetchUserId();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission required", "Please grant gallery access");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result?.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!description || !address || !image) {
      return Alert.alert(
        "Error",
        "Please fill all fields and select an image."
      );
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("address", address);
    formData.append("status", "pending");
    formData.append("createdBy", createdBy);
    formData.append("evidence", {
      uri: image.uri,
      name: "evidence.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const res = await fetch(
        "https://women-sepia-two.vercel.app/api/rcm/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Report submitted successfully");
        setDescription("");
        setAddress("");
        setImage(null);
      } else {
        Alert.alert("Error", result.message || "Submission failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report Child Marriage</Text>
        <Text style={styles.subtitle}>Help prevent child marriage</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Enter location address"
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what happened..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {image && (
          <Image
            source={{ uri: image?.uri }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 10,
              marginBottom: 15,
            }}
          />
        )}

        <TouchableOpacity style={styles.evidenceButton} onPress={pickImage}>
          <ImageIcon size={24} color="#666" />
          <Text style={styles.evidenceButtonText}>Select Photo Evidence</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Upload size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  textAreaContainer: {
    alignItems: "flex-start",
  },
  textArea: {
    height: 120,
  },
  evidenceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  evidenceButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4B6A",
    borderRadius: 10,
    padding: 15,
  },
  submitButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
