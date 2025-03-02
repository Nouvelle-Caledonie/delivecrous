import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../services/api';
import Button from '../../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.getPlatsById(id);
                setProduct(response);
            } catch (error) {
                console.error('Erreur lors de la récupération du produit:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        try {
            const existingCart = await AsyncStorage.getItem('userCart');
            const cart = existingCart ? JSON.parse(existingCart) : [];
            cart.push(product);
            await AsyncStorage.setItem('userCart', JSON.stringify(cart));
            console.log('Panier mis à jour:', cart);
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loading}>Chargement...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Produit introuvable.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.nom}</Text>
                <Text style={styles.category}>{product.categorie}</Text>
            </View>
            <Text style={styles.description}>{product.description}</Text>
            <Text style={styles.price}>{product.prix} €</Text>
            {product.allergenes && product.allergenes.length > 0 && (
                <Text style={styles.allergenes}>Allergènes : {product.allergenes.join(', ')}</Text>
            )}
            <Button title="Ajouter au panier" onPress={addToCart} transparent={true} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 15,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f9f9f9',
    },
    category: {
        fontSize: 16,
        color: '#bbb',
        marginTop: 4,
    },
    description: {
        fontSize: 16,
        color: '#f9f9f9',
        marginBottom: 10,
        lineHeight: 22,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ff6347',
        marginBottom: 10,
    },
    allergenes: {
        fontSize: 14,
        color: '#e53935',
        marginBottom: 20,
    },
    loading: {
        fontSize: 18,
        color: '#f9f9f9',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#f9f9f9',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default DetailsScreen;
