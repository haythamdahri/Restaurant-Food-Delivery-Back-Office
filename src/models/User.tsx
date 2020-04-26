import { Role } from './Role';
import { Meal } from './Meal';
import { Review } from './Review';
import { RestaurantFile } from './RestaurantFile';

export class User {
    public id!: number;
    public email!: string;
    public password!: string;
    public username!: string;
    public enabled!: boolean;
    public image: RestaurantFile = new RestaurantFile();
    public location!: string;
    public roles!: Array<Role>;
    public preferredMeals!: Array<Meal>;
    private reviews!: Array<Review>;
}