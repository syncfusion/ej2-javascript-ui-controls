import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckBoxComponent } from './checkbox.component';
import { CheckBoxModule } from './checkbox.module';





/**
 * NgModule definition for the CheckBox component with providers.
 */
@NgModule({
    imports: [CommonModule, CheckBoxModule],
    exports: [
        CheckBoxModule
    ],
    providers:[
        
    ]
})
export class CheckBoxAllModule { }