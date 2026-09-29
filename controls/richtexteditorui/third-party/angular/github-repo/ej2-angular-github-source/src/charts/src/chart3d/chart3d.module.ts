import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart3DSeriesDirective, Chart3DSeriesCollectionDirective } from './series.directive';
import { Chart3DAxisDirective, Chart3DAxesDirective } from './axes.directive';
import { Chart3DRowDirective, Chart3DRowsDirective } from './rows.directive';
import { Chart3DColumnDirective, Chart3DColumnsDirective } from './columns.directive';
import { Chart3DSelectedDataIndexDirective, Chart3DSelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { Chart3DComponent } from './chart3d.component';

const CHART3D_DIRECTIVES = [
    Chart3DComponent,
        Chart3DSeriesDirective,
        Chart3DSeriesCollectionDirective,
        Chart3DAxisDirective,
        Chart3DAxesDirective,
        Chart3DRowDirective,
        Chart3DRowsDirective,
        Chart3DColumnDirective,
        Chart3DColumnsDirective,
        Chart3DSelectedDataIndexDirective,
        Chart3DSelectedDataIndexesDirective
];

/**
 * NgModule definition for the Chart3D component.
 * Re-exports standalone Chart3D component and directives so existing apps can keep using:
 * `imports: [Chart3DModule]`
 */
@NgModule({
    imports: [CommonModule, ...CHART3D_DIRECTIVES],
    exports: [...CHART3D_DIRECTIVES]
})
export class Chart3DModule { }