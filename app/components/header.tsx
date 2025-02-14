import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    // Liste des pages où la flèche NE DOIT PAS apparaître
    const pagesSansRetour = ['/', '/screens/login', '/screens/home'];

    const showBackButton = !pagesSansRetour.includes(pathname);

    return (
        <View style={styles.container}>
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>Delivecrous</Text>
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
        position: 'relative', // Assurer une bonne gestion du positionnement
    },
    title: {
        fontSize: 20,
        fontWeight: '200',
        color: '#000',
    },
    backButton: {
        position: 'absolute',
        left: 15, // Assure que la flèche est bien à gauche
        top: '50%',
        transform: [{ translateY: -12 }], // Centrer verticalement
        zIndex: 10, // Assurer que la flèche est au-dessus du titre
    },
});

export default Header;
