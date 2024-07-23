import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from 'react-native';

 export function LeggTilKategori({setLagraKjøleskap, setLocalDisplay}){
    const [visLeggTilNyKategori, setVisLeggTilNyKategori] = useState(false);
    const [valgtFarge, setValgtFarge] = useState('');
    const [nyttKategoriNamn, setNyttKategoriNamn] = useState('');

    const farger = [
        '#FFB6C1', // Light pink
        '#FFC0CB', // Pink
        '#FF69B4', // Hot pink
        '#FFA07A', // Light salmon
        '#FF7F50', // Coral
        '#F08080', // Light coral
        '#FFD700', // Gold
        '#FFFF00', // Yellow
        '#90EE90', // Light green
        '#98FB98', // Pale green
        '#ADFF2F', // Green yellow
        '#00FF00', // Lime
        '#00FA9A', // Medium spring green
        '#00CED1', // Dark turquoise
        '#48D1CC', // Medium turquoise
        '#20B2AA', // Light sea green
        '#5F9EA0', // Cadet blue
        '#87CEEB', // Sky blue
        '#B0C4DE', // Light steel blue
        '#ADD8E6', // Light blue
        '#F0E68C', // Khaki
        '#E0FFFF', // Light cyan
        '#FFE4B5', // Moccasin
        '#FFDAB9', // Peachpuff
    ];

    const hondterKategoriForandring = (tekst) => {
        console.log('Nytt kategoriNamn: ' + tekst);
        setNyttKategoriNamn(tekst);
    }
    
    const hondterFargeValg = (farge) => {
        console.log('Valgt farge');
        console.log(farge);
        setValgtFarge(farge);
    }
    

    const visLeggTilKategori = () => {
        setVisLeggTilNyKategori(!visLeggTilNyKategori);
    }
    
    const hondterLeggTilNyKategori = () => {
        if(nyttKategoriNamn != null){
            console.log('Legger til ny kategori');
            setLocalDisplay((tidligareKjøleskap) => {
                const nyttKjøleskap = [...tidligareKjøleskap];
                nyttKjøleskap.push({
                    kategori: nyttKategoriNamn,
                    antall: null,
                    produkt: [],
                    bakgrunsFarge: valgtFarge,
                });
                setLagraKjøleskap(nyttKjøleskap);
                console.log(nyttKjøleskap);
                console.log('Ny kategori lagt til');
                return nyttKjøleskap;
            });
        }
        visLeggTilKategori();
    }

   

      return (
        <View>
        <TouchableOpacity  style={stil.nyKategoriKnapp}>
            <Button title="+" onPress={(visLeggTilNyKategori, setVisLeggTilNyKategori) => visLeggTilKategori(visLeggTilNyKategori, setVisLeggTilNyKategori)}/>
        </TouchableOpacity>
        {visLeggTilNyKategori ? (
          <Modal visible={visLeggTilNyKategori} animationType="slide">
            <View >
                <TextInput placeholder="Kategori namn" style={stil.kategoriNamnInput} onChangeText={(tekst) => hondterKategoriForandring(tekst)}/>
              <View style={stil.fargeValgKonteiner}>
                {farger.map((farge, indeks) => (
                        <TouchableOpacity
                            key={indeks}
                            style={[stil.fargeValgStil, { backgroundColor: farge , borderColor: valgtFarge === farge ? 'black' : 'transparent' }]}
                            onPress={() => hondterFargeValg(farge)}
                        />
                    ))}
              </View>
              <View style={stil.knappKonteiner}>
                <Button title="Avbryt" onPress={visLeggTilKategori} />
                    <View style={[stil.fargeValgCircle, { backgroundColor: valgtFarge }]} />
                <Button title="Legg til kategori" onPress={hondterLeggTilNyKategori} />
              </View>
            </View>
          </Modal>
        ) : null}
      </View>
      )
      
}

const stil = StyleSheet.create ({
    nyKategoriKnapp: {
        fontSize: 20,
        borderRadius: 50,
        marginHorizontal: 10,
        paddingTop: 5,
        width: 70, 
        right: 0
      },
      fargeValgKonteiner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginVertical: 10,
      },
      fargeValgStil: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        marginHorizontal: 5,
        margin: 10
      },
      knappKonteiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingTop: 40
      },
      kategoriNamnInput: {
        paddingTop: 40,
        textAlign: 'center',
        fontSize: 20
      },
      fargeValgCircle: {
        width: 40, 
        height: 40, 
        borderRadius: 20,
    }
})
