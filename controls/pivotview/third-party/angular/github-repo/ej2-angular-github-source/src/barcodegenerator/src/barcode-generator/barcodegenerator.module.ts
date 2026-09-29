import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeGeneratorComponent } from './barcodegenerator.component';

const BARCODEGENERATOR_DIRECTIVES = [
    BarcodeGeneratorComponent
];

/**
 * NgModule definition for the BarcodeGenerator component.
 * Re-exports standalone BarcodeGenerator component and directives so existing apps can keep using:
 * `imports: [BarcodeGeneratorModule]`
 */
@NgModule({
    imports: [CommonModule, ...BARCODEGENERATOR_DIRECTIVES],
    exports: [...BARCODEGENERATOR_DIRECTIVES]
})
export class BarcodeGeneratorModule { }