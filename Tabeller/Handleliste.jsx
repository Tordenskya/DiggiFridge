import { useState, useEffect } from "react";
import { hentLagraHandleliste, setLagraHandleliste } from "../LocalStorage/HandlelisteLagring";

export const useHandleliste = () => {
    const [handleliste, setHandleliste] = useState([]);

    useEffect(() => {
        const hentData = async () => {
            try {
                const lagraHandleliste = await hentLagraHandleliste();
                if(lagraHandleliste != null){
                    setHandleliste(lagraHandleliste);
                } else {
                    setHandleliste([]);
                }
            } catch (error) {
                console.log('Error henting av Handleliste data' + error);
            }
        };
        hentData();
    }, [])
    return handleliste;
}