import { OrderModel } from './OrderModel';
import { UserModel } from './UserModel';

export class PaymentModel {
    public id!: number;
    public user!: UserModel;
    public order!: OrderModel;
    public chargeId!: number;
    public timestamp!: Date;
}