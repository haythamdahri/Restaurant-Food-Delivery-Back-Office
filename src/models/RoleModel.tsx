import { UserModel } from './UserModel';
import { RoleTypeModel } from './RoleTypeModel';

export class RoleModel {
    public id!: number;
    public roleName!: RoleTypeModel;
    public users!: Array<UserModel>;
}