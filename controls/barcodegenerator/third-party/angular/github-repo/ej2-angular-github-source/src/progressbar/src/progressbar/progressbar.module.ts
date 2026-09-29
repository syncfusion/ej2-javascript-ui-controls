import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarAnnotationDirective, ProgressBarAnnotationsDirective } from './annotations.directive';
import { RangeColorDirective, RangeColorsDirective } from './rangecolors.directive';
import { ProgressBarComponent } from './progressbar.component';

const PROGRESSBAR_DIRECTIVES = [
    ProgressBarComponent,
        ProgressBarAnnotationDirective,
        ProgressBarAnnotationsDirective,
        RangeColorDirective,
        RangeColorsDirective
];

/**
 * NgModule definition for the ProgressBar component.
 * Re-exports standalone ProgressBar component and directives so existing apps can keep using:
 * `imports: [ProgressBarModule]`
 */
@NgModule({
    imports: [CommonModule, ...PROGRESSBAR_DIRECTIVES],
    exports: [...PROGRESSBAR_DIRECTIVES]
})
export class ProgressBarModule { }