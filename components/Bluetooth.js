import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Platform,
  FlatList,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
const windowWidth = Dimensions.get('window').width;

const Bluetooth = () => {
  const [devices, setDevices] = useState([]);
  const [manager, setManager] = useState(null);
  console.log("MANAGER: ", manager);
  console.log("DEVICES: ", devices);
  //   const manager = new BleManager();

  const requestBluetoothPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    if (
      Platform.OS === "android" &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    this.showErrorToast("Permission have not been granted");

    return false;
  };

  const initializeBluetooth = () => {
    if (manager) {
      console.log("BleManager instance already exists");
      return;
    }

    const bleManager = new BleManager();
    console.log('BLE MANAGER: ', bleManager)
    setManager(bleManager);

    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        scanAndConnect(bleManager);
        subscription.remove();
      }
    }, true);

    return () => {
      // Cleanup function
      subscription.remove();
      bleManager.stopDeviceScan();
    };
  };

  const requestAndInitializeBluetooth = async () => {
    if (await requestBluetoothPermission()) {
      initializeBluetooth();
    }
  };

  useEffect(() => {
    requestAndInitializeBluetooth();

    // Cleanup function when the component is unmounted
    return () => {
      // Destroy BleManager instance if it exists
      manager && manager.destroy();
    };
  }, [manager]);

  //   const scanAndConnect = (bleManager) => {
  //     console.log('BLE MANAGER: ', bleManager)
  //     if (!bleManager) {
  //       console.error("BleManager is null");
  //       return;
  //     }

  //     bleManager.startDeviceScan(null, null, (error, device) => {
  //       if (error) {
  //         console.error("Error during device scan:", error);
  //         return;
  //       }

  //       if (device) {
  //         console.log("Discovered device:", device.name, device.id);
  //         if (device.name === "TI BLE Sensor Tag" || device.name === "SensorTag") {
  //           bleManager.stopDeviceScan();
  //           setDevices((prevDevices) => [...prevDevices, device]);
  //         }
  //       }
  //     });
  //   };

  const scanAndConnect = (bleManager) => {
    if (!bleManager) {
      console.error("BleManager is null");
      return;
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Error during device scan:", error);
        return;
      }

      if (device && !devices.some((d) => d.id === device.id)) {
        console.log("Discovered device:", device.name, device.id);
        bleManager.stopDeviceScan();
        setDevices((prevDevices) => [...prevDevices, device]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discovered Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text style={styles.deviceText}>
              {item.name || "Unnamed Device"}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => scanAndConnect(manager)}
      >
        <Text style={styles.buttonText}>Scan Devices</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Bluetooth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:'5%',
    width: windowWidth,
    backgroundColor: "#DDDDDD",
    borderRadius: '30%'
  },
  heading: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  deviceText: {
    fontSize: 16,
    marginBottom: 4,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   PermissionsAndroid,
//   StyleSheet,
//   Platform
// } from "react-native";
// import { BleManager } from "react-native-ble-plx";

// const Bluetooth = () => {
//   const [devices, setDevices] = useState([]);
//   const [manager, setManager] = useState(null);
//   console.log("MANAGER: ", manager);

//   const requestBluetoothPermission = async () => {
//     if (Platform.OS === "ios") {
//       return true;
//     }
//     if (
//       Platform.OS === "android" &&
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     ) {
//       const apiLevel = parseInt(Platform.Version.toString(), 10);

//       if (apiLevel < 31) {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       if (
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
//       ) {
//         const result = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         ]);

//         return (
//           result["android.permission.BLUETOOTH_CONNECT"] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           result["android.permission.BLUETOOTH_SCAN"] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           result["android.permission.ACCESS_FINE_LOCATION"] ===
//             PermissionsAndroid.RESULTS.GRANTED
//         );
//       }
//     }

//     // Handle the error case or show a user-friendly message
//     return false;
//   };

//   const initializeBluetooth = async () => {
//     try {
//       if (await requestBluetoothPermission()) {
//         const bleManager = new BleManager();
//         setManager(bleManager);

//         const subscription = bleManager.onStateChange((state) => {
//           if (state === "PoweredOn") {
//             scanDevices(bleManager);
//             subscription.remove();
//           }
//         }, true);

//         return () => {
//           // Cleanup function
//           subscription.remove();
//         };
//       }
//     } catch (error) {
//       console.error("Bluetooth initialization error:", error);
//     }

//     // Return an empty cleanup function if initialization fails
//     return () => {};
//   };

//   useEffect(() => {
//     const cleanup = initializeBluetooth();

//     return () => {
//       // Cleanup function when the component is unmounted
//       cleanup && cleanup();
//     };
//   }, []);

//   const scanDevices = (bleManager) => {
//     if (!bleManager) {
//       console.error("BleManager is null");
//       return;
//     }

//     bleManager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.error("Error during device scan:", error);
//         return;
//       }

//       if (device && !devices.some((d) => d.id === device.id)) {
//         console.log("Discovered device:", device.name, device.id);
//         bleManager.stopDeviceScan();
//         setDevices((prevDevices) => [...prevDevices, device]);
//         connectToDevice(device);
//       }
//     });
//   };

//   const connectToDevice = async (device) => {
//     try {
//       await device.connect();
//       console.log("Connected to device:", device.name, device.id);

//       // Perform any additional operations with the connected device
//       // (e.g., read/write characteristics)
//     } catch (error) {
//       console.error("Connection error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Discovered Devices:</Text>
//       <FlatList
//         data={devices}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => connectToDevice(item)}>
//             <Text style={styles.deviceText}>{item.name || "Unnamed Device"}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default Bluetooth;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   heading: {
//     fontSize: 18,
//     marginTop: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   deviceText: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
// });
