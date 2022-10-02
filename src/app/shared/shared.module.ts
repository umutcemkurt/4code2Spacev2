import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PermittedDirective } from 'app/core/Utils/Directives/Permitted.directive';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { SafeHTMLPipe } from 'app/core/Utils/Pipes/SafeHTML.pipe';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule ,
        TranslocoCoreModule,
        
        
    ],
    declarations:[
        PermittedDirective,
        SafeHTMLPipe
   
    ],

    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        PermittedDirective,
        TranslocoCoreModule,
        SafeHTMLPipe
      
       
    ]
})
export class SharedModule
{
}
