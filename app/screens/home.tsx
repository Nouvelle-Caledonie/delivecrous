import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
    console.log("HomeScreen chargé !");
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenue sur la page d'accueil !</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});