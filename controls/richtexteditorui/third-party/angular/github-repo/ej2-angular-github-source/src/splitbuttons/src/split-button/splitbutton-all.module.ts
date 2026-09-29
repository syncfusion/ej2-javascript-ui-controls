import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonItemDirective, SplitButtonItemsDirective } from './items.directive';
import { SplitButtonComponent } from './splitbutton.component';
import { SplitButtonModule } from './splitbutton.module';





/**
 * NgModule definition for the SplitButton component with providers.
 */
@NgModule({
    imports: [CommonModule, SplitButtonModule],
    exports: [
        SplitButtonModule
    ],
    providers:[
        
    ]
})
export class SplitButtonAllModule { }