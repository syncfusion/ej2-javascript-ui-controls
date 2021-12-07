import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, ParagraphWidget, LineWidget, TextElementBox, FieldElementBox, Search } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * RTL Editing validation
 */

describe('Insert Field with different position validation in bidi', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let text: string = '{"sections":[{"blocks":[{"characterFormat":{"bidi":true},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"text":"הגיעה קולקציית ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"<<","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":"Lead#First","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" name>>","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"מרהיבה! עשרות דגמים חדשים במחירים מפתיעים לחברי מועדון בלבד. מחכים לכם ב","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":" ","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"text":"<<","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":"Lead#Last","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":" name>>","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","fontFamilyBidi":"Arial"}},{"text":".","characterFormat":{"fontFamily":"Arial","fontColor":"#000080FF","bidi":true,"fontFamilyBidi":"Arial"}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"pageWidth":595.29998779296875,"pageHeight":841.9000244140625,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":true,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","paragraphFormat":{"bidi":true}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory,Search);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false,enableSearch:true, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(text);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        text = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert field at start of text element', () => {
console.log('insert field at start of text element');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text.indexOf('חדשים')).toBe(12);
        editor.selection.handleHomeKey();
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»');
        expect((lineWidget.children[0] as TextElementBox).text.indexOf('חדשים')).toBe(12);
        expect(lineWidget.children[lineWidget.children.length - 1] instanceof FieldElementBox).toBe(true);
    });
    it('replace text with field validation', () => {
console.log('replace text with field validation');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[2] as TextElementBox).text.indexOf('Lead#First')).toBe(-1);
        editor.search.find('חדשים');
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»');
        // expect((lineWidget.children[14] as TextElementBox).text.indexOf('Lead#First')).not.toBe(-1);
    });

});


describe('Insert Field with different position validation within rtl character', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert field inbetween rtl text', () => {
console.log('insert field inbetween rtl text');
        editor.selection.paragraphFormat.bidi=true;
      editor.editor.insertText('דשצפךק');
      editor.selection.handleRightKey();
      editor.selection.handleRightKey();
      editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»');  
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('ךק');
    });
    it('replace text with field validation', () => {
console.log('replace text with field validation');
        editor.openBlank();
        editor.selection.paragraphFormat.bidi=true;
        editor.editor.insertText('דשצפךק');
        editor.editor.insertText(' ');
        editor.editor.insertText('דשצפךק');
        editor.selection.characterFormat.bold=true;
        editor.editor.insertText('דשצפךק');
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»'); 
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).characterFormat.bold).toBe(true);
    });
});

describe('Insert Field with different position validation within combination character', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert field', () => {
console.log('insert field');
        editor.selection.paragraphFormat.bidi=true;
      editor.editor.insertText('sample');
      editor.editor.insertText(' ');
      editor.editor.insertText('hello');
      editor.editor.insertText(' ');
      editor.editor.insertText('דשצפךק');
      editor.editor.insertText(' ');
      editor.selection.characterFormat.bold=true;
      editor.editor.insertText('יקךךם');
      editor.editor.insertField('MERGEFIELD  MyField  \\* MERGEFORMAT', '«MyField»'); 
      editor.editor.insertText('דשצפךק');  
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('דשצפךק');
    });
});


describe('Backspace with special character', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('single backspace with special character', () => {
console.log('single backspace with special character');
        editor.selection.paragraphFormat.bidi=true;
      editor.editor.insertText('דשצפךק');
      editor.editor.insertText('?');
      editor.editor.insertText('יקךךם');
      editor.editor.onBackSpace();
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[2] as TextElementBox).text).toBe('דשצפךק');
    });
    it('Multiple backspace with special character', () => {
console.log('Multiple backspace with special character');
      editor.editor.onBackSpace();
      editor.editor.onBackSpace();
      editor.editor.onBackSpace();
      editor.editor.onBackSpace();
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(lineWidget.children.length).toBe(2);
    });
    it('single backspace with different rtl text formatting', () => {
console.log('single backspace with different rtl text formatting');
        editor.openBlank();
        editor.selection.paragraphFormat.bidi=true;
      editor.editor.insertText('דשצפךק');
      editor.selection.characterFormat.bold=true;
      editor.editor.insertText('יקךךם');
      editor.editor.onBackSpace();
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[1] as TextElementBox).text).toBe('דשצפךק');
    });
    it('single backspace with different combination text text formatting', () => {
console.log('single backspace with different combination text text formatting');
        editor.openBlank();
        editor.selection.paragraphFormat.bidi=true;
      editor.editor.insertText('sample');
      editor.editor.insertText(' ');
      editor.editor.insertText('יקךךם');
      editor.editor.onBackSpace();
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('יקךך');
    });
});



describe('Delete with special character', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('single delete with different formatting', () => {
console.log('single delete with different formatting');
        editor.selection.paragraphFormat.bidi=true;
      editor.editor.insertText('سشةحمث');
      editor.editor.insertText(' ');
      editor.selection.characterFormat.bold=true;
      editor.editor.insertText('سشةحمث');
      editor.selection.handleRightKey();
      editor.selection.handleRightKey();
      editor.selection.handleRightKey();
      editor.editor.delete();
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[1] as TextElementBox).text).toBe(' ');
    });
    it('Multiple delete with formatting', () => {
console.log('Multiple delete with formatting');
      editor.editor.delete();
      editor.editor.delete();
      let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('سشة');
    });
    it('undo after delete',()=>{
console.log('undo after delete');
editor.editorHistory.undo();
editor.editorHistory.undo();
editor.editorHistory.undo();
let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect((lineWidget.children[0] as TextElementBox).text).toBe('سشةحمث');
    });
});
