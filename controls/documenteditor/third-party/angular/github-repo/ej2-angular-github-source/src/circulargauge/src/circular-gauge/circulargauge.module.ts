import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationDirective, AnnotationsDirective } from './annotations.directive';
import { RangeDirective, RangesDirective } from './ranges.directive';
import { PointerDirective, PointersDirective } from './pointers.directive';
import { AxisDirective, AxesDirective } from './axes.directive';
import { CircularGaugeComponent } from './circulargauge.component';

const CIRCULARGAUGE_DIRECTIVES = [
    CircularGaugeComponent,
        AnnotationDirective,
        AnnotationsDirective,
        RangeDirective,
        RangesDirective,
        PointerDirective,
        PointersDirective,
        AxisDirective,
        AxesDirective
];

/**
 * NgModule definition for the CircularGauge component.
 * Re-exports standalone CircularGauge component and directives so existing apps can keep using:
 * `imports: [CircularGaugeModule]`
 */
@NgModule({
    imports: [CommonModule, ...CIRCULARGAUGE_DIRECTIVES],
    exports: [...CIRCULARGAUGE_DIRECTIVES]
})
export class CircularGaugeModule { }