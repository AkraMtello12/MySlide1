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
    
    return { quotes, resources, categories };
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