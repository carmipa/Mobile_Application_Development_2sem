import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection,addDoc,getDocs,doc,updateDoc,deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//Pegar o getReactNativePersistence mesmo sem tipagem
// const{getReactNativePersistence} = require("firebase/auth") as any

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

const db = getFirestore(app)

// const auth = initializeAuth(app,{
//   persistence:getReactNativePersistence(AsyncStorage)
// })

const auth = getAuth(app)
export{auth,db,collection,addDoc,getDocs,doc,updateDoc,deleteDoc}