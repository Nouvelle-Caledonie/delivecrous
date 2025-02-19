import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
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
        if (isAuthenticated === null) return // On attend d'avoir le token
        if (isAuthenticated) {
            router.replace("/screens/home")
        } else {
            router.replace("/screens/login")
        }
    }, [isAuthenticated])

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
