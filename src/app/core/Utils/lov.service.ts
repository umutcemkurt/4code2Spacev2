import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { LoaderService } from 'app/layout/common/loader/loader.service';
import { cloneDeep } from 'lodash';
import { from, Observable } from 'rxjs';
import { filter, finalize, last, map } from 'rxjs/operators';
import {  Country } from '../models/contacts.types';

@Injectable({
  providedIn: 'root'
})
export class LovService {

constructor(
  private http:HttpClient,
  private db:AngularFirestore,
  private fn:AngularFireFunctions,

  private remoteConfig:AngularFireRemoteConfig, 
  private loader:LoaderService
) { }


  getCountries():Observable<Country[]>{
    return this.http.get<Country[]>('api/apps/contacts/countries')
  
  }
  getPerms():Observable<any>{
    return this.http.get("assets/perms.json")
    }

    getStaffPerms(userId){
      return this.db.collection("corporateStaffs").ref.where("id" , "==" , userId).limit(1).get()
    }

    getFAQs(){
     return this.fn.httpsCallable("getFAQ")("corporateFAQs")
       
    }

    getGames(){
    return this.remoteConfig.parameters.pipe(
      map( t => t.find(r => r.key == "Ritimus2_0_Games"))
    ).pipe(
      map(t => {
        if (t) {
          return JSON.parse(t.asString())
        }
      }),
      last()
    ).pipe(
      map(async t => {

        
          let localization =  await this.remoteConfig.parameters.pipe(
            map( q=>  q.find(r => r.key == "Localization")),
            last() 
          ).toPromise()
          debugger

          if (!localization) {
            return this.remoteConfig.fetch().then(res => {
              
              return
            })
          }

          let localJSON = JSON.parse(localization.asString())

          console.log(localJSON.Turkce)


          Object.keys(t).forEach((key ,i) => {
            if(i == 0)  console.log(key)

            let value = cloneDeep(t[key])
            
            t[key] = {
              ...value,
              displayName :localJSON.Turkce[key + "_name"]
            }
          })

      
            
              
 

        return t

      })
    )
      
    }

}
