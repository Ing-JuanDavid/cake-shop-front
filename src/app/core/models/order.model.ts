import { Product } from "./product.model";

export interface Order {
  products : Product[],
  total: number,
  status: string,
  date: Date,
  orderId: number
}
