import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-FB-Paginator',
  templateUrl: './FB-Paginator.component.html',
  //  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./FB-Paginator.component.scss']
})
export class FBPaginatorComponent implements OnInit, AfterViewInit {

  @Input("dataSource")

  public set dataList(v: any[]) {
    this.pageSizeOptions = [20, 50, 100]
    this._datalist = v;
  }


  @Output("data") data = new EventEmitter()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

  length = 0
  _datalist: any[]
  pageSizeOptions
  pageSize

  public query
  public collection = new Subject()

  private _query: firebase.default.firestore.Query<unknown>
  private _collection: string



  public response = new BehaviorSubject(new Array<DocumentChangeAction<unknown>>())

  public orderKey = ""
  public collectionId = ""
  // save first document in snapshot of items received
  private firstInResponse: any = [];

  // save last document in snapshot of items received
  private lastInResponse: any = [];

  // keep the array of first document of previous pages
  private prev_strt_at: any = [];

  // maintain the count of clicks on Next Prev button
  private pagination_clicked_count = 0;

  // two buttons will be needed by which next data or prev data will be loaded
  // disable next and prev buttons
  private disable_next: boolean = false;
  private disable_prev: boolean = true;




  constructor(
    private db: AngularFirestore,
  ) {

  }
  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.initPaginator()

  }

  onPageChange(e) {
    // //console.log(e )
    if (e.previousPageIndex > e.pageIndex) {
      this.prevPage()
    } else {
      this.nextPage()
    }
  }
  private push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
  }
  // remove non required document 
  private pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach(element => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }
  // return the Doc rem where previous page will startAt
  private get_prev_startAt() {
    if (this.prev_strt_at.length > (this.pagination_clicked_count + 1)) {
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    }
    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }

  private nextPage() {
    this.disable_next = true;
    let q = this._datalist[this._datalist.length - 1]
    debugger
    this.db.collection(this._collection).ref.orderBy("id").startAfter(this._datalist[this._datalist.length - 1].id).limit(20)
      .get()
      .then(response => {
        debugger
        if (!response.docs.length) {
          //console.log("No More Data Available");
          this.disable_next = true;
          return;
        }
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];

        let data = response.docs.map(t => t.data())
        this.data.emit(data)

        this.pagination_clicked_count++;
        this.push_prev_startAt(this.firstInResponse);
        if (response.docs.length < 5) {
          // disable next button if data fetched is less than 5 - means no more data left to load
          // because limit ti get data is set to 5
          this.disable_next = true;
        } else {
          this.disable_next = false;
        }
        this.disable_prev = false;
      }, error => {
        this.disable_next = false;
      });
  }
  private prevPage() {
    this.disable_prev = true;
    this.db.collection(this._collection).ref.orderBy("id").endBefore(this._datalist[0].id).limit(20)
      .get()
      .then(response => {
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];



        let data = response.docs.map(t => t.data())
        this.data.emit(data)


        // maintaing page no.
        this.pagination_clicked_count--;

        // pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);

        // enable buttons again
        if (this.pagination_clicked_count == 0) {
          this.disable_prev = true;
        } else {
          this.disable_prev = false;
        }
        this.disable_next = false;
      }, error => {
        this.disable_prev = false;
      });
  }


  initPaginator() {



    this.collection.subscribe((collection: string) => {

      this._collection = collection

      this.db.collection("shards").doc(this._collection).valueChanges().subscribe((res: any) => {
        this.length = res.count
        console.log(res.count)

      })

    })
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = start < this.length ? Math.min(start + pageSize, this.length) : start + pageSize;
      return `${start} - ${end} / ${this.length}`;
    }

    this.response.subscribe(res => {
      if (res.length != 0) {
        this.dataList
        //    debugger
        this.db.firestore

        //  this.db.collection(this.collectionId).ref.where().get().


        this.firstInResponse = res[0].payload.doc;
        this.lastInResponse = res[res.length - 1].payload.doc;
        // initialize values
        this.prev_strt_at = [];
        this.pagination_clicked_count = 0;
        this.disable_next = false;
        this.disable_prev = false;

        //  push first item to use for Previous action
        this.push_prev_startAt(this.firstInResponse);
      }
    })

  }


  /*
 
 
 zeka turu - denge  5 eksen radar
 cozumleme - denge  5 eksen radar
 gelisim 12 ay cizgi line - area - rounded
 basari gelisim 12 ay cizgi line - area - rounded
 basari 5 ekse column 
 basari karsilastirma 5 eksen 2 deger column
 devamsizlik donem donem heatmap
 
  merhabalar biz bi grup oyun geliştirici öğrencileriz oyunu teslim zamanımız yakınlaştı ve stres içindeyiz
  rica etsek stresimizi alacak bir şeylerde koyar mısınız böylece bu çalışkan öğrenci kardeşlerinizi sevindirmiş olursunuz
 
  */

}
