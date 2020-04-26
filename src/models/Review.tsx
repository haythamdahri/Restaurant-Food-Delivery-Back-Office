import { User } from './User';
import { Meal } from './Meal';

export class Review {
    public id!: number;
    public user!: User;
    public meal!: Meal;
    public comment!: string;
    public rating!: number;
    public timestamp!: Date;
}