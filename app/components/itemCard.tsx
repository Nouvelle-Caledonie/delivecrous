import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ItemCardProps {
    product: {
        id: number;
        nom: string;
        description: string;
        prix: number;
        allergenes: string[];
        categorie: string;
        disponible: boolean;
        restaurantId: string;
        image: string;
    };
}

const ItemCard: React.FC<ItemCardProps> = ({ product }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/screens/details/${product.id}`);
    };

    const addToCart = async () => {
        try {
            const existingCart = await AsyncStorage.getItem('userCart');
            const cart = existingCart ? JSON.parse(existingCart) : [];

            const index = cart.findIndex((item: any) => item.id === product.id);
            if (index !== -1) {
                cart[index].quantite = (cart[index].quantite || 0) + 1;
            } else {
                cart.push({ ...product, quantite: 1 });
            }

            await AsyncStorage.setItem('userCart', JSON.stringify(cart));
            console.log('Panier mis à jour:', cart);
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier:", error);
        }
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handlePress}>
                <Image source={{ uri: product.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{product.nom}</Text>
                    <Text style={styles.category}>{product.categorie}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                    <Text style={styles.price}>{product.prix} €</Text>
                    {product.allergenes.length > 0 && (
                        <Text style={styles.allergenes}>Allergènes: {product.allergenes.join(', ')}</Text>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addToCart}>
                <Text style={styles.addButtonText}>Ajouter au panier</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    infoContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    allergenes: {
        fontSize: 12,
        color: '#c00',
        marginTop: 5,
    },
    addButton: {
        marginTop: 10,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ItemCard;
