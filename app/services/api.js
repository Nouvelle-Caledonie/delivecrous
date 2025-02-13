import axios from "axios";

const BASE_URL = 'http://localhost:3000';

export const api = {
    login: async (email, password) => {
        const response = await axios.get(`${BASE_URL}/users?email=${email}`);
        const users = response.data;
        const user = users[0];

        if (user && user.password === password) {
            return { user, token: 'fake-jwt-token' };
        }
        throw new Error('Invalid credentials');
    },

    getFavoris: async (userId) => {
        const response = await axios.get(`${BASE_URL}/favoris?userId=${userId}`);
        return response.data;
    },

    toggleFavori: async (userId, platId) => {
        const response = await axios.get(`${BASE_URL}/favoris?userId=${userId}&platId=${platId}`);
        const favoris = response.data;

        if (favoris.length > 0) {
            // Retirer le favori existant
            const favoriteId = favoris[0].id;
            await axios.delete(`${BASE_URL}/favoris/${favoriteId}`);
            return { action: "removed", favoriteId };
        } else {
            // Ajouter le favori
            const newFavorite = { userId, platId };
            const addResponse = await axios.post(`${BASE_URL}/favoris`, newFavorite);
            return { action: "added", favorite: addResponse.data };
        }
    },

    getRestaurants: async () => {
        const response = await axios.get(`${BASE_URL}/restaurants`);
        return response.data;
    },

    getRestaurant: async (restaurantId) => {
        const response = await axios.get(`${BASE_URL}/restaurants/${restaurantId}`);
        return response.data;
    },

    getPlats: async () => {
        const response = await axios.get(`${BASE_URL}/plats`);
        return response.data;
    },

    getPlatsByRestaurant: async (restaurantId) => {
        const response = await axios.get(`${BASE_URL}/plats?restaurantId=${restaurantId}`);
        return response.data;
    },

    getCommandesByUser: async (userId) => {
        const response = await axios.get(`${BASE_URL}/commandes?userId=${userId}`);
        return response.data;
    },

    createCommande: async (commandeData) => {
        const response = await axios.post(`${BASE_URL}/commandes`, commandeData);
        return response.data;
    },

    updateCommandeStatus: async (commandeId, statut) => {
        const response = await axios.patch(`${BASE_URL}/commandes/${commandeId}`, { statut });
        return response.data;
    }
};
