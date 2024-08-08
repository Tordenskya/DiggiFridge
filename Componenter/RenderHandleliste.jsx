import { useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { useKjøleskap } from '../Tabeller/KjoleskapTabell';
import { FlyttTilKjøleskap } from './FlyttTilKjoleskap';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SøppelIcon from '../assets/trash-can-10416.png';
import { useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { hentLagraHandleliste, setLagraHandleliste } from '../LocalStorage/HandlelisteLagring';



//Viser fram handlelista
export function RenderHandleliste({setKjøleskapDisplay, oppdaterNotifikasjoner, setHandleliste, handleliste, planlagdNotifikasjon, setPlanlagdNotifikasjon}) {
    const kjøleskap = useKjøleskap();
    const [handlelisteDisplay, setHandlelisteDisplay] = useState(handleliste);
    const [visDatePicker, setVisDatePicker] = useState(false);
    const [checkedProdukt, setCheckedProdukt] = useState([]);

    useEffect(() => {
      setHandlelisteDisplay(handleliste);
    }, [handleliste]);
  
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
  
      handleliste[indeks].utløpsdato = new Date(nyUtløpsdato).toLocaleDateString();
      handleliste[indeks].uformatertUtløpsdato = new Date(nyUtløpsdato).toISOString().split('T')[0];
      setVisDatePicker(false);
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
      console.log('Handleliste antall: ' + handleliste.length)
      if(handleliste.length > 0) {
        console.log('Flytt til kjøleskap');
        setLagraHandleliste([]);
        setKjøleskapDisplay(FlyttTilKjøleskap({ handleliste, kjøleskap, oppdaterNotifikasjoner, planlagdNotifikasjon, setPlanlagdNotifikasjon}));
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
  
  
            <TouchableOpacity onPress={() => DeleteProdukt(i)}>
              <Image source={SøppelIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            
            <Text style={{ fontSize: 16 }}>{`${produkt.produktNamn} - ${produkt.produktAntall}`}</Text>
  
            {checkedProdukt[i] && visDatePicker && (
              <DateTimePicker display="spinner" value={new Date()} onChange={(event) => HondterUtløpsdatoForandring(event, i)}/>
            )}
  
  
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
      },
    
  });