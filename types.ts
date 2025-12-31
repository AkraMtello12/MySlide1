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

export interface AppData {
  quotes: Quote[];
  resources: Resource[];
}