// This tells TypeScript that a 'firebase' variable will exist in the global scope,
// which is now true because we are loading it via <script> tags in index.html.
declare var firebase: any;

// Your web app's Firebase configuration from your project settings
const firebaseConfig = {
  apiKey: "AIzaSyDTPJLO1aC-3_wvSn7zGvbmavxNaRy6X2g",
  authDomain: "thikracraft.firebaseapp.com",
  databaseURL: "https://thikracraft-default-rtdb.firebaseio.com",
  projectId: "thikracraft",
  storageBucket: "thikracraft.appspot.com",
  messagingSenderId: "295425612163",
  appId: "1:295425612163:web:4ccbebcd18170483cd7eb6",
  measurementId: "G-4KT4W75QTS"
};

// Initialize Firebase App
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore with robust settings to prevent connection timeouts
const initializeFirestore = () => {
    try {
        const firestore = firebase.firestore();
        firestore.settings({
            // This setting simplifies the connection by disabling the local offline cache, which can sometimes cause issues.
            persistence: false,
            // This forces the client to use HTTP long-polling instead of WebSockets, which is more resilient to certain network configurations and firewalls.
            experimentalForceLongPolling: true,
            useFetchStreams: false,
        });
        console.log("Firestore custom connection settings applied.");
        return firestore;
    } catch (e) {
        // This error is expected on hot-reloads if Firestore is already in use.
        // We can safely ignore it and just grab the existing instance.
        console.warn("Could not apply Firestore settings, it's likely already initialized.", e);
        return firebase.firestore();
    }
};

// Export the services you'll use
export const auth = firebase.auth();
export const db = initializeFirestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
export default firebase;