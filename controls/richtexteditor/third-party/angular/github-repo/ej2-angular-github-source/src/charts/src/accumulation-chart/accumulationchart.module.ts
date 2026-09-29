import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccumulationSeriesDirective, AccumulationSeriesCollectionDirective } from './series.directive';
import { AccumulationAnnotationDirective, AccumulationAnnotationsDirective } from './annotations.directive';
import { AccumulationChartComponent } from './accumulationchart.component';

const ACCUMULATIONCHART_DIRECTIVES = [
    AccumulationChartComponent,
        AccumulationSeriesDirective,
        AccumulationSeriesCollectionDirective,
        AccumulationAnnotationDirective,
        AccumulationAnnotationsDirective
];

/**
 * NgModule definition for the AccumulationChart component.
 * Re-exports standalone AccumulationChart component and directives so existing apps can keep using:
 * `imports: [AccumulationChartModule]`
 */
@NgModule({
    imports: [CommonModule, ...ACCUMULATIONCHART_DIRECTIVES],
    exports: [...ACCUMULATIONCHART_DIRECTIVES]
})
export class AccumulationChartModule { }