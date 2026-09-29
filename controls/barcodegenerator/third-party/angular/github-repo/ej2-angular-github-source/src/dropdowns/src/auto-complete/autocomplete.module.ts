import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './autocomplete.component';

const AUTOCOMPLETE_DIRECTIVES = [
    AutoCompleteComponent
];

/**
 * NgModule definition for the AutoComplete component.
 * Re-exports standalone AutoComplete component and directives so existing apps can keep using:
 * `imports: [AutoCompleteModule]`
 */
@NgModule({
    imports: [CommonModule, ...AUTOCOMPLETE_DIRECTIVES],
    exports: [...AUTOCOMPLETE_DIRECTIVES]
})
export class AutoCompleteModule { }