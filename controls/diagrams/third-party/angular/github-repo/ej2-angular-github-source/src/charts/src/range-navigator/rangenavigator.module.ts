import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangenavigatorSeriesDirective, RangenavigatorSeriesCollectionDirective } from './series.directive';
import { RangeNavigatorComponent } from './rangenavigator.component';

const RANGENAVIGATOR_DIRECTIVES = [
    RangeNavigatorComponent,
        RangenavigatorSeriesDirective,
        RangenavigatorSeriesCollectionDirective
];

/**
 * NgModule definition for the RangeNavigator component.
 * Re-exports standalone RangeNavigator component and directives so existing apps can keep using:
 * `imports: [RangeNavigatorModule]`
 */
@NgModule({
    imports: [CommonModule, ...RANGENAVIGATOR_DIRECTIVES],
    exports: [...RANGENAVIGATOR_DIRECTIVES]
})
export class RangeNavigatorModule { }