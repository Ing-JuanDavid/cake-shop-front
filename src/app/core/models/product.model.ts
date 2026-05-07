import { ProductImage } from "./productImage.model";
import { Rate } from "./rate.model";

export interface Product {
  productId: number;
  name: string;
  price: number;
  quant: number;
  categoryName: string;
  description: string;
  score: number;
  rates: Rate[];
  images: ProductImage[];
  mainImg: ProductImage | null;
  active: boolean
}

export interface SimpleProduct {
  productId: number,
  name: string,
  price: number,
  categoryName: string,
  mainImage: ProductImage
}

export interface ProductDto {
  name: string;
  price: number;
  quant: number;
  categoryId: number;
  description: string;
  img: File[] | null;
}
