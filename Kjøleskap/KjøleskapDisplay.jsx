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
    
    kjøleskap[kategoriIndeks].antall -= 1;
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


  return (
    <View>
      {localDisplay.map((kategori, kategoriIndeks) => (
        <View key={kategori.kategori} style={stil.kjøleskapsHylle}>
          <Text>{kategori.kategori}</Text>
          <View key={kategori.kategori} style={stil.infoRad}>
            <View style={stil.produktKolonne}>
              <Text>Produkt</Text>
              {kategori.produkt.map((produkt) => (
                <Text key={produkt.produktNamn}>{produkt.produktNamn}</Text>
              ))}
            </View>
            <View style={stil.produktKolonne}>
              <Text>Antall</Text>
              {kategori.produkt.map((produkt) => (
                <Text key={produkt.produktNamn}>{produkt.produktAntall}</Text>
              ))}
            </View>
            <View style={stil.produktKolonne}>
              <Text>Utløpsdato</Text>
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
  kjøleskapsHylle: {
    flexDirection: 'column',
    textAlign: 'left',
  },

  infoRad: {
    flexDirection: 'row',
    paddingBottom: 10,
  },

  produktKolonne: {
    flexDirection: 'column',
    paddingRight: 10,
  },

  knapp: {
    flexDirection: 'row'
  }
});