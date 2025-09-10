import { Text,StyleSheet,TouchableOpacity, View, Dimensions,} from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  
  // Calcula a largura do item com base na tela para ocupar toda a largura
  const { width } = Dimensions.get("window");
  const itemWidth = width - 40; // 20 de padding de cada lado
  
  export default function MenuItem({ iconName, text, color }) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={40} color={color} />
          </View>
          <Text style={styles.menuText}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      alignItems: "center", 
      marginBottom: 20, 
    },
    menuItem: {
      width: itemWidth, 
      backgroundColor: "#2ecc71", 
      borderRadius: 15, 
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      marginBottom: 10,
    },
    menuText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff", 
      textAlign: "center",
    },
  });