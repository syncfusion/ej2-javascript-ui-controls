import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechToTextComponent } from './speechtotext.component';
import { SpeechToTextModule } from './speechtotext.module';





/**
 * NgModule definition for the SpeechToText component with providers.
 */
@NgModule({
    imports: [CommonModule, SpeechToTextModule],
    exports: [
        SpeechToTextModule
    ],
    providers:[
        
    ]
})
export class SpeechToTextAllModule { }