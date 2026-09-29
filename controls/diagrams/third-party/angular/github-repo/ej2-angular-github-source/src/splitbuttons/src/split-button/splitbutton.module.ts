import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitButtonItemDirective, SplitButtonItemsDirective } from './items.directive';
import { SplitButtonComponent } from './splitbutton.component';

const SPLITBUTTON_DIRECTIVES = [
    SplitButtonComponent,
        SplitButtonItemDirective,
        SplitButtonItemsDirective
];

/**
 * NgModule definition for the SplitButton component.
 * Re-exports standalone SplitButton component and directives so existing apps can keep using:
 * `imports: [SplitButtonModule]`
 */
@NgModule({
    imports: [CommonModule, ...SPLITBUTTON_DIRECTIVES],
    exports: [...SPLITBUTTON_DIRECTIVES]
})
export class SplitButtonModule { }