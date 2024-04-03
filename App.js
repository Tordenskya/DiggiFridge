import { StyleSheet, Button, View, Platform, TouchableOpacity, Image } from 'react-native';
import HandlelisteIcon from './assets/HandlelisteIcon.png';
import { useState, useEffect} from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { RenderHandleliste, HandleListeInputElements } from "./Handleliste/HandlelisteInputElements";
import { useKjøleskap } from './Kjøleskap/KjøleskapTabell';
import { RenderKjøleskap } from "./Kjøleskap/KjøleskapDisplay";
import {useHandleliste} from './Handleliste/Handleliste'
import { hentLagraNotifikasjonsIdTabell, setLagraNotifikasjonsIdTabell } from './Kjøleskap/notifikasjonsDataLagring';

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

const finnProduktForUtløpsdato = ( kjøleskap, utløpsdato) => {
  const produktMedSammeUtløpsdato = [];
  console.log('Finn produkt med utløpsdato starta');
  for(let k = 0; k < kjøleskap.length; k++){
    for(let p = 0; p < kjøleskap[k].produkt.length; p++){
      if(kjøleskap[k].produkt[p].uformatertUtløpsdato.match(utløpsdato)){
        produktMedSammeUtløpsdato.push(kjøleskap[k].produkt[p].produktNamn);
        console.log('Funnet produkt med utløpsdato ' + kjøleskap[k].produkt[p].produktNamn);
      }
    }
  };
  return produktMedSammeUtløpsdato;
}

const oppdaterNotifikasjoner = (kjøleskap, utløpsdato, isDelete = false) => {
  console.log('Produkt med utløpsdato ' + utløpsdato + ': ' + finnProduktForUtløpsdato( kjøleskap, utløpsdato));

  const produkt = finnProduktForUtløpsdato( kjøleskap, utløpsdato);

  if(isDelete && finnProduktForUtløpsdato( kjøleskap, utløpsdato).length === 0){
    //Om det er ingen produkt med utløpsdatoen blir notifikasjonen slettet
    avbrytPlanlagdNotifikasjon(utløpsdato);
    console.log('Ingen fleire produkt med denne utløpsdatoen');
  } else {
    //Om noko blir slettet eller lagt til sletter det den tidligere planlagde notifikasjonen og lager ny med produkter som har lik utløpsdato
    avbrytPlanlagdNotifikasjon(utløpsdato);
    sendPlanlagdNotifikasjon(utløpsdato, produkt);
    console.log('Lagd nye notifikasjoner');
  }

};

//Lager til notifikasjon om produkter som går ut på dato
const sendPlanlagdNotifikasjon = async (utløpsdato, produkter) => {
    console.log('Planlegger push notifikasjon');

    const lokalUtløpsdato = new Date(utløpsdato).toLocaleDateString();
    const triggerDate = new Date(utløpsdato);
    triggerDate.setDate(triggerDate.getDate() - 2);
    triggerDate.setHours(12, 0, 0, 0);

    let  notifikasjonData;

    if(produkter.length > 1){
      notifikasjonData = {
        title: 'Produkt utløpsdato påminnelse',
        body: `Disse produktene vil gå ut den ${lokalUtløpsdato}: ${produkter}`,
        data: { data: 'goes here' },
      };
    } else {
      notifikasjonData = {
        title: 'Produkt utløpsdato påminnelse',
        body: `Dette produktet vil gå ut den ${lokalUtløpsdato}: ${produkter}`,
        data: { data: 'goes here' },
      };
    }

    const notifikajsonsId = await Notifications.scheduleNotificationAsync({
      content: notifikasjonData,
      trigger: { date: triggerDate }, 
    });

    console.log('Notifikasjons ID: ');
    console.log(notifikajsonsId);

    const nyNotifikasjonsTabell = planlagdNotifikasjon;
    nyNotifikasjonsTabell.utløpsdato = notifikajsonsId;

    setLagraNotifikasjonsIdTabell(nyNotifikasjonsTabell);

    console.log('Notifikasjon planlagt for ' + triggerDate.toLocaleString());
}

//Sletter planlagde notifikasjoner
//Sjekk om der er promise error  
const avbrytPlanlagdNotifikasjon = async (utløpsdato) => {
  console.log('Avbryter planlagd notifikasjon');

  const notifikajsonsId = planlagdNotifikasjon[utløpsdato];

  if(notifikajsonsId){
    await Notifications.cancelScheduledNotificationAsync(notifikajsonsId);
    setPlanlagdNotifikasjon((tidligereNotifikasjoner) => {
      const nyNotifikasjonsTabell = [...tidligereNotifikasjoner];
      nyNotifikasjonsTabell.splice(utløpsdato, 1);
      setLagraNotifikasjonsIdTabell(nyNotifikasjonsTabell);
      return nyNotifikasjonsTabell;
    })
  } else {
    console.log('Ingen notifikasjon funnet for denne datoen');
  }
  console.log('Notifikasjon avbrutt');
}

  const sendNotification = async () => {
    // Define notification content
    const notificationContent = {
      title: 'Produkt som går ut på dato',
      body: `Notifikasjoner med dato ` + kjøleskap[0].produkt[0].utløpsdato + ' : ' + finnProduktForUtløpsdato( kjøleskap, kjøleskap[0].produkt[0].utløpsdato),
    };

    // Schedule the notification
    try {
      const trigger = new Date().getTime() + 5000; // Send notification after 5 seconds
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger,
      });
      console.log('Notification scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };  


  //Lag ein Screen for redigering av kategorier i kjøleskap, kl av notifikasjons meldinger, (dark mode??)
  const Stack = createNativeStackNavigator();

  //Viser fram all data frå kjøleskapet
  function KjøleskapScreen() {
    const navigation = useNavigation();
    return(
      <View style={stil.container}>
        <RenderKjøleskap kjøleskapDisplay={kjøleskapDisplay} oppdaterNotifikasjoner={oppdaterNotifikasjoner}/>
        <TouchableOpacity style={stil.handlelisteKnapp} onPress={() => {navigation.navigate('Handleliste');}}>
          <Image source={HandlelisteIcon} style={{ width: 90, height: 90 }} />
        </TouchableOpacity>
      </View>
    )
  }

  //Legger til nye produkt i handlelista, viser fram handlelista og flytter det til kjøleskapet
  function HandlelisteScreen() {
    return(
      <View>
        <HandleListeInputElements setHandleliste={setHandleliste}/>
        <RenderHandleliste setKjøleskapDisplay={setKjøleskapDisplay} oppdaterNotifikasjoner={oppdaterNotifikasjoner} setHandleliste={setHandleliste}/>
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
    width: '100%',
    height: '100%',
  },
  handlelisteKnapp: {
    width: 130,
    height: 120,
    position: 'absolute',
    bottom:  30,
    right: 10,
    borderRadius: 90,
    backgroundColor: 'lightblue',
    padding: 12,
    alignContent: 'center',
    alignItems: 'center'
}
});