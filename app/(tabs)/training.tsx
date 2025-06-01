import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Play } from "lucide-react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import axios from "axios";

type Video = {
  _id: string;
  title: string;
  videoURL: string;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function TrainingScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        "https://women-sepia-two.vercel.app/api/tv"
      );
      console.log("Full API Response:", response.data);
      if (response.data && Array.isArray(response.data)) {
        setVideos(response.data);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setVideos(response.data.data);
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderVideoCard = ({ item }: { item: Video }) => {
    const videoId = getYoutubeVideoId(item.videoURL);
    console.log("Video Item:", item);
    console.log("Extracted Video ID:", videoId);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setPlayingVideo(item._id)}>
          <View style={styles.thumbnailContainer}>
            <Image
              source={{
                uri: videoId
                  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                  : undefined,
              }}
              style={styles.thumbnail}
            />
            <View style={styles.playButton}>
              <Play size={24} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.videoTitle}>{item.title}</Text>
        </View>
        {playingVideo === item._id && videoId && (
          <View style={styles.videoPlayer}>
            <YoutubePlayer height={200} videoId={videoId} />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B6A" />
      </View>
    );
  }

  console.log("Current Videos State:", videos);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Videos</Text>
        <Text style={styles.subtitle}>Learn essential safety techniques</Text>
      </View>

      {videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos available</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 200,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 15,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  videoPlayer: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
