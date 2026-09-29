import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './pager.component';
import { PagerModule } from './pager.module';





/**
 * NgModule definition for the Pager component with providers.
 */
@NgModule({
    imports: [CommonModule, PagerModule],
    exports: [
        PagerModule
    ],
    providers:[
        
    ]
})
export class PagerAllModule { }