import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataMatrixGeneratorComponent } from './datamatrixgenerator.component';
import { DataMatrixGeneratorModule } from './datamatrixgenerator.module';





/**
 * NgModule definition for the DataMatrixGenerator component with providers.
 */
@NgModule({
    imports: [CommonModule, DataMatrixGeneratorModule],
    exports: [
        DataMatrixGeneratorModule
    ],
    providers:[
        
    ]
})
export class DataMatrixGeneratorAllModule { }