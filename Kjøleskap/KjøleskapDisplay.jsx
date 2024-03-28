import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { hentLagraKjøleskap, setLagraKjøleskap } from "./KjøleskapLagring";
import { useState } from "react";
import { useKjøleskap } from "./KjøleskapTabell";

export function RenderKjøleskap({ kjøleskapDisplay, oppdaterNotifikasjoner }) {
  const [localDisplay, setLocalDisplay] = useState(kjøleskapDisplay);
  const kjøleskap = useKjøleskap();

  //Sletter produkter frå display, async storage og notifikasjoner
  const slettProdukt = (kategoriIndeks, produktIndeks) => {
    const utløpsdatoTilSletting = kjøleskap[kategoriIndeks].produkt[produktIndeks].uformaterUtløpsdato

    setLocalDisplay((kjøleskap) => {
      const nyttKjøleskap = [...kjøleskap];
        nyttKjøleskap[kategoriIndeks].produkt.splice(produktIndeks, 1);
        oppdaterNotifikasjoner(nyttKjøleskap, utløpsdatoTilSletting, true);
        setLagraKjøleskap(nyttKjøleskap);
      return kjøleskap = nyttKjøleskap;
    });
    
    kjøleskap[kategoriIndeks].antall --;
  }

  useEffect(() => {
    const hentData = async () => {
      try {
        const lagraKjøleskapDisplay = await hentLagraKjøleskap();
        if (lagraKjøleskapDisplay != null) {
          setLocalDisplay(lagraKjøleskapDisplay);
        }
      } catch (error) {
        console.error('Error rendering kjøleskap', error);
      }
    };
  
    hentData();
  }, []);

  const kategoriBakgrunnsFarge = {
    Pålegg: 'lightyellow',
    KjøttFisk: 'lightpink',
    Grønnsaker: 'lightgreen'
  }


  return (
    <View style={stil.kjøleskap}>
      {localDisplay.map((kategori, kategoriIndeks) => (
        <View key={kategori.kategori} style={[stil.kjøleskapsHylle, { backgroundColor: kategoriBakgrunnsFarge[kategori.kategori] }]}>
          <Text style={stil.kategoriNamn}>{kategori.kategori}</Text>
          <View key={kategori.kategori} style={stil.infoRad}>
            <View style={stil.produktKolonne}>
              <Text style={stil.infoText}>Produkt</Text>
              {kategori.produkt.map((produkt) => (
                <Text key={produkt.produktNamn}>{produkt.produktNamn}</Text>
              ))}
            </View>
            <View style={stil.produktKolonne}>
              <Text style={stil.infoText}>Antall</Text>
              {kategori.produkt.map((produkt) => (
                <Text key={produkt.produktNamn}>{produkt.produktAntall}</Text>
              ))}
            </View>
            <View style={stil.produktKolonne}>
              <Text style={stil.infoText}>Utløpsdato</Text>
              {kategori.produkt.map((produkt) => (
                <Text key={produkt.produktNamn}>{produkt.utløpsdato}</Text>
              ))}
            </View>
            <View  style={stil.produktKolonne}>
              {kategori.produkt.map((produkt, produktIndeks) => (
                <View key={produkt.produktNamn}>
                  <TouchableOpacity style={stil.knapp}>
                    <Button
                      title="edit"
                    />
                    <Button title="slett" onPress={() => slettProdukt(kategoriIndeks, produktIndeks)}/>
                  </TouchableOpacity>
                </View>
               ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}


const stil = StyleSheet.create({
  kjøleskap: {
    width: '100%'
  },

  kjøleskapsHylle: {
    flexDirection: 'column',
    textAlign: 'left',
    padding: 5,
    margin: 2,
    borderRadius: 20,
  },

  infoRad: {
    flexDirection: 'row',
    paddingBottom: 10,
  },

  produktKolonne: {
    flexDirection: 'column',
    paddingRight: 10,
    paddingBottom: 8,
    alignItems: 'center'
  },

  knapp: {
    flexDirection: 'row'
  },

  kategoriNamn: {
    fontWeight: 'bold',
    fontSize: 18
  },

  infoText: {
    fontWeight: 'bold',
    fontSize: 14
  }
});