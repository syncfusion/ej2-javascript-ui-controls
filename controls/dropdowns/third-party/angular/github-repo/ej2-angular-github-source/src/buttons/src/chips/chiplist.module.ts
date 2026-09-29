import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipDirective, ChipsDirective } from './chips.directive';
import { ChipListComponent } from './chiplist.component';

const CHIPLIST_DIRECTIVES = [
    ChipListComponent,
        ChipDirective,
        ChipsDirective
];

/**
 * NgModule definition for the ChipList component.
 * Re-exports standalone ChipList component and directives so existing apps can keep using:
 * `imports: [ChipListModule]`
 */
@NgModule({
    imports: [CommonModule, ...CHIPLIST_DIRECTIVES],
    exports: [...CHIPLIST_DIRECTIVES]
})
export class ChipListModule { }