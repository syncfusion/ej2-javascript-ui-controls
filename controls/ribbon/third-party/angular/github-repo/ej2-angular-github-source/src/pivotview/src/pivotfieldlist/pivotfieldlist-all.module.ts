import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotFieldListComponent } from './pivotfieldlist.component';
import { PivotFieldListModule } from './pivotfieldlist.module';





/**
 * NgModule definition for the PivotFieldList component with providers.
 */
@NgModule({
    imports: [CommonModule, PivotFieldListModule],
    exports: [
        PivotFieldListModule
    ],
    providers:[
        
    ]
})
export class PivotFieldListAllModule { }