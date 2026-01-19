export interface Quote {
  id: string;
  text: string;
  author: string;
  active: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  image: string;
}

export interface SlideWork {
  id: string;
  imageUrl: string;
  designerName: string;
  title: string;
}

export interface GuidelinesData {
  content: string;
}

export interface CategoryConfig {
  id: 'quotes' | 'resources' | 'guidelines' | 'portfolio';
  label: string;
  isProtected: boolean;
}

export interface AppData {
  quotes: Quote[];
  resources: Resource[];
  portfolio: SlideWork[];
  guidelines: GuidelinesData;
  categories: CategoryConfig[];
}