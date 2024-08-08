import { useState, useEffect } from 'react';
import { hentLagraKjøleskap} from '../LocalStorage/KjøleskapLagring';

//Henter data frå kjøleskap som er lagret med async storage eller lager nytt kjøleskap
export const useKjøleskap = () => {
    const [kjøleskap, setKjøleskap] = useState([]);
    
    useEffect(() => {
        const hentData = async () => {
            try {
                const lagraKjøleskap = await hentLagraKjøleskap();
                if(lagraKjøleskap != null){
                    setKjøleskap(lagraKjøleskap);
                } else {
                    setKjøleskap([
                        { kategori: 'Pålegg', antall: 0, produkt: [], bakgrunnsFarge: 'lightyellow'},
                        { kategori: 'Kjøtt-Fisk', antall: 0, produkt: [], bakgrunnsFarge: 'lightpink'},
                        { kategori: 'Grønnsaker', antall: 0, produkt: [], bakgrunnsFarge: 'lightgreen'},  
                    ]);
                    console.log('Lagd nytt kjøleskap');
                }
            } catch (error) {
                console.error('Error henting av Kjøleskap data', error);
            }
        };
        hentData();
    }, []);

    return kjøleskap;
}