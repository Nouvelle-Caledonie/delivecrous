import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import axios from "axios"
import { api } from "../services/api"

const BASE_URL = "http://localhost:3000"

interface Plat {
    id: string
    nom: string
    description: string
    prix: number
    allergenes: string[]
    categorie: string
    disponible: boolean
    restaurantId: string
    image: any
    quantite: number
}

export default function Panier(): JSX.Element {
    const [cart, setCart] = useState<Plat[]>([])
    const [userId, setUserId] = useState("")
    const router = useRouter()

    useEffect(() => {
        initCart()
        getUserId()
    }, [])

    async function initCart() {
        const storedCart = await AsyncStorage.getItem("userCart")
        setCart(storedCart ? JSON.parse(storedCart) : [])
    }

    async function getUserId() {
        const storedEmail = await AsyncStorage.getItem("User")
        if (storedEmail) {
            try {
                const response = await axios.get(`${BASE_URL}/users?email=${storedEmail}`)
                if (response.data && response.data.length > 0) {
                    const user = response.data[0]
                    setUserId(user.id)
                }
            } catch {}
        }
    }

    async function saveCart(newCart: Plat[]) {
        setCart(newCart)
        await AsyncStorage.setItem("userCart", JSON.stringify(newCart))
    }

    function incrementItem(id: string) {
        const updated = cart.map(item =>
            item.id === id ? { ...item, quantite: item.quantite + 1 } : item
        )
        saveCart(updated)
    }

    function decrementItem(id: string) {
        const updated = cart
            .map(item =>
                item.id === id ? { ...item, quantite: item.quantite - 1 } : item
            )
            .filter(p => p.quantite > 0)
        saveCart(updated)
    }

    function calcTotal() {
        return cart.reduce((acc, item) => acc + item.prix * item.quantite, 0)
    }

    async function handlePasserCommande() {
        try {
            const newCommande = {
                userId: userId,
                plats: cart.map(item => ({ platId: item.id, quantite: item.quantite })),
                total: calcTotal(),
                date: new Date().toISOString(),
                statut: "en préparation"
            }
            await api.createCommande(newCommande)
            await AsyncStorage.removeItem("userCart")
            router.push({ pathname: "/screens/validation", params: { total: calcTotal() } })
        } catch {}
    }

    function renderItem({ item }: { item: Plat }) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                    {item.image ? <Image source={item.image} style={styles.image} /> : <Text>Pas d’image</Text>}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.nom}>{item.nom}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                    <Text style={styles.prix}>{item.prix} €</Text>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity onPress={() => decrementItem(item.id)} style={styles.btn}>
                        <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantite}>{item.quantite}</Text>
                    <TouchableOpacity onPress={() => incrementItem(item.id)} style={styles.btn}>
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ton panier</Text>
            <FlatList
                data={cart}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderItem}
                style={styles.list}
            />
            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: {calcTotal().toFixed(2)} €</Text>
                <TouchableOpacity onPress={handlePasserCommande} style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>Passer la commande</Text>
                </TouchableOpacity>
                <Text style={styles.deliveryText}>Délai de livraison estimé : ~30 min</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: 30,
        paddingHorizontal: 15
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#F9F9F9"
    },
    list: {
        marginBottom: 20
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        padding: 15,
        borderRadius: 6,
        backgroundColor: "#333",
        elevation: 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    imageContainer: {
        marginRight: 10,
        justifyContent: "center"
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 6,
        resizeMode: "cover"
    },
    infoContainer: {
        flex: 1,
        paddingRight: 10
    },
    nom: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
        color: "#F9F9F9"
    },
    desc: {
        fontStyle: "italic",
        color: "#aaa",
        marginBottom: 4
    },
    prix: {
        fontWeight: "600",
        color: "#F9F9F9"
    },
    btnContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    btn: {
        backgroundColor: "#555",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5
    },
    btnText: {
        fontSize: 20,
        color: "#F9F9F9"
    },
    quantite: {
        fontSize: 16,
        minWidth: 20,
        textAlign: "center",
        color: "#F9F9F9"
    },
    footer: {
        marginTop: 10
    },
    totalText: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
        color: "#F9F9F9"
    },
    deliveryText: {
        marginTop: 10,
        color: "#bbb"
    },
    orderButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center"
    },
    orderButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
})
