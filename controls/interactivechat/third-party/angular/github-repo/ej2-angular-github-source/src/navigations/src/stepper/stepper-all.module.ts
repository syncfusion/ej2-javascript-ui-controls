import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepDirective, StepsDirective } from './steps.directive';
import { StepperComponent } from './stepper.component';
import { StepperModule } from './stepper.module';





/**
 * NgModule definition for the Stepper component with providers.
 */
@NgModule({
    imports: [CommonModule, StepperModule],
    exports: [
        StepperModule
    ],
    providers:[
        
    ]
})
export class StepperAllModule { }