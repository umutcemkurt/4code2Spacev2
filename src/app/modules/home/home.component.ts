import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { DataEngineService } from 'app/core/dataEngine/dataEngine.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  allFeeds = []
  mostRecentFeed = []

  constructor(
    private dataEngine: DataEngineService,
   
  ) { }

  ngOnInit() {
    this.dataEngine.get().subscribe((data) => {
      this.allFeeds = data
   
    } )

    this.dataEngine.getMostRecentFeed().subscribe((data) => {
      this.mostRecentFeed = data
      console.log('home', data)
    }
    )
  }

 
  saveBookmark(feed) {
    
  }


 



}
