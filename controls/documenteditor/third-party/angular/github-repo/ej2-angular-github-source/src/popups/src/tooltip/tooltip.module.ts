import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';

const TOOLTIP_DIRECTIVES = [
    TooltipComponent
];

/**
 * NgModule definition for the Tooltip component.
 * Re-exports standalone Tooltip component and directives so existing apps can keep using:
 * `imports: [TooltipModule]`
 */
@NgModule({
    imports: [CommonModule, ...TOOLTIP_DIRECTIVES],
    exports: [...TOOLTIP_DIRECTIVES]
})
export class TooltipModule { }