export abstract class EmailFactoryBase {

    abstract url:string 

    public abstract getHtml(data:any):Promise<string>
}
