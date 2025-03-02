import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter, usePathname} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Svg, G, Path} from 'react-native-svg';

function useCartCount(refreshDelay = 1000) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            const cart = await AsyncStorage.getItem('userCart');
            const cartItems = cart ? JSON.parse(cart) : [];
            // On additionne les quantités
            setCartCount(cartItems.reduce((acc: number, item: any) => acc + (item.quantite || 1), 0));
        };

        fetchCart();
        const interval = setInterval(fetchCart, refreshDelay);
        return () => clearInterval(interval);
    }, [refreshDelay]);

    return cartCount;
}

// ----- Icône du panier avec badge -----
const CartIcon = ({itemCount}: { itemCount: number }) => (
    <View style={{position: 'relative'}}>
        <Svg width="42" height="44" viewBox="0 0 42 44" fill="none">
            <G clipPath="url(#clip0_9414_41)">
                <Path
                    d="M10.5 35C8.85 35 7.515 36.35 7.515 38C7.515 39.65 8.85 41 10.5 41C12.15 41 13.5 39.65 13.5 38C13.5 36.35 12.15 35 10.5 35ZM1.5 11V14H4.5L9.9 25.385L7.875 29.06C7.635 29.48 7.5 29.975 7.5 30.5C7.5 32.15 8.85 33.5 10.5 33.5H28.5V30.5H11.13C10.92 30.5 10.755 30.335 10.755 30.125L10.8 29.945L12.15 27.5H23.325C24.45 27.5 25.44 26.885 25.95 25.955L31.32 16.22C31.44 16.01 31.5 15.755 31.5 15.5C31.5 14.675 30.825 14 30 14H7.815L6.405 11H1.5ZM25.5 35C23.85 35 22.515 36.35 22.515 38C22.515 39.65 23.85 41 25.5 41C27.15 41 28.5 39.65 28.5 38C28.5 36.35 27.15 35 25.5 35Z"
                    fill="#130B11"/>
            </G>
        </Svg>
        {itemCount > 0 && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
        )}
    </View>
);

// ----- HEADER EN HAUT -----
const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    // On utilise le hook pour connaître le nombre d'items
    const cartItemCount = useCartCount();

    const returnBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const pagesSansRetour = ['/', '/screens/login', '/screens/home', '/screens/validation'];
    const pagesSansPanier = ['/screens/validation'];
    const showBackButton = !pagesSansRetour.includes(pathname);
    const showCartButton = !pagesSansPanier.includes(pathname);

    return (
        <View style={styles.headerContainer}>
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={returnBack}>
                    <Ionicons name="arrow-back" size={24} color="#fff"/>
                </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>Delivecrous</Text>
        </View>
    );
};

// ----- MENU EN BAS -----
const BottomMenu = () => {
    const router = useRouter();
    const pathname = usePathname();
    // On réutilise le même hook
    const cartItemCount = useCartCount();

    // On définit nos onglets
    type KnownRoutes = '/screens/home' | '/screens/restaurants' | '/screens/panier' | '/screens/profil';

    const tabs: { key: string; label: string; icon: string; route: KnownRoutes }[] = [
        {key: 'home', label: 'Accueil', icon: 'home-outline', route: '/screens/home'},
        {key: 'restos', label: 'Restaurants', icon: 'restaurant-outline', route: '/screens/restaurants'},
        {key: 'panier', label: 'Panier', icon: 'cart-outline', route: '/screens/panier'},
        {key: 'profil', label: 'Profil', icon: 'person-outline', route: '/screens/profil'},
    ];


    // Style conditionnel si l’onglet est actif
    const isActive = (route: string) => pathname === route;


    return (
        <View style={styles.bottomMenuContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    style={styles.menuItem}
                    onPress={() => router.push(tab.route)}
                >
                    {/* Icône Panier avec badge */}
                    {tab.key === 'panier' ? (
                        <View style={{position: 'relative'}}>
                            <Ionicons
                                name={tab.icon as any}
                                size={26}
                                color={isActive(tab.route) ? '#b3b3b3' : '#777'}
                            />
                            {cartItemCount > 0 && (
                                <View style={styles.bottomBadge}>
                                    <Text style={styles.bottomBadgeText}>{cartItemCount}</Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <Ionicons
                            name={tab.icon as any}
                            size={26}
                            color={isActive(tab.route) ? '#b3b3b3' : '#777'}
                        />
                    )}
                    <Text
                        style={[
                            styles.menuItemText,
                            {color: isActive(tab.route) ? '#b3b3b3' : '#777'},
                        ]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// ----- STYLES -----
const styles = StyleSheet.create({
    // Header
    headerContainer: {
        width: '100%',
        height: 70,
        backgroundColor: '#130B11',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 20,
        borderBottomColor: "#656565",
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F9F9F9',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: '50%',
        transform: [{translateY: -12}],
        zIndex: 10,
    },
    cartButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{translateY: -12}],
        zIndex: 10,
    },
    badge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: '#E33620',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Bottom menu
    bottomMenuContainer: {
        height: 60,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#444',
        backgroundColor: '#130B11',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        fontSize: 12,
        marginTop: 4,
        color: '#F9F9F9',
    },
    bottomBadge: {
        position: 'absolute',
        right: -8,
        top: -4,
        backgroundColor: '#E33620',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

// ----- Export -----
export {Header, BottomMenu};
