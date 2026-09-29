import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatMapComponent } from './heatmap.component';

const HEATMAP_DIRECTIVES = [
    HeatMapComponent
];

/**
 * NgModule definition for the HeatMap component.
 * Re-exports standalone HeatMap component and directives so existing apps can keep using:
 * `imports: [HeatMapModule]`
 */
@NgModule({
    imports: [CommonModule, ...HEATMAP_DIRECTIVES],
    exports: [...HEATMAP_DIRECTIVES]
})
export class HeatMapModule { }