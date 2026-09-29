import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItemDirective, CarouselItemsDirective } from './items.directive';
import { CarouselComponent } from './carousel.component';

const CAROUSEL_DIRECTIVES = [
    CarouselComponent,
        CarouselItemDirective,
        CarouselItemsDirective
];

/**
 * NgModule definition for the Carousel component.
 * Re-exports standalone Carousel component and directives so existing apps can keep using:
 * `imports: [CarouselModule]`
 */
@NgModule({
    imports: [CommonModule, ...CAROUSEL_DIRECTIVES],
    exports: [...CAROUSEL_DIRECTIVES]
})
export class CarouselModule { }