import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Bluetooth from "./components/Bluetooth";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>SCAN FOR BLUETOOTH CONNECTIONS!</Text>
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
    marginTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',

  },
  // bluetoothView: {
  //   marginBottom: "20px",
  //   marginTop: "40px",
  //   paddingTop: '10px'
  // },
});
