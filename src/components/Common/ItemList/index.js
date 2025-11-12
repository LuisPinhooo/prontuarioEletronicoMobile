import { StyleSheet, View, FlatList, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ItemList({ data, onItemPress, renderTitle, renderSubtitle }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem} 
      onPress={() => onItemPress && onItemPress(item)}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{renderTitle(item)}</Text>
        <Text style={styles.itemSubtitle}>{renderSubtitle(item)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#2ecc71" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});