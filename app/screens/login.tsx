import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AppleAuthentication from 'expo-apple-authentication'
import * as LocalAuthentication from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import { api } from '../services/api'
import Button from "@/app/components/button"

export default function AuthScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isRegister, setIsRegister] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalColor, setModalColor] = useState("#333")
    const [biometricAvailable, setBiometricAvailable] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkBiometricSupport()
    }, [])

    const checkBiometricSupport = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync()
        const enrolled = await LocalAuthentication.isEnrolledAsync()
        setBiometricAvailable(compatible && enrolled)
    }

    const storeUserToken = async (token: string) => {
        await AsyncStorage.setItem("userToken", token)
        setModalMessage("Connexion réussie")
        setModalColor("#4BB543")
        setModalVisible(true)
        router.replace("/")
    }

    const handleLogin = async () => {
        try {
            const response = await api.login(email, password)
            storeUserToken(response.token)
        } catch (err: any) {
            setModalMessage(err.message || "Identifiants invalides")
            setModalColor("#B23A48")
            setModalVisible(true)
        }
    }

    const isEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }

    const handleRegister = async () => {
        try {
            if (isEmail()) {
                console.log("email",email)
                const response = await api.register(email, password)
                await AsyncStorage.setItem("userToken", response.token)
                setModalMessage("Compte créé avec succès")
                setModalColor("#4BB543")
                setModalVisible(true)
                setIsRegister(false)
                await handleLogin()
            } else {
                setModalMessage('Entrez un email valide')
                setModalColor('#B23A48')
                setModalVisible(true)
            }
        } catch (err: any) {
            setModalMessage(err.message || "Erreur lors de la création du compte")
            setModalColor("#B23A48")
            setModalVisible(true)
        }
    }

    const handleAppleSignIn = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            })
            storeUserToken(credential.identityToken || "")
        } catch {
            setModalMessage("Erreur Apple Sign-In")
            setModalColor("#B23A48")
            setModalVisible(true)
        }
    }

    const handleBiometricLogin = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({ promptMessage: "Authentification Biométrique" })
            if (result.success) {
                storeUserToken("biometric-token")
            } else {
                setModalMessage("Échec de la connexion biométrique")
                setModalColor("#B23A48")
                setModalVisible(true)
            }
        } catch {
            setModalMessage("Impossible d’utiliser l’empreinte")
            setModalColor("#B23A48")
            setModalVisible(true)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>DeliveCROUS</Text>
            <Text style={styles.subtitle}>
                {isRegister ? "Créer un compte" : "Se connecter"}
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                textContentType="password"
                secureTextEntry
            />
            <Button
                transparent={false}
                title={isRegister ? "S'inscrire" : 'Se connecter'}
                onPress={isRegister ? handleRegister : handleLogin}
            />
            {Platform.OS === 'ios' && !isRegister && (
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={8}
                    style={styles.appleButton}
                    onPress={handleAppleSignIn}
                />
            )}
            {biometricAvailable && !isRegister && (
                <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
                    <Text style={styles.buttonText}>Se connecter avec l'empreinte digitale</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={styles.switchLink}
                onPress={() => setIsRegister(!isRegister)}
            >
                <Text style={styles.switchText}>
                    {isRegister ? "Déjà un compte ? Se connecter" : "Nouveau ? Créer un compte"}
                </Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="fade" transparent>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, { color: modalColor }]}>{modalMessage}</Text>
                        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FCEEEA", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
    title: { fontSize: 32, fontWeight: "600", marginBottom: 10, color: "#B23A48" },
    subtitle: { fontSize: 18, marginBottom: 30, color: "#333" },
    input: { width: "100%", height: 50, backgroundColor: "#FFF", borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, color: "#333" },
    button: { width: "100%", height: 50, backgroundColor: "#B23A48", borderRadius: 8, alignItems: "center", justifyContent: "center", marginVertical: 10 },
    buttonText: { color: "#FFF", fontSize: 16 },
    appleButton: { width: "100%", height: 50, marginVertical: 10 },
    biometricButton: { width: "100%", height: 50, backgroundColor: "#333", borderRadius: 8, alignItems: "center", justifyContent: "center", marginVertical: 10 },
    switchLink: { marginTop: 10 },
    switchText: { color: "#333", fontSize: 14 },
    modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
    modalContainer: { width: "80%", backgroundColor: "#FFF", borderRadius: 12, paddingVertical: 20, paddingHorizontal: 15, alignItems: "center" },
    modalText: { fontSize: 18, marginBottom: 20 },
    closeButton: { backgroundColor: "#B23A48", borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10 },
    closeButtonText: { color: "#FFF", fontSize: 16 }
})