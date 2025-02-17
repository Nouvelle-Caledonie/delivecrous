import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Plat {
    id: string;
    nom: string;
    description: string;
    prix: number;
    allergenes: string[];
    categorie: string;
    disponible: boolean;
    restaurantId: string;
    image: any; // on stocke directement le require, donc "any"
    quantite: number;
}

export default function Panier(): JSX.Element {
    const [cart, setCart] = useState<Plat[]>([]);

    useEffect(() => {
        initCart();
    }, []);

    const initCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('userCart');
            if (!storedCart || storedCart === '[]') {
                const defaultCart: Plat[] = [
                    {
                        id: '10',
                        nom: 'Pizza Napolitaine',
                        description: 'Tomates fraîches, mozzarella, basilic.',
                        prix: 10.0,
                        allergenes: ['gluten', 'lactose'],
                        categorie: 'Pizza',
                        disponible: true,
                        restaurantId: '2',
                        image: require('@/assets/images/plats/napolitaine.jpeg'),
                        quantite: 2,
                    },
                    {
                        id: '11',
                        nom: 'Sushi Maki',
                        description: 'Rouleaux de riz, poisson cru, algue nori.',
                        prix: 12.5,
                        allergenes: ['poisson', 'soja'],
                        categorie: 'Japonais',
                        disponible: true,
                        restaurantId: '4',
                        image: require('@/assets/images/plats/sushi.jpeg'),
                        quantite: 1,
                    },
                ];
                await AsyncStorage.setItem('userCart', JSON.stringify(defaultCart));
                setCart(defaultCart);
            } else {
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Erreur lors de l’init du panier :', error);
        }
    };

    const saveCart = async (newCart: Plat[]) => {
        setCart(newCart);
        await AsyncStorage.setItem('userCart', JSON.stringify(newCart));
    };

    const incrementItem = (id: string) => {
        const updated = cart.map((item) =>
            item.id === id ? { ...item, quantite: item.quantite + 1 } : item
        );
        saveCart(updated);
    };

    const decrementItem = (id: string) => {
        const updated = cart
            .map((item) =>
                item.id === id ? { ...item, quantite: item.quantite - 1 } : item
            )
            .filter((p) => p.quantite > 0);
        saveCart(updated);
    };

    // Exemple d'action pour passer la commande
    const handlePasserCommande = () => {
        console.log('Commande validée avec les items : ', cart);
        // Tu peux appeler ici un endpoint API (createCommande), vider le panier, etc.
    };

    const renderItem = ({ item }: { item: Plat }) => (
        <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
                {item.image ? (
                    <Image source={item.image} style={styles.image} />
                ) : (
                    <Text>Pas d’image</Text>
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.nom}>{item.nom}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.prix}>{item.prix} €</Text>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => decrementItem(item.id)} style={styles.btn}>
                    <Text style={styles.btnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantite}>{item.quantite}</Text>
                <TouchableOpacity onPress={() => incrementItem(item.id)} style={styles.btn}>
                    <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const calcTotal = (): number => {
        return cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ton panier</Text>
            <FlatList
                data={cart}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderItem}
                style={styles.list}
            />
            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: {calcTotal().toFixed(2)} €</Text>
                <Text style={styles.deliveryText}>Délai de livraison estimé : ~30 min</Text>
                <TouchableOpacity onPress={handlePasserCommande} style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>Passer la commande</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    list: {
        marginBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        padding: 15,
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
        elevation: 1,
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 10,
        justifyContent: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 6,
        resizeMode: 'cover',
    },
    infoContainer: {
        flex: 1,
        paddingRight: 10,
    },
    nom: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: '#000',
    },
    desc: {
        fontStyle: 'italic',
        color: '#555',
        marginBottom: 4,
    },
    prix: {
        fontWeight: '600',
        color: '#333',
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
    },
    btnText: {
        fontSize: 20,
        color: '#000',
    },
    quantite: {
        fontSize: 16,
        minWidth: 20,
        textAlign: 'center',
        color: '#000',
    },
    footer: {
        marginTop: 10,
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#000',
    },
    deliveryText: {
        marginBottom: 20,
    },
    orderButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
