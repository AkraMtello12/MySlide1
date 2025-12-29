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
// تم إزالة مكتبات التخزين لأننا سنعتمد على الروابط فقط
import { AppData, Quote, Resource, SlideWork, GuidelinesData } from '../types';

// Initial Data for fresh setup
const INITIAL_GUIDELINES = `
# اللائحة الداخلية لشركة MySlide
## 1. ساعات العمل
ساعات العمل الرسمية تبدأ من الساعة 9:00 صباحاً وحتى 5:00 مساءً.
`;

// --- Fetch Data ---
export const getAppData = async (): Promise<AppData> => {
  try {
    const [quotesSnap, resourcesSnap, portfolioSnap, guidelinesSnap] = await Promise.all([
      getDocs(collection(db, 'quotes')),
      getDocs(collection(db, 'resources')),
      getDocs(collection(db, 'portfolio')),
      getDoc(doc(db, 'settings', 'guidelines'))
    ]);

    const quotes = quotesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Quote));
    const resources = resourcesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
    const portfolio = portfolioSnap.docs.map(d => ({ id: d.id, ...d.data() } as SlideWork));
    
    // Handle Guidelines (Single Document)
    let guidelines = { content: INITIAL_GUIDELINES };
    if (guidelinesSnap.exists()) {
      guidelines = guidelinesSnap.data() as GuidelinesData;
    } else {
      // Create if doesn't exist
      await setDoc(doc(db, 'settings', 'guidelines'), guidelines);
    }

    return { quotes, resources, portfolio, guidelines };
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