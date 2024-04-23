import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIhOE9QqTBS-V-vkAcmvdZGDqf2NFtdV0",
    authDomain: "aiornot-d6f11.firebaseapp.com",
    projectId: "aiornot-d6f11",
    storageBucket: "aiornot-d6f11.appspot.com",
    messagingSenderId: "982594679000",
    appId: "1:982594679000:web:8e9e8de51658cb84f5a7ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//const database = getDatabase(app);
const db = getFirestore(app);

signInAnonymously(auth)
    .then(() => {
        console.log("Signed in anonymously");
    })
    .catch((error) => {
        console.error("Error signing in anonymously:", error);
    });

export function sendExperimentData(rows, collectionName) {
    const user = auth.currentUser;
    if (user) {
        const experimentResultsCollection = collection(db, collectionName);
        return addDoc(experimentResultsCollection, rows)
            .then(() => {
                console.log("Data sent successfully");
            })
            .catch((error) => {
                console.error("Error sending data:", error);
            });
    } else {
        console.error("User not signed in");
        return Promise.reject("User not signed in");
    }
}