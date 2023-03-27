// import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokenFingerPrint = async (token) => {
    await AsyncStorage.setItem("tokenFingerPrint", token);
}

export const getTokenFingerPrint = async () => {
    const tokenFingerPrint = await AsyncStorage.getItem("tokenFingerPrint");
    if (tokenFingerPrint !== null) {
        return tokenFingerPrint;
    }
}

export const removeTokenFingerPrint = async () => {
    try {
        await AsyncStorage.removeItem("tokenFingerPrint");
        return true;
    }
    catch(exception) {
        return false;
    }
}