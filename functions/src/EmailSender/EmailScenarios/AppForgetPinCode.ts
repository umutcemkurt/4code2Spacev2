import { EmailFactoryBase } from "../EmailFactoryBase"


import fetch from 'node-fetch';

export class AppForgetPinCode extends EmailFactoryBase {
     url = "https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FappForgetPinCode.html?alt=media&token=8605af02-d0fb-45c1-aad6-853d62b31b13"

    public async getHtml(data: any): Promise<string> {
        
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                        .split("{{pinCode}}").join(data.pinCode)

                        
      return htmlStr
    }
}
