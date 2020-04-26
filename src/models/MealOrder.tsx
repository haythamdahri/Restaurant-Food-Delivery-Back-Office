import { Meal } from "./Meal";
import { Order } from './Order';
export class MealOrder {
    public id!: number;
    public meal!: Meal;
    public order!: Order;
    public quantity!: number;
    public totalPrice!: number;
}