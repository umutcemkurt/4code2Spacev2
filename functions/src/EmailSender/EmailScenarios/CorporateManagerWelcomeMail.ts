import { EmailFactoryBase } from "../EmailFactoryBase";

import fetch from 'node-fetch';


export class CorporateManagerWelcomeMail extends EmailFactoryBase {
    url: string = "https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FcorporateManagerWelcome.html?alt=media&token=c9b64ae7-c102-4ce3-86f9-850c9ce86b1c"
    public async getHtml(data: any): Promise<string> {
        
      
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                        .split("{{password}}").join(data.password)
       



      return htmlStr
    }

}
