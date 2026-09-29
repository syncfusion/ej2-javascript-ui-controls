import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from './switch.component';
import { SwitchModule } from './switch.module';





/**
 * NgModule definition for the Switch component with providers.
 */
@NgModule({
    imports: [CommonModule, SwitchModule],
    exports: [
        SwitchModule
    ],
    providers:[
        
    ]
})
export class SwitchAllModule { }