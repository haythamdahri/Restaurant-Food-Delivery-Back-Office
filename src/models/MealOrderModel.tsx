import { MealModel } from "./MealModel";
import { OrderModel } from './OrderModel';

export class MealOrderModel {
    public id: number = 0;
    public meal: MealModel = new MealModel();
    public order: OrderModel = new OrderModel();
    public quantity: number = 0;
    public totalPrice: number = 0;
}