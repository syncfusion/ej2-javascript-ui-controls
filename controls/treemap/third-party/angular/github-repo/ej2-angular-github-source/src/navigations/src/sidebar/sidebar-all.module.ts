import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SidebarModule } from './sidebar.module';





/**
 * NgModule definition for the Sidebar component with providers.
 */
@NgModule({
    imports: [CommonModule, SidebarModule],
    exports: [
        SidebarModule
    ],
    providers:[
        
    ]
})
export class SidebarAllModule { }