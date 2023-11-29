import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Bluetooth from "./components/Bluetooth";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>SCAN FOR BLUETOOTH CONNECTIONS!</Text> */}
      <View style={styles.bluetoothView}>
        <Bluetooth />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
    marginBottom: "20%",
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    borderRadius: "30%",
  },
  bluetoothView: {},
  text: {
    fontWeight: "bold",
    fontSize: "20%",
    color: "black",
    // backgroundColor: '#007AFF'
  },
});
