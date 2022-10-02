import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChild, CanLoad, RouterStateSnapshot, Route, UrlSegment, UrlTree, CanActivate, Router } from "@angular/router";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { NavigationService } from "app/core/navigation/navigation.service";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { concat, observable, Observable, of } from "rxjs";
import { concatMap, map, switchMap, take } from "rxjs/operators";



@Injectable({
    providedIn: 'root'
})
export class PermGuard implements CanActivate, CanLoad {


    navigations: FuseNavigationItem[] = []
    // user: User
    constructor(
        private userService: UserService,
        private navigationService: NavigationService,
        private _router: Router
    ) {
        // this.userService.user.subscribe(data => this.user = data)
    }
    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const x = "/"
        return this._router.navigate(['sign-in'], { queryParams: { x } });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {


        let result = false
        //  debugger

        let promise: Promise<boolean | UrlTree> = new Promise<boolean | UrlTree>(async (resolve, reject) => {

         this.userService.user.pipe(
                map(async user => {
                  //  debugger

                  try {
                    this.navigations = (await this.navigationService.get().toPromise()).default

                    const perms = user?.perms
                    this.navigations.forEach(x => {
                        // debugger
                        if (route.data?.pageId == x.id) {
                            result = perms.includes(route.data.permName)
                        } else if (x.children) {
                            //   debugger

                            //   const childPerm = x.children.find(route.data.pageId)
                            result = perms.includes(route.data.permName)
                            let a = 3
                        }

                    })
                  } catch (error) {
                    
                  }

                

                    if (!result) this.navigate("/")

                    resolve(result)
                })
            ).toPromise()




        })



        return promise
    }

    navigate(url) {
        this._router.navigate(['/'], { queryParams: { url } });
    }







}
