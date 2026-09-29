import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItemDirective, CarouselItemsDirective } from './items.directive';
import { CarouselComponent } from './carousel.component';
import { CarouselModule } from './carousel.module';





/**
 * NgModule definition for the Carousel component with providers.
 */
@NgModule({
    imports: [CommonModule, CarouselModule],
    exports: [
        CarouselModule
    ],
    providers:[
        
    ]
})
export class CarouselAllModule { }