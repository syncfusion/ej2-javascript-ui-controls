import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularChart3DSeriesDirective, CircularChart3DSeriesCollectionDirective } from './series.directive';
import { CircularChart3DSelectedDataIndexDirective, CircularChart3DSelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { CircularChart3DComponent } from './circularchart3d.component';
import { CircularChart3DModule } from './circularchart3d.module';
import {PieSeries3D, CircularChartTooltip3D, CircularChartLegend3D, CircularChartSelection3D, CircularChartDataLabel3D, CircularChartHighlight3D, CircularChartExport3D} from '@syncfusion/ej2-charts'


export const PieSeries3DService: ValueProvider = { provide: 'ChartsPieSeries3D', useValue: PieSeries3D};
export const CircularChartTooltip3DService: ValueProvider = { provide: 'ChartsCircularChartTooltip3D', useValue: CircularChartTooltip3D};
export const CircularChartLegend3DService: ValueProvider = { provide: 'ChartsCircularChartLegend3D', useValue: CircularChartLegend3D};
export const CircularChartSelection3DService: ValueProvider = { provide: 'ChartsCircularChartSelection3D', useValue: CircularChartSelection3D};
export const CircularChartDataLabel3DService: ValueProvider = { provide: 'ChartsCircularChartDataLabel3D', useValue: CircularChartDataLabel3D};
export const CircularChartHighlight3DService: ValueProvider = { provide: 'ChartsCircularChartHighlight3D', useValue: CircularChartHighlight3D};
export const CircularChartExport3DService: ValueProvider = { provide: 'ChartsCircularChartExport3D', useValue: CircularChartExport3D};

/**
 * NgModule definition for the CircularChart3D component with providers.
 */
@NgModule({
    imports: [CommonModule, CircularChart3DModule],
    exports: [
        CircularChart3DModule
    ],
    providers:[
        PieSeries3DService,
        CircularChartTooltip3DService,
        CircularChartLegend3DService,
        CircularChartSelection3DService,
        CircularChartDataLabel3DService,
        CircularChartHighlight3DService,
        CircularChartExport3DService
    ]
})
export class CircularChart3DAllModule { }