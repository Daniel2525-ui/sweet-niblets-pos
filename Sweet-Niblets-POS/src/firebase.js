import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuI_Tg-Faeh80P7M4hDZXyf0_UY8HJWcw",
    authDomain: "sweet-niblets-pos-system.firebaseapp.com",
    projectId: "sweet-niblets-pos-system",
    storageBucket: "sweet-niblets-pos-system.firebasestorage.app",
    messagingSenderId: "1018168878586",
    appId: "1:1018168878586:web:c467095e3979a8bccd7043",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Offline persistence failed:", err.code);
});