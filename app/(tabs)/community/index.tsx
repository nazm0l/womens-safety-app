import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Heart, MessageCircle, Share2 } from "lucide-react-native";
import { router } from "expo-router";
import useUser from "@/hooks/useUser";

type Comment = {
  _id: string;
  text: string;
  commentedBy: string;
  createdAt: string;
};

type Post = {
  _id: string;
  title: string;
  content: string;
  createdBy: string | null;
  comments: Comment[];
  createdAt: string;
};

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const user = useUser(); // Custom hook to fetch user data

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        "https://women-sepia-two.vercel.app/api/community/posts"
      );
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleCommentSubmit = async (postId: string) => {
    const commentText = commentInput[postId];
    if (!commentText?.trim()) return;

    try {
      const res = await fetch(
        `https://women-sepia-two.vercel.app/api/comment/post/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentText,
            userId: user?._id,
          }),
        }
      );

      if (res.ok) {
        fetchPosts(); // Refresh posts after submitting comment
        setCommentInput((prev) => ({ ...prev, [postId]: "" })); // Clear input
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <Text style={styles.authorName}>{item.title}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.content}>{item.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item._id)}
        >
          <Heart
            size={20}
            color={likedPosts.has(item._id) ? "#FF4B6A" : "#666"}
            fill={likedPosts.has(item._id) ? "#FF4B6A" : "none"}
          />
          <Text style={styles.actionText}>
            {likedPosts.has(item._id) ? "1" : "0"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            setExpandedPostId(expandedPostId === item._id ? null : item._id)
          }
        >
          <MessageCircle size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {expandedPostId === item._id && (
        <View style={styles.commentSection}>
          {item.comments.map((comment) => (
            <View key={comment._id} style={styles.comment}>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentTimestamp}>
                {new Date(comment.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          ))}

          <TextInput
            placeholder="Write a comment..."
            style={styles.input}
            value={commentInput[item._id] || ""}
            onChangeText={(text) =>
              setCommentInput((prev) => ({ ...prev, [item._id]: text }))
            }
          />

          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => handleCommentSubmit(item._id)}
          >
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with others</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF4B6A"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/community/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
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
  list: {
    padding: 15,
  },
  post: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  commentSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  comment: {
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentTimestamp: {
    fontSize: 10,
    color: "#999",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  commentButton: {
    marginTop: 10,
    backgroundColor: "#FF4B6A",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF4B6A",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});
