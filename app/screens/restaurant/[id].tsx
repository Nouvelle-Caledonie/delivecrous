import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../services/api';

const RestaurantScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [plats, setPlats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const res = await api.getRestaurant(id);
                setRestaurant(res);
                const platsRes = await api.getPlatsByRestaurant(id);
                setPlats(platsRes);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du restaurant', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6347" />
            </View>
        );
    }

    if (!restaurant) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Restaurant introuvable.</Text>
            </View>
        );
    }

    const renderPlat = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => router.push(`/screens/details/${item.id}`)}
            style={styles.platCard}
        >
            {item.image && (
                <Image source={{ uri: item.image }} style={styles.platImage} />
            )}
            <View style={styles.platInfo}>
                <Text style={styles.platName}>{item.nom}</Text>
                <Text style={styles.platDescription}>{item.description}</Text>
                <Text style={styles.platPrice}>{item.prix} €</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* En-tête du restaurant */}
            <View style={styles.header}>
                <Text style={styles.restaurantName}>{restaurant.nom}</Text>
                <View style={styles.infoRow}>
                    <Icon name="location" size={20} color="#bbb" />
                    <Text style={styles.infoText}>{restaurant.adresse}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="call" size={20} color="#bbb" />
                    <Text style={styles.infoText}>{restaurant.telephone}</Text>
                </View>
                {restaurant.description && (
                    <Text style={styles.description}>{restaurant.description}</Text>
                )}
                <View style={styles.additionalInfo}>
                    <View style={styles.infoItem}>
                        <Icon name="restaurant" size={18} color="#ff6347" />
                        <Text style={styles.infoItemText}>{plats.length} plats disponibles</Text>
                    </View>
                    {restaurant.noteMoyenne && (
                        <View style={styles.infoItem}>
                            <Icon name="star" size={18} color="#FFD700" />
                            <Text style={styles.infoItemText}>{restaurant.noteMoyenne} / 5</Text>
                        </View>
                    )}
                </View>
            </View>

            <Text style={styles.menuTitle}>Menu</Text>
            <FlatList
                data={plats}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPlat}
                contentContainerStyle={styles.platsList}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: '#fff', textAlign: 'center', marginTop: 20, fontSize: 18 },
    header: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#252525',
        borderRadius: 8
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f9f9f9',
        marginBottom: 10
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    infoText: {
        fontSize: 16,
        color: '#bbb',
        marginLeft: 5
    },
    description: {
        fontSize: 16,
        color: '#f9f9f9',
        marginTop: 10
    },
    additionalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoItemText: {
        fontSize: 16,
        color: '#f9f9f9',
        marginLeft: 5
    },
    menuTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f9f9f9',
        marginVertical: 10
    },
    platsList: { paddingBottom: 20 },
    platCard: {
        flexDirection: 'row',
        backgroundColor: '#252525',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden'
    },
    platImage: {
        width: 100,
        height: 100
    },
    platInfo: {
        flex: 1,
        padding: 10
    },
    platName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f9f9f9'
    },
    platDescription: {
        fontSize: 14,
        color: '#ccc',
        marginVertical: 5
    },
    platPrice: {
        fontSize: 16,
        color: '#ff6347',
        fontWeight: 'bold'
    }
});

export default RestaurantScreen;
