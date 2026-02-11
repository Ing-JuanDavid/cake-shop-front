import { CartProduct } from "./cart.model";
import { Product } from "./product.model";

export interface Order {
  products : CartProduct[],
  total: number,
  status: string,
  date: Date,
  orderId: number
}
