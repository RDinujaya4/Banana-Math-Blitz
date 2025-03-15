// Firebase configuration
// Save this as ../config/firebase-config.js

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAMbcaPACOEbCW6ci6R4rVgIcJv1GOdK5o",
    authDomain: "banana-game-8dfcd.firebaseapp.com",
    projectId: "banana-game-8dfcd",
    storageBucket: "banana-game-8dfcd.firebasestorage.app",
    messagingSenderId: "593299248539",
    appId: "1:593299248539:web:aa9c118aceab2274fdbd3e"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get references to services
  const auth = firebase.auth();
  const db = firebase.firestore();