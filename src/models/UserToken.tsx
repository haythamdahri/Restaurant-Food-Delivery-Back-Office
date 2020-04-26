export default class User {
    public bearerToken: string = '';
    public token: string = '';
    public email: string = '';
    public roles: [{ authority: string }] = [{authority: ''}];
    public exp: number = 0;
}