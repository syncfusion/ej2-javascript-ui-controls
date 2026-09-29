import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmithchartSeriesDirective, SmithchartSeriesCollectionDirective } from './series.directive';
import { SmithchartComponent } from './smithchart.component';
import { SmithchartModule } from './smithchart.module';
import {SmithchartLegend, TooltipRender} from '@syncfusion/ej2-charts'


export const SmithchartLegendService: ValueProvider = { provide: 'ChartsSmithchartLegend', useValue: SmithchartLegend};
export const TooltipRenderService: ValueProvider = { provide: 'ChartsTooltipRender', useValue: TooltipRender};

/**
 * NgModule definition for the Smithchart component with providers.
 */
@NgModule({
    imports: [CommonModule, SmithchartModule],
    exports: [
        SmithchartModule
    ],
    providers:[
        SmithchartLegendService,
        TooltipRenderService
    ]
})
export class SmithchartAllModule { }