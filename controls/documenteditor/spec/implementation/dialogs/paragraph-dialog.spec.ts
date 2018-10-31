import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { ParagraphDialog } from '../../../src/document-editor/implementation/dialogs/paragraph-dialog';
import { SelectionParagraphFormat } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { ContextMenu } from '../../../src/document-editor/implementation/context-menu';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';

/**
 * Paragraph dialog spec
 */
/* tslint:disable */
describe('Paragraph Dialog Test Case Validation', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show()
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragaraph Dialog testing', function () {
        dialog.loadParagraphDialog();
    });
    it('On Insert Button testing', function () {
        dialog.applyParagraphFormat();
    });
    it('On Cancel Button testing', function () {
        dialog.closeParagraphDialog();
    });
});

describe('Load Paragraph Format Dialog Test Case Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragraph Format Index 0 testing', function () {
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.textAlignment = 'Center';
        dialog.loadParagraphDialog();
    });
    it('Load Paragraph Format Index 1 testing', function () {
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.textAlignment = 'Left';
        selectionParaFormat.lineSpacingType = 'AtLeast';
        dialog.loadParagraphDialog();
    });
    it('Apply Paragraph format', () => {
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion software', false);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion software', false);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion software', false);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion software', false);
        editor.editorModule.onEnter();
        editor.selection.selectAll();
        dialog.loadParagraphDialog();
        (dialog as any).alignment.index = 2;
        dialog.applyParagraphFormat();
        // expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
        editor.editorHistory.undo();
        // expect(editor.selection.paragraphFormat.textAlignment).not.toBe('Right');
        editor.editorHistory.redo();
        // expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
    });
});

describe('Paragraph Format Dialog Load Test Case Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragraph Format Index 2 testing', function () {
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.textAlignment = 'Right';
        selectionParaFormat.lineSpacingType = 'Exactly';
        dialog.loadParagraphDialog();
    });
    it('Load Paragraph Format Index 3 testing', function () {
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.textAlignment = 'Justify';
        selectionParaFormat.lineSpacingType = 'Multiple';
        dialog.loadParagraphDialog();
    });
});


describe('Apply Paragraph Format Dialog Test Case Validation', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply Paragraph Format Index 0 testing', function () {
        let align: any = (dialog as any).alignment;
        align.index = 0;
        dialog.applyParagraphFormat();
    });
    it('Apply Paragraph Format Index 1 testing', function () {
        let align: any = (dialog as any).alignment;
        align.index = 1;
        let lineSpace: any = (dialog as any).lineSpacing;
        lineSpace.index = 0;
        dialog.applyParagraphFormat();
    });
});

describe('Paragraph Format Apply Dialog Test Case Validation', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply Paragraph Format Index 2 testing', function () {
        let align: any = (dialog as any).alignment;
        align.index = 2;
        let lineSpace: any = (dialog as any).lineSpacing;
        lineSpace.index = 1;
        dialog.applyParagraphFormat();
    });
    it('Apply Paragraph Format Index 3 testing', function () {
        let align: any = (dialog as any).alignment;
        align.index = 3;
        let lineSpace: any = (dialog as any).lineSpacing;
        lineSpace.index = 2;
        dialog.applyParagraphFormat();
    });
    it('Apply Paragraph Format Destory testing', function () {
        (dialog as any).target = createElement('div');
        dialog.destroy();
    });
});

describe('Paragraph Format Dialog Test Case Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    let menu: ContextMenu;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, ContextMenu, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableContextMenu: true });
        editor.enableEditorHistory = true;
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule;
        menu = editor.contextMenu;
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Paragraph Dialog Show testing', function () {
        (dialog as any).target = undefined;
        dialog.show();
    });
    it('Load Paragraph Dialog Using Context Menu testing', function () {
        menu.handleContextMenuItem('container_contextmenu_paragraph_dialog');
    });
});

describe('Dialog Test Case using event Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragraph Index 0 testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        (dialog as any).special.index = 0;
        selectionParaFormat.firstLineIndent = 0;
        dialog.changeByValue(changeEvent);
    });
    it('Load Paragraph Format Index 0 else testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 25;
        (dialog as any).special.index = 0;
        dialog.changeByValue(changeEvent);
    });
});

describe('Dialog Test Case using event second Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragraph Format Index 1 else testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = undefined;
        (dialog as any).special.index = 1;
        dialog.changeByValue(changeEvent);
    });
    it('Load Paragraph Format Index 1 else testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = -2;
        (dialog as any).special.index = 1;
        dialog.changeByValue(changeEvent);
    });
    it('Load Paragraph Index 1 testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 0;
        (dialog as any).special.index = 1;
        dialog.changeByValue(changeEvent);
    });
});

describe('Dialog Test Case using event third Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragraph Format Index 1 else testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = undefined;
        (dialog as any).special.index = 2;
        dialog.changeByValue(changeEvent);
    });
    it('Load Paragraph Format Index 1 else testing', function () {
        let changeEvent: any;
        changeEvent = { preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        changeEvent.target = (dialog as any).alignment;
        changeEvent.target.index = 2;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = -2;
        (dialog as any).special.index = 2;
        dialog.changeByValue(changeEvent);
    });
    it('Load Paragraph Index 1 testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 0;
        (dialog as any).special.index = 2;
        dialog.changeByValue(changeEvent);
    });
});

describe('Dialog Test Case using event third Validation', function () {
    let selectionParaFormat: SelectionParagraphFormat;
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        selectionParaFormat = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Paragraph Format Index 1 else testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 48;
        (dialog as any).special.index = 1;
        dialog.changeByValue(changeEvent);
    });
    it('Load Paragraph Format Index 2 else testing', function () {
        let changeEvent: any;
        selectionParaFormat = editor.viewer.selection.paragraphFormat;
        selectionParaFormat.firstLineIndent = 48;
        (dialog as any).special.index = 1;
        dialog.changeByValue(changeEvent);
    });
});

describe('Paragraph Format show and destroy Test Case Validation', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply Paragraph Format Index 2 testing', function () {
        dialog.show();
    });
    it('Apply Paragraph Format Destory testing', function () {
        (dialog as any).target = createElement('div');
        document.body.appendChild((dialog as any).target);
        dialog.destroy();
    });
});

describe('Paragraph format change by space Test Case Validation', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply Paragraph Format Index 0 testing', function () {
        let changeEvent: any;
        (dialog as any).lineSpacing.index = 0;
        dialog.changeBySpacing(changeEvent);
    });
    it('Apply Paragraph Format Index 1 testing', function () {
        let changeEvent: any;
        (dialog as any).lineSpacing.index = 1;
        dialog.changeBySpacing(changeEvent);
    });
    it('Apply Paragraph Format Index 1 testing', function () {
        let changeEvent: any;
        (dialog as any).lineSpacing.index = 2;
        dialog.changeBySpacing(changeEvent);
    });
});


describe('Paragraph format-before spacing Applying validation via dialog in empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Before spacing applying validation', function () {
        editor.editor.insertText('Sample', false);
        let height = editor.selection.start.paragraph.height;
        dialog.show();
        (dialog as any).beforeSpacingIn.value = 48;
        let event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeBeforeSpacing(event);
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.height).toBeGreaterThan(48);
    });

    it('After before spacing via paragraph dialog-undo validation', function () {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.height).toBeLessThan(48);
    });
    it('After before spacing via paragraph dialog-Redo validation', function () {
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.height).toBeGreaterThan(48);
    });

    it('After before spacing via paragraph dialog-Multiple undo and redo validation', function () {

        for(let i:number=0;i<5;i++){
            editor.editorHistory.undo();         
            editor.editorHistory.redo();         
        }        
        editor.editorHistory.undo();   
        expect(editor.selection.start.paragraph.height).toBeLessThan(48);
    });


});

describe('Paragraph format-before spacing and left Indent Applying validation via dialog in empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Before spacing applying validation', function () {
        editor.editor.insertText('Sample', false);
        let height = editor.selection.start.paragraph.height;
        dialog.show();
        let event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeBeforeSpacing(event);        
        event= { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeLeftIndent(event);        
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.x).not.toBe(96);
    });

    it('After left indent via paragraph dialog-undo validation', function () {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.x).toBe(96);
    });
    it('After left indent via paragraph dialog-Redo validation', function () {
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.x).not.toBe(96);        
    });
    it('After left indent via paragraph dialog-Multiple undo and redo validation', function () {

        for(let i:number=0;i<5;i++){
            editor.editorHistory.undo();         
            editor.editorHistory.redo();         
        }    
        editor.editorHistory.undo();        
        expect(editor.selection.start.paragraph.x).toBe(96);
    });


});

describe('Paragraph format-after spacing and left Indent Applying validation via dialog in empty selection', function () {
    let editor: DocumentEditor;
    let dialog: ParagraphDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ParagraphDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableParagraphDialog = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.paragraphDialogModule
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('after spacing applying validation', function () {
        editor.editor.insertText('Sample', false);
        let height = editor.selection.start.paragraph.height;
        dialog.show();        
        let event = { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeBeforeSpacing(event);        
        event= { value: 48, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeLeftIndent(event);  
        event= { value: 20, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        (dialog as any).changeAfterSpacing(event);         
        dialog.applyParagraphFormat();
        expect(editor.selection.start.paragraph.height).toBeGreaterThanOrEqual(48);
    });

    it('After after spacing via paragraph dialog- undo validation', function () {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.height).toBeLessThan(48);
    });
    it('After after spacing via paragraph dialog- Redo validation', function () {
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.height).toBeGreaterThanOrEqual(48);
    });
    it('After after spacing via paragraph dialog-Multiple undo and redo validation', function () {

        for(let i:number=0;i<5;i++){
            editor.editorHistory.undo();         
            editor.editorHistory.redo();         
        }    
        editor.editorHistory.undo();        
        expect(editor.selection.start.paragraph.height).toBeLessThan(48);
    });

});