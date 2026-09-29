import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteDirective, PalettesDirective } from './palettes.directive';
import { SymbolPaletteComponent } from './symbolpalette.component';

const SYMBOLPALETTE_DIRECTIVES = [
    SymbolPaletteComponent,
        PaletteDirective,
        PalettesDirective
];

/**
 * NgModule definition for the SymbolPalette component.
 * Re-exports standalone SymbolPalette component and directives so existing apps can keep using:
 * `imports: [SymbolPaletteModule]`
 */
@NgModule({
    imports: [CommonModule, ...SYMBOLPALETTE_DIRECTIVES],
    exports: [...SYMBOLPALETTE_DIRECTIVES]
})
export class SymbolPaletteModule { }