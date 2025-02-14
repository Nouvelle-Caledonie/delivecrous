import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

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

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
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
});

export default ItemCard;
