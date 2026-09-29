import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItemDirective, AccordionItemsDirective } from './items.directive';
import { AccordionComponent } from './accordion.component';
import { AccordionModule } from './accordion.module';





/**
 * NgModule definition for the Accordion component with providers.
 */
@NgModule({
    imports: [CommonModule, AccordionModule],
    exports: [
        AccordionModule
    ],
    providers:[
        
    ]
})
export class AccordionAllModule { }