import axios from "axios"

const BASE_URL = "http://localhost:3000"

export const api = {
    login: async (email, password) => {
        try {
            const response = await axios.get(`${BASE_URL}/users?email=${email}`)
            const users = response.data
            const user = users[0]
            if (user && user.password === password) {
                return { user, token: "fake-jwt-token" }
            }
            throw new Error("Identifiants invalides")
        } catch (error) {
            throw new Error("Erreur de connexion")
        }
    },
    register: async (email, password) => {
        if (!email || !password) {
            throw new Error("Champs manquants")
        }
        const existingUsers = await axios.get(`${BASE_URL}/users?email=${email}`)
        if (existingUsers.data.length > 0) {
            throw new Error("L'utilisateur existe déjà")
        }
        const newUser = {
            email,
            password,
            nom: "",
            prenom: "",
            favoris: []
        }
        try {
            const response = await axios.post(`${BASE_URL}/users`, newUser)
            return { user: response.data, token: "fake-jwt-token" }
        } catch {
            throw new Error("Impossible de créer l'utilisateur")
        }
    },
    getFavoris: async (userId) => {
        const response = await axios.get(`${BASE_URL}/favoris?userId=${userId}`)
        return response.data
    },
    toggleFavori: async (userId, platId) => {
        const response = await axios.get(`${BASE_URL}/favoris?userId=${userId}&platId=${platId}`)
        const favoris = response.data
        if (favoris.length > 0) {
            const favoriteId = favoris[0].id
            await axios.delete(`${BASE_URL}/favoris/${favoriteId}`)
            return { action: "removed", favoriteId }
        } else {
            const newFavorite = { userId, platId }
            const addResponse = await axios.post(`${BASE_URL}/favoris`, newFavorite)
            return { action: "added", favorite: addResponse.data }
        }
    },
    getRestaurants: async () => {
        const response = await axios.get(`${BASE_URL}/restaurants`)
        return response.data
    },
    getRestaurant: async (restaurantId) => {
        const response = await axios.get(`${BASE_URL}/restaurants/${restaurantId}`)
        return response.data
    },
    getPlats: async () => {
        const response = await axios.get(`${BASE_URL}/plats`)
        return response.data
    },
    getPlatsByRestaurant: async (restaurantId) => {
        const response = await axios.get(`${BASE_URL}/plats?restaurantId=${restaurantId}`)
        return response.data
    },

    getPlatsById: async (platId) => {
        const response = await axios.get(`${BASE_URL}/plats/${platId}`);
        return response.data;
    },

    getCommandesByUser: async (userId) => {
        const response = await axios.get(`${BASE_URL}/commandes?userId=${userId}`)
        return response.data
    },
    createCommande: async (commandeData) => {
        const response = await axios.post(`${BASE_URL}/commandes`, commandeData)
        return response.data
    },
    updateCommandeStatus: async (commandeId, statut) => {
        const response = await axios.patch(`${BASE_URL}/commandes/${commandeId}`, { statut })
        return response.data
    }
}