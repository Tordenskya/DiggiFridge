import { useState} from 'react';
import { Picker } from '@react-native-picker/picker';  
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { FlyttTilKjøleskap, useKjøleskap } from '../Kjøleskap/KjøleskapTabell';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { hentLagraHandleliste, setLagraHandleliste } from './HandlelisteLagring';
import { useHandleliste } from './Handleliste';

//Viser fram handlelista
export function RenderHandleliste({setKjøleskapDisplay, oppdaterNotifikasjoner, setHandleliste}) {
  const kjøleskap = useKjøleskap();
  const handleliste = useHandleliste();
  const [handlelisteDisplay, setHandlelisteDisplay] = useState(handleliste);
  const [visDatePicker, setVisDatePicker] = useState(false);
  const [checkedProdukt, setCheckedProdukt] = useState([]);
  const [utløpsdato, setUtløpsdato] = useState(new Date());

  //Når ein checkbox blir checked viser den fram ein kalender for å legge inn utløpsdato data
  const HondterCheckBoxForandring = (indeks) => {
    setCheckedProdukt((tidligareCheckedProdukt) => {
      const nyttCheckedProdukt = [...tidligareCheckedProdukt];
      nyttCheckedProdukt[indeks] = !nyttCheckedProdukt[indeks];

      handlelisteDisplay[indeks].checked = nyttCheckedProdukt[indeks];
      handleliste[indeks].utløpsdato = nyttCheckedProdukt[indeks] ? '' : null;
      handleliste[indeks].checked = true;

      setVisDatePicker(nyttCheckedProdukt[indeks]);

      return nyttCheckedProdukt;
    });
  }

  //Når utløpsdato data er lagret blir det lagt inn i riktig produkt
  const HondterUtløpsdatoForandring = (event, indeks) => {
    const nyUtløpsdato = event.nativeEvent.timestamp;
    const localFormatUtløpsdato = new Date(nyUtløpsdato).toLocaleDateString();
    const isoFormatUtløpsdato = new Date(nyUtløpsdato).toISOString();

    setUtløpsdato(new Date(nyUtløpsdato));
    handleliste[indeks].utløpsdato = localFormatUtløpsdato;
    handleliste[indeks].uformatertUtløpsdato = isoFormatUtløpsdato;
  }

  //Sletter eit produkt frå handlelista
  const DeleteProdukt = (indeks) => {
    setHandlelisteDisplay((handleliste) => {
      const nyHandleliste = [...handleliste];
      nyHandleliste.splice(indeks, 1);
      setLagraHandleliste(nyHandleliste);
      setHandleliste(nyHandleliste);
      console.log('Sletter produkt frå handleliste: ')
      console.log(handleliste.length);
      console.log(nyHandleliste.length);
      return nyHandleliste;
    });
    console.log(handleliste);
  };

  //Sender data til kjøleskapet og resetter handleliste tabeller
  const flyttFraHandleliste = () => {
    if(handleliste.length > 0) {
      console.log('Flytt til kjøleskap');
      setLagraHandleliste([]);
      setKjøleskapDisplay(FlyttTilKjøleskap({ handleliste, kjøleskap, oppdaterNotifikasjoner }));
    }
    setCheckedProdukt([]);
    console.log(handleliste);
  };

  useEffect(() => {
    const hentData = async () => {
      try {
        const lagraHanleliste = await hentLagraHandleliste();
        if(lagraHanleliste != null){
          setHandlelisteDisplay(lagraHanleliste);
        } else {
          setHandlelisteDisplay([]);
        }
      } catch (error) {
        console.error('Error henting av lagra handleliste data', error);
      }
    };
    hentData();
  }, [handleliste]);

  const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    punkt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    }
  });

  
  return (
    <View>
      {handlelisteDisplay.map((produkt, i) => (
        <View key={i} style={styles.punkt}>
          
          <Text style={{ fontSize: 16 }}>{`${produkt.produktNamn} - ${produkt.produktAntall}`}</Text>

          {checkedProdukt[i] && visDatePicker && (
            <DateTimePicker display="spinner" value={new Date()} onChange={(event) => HondterUtløpsdatoForandring(event, i)}/>
          )}

          <Button
            title="Slett"
            onPress={() => DeleteProdukt(i)}
          />

          <Checkbox
            value={produkt.checked}
            onValueChange={() => HondterCheckBoxForandring(i)}
          />
        </View>
      ))}
      <TouchableOpacity style={HandlelisteStil.FTKKnapp} onPress={flyttFraHandleliste}>
        <Text style={HandlelisteStil.knappTekst}>Flytt til kjøleskap</Text>
      </TouchableOpacity>
      
    </View>
  );
}

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
          style={{ height: 50, width: 200 }}
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
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        value={produktNamnInput}
        onChangeText={(text) => hondterProduktNamnForandring(text)}
        placeholder="Produkt Navn"
      />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        value={produktAntallInput}
        onChangeText={(text) => hondterProduktAntallForandring(text)}
        placeholder="Produkt Antall"
      />

      <Button title="Legg til Handleliste" onPress={LeggTilHandleliste} />
    </View>
  );
}


  const HandlelisteStil = StyleSheet.create({
    FTKKnapp: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignSelf: 'flex-end',
      marginTop: -40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: -70,
      width: 'full',
      height: 50,
      backgroundColor: 'lightblue'
      },
      knappTekst: {
        fontSize: 20,
      }
  });