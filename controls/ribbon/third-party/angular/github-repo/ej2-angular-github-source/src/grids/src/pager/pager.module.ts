import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './pager.component';

const PAGER_DIRECTIVES = [
    PagerComponent
];

/**
 * NgModule definition for the Pager component.
 * Re-exports standalone Pager component and directives so existing apps can keep using:
 * `imports: [PagerModule]`
 */
@NgModule({
    imports: [CommonModule, ...PAGER_DIRECTIVES],
    exports: [...PAGER_DIRECTIVES]
})
export class PagerModule { }