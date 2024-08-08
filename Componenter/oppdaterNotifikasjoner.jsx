import { finnProduktForUtløpsdato } from "./finnProduktForUtløpsdato";
import { avbrytPlanlagdNotifikasjon } from "./avbrytPlanlagdNotifikasjon";
import { sendPlanlagdNotifikasjon } from "./sendPlanlagdNotifikasjon";

export const oppdaterNotifikasjoner = (kjøleskap, utløpsdato, isDelete = false, planlagdNotifikasjon, setPlanlagdNotifikasjon) => {
    console.log('Produkt med utløpsdato ' + utløpsdato + ': ' + finnProduktForUtløpsdato( kjøleskap, utløpsdato));
  
    const produkt = finnProduktForUtløpsdato( kjøleskap, utløpsdato);
  
    if(isDelete && finnProduktForUtløpsdato( kjøleskap, utløpsdato).length === 0){
      //Om det er ingen produkt med utløpsdatoen blir notifikasjonen slettet
      avbrytPlanlagdNotifikasjon(utløpsdato, );
      console.log('Ingen fleire produkt med denne utløpsdatoen');
    } else {
      //Om noko blir slettet eller lagt til sletter det den tidligere planlagde notifikasjonen og lager ny med produkter som har lik utløpsdato
      avbrytPlanlagdNotifikasjon(utløpsdato, planlagdNotifikasjon, setPlanlagdNotifikasjon);
      sendPlanlagdNotifikasjon(utløpsdato, produkt, planlagdNotifikasjon);
      console.log('Lagd nye notifikasjoner');
    }
  
  };