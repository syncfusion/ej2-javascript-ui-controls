import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListComponent } from './dropdownlist.component';

const DROPDOWNLIST_DIRECTIVES = [
    DropDownListComponent
];

/**
 * NgModule definition for the DropDownList component.
 * Re-exports standalone DropDownList component and directives so existing apps can keep using:
 * `imports: [DropDownListModule]`
 */
@NgModule({
    imports: [CommonModule, ...DROPDOWNLIST_DIRECTIVES],
    exports: [...DROPDOWNLIST_DIRECTIVES]
})
export class DropDownListModule { }