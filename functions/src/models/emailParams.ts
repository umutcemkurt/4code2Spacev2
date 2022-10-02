export interface EmailParams {
    toName: string,
    toMail: string,
    subject: string,
    pattern: number // 1 Yetkili girişi
    data: any
}
/*
ABSTRACT SINIF OLUŞTUR

 public abstract class EMailFactoryBase
    {
        public abstract void SendMail(string[] ParamList);
    }

SENARYO SINIFLARINI OLUŞTUR

public class DefaultInvDetailMailer: EMailFactoryBase
    {
        public override void SendMail(string[] ParamList)

FABRIKA SINIFINI(SELECTOR SINIFI) OLUŞTUR

public class EMailProductSelector
    {
        public EMailFactoryBase SelectProduct(string Pattern, string OwnerId)
        {
            switch (Pattern)
            {
                case "0":
                    return new DefaultTonerOrderFeedbackToCustomer();
                case "1":
                    return new DefaultTonerOrderApproval();
                case "2":
                    switch (OwnerId)

KULLANIMI


 EMailProductSelector Selector = new EMailProductSelector();
 
 EMailFactoryBase QProcessor = Selector.SelectProduct(RequestQItems.Rows[i]["PATTERN_NUMBER"].ToString(), RequestQItems.Rows[i]["OWNER_ID"].ToString());

                

 QProcessor.SendMail(ParamList);

*/