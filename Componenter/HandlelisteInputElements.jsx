import { useState} from 'react';
import { Picker } from '@react-native-picker/picker';  
import React from 'react';
import { useKjøleskap } from './KjøleskapTabell';
import { View, TextInput, Button, StyleSheet} from 'react-native';
import { useEffect } from 'react';
import { useHandleliste } from '../Tabeller/Handleliste';
import { hentLagraHandleliste, setLagraHandleliste } from '../LocalStorage/HandlelisteLagring';



//Tar data frå inputs og legger det til handlelista
export function HandleListeInputElements({setHandleliste}) {
  const kjøleskap = useKjøleskap();
  const handleliste = useHandleliste();
  const [valgtKategori, setValgtKategori] = useState('');
  const [produktNamnInput, setProduktNamnInput] = useState('');
  const [produktAntallInput, setProduktAntallInput] = useState('');

  useEffect(() => {
    if (kjøleskap.length > 0) {
      setValgtKategori(kjøleskap[0].kategori);
    }
  }, [kjøleskap]);

  const hondterKategoriForandring = (itemValue) => {
    setValgtKategori(itemValue);
  };

  const hondterProduktNamnForandring = (text) => {
    setProduktNamnInput(text);
  };

  const hondterProduktAntallForandring = (text) => {
    setProduktAntallInput(text);
  };

  
  const LeggTilHandleliste = () => {
  if (produktAntallInput != 0 || produktNamnInput != '') {
    setHandleliste((tidlegareHandleliste) => {
        let nyHandleliste;
        console.log(tidlegareHandleliste.length);
        console.log(handleliste.length);
        if(handleliste.length < tidlegareHandleliste.length){
          nyHandleliste = [...handleliste];
        } else {
          nyHandleliste = [...tidlegareHandleliste];
        }
        
        nyHandleliste.push({
          kategori: valgtKategori,
          produktNamn: produktNamnInput, 
          produktAntall: produktAntallInput,
          checked: false,
          utløpsdato: '',
          uformatertUtløpsdato: '',
        });
        setLagraHandleliste(nyHandleliste);
        console.log('Nytt produkt lagret i handleliste');
        return nyHandleliste;
      });
      setValgtKategori(kjøleskap.length > 0 ? kjøleskap[0].kategori : '');
      setProduktNamnInput('');
      setProduktAntallInput('');
    }
  };


  return (
    <View style={{ marginBottom: 20 }}>
      {kjøleskap.length > 0 && (
        <Picker
          selectedValue={valgtKategori}
          onValueChange={(itemValue) => hondterKategoriForandring(itemValue)}
          style={{ height: 50, width: 200, textAlign: 'center', alignItems: 'center'}}
        >
          {kjøleskap.map((kategori) => (
            <Picker.Item
              key={kategori.kategori}
              value={kategori.kategori}
              label={kategori.kategori}
            />
          ))}
        </Picker>
      )}

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, textAlign: 'center' }}
        value={produktNamnInput}
        onChangeText={(text) => hondterProduktNamnForandring(text)}
        placeholder="Produkt Navn"
      />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, textAlign: 'center' }}
        value={produktAntallInput}
        onChangeText={(text) => hondterProduktAntallForandring(text)}
        placeholder="Produkt Antall"
      />

      <Button title="Legg til Handleliste" onPress={LeggTilHandleliste} />
    </View>
  );
}

