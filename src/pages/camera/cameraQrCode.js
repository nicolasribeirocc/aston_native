import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Platform, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import imgQrCode from '../../../assets/icon-search-qr-code.png';
//import api from "../../services/api";

export default function CameraQrCode({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [typeSent, setTypeSent] = useState("barCode");

  const [titleButton, setTitleButton] = useState("Digitar código de barras.");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    const { typeScan } = route.params;
    //console.log(typeScan);
    setTypeSent(typeScan);
    //setTypeSent("qrCode");
    if (typeScan == "qrCode") {
      setTitleButton("Voltar");
    }
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    //console.log(type);
    //console.log(typeSent);
    //console.log(data);
    let valido = true;

    if (typeSent == "codeBar" && type == "256") {
      valido = false;
      return false;
    }

    // if(typeSent != 'codeBar' && type != '256'){
    //   valido = false;
    //   return false;
    // }

    if (valido) {
      navigation.navigate("Main", {
        qrCode: data,
        qrCodeType: type,
      });
    }

    try {
    } catch (_err) {
      console.log(_err);
    }
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.textAlert}>
        <Text>Acessando a camêra...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.textAlert}>
        <Text>Sem acesso a camêra...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        // marginTop:100,
        // marginBottom: 100,
        // marginLeft: 50,
        // marginRight: 50,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={
          typeSent == "codeBar"
            ? styles.borderTypeCodeBar
            : styles.borderTypeQrCode
        }
      >
        {typeSent == "qrCode" && (<Image style={styles.imgQrCode} source={imgQrCode} />)}
        
        <View
          style={typeSent == "codeBar" ? styles.typeCodeBar : styles.typeQrCode}
        ></View>
      </View>

      {scanned && (
        <Button title={"Tentar novamente"} onPress={() => setScanned(false)} />
      )}
      <View
        style={styles.button}
      >
        <Button color={Platform.select({ios: "#fff", android: "rgba(63, 81, 181, .6)"})} title={titleButton} onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  typeCodeBar: {
    width: 2,
    height: "80%",
    borderWidth: 2,
    borderColor: "#5f6",
  },
  borderTypeCodeBar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(63, 81, 181, .6)",
    borderWidth: 80,
    borderTopWidth: 15,
    borderBottomWidth: 15,
    borderRightWidth: 90,
    borderLeftWidth: 90,
  },
  typeQrCode: {
    
  },
  borderTypeQrCode: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(63, 81, 181, .6)",
    borderTopWidth: 100,
    borderBottomWidth: 100,
    borderRightWidth: 30,
    borderLeftWidth: 30,
  },
  imgQrCode: {
    width: 200,
    height: 200,
    opacity: 0.1
  },
  textAlert: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "rgba(63, 81, 181, .6)",
    color: '#fff',
    tintColor: '#fff'
  },
});
