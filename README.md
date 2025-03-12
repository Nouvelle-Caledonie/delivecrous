# DeliveCROUS

Bienvenue dans l’application DeliveCROUS.

## Prérequis

- **Node.js** et **npm** installés.
- **Expo CLI** installé (`npm install -g expo-cli`).
- **json-server** installé (`npm install -g json-server`), ou lancé localement via un script.

## Installation

1. **Cloner** ce dépôt.
2. **Installer** les dépendances :
   ```bash
   npm install
   ```
3. **Lancer** l’appli en web :
   ```bash
   expo start
   ```
   Dans la console Expo, choisis “Run in web browser”.

4. **JSON Server** pour l’API :
   ```bash
   npx json-server db.json --port 3000
   ```
   L’API sera accessible à l’adresse `http://localhost:3000`.

## Remarques

- **Version mobile** : Pour tester sur mobile, il faut une URL accessible publiquement.  
  On peut utiliser ngrok, mais la version gratuite impose un écran d’avertissement qui bloque les requêtes (voir capture ci-dessous).  
  Si tu passes par ngrok avec un compte gratuit, tu auras ce message d’erreur au lieu de l’API.  
  Il faudrait un plan payant ou un autre tunnel pour faire fonctionner l’API en mobile sans blocage.

- **Capture d’écran de l’erreur avec ngrok** :  
  [Message d’avertissement ngrok](https://drive.google.com/file/d/1yzjt-Z0Lwl1XmYk8cBY72RIyCnJLSs9a/view?usp=sharing)

## Scripts utiles

- **Démarrer l’appli** :  
  ```bash
  expo start
  ```
- **Démarrer l’API** :  
  ```bash
  json-server db.json
  ```
