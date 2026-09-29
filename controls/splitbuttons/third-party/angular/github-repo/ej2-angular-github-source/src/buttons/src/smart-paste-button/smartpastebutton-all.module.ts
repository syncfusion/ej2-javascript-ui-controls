import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartPasteButtonComponent } from './smartpastebutton.component';
import { SmartPasteButtonModule } from './smartpastebutton.module';





/**
 * NgModule definition for the SmartPasteButton component with providers.
 */
@NgModule({
    imports: [CommonModule, SmartPasteButtonModule],
    exports: [
        SmartPasteButtonModule
    ],
    providers:[
        
    ]
})
export class SmartPasteButtonAllModule { }