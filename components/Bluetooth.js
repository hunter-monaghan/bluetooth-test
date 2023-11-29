import React, { useState, useEffect } from "react";
import { View, Text, Button, Platform, PermissionsAndroid } from "react-native";
import { BleManager } from "react-native-ble-plx";

const Bluetooth = () => {
  const [devices, setDevices] = useState([]);
  const [manager, setManager] = useState(null);
  console.log('MANAGER: ', manager)
  console.log('DEVICES: ', devices)
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

  const initializeBluetooth = async () => {
    try {
      if (await requestBluetoothPermission()) {
        const bleManager = new BleManager();
        console.log("bleManager: ", bleManager);
        setManager(bleManager);
  
        const subscription = bleManager.onStateChange((state) => {
          console.log("STATE: ", state);
          if (state === "PoweredOn") {
            scanAndConnect(bleManager);
            subscription.remove();
          }
        }, true);
  
        return () => {
          // Cleanup function
          subscription.remove();
        };
      }
    } catch (error) {
      console.error("Bluetooth initialization error:", error);
      // Handle the error, e.g., show a user-friendly message
    }
  };
  
  useEffect(() => {
    const cleanup = initializeBluetooth();
  
    return () => {
      // Cleanup function when the component is unmounted
      cleanup && cleanup();
    };
  }, []);
  
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
    <View>
      <Text>Discovered Devices:</Text>
      {devices.map((device) => (
        <Text key={device.id}>{device.name || "Unnamed Device"}</Text>
      ))}
      <Button title="Scan Devices" onPress={() => scanAndConnect(manager)} />
    </View>
  );
};

export default Bluetooth;
