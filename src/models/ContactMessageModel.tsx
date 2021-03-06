export class ContactMessageModel {
    public id: number = 0;
    public firstName: string = '';
    public lastName: string = '';
    public email: string = '';
    public phone: string = '';
    public content: string = '';
    public time: Date = new Date();
    public responded: boolean = false;
}