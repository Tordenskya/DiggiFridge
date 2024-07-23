import AsyncStorage from '@react-native-async-storage/async-storage';


export const setLagraKjøleskap = async (verdi) => {
    try {
      return await AsyncStorage.setItem('@Kjøleskap', JSON.stringify(verdi));
    } catch(err) {
      console.log('Kjøleskap lagring error' + err)
    }
    console.log('Kjøleskap lagret');
  }
  
  export const hentLagraKjøleskap = async () => {
    try {
      console.log('Data sent frå kjøleskapsLagring');
      const JsonVerdi = await AsyncStorage.getItem('@Kjøleskap');

      if(JsonVerdi != null){
        return JSON.parse(JsonVerdi);
      } else {
        console.log('Ingen lagret data frå kjøleskapet');
        return null;
      }
      
    } catch (err) {
      console.log('Kjøleskap ikkje hentet' + err);
    }
  }