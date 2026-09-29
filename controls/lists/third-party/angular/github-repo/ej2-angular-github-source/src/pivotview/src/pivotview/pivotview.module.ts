import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotViewComponent } from './pivotview.component';

const PIVOTVIEW_DIRECTIVES = [
    PivotViewComponent
];

/**
 * NgModule definition for the PivotView component.
 * Re-exports standalone PivotView component and directives so existing apps can keep using:
 * `imports: [PivotViewModule]`
 */
@NgModule({
    imports: [CommonModule, ...PIVOTVIEW_DIRECTIVES],
    exports: [...PIVOTVIEW_DIRECTIVES]
})
export class PivotViewModule { }