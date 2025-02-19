import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './button';
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
            <TouchableOpacity onPress={handlePress} style={styles.imageWrapper}>
                <Image source={{ uri: product.image }} style={styles.image} />
            </TouchableOpacity>

            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.nom}</Text>
                <Text style={styles.category}>{product.categorie}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {product.description}
                </Text>
                <Text style={styles.price}>{product.prix.toFixed(2)} €</Text>
                {product.allergenes.length > 0 && (
                    <Text style={styles.allergenes}>
                        Allergènes: {product.allergenes.join(', ')}
                    </Text>
                )}
            </View>

            <TouchableOpacity style={styles.addButton}>
                <Button title="Ajouter au panier" onPress={addToCart} transparent={false}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#222', // Fond sombre de la carte
        borderRadius: 10,
        paddingVertical: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    imageWrapper: {
        width: '100%',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f9f9f9', // Texte clair
        marginBottom: 5,
    },
    category: {
        fontSize: 14,
        color: '#bbb', // Texte légèrement atténué
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: '#ddd', // Texte adouci pour la lecture
        textAlign: 'center',
        marginBottom: 6,
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff', // Texte bien visible
        marginBottom: 6,
    },
    allergenes: {
        fontSize: 12,
        color: '#ff4444', // Rouge pour attirer l'attention
        textAlign: 'center',
        marginTop: 2,
    },
    addButton: {
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
});


export default ItemCard;
