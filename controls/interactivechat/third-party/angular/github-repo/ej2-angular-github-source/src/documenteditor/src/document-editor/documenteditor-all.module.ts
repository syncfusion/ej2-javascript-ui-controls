import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorComponent } from './documenteditor.component';
import { DocumentEditorModule } from './documenteditor.module';
import {Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, EditorHistory, OptionsPane, ContextMenu, ImageResizer, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, StylesDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, SpellChecker, SpellCheckDialog, CollaborativeEditing, ColumnsDialog, CollaborativeEditingHandler, Optimized, TabDialog, TextFormFieldDialog, DropDownFormFieldDialog, CheckBoxFormFieldDialog} from '@syncfusion/ej2-documenteditor'


export const PrintService: ValueProvider = { provide: 'DocumentEditorPrint', useValue: Print};
export const SfdtExportService: ValueProvider = { provide: 'DocumentEditorSfdtExport', useValue: SfdtExport};
export const WordExportService: ValueProvider = { provide: 'DocumentEditorWordExport', useValue: WordExport};
export const TextExportService: ValueProvider = { provide: 'DocumentEditorTextExport', useValue: TextExport};
export const SelectionService: ValueProvider = { provide: 'DocumentEditorSelection', useValue: Selection};
export const SearchService: ValueProvider = { provide: 'DocumentEditorSearch', useValue: Search};
export const EditorService: ValueProvider = { provide: 'DocumentEditorEditor', useValue: Editor};
export const EditorHistoryService: ValueProvider = { provide: 'DocumentEditorEditorHistory', useValue: EditorHistory};
export const OptionsPaneService: ValueProvider = { provide: 'DocumentEditorOptionsPane', useValue: OptionsPane};
export const ContextMenuService: ValueProvider = { provide: 'DocumentEditorContextMenu', useValue: ContextMenu};
export const ImageResizerService: ValueProvider = { provide: 'DocumentEditorImageResizer', useValue: ImageResizer};
export const HyperlinkDialogService: ValueProvider = { provide: 'DocumentEditorHyperlinkDialog', useValue: HyperlinkDialog};
export const TableDialogService: ValueProvider = { provide: 'DocumentEditorTableDialog', useValue: TableDialog};
export const BookmarkDialogService: ValueProvider = { provide: 'DocumentEditorBookmarkDialog', useValue: BookmarkDialog};
export const TableOfContentsDialogService: ValueProvider = { provide: 'DocumentEditorTableOfContentsDialog', useValue: TableOfContentsDialog};
export const PageSetupDialogService: ValueProvider = { provide: 'DocumentEditorPageSetupDialog', useValue: PageSetupDialog};
export const ParagraphDialogService: ValueProvider = { provide: 'DocumentEditorParagraphDialog', useValue: ParagraphDialog};
export const ListDialogService: ValueProvider = { provide: 'DocumentEditorListDialog', useValue: ListDialog};
export const StyleDialogService: ValueProvider = { provide: 'DocumentEditorStyleDialog', useValue: StyleDialog};
export const StylesDialogService: ValueProvider = { provide: 'DocumentEditorStylesDialog', useValue: StylesDialog};
export const BulletsAndNumberingDialogService: ValueProvider = { provide: 'DocumentEditorBulletsAndNumberingDialog', useValue: BulletsAndNumberingDialog};
export const FontDialogService: ValueProvider = { provide: 'DocumentEditorFontDialog', useValue: FontDialog};
export const TablePropertiesDialogService: ValueProvider = { provide: 'DocumentEditorTablePropertiesDialog', useValue: TablePropertiesDialog};
export const BordersAndShadingDialogService: ValueProvider = { provide: 'DocumentEditorBordersAndShadingDialog', useValue: BordersAndShadingDialog};
export const TableOptionsDialogService: ValueProvider = { provide: 'DocumentEditorTableOptionsDialog', useValue: TableOptionsDialog};
export const CellOptionsDialogService: ValueProvider = { provide: 'DocumentEditorCellOptionsDialog', useValue: CellOptionsDialog};
export const SpellCheckerService: ValueProvider = { provide: 'DocumentEditorSpellChecker', useValue: SpellChecker};
export const SpellCheckDialogService: ValueProvider = { provide: 'DocumentEditorSpellCheckDialog', useValue: SpellCheckDialog};
export const CollaborativeEditingService: ValueProvider = { provide: 'DocumentEditorCollaborativeEditing', useValue: CollaborativeEditing};
export const ColumnsDialogService: ValueProvider = { provide: 'DocumentEditorColumnsDialog', useValue: ColumnsDialog};
export const CollaborativeEditingHandlerService: ValueProvider = { provide: 'DocumentEditorCollaborativeEditingHandler', useValue: CollaborativeEditingHandler};
export const OptimizedService: ValueProvider = { provide: 'DocumentEditorOptimized', useValue: Optimized};
export const TabDialogService: ValueProvider = { provide: 'DocumentEditorTabDialog', useValue: TabDialog};
export const TextFormFieldDialogService: ValueProvider = { provide: 'DocumentEditorTextFormFieldDialog', useValue: TextFormFieldDialog};
export const DropDownFormFieldDialogService: ValueProvider = { provide: 'DocumentEditorDropDownFormFieldDialog', useValue: DropDownFormFieldDialog};
export const CheckBoxFormFieldDialogService: ValueProvider = { provide: 'DocumentEditorCheckBoxFormFieldDialog', useValue: CheckBoxFormFieldDialog};

/**
 * NgModule definition for the DocumentEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, DocumentEditorModule],
    exports: [
        DocumentEditorModule
    ],
    providers:[
        PrintService,
        SfdtExportService,
        WordExportService,
        TextExportService,
        SelectionService,
        SearchService,
        EditorService,
        EditorHistoryService,
        OptionsPaneService,
        ContextMenuService,
        ImageResizerService,
        HyperlinkDialogService,
        TableDialogService,
        BookmarkDialogService,
        TableOfContentsDialogService,
        PageSetupDialogService,
        ParagraphDialogService,
        ListDialogService,
        StyleDialogService,
        StylesDialogService,
        BulletsAndNumberingDialogService,
        FontDialogService,
        TablePropertiesDialogService,
        BordersAndShadingDialogService,
        TableOptionsDialogService,
        CellOptionsDialogService,
        SpellCheckerService,
        SpellCheckDialogService,
        CollaborativeEditingService,
        ColumnsDialogService,
        CollaborativeEditingHandlerService,
        OptimizedService,
        TabDialogService,
        TextFormFieldDialogService,
        DropDownFormFieldDialogService,
        CheckBoxFormFieldDialogService
    ]
})
export class DocumentEditorAllModule { }