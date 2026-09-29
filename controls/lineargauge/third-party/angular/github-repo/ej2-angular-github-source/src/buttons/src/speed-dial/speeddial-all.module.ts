import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDialItemDirective, SpeedDialItemsDirective } from './items.directive';
import { SpeedDialComponent } from './speeddial.component';
import { SpeedDialModule } from './speeddial.module';





/**
 * NgModule definition for the SpeedDial component with providers.
 */
@NgModule({
    imports: [CommonModule, SpeedDialModule],
    exports: [
        SpeedDialModule
    ],
    providers:[
        
    ]
})
export class SpeedDialAllModule { }