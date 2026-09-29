import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialShapeSelectionDirective, InitialShapeSelectionsDirective } from './initialshapeselection.directive';
import { MarkerDirective, MarkersDirective } from './markersettings.directive';
import { ColorMappingDirective, ColorMappingsDirective } from './colormapping.directive';
import { BubbleDirective, BubblesDirective } from './bubblesettings.directive';
import { NavigationLineDirective, NavigationLinesDirective } from './navigationlinesettings.directive';
import { LayerDirective, LayersDirective } from './layers.directive';
import { AnnotationDirective, AnnotationsDirective } from './annotations.directive';
import { MapsComponent } from './maps.component';
import { MapsModule } from './maps.module';
import {Bubble, Legend, Marker, Highlight, Selection, MapsTooltip, Zoom, DataLabel, NavigationLine, Annotations, Print, PdfExport, ImageExport, Polygon} from '@syncfusion/ej2-maps'


export const BubbleService: ValueProvider = { provide: 'MapsBubble', useValue: Bubble};
export const LegendService: ValueProvider = { provide: 'MapsLegend', useValue: Legend};
export const MarkerService: ValueProvider = { provide: 'MapsMarker', useValue: Marker};
export const HighlightService: ValueProvider = { provide: 'MapsHighlight', useValue: Highlight};
export const SelectionService: ValueProvider = { provide: 'MapsSelection', useValue: Selection};
export const MapsTooltipService: ValueProvider = { provide: 'MapsMapsTooltip', useValue: MapsTooltip};
export const ZoomService: ValueProvider = { provide: 'MapsZoom', useValue: Zoom};
export const DataLabelService: ValueProvider = { provide: 'MapsDataLabel', useValue: DataLabel};
export const NavigationLineService: ValueProvider = { provide: 'MapsNavigationLine', useValue: NavigationLine};
export const AnnotationsService: ValueProvider = { provide: 'MapsAnnotations', useValue: Annotations};
export const PrintService: ValueProvider = { provide: 'MapsPrint', useValue: Print};
export const PdfExportService: ValueProvider = { provide: 'MapsPdfExport', useValue: PdfExport};
export const ImageExportService: ValueProvider = { provide: 'MapsImageExport', useValue: ImageExport};
export const PolygonService: ValueProvider = { provide: 'MapsPolygon', useValue: Polygon};

/**
 * NgModule definition for the Maps component with providers.
 */
@NgModule({
    imports: [CommonModule, MapsModule],
    exports: [
        MapsModule
    ],
    providers:[
        BubbleService,
        LegendService,
        MarkerService,
        HighlightService,
        SelectionService,
        MapsTooltipService,
        ZoomService,
        DataLabelService,
        NavigationLineService,
        AnnotationsService,
        PrintService,
        PdfExportService,
        ImageExportService,
        PolygonService
    ]
})
export class MapsAllModule { }