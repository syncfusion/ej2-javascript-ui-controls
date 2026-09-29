import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating.component';
import { RatingModule } from './rating.module';





/**
 * NgModule definition for the Rating component with providers.
 */
@NgModule({
    imports: [CommonModule, RatingModule],
    exports: [
        RatingModule
    ],
    providers:[
        
    ]
})
export class RatingAllModule { }