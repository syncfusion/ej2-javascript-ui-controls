import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeGeneratorComponent } from './barcodegenerator.component';
import { BarcodeGeneratorModule } from './barcodegenerator.module';





/**
 * NgModule definition for the BarcodeGenerator component with providers.
 */
@NgModule({
    imports: [CommonModule, BarcodeGeneratorModule],
    exports: [
        BarcodeGeneratorModule
    ],
    providers:[
        
    ]
})
export class BarcodeGeneratorAllModule { }