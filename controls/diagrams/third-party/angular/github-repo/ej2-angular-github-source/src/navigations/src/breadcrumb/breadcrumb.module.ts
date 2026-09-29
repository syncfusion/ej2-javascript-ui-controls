import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbItemDirective, BreadcrumbItemsDirective } from './items.directive';
import { BreadcrumbComponent } from './breadcrumb.component';

const BREADCRUMB_DIRECTIVES = [
    BreadcrumbComponent,
        BreadcrumbItemDirective,
        BreadcrumbItemsDirective
];

/**
 * NgModule definition for the Breadcrumb component.
 * Re-exports standalone Breadcrumb component and directives so existing apps can keep using:
 * `imports: [BreadcrumbModule]`
 */
@NgModule({
    imports: [CommonModule, ...BREADCRUMB_DIRECTIVES],
    exports: [...BREADCRUMB_DIRECTIVES]
})
export class BreadcrumbModule { }