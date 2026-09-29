import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmithchartSeriesDirective, SmithchartSeriesCollectionDirective } from './series.directive';
import { SmithchartComponent } from './smithchart.component';

const SMITHCHART_DIRECTIVES = [
    SmithchartComponent,
        SmithchartSeriesDirective,
        SmithchartSeriesCollectionDirective
];

/**
 * NgModule definition for the Smithchart component.
 * Re-exports standalone Smithchart component and directives so existing apps can keep using:
 * `imports: [SmithchartModule]`
 */
@NgModule({
    imports: [CommonModule, ...SMITHCHART_DIRECTIVES],
    exports: [...SMITHCHART_DIRECTIVES]
})
export class SmithchartModule { }