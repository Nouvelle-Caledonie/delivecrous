import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Svg, G, Path, Circle, Defs, ClipPath, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CartIcon = ({ itemCount }: { itemCount: number }) => (
    <View style={{ position: 'relative' }}>
        <Svg width="42" height="44" viewBox="0 0 42 44" fill="none">
            <G clipPath="url(#clip0_9414_41)">
                <Path d="M10.5 35C8.85 35 7.515 36.35 7.515 38C7.515 39.65 8.85 41 10.5 41C12.15 41 13.5 39.65 13.5 38C13.5 36.35 12.15 35 10.5 35ZM1.5 11V14H4.5L9.9 25.385L7.875 29.06C7.635 29.48 7.5 29.975 7.5 30.5C7.5 32.15 8.85 33.5 10.5 33.5H28.5V30.5H11.13C10.92 30.5 10.755 30.335 10.755 30.125L10.8 29.945L12.15 27.5H23.325C24.45 27.5 25.44 26.885 25.95 25.955L31.32 16.22C31.44 16.01 31.5 15.755 31.5 15.5C31.5 14.675 30.825 14 30 14H7.815L6.405 11H1.5ZM25.5 35C23.85 35 22.515 36.35 22.515 38C22.515 39.65 23.85 41 25.5 41C27.15 41 28.5 39.65 28.5 38C28.5 36.35 27.15 35 25.5 35Z" fill="#130B11"/>
            </G>
        </Svg>
        {itemCount > 0 && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
        )}
    </View>
);

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            const cart = await AsyncStorage.getItem('userCart');
            const cartItems = cart ? JSON.parse(cart) : [];
            setCartItemCount(cartItems.reduce((acc: number, item: any) => acc + item.quantite, 0));
        };

        fetchCart();
        const interval = setInterval(fetchCart, 1000); // Met à jour en temps réel
        return () => clearInterval(interval);
    }, []);

    const returnBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    }

    const pagesSansRetour = ['/', '/screens/login', '/screens/home'];
    const pagesSansPanier = ['/screens/validation'];
    const showBackButton = !pagesSansRetour.includes(pathname);
    const showCartButton = !pagesSansPanier.includes(pathname);

    return (
        <View style={styles.container}>
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={() => returnBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>Delivecrous</Text>
            {showCartButton && (
                <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/screens/panier')}>
                    <CartIcon itemCount={cartItemCount} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        backgroundColor: '#FDF7EF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    title: {
        fontSize: 20,
        fontWeight: '200',
        color: '#000',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: '50%',
        transform: [{ translateY: '-50%' }],
        zIndex: 10,
    },
    cartButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: '-50%' }],
        zIndex: 10,
    },
    badge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: '#E33620',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Header;
