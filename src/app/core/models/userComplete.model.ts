import { Rate } from "./rate.model";
import { Order } from "./order.model";
import { User } from "./user.model";

export interface UserComplete extends User {
  rates: Rate[] | [];
  orders: Order[] | [];
}
