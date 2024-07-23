import AsyncStorage from '@react-native-async-storage/async-storage';


export const setLagraHandleliste = async (verdi) => {
    try {
      return await AsyncStorage.setItem('@Handleliste', JSON.stringify(verdi));
    } catch(err) {
      console.log('Handleliste lagring error' + err)
    }
    console.log('Handleliste lagret');
  }
  
  export const hentLagraHandleliste = async () => {
    try {
      console.log('Data sent frå HandlelisteLagring');
      const JsonVerdi = await AsyncStorage.getItem('@Handleliste');

      if(JsonVerdi != null){
        return JSON.parse(JsonVerdi);
      } else {
        console.log('Ingen lagret data frå Handleliste');
        return null;
      }
      
    } catch (err) {
      console.log('Handleliste ikkje hentet' + err);
    }
}