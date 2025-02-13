import axios from "axios";

const BASE_URL = 'http://localhost:3000'
//example api
export const api = {
    login: async (email, password) => {
        const response = await axios.get(`${BASE_URL}/users?email=${email}`)
        const users = await response.data
        const user = users[0]

        if (user && user.password === password) {
            return { user, token: 'fake-jwt-token' }
        }
        throw new Error('Invalid credentials')
    },

    getFavoris: async (userId) => {
        const response = await fetch(`${BASE_URL}/favoris?userId=${userId}`)
        return response.json()
    },

    toggleFavori: async (userId, itemId) => {
        // Implémentez la logique pour ajouter/retirer des favoris
    },
}
