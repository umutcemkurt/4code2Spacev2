import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { User } from '../user/user.types';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { cloneDeep, reject } from 'lodash';
import { arrayUnion, FieldValue, Timestamp } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import moment from 'moment';
import { calcDate, calculateYesterdayOrTomorow } from '../Utils/Utilties';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { EmailParams } from '../../../../functions/src/models/emailParams';
import { EmaiPatterns } from '../../../../functions/src/enums/EmaiPatterns.enum';
import { _FirebaseError } from '../Utils/Enums/FirebaseErrors.enum';
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';



@Injectable()
export class AuthService {
    _authenticated: boolean = false;

    codes = []

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private auth: AngularFireAuth,
        private db: AngularFirestore,
        private fn:AngularFireFunctions,
        private router:Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string) {
      
        return this.auth.sendPasswordResetEmail(email)


    }

    /**
     * Reset password
     *
     * @param password
     */
    async resetPassword(password: string) {



        return (await this.auth.currentUser).updatePassword(password)
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    async signIn(uid) {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }


        this._authenticated = true;

        this.accessToken = uid

        await this._userService.getData(uid)

    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        debugger
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                debugger
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
       
           this.auth.signOut().then(res => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            
            this._userService.user.next(null)
            this._authenticated = false;

            this.router.navigate(['/home'])

            

           }).catch(err => console.log(err))

        // Set the authenticated flag to false
       

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user) {
        let promise = new Promise<any>( (resolve, reject) => {
            

            this.auth.createUserWithEmailAndPassword(user.email , user.password).then(async(res) => {
               
                delete user['password']
                delete user['rePassword']

                user.id =  res.user.uid
          
                user.birthDate = user.birthDate.toDate()

              await  this.db.collection("users").doc(user.id).set({...user})


                this._userService.getData(user.id).then(uRes => {
                    this.accessToken = user.id
                    resolve(uRes)
                })

            }).catch((err) => reject(err))

        })

        return promise



    }

    corporateSignUp(email , phone ,userId){
        let promise = new Promise((resolve ,reject ) => {

            this.db.collection("corporateStaffs").ref.where("email", "==" , email).get().then(async res => {

                let staff:any = res.docs[0].data()

                this.db.collection("users").doc(userId).update({perms: staff.perms ,schoolIDs : arrayUnion(staff.schoolID) })


                    
                this.db.collection("corporateStaffs").doc(staff.id).update({
                    statusID: 2,
                    phone: phone,
                    userID: userId
                }).then(() => {
                    let emailParams : EmailParams = {
                        toName: staff.fullname ,
                        toMail: email,
                        subject:"Kurumsala Hoşgeldiniz",
                        pattern: EmaiPatterns.CorporateTeacherWelcome,
                        data: {
                            userMail: email
                        }
                    }
                    this.fn.httpsCallable("sendEmail")(emailParams).subscribe()
                    
                    resolve(null)})
    
            })
        })
        return promise
    }

    createUser(email , password , schoolID){

        let promise = new Promise(async(resolve , reject ) => {

            await this.auth.createUserWithEmailAndPassword(email ,password ).catch(err => {

                if (err.code == _FirebaseError.alreadyUse) {
                  return reject({ code:_FirebaseError.alreadyUse, message:"Kullanıcının ritimus hesabı vardır. Giriş yapması gerekmektedir.Eğer kullanıcının kurumsal hesabı yoksa giriş yaptıktan sonra otomatik olarak yönlendirileceksiniz."})
                }

            })

            let autRef =   await  this.auth.signInWithEmailAndPassword(email ,password )
            let school:any = (await this.db.collection("schools").doc(schoolID).get().toPromise()).data()

          await   this.db.collection("users").doc(autRef.user.uid).set({
                activePlayerID: null ,
                email: email,
                fullName: '',
                id: autRef.user.uid,
                lastLoginDate: Timestamp.now(),
                metadata:{
                    author: autRef.user.uid,
                    created: Timestamp.now(),
                    updated:Timestamp.now(),
                    isDeleted: false,
                    confirm: false

                },
                perms: [],
                pin: 0,
                roleTypeID: 0,
                schoolID : schoolID,
                timeLimit:40,
                verificationCode: ''
            }) 
            try {
                let subscription = {

                    metadata:{
                        author: autRef.user.uid,
                        created: Timestamp.now(),
                        updated:Timestamp.now(),
                        isDeleted: false,
                        confirm: false
    
                    },
                    receipt:"CORPORATE" ,
                    referenceActivationID: null,
                    subscriptionExpiryDate:  school.contract.endDate,
                    subscriptionStartDate: Timestamp.now(),
                    subscriptionTypeID: 1,
                    userID: autRef.user.uid
              
                  }
              
              
              
    
              
                  await this.db.collection("subscriptions").add(subscription)
              
                let corpStaff :any = await (await this.db.collection("corporateStaffs").ref.where('email' , "==" , email).get()).docs[0].data() 
                corpStaff.userID = autRef.user.uid
                this.db.collection("corporateStaffs").doc(corpStaff.id).update(corpStaff).then(() => resolve(autRef.user.uid))
                
            } catch (error) {
                reject({code:1, message:"Email sistemdekiyle uyuşmuyor"})
            }



        })

        return promise

    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {

        // Check the access token availability
        if (this.accessToken) {
            return of(true);
        }


        // If the access token exists and it didn't expire, sign in using it
        return of(false);
    }

    async checkUser(email, corporateLogin) {
        let userRef = (await this.db.collection("users").ref.where("email", "==", email).limit(1).get())

        if (userRef.empty) {
            return "RitimUS kullanıcısı bulunamadı"
        }

        let user: any = userRef.docs.map(t => t.data())[0]



        if (user.statusID == 3) {
            return "Kurumsal üyeliği silinmiş kullanıcı"
        }

        let hasKurumsal = false


        if (corporateLogin) {
        debugger
            let userCorporateRef = await this.db.collection("corporateStaffs").ref.where("userID", "==", user.id).get()
            
            let staff: any = userCorporateRef.docs[0].data()

            if (staff.statusID == 2) {
                hasKurumsal = true
            } 

            if (staff.statusID == 3) {
                return "Kurumsal üyeliği silinmiş kullanıcı" 
            }

            return {
                navigate: hasKurumsal
            }

        } else {
            let userPlayersRef = await this.db.collection("players").ref.where("authUserID", "==", user.id).get()

            let players: any[] = userPlayersRef.docs.map(t => t.data())



            for (let item of players) {

                if (item.studentInfo.schoolID) {
                    hasKurumsal = true
                }

            }




            return {
                navigate: hasKurumsal
            }
        }



    }

    async checkSelectedSchoolCodeIsUsed(codeId ){
        return (await (await this.db.collection('codes').doc(codeId).get().toPromise()).data() as any ).active  == 1 ? true : false
    }

    checkCodeGetSchool(code) {

        let promise = new Promise((resolve, reject) => {

            this.db.collection("codes").ref.where('code', "==", code).get().then(async res => {


                if (res.empty) {
                    reject({ error: true, message: "Böyle bir kod bulunamadı" })
                }

                this.codes = res.docs.map(t => t.data())

                let schools = []

                for (let item of this.codes) {


           
                    let school = await this.db.collection("schools").doc(item.schoolID).get().toPromise()
                    schools.push(school.data())

                }


                resolve({ schools: schools, codes: this.codes })


            })
        })

        return promise


    }
    async checkCorporateCode(code , email){
        let ref = (await this.db.collection('corporateStaffs').ref.where("code" , "==" , code).where("email" , "==" , email).get())
        let empty = ref.empty
        let data
        if (!empty) {
            data = ref.docs[0].data()
        }
        return {
            empty,
            data
        }
    }

}
