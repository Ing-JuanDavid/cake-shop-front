export interface Product {
  productId: number;
  name: string;
  price: number;
  quant: number;
  categoryName: string;
  description: string;
  score: number;
  rateNumber: number;
  imgUrl: string;
}

export interface ProductDto {
  name: string;
  price: number;
  quant: number;
  categoryId: number;
  description: string;
  img: File | null;
}
