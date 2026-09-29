import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating.component';

const RATING_DIRECTIVES = [
    RatingComponent
];

/**
 * NgModule definition for the Rating component.
 * Re-exports standalone Rating component and directives so existing apps can keep using:
 * `imports: [RatingModule]`
 */
@NgModule({
    imports: [CommonModule, ...RATING_DIRECTIVES],
    exports: [...RATING_DIRECTIVES]
})
export class RatingModule { }