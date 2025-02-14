import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        }
        checkToken()
    }, [])

    useEffect(() => {
        if (isAuthenticated === false) {
            router.replace("./screens/login")
        }
    }, [isAuthenticated])

    if (isAuthenticated === null) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Chargement...</Text>
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Vous êtes connecté !</Text>
        </View>
    )
}
