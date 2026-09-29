import { NgModule, ValueProvider } from '@angular/core';
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
import { StockChartModule } from './stockchart.module';
import {StockLegend} from '@syncfusion/ej2-charts'


export const StockLegendService: ValueProvider = { provide: 'ChartsStockLegend', useValue: StockLegend};

/**
 * NgModule definition for the StockChart component with providers.
 */
@NgModule({
    imports: [CommonModule, StockChartModule],
    exports: [
        StockChartModule
    ],
    providers:[
        StockLegendService
    ]
})
export class StockChartAllModule { }