# Herbario Institucional "Kixonga Naxo"
_Aplicación web desarrollada para Planear Colectas y Etiquetar ejemplares del herbario institucional de la Universidad de la Cañada (UNCA)._

## Comenzando
Para ejecutar el proyecto de forma local seguir las siguientes instrucciones:

### Requisitos
* Crear proyecto en [Firebase](https://firebase.google.com/).

### Instalación
1. Clonar proyecto
```
git clone https://github.com/IrvingMg/KixongaNaxo-WebApp.git
```

2. Instalar dependencias
```
npm install
```

3. Crear script con el nombre `firebase-config.js` en la ruta `\public\resources\scripts`

4. Registrar aplicación web en Firebase y copiar información de configuración 
```javascript
// Script 'firebase-config.js'
// Inicializa Firebase
const config = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_AUTH_DOMAIN",
	databaseURL: "YOUR_DATABASE_URL",
	projectId: "YOUR_PROJECT_URL",
	storageBucket: "YOUR_STORAGE_BUCKET",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
};
firebase.initializeApp(config);

// Inicializa Firestore
const settings = {timestampsInSnapshots: true};
const db = firebase.firestore();
db.settings(settings);

//Inicializa Storage
const storage = firebase.storage();
```

5. Ejecutar proyecto localmente
```
firebase serve
```

## Construido con
* [npm](https://www.npmjs.com/get-npm) - Manejador de dependencias
* [Firebase](https://firebase.google.com) - Backend As A Service
* [Material Design Components](https://material.io/develop/) - Diseño de interfaces