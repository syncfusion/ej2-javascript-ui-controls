import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskedTextBoxComponent } from './maskedtextbox.component';
import { MaskedTextBoxModule } from './maskedtextbox.module';





/**
 * NgModule definition for the MaskedTextBox component with providers.
 */
@NgModule({
    imports: [CommonModule, MaskedTextBoxModule],
    exports: [
        MaskedTextBoxModule
    ],
    providers:[
        
    ]
})
export class MaskedTextBoxAllModule { }