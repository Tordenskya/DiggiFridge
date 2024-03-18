import { useState, useEffect } from 'react';
import { hentLagraKjøleskap, setLagraKjøleskap } from './KjøleskapLagring';

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
                        { kategori: 'Pålegg', antall: 0, produkt: [] },
                        { kategori: 'Kjøtt-Fisk', antall: 0, produkt: [] },
                        { kategori: 'Grønsaker', antall: 0, produkt: [] },  
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


export function FlyttTilKjøleskap({handleliste, kjøleskap, oppdaterUtløpsdatoMap, sendPlanlagdNotifikasjon }) {
    console.log('Flytt til kjøleskap starta');

    if(!kjøleskap || kjøleskap.length === 0){
        return null;
    }

    for(let i = 0; i < kjøleskap.length; i++){
        for(let h = 0; h < handleliste.length; h++){
            if(kjøleskap[i].kategori === handleliste[h].kategori && handleliste[h].checked === true){
                let produktLike = false;
                let produktLikeIndeks = -1;

                for(let p = 0; p < kjøleskap[i].produkt.length; p++){
                    if(handleliste[h].produktNamn.match(kjøleskap[i].produkt[p].produktNamn) && handleliste[h].utløpsdato.match(kjøleskap[i].produkt[p].utløpsdato)){
                        produktLike = true;
                        produktLikeIndeks = p;
                        break;
                    }
                }

                if (produktLike) {
                    kjøleskap[i].produkt[produktLikeIndeks].produktAntall += parseInt(handleliste[h].produktAntall, 10);
                    kjøleskap[i].antall++;
                  } else {
                    sendPlanlagdNotifikasjon(handleliste[h].uformatertUtløpsdato, handleliste[h].produktNamn);
                    kjøleskap[i].antall++;
                    kjøleskap[i].produkt.push({
                      produktNamn: handleliste[h].produktNamn,
                      produktAntall: parseInt(handleliste[h].produktAntall, 10),
                      utløpsdato: handleliste[h].utløpsdato,
                      uformatertUtløpsdato: handleliste[h].uformatertUtløpsdato,
                 })
                }
            }
        }
    }
    console.log('Set lagra kjøleskap');
    setLagraKjøleskap(kjøleskap);
    console.log(kjøleskap);
    return kjøleskap;
}