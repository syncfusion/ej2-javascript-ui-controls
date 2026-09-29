import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './autocomplete.component';
import { AutoCompleteModule } from './autocomplete.module';





/**
 * NgModule definition for the AutoComplete component with providers.
 */
@NgModule({
    imports: [CommonModule, AutoCompleteModule],
    exports: [
        AutoCompleteModule
    ],
    providers:[
        
    ]
})
export class AutoCompleteAllModule { }