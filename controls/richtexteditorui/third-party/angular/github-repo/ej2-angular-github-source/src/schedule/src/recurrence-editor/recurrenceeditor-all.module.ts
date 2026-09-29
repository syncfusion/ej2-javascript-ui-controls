import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurrenceEditorComponent } from './recurrenceeditor.component';
import { RecurrenceEditorModule } from './recurrenceeditor.module';





/**
 * NgModule definition for the RecurrenceEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, RecurrenceEditorModule],
    exports: [
        RecurrenceEditorModule
    ],
    providers:[
        
    ]
})
export class RecurrenceEditorAllModule { }