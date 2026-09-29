import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelDirective, PanelsDirective } from './panels.directive';
import { DashboardLayoutComponent } from './dashboardlayout.component';
import { DashboardLayoutModule } from './dashboardlayout.module';





/**
 * NgModule definition for the DashboardLayout component with providers.
 */
@NgModule({
    imports: [CommonModule, DashboardLayoutModule],
    exports: [
        DashboardLayoutModule
    ],
    providers:[
        
    ]
})
export class DashboardLayoutAllModule { }