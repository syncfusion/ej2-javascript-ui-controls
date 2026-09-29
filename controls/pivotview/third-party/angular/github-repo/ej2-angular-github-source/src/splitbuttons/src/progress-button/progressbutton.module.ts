import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressButtonComponent } from './progressbutton.component';

const PROGRESSBUTTON_DIRECTIVES = [
    ProgressButtonComponent
];

/**
 * NgModule definition for the ProgressButton component.
 * Re-exports standalone ProgressButton component and directives so existing apps can keep using:
 * `imports: [ProgressButtonModule]`
 */
@NgModule({
    imports: [CommonModule, ...PROGRESSBUTTON_DIRECTIVES],
    exports: [...PROGRESSBUTTON_DIRECTIVES]
})
export class ProgressButtonModule { }