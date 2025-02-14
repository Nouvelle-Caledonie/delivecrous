import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const user = {
    id: '1',
    email: 'etudiant@univ.fr',
    nom: 'Dupont',
    prenom: 'Jean',
    favoris: ['1', '2']
}

const api = {
    login: async (email, password) => {
        if (email === 'etudiant@univ.fr' && password === '1234') {
            return { token: 'mock-token', user }
        } else {
            throw new Error('Identifiants invalides')
        }
    },
    register: async (email, password) => {
        if (email && password) {
            return { token: 'new-user-token', user: { ...user, email } }
        } else {
            throw new Error('Champs manquants')
        }
    }
}

export default function AuthScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)

    const handleLogin = async () => {
        try {
            const response = await api.login(email, password)
            await AsyncStorage.setItem('userToken', response.token)
            Alert.alert('Connecté', 'Connexion réussie')
        } catch (error) {
            Alert.alert('Erreur', 'Identifiants invalides')
        }
    }

    const handleRegister = async () => {
        try {
            const response = await api.register(email, password)
            await AsyncStorage.setItem('userToken', response.token)
            Alert.alert('Inscription', 'Compte créé')
            setIsRegister(false)
        } catch (error) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delivercrous</Text>
            <Text style={styles.subtitle}>{isRegister ? 'Créer un compte' : 'Se connecter'}</Text>
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
                    {isRegister ? 'S\'inscrire' : 'Se connecter'}
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
    }
})
