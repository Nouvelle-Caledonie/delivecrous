import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()

    // Au montage du composant, on vérifie si un token existe
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("userToken")
            setIsAuthenticated(!!token)
        }
        checkToken()
    }, [])

    // Dès qu'on a l'information sur l'authentification
    // Si isAuthenticated est vrai, on redirige vers /screens/home
    // Sinon, on redirige vers /screens/login
    useEffect(() => {
        if (isAuthenticated === null) return // On attend d'avoir le token
        if (isAuthenticated) {
            router.replace("/screens/home")
        } else {
            router.replace("/screens/login")
        }
    }, [isAuthenticated])

    // En attendant la vérification du token, on peut afficher un écran de chargement
    return (
        <View style={styles.loadingContainer}>
            <Text>Chargement...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
