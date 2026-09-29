import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDialItemDirective, SpeedDialItemsDirective } from './items.directive';
import { SpeedDialComponent } from './speeddial.component';

const SPEEDDIAL_DIRECTIVES = [
    SpeedDialComponent,
        SpeedDialItemDirective,
        SpeedDialItemsDirective
];

/**
 * NgModule definition for the SpeedDial component.
 * Re-exports standalone SpeedDial component and directives so existing apps can keep using:
 * `imports: [SpeedDialModule]`
 */
@NgModule({
    imports: [CommonModule, ...SPEEDDIAL_DIRECTIVES],
    exports: [...SPEEDDIAL_DIRECTIVES]
})
export class SpeedDialModule { }