import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature.component';

const SIGNATURE_DIRECTIVES = [
    SignatureComponent
];

/**
 * NgModule definition for the Signature component.
 * Re-exports standalone Signature component and directives so existing apps can keep using:
 * `imports: [SignatureModule]`
 */
@NgModule({
    imports: [CommonModule, ...SIGNATURE_DIRECTIVES],
    exports: [...SIGNATURE_DIRECTIVES]
})
export class SignatureModule { }