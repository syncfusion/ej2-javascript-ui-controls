import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownTreeComponent } from './dropdowntree.component';
import { DropDownTreeModule } from './dropdowntree.module';





/**
 * NgModule definition for the DropDownTree component with providers.
 */
@NgModule({
    imports: [CommonModule, DropDownTreeModule],
    exports: [
        DropDownTreeModule
    ],
    providers:[
        
    ]
})
export class DropDownTreeAllModule { }