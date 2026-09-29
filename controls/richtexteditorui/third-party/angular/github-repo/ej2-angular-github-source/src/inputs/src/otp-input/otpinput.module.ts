import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from './otpinput.component';

const OTPINPUT_DIRECTIVES = [
    OtpInputComponent
];

/**
 * NgModule definition for the OtpInput component.
 * Re-exports standalone OtpInput component and directives so existing apps can keep using:
 * `imports: [OtpInputModule]`
 */
@NgModule({
    imports: [CommonModule, ...OTPINPUT_DIRECTIVES],
    exports: [...OTPINPUT_DIRECTIVES]
})
export class OtpInputModule { }