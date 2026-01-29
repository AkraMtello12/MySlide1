import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { AppData, Quote, Resource, Category } from '../types';

// Fallback data in case of permission errors (common in fresh Firebase projects without setup)
const FALLBACK_DATA: AppData = {
  quotes: [
    { id: 'demo1', text: 'التصميم هو السفير الصامت لعلامتك التجارية.', author: 'بول راند', active: true },
    { id: 'demo2', text: 'البساطة هي قمة التعقيد.', author: 'ليوناردو دافنشي', active: true },
    { id: 'demo3', text: 'يرجى تفعيل "Anonymous Auth" وإعداد "Firestore Rules" في Firebase Console لعرض البيانات الحقيقية.', author: 'تنبيه النظام', active: true }
  ],
  categories: [
    { id: 'cat_img', name: 'صور' },
    { id: 'cat_font', name: 'خطوط' },
    { id: 'cat_icon', name: 'أيقونات' }
  ],
  resources: [
    { 
      id: 'res_1', 
      title: 'Unsplash', 
      description: 'أكبر مكتبة صور مجانية عالية الجودة للمصممين.', 
      url: 'https://unsplash.com', 
      image: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&w=800&q=80', 
      categoryId: 'cat_img' 
    },
    { 
      id: 'res_2', 
      title: 'Google Fonts', 
      description: 'مكتبة خطوط مجانية تدعم العربية واللغات الأخرى.', 
      url: 'https://fonts.google.com', 
      image: 'https://lh3.googleusercontent.com/COxitq8kCuOiWI3EXK52Wz473l78HkLpCL28vJm0t2a6j8_2j3L6h7p6h8_2j3L6h7p6h8=w16383', 
      categoryId: 'cat_font' 
    },
    { 
      id: 'res_3', 
      title: 'Lucide Icons', 
      description: 'مكتبة أيقونات مفتوحة المصدر نظيفة وجميلة.', 
      url: 'https://lucide.dev', 
      image: 'https://lucide.dev/og.png', 
      categoryId: 'cat_icon' 
    }
  ]
};

// --- Fetch Data ---
export const getAppData = async (): Promise<AppData> => {
  try {
    const [quotesSnap, resourcesSnap, categoriesSnap] = await Promise.all([
      getDocs(collection(db, 'quotes')),
      getDocs(collection(db, 'resources')),
      getDocs(collection(db, 'categories'))
    ]);

    const quotes = quotesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Quote));
    const resources = resourcesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
    const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    
    // If DB is empty, use fallback data to populate UI for first-time viewing
    if (quotes.length === 0 && resources.length === 0 && categories.length === 0) {
       console.log("Database empty, returning fallback data for demonstration.");
       return FALLBACK_DATA;
    }
    
    return { quotes, resources, categories };
  } catch (error: any) {
    // Log as warning instead of error to prevent console noise for expected permission issues in demo mode
    console.warn("Firestore access failed. Switching to Demo Mode.", error.message || error);
    
    // Always return fallback data to ensure the app loads
    return FALLBACK_DATA;
  }
};

// --- Quotes Operations ---
export const addQuoteToDB = async (quote: Omit<Quote, 'id'>) => {
  return addDoc(collection(db, 'quotes'), quote);
};

export const updateQuoteInDB = async (id: string, data: Partial<Quote>) => {
  const ref = doc(db, 'quotes', id);
  return updateDoc(ref, data);
};

export const deleteQuoteFromDB = async (id: string) => {
  return deleteDoc(doc(db, 'quotes', id));
};

// --- Resources Operations ---
export const addResourceToDB = async (res: Omit<Resource, 'id'>) => {
  return addDoc(collection(db, 'resources'), res);
};

export const updateResourceInDB = async (id: string, data: Partial<Resource>) => {
  return updateDoc(doc(db, 'resources', id), data);
};

export const deleteResourceFromDB = async (id: string) => {
  return deleteDoc(doc(db, 'resources', id));
};

// --- Categories Operations ---
export const addCategoryToDB = async (category: Omit<Category, 'id'>) => {
  return addDoc(collection(db, 'categories'), category);
};

export const updateCategoryInDB = async (id: string, data: Partial<Category>) => {
  return updateDoc(doc(db, 'categories', id), data);
};

export const deleteCategoryFromDB = async (id: string) => {
  return deleteDoc(doc(db, 'categories', id));
};