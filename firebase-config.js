// 📁 firebase-config.js
// Firebase کو initialize کرنے کے لیے مکمل کوڈ

const firebaseConfig = {
  apiKey: "AIzaSyC1_FwaankZtj56f7pOvM7ul1vmXuxzOlo",
  authDomain: "bise-paper-generator.firebaseapp.com",
  databaseURL: "https://bise-paper-generator-default-rtdb.firebaseio.com", // ✅ Realtime DB کے لیے لازمی
  projectId: "bise-paper-generator",
  storageBucket: "bise-paper-generator.appspot.com",
  messagingSenderId: "158275654835",
  appId: "1:158275654835:web:5faa6341d133e434408cc6"
};

// 🔥 Firebase initialization
firebase.initializeApp(firebaseConfig);