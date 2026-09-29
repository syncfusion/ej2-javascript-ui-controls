import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepDirective, StepsDirective } from './steps.directive';
import { StepperComponent } from './stepper.component';

const STEPPER_DIRECTIVES = [
    StepperComponent,
        StepDirective,
        StepsDirective
];

/**
 * NgModule definition for the Stepper component.
 * Re-exports standalone Stepper component and directives so existing apps can keep using:
 * `imports: [StepperModule]`
 */
@NgModule({
    imports: [CommonModule, ...STEPPER_DIRECTIVES],
    exports: [...STEPPER_DIRECTIVES]
})
export class StepperModule { }