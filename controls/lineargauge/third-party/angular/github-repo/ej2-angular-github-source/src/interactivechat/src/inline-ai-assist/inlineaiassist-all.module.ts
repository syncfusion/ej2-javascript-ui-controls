import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineAIAssistComponent } from './inlineaiassist.component';
import { InlineAIAssistModule } from './inlineaiassist.module';





/**
 * NgModule definition for the InlineAIAssist component with providers.
 */
@NgModule({
    imports: [CommonModule, InlineAIAssistModule],
    exports: [
        InlineAIAssistModule
    ],
    providers:[
        
    ]
})
export class InlineAIAssistAllModule { }