import { EmailFactoryBase } from "../EmailFactoryBase"

import fetch from 'node-fetch';

export class CorporateTeacherWelcomeMail_Test implements EmailFactoryBase {

    url = 'https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FcorporateTeacherWelcome%20-%20test.html?alt=media&token=5fbf0a2e-d45c-461a-a012-6952be5ad1eb'

    public async getHtml(data: any): Promise<string> {
        
      
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{code}}").join(data.code)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                
       



      return htmlStr
    }
}
