import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart3DSeriesDirective, Chart3DSeriesCollectionDirective } from './series.directive';
import { Chart3DAxisDirective, Chart3DAxesDirective } from './axes.directive';
import { Chart3DRowDirective, Chart3DRowsDirective } from './rows.directive';
import { Chart3DColumnDirective, Chart3DColumnsDirective } from './columns.directive';
import { Chart3DSelectedDataIndexDirective, Chart3DSelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { Chart3DComponent } from './chart3d.component';
import { Chart3DModule } from './chart3d.module';
import {ColumnSeries3D, StackingColumnSeries3D, BarSeries3D, StackingBarSeries3D, Category3D, DateTime3D, DateTimeCategory3D, Logarithmic3D, Tooltip3D, Legend3D, DataLabel3D, Selection3D, Export3D, Highlight3D} from '@syncfusion/ej2-charts'


export const ColumnSeries3DService: ValueProvider = { provide: 'ChartsColumnSeries3D', useValue: ColumnSeries3D};
export const StackingColumnSeries3DService: ValueProvider = { provide: 'ChartsStackingColumnSeries3D', useValue: StackingColumnSeries3D};
export const BarSeries3DService: ValueProvider = { provide: 'ChartsBarSeries3D', useValue: BarSeries3D};
export const StackingBarSeries3DService: ValueProvider = { provide: 'ChartsStackingBarSeries3D', useValue: StackingBarSeries3D};
export const Category3DService: ValueProvider = { provide: 'ChartsCategory3D', useValue: Category3D};
export const DateTime3DService: ValueProvider = { provide: 'ChartsDateTime3D', useValue: DateTime3D};
export const DateTimeCategory3DService: ValueProvider = { provide: 'ChartsDateTimeCategory3D', useValue: DateTimeCategory3D};
export const Logarithmic3DService: ValueProvider = { provide: 'ChartsLogarithmic3D', useValue: Logarithmic3D};
export const Tooltip3DService: ValueProvider = { provide: 'ChartsTooltip3D', useValue: Tooltip3D};
export const Legend3DService: ValueProvider = { provide: 'ChartsLegend3D', useValue: Legend3D};
export const DataLabel3DService: ValueProvider = { provide: 'ChartsDataLabel3D', useValue: DataLabel3D};
export const Selection3DService: ValueProvider = { provide: 'ChartsSelection3D', useValue: Selection3D};
export const Export3DService: ValueProvider = { provide: 'ChartsExport3D', useValue: Export3D};
export const Highlight3DService: ValueProvider = { provide: 'ChartsHighlight3D', useValue: Highlight3D};

/**
 * NgModule definition for the Chart3D component with providers.
 */
@NgModule({
    imports: [CommonModule, Chart3DModule],
    exports: [
        Chart3DModule
    ],
    providers:[
        ColumnSeries3DService,
        StackingColumnSeries3DService,
        BarSeries3DService,
        StackingBarSeries3DService,
        Category3DService,
        DateTime3DService,
        DateTimeCategory3DService,
        Logarithmic3DService,
        Tooltip3DService,
        Legend3DService,
        DataLabel3DService,
        Selection3DService,
        Export3DService,
        Highlight3DService
    ]
})
export class Chart3DAllModule { }