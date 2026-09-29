import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogButtonDirective, ButtonsDirective } from './buttons.directive';
import { DialogComponent } from './dialog.component';

const DIALOG_DIRECTIVES = [
    DialogComponent,
        DialogButtonDirective,
        ButtonsDirective
];

/**
 * NgModule definition for the Dialog component.
 * Re-exports standalone Dialog component and directives so existing apps can keep using:
 * `imports: [DialogModule]`
 */
@NgModule({
    imports: [CommonModule, ...DIALOG_DIRECTIVES],
    exports: [...DIALOG_DIRECTIVES]
})
export class DialogModule { }