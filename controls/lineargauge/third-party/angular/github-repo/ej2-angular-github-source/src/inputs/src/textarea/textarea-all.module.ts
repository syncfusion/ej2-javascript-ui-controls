import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAreaComponent } from './textarea.component';
import { TextAreaModule } from './textarea.module';





/**
 * NgModule definition for the TextArea component with providers.
 */
@NgModule({
    imports: [CommonModule, TextAreaModule],
    exports: [
        TextAreaModule
    ],
    providers:[
        
    ]
})
export class TextAreaAllModule { }