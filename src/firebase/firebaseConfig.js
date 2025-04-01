import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyCwtkPMFe316YcwV1E875gWTmXfQZym3W4",
  authDomain: "listadoalumnos.firebaseapp.com",
  projectId: "listadoalumnos",
  storageBucket: "listadoalumnos.firebasestorage.app",
  messagingSenderId: "491803896775",
  appId: "1:491803896775:web:e9cb45e0a5881b4bf807e2",
  measurementId: "G-60XT2P96M6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app)
const analytics = getAnalytics(app);
console.log(analytics);