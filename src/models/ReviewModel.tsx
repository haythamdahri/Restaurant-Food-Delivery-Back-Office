import { UserModel } from './UserModel';
import { MealModel } from './MealModel';

export class ReviewModel {
    public id!: number;
    public user!: UserModel;
    public meal!: MealModel;
    public comment!: string;
    public rating!: number;
    public timestamp!: Date;
}