import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  userForm:FormGroup
  showChangePassword = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _matDialogRef: MatDialogRef<SettingsComponent>,
    private formbuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private auth:AngularFireAuth
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.buildForm(this.data.user)

    this.auth.currentUser.then(res => {
      if (res.providerData.length == 1) {
        for (let index = 0; index < res.providerData.length; index++) {
          const element = res.providerData[index];
          if (element.providerId == "password" || element.providerId.toLocaleLowerCase() =="firebase") {
            this.showChangePassword = true
          }
          
        }
      }
    })

  }

  buildForm(data?){
    data = data || {}

  this.userForm =   this.formbuilder.group({
      fullName:[data.fullName ],
      password: ["" , [Validators.required  , Validators.minLength(6)]],
      confirmPassword: ["" , [Validators.required]]
    },
    {
      validators: FuseValidators.mustMatch("password" , "confirmPassword")
  })
  }

  test(e){
    console.log(e)
  }

  save(){

    let data = this.userForm.value
    this.authService.resetPassword(data.password).then(res => {
      this.authService.signOut().subscribe(() => {
          notify("Kaydedildi" , 'success')
          setTimeout(() => {
            this.close()
            this.router.navigate(['/sign-out']).then(() => notify("Yeniden giriş yapmanız gerekmektedir"));
            
          }, 1 * 1000);


        })
    }).catch(err => console.log(err))

  }


  close(){
    this._matDialogRef.close()
  }


}
