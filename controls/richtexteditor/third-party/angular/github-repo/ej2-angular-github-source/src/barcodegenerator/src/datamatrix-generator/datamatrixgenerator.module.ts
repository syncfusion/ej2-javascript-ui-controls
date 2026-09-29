import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataMatrixGeneratorComponent } from './datamatrixgenerator.component';

const DATAMATRIXGENERATOR_DIRECTIVES = [
    DataMatrixGeneratorComponent
];

/**
 * NgModule definition for the DataMatrixGenerator component.
 * Re-exports standalone DataMatrixGenerator component and directives so existing apps can keep using:
 * `imports: [DataMatrixGeneratorModule]`
 */
@NgModule({
    imports: [CommonModule, ...DATAMATRIXGENERATOR_DIRECTIVES],
    exports: [...DATAMATRIXGENERATOR_DIRECTIVES]
})
export class DataMatrixGeneratorModule { }