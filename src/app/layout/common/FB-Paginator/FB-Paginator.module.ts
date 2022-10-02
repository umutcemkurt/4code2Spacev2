import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FBPaginatorComponent } from './FB-Paginator.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    SharedModule,
    MatPaginatorModule
  ],
  declarations: [FBPaginatorComponent],
  exports : [FBPaginatorComponent]
})
export class FBPaginatorModule { }
