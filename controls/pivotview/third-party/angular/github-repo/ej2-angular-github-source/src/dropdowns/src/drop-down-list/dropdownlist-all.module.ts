import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListComponent } from './dropdownlist.component';
import { DropDownListModule } from './dropdownlist.module';
import {VirtualScroll} from '@syncfusion/ej2-dropdowns'


export const VirtualScrollService: ValueProvider = { provide: 'DropDownsVirtualScroll', useValue: VirtualScroll};

/**
 * NgModule definition for the DropDownList component with providers.
 */
@NgModule({
    imports: [CommonModule, DropDownListModule],
    exports: [
        DropDownListModule
    ],
    providers:[
        VirtualScrollService
    ]
})
export class DropDownListAllModule { }