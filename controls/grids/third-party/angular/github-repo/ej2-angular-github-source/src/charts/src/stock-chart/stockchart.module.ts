import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockChartTrendlineDirective, StockChartTrendlinesDirective } from './trendlines.directive';
import { StockChartSeriesDirective, StockChartSeriesCollectionDirective } from './series.directive';
import { StockChartAxisDirective, StockChartAxesDirective } from './axes.directive';
import { StockChartRowDirective, StockChartRowsDirective } from './rows.directive';
import { StockChartAnnotationDirective, StockChartAnnotationsDirective } from './annotations.directive';
import { StockChartSelectedDataIndexDirective, StockChartSelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { StockChartPeriodDirective, StockChartPeriodsDirective } from './periods.directive';
import { StockEventDirective, StockEventsDirective } from './stockevents.directive';
import { StockChartIndicatorDirective, StockChartIndicatorsDirective } from './indicators.directive';
import { StockChartComponent } from './stockchart.component';

const STOCKCHART_DIRECTIVES = [
    StockChartComponent,
        StockChartTrendlineDirective,
        StockChartTrendlinesDirective,
        StockChartSeriesDirective,
        StockChartSeriesCollectionDirective,
        StockChartAxisDirective,
        StockChartAxesDirective,
        StockChartRowDirective,
        StockChartRowsDirective,
        StockChartAnnotationDirective,
        StockChartAnnotationsDirective,
        StockChartSelectedDataIndexDirective,
        StockChartSelectedDataIndexesDirective,
        StockChartPeriodDirective,
        StockChartPeriodsDirective,
        StockEventDirective,
        StockEventsDirective,
        StockChartIndicatorDirective,
        StockChartIndicatorsDirective
];

/**
 * NgModule definition for the StockChart component.
 * Re-exports standalone StockChart component and directives so existing apps can keep using:
 * `imports: [StockChartModule]`
 */
@NgModule({
    imports: [CommonModule, ...STOCKCHART_DIRECTIVES],
    exports: [...STOCKCHART_DIRECTIVES]
})
export class StockChartModule { }