import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDirective, ItemsDirective } from './items.directive';
import { TimelineComponent } from './timeline.component';
import { TimelineModule } from './timeline.module';





/**
 * NgModule definition for the Timeline component with providers.
 */
@NgModule({
    imports: [CommonModule, TimelineModule],
    exports: [
        TimelineModule
    ],
    providers:[
        
    ]
})
export class TimelineAllModule { }