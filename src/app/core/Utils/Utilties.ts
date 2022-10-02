import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatDialogConfig } from "@angular/material/dialog";
import notify from "devextreme/ui/notify";
import { Timestamp } from "firebase/firestore";


export enum staticTexts {

  saved = 'Kaydedildi'


}

export function random(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getLocalUser() {
  return JSON.parse(localStorage.getItem("user"))
}
export function getLocalPlayer() {
  return JSON.parse(localStorage.getItem("selectedPlayer"))
}

export function getLocalSchool() {
  return JSON.parse(localStorage.getItem("selectedSchool"))
}
export function calcDate(date1, date2) {
  var diff = Math.floor(date1.getTime() - date2.getTime());
  var day = 1000 * 60 * 60 * 24;

  var days = Math.floor(diff / day);
  var months = Math.floor(days / 31);
  var years = Math.floor(months / 12);

  var message = date2.toDateString();
  message += " was "
  message += days + " days "
  message += months + " months "
  message += years + " years ago \n"

  return {
    days,
    months,
    years
  }
}

export function calculateYesterdayOrTomorow(date1: Date, tomorrow = false) {


  if (tomorrow) {
    return date1.setDate(date1.getDate() + 1)
  }

  return date1.setDate(date1.getDate() - 1)


}
export function generateDialogConfig(data): MatDialogConfig {

  const config: MatDialogConfig = {
    data: data
  }
  return config

}

export function succsesNotify(message: string) {
  notify(message, "succses")
}

export function createMetaData(){
  const user = getLocalUser()

  return { 
    author: user.id,
      confirm:false,
      isDeleted:false,
      created: Timestamp.now(),
      updated: Timestamp.now(),
  }
}

export function addMetaData(db:AngularFirestore, collectionId: string, docId: string, args: any) {

  const user = getLocalUser()

  db.collection(collectionId).doc(docId).update({

    metadata: {
      author: user.id,
      confirm:false,
      isDeleted:false,
      created: Timestamp.now(),
      updated: Timestamp.now(),
      
    }

  }).then()




}
export function deletedMeteData(){

     const user = getLocalUser()

  return { 
    author: user.id,
      confirm:false,
      isDeleted:true,
      created: Timestamp.now(),
      updated: Timestamp.now(),
  }

}

export function updateMetaData(db:AngularFirestore, collectionId: string, docId: string, args: any) {

  const user = getLocalUser()

  db.collection(collectionId).doc(docId).update({

    metadata: {
      author: user.id,
      ...args
      
    }

  }).then()




}