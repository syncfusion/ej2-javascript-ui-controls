import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaneDirective, PanesDirective } from './panesettings.directive';
import { SplitterComponent } from './splitter.component';

const SPLITTER_DIRECTIVES = [
    SplitterComponent,
        PaneDirective,
        PanesDirective
];

/**
 * NgModule definition for the Splitter component.
 * Re-exports standalone Splitter component and directives so existing apps can keep using:
 * `imports: [SplitterModule]`
 */
@NgModule({
    imports: [CommonModule, ...SPLITTER_DIRECTIVES],
    exports: [...SPLITTER_DIRECTIVES]
})
export class SplitterModule { }