 export const finnProduktForUtløpsdato = ( kjøleskap, utløpsdato) => {
    const produktMedSammeUtløpsdato = [];
    console.log('Finn produkt med utløpsdato starta');
    for(let k = 0; k < kjøleskap.length; k++){
      for(let p = 0; p < kjøleskap[k].produkt.length; p++){
        if(kjøleskap[k].produkt[p].uformatertUtløpsdato.match(utløpsdato)){
          produktMedSammeUtløpsdato.push(kjøleskap[k].produkt[p].produktNamn);
          console.log('Funnet produkt med utløpsdato ' + kjøleskap[k].produkt[p].produktNamn);
        }
      }
    };
    return produktMedSammeUtløpsdato;
  }