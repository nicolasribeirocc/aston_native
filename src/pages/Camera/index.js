import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Platform,
  Image,
  BackHandler,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import imgQrCode from "../../../assets/icon-search-qr-code.png";

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

  BackHandler.addEventListener("hardwareBackPress", () => {
    navigation.goBack();
  });

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
        {typeSent == "qrCode" && (
          <Image style={styles.imgQrCode} source={imgQrCode} />
        )}

        <View
          style={typeSent == "codeBar" ? styles.typeCodeBar : styles.typeQrCode}
        ></View>
      </View>

      {scanned && (
        <Button title={"Tentar novamente"} onPress={() => setScanned(false)} />
      )}
      <View style={styles.button(typeSent)}>
        <Button
          color={Platform.select({ ios: "#fff", android: "#e28222" })}
          title={titleButton}
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  typeCodeBar: {
    width: 2,
    height: "100%",
    borderWidth: 2,
    borderColor: "#5f6",
  },
  borderTypeCodeBar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  typeQrCode: {},
  borderTypeQrCode: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imgQrCode: {
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  textAlert: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: (typeSent) => ({
    backgroundColor: "#e28222",
    color: "#fff",
    tintColor: "#fff",
    left: typeSent == "codeBar" ? -40 : 0,
    position: "absolute",
    top: typeSent == "codeBar" ? "50%" : undefined,
    margin: "auto",
    right: typeSent == "codeBar" ? undefined : 0,
    bottom: typeSent == "codeBar" ? undefined : "15%",
    transform:
      typeSent == "codeBar" ? [{ rotate: "90deg" }] : [{ rotate: "0deg" }],
  }),
});
