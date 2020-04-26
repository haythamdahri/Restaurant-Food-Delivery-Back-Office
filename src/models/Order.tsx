import { User } from "./User";
import { MealOrder } from './MealOrder';
import { Shipping } from './Shipping';
export class Order {
    id!: number;
    user!: User;
    mealOrders!: Array<MealOrder>;
    price!: number;
    totalPrice!: number;
    shippingFees!: number;
    shipping!: Shipping;
    time!: Date;
    delivered!: boolean;
    cancelled!: boolean;
}