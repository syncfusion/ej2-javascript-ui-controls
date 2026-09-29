import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { ButtonModule } from './button.module';





/**
 * NgModule definition for the Button component with providers.
 */
@NgModule({
    imports: [CommonModule, ButtonModule],
    exports: [
        ButtonModule
    ],
    providers:[
        
    ]
})
export class ButtonAllModule { }