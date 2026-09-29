import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBoxComponent } from './listbox.component';
import { ListBoxModule } from './listbox.module';





/**
 * NgModule definition for the ListBox component with providers.
 */
@NgModule({
    imports: [CommonModule, ListBoxModule],
    exports: [
        ListBoxModule
    ],
    providers:[
        
    ]
})
export class ListBoxAllModule { }