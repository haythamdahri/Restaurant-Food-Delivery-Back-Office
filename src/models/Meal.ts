import { Review } from './Review';
import { RestaurantFile } from './RestaurantFile';

export class Meal {
    public id!: number;
    public name!: string;
    public image: RestaurantFile = new RestaurantFile();
    public price!: number;
    public stock!: number;
    public views!: number;
    public salePrice!: number;
    public preferred!: boolean;
    public reviews!: Array<Review>;
}