import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressButtonComponent } from './progressbutton.component';
import { ProgressButtonModule } from './progressbutton.module';





/**
 * NgModule definition for the ProgressButton component with providers.
 */
@NgModule({
    imports: [CommonModule, ProgressButtonModule],
    exports: [
        ProgressButtonModule
    ],
    providers:[
        
    ]
})
export class ProgressButtonAllModule { }