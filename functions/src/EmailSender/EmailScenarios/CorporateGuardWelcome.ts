import { EmailFactoryBase } from "../EmailFactoryBase";

import fetch from 'node-fetch';


export class CorporateGuardWelcome extends EmailFactoryBase {
    url: string = "https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FcorporateGuardWelcome.html?alt=media&token=61250b88-bab4-4bc8-a267-6614f7464572"
    public async getHtml(data: any): Promise<string> {
        
      
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                        
       



      return htmlStr
    }

}
