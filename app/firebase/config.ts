import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvGHoMEey_Nlf5yFHk0-HwSFEjtWRel6M",
  authDomain: "kit-cristao.firebaseapp.com",
  projectId: "kit-cristao",
  storageBucket: "kit-cristao.firebasestorage.app",
  messagingSenderId: "233883722686",
  appId: "1:233883722686:web:9301d80e1b90247680cfef",
  measurementId: "G-09LR0SBDCX",
};

// Inicializa o Firebase apenas se ainda não foi inicializado
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

