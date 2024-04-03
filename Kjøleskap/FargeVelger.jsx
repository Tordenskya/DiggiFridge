import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export function fargeVelger({valgtFarge, setValgtFarge}) {
    const farger = [];

    const hondterFargeValg = (farge) => {
        setValgtFarge(farge);
    }

    return (
        <View>
            {farger.map((farge, indeks) => (
                <TouchableOpacity
                    key={indeks}
                    style={[styles.colorOption, { backgroundColor: color, borderColor: selectedColor === color ? 'black' : 'transparent' }]}
                    onPress={() => hondterFargeValg(farge)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    colorPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    colorOption: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      marginHorizontal: 5,
    },
  });