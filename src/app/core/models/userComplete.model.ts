import { Rate } from "./rate.model";
import { Order } from "./order.model";
import { User } from "./user.model";
import { Address } from "./address.model";

export interface UserComplete extends User {
  addresses: Address[] | [];
  rates: Rate[] | [];
  orders: Order[] | [];
}
