import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineAIAssistComponent } from './inlineaiassist.component';

const INLINEAIASSIST_DIRECTIVES = [
    InlineAIAssistComponent
];

/**
 * NgModule definition for the InlineAIAssist component.
 * Re-exports standalone InlineAIAssist component and directives so existing apps can keep using:
 * `imports: [InlineAIAssistModule]`
 */
@NgModule({
    imports: [CommonModule, ...INLINEAIASSIST_DIRECTIVES],
    exports: [...INLINEAIASSIST_DIRECTIVES]
})
export class InlineAIAssistModule { }