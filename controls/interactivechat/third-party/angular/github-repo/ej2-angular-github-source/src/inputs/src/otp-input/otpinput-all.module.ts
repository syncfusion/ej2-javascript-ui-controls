import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from './otpinput.component';
import { OtpInputModule } from './otpinput.module';





/**
 * NgModule definition for the OtpInput component with providers.
 */
@NgModule({
    imports: [CommonModule, OtpInputModule],
    exports: [
        OtpInputModule
    ],
    providers:[
        
    ]
})
export class OtpInputAllModule { }