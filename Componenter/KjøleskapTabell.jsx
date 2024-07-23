import { useState, useEffect } from 'react';
import { hentLagraKjøleskap, setLagraKjøleskap } from '../LocalStorage/KjøleskapLagring';

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

//Tar data frå handlelista og oppdaterer kjøleskapet og sender info til å lage notifikasjoner
export function FlyttTilKjøleskap({handleliste, kjøleskap, oppdaterNotifikasjoner }) {
    console.log('Flytt til kjøleskap starta');
    let unikeUtløpsdatoer = [];

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
                    if(unikeUtløpsdatoer.length === 0){
                        unikeUtløpsdatoer.push(handleliste[h].uformatertUtløpsdato);
                        console.log('første unike utløpsdato');
                    } else {
                        let utløpsdatoLagretFraFør = true;
                        for(let u = 0; u < unikeUtløpsdatoer.length; u++){
                            if(!unikeUtløpsdatoer[u].match(handleliste[h].uformatertUtløpsdato)){
                                !utløpsdatoLagretFraFør;
                            }
                        }
                        if(!utløpsdatoLagretFraFør){
                            unikeUtløpsdatoer.push(handleliste[h].uformatertUtløpsdato);
                            console.log('Ny unik utløpsdato');
                        }
                    }
                    console.log('Putter produkt: ' + handleliste[h].produktNamn + ' i kjøleskap')
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
    console.log('Oppdaterer notifikasjoner');
    for(let i = 0; i < unikeUtløpsdatoer.length; i++){
        oppdaterNotifikasjoner(kjøleskap, unikeUtløpsdatoer[i]);
    }
    setLagraKjøleskap(kjøleskap);
    console.log(kjøleskap);
    return kjøleskap;
}