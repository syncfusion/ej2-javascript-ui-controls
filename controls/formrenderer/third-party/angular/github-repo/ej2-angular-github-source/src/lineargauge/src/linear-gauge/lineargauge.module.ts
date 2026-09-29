import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDirective, RangesDirective } from './ranges.directive';
import { PointerDirective, PointersDirective } from './pointers.directive';
import { AxisDirective, AxesDirective } from './axes.directive';
import { AnnotationDirective, AnnotationsDirective } from './annotations.directive';
import { LinearGaugeComponent } from './lineargauge.component';

const LINEARGAUGE_DIRECTIVES = [
    LinearGaugeComponent,
        RangeDirective,
        RangesDirective,
        PointerDirective,
        PointersDirective,
        AxisDirective,
        AxesDirective,
        AnnotationDirective,
        AnnotationsDirective
];

/**
 * NgModule definition for the LinearGauge component.
 * Re-exports standalone LinearGauge component and directives so existing apps can keep using:
 * `imports: [LinearGaugeModule]`
 */
@NgModule({
    imports: [CommonModule, ...LINEARGAUGE_DIRECTIVES],
    exports: [...LINEARGAUGE_DIRECTIVES]
})
export class LinearGaugeModule { }