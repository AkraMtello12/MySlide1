export interface Quote {
  id: string;
  text: string;
  author: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  password?: string; // Optional password for the category
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  image: string;
  categoryId: string;
}

export interface AppData {
  quotes: Quote[];
  resources: Resource[];
  categories: Category[];
}