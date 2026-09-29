import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItemDirective, AccordionItemsDirective } from './items.directive';
import { AccordionComponent } from './accordion.component';

const ACCORDION_DIRECTIVES = [
    AccordionComponent,
        AccordionItemDirective,
        AccordionItemsDirective
];

/**
 * NgModule definition for the Accordion component.
 * Re-exports standalone Accordion component and directives so existing apps can keep using:
 * `imports: [AccordionModule]`
 */
@NgModule({
    imports: [CommonModule, ...ACCORDION_DIRECTIVES],
    exports: [...ACCORDION_DIRECTIVES]
})
export class AccordionModule { }