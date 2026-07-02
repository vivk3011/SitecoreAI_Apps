export interface Product {
  id: string;
  name: string;
  sku: string;
  imageUrl: string;
  price: number;
  description: string;
  category: string;
}

export type ProductPayload = Product;
