import { EmailFactoryBase } from "../EmailFactoryBase"

import fetch from 'node-fetch';

export class AppPremiumMember extends EmailFactoryBase {

     url = "https://firebasestorage.googleapis.com/v0/b/ritimus-game.appspot.com/o/EmailTemplates%2FappPremiumMember.html?alt=media&token=7a5aac6c-f486-468f-91c6-7b5adeec7380"

    public async getHtml(data: any): Promise<string> {
        
        let htmlStr :string =  await (await fetch(this.url)).text()


       htmlStr = htmlStr.split("{{userMail}}").join(data.userMail)
                        .split("{{today}}").join(new Date().toLocaleDateString())
                        .split("{{startDate}}").join(data.startDate)
                        .split("{{endDate}}").join(data.endDate)

                        
      return htmlStr
    }
}
