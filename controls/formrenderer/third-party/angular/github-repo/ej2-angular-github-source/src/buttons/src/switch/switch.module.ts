import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from './switch.component';

const SWITCH_DIRECTIVES = [
    SwitchComponent
];

/**
 * NgModule definition for the Switch component.
 * Re-exports standalone Switch component and directives so existing apps can keep using:
 * `imports: [SwitchModule]`
 */
@NgModule({
    imports: [CommonModule, ...SWITCH_DIRECTIVES],
    exports: [...SWITCH_DIRECTIVES]
})
export class SwitchModule { }