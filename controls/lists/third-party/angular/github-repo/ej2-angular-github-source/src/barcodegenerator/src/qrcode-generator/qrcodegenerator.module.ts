import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeGeneratorComponent } from './qrcodegenerator.component';

const QRCODEGENERATOR_DIRECTIVES = [
    QRCodeGeneratorComponent
];

/**
 * NgModule definition for the QRCodeGenerator component.
 * Re-exports standalone QRCodeGenerator component and directives so existing apps can keep using:
 * `imports: [QRCodeGeneratorModule]`
 */
@NgModule({
    imports: [CommonModule, ...QRCODEGENERATOR_DIRECTIVES],
    exports: [...QRCODEGENERATOR_DIRECTIVES]
})
export class QRCodeGeneratorModule { }