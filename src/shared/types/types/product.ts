export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  featured: boolean;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
}
