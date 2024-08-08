import { RenderKjøleskap } from '../Componenter/KjøleskapDisplay';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function KjøleskapScreen({ kjøleskapDisplay, oppdaterNotifikasjoner, HandlelisteIcon }) {
  const navigation = useNavigation();

  return (
    <View style={stil.container}>
      <RenderKjøleskap kjøleskapDisplay={kjøleskapDisplay} oppdaterNotifikasjoner={oppdaterNotifikasjoner} />
      <TouchableOpacity style={stil.handlelisteKnapp} onPress={() => { navigation.navigate('Handleliste'); }}>
        <Image source={HandlelisteIcon} style={{ width: 90, height: 90 }} />
      </TouchableOpacity>
    </View>
  );
}

const stil = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  handlelisteKnapp: {
    width: 130,
    height: 120,
    position: 'absolute',
    bottom: 30,
    right: 10,
    borderRadius: 90,
    backgroundColor: 'lightblue',
    padding: 12,
    alignContent: 'center',
    alignItems: 'center',
  },
});
