export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  seller?: { _id: string; name: string; verificationStatus?: string };
}