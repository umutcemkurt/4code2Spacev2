import { EmailFactoryBase } from "../EmailFactoryBase"

import fetch from 'node-fetch';

export class CorporateTeacherWelcomeMail implements EmailFactoryBase {

    url = 'https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FcorporateTeacherWelcome.html?alt=media&token=aa98c4d7-55a2-462b-abd4-64147081fcf6'

    public async getHtml(data: any): Promise<string> {
        
      
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{code}}").join(data.code)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                
       



      return htmlStr
    }
}
