import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, SfdtExport, DocumentHelper } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { WListLevel } from '../../src/document-editor/implementation/list/list-level';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, FieldElementBox, BodyWidget, ParagraphWidget, HeaderFooters, TextElementBox, TableCellWidget, TableWidget, TableRowWidget, Widget } from '../../src/index';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';
import { HyperlinkDialog } from '../../src/document-editor/implementation/dialogs/hyperlink-dialog';
//editor.documentHelper.onDocumentChanged([createDocument()]);

//#region Paragraph format
/**
 * Editor spec
 */
describe('paragraph format validation with selection including table', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Center alignment Property validation', () => {
console.log('Center alignment Property validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Sample document');
        editor.selection.handleHomeKey();
        editor.selection.handleShiftEndKey();
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        //Bold Property
        event = { keyCode: 69, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).not.toBe('Center');
    });
    it('Center alignment Property validation', () => {
console.log('Center alignment Property validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        editor.editorModule.insertText('Sample document');
        editor.editorModule.insertText('Sample document');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Sample document');
        editor.editorModule.insertText('Sample document');
        editor.editorModule.onEnter();
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        //center alignment Property
        event = { keyCode: 69, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Center');
    });
    it('paragraph inside table paragraph format validation', () => {
console.log('paragraph inside table paragraph format validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        event = { keyCode: 39, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: true, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 69, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).not.toBe('Center');
    });
});
describe('paragraph format validation with selection including table', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('paragraph inside table paragraph format validation', () => {
console.log('paragraph inside table paragraph format validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 69, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).not.toBe('Center');
    });
    it('paragraph nested table paragraph format validation', () => {
console.log('paragraph nested table paragraph format validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editor.insertTable(2, 2);
        event = { keyCode: 40, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 39, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 69, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).not.toBe('Center');
    });


});

describe('paragraph format validation with selection in nested table', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Nested Table validation', () => {
console.log('Nested Table validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Works cycles');
        editor.editorModule.onEnter();
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 66, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 69, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Center');
    });
});

//#endregion

//#region Character Format
/**
 * Editor spec
 */
describe('character format validation font size increment and decrement', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Font size decrement validation', () => {
console.log('Font size decrement validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let prevFontSize = editor.selection.characterFormat.fontSize;
        //increment font size Property
        event = { keyCode: 221, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 221, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.fontSize = 7;
        event = { keyCode: 221, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 219, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.characterFormat.fontSize).not.toBe(prevFontSize);
    });
    it('Font size  decrement validation', () => {
console.log('Font size  decrement validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let prevFontSize = editor.selection.characterFormat.fontSize;
        //increment font size Property
        event = { keyCode: 219, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 219, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.fontSize = 86;
        event = { keyCode: 219, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.fontSize = 86;
        event = { keyCode: 221, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.characterFormat.fontSize).not.toBe(prevFontSize);
    });
    it('Font size  increment with font size 72 validation', () => {
console.log('Font size  increment with font size 72 validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        let prevFontSize = editor.selection.characterFormat.fontSize;
        editor.selection.characterFormat.fontSize = 74;
        //increment font size Property
        event = { keyCode: 219, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.fontSize = 74;
        event = { keyCode: 221, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(editor.selection.characterFormat.fontSize).not.toBe(prevFontSize);
    });
    it('font size with type number and boolean validation', () => {
console.log('font size with type number and boolean validation');
        editor.openBlank();
        let fontSize = (editor.editorModule as any).updateFontSize(editor.selection.characterFormat, 12);
        expect(fontSize).toBe(23);
        fontSize = (editor.editorModule as any).updateFontSize(editor.selection.characterFormat, true)
        expect(fontSize).toBe(11);
    });

});
describe('selection character format property applying validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('bold,italic,underline,fontsize validation validation', () => {
console.log('bold,italic,underline,fontsize validation validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        let prevFormat = editor.selection.characterFormat;
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.bold = true;
        editor.selection.characterFormat.italic = true;
        editor.selection.characterFormat.fontSize = 24;
        editor.selection.characterFormat.underline = 'Single';
        expect(prevFormat.bold).toBe(editor.selection.characterFormat.bold);
        expect(prevFormat.italic).toBe(editor.selection.characterFormat.italic);
    });
    it('strikethrough,baselineAlignment,highlightColor,fontColor and validation', () => {
console.log('strikethrough,baselineAlignment,highlightColor,fontColor and validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        let prevFormat = editor.selection.characterFormat;
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.strikethrough = 'SingleStrike';
        editor.selection.characterFormat.baselineAlignment = 'Subscript';
        editor.selection.characterFormat.highlightColor = 'Pink';
        editor.selection.characterFormat.fontColor = '#123124';
        editor.selection.characterFormat.fontFamily = 'Arial';
        expect(prevFormat.strikethrough).toBe('SingleStrike');
        expect(editor.selection.characterFormat.highlightColor).toBe('Pink');
    });

    it('paragraph format leftindent,rightindent , beforespacing and after spacing validation', () => {
console.log('paragraph format leftindent,rightindent , beforespacing and after spacing validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        let prevFormat = editor.selection.paragraphFormat;
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.paragraphFormat.leftIndent = 56;
        editor.selection.paragraphFormat.rightIndent = -56;
        editor.selection.paragraphFormat.beforeSpacing = 12;
        editor.selection.paragraphFormat.afterSpacing = 12;
        expect(prevFormat.leftIndent).toBe(editor.selection.paragraphFormat.leftIndent);
        expect(prevFormat.rightIndent).toBe(editor.selection.paragraphFormat.rightIndent)
    });
    it('apply left indent for list', () => {
console.log('apply left indent for list');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.selection.handleHomeKey();
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.editorModule.onApplyParagraphFormat('leftIndent', 24, true, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(96);
    });
    it('while insert table selected content remove false testing', () => {
console.log('while insert table selected content remove false testing');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.selection.handleUpKey();
        editor.selection.handleShiftDownKey();
        editor.editor.insertTable(2, 2);
        expect(editor.selection.start.paragraph.isEmpty()).toBe(true);
    });
    it('left indent on multiple selection validation', () => {
console.log('left indent on multiple selection validation');
        editor.openBlank();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleControlShiftHomeKey();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('backspace testing on hyperlink validation', () => {
console.log('backspace testing on hyperlink validation');
        editor.openBlank();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftEndKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.paragraph.isEmpty()).not.toBe(true);
    });
    it('allCaps validation', () => {
console.log('allCaps validation');
        editor.openBlank();
        editor.editorModule.insertText('Sample document');
        let prevFormat = editor.selection.characterFormat;
        event = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.selection.characterFormat.allCaps = true;
        expect(prevFormat.allCaps).toBe(editor.selection.characterFormat.allCaps);
    });
});
//#endregion

//#region Paste

describe('Delete and paste with history preservation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, SfdtExport, EditorHistory);
         editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('paste testing inside paragraph', () => {
console.log('paste testing inside paragraph');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.onEnter();
        editor.enableLocalPaste = true;
        editor.selection.selectAll();
        editor.selection.copy();
        let event: any;
        event = { keyCode: 38, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 39, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.paste();
        editor.selection.selectAll();
        expect(editor.selection.text).toBe('AAdventure\rAdventure\rdventure\rAdventure\r\r');
    });
});
describe('Paste undo and redo validation ', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);

    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    // it('cut table validation', () => {
    //     editor.editor.insertTable(1, 2);
    //     editor.selectionModule.selectRow();
    //     expect(() => { editor.editorModule.cut(); }).not.toThrowError();
    // });
    it('cut and enable paste true valdiation', () => {
console.log('cut and enable paste true valdiation');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure');
        editor.selection.moveUp();
        editor.selection.handleControlShiftHomeKey();
        editor.editor.cut();
        editor.enableLocalPaste = true;
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.editorModule.paste();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
    });
    it('cut nested table validation', () => {
console.log('cut nested table validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        expect(() => { editor.editor.cut(); }).not.toThrowError();
    });
});
//#endregion

describe('Delete table at specfic row valdiation', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.acceptTab = true;
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('delete table at row index 2', () => {
console.log('delete table at row index 2');
        editor.editor.insertTable(5, 7);
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleControlShiftEndKey();
        editor.editorModule.delete();
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });

    it('tab and enter in hyperlink validation', () => {
console.log('tab and enter in hyperlink validation');
        editor.openBlank();
        let event: any = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        editor.editorModule.insertText('www.google.com');
        expect(() => { editor.editorModule.onEnter() }).not.toThrowError();
    });

    it('delete single cells validation ', () => {
console.log('delete single cells validation ');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftRightKey();
        expect(() => { editor.editorModule.delete(); }).not.toThrowError();
    });
    it('insertText method else part validation', () => {
console.log('insertText method else part validation');
        expect(() => { editor.editorModule.insertTextInline(undefined, undefined, undefined, 12) }).not.toThrowError();
    });
    // it('update widget height', () => {
    //     let cellWidget: TableCellWidget = new TableCellWidget();
    //     cellWidget.childWidgets = [];
    //     expect(() => { editor.updateWidgetHeight(cellWidget); }).not.toThrowError();
    // });
    it('copy List Level validation', () => {
console.log('copy List Level validation');
        let listLevel: WListLevel = new WListLevel(undefined);
        listLevel.paragraphFormat = undefined;
        listLevel.characterFormat = undefined;
        listLevel.followCharacter = undefined;
        listLevel.listLevelPattern = undefined;
        listLevel.startAt = undefined;
        listLevel.restartLevel = undefined;
        listLevel.numberFormat = undefined;
        expect(() => { editor.editorModule.copyListLevel(listLevel, listLevel); }).not.toThrowError();
    });

});

// describe('editor else part validation-2', () => {
//     let editor: Editor;
//     beforeEach(() => {
//         editor = new Editor(undefined);
//     });
//     afterEach(() => {
//         editor.destroy;
//         editor = undefined;
//     });

//     it('get Table Cell  widget internal validation', () => {
//         let bodyWidget: BodyWidget = new BodyWidget();
//         bodyWidget.childWidgets = [];
//         expect(() => { editor.tableCellWidgetInternal(bodyWidget, new Point(0, 0), true); }).not.toThrowError();
//         let rowWidget: TableRowWidget = new TableRowWidget();
//         rowWidget.childWidgets = [];
//         expect(() => { editor.tableCellWidgetInternal(rowWidget, new Point(0, 0), true); }).toThrowError();
//         expect(() => { editor.tableCellWidgetInternal(undefined, new Point(0, 0), true); }).not.toThrowError();
//     });
//     // it('get actual width validation', () => {
//     //     let rowWidget: TableRowWidget = new TableRowWidget();
//     //     rowWidget.childWidgets = [];
//     //     let width: number = editor.getActualWidth(rowWidget);
//     //     expect(width).toBe(0);
//     // });
//     // it('getCellWidgetFromCellWidget  internal validation', () => {
//     //     let cellWidget: TableCellWidget = new TableCellWidget();
//     //     cellWidget.childWidgets = [];
//     //     expect(() => { editor.getCellWidgetFromCellWidget(undefined, true, cellWidget) }).not.toThrowError();
//     // });
// });

// describe('editor else part validation-3', () => {
//     let editor: Editor;
//     beforeEach(() => {
//         editor = new Editor(undefined);
//     });
//     afterEach(() => {
//         editor.destroy;
//         editor = undefined;
//     });
//     it('shiftWidgetsBlock  else part validation', () => {
//         expect(() => { editor.shiftWidgetsBlock(undefined, undefined) }).not.toThrowError();
//     });
//     it('layoutItemBlock else part validation', () => {
//         expect(() => { editor.layoutItemBlock(new ParagraphWidget(), false) }).not.toThrowError();
//     });
//     it('tableformat,cellformat and row format validation', () => {
//         let selection: Selection = new Selection( undefined);
//         editor.onRowFormat(selection, undefined);
//         expect(() => { editor.onCellFormat(selection, undefined); }).not.toThrowError();
//     });
// });
function onEnter(editor: DocumentEditor) {
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();
    editor.editorModule.onEnter();

}

function onBackSpace(editor: DocumentEditor) {
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
    editor.editorModule.onBackSpace();
}

describe('shift widget validation ', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    let documentHelper:DocumentHelper;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);
        documentHelper = editor.documentHelper;
    });
    afterEach((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('shift table widgets to next page validation', () => {
console.log('shift table widgets to next page validation');
        editor.selection.handleEndKey();
        onEnter(editor);
        editor.editor.insertTable(2, 2);
        editor.selection.handleUpKey();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        expect(documentHelper.pages.length).toBe(1);
    });
    it('shift paragraph widgets validation', () => {
console.log('shift paragraph widgets validation');
        editor.openBlank();
        editor.editorModule.insertText('Adventure Works Cycles');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.');
        editor.editorModule.onEnter();
        editor.selection.handleControlHomeKey();
        editor.selection.handleDownKey();
        onEnter(editor);
        onBackSpace(editor)
        expect(documentHelper.pages.length).toBe(1);

    });
    it('shift paragraph to next page validation', () => {
console.log('shift paragraph to next page validation');
        editor.openBlank();
        editor.editorModule.insertText('Adventure Works Cycles');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.');
        editor.selection.handleControlHomeKey();
        editor.selection.handleDownKey();
        onEnter(editor);
        expect((documentHelper.pages[documentHelper.pages.length - 1].bodyWidgets[0].lastChild as Widget).index).toBe(42);
    });
});
describe('combine widgets validation ', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    let documentHelper:DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);
        documentHelper= editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('get row width selected else validation', () => {
console.log('get row width selected else validation');
        editor.openBlank();
        documentHelper = editor.documentHelper;
        editor.editor.insertTable(2, 2);
        editor.selection.handleDownKey();
        editor.editorModule.insertText('Sample');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.editorModule.insertText('Sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Sample');
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.toggleBold();
        editor.editorModule.onApplyParagraphFormat('textAlignment', 'Justify', false, true);
        expect(() => { editor.editorModule.onBackSpace(); }).not.toThrowError();
    });
    it('Combine table cell widgets validation', () => {
console.log('Combine table cell widgets validation');
        editor.openBlank();
        documentHelper =editor.documentHelper;
        editor.editorModule.insertText('Sample');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base.');
        editor.selection.handleControlHomeKey();
        editor.selection.handleEndKey();
        for (let i: number = 0; i < 30; i++) {
            editor.editorModule.onEnter();
        }
        editor.editorModule.insertText('sa');
        expect(documentHelper.pages.length).toBe(2);
    });
    it('get row width selected else validation', () => {
console.log('get row width selected else validation');
        editor.openBlank();
        documentHelper = editor.documentHelper;
        editor.editorModule.insertText('Sample');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);

        editor.selection.handleUpKey();
        editor.selection.handleShiftDownKey();
        expect(() => { editor.editorModule.onEnter(); }).not.toThrowError();
    });
});
describe('Paste and replace else part validation ', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('Delete with selection containing table and paragraph', () => {
console.log('Delete with selection containing table and paragraph');
        editor.openBlank();
        documentHelper = editor.documentHelper;
        editor.editorModule.insertText('Sample');
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);

        editor.selection.handleUpKey();
        editor.selection.handleEndKey();
        editor.selection.handleShiftEndKey();
        editor.editorModule.delete();
        editor.editorHistory.undo();
        editor.editorHistory.redo()
    });
    it('paste with html string as empty', () => {
console.log('paste with html string as empty');
        editor.openBlank();
        editor.editorModule.copiedData = '';
        documentHelper = editor.documentHelper;
        editor.editorModule.paste();
        expect(editor.editorModule.copiedData).toBe('');
    });
    it('paste with selection containing table and paragraph', () => {
console.log('paste with selection containing table and paragraph');
        editor.openBlank();
        editor.editorModule.copiedData = '';
        documentHelper= editor.documentHelper;
        editor.editorModule.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.cut();
        editor.editorModule.insertText('Sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.selection.handleUpKey();
        editor.selection.handleShiftDownKey();
        editor.editorModule.paste();
        (editor.editorModule as any).insertHyperlinkInternal(editor.selection, 'www.google.com', editor.selection.text);
        expect(editor.editorModule.copiedData).not.toBe('');
    });
    // it('update selected cells in table else part validation', () => {
    //     editor.selection.upDownSelectionLength = 7;
    //     expect(() => { editor.editorModule.updateSelectedCellsInTable(editor.selection, 21, 2, 12, 5); }).not.toThrowError();
    // });
});
describe('section combine validation ', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    let documentHelper:DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, HyperlinkDialog); editor.enableEditorHistory = true;
        editor.enableHyperlinkDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('insert Text at next body widgets', () => {
console.log('insert Text at next body widgets');
        for (let i: number = 0; i < 47; i++) {
            editor.editorModule.onEnter();
        }
        editor.editorModule.insertText('sample');
        expect((documentHelper.pages[documentHelper.pages.length - 1].bodyWidgets[0].lastChild as Widget).index).toBe(47);
    });
    it('hyperlink and delete else part validation', () => {
console.log('hyperlink and delete else part validation');
        editor.openBlank()
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        editor.selection.handleLeftKey();
        editor.editorModule.delete();
        expect(() => { editor.editorModule.insertText(' '); }).not.toThrowError();
    });
    it('edit hyperlink in multiple paragraph validation', () => {
console.log('edit hyperlink in multiple paragraph validation');
        editor.openBlank()
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editorModule.insertHyperlinkInternal('www.google.com', editor.selection.text, false);
        editor.selection.handleUpKey();
        editor.selection.handleLeftKey();
        editor.hyperlinkDialogModule.show();
        (editor.hyperlinkDialogModule as any).urlTextBox.value = 'www.gmail.com';
        editor.hyperlinkDialogModule.onInsertButtonClick();
        expect(() => { editor.editorModule.insertText(' '); }).not.toThrowError();
    });
});
describe('Single backspace and delete at empty line widget validation', () => {
    let editor: DocumentEditor;
    let editorModule: Editor;
    let documentHelper:DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editorModule = new Editor(editor.documentHelper);
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        editorModule.destroy();
        editorModule = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('single backpsace in empty line widget ', () => {
console.log('single backpsace in empty line widget ');
        editor.openBlank()
        editor.editorModule.onBackSpace();
        expect(documentHelper.pages.length).toBe(1);
    });
    it('single delete in empty line widget ', () => {
console.log('single delete in empty line widget ');
        editor.openBlank()
        editor.editorModule.onEnter();
        editor.selection.handleUpKey();
        editor.editorModule.delete();
        expect(documentHelper.pages.length).toBe(1);
    });
    it('Delete with selection containing table and paragraph ', () => {
console.log('Delete with selection containing table and paragraph ');
        editor.openBlank()
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('sample');
        editor.editorModule.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleUpKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftEndKey();
        expect(() => { editor.editorModule.delete(); }).not.toThrowError();
    });
    it('single delete in multiple hyperlink validation ', () => {
console.log('single delete in multiple hyperlink validation ');
        editor.openBlank()
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        editor.selection.handleUpKey();
        editor.selection.handleShiftEndKey();
        editor.editorModule.delete();
        expect(() => { editor.editorModule.delete(); }).not.toThrowError();
    });
});

describe('paragraph format Increase indent and decrease indent validation', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Increase indent with undo and redo', () => {
console.log('Increase indent with undo and redo');
        editor.openBlank();
        editor.editorModule.insertText('Sampsle kjqwhj qhwjkdhjwhdkjqhdjkwqhdkjqhdkqhdkjqhdkjhqkdjh qkjdhkjqwhdkqhdkqhkdj hwkjd');
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        let i: number = 0;
        while (i < 15) {
            editor.selection.increaseIndent();
            i++;
        }
        expect(editor.selection.paragraphFormat.leftIndent).toBe(540);
        expect(editor.documentHelper.pages.length).toBeGreaterThan(1);
    });
    it('Decrease indent with multiple times', () => {
console.log('Decrease indent with multiple times');
        let i: number = 0;
        while (i < 15) {
            editor.selection.decreaseIndent();
            i++;
        }
        expect(editor.selection.paragraphFormat.leftIndent).toBe(0);
        expect(editor.documentHelper.pages.length).toBe(1);
    });
    it('undo with multiple times', () => {
console.log('undo with multiple times');
        let i: number = 0;
        while (i < 15) {
            editor.editorHistory.undo();
            i++;
        }
        expect(editor.selection.paragraphFormat.leftIndent).toBe(540);
    });
    it('redo with multiple times', () => {
console.log('redo with multiple times');
        let i: number = 0;
        while (i < 15) {
            editor.editorHistory.redo();
            i++;
        }
        expect(editor.selection.paragraphFormat.leftIndent).toBe(0);
    });
    it('undo with multiple times again', () => {
console.log('undo with multiple times again');
        let i: number = 0;
        while (i < 15) {
            editor.editorHistory.undo();
            i++;
        }
        expect(editor.selection.paragraphFormat.leftIndent).toBe(540);
    });
});
describe('Delete table width undo and redo', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Insert table aftet paragraph then delete', () => {
console.log('Insert table aftet paragraph then delete');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.editorModule.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectPosition(editor.selection.getDocumentStart(), editor.selection.getDocumentStart());
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editorModule.onBackSpace();
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(1);
    });
    it('revert last action', () => {
console.log('revert last action');
        let i: number = 0;
        while (i < 15) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        // expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(1);
    });
    it('undo with multiple times', () => {
console.log('undo with multiple times');
        editor.editorHistory.redo();
        let i: number = 0;
        while (i < 15) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(3);
    });
    it('paste dropdown on opening document', () => {
console.log('paste dropdown on opening document');
        editor.openBlank()
        editor.editorModule.insertText('Adventure');
        editor.enableLocalPaste = true;
        editor.selection.selectAll();
        editor.selection.copy();
        editor.selection.selectAll();
        expect(() => { editor.editorModule.paste(); }).not.toThrowError();
        editor.openBlank();
        expect(editor.selection.isViewPasteOptions).toBe(false);
    });
});
