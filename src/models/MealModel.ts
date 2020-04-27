import { ReviewModel } from './ReviewModel';
import { RestaurantFileModel } from './RestaurantFileModel';

export class MealModel {
    public id!: number;
    public name!: string;
    public image: RestaurantFileModel = new RestaurantFileModel();
    public price!: number;
    public stock!: number;
    public views!: number;
    public salePrice!: number;
    public preferred!: boolean;
    public reviews!: Array<ReviewModel>;
}