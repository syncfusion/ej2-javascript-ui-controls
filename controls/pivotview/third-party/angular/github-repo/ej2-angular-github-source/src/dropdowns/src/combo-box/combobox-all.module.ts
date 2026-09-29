import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboBoxComponent } from './combobox.component';
import { ComboBoxModule } from './combobox.module';





/**
 * NgModule definition for the ComboBox component with providers.
 */
@NgModule({
    imports: [CommonModule, ComboBoxModule],
    exports: [
        ComboBoxModule
    ],
    providers:[
        
    ]
})
export class ComboBoxAllModule { }