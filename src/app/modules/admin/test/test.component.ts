import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Timestamp } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'app/core/user/user.service';
import { LovService } from 'app/core/Utils/lov.service';
import { random } from 'app/core/Utils/Utilties';
import { FBPaginatorComponent } from 'app/layout/common/FB-Paginator/FB-Paginator.component';
import { LoaderService } from 'app/layout/common/loader/loader.service';
import RRule from 'rrule';
import { CalendarTypes } from '../../../../../functions/src/enums/CalendarTypes.enum';
import { EmaiPatterns } from '../../../../../functions/src/enums/EmaiPatterns.enum';
import { EmailParams } from '../../../../../functions/src/models/emailParams';
import { AngularFireDatabase} from '@angular/fire/compat/database';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { cloneDeep } from 'lodash';
//import html from '../../../../../functions/src/EmailSender/emailTemplates/corporateManagerWelcome.html'

declare var gapi: any

export abstract class EmailFactoryBase {

  public abstract  getHtml(data:any):Promise<string>
}

export class EmailSelector {



  public selectEmail(pattern: number): EmailFactoryBase {


      switch (pattern) {
          case 1:
              return new CorporateManagerWelcomeMail();
              break;
          default:
              return new CorporateManagerWelcomeMail()
              break;
      }

  }

}
export class CorporateManagerWelcomeMail extends EmailFactoryBase {
  public async getHtml(data: any): Promise<string>{
    return  await fetch("../../../../../functions/src/EmailSender/emailTemplates/corporateManagerWelcome.html").then(res => res.text())
  }

}


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  @ViewChild(FBPaginatorComponent) paginator: FBPaginatorComponent

  firebaseConfig = {
    apiKey: "AIzaSyAtX1KmO10iF6eXW14i_XCg-pTtymHiNfM",
    authDomain: "ritimus-2.firebaseapp.com",
    projectId: "ritimus-2",
    storageBucket: "ritimus-2.appspot.com",
    messagingSenderId: "266710559210",
    appId: "1:266710559210:web:903aa12342af1282276a93",
    measurementId: "G-RKF3SZCG37"
  };


  dataSource = []


  data

  currentDate = new Date()
  appointmentsData = []
  calendars

  constructor(
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions,
    private http: HttpClient,
    private userService: UserService,
    private loaderService: LoaderService,
    private auth: AngularFireAuth,
    private realtimeDb:AngularFireDatabase,
    private lovService: LovService,
    private _domSanitizer: DomSanitizer,

  ) {


    let percent = new DecimalPipe("tr")

    console.log(percent.transform(7.4500017166137695))

    let _data = []
    for (let index = 0; index < 5; index++) {

      _data.push(random(10, 100))

    }

    this.data = [{
      name: "budget",
      data: _data
    }
    ]

  }

  test(e) {
    console.log(e)
  }

   _addEvent(calendarType:CalendarTypes , playerId:string , recurrenceRule = '' , data:any){
      
    const event = {
        allDay : true,
       // calendarID : getCalendar(calendarType),
        description: data.desc,
        startDate : data.startDate,
        endDate : data.endDate,
        playerID : playerId,
        recurrenceRule: recurrenceRule,
        schoolID : data.schoolID, 
        text: data.text
      }


    console.log("calistim")

   //   db.collection("calendarEvents").add(event).then()
  }
  ngOnInit() {


    

    this.firestore.collection("shards").doc("test").update({data: new Date()}).then(res => console.log("ok")).catch(err => console.log("hata"))

    this._addEvent(CalendarTypes.Homeworks , "" , undefined , {} )

     this.firestore.collection("classrooms").ref.where("students" , "array-contains" , "MLS7GsZstlhNYf3e6a0q").get().then(res => console.log(res.empty))
      // let selector = new EmailSelector()
      // let html = await selector.selectEmail(1).getHtml({})
      // console.log(html)
      //   this.lovService.getGames().subscribe(async data => {

      //     console.log(await data)
      //   })





    this.firestore.collection("calendarEvents").get().toPromise().then(res => this.appointmentsData = res.docs.map(t => t.data()))
    //    this.test()

    //     let dummyCollestion = this.firestore.collection("dummyDatas")

    //     let dummies = dummyCollestion.snapshotChanges();

    //     debugger

    //     dummies.subscribe((data) => {
    //       data.forEach(res => res.payload.doc.data())
    // dummies
    // dummyCollestion.doc()
    //       debugger
    //       // console.log(data[1])

    //       // data[1].eklendi = 'degistirildi'.toUpperCase()

    //       // dummyCollestion.doc(dummyCollestion).update(data[1])

    //     })
    //    // dummyCollestion.add({eklendi : 'vallahi bilahi eklendi'})

    //     //debugger


    this.firestore.collection("players").ref.orderBy("id").limit(20)
      .get().then(res => {
        this.dataSource = res.docs.map(t => t.data())
        //this.paginator.query.next(res.query)
        this.paginator.collection.next("players")
        console.log(res.size)
      })






  }
  async getCalendar() {
    // const events = await gapi.client.calendar.events.list({
    //   calendarId: "primary",
    //   timeMin: new Date().toISOString(),
    //   showDeleted: false,
    //   singleEvents: true,
    //   maxResults: 10,
    //   orderBy: "startTime"
    // })

    // console.log(events.result.items)

    this.http.get('assets/words_en-US.json').subscribe((data :string[]) => {
      
      let _data =cloneDeep(data)
      for(let item of data){

        if(item.length <= 2){

          _data.splice(_data.indexOf(item) , 1)


        }

        if(item.length >= 9){
          _data.splice(_data.indexOf(item) , 1)

        }


      }

     console.log(_data)

    })

  }

  giveCorporate() {

    this.http.get("/assets/perms.json").subscribe(data => {
      console.log(data)

      let perms = []
      for (let item of data[0]) {

        if (item.groupName == 'Müdür') {
          
          for (let perm of item.perms) {

            perms.push(perm.perm)

          }
        }


      }

      this.firestore.collection('users').doc("HlII3rI12FZQqgwcGTa0K23TgNr1").update({ perms: perms }).then()
      // this.firestore.collection('corporateStaffs').doc("HlII3rI12FZQqgwcGTa0K23TgNr1").update({ perms: perms }).then()

    })



  }

  testSchedular() {
    this.functions.useEmulator("192.168.1.134", 8010).then(() => {

      this.functions.httpsCallable("testSchedular")("").subscribe(res => console.log(res), err => console.log(err))
    })
  }

  fnTest(){
    this.functions.useEmulator("192.168.1.148", 8010).then(() => {

      this.functions.httpsCallable("doItSomething")('').subscribe(res => {
        console.log(res)
        // this.realtimeDb.database.ref('db').child("intelligenceRanking").set(res.intelligenceRanking)
        //                                                   .then(q => console.log(res))
        //                                                   .catch(err => console.log(err))
        //  this.realtimeDb.database.ref('db').child("solvingRanking").set(res.solvingRanking)
        //  .then(q => console.log(res))
        //  .catch(err => console.log(err))
      
      }, err => console.log(err))
    })
 
  }
  updatePerms() {


    this.userService.user.subscribe(async data => {

      let permsArr = await this.http.get("assets/perms.json").toPromise()

      let perms = []

      for (let index = 0; index < permsArr[1].length; index++) {
        const element = permsArr[1][index];

        perms.push(element.perm)

      }

      this.firestore.collection("users").doc(data.id).update({ perms: perms }).then()


    })


  }
  sendEmail() {

  
    //  this.functions.useEmulator("192.168.1.127" , 8010).then(() => {

      let fn = this.functions.httpsCallable("sendEmail")

      let data:EmailParams = {
        
     
        toName: "Furki Boi",
        toMail: 'frknerstr@gmail.com',
        subject: "Hoşgeldiniz",
        data: {
          userMail:"umutcem.kurt@gmail.com",
          password: "5PxWYto",
          code:"123"
        },
        pattern: EmaiPatterns.CorporateTeacherWelcome
      }
      fn(data).subscribe(res => {
        let a = res
        console.log("gonderdim")
        console.log(res)
      },err => {
        debugger
        console.log("HATA")
        console.log(err)
      })
      

    // })



  }

 async realTimeAdd(){

    
  this.firestore.collection('players')

    //console.log(qq.sort((a,b ) => a.rankings.Visual - b.rankings.Visual))
  //this.firestore.collection('players').ref.orderBy("rankings.Visual" , "asc").limit(50).get().then(res => console.log(res.docs.map(t => t.data())))
  }

  deletePlayer(){
    
    
      this.functions.useEmulator("192.168.1.134" , 8010).then(() => {

        this.functions.httpsCallable("deletePlayer")(
          {playerID : 'Qw39TLioRBqQe7WRTfsT'}
        ).subscribe(res => {


          if (res.error) {
            console.log(res)
          }else{
            console.log("OK")

          }



        },err => console.log(err))


      })
    
    
    // this.firestore.collection("players").ref.where("displayName" , "==" , "Eras").get().then(res => {

    //   for(let player of res.docs){

    //     player.ref.delete().then()


    //   }

    // })
  }

  qqtest(){
  //  Visual, Logic, Verbal, Harmonic, Kinesthetic, Analytical, Creative, Adaptive, Lateral, LearningBased, GeneralRanking
    
  //  this.firestore.collection("players").ref.where("rankings.GeneralRanking_Grade" , "==" , 4).orderBy("rankings.GeneralRanking").limit(50).get().then(res => console.log(res.docs.map(t => t.data()).sort((a:any,b:any) => a.rankings.Visual - b.rankings.Visual )))


  this.firestore.collection("codes").ref.where("active" , "==" , 0).get().then(async res => {

    var batch = this.firestore.firestore.batch()
    //batch.set(ref , data)
    let promises: Promise<any>[] = []
    let counter = 0;
    let totalCounter = 0;
    res
    for (let doc of res.docs) {
      counter++;
   

      let ref = this.firestore.collection("codes").doc(doc.id).ref

      batch.delete(ref)
      if (counter >= 500) {
        console.log(`Committing batch of ${counter}`);
        promises.push(batch.commit());
        totalCounter += counter;
        counter = 0;
        batch = this.firestore.firestore.batch();
      }
    }
    if (counter) {
      console.log(`Committing batch of ${counter}`);
      promises.push(batch.commit());
      totalCounter += counter;
    }
    try {

      await Promise.all(promises);
    } catch (error) {
      console.log("----------hata---------")
      console.log(error)
    }

  })

  }

  addSchool() {
    this.firestore.collection("schools").add({
      address: "adnan kahveci mahallesi cambasi sokkak yesilkent 1 beylikduzu istanbul",
      displayName: "ekmal",
      formalName: "emlak konut mimarsinan anadolu listesi",
      imgUrl: "",
      invoiceIdList: [],
      playerQuata: 40,
      taxNumber: "123456789",
      taxOffice: 'Beylikduzu'
    }).then(r => { console.log(r.id) })
  }


  addClassroom() {
    this.firestore.collection("classrooms").add({
      advisorId: "Fgda3Cg60pQ3pgbBeoZjwcbTi743",
      schoolId: "ZUSrAlf4JgoPQvTGmFj3",
      students: [
        "2zLK420KJ4WTRjCfXRzIcgGFJ7C2",
        "6cCFnCv9luUNNForMqGmljJi8VE3",
        "SXMetNr80RN1WqTGzxtmn1byuWy1"
      ]

    }).then(r => { console.log(r.id) })
  }

  loader() {
    this.loaderService.loading$.next(true)
  }
  generateCode() {

    this.functions.httpsCallable("generateCode")(1).subscribe(code => console.log(code))

    // this.functions.useEmulator("192.168.1.6" , 8010).then(() => {


    // this.functions.httpsCallable("generateCode")(1).subscribe(code => console.log(code))


    // })
  }



  loadConversation() {

    this.firestore.collection("tickets").doc("Eeu8T8pcJuwcT0Caisf9").update({
      conversation: [
        {
          id: this.firestore.createId(),
          senderId: "Fgda3Cg60pQ3pgbBeoZjwcbTi743",
          adminId: "",
          message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit." +
            " Consequuntur quisquam fugiat voluptatum, non optio sit veniam exercitationem " +
            " omnis quod numquam iusto deleniti id. Quasi quas quaerat placeat, natus quae deleniti?",
          created: Timestamp.now()
        },
        {
          id: this.firestore.createId(),
          senderId: "",
          adminId: "123",
          message: "merhabalar.",
          created: Timestamp.now()
        },
        {
          id: this.firestore.createId(),
          senderId: "",
          adminId: "123",
          message: "Test ilgileniyoruz.",
          created: Timestamp.now()
        },
        {
          id: this.firestore.createId(),
          senderId: "",
          adminId: "123",
          message: "son mesaj.",
          created: Timestamp.now()
        }
      ]
    })
  }
  async calendar() {
    let data: any = [
      { calendarID: '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc', playerID: "FuOxwGE9fIWd6sZohPvj", schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Gölgelerin Gücü Adına', description: '', startDate: '2022-01-31T06:00:00.000Z', endDate: '2022-02-01T11:00:00.000Z', allDay: true, recurrenceRule: '' },
      { calendarID: '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc', playerID: "FuOxwGE9fIWd6sZohPvj", schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: '500 Puan Topla', description: '', startDate: '2022-01-10T15:00:00.000Z', endDate: '2022-01-10T17:00:00.000Z', allDay: true, recurrenceRule: '' },
      { calendarID: '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc', playerID: "C3CfigUalpa8Fz3MLHEz", schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'İşitsel Tarzda 250 Puan Topla', description: '', startDate: '2022-01-21T09:00:00.000Z', endDate: '2022-01-21T11:00:00.000Z', allDay: true, recurrenceRule: '' },
      { calendarID: '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc', playerID: "C3CfigUalpa8Fz3MLHEz", schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Aritmatiğini Geliştir', description: '', startDate: '2022-01-07T21:00:00.000Z', endDate: '2022-01-07T21:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=YEARLY;INTERVAL=1' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Öğretmenler Günü', description: 'Öğretmenler günü olduğu için bugun tatil !', startDate: '2022-01-04T07:00:00.000Z', endDate: '2022-01-04T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=MONTHLY;INTERVAL=2;BYDAY=1TU' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Öğretmenler Günü', description: 'Öğretmenler günü olduğu için bugun tatil !', startDate: '2022-03-01T07:00:00.000Z', endDate: '2022-03-01T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=MONTHLY;INTERVAL=2;BYDAY=1TU' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-01-08T10:00:00.000Z', endDate: '2022-01-08T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-01-22T10:00:00.000Z', endDate: '2022-01-22T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-02-05T10:00:00.000Z', endDate: '2022-02-05T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-02-19T10:00:00.000Z', endDate: '2022-02-19T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-03-05T10:00:00.000Z', endDate: '2022-03-05T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-03-19T10:00:00.000Z', endDate: '2022-03-19T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '09887870-f85a-40eb-8171-1b13d7a7f529', playerID: null, schoolID: null, text: 'Hafta Sonu', description: 'İyi haftasonları', startDate: '2022-04-02T10:00:00.000Z', endDate: '2022-04-02T12:00:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SA' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: null, text: 'Spor Etkinliği', description: 'Katılım ücreti 50 Türk Lirasıdır', startDate: '2022-01-19T12:00:00.000Z', endDate: '2022-01-19T14:30:00.000Z', allDay: true, recurrenceRule: '' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: null, text: 'Edebiyat Dinletisi', description: 'Francis Bacon  nin denemeler isimli eserini dinliyoruz ', startDate: '2022-01-08T08:30:00.000Z', endDate: '2022-01-08T09:45:00.000Z', allDay: true, recurrenceRule: '' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-01-07T06:00:00.000Z', endDate: '2022-01-07T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-01-21T06:00:00.000Z', endDate: '2022-01-21T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-02-04T06:00:00.000Z', endDate: '2022-02-04T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-02-18T06:00:00.000Z', endDate: '2022-02-18T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-03-04T06:00:00.000Z', endDate: '2022-03-04T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-03-18T06:00:00.000Z', endDate: '2022-03-18T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' },
      { calendarID: '5dab5f7b-757a-4467-ace1-305fe07b11fe', playerID: null, schoolID: "ZUSrAlf4JgoPQvTGmFj3", text: 'Öğretmenler Toplantısı', description: '', startDate: '2022-04-01T06:00:00.000Z', endDate: '2022-04-01T08:30:00.000Z', allDay: true, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR' }


    ]
    var batch = this.firestore.firestore.batch()
    //batch.set(ref , data)
    let promises: Promise<any>[] = []
    let counter = 0;
    let totalCounter = 0;
    for (let thing of data) {
      counter++;
      let id = this.firestore.createId()
      thing = {
        id: id,
        ...thing
      }
      debugger
      thing.start = new Date(thing.startDate)
      thing.end = new Date(thing.endDate)

      let ref = this.firestore.collection("calendarEvents").doc(id).ref

      batch.set(ref, thing);
      if (counter >= 500) {
        console.log(`Committing batch of ${counter}`);
        promises.push(batch.commit());
        totalCounter += counter;
        counter = 0;
        batch = this.firestore.firestore.batch();
      }
    }
    if (counter) {
      console.log(`Committing batch of ${counter}`);
      promises.push(batch.commit());
      totalCounter += counter;
    }
    try {

      await Promise.all(promises);
    } catch (error) {
      console.log("----------hata---------")
      console.log(error)
    }
    console.log(`Committed total of ${totalCounter}`);
    //await Promise.all(promises)
  }
}
