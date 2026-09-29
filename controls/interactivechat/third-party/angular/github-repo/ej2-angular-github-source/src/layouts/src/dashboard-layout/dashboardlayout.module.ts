import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelDirective, PanelsDirective } from './panels.directive';
import { DashboardLayoutComponent } from './dashboardlayout.component';

const DASHBOARDLAYOUT_DIRECTIVES = [
    DashboardLayoutComponent,
        PanelDirective,
        PanelsDirective
];

/**
 * NgModule definition for the DashboardLayout component.
 * Re-exports standalone DashboardLayout component and directives so existing apps can keep using:
 * `imports: [DashboardLayoutModule]`
 */
@NgModule({
    imports: [CommonModule, ...DASHBOARDLAYOUT_DIRECTIVES],
    exports: [...DASHBOARDLAYOUT_DIRECTIVES]
})
export class DashboardLayoutModule { }