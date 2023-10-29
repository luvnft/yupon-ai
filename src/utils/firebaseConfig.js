// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB-SzfxnkZCr_lXbnL9xWRRyd0p9B4Z40",
  authDomain: "yupon-ee4ed.firebaseapp.com",
  projectId: "yupon-ee4ed",
  storageBucket: "yupon-ee4ed.appspot.com",
  messagingSenderId: "415709201494",
  appId: "1:415709201494:web:59a255544ebdae48c0e7f7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
