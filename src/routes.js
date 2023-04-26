import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Main from "./pages/Main";
import CameraQrCode from "./pages/Camera";
import NoConnection from "./pages/noConnection";
import FingerPrint from "./pages/FingerPrint";

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
          }}
        />
        <MainStack.Screen
          name="FingerPrint"
          component={FingerPrint}
          options={{
            headerShown: false,
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
