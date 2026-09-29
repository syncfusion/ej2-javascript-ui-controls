import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBoxComponent } from './textbox.component';
import { TextBoxModule } from './textbox.module';





/**
 * NgModule definition for the TextBox component with providers.
 */
@NgModule({
    imports: [CommonModule, TextBoxModule],
    exports: [
        TextBoxModule
    ],
    providers:[
        
    ]
})
export class TextBoxAllModule { }