import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLagraNotifikasjonsIdTabell = async (verdi) => {
    console.log('Setter lagra notifikasjons verdi: ' + verdi);
    try {
        return await AsyncStorage.setItem('@NotifikasjonsId', JSON.stringify(verdi));
    } catch(err) {
        console.log('NotifikasjonId lagring error' + err);
    } 
    console.log('NotifikasjonId lagret');
}

export const hentLagraNotifikasjonsIdTabell = async () => {
    try {
        const JsonVerdi = await AsyncStorage.getItem('@NotifikasjonsId');

        if(JsonVerdi != null){
            return JSON.parse(JsonVerdi);
        } else {
            console.log('Ingen lagret notifikasjons IDar');
            return null;
        }
    } catch(err) {
        console.log('Notifikasjons ID tabell ikkje hentet' + err);
    }
}