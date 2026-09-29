import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartPasteButtonComponent } from './smartpastebutton.component';

const SMARTPASTEBUTTON_DIRECTIVES = [
    SmartPasteButtonComponent
];

/**
 * NgModule definition for the SmartPasteButton component.
 * Re-exports standalone SmartPasteButton component and directives so existing apps can keep using:
 * `imports: [SmartPasteButtonModule]`
 */
@NgModule({
    imports: [CommonModule, ...SMARTPASTEBUTTON_DIRECTIVES],
    exports: [...SMARTPASTEBUTTON_DIRECTIVES]
})
export class SmartPasteButtonModule { }