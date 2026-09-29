import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeBandSettingDirective, RangeBandSettingsDirective } from './rangebandsettings.directive';
import { SparklineComponent } from './sparkline.component';

const SPARKLINE_DIRECTIVES = [
    SparklineComponent,
        RangeBandSettingDirective,
        RangeBandSettingsDirective
];

/**
 * NgModule definition for the Sparkline component.
 * Re-exports standalone Sparkline component and directives so existing apps can keep using:
 * `imports: [SparklineModule]`
 */
@NgModule({
    imports: [CommonModule, ...SPARKLINE_DIRECTIVES],
    exports: [...SPARKLINE_DIRECTIVES]
})
export class SparklineModule { }