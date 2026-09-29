import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownTreeComponent } from './dropdowntree.component';

const DROPDOWNTREE_DIRECTIVES = [
    DropDownTreeComponent
];

/**
 * NgModule definition for the DropDownTree component.
 * Re-exports standalone DropDownTree component and directives so existing apps can keep using:
 * `imports: [DropDownTreeModule]`
 */
@NgModule({
    imports: [CommonModule, ...DROPDOWNTREE_DIRECTIVES],
    exports: [...DROPDOWNTREE_DIRECTIVES]
})
export class DropDownTreeModule { }