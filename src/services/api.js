import axios from 'axios';
import Constants from 'expo-constants';

// const deviceId = Constants.installationId;

//console.log(deviceId);

const api = axios.create({
    baseURL: 'https://contause.digital/api',
    //headers: {'DEVICEID': `Basic ${deviceId}`}
  });

export default api;  