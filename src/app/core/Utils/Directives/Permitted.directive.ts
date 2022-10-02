import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { UserService } from 'app/core/user/user.service';
import DevExpress from 'devextreme';
import { DxiColumnComponent } from 'devextreme-angular/ui/nested';
import { DxiDataGridColumn } from 'devextreme-angular/ui/nested/base/data-grid-column-dxi';


@Directive({
  selector: '[permitted]'
})
export class PermittedDirective implements OnInit {

  @Input("perm") perm: string
 @HostBinding("[disabled]") disabled :boolean = false


  userPerms: string[]
  pageCode
  permCode
  parent

  constructor(
    private userService: UserService,
    private el: ElementRef,
    private renderer: Renderer2,
    private _viewContainer: ViewContainerRef

  ) {

  }

  ngOnInit() {
  
  
  }
  ngAfterViewInit(){
    //debugger
    this.parent = this.renderer.parentNode(this.el.nativeElement)
    this.userService.user.subscribe(user => {
      if (!user) {
        return
      }
      this.userPerms = user.perms

      const permArr = this.perm.split("-")
      this.pageCode = permArr[0]
      this.permCode = permArr[1]

      switch (this.pageCode) {
        case 'CLA':

          this.classPerm(this.permCode)

          break;
          case 'NTF':
            this.notificationPerms(this.permCode)

          case 'SUP':
            this.supportPerms(this.permCode)
          break;
          case 'ADM':
            this.managementPerms(this.permCode)
            break;
            case 'HMT' :
              this.homeworkManagementPerms(this.permCode)

            break;
            case "SEC":
              this.selectionPerm(this.permCode)
              break

      }



    })
  }

  selectionPerm(perm){
    //debugger
    switch (perm) {
      case "100":
        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }
        break;
    
      case "200":
        if (this.userPerms.includes("SEC-100")) {
          (this.el.nativeElement as HTMLElement).remove()
        }
      break;
    }
  }

  classPerm(perm) {

    switch (perm) {
      case "002":

        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }


        break;
      case "003":
       // debugger
        // //console.log(this.el.nativeElement)
      
        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }

      //  this.disabled = false

        
        break;
      case "004":
        // //console.log(this.el.nativeElement)
        (this.el.nativeElement as HTMLElement).remove()
      // this.disabled = false
        break;
      default:
        break;
    }



  }

  notificationPerms(perm){
    switch (perm) {
      case "001":

    //  debugger
        if(!this.checkPerm(perm)){

          (this.el.nativeElement as HTMLElement).remove()
        }
       
        break;
    
      default:
        break;
    }
  }


  supportPerms(perm){
    switch (perm) {
      case '100':
        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }
        break;
        case '200':
          if (!this.checkPerm(perm)) {
            (this.el.nativeElement as HTMLElement).remove()
          }
          break;
    
      default:
        break;
    }
  }

  managementPerms(perm){
    switch (perm) {
      case '301':
        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }
        break;
    
      case '302' :
        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }
        break;
        case '308':
          if (!this.checkPerm(perm)) {
            (this.el.nativeElement as HTMLElement).remove()
          }
    }
  }

  homeworkManagementPerms(perm){
    switch (perm) {
      case '001':
        if (!this.checkPerm(perm)) {
          (this.el.nativeElement as HTMLElement).remove()
        }
        break;
    
      default:
        break;
    }
  }


  private checkPerm(perm): boolean {
    return this.userPerms.includes(this.pageCode + '-' + perm)
  }
  

  private disableButton(){
    this.disabled = true
    this.el.nativeElement.classList.add('mat-button-disabled')
    this.renderer.setProperty(this.el.nativeElement , 'disabled',true)
  }

}
