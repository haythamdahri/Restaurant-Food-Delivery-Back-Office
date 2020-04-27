export default class UserTokenModel {
    public bearerToken: string = '';
    public token: string = '';
    public email: string = '';
    public roles: [{ authority: string }] = [{authority: ''}];
    public exp: number = 0;
}