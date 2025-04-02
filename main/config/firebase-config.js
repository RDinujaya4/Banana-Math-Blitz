const firebaseConfig = {
    apiKey: "AIzaSyDbhdF_1-tcnKIdeErme4C-iOFY1-JQ7iA",
    authDomain: "banana-math-blitz-a0baa.firebaseapp.com",
    projectId: "banana-math-blitz-a0baa",
    storageBucket: "banana-math-blitz-a0baa.firebasestorage.app",
    messagingSenderId: "142589278674",
    appId: "1:142589278674:web:5dbd9453aef198455ff00b"
  };
  
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
  
  const auth = firebase.auth();
  const db = firebase.firestore();