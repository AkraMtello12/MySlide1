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

// Fallback data in case of TOTAL failure (network/permissions)
const FALLBACK_DATA: AppData = {
  quotes: [
    { id: 'demo1', text: 'التصميم هو السفير الصامت لعلامتك التجارية.', author: 'بول راند', active: true },
    { id: 'demo2', text: 'البساطة هي قمة التعقيد.', author: 'ليوناردو دافنشي', active: true },
    { id: 'demo3', text: 'يرجى التأكد من إعداد قواعد البيانات (Rules) في Firebase.', author: 'تنبيه النظام', active: true }
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
    }
  ]
};

// --- Fetch Data ---
export const getAppData = async (): Promise<AppData> => {
  try {
    // Use allSettled so if one collection fails (e.g. permission error), others can still succeed
    const results = await Promise.allSettled([
      getDocs(collection(db, 'quotes')),
      getDocs(collection(db, 'resources')),
      getDocs(collection(db, 'categories'))
    ]);

    const quotes: Quote[] = [];
    const resources: Resource[] = [];
    const categories: Category[] = [];

    // Process Quotes
    if (results[0].status === 'fulfilled') {
      results[0].value.docs.forEach(d => quotes.push({ id: d.id, ...d.data() } as Quote));
    } else {
      console.warn("Failed to fetch quotes:", results[0].reason);
    }

    // Process Resources
    if (results[1].status === 'fulfilled') {
      results[1].value.docs.forEach(d => resources.push({ id: d.id, ...d.data() } as Resource));
    } else {
      console.warn("Failed to fetch resources:", results[1].reason);
    }

    // Process Categories
    if (results[2].status === 'fulfilled') {
      results[2].value.docs.forEach(d => categories.push({ id: d.id, ...d.data() } as Category));
    } else {
      console.warn("Failed to fetch categories:", results[2].reason);
    }

    // Check if ALL failed. If so, return fallback.
    if (results[0].status === 'rejected' && results[1].status === 'rejected' && results[2].status === 'rejected') {
       console.warn("All collections failed to load. Returning Fallback Data.");
       return FALLBACK_DATA;
    }

    // NOTE: We no longer check for "Empty DB". 
    // If the DB is empty, we return empty arrays so the Admin sees the real state of their DB.
    
    return { quotes, resources, categories };

  } catch (error: any) {
    console.error("Critical Error fetching data:", error);
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