import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyNodeDirective, SankeyNodesCollectionDirective } from './nodes.directive';
import { SankeyLinkDirective, SankeyLinksCollectionDirective } from './links.directive';
import { SankeyComponent } from './sankey.component';
import { SankeyModule } from './sankey.module';
import {SankeyLegend, SankeyTooltip, SankeyHighlight, SankeyExport} from '@syncfusion/ej2-charts'


export const SankeyLegendService: ValueProvider = { provide: 'ChartsSankeyLegend', useValue: SankeyLegend};
export const SankeyTooltipService: ValueProvider = { provide: 'ChartsSankeyTooltip', useValue: SankeyTooltip};
export const SankeyHighlightService: ValueProvider = { provide: 'ChartsSankeyHighlight', useValue: SankeyHighlight};
export const SankeyExportService: ValueProvider = { provide: 'ChartsSankeyExport', useValue: SankeyExport};

/**
 * NgModule definition for the Sankey component with providers.
 */
@NgModule({
    imports: [CommonModule, SankeyModule],
    exports: [
        SankeyModule
    ],
    providers:[
        SankeyLegendService,
        SankeyTooltipService,
        SankeyHighlightService,
        SankeyExportService
    ]
})
export class SankeyAllModule { }