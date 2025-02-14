import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../services/api' // <-- Assurez-vous que ce chemin correspond bien à l'emplacement de votre nouveau fichier "api.js" ou "api.ts"

export default function AuthScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [modalColor, setModalColor] = useState('#333')

    const handleLogin = async () => {
        try {
            const response = await api.login(email, password)
            await AsyncStorage.setItem('userToken', response.token)
            setModalMessage('Connexion réussie')
            setModalColor('#4BB543')
            setModalVisible(true)
        } catch (err) {
            setModalMessage(err.message || 'Identifiants invalides')
            setModalColor('#B23A48')
            setModalVisible(true)
        }
    }

    const handleRegister = async () => {
        try {
            const response = await api.register(email, password)
            await AsyncStorage.setItem('userToken', response.token)
            setModalMessage('Compte créé avec succès')
            setModalColor('#4BB543')
            setModalVisible(true)
            setIsRegister(false)
            await handleLogin()
        } catch (err) {
            setModalMessage(err.message || 'Erreur lors de la création du compte')
            setModalColor('#B23A48')
            setModalVisible(true)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delivercrous</Text>
            <Text style={styles.subtitle}>
                {isRegister ? 'Créer un compte' : 'Se connecter'}
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
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.button}
                onPress={isRegister ? handleRegister : handleLogin}
            >
                <Text style={styles.buttonText}>
                    {isRegister ? "S'inscrire" : 'Se connecter'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.switchLink}
                onPress={() => setIsRegister(!isRegister)}
            >
                <Text style={styles.switchText}>
                    {isRegister ? 'Déjà un compte ? Se connecter' : 'Nouveau ? Créer un compte'}
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
    container: {
        flex: 1,
        backgroundColor: '#FCEEEA',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 10,
        color: '#B23A48'
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        color: '#333'
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333'
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#B23A48',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16
    },
    switchLink: {
        marginTop: 10
    },
    switchText: {
        color: '#333',
        fontSize: 14
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: '#B23A48',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16
    }
})
