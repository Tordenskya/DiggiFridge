import {Platform} from 'react-native';
import { useState, useEffect} from "react";

import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KjøleskapScreen } from './Navigasjon/KjøleskapScreen';
import { HandlelisteScreen } from './Navigasjon/HandlelisteScreen';

import { AuthProvider } from './Context/AuthContext';

import HandlelisteIcon from './assets/HandlelisteIcon.png';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { useKjøleskap } from './Tabeller/KjoleskapTabell';
import { oppdaterNotifikasjoner } from './Componenter/oppdaterNotifikasjoner';


import { useHandleliste } from './Tabeller/Handleliste';
import { hentLagraNotifikasjonsIdTabell} from "./LocalStorage/notifikasjonsDataLagring"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  const kjøleskap = useKjøleskap();
  const lagraHandleliste = useHandleliste();
  const [kjøleskapDisplay, setKjøleskapDisplay] = useState(kjøleskap);
  const [handleliste, setHandleliste] = useState(lagraHandleliste);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [planlagdNotifikasjon, setPlanlagdNotifikasjon] = useState({});


  useEffect(() => {
  const getPushToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      console.log('Token: ', token);
      setExpoPushToken(token);
    } catch (error) {
      console.log('Error fetching push token:', error);
    }
  };

  getPushToken();
}, []);

  useEffect (() => {
    const hentData = async () => {
      try {
        const lagraNotifikasjonsId = await hentLagraNotifikasjonsIdTabell();
        if(lagraNotifikasjonsId != null){
          setPlanlagdNotifikasjon(lagraNotifikasjonsId);
        }
      } catch(err){
        console.log(err)
      }
    };
    hentData();
  }, [])

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'af73086a-77b3-4fb1-93f0-538ab55ac19f' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

  //Lag ein Screen for redigering av kategorier i kjøleskap, kl av notifikasjons meldinger, (dark mode??)
  const Stack = createNativeStackNavigator();

  return (
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Kjøleskap">
          <Stack.Screen name="Kjøleskap">
            {(props) => (
              <KjøleskapScreen
                {...props}
                kjøleskapDisplay={kjøleskapDisplay}
                oppdaterNotifikasjoner={oppdaterNotifikasjoner}
                HandlelisteIcon={HandlelisteIcon}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Handleliste">
            {(props) => (
              <HandlelisteScreen
              {...props}
              planlagdNotifikasjon = {planlagdNotifikasjon}
              handleliste={handleliste}
              setHandleliste={setHandleliste}
              setKjøleskapDisplay={setKjøleskapDisplay}
              oppdaterNotifikasjoner={oppdaterNotifikasjoner}
              setPlanlagdNotifikasjon={setPlanlagdNotifikasjon}
              />
            )}
          </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
  );
}