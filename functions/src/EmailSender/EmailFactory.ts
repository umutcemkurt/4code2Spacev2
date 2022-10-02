import { EmaiPatterns } from "../enums/EmaiPatterns.enum";
import { EmailFactoryBase } from "./EmailFactoryBase";
import { AppForgetPinCode } from "./EmailScenarios/AppForgetPinCode";
import { AppPremiumMember } from "./EmailScenarios/AppPremiumMemberMail";
import { AppRegistrationSuccessful } from "./EmailScenarios/AppRegistrationSuccessful";
import { AppVerificationMail } from "./EmailScenarios/AppVerificationMail";
import { CorporateGuardWelcome } from "./EmailScenarios/corporateGuardWelcome";
import { CorporateManagerWelcomeMail } from "./EmailScenarios/CorporateManagerWelcomeMail";
import { CorporateTeacherWelcomeMail } from "./EmailScenarios/CorporateTeacherWelcomeMail";
import { CorporateTeacherWelcomeMail_Test } from "./EmailScenarios/CorporateTeacherWelcomeMail-test";

export class EmailFactory {



    public selectEmail(pattern: number): EmailFactoryBase {


        switch (pattern) {
            case EmaiPatterns.CorporateManagerWelcome:
                return new CorporateManagerWelcomeMail();
                break;

            case EmaiPatterns.CorporateTeacherWelcome:
                return new CorporateTeacherWelcomeMail();
            case EmaiPatterns.CorporateGuardWelcome:
                return new CorporateGuardWelcome();


            case EmaiPatterns.AppVerification:
                return new AppVerificationMail()

            case EmaiPatterns.AppRegistrationSuccessful:
                return new AppRegistrationSuccessful();

            case EmaiPatterns.AppPremiumMember:
                return new AppPremiumMember()

            case EmaiPatterns.TestMail:
                return new CorporateTeacherWelcomeMail_Test()

                case EmaiPatterns.AppForgetPinCode:
                    return new AppForgetPinCode()

            default:
                return new CorporateManagerWelcomeMail()
                break;
        }

    }

}
