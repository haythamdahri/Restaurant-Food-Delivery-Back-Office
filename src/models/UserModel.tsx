import { RoleModel } from './RoleModel';
import { MealModel } from './MealModel';
import { ReviewModel } from './ReviewModel';
import { RestaurantFileModel } from './RestaurantFileModel';

export class UserModel {
    public id: number = 0;
    public email: string = '';
    public password: string = '';
    public username: string = '';
    public enabled: boolean = true;
    public image: RestaurantFileModel = new RestaurantFileModel();
    public location: string = '';
    public roles: Array<RoleModel> = [];
    public preferredMeals: Array<MealModel> = [];
    public reviews: Array<ReviewModel> = [];
    public online: boolean = false;
    public lastOnlineTime: Date = new Date();
}