import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDirective, ViewsDirective } from './views.directive';
import { AIAssistViewComponent } from './aiassistview.component';
import { AIAssistViewModule } from './aiassistview.module';
import {AssistThinking} from '@syncfusion/ej2-interactive-chat'


export const AssistThinkingService: ValueProvider = { provide: 'Interactive-ChatAssistThinking', useValue: AssistThinking};

/**
 * NgModule definition for the AIAssistView component with providers.
 */
@NgModule({
    imports: [CommonModule, AIAssistViewModule],
    exports: [
        AIAssistViewModule
    ],
    providers:[
        AssistThinkingService
    ]
})
export class AIAssistViewAllModule { }