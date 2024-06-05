const firebaseConfig = {
  apiKey: "AIzaSyDvNLZefc6nicLY9Di0Ct3WLyS-7QI98X8",
  authDomain: "crud-36a9b.firebaseapp.com",
  databaseURL: "https://crud-36a9b-default-rtdb.firebaseio.com",
  projectId: "crud-36a9b",
  storageBucket: "crud-36a9b.appspot.com",
  messagingSenderId: "612042010209",
  appId: "1:612042010209:web:59beb23b1dcaef3042c420",
  measurementId: "G-Z8ESE4ZNW9"
};

const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();