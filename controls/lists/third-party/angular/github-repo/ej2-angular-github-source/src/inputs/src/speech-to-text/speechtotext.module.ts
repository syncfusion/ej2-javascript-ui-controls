import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechToTextComponent } from './speechtotext.component';

const SPEECHTOTEXT_DIRECTIVES = [
    SpeechToTextComponent
];

/**
 * NgModule definition for the SpeechToText component.
 * Re-exports standalone SpeechToText component and directives so existing apps can keep using:
 * `imports: [SpeechToTextModule]`
 */
@NgModule({
    imports: [CommonModule, ...SPEECHTOTEXT_DIRECTIVES],
    exports: [...SPEECHTOTEXT_DIRECTIVES]
})
export class SpeechToTextModule { }