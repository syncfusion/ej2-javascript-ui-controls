import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumericTextBoxComponent } from './numerictextbox.component';
import { NumericTextBoxModule } from './numerictextbox.module';





/**
 * NgModule definition for the NumericTextBox component with providers.
 */
@NgModule({
    imports: [CommonModule, NumericTextBoxModule],
    exports: [
        NumericTextBoxModule
    ],
    providers:[
        
    ]
})
export class NumericTextBoxAllModule { }