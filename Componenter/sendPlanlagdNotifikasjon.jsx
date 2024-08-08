import * as Notifications from 'expo-notifications';
import { setLagraNotifikasjonsIdTabell } from '../LocalStorage/notifikasjonsDataLagring';

//Lager til notifikasjon om produkter som går ut på dato
export const sendPlanlagdNotifikasjon = async (utløpsdato, produkter, planlagdNotifikasjon) => {
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