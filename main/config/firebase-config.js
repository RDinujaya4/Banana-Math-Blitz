const firebaseConfig = {
    apiKey: "AIzaSyD_AGmjG18HGe8IwY5BlN1qIiLupjiLvP0",
    authDomain: "banana-math-blitz1.firebaseapp.com",
    projectId: "banana-math-blitz1",
    storageBucket: "banana-math-blitz1.firebasestorage.app",
    messagingSenderId: "917173752405",
    appId: "1:917173752405:web:e59dabdac78ea1f6eafadc"
  };
  
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
  
  const auth = firebase.auth();
  const db = firebase.firestore();