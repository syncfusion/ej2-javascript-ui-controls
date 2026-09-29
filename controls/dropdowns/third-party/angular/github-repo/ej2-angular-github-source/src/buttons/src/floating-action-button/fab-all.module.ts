import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabComponent } from './fab.component';
import { FabModule } from './fab.module';





/**
 * NgModule definition for the Fab component with providers.
 */
@NgModule({
    imports: [CommonModule, FabModule],
    exports: [
        FabModule
    ],
    providers:[
        
    ]
})
export class FabAllModule { }