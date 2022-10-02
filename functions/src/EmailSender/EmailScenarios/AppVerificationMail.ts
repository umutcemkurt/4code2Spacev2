import { EmailFactoryBase } from "../EmailFactoryBase"


import fetch from 'node-fetch';

export class AppVerificationMail extends EmailFactoryBase {
     url = "https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FappVerfication.html?alt=media&token=692f435b-ce85-4d61-b3cc-9262dc5b291a"

    public async getHtml(data: any): Promise<string> {
        
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                        .split("{{verificationCode}}").join(data.verificationCode)

                        
      return htmlStr
    }
}
