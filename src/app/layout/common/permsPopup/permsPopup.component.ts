import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LovService } from 'app/core/Utils/lov.service';

@Component({
  selector: 'app-permsPopup',
  templateUrl: './permsPopup.component.html',
  styleUrls: ['./permsPopup.component.scss']
})
export class PermsPopupComponent implements OnInit {

  
perms
userPerms

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private  _matDialogRef: MatDialogRef<PermsPopupComponent>,
    private lovService:LovService
  ) { 
   
  }

  ngOnInit() {
    this.lovService.getPerms().subscribe(data => this.perms = data[1])
    this.lovService.getStaffPerms(this.data.staffId).then(res => {
      this.userPerms = res.docs.map(t => t.get('perms'))[0]
      console.log(this.userPerms)
    })
  }
  test(e){
    console.log(e)
  }
  close(){
    this._matDialogRef.close()
  }
}
