import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Play } from "lucide-react-native";
import YoutubePlayer from "react-native-youtube-iframe";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
};

const VIDEOS: Video[] = [
  {
    id: "1",
    title: "Basic Self Defense Techniques",
    description:
      "Learn essential self-defense moves that could save your life.",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
    youtubeId: "KVpxP3ZZtAc",
  },
  {
    id: "2",
    title: "7 Self-Defense Techniques",
    description:
      "How to stay aware of your surroundings and avoid dangerous situations.",
    thumbnail:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300",
    youtubeId: "T7aNSRoDCmg",
  },
];

export default function TrainingScreen() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const renderVideoCard = ({ item }: { item: Video }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setPlayingVideo(item.id)}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.playButton}>
            <Play size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDescription}>{item.description}</Text>
      </View>
      {playingVideo === item.id && (
        <View style={styles.videoPlayer}>
          <YoutubePlayer height={200} videoId={item.youtubeId} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Videos</Text>
        <Text style={styles.subtitle}>Learn essential safety techniques</Text>
      </View>

      <FlatList
        data={VIDEOS}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  videoDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  videoPlayer: {
    marginTop: 10,
  },
});
