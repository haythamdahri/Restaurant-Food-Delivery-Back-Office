import { UserModel } from "./UserModel";
import { MealOrderModel } from './MealOrderModel';
import { ShippingModel } from './ShippingModel';
export class OrderModel {
    id!: number;
    user!: UserModel;
    mealOrders!: Array<MealOrderModel>;
    price!: number;
    totalPrice!: number;
    shippingFees!: number;
    shipping!: ShippingModel;
    time!: Date;
    delivered!: boolean;
    cancelled!: boolean;
}