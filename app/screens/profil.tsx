import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const [user, setUser] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [changingPseudo, setChangingPseudo] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("User");
                const storedPseudo = await AsyncStorage.getItem("Pseudo");
                if (storedUser) {
                    setUser(storedUser);
                }
                if (storedPseudo) {
                    setPseudo(storedPseudo);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const handlePseudoChange = async (newText) => {
        setPseudo(newText);
        try {
            await AsyncStorage.setItem("Pseudo", newText);
        } catch (error) {
            console.error("Error saving pseudo:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PROFIL</Text>
            <View style={styles.profileContainer}>
                <Text style={styles.userText}>{user ? `Email: ${user}` : "Chargement des données..."}</Text>
                {changingPseudo ? (
                    <TextInput
                        style={styles.input}
                        value={pseudo}
                        onChangeText={handlePseudoChange}
                        onBlur={() => setChangingPseudo(false)} // Quitte le mode édition après modification
                        autoFocus
                        placeholder="Entrer votre pseudo"
                        placeholderTextColor="#aaa"
                    />
                ) : (
                    <TouchableOpacity onLongPress={() => setChangingPseudo(true)}>
                        <Text style={styles.pseudoText}>{"Pseudo : " + pseudo || "Appuyez longuement pour éditer"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    profileContainer: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    userText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
        color: "#333",
        backgroundColor: "#f9f9f9",
    },
    pseudoText: {
        fontSize: 16,
        padding: 10,
    },
});
