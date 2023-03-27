import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Todas as tela aqui
import Main from "./pages/main/navigation";
import CameraQrCode from "./pages/camera/cameraQrCode";
import NoConnection from "./pages/noConnection/noConnection";
import FingerPrint from "./pages/fingerPrint/fingerPrint";

const MainStack = createStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen
          name="Main"
          component={Main}
          options={{
            headerShown: false,
          }}
        />
        <MainStack.Screen
          name="CameraQrCode"
          component={CameraQrCode}
          options={{
            headerShown: false,
            // cardStyle: { backgroundColor: "transparent" },
          }}
        />
        <MainStack.Screen
          name="FingerPrint"
          component={FingerPrint}
          options={{
            headerShown: false,
            // cardStyle: { backgroundColor: "transparent" },
          }}
        />
        <MainStack.Screen
          name="NoConnection"
          component={NoConnection}
          options={{
            gestureEnabled: false,
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
