import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBf9yF2djIeWz1FKE_8Wgx4z7LCwwyj_F4",
  authDomain: "petinformationmanager.firebaseapp.com",
  databaseURL: "https://petinformationmanager-default-rtdb.firebaseio.com",
  projectId: "petinformationmanager",
  storageBucket: "petinformationmanager.firebasestorage.app",
  messagingSenderId: "41101386307",
  appId: "1:41101386307:web:a70ade6f9f4c3968d26af6",
  measurementId: "G-DPQRD6GCFC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);