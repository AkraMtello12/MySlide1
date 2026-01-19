import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { AppData, Quote, Resource, SlideWork, GuidelinesData, CategoryConfig } from '../types';

// Initial Data for fresh setup
const INITIAL_GUIDELINES = `
# اللائحة الداخلية لشركة MySlide
## 1. ساعات العمل
ساعات العمل الرسمية تبدأ من الساعة 9:00 صباحاً وحتى 5:00 مساءً.
`;

const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { id: 'quotes', label: 'إدارة الاقتباسات', isProtected: false },
  { id: 'resources', label: 'المواقع الهامة', isProtected: false },
  { id: 'guidelines', label: 'اللائحة الداخلية', isProtected: true }, // Protected by default example
  { id: 'portfolio', label: 'معرض الأعمال', isProtected: false },
];

// --- Fetch Data ---
export const getAppData = async (): Promise<AppData> => {
  try {
    const [quotesSnap, resourcesSnap, portfolioSnap, guidelinesSnap, settingsSnap] = await Promise.all([
      getDocs(collection(db, 'quotes')),
      getDocs(collection(db, 'resources')),
      getDocs(collection(db, 'portfolio')),
      getDoc(doc(db, 'settings', 'guidelines')),
      getDoc(doc(db, 'settings', 'ui_config'))
    ]);

    const quotes = quotesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Quote));
    const resources = resourcesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
    const portfolio = portfolioSnap.docs.map(d => ({ id: d.id, ...d.data() } as SlideWork));
    
    // Handle Guidelines
    let guidelines = { content: INITIAL_GUIDELINES };
    if (guidelinesSnap.exists()) {
      guidelines = guidelinesSnap.data() as GuidelinesData;
    } else {
      await setDoc(doc(db, 'settings', 'guidelines'), guidelines);
    }

    // Handle Categories Configuration
    let categories = DEFAULT_CATEGORIES;
    if (settingsSnap.exists() && settingsSnap.data().categories) {
      // Merge with defaults to ensure all keys exist if we add new ones later
      const storedCats = settingsSnap.data().categories as CategoryConfig[];
      categories = DEFAULT_CATEGORIES.map(def => 
        storedCats.find(c => c.id === def.id) || def
      );
    } else {
      await setDoc(doc(db, 'settings', 'ui_config'), { categories: DEFAULT_CATEGORIES });
    }

    return { quotes, resources, portfolio, guidelines, categories };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
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

// --- Portfolio Operations ---
export const addWorkToDB = async (work: Omit<SlideWork, 'id'>) => {
  return addDoc(collection(db, 'portfolio'), work);
};

export const updateWorkInDB = async (id: string, data: Partial<SlideWork>) => {
  return updateDoc(doc(db, 'portfolio', id), data);
};

export const deleteWorkFromDB = async (id: string) => {
  return deleteDoc(doc(db, 'portfolio', id));
};

// --- Guidelines ---
export const saveGuidelinesToDB = async (content: string) => {
  return setDoc(doc(db, 'settings', 'guidelines'), { content }, { merge: true });
};

// --- Settings / Categories ---
export const saveCategoriesConfigToDB = async (categories: CategoryConfig[]) => {
  return setDoc(doc(db, 'settings', 'ui_config'), { categories }, { merge: true });
};