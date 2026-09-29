import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccumulationSeriesDirective, AccumulationSeriesCollectionDirective } from './series.directive';
import { AccumulationAnnotationDirective, AccumulationAnnotationsDirective } from './annotations.directive';
import { AccumulationChartComponent } from './accumulationchart.component';
import { AccumulationChartModule } from './accumulationchart.module';
import {PieSeries, FunnelSeries, PyramidSeries, AccumulationTooltip, AccumulationLegend, AccumulationSelection, AccumulationHighlight, AccumulationDataLabel, AccumulationAnnotation} from '@syncfusion/ej2-charts'


export const PieSeriesService: ValueProvider = { provide: 'ChartsPieSeries', useValue: PieSeries};
export const FunnelSeriesService: ValueProvider = { provide: 'ChartsFunnelSeries', useValue: FunnelSeries};
export const PyramidSeriesService: ValueProvider = { provide: 'ChartsPyramidSeries', useValue: PyramidSeries};
export const AccumulationTooltipService: ValueProvider = { provide: 'ChartsAccumulationTooltip', useValue: AccumulationTooltip};
export const AccumulationLegendService: ValueProvider = { provide: 'ChartsAccumulationLegend', useValue: AccumulationLegend};
export const AccumulationSelectionService: ValueProvider = { provide: 'ChartsAccumulationSelection', useValue: AccumulationSelection};
export const AccumulationHighlightService: ValueProvider = { provide: 'ChartsAccumulationHighlight', useValue: AccumulationHighlight};
export const AccumulationDataLabelService: ValueProvider = { provide: 'ChartsAccumulationDataLabel', useValue: AccumulationDataLabel};
export const AccumulationAnnotationService: ValueProvider = { provide: 'ChartsAccumulationAnnotation', useValue: AccumulationAnnotation};

/**
 * NgModule definition for the AccumulationChart component with providers.
 */
@NgModule({
    imports: [CommonModule, AccumulationChartModule],
    exports: [
        AccumulationChartModule
    ],
    providers:[
        PieSeriesService,
        FunnelSeriesService,
        PyramidSeriesService,
        AccumulationTooltipService,
        AccumulationLegendService,
        AccumulationSelectionService,
        AccumulationHighlightService,
        AccumulationDataLabelService,
        AccumulationAnnotationService
    ]
})
export class AccumulationChartAllModule { }