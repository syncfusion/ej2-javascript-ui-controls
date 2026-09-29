import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorMappingDirective, ColorMappingsDirective } from './colormapping.directive';
import { LevelDirective, LevelsDirective } from './levels.directive';
import { TreeMapComponent } from './treemap.component';
import { TreeMapModule } from './treemap.module';
import {TreeMapTooltip, TreeMapLegend, TreeMapHighlight, TreeMapSelection, Print, PdfExport, ImageExport} from '@syncfusion/ej2-treemap'


export const TreeMapTooltipService: ValueProvider = { provide: 'TreeMapTreeMapTooltip', useValue: TreeMapTooltip};
export const TreeMapLegendService: ValueProvider = { provide: 'TreeMapTreeMapLegend', useValue: TreeMapLegend};
export const TreeMapHighlightService: ValueProvider = { provide: 'TreeMapTreeMapHighlight', useValue: TreeMapHighlight};
export const TreeMapSelectionService: ValueProvider = { provide: 'TreeMapTreeMapSelection', useValue: TreeMapSelection};
export const PrintService: ValueProvider = { provide: 'TreeMapPrint', useValue: Print};
export const PdfExportService: ValueProvider = { provide: 'TreeMapPdfExport', useValue: PdfExport};
export const ImageExportService: ValueProvider = { provide: 'TreeMapImageExport', useValue: ImageExport};

/**
 * NgModule definition for the TreeMap component with providers.
 */
@NgModule({
    imports: [CommonModule, TreeMapModule],
    exports: [
        TreeMapModule
    ],
    providers:[
        TreeMapTooltipService,
        TreeMapLegendService,
        TreeMapHighlightService,
        TreeMapSelectionService,
        PrintService,
        PdfExportService,
        ImageExportService
    ]
})
export class TreeMapAllModule { }