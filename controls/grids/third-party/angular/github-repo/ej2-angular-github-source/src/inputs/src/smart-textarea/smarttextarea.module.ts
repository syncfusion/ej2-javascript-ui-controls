import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTextAreaComponent } from './smarttextarea.component';

const SMARTTEXTAREA_DIRECTIVES = [
    SmartTextAreaComponent
];

/**
 * NgModule definition for the SmartTextArea component.
 * Re-exports standalone SmartTextArea component and directives so existing apps can keep using:
 * `imports: [SmartTextAreaModule]`
 */
@NgModule({
    imports: [CommonModule, ...SMARTTEXTAREA_DIRECTIVES],
    exports: [...SMARTTEXTAREA_DIRECTIVES]
})
export class SmartTextAreaModule { }