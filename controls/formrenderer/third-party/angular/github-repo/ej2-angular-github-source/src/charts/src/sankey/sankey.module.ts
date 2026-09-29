import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SankeyNodeDirective, SankeyNodesCollectionDirective } from './nodes.directive';
import { SankeyLinkDirective, SankeyLinksCollectionDirective } from './links.directive';
import { SankeyComponent } from './sankey.component';

const SANKEY_DIRECTIVES = [
    SankeyComponent,
        SankeyNodeDirective,
        SankeyNodesCollectionDirective,
        SankeyLinkDirective,
        SankeyLinksCollectionDirective
];

/**
 * NgModule definition for the Sankey component.
 * Re-exports standalone Sankey component and directives so existing apps can keep using:
 * `imports: [SankeyModule]`
 */
@NgModule({
    imports: [CommonModule, ...SANKEY_DIRECTIVES],
    exports: [...SANKEY_DIRECTIVES]
})
export class SankeyModule { }