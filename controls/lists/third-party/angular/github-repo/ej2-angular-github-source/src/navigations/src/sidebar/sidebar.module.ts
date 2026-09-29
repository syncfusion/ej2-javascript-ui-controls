import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';

const SIDEBAR_DIRECTIVES = [
    SidebarComponent
];

/**
 * NgModule definition for the Sidebar component.
 * Re-exports standalone Sidebar component and directives so existing apps can keep using:
 * `imports: [SidebarModule]`
 */
@NgModule({
    imports: [CommonModule, ...SIDEBAR_DIRECTIVES],
    exports: [...SIDEBAR_DIRECTIVES]
})
export class SidebarModule { }