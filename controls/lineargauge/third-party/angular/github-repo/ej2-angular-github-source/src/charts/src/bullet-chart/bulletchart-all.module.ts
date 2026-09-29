import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletRangeDirective, BulletRangeCollectionDirective } from './ranges.directive';
import { BulletChartComponent } from './bulletchart.component';
import { BulletChartModule } from './bulletchart.module';
import {BulletTooltip, BulletChartLegend} from '@syncfusion/ej2-charts'


export const BulletTooltipService: ValueProvider = { provide: 'ChartsBulletTooltip', useValue: BulletTooltip};
export const BulletChartLegendService: ValueProvider = { provide: 'ChartsBulletChartLegend', useValue: BulletChartLegend};

/**
 * NgModule definition for the BulletChart component with providers.
 */
@NgModule({
    imports: [CommonModule, BulletChartModule],
    exports: [
        BulletChartModule
    ],
    providers:[
        BulletTooltipService,
        BulletChartLegendService
    ]
})
export class BulletChartAllModule { }