import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage} from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyD08e683igtH7iKaKfKEiUU2iSqInYvF-A",
  authDomain: "adanl-bdd57.firebaseapp.com",
  projectId: "adanl-bdd57",
  storageBucket: "adanl-bdd57.appspot.com",
  messagingSenderId: "456328441196",
  appId: "1:456328441196:web:1bc7f54ada47802fc95749",
  measurementId: "G-G61ZMZ5YP4"
    };
export const mapsKey = "";
export const singInMethods = {anon:false, google:true, facebook:false, email:true};
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
//export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const timenow = serverTimestamp();
export const profileNode = "profile";
export const termsLink = "/login";
export const privacyLink = "/login";