# Herbario Institucional "Kixonga Naxo"
_Aplicación web desarrollada para Planear Colectas y Etiquetar ejemplares del herbario institucional de la Universidad de la Cañada (UNCA)._

## Comenzando
Para ejecutar el proyecto de forma local seguir las siguientes instrucciones:

### Requisitos
- Crear proyecto en [Firebase](https://firebase.google.com/).

### Instalación
- Clonar proyecto
`git clone https://github.com/IrvingMg/KixongaNaxo-WebApp.git`

- Instalar dependencias
`npm install`

- Abrir proyecto en la ruta
`\public\resources\scripts`

- Crear script con el nombre
`firebase-config.js`

- Registrar aplicación web en Firebase y copiar información de configuración 
```javascript
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

- Ejecutar proyecto localmente
`firebase serve`

## Construido con
* [npm](https://www.npmjs.com/get-npm)
* [Firebase](https://firebase.google.com)
* [Material Design Components](https://material.io/develop/)