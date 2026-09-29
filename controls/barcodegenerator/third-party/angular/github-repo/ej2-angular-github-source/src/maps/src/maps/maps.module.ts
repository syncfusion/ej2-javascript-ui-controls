import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialShapeSelectionDirective, InitialShapeSelectionsDirective } from './initialshapeselection.directive';
import { MarkerDirective, MarkersDirective } from './markersettings.directive';
import { ColorMappingDirective, ColorMappingsDirective } from './colormapping.directive';
import { BubbleDirective, BubblesDirective } from './bubblesettings.directive';
import { NavigationLineDirective, NavigationLinesDirective } from './navigationlinesettings.directive';
import { LayerDirective, LayersDirective } from './layers.directive';
import { AnnotationDirective, AnnotationsDirective } from './annotations.directive';
import { MapsComponent } from './maps.component';

const MAPS_DIRECTIVES = [
    MapsComponent,
        InitialShapeSelectionDirective,
        InitialShapeSelectionsDirective,
        MarkerDirective,
        MarkersDirective,
        ColorMappingDirective,
        ColorMappingsDirective,
        BubbleDirective,
        BubblesDirective,
        NavigationLineDirective,
        NavigationLinesDirective,
        LayerDirective,
        LayersDirective,
        AnnotationDirective,
        AnnotationsDirective
];

/**
 * NgModule definition for the Maps component.
 * Re-exports standalone Maps component and directives so existing apps can keep using:
 * `imports: [MapsModule]`
 */
@NgModule({
    imports: [CommonModule, ...MAPS_DIRECTIVES],
    exports: [...MAPS_DIRECTIVES]
})
export class MapsModule { }