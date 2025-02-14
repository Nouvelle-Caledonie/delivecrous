import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/header';
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
        <View style={styles.container}>
            <Text style={styles.title}>La carte</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ItemCard product={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
});

export default HomeScreen;
