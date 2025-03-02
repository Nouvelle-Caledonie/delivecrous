import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Modal,
    TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { api } from "../services/api";

const BASE_URL = "http://localhost:3000";

interface Plat {
    id: string;
    nom: string;
    description: string;
    prix: number;
    allergenes: string[];
    categorie: string;
    disponible: boolean;
    restaurantId: string;
    image: any;
    quantite: number;
}

export default function Panier(): JSX.Element {
    const [cart, setCart] = useState<Plat[]>([]);
    const [userId, setUserId] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [formation, setFormation] = useState("");
    const [salle, setSalle] = useState("");
    const router = useRouter();

    useEffect(() => {
        initCart();
        getUserId();
    }, []);

    async function initCart() {
        const storedCart = await AsyncStorage.getItem("userCart");
        setCart(storedCart ? JSON.parse(storedCart) : []);
    }

    async function getUserId() {
        const storedEmail = await AsyncStorage.getItem("User");
        if (storedEmail) {
            try {
                const response = await axios.get(`${BASE_URL}/users?email=${storedEmail}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    setUserId(user.id);
                    // Récupération de la formation depuis le user (backend)
                    setFormation(user.formation || "");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur", error);
            }
        }
    }

    async function saveCart(newCart: Plat[]) {
        setCart(newCart);
        await AsyncStorage.setItem("userCart", JSON.stringify(newCart));
    }

    function incrementItem(id: string) {
        const updated = cart.map(item =>
            item.id === id ? { ...item, quantite: item.quantite + 1 } : item
        );
        saveCart(updated);
    }

    function decrementItem(id: string) {
        const updated = cart
            .map(item =>
                item.id === id ? { ...item, quantite: item.quantite - 1 } : item
            )
            .filter(p => p.quantite > 0);
        saveCart(updated);
    }

    function calcTotal() {
        return cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);
    }

    // Lors de la validation dans la modale, on met à jour le user (formation) et on passe la commande.
    async function handleConfirmCommande() {
        try {
            // On met à jour la formation du user dans le backend
            await axios.patch(`${BASE_URL}/users/${userId}`, { formation });

            const newCommande = {
                userId: userId,
                plats: cart.map(item => ({ platId: item.id, quantite: item.quantite })),
                total: calcTotal(),
                date: new Date().toISOString(),
                statut: "en préparation",
                formation, // formation issue du user
                salle      // salle renseignée dans la modale
            };
            await api.createCommande(newCommande);
            await AsyncStorage.removeItem("userCart");
            setModalVisible(false);
            router.push({ pathname: "/screens/validation", params: { total: calcTotal() } });
        } catch (error) {
            console.error("Erreur lors de la validation de la commande:", error);
        }
    }

    function renderItem({ item }: { item: Plat }) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                    {item.image ? (
                        <Image source={item.image} style={styles.image} />
                    ) : (
                        <Text style={{ color: "#F9F9F9" }}>Pas d’image</Text>
                    )}
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
        );
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
                {/* Ouvre la modale pour renseigner Formation et Salle */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>Passer la commande</Text>
                </TouchableOpacity>
                <Text style={styles.deliveryText}>Délai de livraison estimé : ~30 min</Text>
            </View>

            {/* Modale animée */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Valider la commande</Text>
                        <Text style={styles.modalLabel}>Formation</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Entrez votre formation"
                            placeholderTextColor="#777"
                            value={formation}
                            onChangeText={setFormation}
                        />
                        <Text style={styles.modalLabel}>Salle</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Entrez votre salle"
                            placeholderTextColor="#777"
                            value={salle}
                            onChangeText={setSalle}
                        />
                        <TouchableOpacity onPress={handleConfirmCommande} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Valider la commande</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#F9F9F9",
    },
    list: {
        marginBottom: 20,
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
        shadowRadius: 4,
    },
    imageContainer: {
        marginRight: 10,
        justifyContent: "center",
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 6,
        resizeMode: "cover",
    },
    infoContainer: {
        flex: 1,
        paddingRight: 10,
    },
    nom: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
        color: "#F9F9F9",
    },
    desc: {
        fontStyle: "italic",
        color: "#aaa",
        marginBottom: 4,
    },
    prix: {
        fontWeight: "600",
        color: "#F9F9F9",
    },
    btnContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    btn: {
        backgroundColor: "#555",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
    },
    btnText: {
        fontSize: 20,
        color: "#F9F9F9",
    },
    quantite: {
        fontSize: 16,
        minWidth: 20,
        textAlign: "center",
        color: "#F9F9F9",
    },
    footer: {
        marginTop: 10,
    },
    totalText: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
        color: "#F9F9F9",
    },
    deliveryText: {
        marginTop: 10,
        color: "#bbb",
    },
    orderButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    orderButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#252525",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#F9F9F9",
        marginBottom: 15,
    },
    modalLabel: {
        alignSelf: "flex-start",
        fontSize: 16,
        color: "#F9F9F9",
        marginBottom: 5,
    },
    modalInput: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 4,
        paddingHorizontal: 10,
        color: "#F9F9F9",
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: "#d32f2f",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalCloseButton: {
        paddingVertical: 8,
        width: "100%",
        alignItems: "center",
    },
    modalCloseText: {
        color: "#bbb",
        fontSize: 16,
    },
});

export default Panier;
