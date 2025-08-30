// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// pegar o getreactpersistance mesmo sem tipagem
const { getReactNativePersistence} = require("firebase/auth") as any


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXRoCdwRfHFTc8_zFMMJwtFewz9c8s0-A",
    authDomain: "aulafirebase-197e9.firebaseapp.com",
    projectId: "aulafirebase-197e9",
    storageBucket: "aulafirebase-197e9.firebasestorage.app",
    messagingSenderId: "444409190397",
    appId: "1:444409190397:web:1f0b0b846c1f2600b5eb94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
    persistence:getReactNativePersistence(AsyncStorage)
});