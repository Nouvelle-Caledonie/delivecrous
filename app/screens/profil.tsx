import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    Pressable,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { api } from "../services/api";

const BASE_URL = "http://localhost:3000";

export default function Profil(): JSX.Element {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [formation, setFormation] = useState("");
    const [userId, setUserId] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalColor, setModalColor] = useState("#333");
    const [commandes, setCommandes] = useState<any[]>([]);

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserCommandes();
        }
    }, [userId]);

    const loadUser = async () => {
        const storedEmail = await AsyncStorage.getItem("User");
        if (storedEmail) {
            setEmail(storedEmail);
            try {
                const response = await axios.get(`${BASE_URL}/users?email=${storedEmail}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    setUserId(user.id);
                    setPassword(user.password || "");
                    setNom(user.nom || "");
                    setPrenom(user.prenom || "");
                    setFormation(user.formation || "");
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur", error);
            }
        }
    };

    const fetchUserCommandes = async () => {
        try {
            const data = await api.getCommandesByUser(userId);
            setCommandes(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes", error);
        }
    };

    const handleUpdateProfile = async () => {
        if (!email || !password) {
            setModalMessage("L'email et le mot de passe ne doivent pas être vides");
            setModalColor("#B23A48");
            setModalVisible(true);
            return;
        }
        try {
            const response = await axios.patch(`${BASE_URL}/users/${userId}`, { email, password, nom, prenom, formation });
            await AsyncStorage.setItem("User", response.data.email);
            setModalMessage("Profil mis à jour");
            setModalColor("#4BB543");
            setModalVisible(true);
            setEditMode(false);
        } catch (error) {
            setModalMessage("Erreur lors de la mise à jour");
            setModalColor("#B23A48");
            setModalVisible(true);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("User");
        router.replace("/screens/login");
    };

    const handleDeleteAccount = async () => {
        Alert.alert("Confirmation", "Voulez-vous vraiment supprimer votre compte ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    try {
                        await axios.delete(`${BASE_URL}/users/${userId}`);
                        await AsyncStorage.removeItem("userToken");
                        await AsyncStorage.removeItem("User");
                        router.replace("/screens/login");
                    } catch (error) {
                        setModalMessage("Erreur lors de la suppression du compte");
                        setModalColor("#B23A48");
                        setModalVisible(true);
                    }
                }
            }
        ]);
    };

    function formatDate(dateString: string) {
        const d = new Date(dateString);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} à ${hours}h${minutes}`;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <TouchableOpacity
                onLongPress={() => setEditMode(true)}
                activeOpacity={0.8}
                style={styles.profileContainer}
            >
                <Text style={styles.profileTitle}>Mon Profil</Text>
                {editMode ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Mot de passe"
                            placeholderTextColor="#999"
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            value={nom}
                            onChangeText={setNom}
                            placeholder="Nom"
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={styles.input}
                            value={prenom}
                            onChangeText={setPrenom}
                            placeholder="Prénom"
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={styles.input}
                            value={formation}
                            onChangeText={setFormation}
                            placeholder="Formation"
                            placeholderTextColor="#999"
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => setEditMode(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleUpdateProfile}
                            >
                                <Text style={styles.buttonText}>Sauvegarder</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.infoText}>Email : {email}</Text>
                        <Text style={styles.infoText}>Mot de passe : ******</Text>
                        <Text style={styles.infoText}>Nom : {nom || "-"}</Text>
                        <Text style={styles.infoText}>Prénom : {prenom || "-"}</Text>
                        <Text style={styles.infoText}>Formation : {formation || "-"}</Text>
                        <Text style={styles.editHint}>(Appuyez longuement pour modifier)</Text>
                    </>
                )}
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Se déconnecter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>Supprimer mon compte</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text style={styles.profileTitle}>Mes Commandes</Text>
            {commandes.length === 0 ? (
                <Text style={styles.infoText}>Aucune commande pour le moment.</Text>
            ) : (
                commandes.map((commande) => (
                    <View key={commande.id} style={styles.commandCard}>
                        <Text style={styles.commandTitle}>Commande {commande.id}</Text>
                        <Text style={styles.commandInfo}>Date : {formatDate(commande.date)}</Text>
                        <Text style={styles.commandInfo}>Statut : {commande.statut}</Text>
                        <Text style={styles.commandInfo}>Total : {commande.total} €</Text>
                        {commande.formation && (
                            <Text style={styles.commandInfo}>Formation : {commande.formation}</Text>
                        )}
                        {commande.salle && (
                            <Text style={styles.commandInfo}>Salle : {commande.salle}</Text>
                        )}
                        {commande.plats.map((p, i) => (
                            <Text key={i} style={styles.commandInfo}>
                                Plat : {p.platId}, Quantité : {p.quantite}
                            </Text>
                        ))}
                    </View>
                ))
            )}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, { color: modalColor }]}>{modalMessage}</Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 20
    },
    profileContainer: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 20,
        elevation: 3
    },
    profileTitle: {
        fontSize: 32,
        fontWeight: "600",
        color: "#EAEAEA",
        textAlign: "center",
        marginBottom: 15
    },
    infoText: {
        fontSize: 18,
        color: "#EAEAEA",
        marginBottom: 5
    },
    editHint: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginTop: 10
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#333333",
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: "#EAEAEA",
        borderWidth: 1,
        borderColor: "#555"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    primaryButton: {
        backgroundColor: "#B23A48",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: "40%",
        alignItems: "center",
        marginVertical: 10
    },
    secondaryButton: {
        backgroundColor: "#555",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: "40%",
        alignItems: "center",
        marginVertical: 10
    },
    buttonText: {
        color: "#EAEAEA",
        fontSize: 16,
        fontWeight: "bold"
    },
    divider: {
        height: 1,
        backgroundColor: "#333",
        marginVertical: 20
    },
    footerButtons: {
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: "40%",
        alignItems: "center",
        marginVertical: 10
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#1E1E1E",
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center"
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: "#B23A48",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    closeButtonText: {
        color: "#EAEAEA",
        fontSize: 16
    },
    commandCard: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        elevation: 3
    },
    commandTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#EAEAEA",
        marginBottom: 8
    },
    commandInfo: {
        fontSize: 16,
        color: "#EAEAEA",
        marginBottom: 4
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
});

export default Profil;
