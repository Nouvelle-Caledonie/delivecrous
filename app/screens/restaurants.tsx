import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { api } from '../services/api';

// Calcule la distance (en km) entre deux points géographiques
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Vérifie si le restaurant est ouvert actuellement
const isRestaurantOpen = (restaurant: any): boolean => {
    if (!restaurant.horaires) return false;
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const currentDay = days[new Date().getDay()];
    const horaires = restaurant.horaires[currentDay];
    if (!horaires) return false;

    // Format attendu : "10:00 - 21:30"
    const [openTime, closeTime] = horaires.split('-').map(s => s.trim());
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
};

const HomeScreen: React.FC = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    // États pour les filtres
    const [filtersVisible, setFiltersVisible] = useState(false);
    // Filtre localisation
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    // Par défaut, le rayon est fixé à 30 km (valeur maximale)
    const [radius, setRadius] = useState(30);
    // Filtre "ouvert actuellement"
    const [openNow, setOpenNow] = useState(false);

    // Cache des coordonnées – on utilise l'ID du restaurant comme clé
    const coordinatesCache = useRef<{ [key: string]: { latitude: number; longitude: number } }>({});

    // Récupération initiale des restaurants
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await api.getRestaurants();
                setRestaurants(response);
                setFilteredRestaurants(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    // Récupérer automatiquement la position de l'utilisateur au montage
    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const location = await Location.getCurrentPositionAsync({});
                    setUserLocation({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la position:', error);
            }
        };
        getLocation();
    }, []);

    // Application progressive des filtres avec gestion d'annulation
    useEffect(() => {
        let isActive = true; // flag pour annuler les mises à jour si les filtres changent

        if (filtersVisible) {
            setFilteredRestaurants([]); // vider immédiatement la liste affichée
            setIsFiltering(true);

            const promises = restaurants.map((restaurant, index) =>
                new Promise(async (resolve) => {
                    // Délai pour simuler l'affichage progressif
                    await new Promise(res => setTimeout(res, index * 100));
                    if (!isActive) return resolve(null);

                    let enriched = restaurant;
                    // Filtre de localisation
                    if (userLocation) {
                        // Vérification dans le cache en utilisant restaurant.id comme clé
                        if (!restaurant.latitude || !restaurant.longitude) {
                            const cached = coordinatesCache.current[restaurant.id];
                            if (cached) {
                                enriched = { ...restaurant, latitude: cached.latitude, longitude: cached.longitude };
                            } else {
                                const coords = await api.getCoordinatesFromAddress(restaurant.adresse);
                                if (coords) {
                                    // Stocker dans le cache
                                    coordinatesCache.current[restaurant.id] = coords;
                                    enriched = { ...restaurant, latitude: coords.latitude, longitude: coords.longitude };
                                }
                            }
                        }
                        if (enriched.latitude && enriched.longitude) {
                            const distance = getDistance(
                                userLocation.latitude,
                                userLocation.longitude,
                                enriched.latitude,
                                enriched.longitude
                            );
                            // Si la distance est supérieure au rayon choisi, on n'ajoute pas ce restaurant
                            if (distance > radius) {
                                return resolve(null);
                            }
                        } else {
                            return resolve(null);
                        }
                    }
                    // Filtre "ouvert actuellement"
                    if (openNow && !isRestaurantOpen(enriched)) {
                        return resolve(null);
                    }
                    if (isActive) {
                        // Éviter les doublons en vérifiant via l'ID
                        setFilteredRestaurants(prev => {
                            if (!prev.find((r: any) => r.id === enriched.id)) {
                                return [...prev, enriched];
                            }
                            return prev;
                        });
                    }
                    resolve(enriched);
                })
            );

            Promise.all(promises).then(() => {
                if (isActive) setIsFiltering(false);
            });
        } else {
            // Si aucun filtre n'est activé, afficher la liste complète
            setFilteredRestaurants(restaurants);
            setIsFiltering(false);
        }
        return () => {
            isActive = false;
        };
    }, [restaurants, filtersVisible, userLocation, radius, openNow]);

    const renderRestaurant = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.restaurantName}>{item.nom}</Text>
                <View style={styles.ratingContainer}>
                    <Icon name="star" size={18} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.noteMoyenne}</Text>
                </View>
            </View>
            <Text style={styles.typeCuisine}>
                <Icon name="restaurant" size={16} color="#ff6347" /> {item.typeCuisine}
            </Text>
            <Text style={styles.address}>
                <Icon name="location" size={16} color="#555" /> {item.adresse}
            </Text>
            <Text style={styles.statusText}>
                {isRestaurantOpen(item) ? (
                    <Text style={styles.openText}>Ouvert actuellement</Text>
                ) : (
                    <Text style={styles.closedText}>Fermé</Text>
                )}
            </Text>
            <Text style={styles.telephone}>
                <Icon name="call" size={16} color="#555" /> {item.telephone}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderText}>Commander</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>🍽️ Restaurants disponibles</Text>

            {/* Bouton de filtre avec icône */}
            <TouchableOpacity style={styles.filterButton} onPress={() => setFiltersVisible(!filtersVisible)}>
                <Icon name="filter" size={24} color="#fff" />
                <Text style={styles.filterButtonLabel}>Filtrer</Text>
            </TouchableOpacity>

            {filtersVisible && (
                <View style={styles.filtersContainer}>
                    {/* Filtre de localisation */}
                    <Text style={styles.filterLabel}>📍 Distance max : {radius} km</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={30}
                        step={1}
                        value={radius}
                        onValueChange={setRadius}
                        minimumTrackTintColor="#ff6347"
                        maximumTrackTintColor="#ddd"
                        thumbTintColor="#ff6347"
                    />
                    {/* Filtre "Ouvert actuellement" */}
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Ouvert actuellement</Text>
                        <Switch value={openNow} onValueChange={setOpenNow} />
                    </View>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#ff6347" style={styles.loader} />
            ) : filtersVisible && isFiltering ? (
                <ActivityIndicator size="large" color="#ff6347" style={styles.loader} />
            ) : filteredRestaurants.length > 0 ? (
                <FlatList
                    data={filteredRestaurants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderRestaurant}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.noResults}>😢 Aucun restaurant trouvé</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1,
        backgroundColor: "#121212",
        padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#f9f9f9' },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 10
    },
    filterButtonLabel: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
    filtersContainer: {
        marginBottom: 20,
        backgroundColor: '#2a2a2a',
        padding: 10,
        borderRadius: 5
    },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    filterLabel: { fontSize: 16, fontWeight: 'bold', color: '#f9f9f9' },
    slider: { width: 250, alignSelf: 'center', marginTop: 5 },
    loader: { marginTop: 20 },
    list: { paddingBottom: 20 },
    card: {
        backgroundColor: '#252525',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    restaurantName: { fontSize: 18, fontWeight: 'bold', color: '#f9f9f9' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { marginLeft: 5, fontSize: 16, color: '#f9f9f9' },
    typeCuisine: { fontSize: 16, marginBottom: 5, color: '#f9f9f9' },
    address: { fontSize: 14, color: '#bbb', marginBottom: 5 },
    statusText: { fontSize: 14, marginBottom: 5, color: '#f9f9f9' },
    openText: { color: '#4CAF50', fontWeight: 'bold' },
    closedText: { color: '#e53935', fontWeight: 'bold' },
    telephone: { fontSize: 14, color: '#bbb', marginBottom: 5 },
    description: { fontSize: 14, color: '#f9f9f9', marginBottom: 10 },
    orderButton: { backgroundColor: '#d32f2f', padding: 10, borderRadius: 5, alignItems: 'center' },
    orderText: { color: '#fff', fontWeight: 'bold' },
    noResults: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 }
});

export default HomeScreen;
