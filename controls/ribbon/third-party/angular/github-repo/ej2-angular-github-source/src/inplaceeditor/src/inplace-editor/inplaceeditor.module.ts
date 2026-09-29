import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InPlaceEditorComponent } from './inplaceeditor.component';

const INPLACEEDITOR_DIRECTIVES = [
    InPlaceEditorComponent
];

/**
 * NgModule definition for the InPlaceEditor component.
 * Re-exports standalone InPlaceEditor component and directives so existing apps can keep using:
 * `imports: [InPlaceEditorModule]`
 */
@NgModule({
    imports: [CommonModule, ...INPLACEEDITOR_DIRECTIVES],
    exports: [...INPLACEEDITOR_DIRECTIVES]
})
export class InPlaceEditorModule { }