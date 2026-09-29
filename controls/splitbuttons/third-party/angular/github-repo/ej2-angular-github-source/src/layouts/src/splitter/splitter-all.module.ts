import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaneDirective, PanesDirective } from './panesettings.directive';
import { SplitterComponent } from './splitter.component';
import { SplitterModule } from './splitter.module';





/**
 * NgModule definition for the Splitter component with providers.
 */
@NgModule({
    imports: [CommonModule, SplitterModule],
    exports: [
        SplitterModule
    ],
    providers:[
        
    ]
})
export class SplitterAllModule { }