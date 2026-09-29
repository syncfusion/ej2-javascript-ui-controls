import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularChart3DSeriesDirective, CircularChart3DSeriesCollectionDirective } from './series.directive';
import { CircularChart3DSelectedDataIndexDirective, CircularChart3DSelectedDataIndexesDirective } from './selecteddataindexes.directive';
import { CircularChart3DComponent } from './circularchart3d.component';

const CIRCULARCHART3D_DIRECTIVES = [
    CircularChart3DComponent,
        CircularChart3DSeriesDirective,
        CircularChart3DSeriesCollectionDirective,
        CircularChart3DSelectedDataIndexDirective,
        CircularChart3DSelectedDataIndexesDirective
];

/**
 * NgModule definition for the CircularChart3D component.
 * Re-exports standalone CircularChart3D component and directives so existing apps can keep using:
 * `imports: [CircularChart3DModule]`
 */
@NgModule({
    imports: [CommonModule, ...CIRCULARCHART3D_DIRECTIVES],
    exports: [...CIRCULARCHART3D_DIRECTIVES]
})
export class CircularChart3DModule { }