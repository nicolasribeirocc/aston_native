import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import NetInfo from '@react-native-community/netinfo'

import logo from "../../../assets/logo512x512.png";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e28222",
    },
    tinyLogo: {
      width: 150,
      height: 150,
      borderRadius: 20,
    },
    text: {
      color: "white",
      padding: 40,
    },
  });
  
  function DisplayAnImage({ navigation }) {
    
  
    const [message, setmessage] = useState("Procurando internet");
  
    useEffect(() => {
  
      const unsubscribe = NetInfo.addEventListener((state) => {
        //console.log("Is InternetReachable?", state.isInternetReachable);
        if (state.isInternetReachable == true) {
          navigation.navigate("Main");
        }
      });
  
      const interval = setInterval(() => {
        setmessage((message) => {
          if (message.length > 28) {
            return "Procurando internet";
          }
          return ". " + message + " .";
        });
      }, 1000);
  
      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    }, []);
  
    return (
      <View style={styles.container}>
        <Image style={styles.tinyLogo} source={logo} />
        <Text style={styles.text}>{message}</Text>
      </View>
    );
  }
  
  export default DisplayAnImage;