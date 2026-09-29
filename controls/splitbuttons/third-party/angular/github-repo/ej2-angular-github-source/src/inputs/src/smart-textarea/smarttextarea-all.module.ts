import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTextAreaComponent } from './smarttextarea.component';
import { SmartTextAreaModule } from './smarttextarea.module';





/**
 * NgModule definition for the SmartTextArea component with providers.
 */
@NgModule({
    imports: [CommonModule, SmartTextAreaModule],
    exports: [
        SmartTextAreaModule
    ],
    providers:[
        
    ]
})
export class SmartTextAreaAllModule { }