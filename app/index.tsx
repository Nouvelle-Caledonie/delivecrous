import React, { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("userToken")
            setIsAuthenticated(!!token)
        }
        checkToken()
    }, [])

    useEffect(() => {
        if (isAuthenticated === false) {
            router.replace("./screens/login")
        }
    }, [isAuthenticated])

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken")
        setIsAuthenticated(false)
    }

    if (isAuthenticated === null) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Chargement...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Vous êtes connecté !</Text>
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    welcomeText: {
        fontSize: 18,
        marginBottom: 10
    }
})
