import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangenavigatorSeriesDirective, RangenavigatorSeriesCollectionDirective } from './series.directive';
import { RangeNavigatorComponent } from './rangenavigator.component';
import { RangeNavigatorModule } from './rangenavigator.module';
import {RangeTooltip, PeriodSelector} from '@syncfusion/ej2-charts'


export const RangeTooltipService: ValueProvider = { provide: 'ChartsRangeTooltip', useValue: RangeTooltip};
export const PeriodSelectorService: ValueProvider = { provide: 'ChartsPeriodSelector', useValue: PeriodSelector};

/**
 * NgModule definition for the RangeNavigator component with providers.
 */
@NgModule({
    imports: [CommonModule, RangeNavigatorModule],
    exports: [
        RangeNavigatorModule
    ],
    providers:[
        RangeTooltipService,
        PeriodSelectorService
    ]
})
export class RangeNavigatorAllModule { }