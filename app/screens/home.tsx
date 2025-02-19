import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import ItemCard from '../components/itemCard';
import { api } from '../services/api';

const HomeScreen: React.FC = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.getPlats();
                setProducts(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des plats:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <Text style={styles.title}>La carte</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ItemCard product={item} />}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Fond sombre
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#f9f9f9', // Texte clair
        textAlign: 'center',
    },
});
export default HomeScreen;
