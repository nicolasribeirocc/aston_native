import React, { useState, useEffect, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  Share,
  Alert,
  Linking,
  BackHandler,
} from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
// import * as Permissions from "expo-permissions";
import { WebView } from "react-native-webview";
// import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

import api from "../../services/api";
import base64 from "react-native-base64";

import { StatusBar } from "expo-status-bar";

import { BarCodeScanner } from "expo-barcode-scanner";


import * as LocalAuthentication from "expo-local-authentication";

import * as Application from 'expo-application';


import {
  saveTokenFingerPrint,
  getTokenFingerPrint,
  removeTokenFingerPrint,
} from "../fingerPrint/auth";

import * as Contacts from 'expo-contacts';
import { useRef } from "react";


export default function Main({ route, navigation }) {
  const devMode = false;
  const testAndroid51 = false;
  //const baseUrl = "https://bronzato.com.br/Xapp/ag05";
  const baseUrl = "https://contause.digital/Xapp/ag19";
  const urlInicial = `${baseUrl}/usuario.php?s=1`;
  // const urlInicial = `${baseUrl}/criaPFF.php`;
  //const urlInicial = `${baseUrl}/usuario.php?s=1&dev`; //modo DEV
  const platform = Platform.OS;
  const [keyWebview, seTkeyWebview] = useState(0);
  const [url, setUrl] = useState(urlInicial);
  const [urlAtual, setUrlAtual] = useState(urlInicial);

  const [source, setSource] = useState({});
  const [digest, setDigest] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [textFingerPrint, setTextFingerPrint] = useState("Login digital?");
  const [fingerPrintToken, setFingerPrintToken] = useState("");
  const [typeFingerPrint, setTypeFingerPrint] = useState("");
  const [fingerPrintTokenPost, setFingerPrintTokenPost] = useState("");

  const [notification, setnotification] = useState({});
  const [displayToken, setdisplayToken] = useState(false);
  const [timerdisplayToken, settimerdisplayToken] = useState(0);

  const [applicationId, setapplicationId] = useState(0);


  useEffect(() => {
    (async () => {
      removeToken2fa();
      const token = await getTokenFingerPrint();
      if (token) {
        //console.log(token);
        //console.log(url);
        //console.log(fingerPrintTokenPost);
        setFingerPrintToken(token);
      }
    })();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.addNotificationReceivedListener(_handleNotification);
    Notifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );
    return () => {
      //console.log('fim');
    };
  }, []);

  _handleNotification = (notification) => {
    setnotification(notification);
  };

  _handleNotificationResponse = (response) => {
    const parametro = response.notification.request.content.data.body.parametro;
    //console.log("_handleNotificationResponse", parametro);
    if (urlAtual.includes("?")) {
      //console.log(url + `&parametros=${parametro}`);
      setUrl(urlAtual + `&parametros=${parametro}`);
    } else {
      //console.log(url + `?parametros=${parametro}`);
      setUrl(urlAtual + `?parametros=${parametro}`);
    }
  };

  Object.size = function (obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  useEffect(() => {
    if (route.params) {
      //console.log("route.params", );
      const { qrCode, fingerPrintEnabled } = route.params;

      if (qrCode != "") {
        if (
          typeof qrCode != "undefined" &&
          qrCode.includes("otpauth://totp/")
        ) {
          let OBqrCode = qrCode.split("otpauth://totp/");
          let docId = OBqrCode[1].split("?")[0];
          let secret = OBqrCode[1].split("secret=")[1].split("&")[0];
          let obj = { docId, secret };
          //console.log(Object.size(obj));
          if (Object.size(obj) == 2) {
            saveToken2fa(obj);
            handleToken("habilitar");
          }
          //alert(qrCode);
        } else {
          webViewRef.injectJavaScript(`receiveBarCode('${qrCode}');`);
        }

        route.params.qrCode = "";
      }

      if (fingerPrintEnabled) {
        route.params.fingerPrintEnabled = false;

        if (typeFingerPrint == "enabled") {
          saveTokenFingerPrint(documentId);
        }

        if (typeFingerPrint == "login") {
          //console.log("LOGANDO");
          setUrl(`${baseUrl}/usuario.php?rand=${Math.random()}&loginFinger`);
          setFingerPrintTokenPost(fingerPrintToken);
        }
        //alert(`Pode logar o usuario ${documentId}`);
      }
    }
    return () => {
      //apagar os params do route
    };
  }, [route.params]);

  supportAuthentication = async () => {
    const result = await LocalAuthentication.supportedAuthenticationTypesAsync();
    //alert(result);
    createTwoButtonAlert("Habilitar login com a digital?", "habilitar");
  };

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      supportAuthentication();
      //alert("有効なデバイスです");
    }
  };

  const createTwoButtonAlert = (textButton = "Login digital?", typeButton) => {
    const button1 = {
      text: "sim",
      onPress: () => navigation.navigate("FingerPrint"),
    };
    const button2 = {
      text: "não",
      onPress: () => {},
    };
    const button3 = {
      text: "desabilitar",
      onPress: () => {
        setFingerPrintToken("");
        setFingerPrintTokenPost("");
        removeTokenFingerPrint();
      },
      style: "cancel",
    };
    var buttons = [button1, button2];
    if (typeButton == "login") {
      buttons = [button1, button2, button3];
    }
    Alert.alert("Login Digital", textButton, buttons, { cancelable: true });
  };

  async function getAuthTokenFingerPrint(user) {
    const authTokenFingerPrintSave = await AsyncStorage.getItem(user);
    if (authTokenFingerPrintSave !== null) {
    } else {
    }
    //seTkeyWebview(keyWebview + 1);
  }

  async function getAuthToken() {


    if(Constants.platform.ios){
      Application.getIosIdForVendorAsync().then(data=>{
        setapplicationId(data);
      });
    }else{
      setapplicationId(Application.androidId);
    }

    console.log("applicationId: " + applicationId)


    const authTokenSave = await AsyncStorage.getItem("authToken");
    if (authTokenSave !== null) {
      api.defaults.headers[`Authorization`] = `Basic ${authTokenSave}`;
      setDigest(authTokenSave);
    } else {
      // const deviceId = Constants.installationId;
      const deviceId = applicationId;
      const creatRandom = getRandomIntInclusive(11111111, 99999999);
      const authTokenNew = base64.encode(`${deviceId}:${creatRandom}`);
      await AsyncStorage.setItem("authToken", authTokenNew);
      api.defaults.headers[`Authorization`] = `Basic ${authTokenNew}`;
      setDigest(authTokenNew);
    }
    seTkeyWebview(keyWebview + 1);
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Add a request interceptor
  api.interceptors.request.use(function (config) {
    //console.log('config.headers[sasasas]', config.headers[`Authorization`]);
    if (digest != "") {
      config.headers[`Authorization`] = `Basic ${digest}`;
    }
    return config;
  });

  useEffect(() => {
    getAuthToken();
  }, [setDigest]);

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { status } = await BarCodeScanner.requestPermissionsAsync();

        if (status !== "granted") {
          alert("Desculpe, você precisa de permissão para acessar as fotos!");
        }
      }
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (Constants.platform.ios) {
  //       const { status } = await Permissions.askAsync(Permissions.CONTACTS);
  //       if (status !== "granted") {
  //         alert("Desculpe, você precisa de permissão para acessar os contatos!");
  //       }
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    // buscarContatos("8");
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable == false) {
        //setInternetReachable(state.isInternetReachable);
        navigation.navigate("NoConnection");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  handlerReload = () => {
    seTkeyWebview(keyWebview + 1);
  };
  //const jsCode = ``;

  const buscarContatos = async (id_new) => {

    // console.log("id_new::::" + id_new);
    // const { status } = await Permissions.askAsync(Permissions.CONTACTS);
        // if (status !== "granted") {
        //   alert("Desculpe, você precisa de permissão para acessar os contatos!");
        // }
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
          });

          var arrayContatos = [];
          data.forEach(contato => {
            var nome = contato.name;
            if(typeof nome == "undefined"){
              nome = "N/D";
            }else{
              nome.replace(/'/g, "");
            }
            var telefones = contato.phoneNumbers;
            if(typeof telefones == "undefined"){
              telefones = [];
            }
            var emails = contato.emailAddresses;
            if(typeof emails == "undefined"){
              emails = [];
            }
            // console.log(nome);
            // console.log(telefones);
            // console.log(emails);
            arrayContatos.push({"displayName": nome, "phoneNumbers": telefones, "emailAddresses": emails});
          });
          // console.log(arrayContatos.length);

          const jsonData = (JSON.stringify(arrayContatos));
          // setContatos(jsonData);
          // var enviaContatos = jsonData;
          // console.log(jsonData);
          // return jsonData;

          const response = await api.post("/saveContact.php", {
            contatos: jsonData,
            id_new: id_new 
          });
          // console.log(response.data);

        }
  }

  const openCameraQrCode = (typeScan) => {
    navigation.navigate("CameraQrCode", {
      typeScan: typeScan,
    });
  };

  const onShare = async (message) => {
    try {
      const result = await Share.share({
        message: `${message}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //alert(error.message);
      alert("Seu celular não tem esse recurso ou esta desabilitado.");
    }
  };

  const receivedMessage = async (event) => {
    // console.log(event.nativeEvent);
    const data = JSON.parse(event.nativeEvent.data);

    if (data.action == "buscaContatos") {
      if(data.id_new > 0){
        buscarContatos(data.id_new);
      }
    }

    if (data.action == "removeFingerPrint") {
      setFingerPrintToken("");
      setFingerPrintTokenPost("");
      removeTokenFingerPrint();
      setUrl(`${baseUrl}/usuario.php?s=1&removeFingerPrint`);
    }

    if (data.action == "loginFingerPrint") {
      //console.log(fingerPrintToken);
      if (fingerPrintToken) {
        await setTypeFingerPrint("login");
        let maskDocument = await replaceChar(fingerPrintToken, "*", 3);
        maskDocument = await replaceChar(maskDocument, "*", 4);
        maskDocument = await replaceChar(maskDocument, "*", 5);
        maskDocument = await replaceChar(maskDocument, "*", 10);
        maskDocument = await replaceChar(maskDocument, "*", 16);
        maskDocument = await replaceChar(maskDocument, "*", 17);
        createTwoButtonAlert(
          `Logar ( ${maskDocument} ) com a digital?`,
          "login"
        );
      }
    }

    if (data.action == "enableFingerPrint") {
      if (!fingerPrintToken) {
        if (data.textFingerPrint != "") {
          await setTypeFingerPrint("enabled");
        }

        checkDeviceForHardware();
        setDocumentId(data.user);
      }
    }

    if (data.action == "generateToken") {
      //console.log(data.action);
      handleToken("");
    }

    if (data.action == "openQrCode") {
      openCameraQrCode(data.typeScan);
    }

    if (data.action === "openShare") {
      //console.log("ABRIR SHARE");
      onShare(data.linkShare);
    }
  };

  function mascaraEscondeCpf(cpf){
    let maskDocument =  replaceChar(cpf, "*", 3);
        maskDocument =  replaceChar(maskDocument, "*", 4);
        maskDocument =  replaceChar(maskDocument, "*", 5);
        maskDocument =  replaceChar(maskDocument, "*", 10);
        maskDocument =  replaceChar(maskDocument, "*", 16);
        maskDocument =  replaceChar(maskDocument, "*", 17);

        return maskDocument;
  }

  function criaTimer() {
    var timeLimit = 30;
    const timer = setInterval(() => {
      timeLimit--;
      settimerdisplayToken(timeLimit);
      if (timeLimit <= 0) {
        timeLimit = 30;
        clearInterval(timer);
      }
    }, 1000);
  }

  function onShouldStartLoadWithRequest(request) {
    //console.log("request >>>>" + JSON.stringify(request.url));
    if (request.url.includes("s=1")) {
      setFingerPrintTokenPost("");
      if (request.url.includes("removeFingerPrint")) {
        setUrl(urlInicial + "&removeFingerPrint");
      }else{
        setUrl(urlInicial);
      }
      //console.log('apagar fingerPrintToken');
    }

    if (request.url.includes("api.whatsapp.com")) {
      Linking.openURL(request.url);
      return false;
    }

    if (request.url.includes("contause.digital")) {
      setUrlAtual(request.url);
      return true;
    } else {
      Linking.openURL(request.url);
      return false;
    }

    return true;
  }

  function replaceChar(origString, replaceChar, index) {
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);
    let newString = firstPart + replaceChar + lastPart;

    return newString;
  }

  async function saveToken2fa(token2faObject) {
    await AsyncStorage.setItem("authToken2fa", JSON.stringify(token2faObject));
  }

  async function removeToken2fa() {
    await AsyncStorage.removeItem("authToken2fa");
  }

  async function getToken2fa() {
    const authTokenSave2fa = await AsyncStorage.getItem("authToken2fa");
    if (authTokenSave2fa !== null) {
      return JSON.parse(authTokenSave2fa);
    }

    return false;
  }

  handleToken = async (e) => {
    let habilitar = false;
    if (e === "habilitar") {
      habilitar = true;
    }
    // const deviceId = await Constants.installationId;
    const deviceId = applicationId;
    const dadosSecret = await getToken2fa();
    //console.log("gerandoTOKEN API dadosSecret ==== ", habilitar);
    const response = await api.post(
      "",
      {
        device: deviceId,
        secret: dadosSecret.secret,
        docId: dadosSecret.docId,
        habilitar: habilitar,
      },
      {
        baseURL:
          "https://contause.digital/ib/ag01/?UU9tQzJoQnpWbzdqYmRxM0cvRXlNbHE2VUlpNkErdkF1d29FZXowZjVvaW1vRHFzNzR5MENmMmRZTDJlcWl6ditKaFdYM05hVWMxWTViN21jbmRWMU5FeVVDLzRma3dCNk9yV0toREc0RGM9",
      }
    );

    const { data, status } = response.data;

    //console.log(response.data);

    if (data.includes("desabilitado")) {
      removeToken2fa();
      openCameraQrCode("qrCode");
    }
    if (status) {
      const token2fa = data;
      setdisplayToken(token2fa);
      criaTimer();
      setTimeout(() => {
        removeToken2fa();
        setdisplayToken(false);
      }, 30000);
    }
  };
  

  //VOLTAR COM BOTAO DO CELULAR
  const webViewRef = useRef()
  const botoesFechar = () =>
  Alert.alert('Encerrar Aston Bank', 'Deseja Fechar o Aplicativo?', [
    {
      text: 'Não',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Sim', onPress: () => BackHandler.exitApp()},
  ]);

  const onNavigationStateChange = navState => {
    const backAction = () => {
      if(navState.url != 'https://contause.digital/Xapp/ag19/usuarioB.php' && navState.url != 'https://contause.digital/Xapp/ag19/usuario.php?s=1') {
        webViewRef.current?.goBack()
      } else {
        botoesFechar()
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  };

  return (
    <View style={styles.container}>
      <WebView
        onNavigationStateChange={navState => onNavigationStateChange(navState)}
        originWhitelist={["*"]}
        style={styles.webview}
        ref={webViewRef}
        source={{
          uri: url,
          headers: {
            Authorization: `Basic ${digest}`,
            fingerprint: `${fingerPrintTokenPost}`,
          },
        }}
        startInLoadingState={true}
        key={keyWebview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        javaScriptEnabledAndroid={true}
        androidHardwareAccelerationDisabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        injectedJavaScriptBeforeContentLoaded={`var loginUser = ('${digest}');`}
        onMessage={receivedMessage}
        mixedContentMode="always"
        onShouldStartLoadWithRequest={(request) => {
          return onShouldStartLoadWithRequest(request);
        }}
        renderError={(error) => {
          if (error == "NSURLErrorDomain") {
            setUrl(`${baseUrl}/usuario.php?s=1`);
          }
        }}
      />
      {testAndroid51 && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Testando Android 5.1</Text>
        </View>
      )}

      {devMode && (
        <TouchableOpacity style={styles.btn} onPress={handlerReload}>
          <Text style={styles.btnText}>Reload Me</Text>
        </TouchableOpacity>
      )}

      {displayToken && (
        <View style={styles.token}>
          <Text style={styles.tokenText}>{displayToken}</Text>
          <Text style={styles.tokenText2}>
            Essa informação desaparecera em {timerdisplayToken}
          </Text>
        </View>
      )}
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  tokenText2: {
    color: "#fff",
    marginTop: 5,
  },
  tokenText: {
    color: "#fff",
    backgroundColor: "#5df",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 20,
  },
  token: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#283990",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 25,
  },
  webview: {
    flex: 1,
  },
  containerNoConnection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333366",
  },
  textNoConnection: {
    color: "white",
    padding: 40,
  },
  webview: {
    flex: 1,
  },
  btn: {
    backgroundColor: "#f5d",
    width: "100%",
    height: 50,
  },
  btnText: {
    fontSize: 30,
  },
  tinyLogo: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// WebView.isFileUploadSupported().then((res) => {
//   if (res === true) {
//     // file upload is supported
//     //console.log("isFileUploadSupported", res);
//   } else {
//     // not file upload support
//   }
// });

async function saveToken(token) {
  //console.log("savetoken", token);
  const response = await api.post("/saveTokenForPushNotification.php", {
    token: token,
  });
  //console.log(response.data);
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    // const { status: existingStatus } = await Permissions.getAsync(
    //   Permissions.NOTIFICATIONS
    // );
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      // const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    saveToken(token);
  } else {
    //alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
