import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radiobutton.component';
import { RadioButtonModule } from './radiobutton.module';





/**
 * NgModule definition for the RadioButton component with providers.
 */
@NgModule({
    imports: [CommonModule, RadioButtonModule],
    exports: [
        RadioButtonModule
    ],
    providers:[
        
    ]
})
export class RadioButtonAllModule { }