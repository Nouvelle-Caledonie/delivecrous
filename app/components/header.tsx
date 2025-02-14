import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Svg, G, Path, Circle, Defs, ClipPath, Rect } from 'react-native-svg';

const CartIcon = () => (
    <Svg width="42" height="44" viewBox="0 0 42 44" fill="none">
        <G clipPath="url(#clip0_9414_41)">
            <Path d="M10.5 35C8.85 35 7.515 36.35 7.515 38C7.515 39.65 8.85 41 10.5 41C12.15 41 13.5 39.65 13.5 38C13.5 36.35 12.15 35 10.5 35ZM1.5 11V14H4.5L9.9 25.385L7.875 29.06C7.635 29.48 7.5 29.975 7.5 30.5C7.5 32.15 8.85 33.5 10.5 33.5H28.5V30.5H11.13C10.92 30.5 10.755 30.335 10.755 30.125L10.8 29.945L12.15 27.5H23.325C24.45 27.5 25.44 26.885 25.95 25.955L31.32 16.22C31.44 16.01 31.5 15.755 31.5 15.5C31.5 14.675 30.825 14 30 14H7.815L6.405 11H1.5ZM25.5 35C23.85 35 22.515 36.35 22.515 38C22.515 39.65 23.85 41 25.5 41C27.15 41 28.5 39.65 28.5 38C28.5 36.35 27.15 35 25.5 35Z" fill="#130B11"/>
        </G>
        <Circle cx="31.5" cy="10.5" r="10.5" fill="#E33620"/>
        <Path d="M34.95 15.04V16H27.585V15.235L31.95 10.96C32.5 10.42 32.87 9.955 33.06 9.565C33.26 9.165 33.36 8.765 33.36 8.365C33.36 7.745 33.145 7.265 32.715 6.925C32.295 6.575 31.69 6.4 30.9 6.4C29.67 6.4 28.715 6.79 28.035 7.57L27.27 6.91C27.68 6.43 28.2 6.06 28.83 5.8C29.47 5.54 30.19 5.41 30.99 5.41C32.06 5.41 32.905 5.665 33.525 6.175C34.155 6.675 34.47 7.365 34.47 8.245C34.47 8.785 34.35 9.305 34.11 9.805C33.87 10.305 33.415 10.88 32.745 11.53L29.175 15.04H34.95Z" fill="#FDF7EF"/>
        <Defs>
            <ClipPath id="clip0_9414_41">
                <Rect width="36" height="36" fill="white" transform="translate(0 8)"/>
            </ClipPath>
        </Defs>
    </Svg>
);

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const pagesSansRetour = ['/', '/screens/login', '/screens/home'];
    const pagesSansPanier = ['/screens/validation'];
    const showBackButton = !pagesSansRetour.includes(pathname);
    const showCartButton = !pagesSansPanier.includes(pathname);

    return (
        <View style={styles.container}>
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>Delivecrous</Text>
            {showCartButton && (
                <TouchableOpacity style={styles.cartButton}>
                    <CartIcon />
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
        position: 'relative'
    },
    title: {
        fontSize: 20,
        fontWeight: '200',
        color: '#000'
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: 10
    },
    cartButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: 10
    }
});

export default Header;
