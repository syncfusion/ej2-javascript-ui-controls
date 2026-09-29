import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multiselect.component';

const MULTISELECT_DIRECTIVES = [
    MultiSelectComponent
];

/**
 * NgModule definition for the MultiSelect component.
 * Re-exports standalone MultiSelect component and directives so existing apps can keep using:
 * `imports: [MultiSelectModule]`
 */
@NgModule({
    imports: [CommonModule, ...MULTISELECT_DIRECTIVES],
    exports: [...MULTISELECT_DIRECTIVES]
})
export class MultiSelectModule { }