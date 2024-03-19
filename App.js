import { StyleSheet, Button, View, Platform} from 'react-native';
import { useState, useEffect, useRef } from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { RenderHandleliste, HandleListeInputElements } from "./Handleliste/HandlelisteInputElements";
import { useKjøleskap } from './Kjøleskap/KjøleskapTabell';
import { RenderKjøleskap } from "./Kjøleskap/KjøleskapDisplay";
import {useHandleliste} from './Handleliste/Handleliste'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


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

const finnProduktForUtløpsdato = (utløpsdato) => {
  const produktMedSammeUtløpsdato = [];
  for(k = 0; k < kjøleskap.length; k++){
    for(p = 0; p < kjøleskap[k].produkt.length; p++){
      if(kjøleskap[k].produkt[p].utløpsdato.match(utløpsdato)){
        produktMedSammeUtløpsdato.push(kjøleskap[k].produkt[p]);
      }
    }
  };
  return produktMedSammeUtløpsdato;
}

const oppdaterNotifikasjoner = (utløpsdato, isDelete = false) => {
  console.log(finnProduktForUtløpsdato(utløpsdato));

  if(isDelete && finnProduktForUtløpsdato(utløpsdato).length === 0){
    avbrytPlanlagdNotifikasjon(utløpsdato);
    console.log('Ingen fleire produkt med denne utløpsdatoen');
  } else {
    avbrytPlanlagdNotifikasjon(utløpsdato);
    sendPlanlagdNotifikasjon(utløpsdato, finnProduktForUtløpsdato(utløpsdato));
    console.log('Lagd nye notifikasjoner');
  }

};

const sendPlanlagdNotifikasjon = async (utløpsdato, produkter) => {
    console.log('Planlegger push notifikasjon');

    const triggerDate = new Date(utløpsdato);
    triggerDate.setDate(triggerDate.getDate() - 2);
    triggerDate.setHours(12, 0, 0, 0);

    const notifikasjonData = {
      title: 'Produkt utløpsdato påminnelse',
      body: `Disse produktene vil gå ut den ${utløpsdato}: ${produkter.map(p => p.produktNamn).join(', ')}`,
      data: { data: 'goes here' },
    };

    const notifikajsonsId = await Notifications.scheduleNotificationAsync({
      content: notifikasjonData,
      trigger: { date: triggerDate },
    });

    setPlanlagdNotifikasjon((tidligereNotifikasjoner) => ({
      ...tidligereNotifikasjoner,
      [utløpsdato]: notifikajsonsId,
    }));

    console.log('Notifikasjon planlagt');
}

const avbrytPlanlagdNotifikasjon = async (utløpsdato) => {
  console.log('Avbryter planlagd notifikasjon');

  await Notifications.cancelScheduledNotificationAsync(utløpsdato);

  console.log('Notifikasjon avbrutt');

}

const sendNotifikasjon = async () => {
  console.log("Sender push notifikasjon...")

  const melding = {
    to: expoPushToken,
    sound: "default",
    title: "Notifikasjon <3",
    body: "Ditte e ein notifikajson"
  }
  
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify(melding)
  })
}

  const Stack = createNativeStackNavigator();

  function KjøleskapScreen() {
    const navigation = useNavigation();
    return(
      <View>
        <RenderKjøleskap kjøleskapDisplay={kjøleskapDisplay} oppdaterNotifikasjoner={oppdaterNotifikasjoner}/>
        <Button
            onPress={() => {
                navigation.navigate('Handleliste');
            }}
            title="Go to Handleliste"
            style={stil.handlelisteKnapp}
        />   
      </View>
    )
  }

  function HandlelisteScreen() {
    return(
      <View>
        <HandleListeInputElements setHandleliste={setHandleliste}/>
        <RenderHandleliste setKjøleskapDisplay={setKjøleskapDisplay} oppdaterNotifikasjoner={oppdaterNotifikasjoner}/>
      </View>
    )
  }

  return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Kjøleskap">
            <Stack.Screen name="Kjøleskap" component={KjøleskapScreen}/>
            <Stack.Screen name="Handleliste" component={HandlelisteScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
  );
}

const stil = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handlelisteKnapp: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    right: 5,
    alignSelf: 'flex-end',
    marginTop: -160,
    marginLeft: -70,
    width: 150,
    position: 'absolute'
}
});