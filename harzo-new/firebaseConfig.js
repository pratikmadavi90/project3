import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRv2zMM8e9680CE1CFLYTz2cpMxNRHFyo",
  authDomain: "harzo-fface.firebaseapp.com",
  projectId: "harzo-fface",
  storageBucket: "harzo-fface.firebasestorage.app",
  messagingSenderId: "298349410195",
  appId: "1:298349410195:web:3443fa5819ea65eb819a66",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});