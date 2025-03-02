import axios from "axios"

const BASE_URL = "http://localhost:3000"
const GOV_API_URL = "https://api-adresse.data.gouv.fr/search/";

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
            return { user: response.data, token: "fake-jwt-token", email:email }
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
    getRestaurants: async (ville = "") => {
        try {
            const url = ville ? `${BASE_URL}/restaurants?adresse_like=${ville}` : `${BASE_URL}/restaurants`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des restaurants");
        }
    },

    getRestaurant: async (restaurantId) => {
        const response = await axios.get(`${BASE_URL}/restaurants/${restaurantId}`)
        return response.data
    },

    getCoordinatesFromAddress: async (address) => {
        try {
            const response = await axios.get(GOV_API_URL, {
                params: {
                    q: address,
                    limit: 1,
                },
            });
            if (
                response.data &&
                response.data.features &&
                response.data.features.length > 0
            ) {
                const coords = response.data.features[0].geometry.coordinates;
                return {
                    // L'API renvoie [longitude, latitude]
                    latitude: parseFloat(coords[1]),
                    longitude: parseFloat(coords[0]),
                };
            } else {
                console.warn(`⚠️ Impossible de géocoder l'adresse: ${address}`);
                return null;
            }
        } catch (error) {
            console.error("❌ Erreur lors du géocodage:", error);
            return null;
        }
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
