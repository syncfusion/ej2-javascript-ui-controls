import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbItemDirective, BreadcrumbItemsDirective } from './items.directive';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbModule } from './breadcrumb.module';





/**
 * NgModule definition for the Breadcrumb component with providers.
 */
@NgModule({
    imports: [CommonModule, BreadcrumbModule],
    exports: [
        BreadcrumbModule
    ],
    providers:[
        
    ]
})
export class BreadcrumbAllModule { }