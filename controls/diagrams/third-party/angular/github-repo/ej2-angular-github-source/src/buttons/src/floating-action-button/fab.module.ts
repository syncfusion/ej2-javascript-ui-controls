import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabComponent } from './fab.component';

const FAB_DIRECTIVES = [
    FabComponent
];

/**
 * NgModule definition for the Fab component.
 * Re-exports standalone Fab component and directives so existing apps can keep using:
 * `imports: [FabModule]`
 */
@NgModule({
    imports: [CommonModule, ...FAB_DIRECTIVES],
    exports: [...FAB_DIRECTIVES]
})
export class FabModule { }