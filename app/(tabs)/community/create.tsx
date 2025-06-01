import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import useUser from "@/hooks/useUser";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUser(); // Custom hook to fetch user data

  const handleSubmit = async () => {
    if (!title || !content) return;

    try {
      setLoading(true);

      if (!user || !user._id) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      const postData = {
        title,
        content,
        userId: user._id,
      };

      await axios.post(
        "https://women-sepia-two.vercel.app/api/community/create-post",
        postData
      );

      Alert.alert("Success", "Post created!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Post Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { minHeight: 120 }]}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            !(title && content) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!(title && content) || loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Posting..." : "Post"}
          </Text>
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
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#FF4B6A",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ffb3c1",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
