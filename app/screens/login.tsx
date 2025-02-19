import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
    Platform,
    ImageBackground, Dimensions
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AppleAuthentication from 'expo-apple-authentication'
import {useRouter} from 'expo-router'
import {api} from '../services/api'
import Button from "@/app/components/button"
const { height } = Dimensions.get('window');

export default function AuthScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isRegister, setIsRegister] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalColor, setModalColor] = useState("#333")
    const router = useRouter()


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
                const response = await api.register(email, password)
                await AsyncStorage.setItem("userToken", response.token)
                await AsyncStorage.setItem("User", response.email)
                console.log(response.email)
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

    return (
        <ImageBackground
            source={require('@/assets/images/mealLogin.png')}
            style={styles.background}
            resizeMode="cover"
        >
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
                            <Text style={[styles.modalText, {color: modalColor}]}>{modalMessage}</Text>
                            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#121212', // Fond sombre
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff', // Texte clair
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        color: '#ccc', // Texte secondaire clair
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#333', // Fond sombre pour les inputs
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#fff', // Texte des inputs clair
        borderColor: '#444',
        borderWidth: 1,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#B23A48', // Couleur d'accentuation
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    appleButton: {
        width: '100%',
        height: 50,
        marginVertical: 10,
        backgroundColor: '#000', // Fond sombre pour le bouton Apple
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchLink: {
        marginTop: 15,
    },
    switchText: {
        color: '#ccc', // Texte clair
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Fond sombre semi-transparent pour le modal
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#222', // Fond du modal sombre
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#fff', // Texte du modal clair
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#B23A48', // Couleur de fermeture en rouge accent
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    background: {
        flex: 1,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        opacity: 0.9,
        overflow: 'hidden',
    },
});
