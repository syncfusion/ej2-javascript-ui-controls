import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipModule } from './tooltip.module';





/**
 * NgModule definition for the Tooltip component with providers.
 */
@NgModule({
    imports: [CommonModule, TooltipModule],
    exports: [
        TooltipModule
    ],
    providers:[
        
    ]
})
export class TooltipAllModule { }