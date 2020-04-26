import { User } from './User';
import { RoleType } from './RoleType';

export class Role {
    public id!: number;
    public roleName!: RoleType;
    public users!: Array<User>;
}