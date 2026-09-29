import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature.component';
import { SignatureModule } from './signature.module';





/**
 * NgModule definition for the Signature component with providers.
 */
@NgModule({
    imports: [CommonModule, SignatureModule],
    exports: [
        SignatureModule
    ],
    providers:[
        
    ]
})
export class SignatureAllModule { }