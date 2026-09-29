import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeBandSettingDirective, RangeBandSettingsDirective } from './rangebandsettings.directive';
import { SparklineComponent } from './sparkline.component';
import { SparklineModule } from './sparkline.module';
import {SparklineTooltip} from '@syncfusion/ej2-charts'


export const SparklineTooltipService: ValueProvider = { provide: 'ChartsSparklineTooltip', useValue: SparklineTooltip};

/**
 * NgModule definition for the Sparkline component with providers.
 */
@NgModule({
    imports: [CommonModule, SparklineModule],
    exports: [
        SparklineModule
    ],
    providers:[
        SparklineTooltipService
    ]
})
export class SparklineAllModule { }