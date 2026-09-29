import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';

const SLIDER_DIRECTIVES = [
    SliderComponent
];

/**
 * NgModule definition for the Slider component.
 * Re-exports standalone Slider component and directives so existing apps can keep using:
 * `imports: [SliderModule]`
 */
@NgModule({
    imports: [CommonModule, ...SLIDER_DIRECTIVES],
    exports: [...SLIDER_DIRECTIVES]
})
export class SliderModule { }