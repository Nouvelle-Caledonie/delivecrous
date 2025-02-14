import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../services/api';

const DetailsScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.getPlatsById(id);
                setProduct(response);
            } catch (error) {
                console.error('Erreur lors de la récupération du produit:', error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <Text style={styles.loading}>Chargement...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.name}>{product.nom}</Text>
            <Text style={styles.category}>{product.categorie}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Text style={styles.price}>{product.prix} €</Text>
            {product.allergenes.length > 0 && (
                <Text style={styles.allergenes}>Allergènes: {product.allergenes.join(', ')}</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    category: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    allergenes: {
        fontSize: 14,
        color: '#c00',
    },
    loading: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default DetailsScreen;
