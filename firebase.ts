import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // تم إيقاف خدمة التخزين بناءً على طلبك

const firebaseConfig = {
  apiKey: "AIzaSyCb0aLfhDyUNvJMSojfDElgBCF1ERxJXFI",
  authDomain: "myslide-website.firebaseapp.com",
  projectId: "myslide-website",
  storageBucket: "myslide-website.firebasestorage.app",
  messagingSenderId: "237579416660",
  appId: "1:237579416660:web:ec2be0311dcd5f420da9c1"
};

// تم وضع المفاتيح، لذا نرجع true دائماً
export const isFirebaseConfigured = () => {
  return true;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const storage = getStorage(app); // تم إيقاف خدمة التخزين