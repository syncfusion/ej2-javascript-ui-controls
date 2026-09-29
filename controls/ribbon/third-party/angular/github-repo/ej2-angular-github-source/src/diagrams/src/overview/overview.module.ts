import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';

const OVERVIEW_DIRECTIVES = [
    OverviewComponent
];

/**
 * NgModule definition for the Overview component.
 * Re-exports standalone Overview component and directives so existing apps can keep using:
 * `imports: [OverviewModule]`
 */
@NgModule({
    imports: [CommonModule, ...OVERVIEW_DIRECTIVES],
    exports: [...OVERVIEW_DIRECTIVES]
})
export class OverviewModule { }