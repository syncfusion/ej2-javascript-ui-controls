import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModelPropDirective, ButtonModelPropsDirective } from './buttons.directive';
import { ToastComponent } from './toast.component';

const TOAST_DIRECTIVES = [
    ToastComponent,
        ButtonModelPropDirective,
        ButtonModelPropsDirective
];

/**
 * NgModule definition for the Toast component.
 * Re-exports standalone Toast component and directives so existing apps can keep using:
 * `imports: [ToastModule]`
 */
@NgModule({
    imports: [CommonModule, ...TOAST_DIRECTIVES],
    exports: [...TOAST_DIRECTIVES]
})
export class ToastModule { }