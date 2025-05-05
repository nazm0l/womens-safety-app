import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Phone, Search } from "lucide-react-native";

type Category = "all" | "police" | "hospital" | "ngo";
type Helpline = {
  id: string;
  name: string;
  phone: string;
  category: Category;
  image: string;
};

const HELPLINES: Helpline[] = [
  {
    id: "1",
    name: "Emergency Police",
    phone: "911",
    category: "police",
    image: "https://images.unsplash.com/photo-1584446922442-7ac6b8c118f4?w=300",
  },
  {
    id: "2",
    name: "Women Helpline",
    phone: "1091",
    category: "ngo",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300",
  },
  {
    id: "3",
    name: "Emergency Hospital",
    phone: "102",
    category: "hospital",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300",
  },
];

export default function HelplinesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const categories: { id: Category; label: string }[] = [
    { id: "all", label: "All" },
    { id: "police", label: "Police" },
    { id: "hospital", label: "Hospital" },
    { id: "ngo", label: "NGO" },
  ];

  const filteredHelplines = HELPLINES.filter(
    (helpline) =>
      selectedCategory === "all" || helpline.category === selectedCategory
  );

  const renderHelplineCard = ({ item }: { item: Helpline }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.phoneContainer}>
          <Phone size={16} color="#666" />
          <Text style={styles.phoneNumber}>{item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Helplines</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search helplines...</Text>
        </View>
      </View>

      <View style={styles.categories}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.id &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <FlatList
        data={filteredHelplines}
        renderItem={renderHelplineCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
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
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
  },
  categories: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  categoryButtonActive: {
    backgroundColor: "#FF4B6A",
  },
  categoryButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
  list: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
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
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneNumber: {
    marginLeft: 6,
    color: "#666",
    fontSize: 14,
  },
});
