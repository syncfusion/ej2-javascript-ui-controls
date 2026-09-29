import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotFieldListComponent } from './pivotfieldlist.component';

const PIVOTFIELDLIST_DIRECTIVES = [
    PivotFieldListComponent
];

/**
 * NgModule definition for the PivotFieldList component.
 * Re-exports standalone PivotFieldList component and directives so existing apps can keep using:
 * `imports: [PivotFieldListModule]`
 */
@NgModule({
    imports: [CommonModule, ...PIVOTFIELDLIST_DIRECTIVES],
    exports: [...PIVOTFIELDLIST_DIRECTIVES]
})
export class PivotFieldListModule { }