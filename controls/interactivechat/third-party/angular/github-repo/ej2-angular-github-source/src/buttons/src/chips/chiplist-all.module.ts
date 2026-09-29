import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipDirective, ChipsDirective } from './chips.directive';
import { ChipListComponent } from './chiplist.component';
import { ChipListModule } from './chiplist.module';





/**
 * NgModule definition for the ChipList component with providers.
 */
@NgModule({
    imports: [CommonModule, ChipListModule],
    exports: [
        ChipListModule
    ],
    providers:[
        
    ]
})
export class ChipListAllModule { }