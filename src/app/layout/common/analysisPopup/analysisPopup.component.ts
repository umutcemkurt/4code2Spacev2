import {   Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { random } from 'app/core/Utils/Utilties';

@Component({
  selector: 'app-analysisPopup',
  templateUrl: './analysisPopup.component.html',
  styleUrls: ['./analysisPopup.component.scss'],


})
export class AnalysisPopupComponent implements OnInit {


  charts 
  intelligentData
  compareAnalyticData
  analyticData

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private  _matDialogRef: MatDialogRef<AnalysisPopupComponent>,
  ) { 
    this.charts = this.data
    this._matDialogRef._containerInstance._config.autoFocus = false
  }


  ngOnInit() {
    let _data = []
    this.analyticData = this.data.data
    debugger
    
    for (let index   = 0; index  < 5; index ++) {
      
      _data.push( random(10 , 100) )
      
    }

    this.intelligentData = [ {
      name:"Değer",
      data: _data
    }
    ]
  }
  test(e){
    console.log(e)
  }
  close(){
    this._matDialogRef.close()
  }
}
