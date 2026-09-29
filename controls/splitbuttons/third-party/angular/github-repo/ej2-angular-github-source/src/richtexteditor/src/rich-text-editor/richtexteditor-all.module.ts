import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './richtexteditor.component';
import { RichTextEditorModule } from './richtexteditor.module';
import {Toolbar, Link, Image, ImportExport, Audio, Video, Count, QuickToolbar, HtmlEditor, MarkdownEditor, Table, PasteCleanup, Resize, FileManager, FormatPainter, EmojiPicker, SlashMenu, CodeBlock, ClipBoardCleanup, AutoFormat, AIAssistant} from '@syncfusion/ej2-richtexteditor'


export const ToolbarService: ValueProvider = { provide: 'RichTextEditorToolbar', useValue: Toolbar};
export const LinkService: ValueProvider = { provide: 'RichTextEditorLink', useValue: Link};
export const ImageService: ValueProvider = { provide: 'RichTextEditorImage', useValue: Image};
export const ImportExportService: ValueProvider = { provide: 'RichTextEditorImportExport', useValue: ImportExport};
export const AudioService: ValueProvider = { provide: 'RichTextEditorAudio', useValue: Audio};
export const VideoService: ValueProvider = { provide: 'RichTextEditorVideo', useValue: Video};
export const CountService: ValueProvider = { provide: 'RichTextEditorCount', useValue: Count};
export const QuickToolbarService: ValueProvider = { provide: 'RichTextEditorQuickToolbar', useValue: QuickToolbar};
export const HtmlEditorService: ValueProvider = { provide: 'RichTextEditorHtmlEditor', useValue: HtmlEditor};
export const MarkdownEditorService: ValueProvider = { provide: 'RichTextEditorMarkdownEditor', useValue: MarkdownEditor};
export const TableService: ValueProvider = { provide: 'RichTextEditorTable', useValue: Table};
export const PasteCleanupService: ValueProvider = { provide: 'RichTextEditorPasteCleanup', useValue: PasteCleanup};
export const ResizeService: ValueProvider = { provide: 'RichTextEditorResize', useValue: Resize};
export const FileManagerService: ValueProvider = { provide: 'RichTextEditorFileManager', useValue: FileManager};
export const FormatPainterService: ValueProvider = { provide: 'RichTextEditorFormatPainter', useValue: FormatPainter};
export const EmojiPickerService: ValueProvider = { provide: 'RichTextEditorEmojiPicker', useValue: EmojiPicker};
export const SlashMenuService: ValueProvider = { provide: 'RichTextEditorSlashMenu', useValue: SlashMenu};
export const CodeBlockService: ValueProvider = { provide: 'RichTextEditorCodeBlock', useValue: CodeBlock};
export const ClipBoardCleanupService: ValueProvider = { provide: 'RichTextEditorClipBoardCleanup', useValue: ClipBoardCleanup};
export const AutoFormatService: ValueProvider = { provide: 'RichTextEditorAutoFormat', useValue: AutoFormat};
export const AIAssistantService: ValueProvider = { provide: 'RichTextEditorAIAssistant', useValue: AIAssistant};

/**
 * NgModule definition for the RichTextEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, RichTextEditorModule],
    exports: [
        RichTextEditorModule
    ],
    providers:[
        ToolbarService,
        LinkService,
        ImageService,
        ImportExportService,
        AudioService,
        VideoService,
        CountService,
        QuickToolbarService,
        HtmlEditorService,
        MarkdownEditorService,
        TableService,
        PasteCleanupService,
        ResizeService,
        FileManagerService,
        FormatPainterService,
        EmojiPickerService,
        SlashMenuService,
        CodeBlockService,
        ClipBoardCleanupService,
        AutoFormatService,
        AIAssistantService
    ]
})
export class RichTextEditorAllModule { }