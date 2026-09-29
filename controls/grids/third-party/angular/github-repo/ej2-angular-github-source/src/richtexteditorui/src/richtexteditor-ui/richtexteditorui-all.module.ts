import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorUIComponent } from './richtexteditorui.component';
import { RichTextEditorUIModule } from './richtexteditorui.module';
import {SlashCommand} from '@syncfusion/ej2-richtexteditor-ui'


export const SlashCommandService: ValueProvider = { provide: 'RichTextEditor-UISlashCommand', useValue: SlashCommand};

/**
 * NgModule definition for the RichTextEditorUI component with providers.
 */
@NgModule({
    imports: [CommonModule, RichTextEditorUIModule],
    exports: [
        RichTextEditorUIModule
    ],
    providers:[
        SlashCommandService
    ]
})
export class RichTextEditorUIAllModule { }