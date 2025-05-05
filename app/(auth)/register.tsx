import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import {
  CameraIcon,
  User,
  Mail,
  Lock,
  Phone,
  Blend,
} from "lucide-react-native";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      setImage(photo?.uri as string);
      setShowCamera(false);
    }
  };

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !emergencyContact ||
      !image ||
      !bloodGroup
    ) {
      return Alert.alert(
        "Error",
        "Please fill in all fields and take a photo."
      );
    }

    const fileInfo = await FileSystem.getInfoAsync(image);
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("emergencyContact", emergencyContact);
    formData.append("bloodGroup", bloodGroup);
    formData.append("image", {
      uri: image,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any); // TypeScript expects Blob, but Expo uses `uri` string

    try {
      const res = await fetch(
        "https://women-sepia-two.vercel.app/api/auth/register",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Registration successful!");
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Registration Failed",
          result.message || "Something went wrong."
        );
      }
    } catch (err) {
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  if (showCamera && hasPermission) {
    return (
      <CameraView style={{ flex: 1 }} facing={"front"} ref={cameraRef}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Text style={styles.captureText}>Capture</Text>
        </TouchableOpacity>
      </CameraView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to stay safe</Text>

      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => setShowCamera(true)}
      >
        <CameraIcon size={20} color="#fff" />
        <Text style={styles.cameraText}>Take Photo</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <User size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Mail size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Lock size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Phone size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Number"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Blend size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Blood Group"
          value={bloodGroup}
          onChangeText={setBloodGroup}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    width: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF4B6A",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4B6A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  cameraText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#FF4B6A",
    padding: 15,
    borderRadius: 50,
  },
  captureText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
