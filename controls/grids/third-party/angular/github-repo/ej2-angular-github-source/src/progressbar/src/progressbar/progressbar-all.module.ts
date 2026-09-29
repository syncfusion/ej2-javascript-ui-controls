import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarAnnotationDirective, ProgressBarAnnotationsDirective } from './annotations.directive';
import { RangeColorDirective, RangeColorsDirective } from './rangecolors.directive';
import { ProgressBarComponent } from './progressbar.component';
import { ProgressBarModule } from './progressbar.module';
import {ProgressAnnotation, ProgressTooltip} from '@syncfusion/ej2-progressbar'


export const ProgressAnnotationService: ValueProvider = { provide: 'ProgressBarProgressAnnotation', useValue: ProgressAnnotation};
export const ProgressTooltipService: ValueProvider = { provide: 'ProgressBarProgressTooltip', useValue: ProgressTooltip};

/**
 * NgModule definition for the ProgressBar component with providers.
 */
@NgModule({
    imports: [CommonModule, ProgressBarModule],
    exports: [
        ProgressBarModule
    ],
    providers:[
        ProgressAnnotationService,
        ProgressTooltipService
    ]
})
export class ProgressBarAllModule { }