import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'contentcraft-ai-ff91p',
  appId: '1:986273953801:web:94e0a61568965651a920d8',
  storageBucket: 'contentcraft-ai-ff91p.firebasestorage.app',
  apiKey: 'AIzaSyBqwzybJCjzpmC0MnJc-edVcF-2G25AAFs',
  authDomain: 'contentcraft-ai-ff91p.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '986273953801',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
