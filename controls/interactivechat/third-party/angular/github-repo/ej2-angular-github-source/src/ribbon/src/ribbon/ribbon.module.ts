import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RibbonItemDirective, RibbonItemsDirective } from './items.directive';
import { RibbonCollectionDirective, RibbonCollectionsDirective } from './collections.directive';
import { RibbonGroupDirective, RibbonGroupsDirective } from './groups.directive';
import { RibbonTabDirective, RibbonTabsDirective } from './tabs.directive';
import { RibbonContextualTabDirective, RibbonContextualTabsDirective } from './contextualtabs.directive';
import { RibbonComponent } from './ribbon.component';

const RIBBON_DIRECTIVES = [
    RibbonComponent,
        RibbonItemDirective,
        RibbonItemsDirective,
        RibbonCollectionDirective,
        RibbonCollectionsDirective,
        RibbonGroupDirective,
        RibbonGroupsDirective,
        RibbonTabDirective,
        RibbonTabsDirective,
        RibbonContextualTabDirective,
        RibbonContextualTabsDirective
];
/**
 * NgModule definition for the Ribbon component.
 * Re-exports standalone Ribbon component and directives so existing apps can keep using:
 * `imports: [RibbonModule]`
 */
@NgModule({
    imports: [CommonModule, ...RIBBON_DIRECTIVES],
    exports: [...RIBBON_DIRECTIVES]
})
export class RibbonModule { }