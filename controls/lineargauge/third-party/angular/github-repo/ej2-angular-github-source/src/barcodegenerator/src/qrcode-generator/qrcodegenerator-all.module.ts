import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeGeneratorComponent } from './qrcodegenerator.component';
import { QRCodeGeneratorModule } from './qrcodegenerator.module';





/**
 * NgModule definition for the QRCodeGenerator component with providers.
 */
@NgModule({
    imports: [CommonModule, QRCodeGeneratorModule],
    exports: [
        QRCodeGeneratorModule
    ],
    providers:[
        
    ]
})
export class QRCodeGeneratorAllModule { }