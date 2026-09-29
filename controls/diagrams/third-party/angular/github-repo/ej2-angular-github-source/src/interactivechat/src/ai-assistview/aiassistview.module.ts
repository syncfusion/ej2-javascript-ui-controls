import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDirective, ViewsDirective } from './views.directive';
import { AIAssistViewComponent } from './aiassistview.component';

const AIASSISTVIEW_DIRECTIVES = [
    AIAssistViewComponent,
        ViewDirective,
        ViewsDirective
];

/**
 * NgModule definition for the AIAssistView component.
 * Re-exports standalone AIAssistView component and directives so existing apps can keep using:
 * `imports: [AIAssistViewModule]`
 */
@NgModule({
    imports: [CommonModule, ...AIASSISTVIEW_DIRECTIVES],
    exports: [...AIASSISTVIEW_DIRECTIVES]
})
export class AIAssistViewModule { }