import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { SliderModule } from './slider.module';





/**
 * NgModule definition for the Slider component with providers.
 */
@NgModule({
    imports: [CommonModule, SliderModule],
    exports: [
        SliderModule
    ],
    providers:[
        
    ]
})
export class SliderAllModule { }