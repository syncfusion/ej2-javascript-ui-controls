import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorMappingDirective, ColorMappingsDirective } from './colormapping.directive';
import { LevelDirective, LevelsDirective } from './levels.directive';
import { TreeMapComponent } from './treemap.component';

const TREEMAP_DIRECTIVES = [
    TreeMapComponent,
        ColorMappingDirective,
        ColorMappingsDirective,
        LevelDirective,
        LevelsDirective
];

/**
 * NgModule definition for the TreeMap component.
 * Re-exports standalone TreeMap component and directives so existing apps can keep using:
 * `imports: [TreeMapModule]`
 */
@NgModule({
    imports: [CommonModule, ...TREEMAP_DIRECTIVES],
    exports: [...TREEMAP_DIRECTIVES]
})
export class TreeMapModule { }