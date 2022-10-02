import { EmailFactoryBase } from "../EmailFactoryBase";


import fetch from 'node-fetch';

export class AppRegistrationSuccessful extends EmailFactoryBase {
  
  
    url: string = "https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FappRegistrationSuccessful.html?alt=media&token=7c7b57b7-d7a8-42c6-abd7-19dfc7644573"
  
    public async getHtml(data: any): Promise<string> {
        let htmlStr: string = await (await fetch(this.url)).text()


        htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                         .split("{{pinCode}}").join(data.pinCode || '')
                         .split("{{today}}").join(new Date().toLocaleDateString())
    

            return htmlStr
        }



}
