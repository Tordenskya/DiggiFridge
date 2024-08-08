import * as Notifications from 'expo-notifications';
import { setLagraNotifikasjonsIdTabell } from '../LocalStorage/notifikasjonsDataLagring';


//Sletter planlagde notifikasjoner
//Sjekk om der er promise error  
export const avbrytPlanlagdNotifikasjon = async (utløpsdato, planlagdNotifikasjon, setPlanlagdNotifikasjon) => {
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