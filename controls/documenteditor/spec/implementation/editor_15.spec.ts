import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
/**
 * Autolist feature enhancement test cases
 */
describe('Arabic list previous paragraph is list', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('valid list conversion', () => {
console.log('valid list conversion');
        editor.editor.insertText('1');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('2');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('after some paragraph check valid list conversion', () => {
console.log('after some paragraph check valid list conversion');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('4');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('invalid number format', () => {
console.log('invalid number format');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('4');
        editor.editor.insertText(')');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).toBe(-1);
    });

});

describe('History validation after Uproman list ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('valid list conversion', () => {
console.log('valid list conversion');
        editor.editor.insertText('I');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('II');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('undo after valid list conversion', () => {
console.log('undo after valid list conversion');
       editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).toBe(-1);
    });
    it('redo after valid list conversion', () => {
console.log('redo after valid list conversion');
        editor.editorHistory.redo();
         expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
     });

});

describe('Uproman and lowRoman auto list validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('uproman validation', () => {
console.log('uproman validation');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'UpRoman');
        editor.selection.handleDownKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('V');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('lowRoman list validation', () => {
console.log('lowRoman list validation');
        editor.openBlank();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.', 'LowRoman');
        editor.selection.handleDownKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('v');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });

});

describe('UpLetter list previous paragraph is list', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('low letter valid list conversion', () => {
console.log('low letter valid list conversion');
        editor.editor.insertText('a');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('c');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('after some paragraph check low letter valid list conversion', () => {
console.log('after some paragraph check low letter valid list conversion');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('c');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('up letter valid list conversion', () => {
console.log('up letter valid list conversion');
        editor.openBlank();
        editor.editor.insertText('A');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('B');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('after some paragraph check up letter valid list conversion', () => {
console.log('after some paragraph check up letter valid list conversion');
        
        editor.editor.insertText('sample');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('D');
        editor.editor.insertText('.');
        editor.editor.insertText(' ');
        expect(editor.selection.start.paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });

});

let pasteData:string='{"sections":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"rightIndent":0,"textAlignment":"Left","styleName":"Normal","bidi":false},"inlines":[{"name":"text","bookmarkType":0},{"text":"text","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","highlightColor":"Yellow","fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},{"text":" ","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},{"name":"text","bookmarkType":1},{"text":"with ","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},{"name":"multiple","bookmarkType":0},{"text":"multiple ","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","highlightColor":"Yellow","fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}},{"name":"multiple","bookmarkType":1},{"text":"bookmarks in it!","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36,"formatting":false,"protectionType":"NoProtection","enforcement":false}'
describe('257171- copy and paste bookmark insert multiple time',()=>{
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('intial paste bookmark child validation', () => {
console.log('intial paste bookmark child validation');
        editor.editor.insertText('a');
       editor.editor.paste(pasteData);
       expect(editor.selection.start.currentWidget.children.length).toBe(10);
    });
    it('After multiple format, paste bookmark validation',()=>{
console.log('After multiple format, paste bookmark validation');
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.editor.paste(pasteData);
        editor.editor.applyPasteOptions('MergeWithExistingFormatting');
        expect(editor.selection.start.currentWidget.children.length).toBe(5);
        editor.editor.applyPasteOptions('KeepSourceFormatting');
        editor.editor.applyPasteOptions('MergeWithExistingFormatting');
        editor.editor.applyPasteOptions('KeepSourceFormatting');
        expect(editor.selection.start.currentWidget.children.length).toBe(5);
    })
});
