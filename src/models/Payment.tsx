import { Order } from './Order';
import { User } from './User';

export class Payment {
    public id!: number;
    public user!: User;
    public order!: Order;
    public chargeId!: number;
    public timestamp!: Date;
}