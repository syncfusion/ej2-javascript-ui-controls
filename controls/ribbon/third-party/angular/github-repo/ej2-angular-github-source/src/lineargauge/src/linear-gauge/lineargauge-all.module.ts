import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDirective, RangesDirective } from './ranges.directive';
import { PointerDirective, PointersDirective } from './pointers.directive';
import { AxisDirective, AxesDirective } from './axes.directive';
import { AnnotationDirective, AnnotationsDirective } from './annotations.directive';
import { LinearGaugeComponent } from './lineargauge.component';
import { LinearGaugeModule } from './lineargauge.module';
import {GaugeTooltip, Annotations, Print, PdfExport, ImageExport, Gradient} from '@syncfusion/ej2-lineargauge'


export const GaugeTooltipService: ValueProvider = { provide: 'LinearGaugeGaugeTooltip', useValue: GaugeTooltip};
export const AnnotationsService: ValueProvider = { provide: 'LinearGaugeAnnotations', useValue: Annotations};
export const PrintService: ValueProvider = { provide: 'LinearGaugePrint', useValue: Print};
export const PdfExportService: ValueProvider = { provide: 'LinearGaugePdfExport', useValue: PdfExport};
export const ImageExportService: ValueProvider = { provide: 'LinearGaugeImageExport', useValue: ImageExport};
export const GradientService: ValueProvider = { provide: 'LinearGaugeGradient', useValue: Gradient};

/**
 * NgModule definition for the LinearGauge component with providers.
 */
@NgModule({
    imports: [CommonModule, LinearGaugeModule],
    exports: [
        LinearGaugeModule
    ],
    providers:[
        GaugeTooltipService,
        AnnotationsService,
        PrintService,
        PdfExportService,
        ImageExportService,
        GradientService
    ]
})
export class LinearGaugeAllModule { }