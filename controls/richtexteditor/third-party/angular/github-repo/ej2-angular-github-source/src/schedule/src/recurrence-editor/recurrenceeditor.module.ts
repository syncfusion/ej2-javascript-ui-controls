import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurrenceEditorComponent } from './recurrenceeditor.component';

const RECURRENCEEDITOR_DIRECTIVES = [
    RecurrenceEditorComponent
];

/**
 * NgModule definition for the RecurrenceEditor component.
 * Re-exports standalone RecurrenceEditor component and directives so existing apps can keep using:
 * `imports: [RecurrenceEditorModule]`
 */
@NgModule({
    imports: [CommonModule, ...RECURRENCEEDITOR_DIRECTIVES],
    exports: [...RECURRENCEEDITOR_DIRECTIVES]
})
export class RecurrenceEditorModule { }