import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatMapComponent } from './heatmap.component';
import { HeatMapModule } from './heatmap.module';
import {Legend, Tooltip, Adaptor} from '@syncfusion/ej2-heatmap'


export const LegendService: ValueProvider = { provide: 'HeatMapLegend', useValue: Legend};
export const TooltipService: ValueProvider = { provide: 'HeatMapTooltip', useValue: Tooltip};
export const AdaptorService: ValueProvider = { provide: 'HeatMapAdaptor', useValue: Adaptor};

/**
 * NgModule definition for the HeatMap component with providers.
 */
@NgModule({
    imports: [CommonModule, HeatMapModule],
    exports: [
        HeatMapModule
    ],
    providers:[
        LegendService,
        TooltipService,
        AdaptorService
    ]
})
export class HeatMapAllModule { }