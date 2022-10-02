import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';
import { Route, RouterModule } from '@angular/router';
import { TestComponentComponent } from './testComponent/testComponent.component';
import {  DxDataGridModule, DxSchedulerModule } from 'devextreme-angular';
import { FBPaginatorModule } from 'app/layout/common/FB-Paginator/FB-Paginator.module';
import { GraphGeneratorModule } from 'app/layout/common/graphGenerator/graphGenerator.module';
import { MatButtonModule } from '@angular/material/button';

const exampleRoutes: Route[] = [
  {
      path     : '',
      component: TestComponent
  },
  {
    path     : 'component-test',
    component: TestComponentComponent
}
];

const    firebaseConfig = {
  apiKey: "AIzaSyAtX1KmO10iF6eXW14i_XCg-pTtymHiNfM",
  authDomain: "ritimus-2.firebaseapp.com",
  projectId: "ritimus-2",
  storageBucket: "ritimus-2.appspot.com",
  messagingSenderId: "266710559210",
  appId: "1:266710559210:web:903aa12342af1282276a93",
  measurementId: "G-RKF3SZCG37"
};

@NgModule({
  imports: [
    RouterModule.forChild(exampleRoutes),
    DxDataGridModule,
    FBPaginatorModule,
    GraphGeneratorModule,
    DxSchedulerModule,
    MatButtonModule
    

  ],
  declarations: [
    TestComponent,
    TestComponentComponent
  ]
})
export class TestModule { }
