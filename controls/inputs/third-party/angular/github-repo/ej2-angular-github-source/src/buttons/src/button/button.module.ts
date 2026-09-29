import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

const BUTTON_DIRECTIVES = [
    ButtonComponent
];

/**
 * NgModule definition for the Button component.
 * Re-exports standalone Button component and directives so existing apps can keep using:
 * `imports: [ButtonModule]`
 */
@NgModule({
    imports: [CommonModule, ...BUTTON_DIRECTIVES],
    exports: [...BUTTON_DIRECTIVES]
})
export class ButtonModule { }