import { View, Text, StyleSheet, TouchableOpacity, Image, Button, Modal, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import SøppelIcon from '../assets/trash-can-10416.png';
import { useEffect } from "react";
import { hentLagraKjøleskap, setLagraKjøleskap } from "../LocalStorage/KjøleskapLagring";
import { LeggTilKategori } from "./nyKategori";
import { useState } from "react";
import { useKjøleskap } from '../Tabeller/KjoleskapTabell';

export function RenderKjøleskap({ kjøleskapDisplay, oppdaterNotifikasjoner }) {
  const [localDisplay, setLocalDisplay] = useState(kjøleskapDisplay);
  const kjøleskap = useKjøleskap();

  //Sletter produkter frå display, async storage og notifikasjoner
  const slettProdukt = (kategoriIndeks, produktIndeks) => {
    const utløpsdatoTilSletting = kjøleskap[kategoriIndeks].produkt[produktIndeks].uformaterUtløpsdato;

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

  

  return (
    <View style={stil.kjøleskap}>
      {localDisplay.map((kategori, kategoriIndeks) => (
        <View key={kategori.kategori} style={[stil.kjøleskapsHylle, { backgroundColor: kategori.bakgrunsFarge }]}>
          <View style={stil.tittelRad}>
            <Text style={stil.kategoriNamn}>{kategori.kategori}</Text>
            <TouchableOpacity style={stil.slettKategori}>
              <Text style={stil.slettKategori}>X</Text>
            </TouchableOpacity>
          </View>
          <View key={kategori.kategori} style={stil.infoRad}>
            <View style={stil.produktKolonne}>
              <Text style={stil.infoText}>Produkt</Text>
              {kategori.produkt.map((produkt) => (
                <Text style={stil.produktText} key={produkt.produktNamn}>{produkt.produktNamn}</Text>
              ))}
            </View>
            <View style={stil.produktKolonne}>
              <Text style={stil.infoText}>Antall</Text>
              {kategori.produkt.map((produkt) => (
                <Text style={stil.produktText} key={produkt.produktNamn}>{produkt.produktAntall}</Text>
              ))}
            </View>
            <View style={stil.produktKolonne}>
              <Text style={stil.infoText}>Utløpsdato</Text>
              {kategori.produkt.map((produkt) => (
                <Text style={stil.produktText} key={produkt.produktNamn}>{produkt.utløpsdato}</Text>
              ))}
            </View>
            <View  style={stil.produktKolonne}>
              {kategori.produkt.map((produkt, produktIndeks) => (
                <View key={produkt.produktNamn}>
                  <TouchableOpacity style={stil.knapp} onPress={() => slettProdukt(kategoriIndeks, produktIndeks)}>
                  <Image source={SøppelIcon} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </View>
               ))}
            </View>
          </View>
        </View>
      ))}
      <LeggTilKategori 
        setLagraKjøleskap={setLagraKjøleskap}
        setLocalDisplay={setLocalDisplay}
      />
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
    padding: 10,
    margin: 2,
    borderRadius: 20,
  },

  tittelRad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoRad: {
    flexDirection: 'row',
    paddingBottom: 10,
    justifyContent: 'space-between',
  },

  produktKolonne: {
    flexDirection: 'column',
    paddingRight: 10,
    paddingBottom: 8,
    alignItems: 'center'
  },

  slettKategori: {
    fontSize: 15
  },


  knapp: {
    flexDirection: 'row',
    height: 40,
    margin: 0,
    padding: 0,
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 12
  },

  kategoriNamn: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  infoText: {
    fontWeight: 'bold',
    fontSize: 16,
    
  },

  produktText: {
    fontSize: 16,
    alignContent: 'center',
    paddingBottom: 10
  },

  
});