import { View } from 'react-native';
import { HandleListeInputElements } from '../Componenter/HandlelisteInputElements';
import { RenderHandleliste } from "../Componenter/RenderHandleliste";

export function HandlelisteScreen({ handleliste, setHandleliste, setKjøleskapDisplay, oppdaterNotifikasjoner, planlagdNotifikasjon, setPlanlagdNotifikasjon }) {
  return (
    <View>
      <HandleListeInputElements setHandleliste={setHandleliste} />
      <RenderHandleliste setKjøleskapDisplay={setKjøleskapDisplay} oppdaterNotifikasjoner={oppdaterNotifikasjoner} setHandleliste={setHandleliste} handleliste={handleliste} planlagdNotifikasjon={planlagdNotifikasjon} setPlanlagdNotifikasjon={setPlanlagdNotifikasjon}/>
    </View>
  );
}
