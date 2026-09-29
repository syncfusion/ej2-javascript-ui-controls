import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteDirective, PalettesDirective } from './palettes.directive';
import { SymbolPaletteComponent } from './symbolpalette.component';
import { SymbolPaletteModule } from './symbolpalette.module';





/**
 * NgModule definition for the SymbolPalette component with providers.
 */
@NgModule({
    imports: [CommonModule, SymbolPaletteModule],
    exports: [
        SymbolPaletteModule
    ],
    providers:[
        
    ]
})
export class SymbolPaletteAllModule { }