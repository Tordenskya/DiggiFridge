import React from "react";
import { useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RenderHandleliste, HandleListeInputElements } from "./Handleliste/HandlelisteInputElements";
import { RenderKjøleskap } from "./Kjøleskap/KjøleskapDisplay";
import { kjøleskap } from "./Kjøleskap/KjøleskapTabell";

export function DigggiFridge() {
    const [kjøleskapDisplay, setKjøleskapDisplay] = useState(kjøleskap);
    const [handleliste, setHandleliste] = useState([]);

    const Stack = createNativeStackNavigator();

    function holdar(){
        return (
            <View>
                <View>
                    <HandleListeInputElements setHandleliste={setHandleliste}/>
                    <RenderHandleliste setKjøleskapDisplay={setKjøleskapDisplay} handleliste={handleliste} setHandleliste={setHandleliste}/>
                    <Button
                        onPress={() => {
                            console.log("Navigating to Kjøleskap");
                            navigation.navigate('Kjøleskap');
                        }}
                        title="Go to Kjøleskap"
                    />
                </View>
                <View>
                    <RenderKjøleskap kjøleskapDisplay={kjøleskapDisplay} />
                </View>
            </View>
        );
    }

    function HandlelisteScreen() {
        const navigation = useNavigation(); // Move useNavigation inside the screen component
        console.log("Inside HandlelisteScreen");

        return (
            <View>
                <Button
                    onPress={() => {
                        console.log("Navigating to Kjøleskap");
                        navigation.navigate('Kjøleskap');
                    }}
                    title="Go to Kjøleskap"
                    style={stil.handlelisteKnapp}
                />
            </View>
        );
    }

    function KjøleskapScreen() {
        console.log("Inside KjøleskapScreen");

        return (
            <View>
                <Text>
                    Kjøleskap
                </Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Kjøleskap">
                <Stack.Screen name="Kjøleskap" component={KjøleskapScreen}/>
                <Stack.Screen name="Handleliste" component={HandlelisteScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const stil = StyleSheet.create({
    handlelisteKnapp: {
        ...StyleSheet.absoluteFillObject,
        top: 0,
        right: 5,
        alignSelf: 'flex-end',
        marginTop: -160,
        marginLeft: -70,
        width: 150,
        position: 'absolute'
    }
});
