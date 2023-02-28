import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TextFormField, ElementBox, SfdtExport, TableWidget, WSectionFormat } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
let content: any = { "sections": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "firstLineIndent": -18, "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "BodyText", "textAlignment": "Left", "styleName": "List Paragraph", "listFormat": { "listLevelNumber": 0, "listId": 0 }, "bidi": false, "contextualSpacing": true }, "inlines": [{ "text": "Welcome", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36, "footerDistance": 36, "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "lists": [{ "listId": 0, "abstractListId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Symbol", "fontColor": "#00000000", "fontFamilyBidi": "Symbol" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }] }], "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "List Paragraph", "basedOn": "Normal", "next": "List Paragraph", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left", "contextualSpacing": true } }], "defaultTabWidth": 36, "formatting": false, "protectionType": "NoProtection", "enforcement": false };
describe('Paste list content from outside editor ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection);
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
    it('Paste list on new page', () => {
console.log('Paste list on new page');
        (editor.editor as any).pasteFormattedContent({ data: content });
        expect(editor.documentHelper.lists.length).toBe(1);
    });
    it('Paste list on page with same existing list', () => {
console.log('Paste list on page with same existing list');
        editor.documentHelper.lists = [];
        editor.documentHelper.abstractLists = [];
        editor.openBlank();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.onEnter();
        (editor.editor as any).pasteFormattedContent({ data: content });
        expect(editor.documentHelper.lists.length).toBe(1);
    });
    it('Paste list on page with different format existing list', () => {
console.log('Paste list on page with different format existing list');
        editor.documentHelper.lists = [];
        editor.documentHelper.abstractLists = [];
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'LowRoman');
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.onEnter();
        content = { "sections": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "firstLineIndent": -18, "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "BodyText", "textAlignment": "Left", "styleName": "List Paragraph", "listFormat": { "listLevelNumber": 0, "listId": 0 }, "bidi": false, "contextualSpacing": true }, "inlines": [{ "text": "Welcome", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36, "footerDistance": 36, "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "lists": [{ "listId": 0, "abstractListId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Symbol", "fontColor": "#00000000", "fontFamilyBidi": "Symbol" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "o", "characterFormat": { "bold": false, "fontFamily": "Courier New" }, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }, { "listLevelPattern": "Bullet", "followCharacter": "Tab", "numberFormat": "", "characterFormat": { "bold": false, "fontFamily": "Wingdings" }, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -18, "tabs": [{ "tabJustification": "Left", "position": 0, "tabLeader": "None", "deletePosition": 0 }] } }] }], "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "List Paragraph", "basedOn": "Normal", "next": "List Paragraph", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 36, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left", "contextualSpacing": true } }], "defaultTabWidth": 36, "formatting": false, "protectionType": "NoProtection", "enforcement": false };
        (editor.editor as any).pasteFormattedContent({ data: content });
        expect(editor.documentHelper.lists.length).toBe(2);
    });
    it('copy paste list internal', () => {
console.log('copy paste list internal');
        editor.documentHelper.lists = [];
        editor.documentHelper.abstractLists = [];
        editor.enableLocalPaste = true;
        editor.openBlank();
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.applyNumbering('%1.', 'LowRoman');
        editor.editor.insertText('Welcome');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.selection.selectAll();
        editor.selection.copy();
        editor.editor.paste();
        expect(editor.documentHelper.lists.length).toBe(1);
    });
});
describe('Restrict editing public API validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection);
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
    it('insert edit region', () => {
console.log('insert edit region');
        editor.editor.insertText('Hello world');
        editor.selection.extendToWordStart();
        editor.editor.insertEditingRegion();
        editor.editor.onEnter();
        editor.editor.insertText('Hello world');
        editor.selection.extendToWordStart();
        editor.editor.insertEditingRegion();
        expect(editor.documentHelper.editRanges.get('Everyone').length).toBe(2);
    });
    it('enfore protection', () => {
console.log('enfore protection');
        editor.editor.enforceProtection('aa', false, true);
    });
    it('navigate to next edit region', () => {
console.log('navigate to next edit region');
        let end: string = editor.selection.end.hierarchicalPosition;
        editor.selection.navigateToNextEditingRegion();
        expect(editor.selection.end.hierarchicalPosition).not.toBe(end);
    });
    it('show to all edit region', () => {
console.log('show to all edit region');
        let end: TextPosition = editor.selection.end;
        editor.selection.showAllEditingRegion();
        expect(editor.selection.editRangeCollection.length).toBe(2);
    });
    it('stop protection', () => {
console.log('stop protection');
        editor.editor.stopProtection('aa');
    });
});

describe('Test page break delete', () => {
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
    it('Test page break delete', () => {
console.log('Test page break delete');
        editor.editor.insertText('Hello World');
        editor.editor.insertPageBreak();
        editor.editor.insertTable(2, 2);
        editor.selection.moveUp();
        editor.editor.delete();
        expect(editor.documentHelper.pages.length).toBe(1);
    });
    it('undo after page break delete', () => {
console.log('undo after page break delete');
        editor.editorHistory.undo();
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('redo after page break delete', () => {
console.log('redo after page break delete');
        editor.editorHistory.redo();
        expect(editor.documentHelper.pages.length).toBe(1);
    });
});

describe('Bookmark collection checking on delete', () => {
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
    it('Bookmark delete in inline', () => {
console.log('Bookmark delete in inline');
        editor.editor.insertText('Hello World');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.length).toBe(1);
        editor.selection.selectAll();
        editor.editor.delete();
        expect(editor.documentHelper.bookmarks.length).toBe(0);
    });
    it('undo after bookmark delete in inline', () => {
console.log('undo after bookmark delete in inline');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.length).toBe(1);
    });
    it('redo after bookmark delete in inline', () => {
console.log('redo after bookmark delete in inline');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.length).toBe(0);
    });
});


describe('Bookmark collection checking on replace action', () => {
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
    it('Bookmark delete in inline', () => {
console.log('Bookmark delete in inline');
        editor.editor.insertText('Hello World');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.length).toBe(1);
        editor.selection.selectAll();
        editor.editor.insertText('sample');
        expect(editor.documentHelper.bookmarks.length).toBe(0);
    });
    it('undo after bookmark delete in inline', () => {
console.log('undo after bookmark delete in inline');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.length).toBe(1);
    });
    it('redo after bookmark delete in inline', () => {
console.log('redo after bookmark delete in inline');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.length).toBe(0);
    });
});


describe('Bookmark collection checking on inline', () => {
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
    it('Bookmark delete in inline', () => {
console.log('Bookmark delete in inline');
        editor.editor.insertText('Hello World');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.editor.insertBookmark('sample');
        expect(editor.documentHelper.bookmarks.length).toBe(1);
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.editor.onBackSpace();
        expect(editor.documentHelper.bookmarks.length).toBe(0);
    });
    it('undo after bookmark delete in inline', () => {
console.log('undo after bookmark delete in inline');
        editor.editorHistory.undo();
        expect(editor.documentHelper.bookmarks.length).toBe(1);
    });
    it('redo after bookmark delete in inline', () => {
console.log('redo after bookmark delete in inline');
        editor.editorHistory.redo();
        expect(editor.documentHelper.bookmarks.length).toBe(0);
    });
});

describe('Restrict editing public API validation by Protectiontype', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection);
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
    it('Form field Protection type', () => {
console.log('Form field Protection type');
        editor.editor.insertText('Name: ');
        editor.editor.insertFormField('Text');
        editor.editor.updateFormField(editor.documentHelper.formFields[0], 'Test');
        editor.editor.enforceProtection('', 'FormFieldsOnly');
        editor.selection.selectFieldInternal(editor.documentHelper.formFields[0]);
        editor.editor.insertText('sync');
        let textElement: string = (editor.documentHelper.formFields[0].fieldSeparator.nextElement as TextElementBox).text;
        expect(textElement).toBe('sync');
    });
    it('Read Only Protection type', () => {
console.log('Read Only Protection type');
        editor.openBlank();
        editor.editor.insertText('Test');
        editor.editor.enforceProtection('', 'ReadOnly');
        let event: any = { which: 83 };
        editor.documentHelper.onKeyPressInternal(event);
        let textElement: ElementBox[] = ((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children;
        expect(textElement.length).toBe(1);
        expect((textElement[0] as TextElementBox).text).toBe('Test');
    });
});
let copiedContent: any = {"sections":[{"sectionFormat":{"pageWidth":595.4500122070312,"pageHeight":841.7000122070312,"leftMargin":43.20000076293945,"rightMargin":43.20000076293945,"topMargin":115.19999694824219,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":0,"footerDistance":0,"bidi":false},"blocks":[{"paragraphFormat":{"leftIndent":144,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"inlines":[{"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"text":"Mr. R Duggal"}]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"35 Yrs M"}]},{"paragraphFormat":{"leftIndent":144,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"inlines":[{"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"text":"Dr. Rohit Khurana"}]},{"paragraphFormat":{"leftIndent":144,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"inlines":[{"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"text":"26.12.2002"}]},{"paragraphFormat":{"leftIndent":144,"rightIndent":-40.849998474121094,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontColor":"#FF0000FF","fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"                                   "}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"textAlignment":"Justify","styleName":"Heading 1","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"textAlignment":"Justify","styleName":"Heading 1","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"leftIndent":72,"textAlignment":"Justify","styleName":"Heading 1","listFormat":{}},"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"MR"},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"A"},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"- "},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"ABDOMINAL "},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"AORTA "},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"& "},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"LOWER "},{"characterFormat":{"fontSize":11,"underline":"Single","fontSizeBidi":11},"text":"LIMBS "}]},{"paragraphFormat":{"leftIndent":72,"rightIndent":-40.849998474121094,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10.5,"underline":"Single","fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"MR angiography of "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"abdominal "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"aorta "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"& lower limbs "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"was performed using "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"dedicated body coil."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"The "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"study "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"was "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"performed "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"using "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"time-"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"of-"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"fl"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"ight "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"mode "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"of "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"acquisition "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"(3D "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"TOF) "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"and "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"maximum "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"intensity "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"projection "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"algorith"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"m"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"."},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":" "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":" "}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"Additional "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"SE "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"T1 "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"& "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"SE "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"T2 "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"weighted "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"axial "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"images "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"of "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"the "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"abdomen "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"were "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"obtained "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"in "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"quite "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"breathing."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"                          "}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"bold":true,"fontSize":10.5,"boldBidi":true,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":true,"fontSize":10.5,"boldBidi":true,"fontSizeBidi":10.5},"text":"OBSERVATIONS "},{"characterFormat":{"bold":true,"fontSize":10.5,"boldBidi":true,"fontSizeBidi":10.5},"text":":"}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"abdominal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"aorta "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"branc"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"hes "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"coeliac "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":","},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" superior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"mesenteric "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"inferior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"mesenteric "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bilateral "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"renal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"arteries "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"are "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"normal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"calibre. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"The "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"aortic "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bifurcation  "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"normal. "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"Both "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"common "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"iliac "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"B/L "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"external "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"& "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"internal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"iliac "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"a"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"rteries "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"are "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"normal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"calibre"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":". "}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"B"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"ilateral"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"common "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"femoral"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" artery, "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"superficial"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"femoral "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"&  "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"deep "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"femoral "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"are "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"normal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"calibre."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"T"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"he "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"right "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"popliteal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" its "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bifurcation"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":", "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"anterior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"& "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"posterior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"tibial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"are "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"normal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"cali"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"b"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"r"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"e."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"O"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"n "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"left "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"side "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"there "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"atheros"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"c"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"l"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"eroti"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"c"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"narrowing "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"occlusion "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"popliteal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"just "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"at "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bifurcation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"faint "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"partial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"formation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bifurcation."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"T"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"here "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"is "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"evidence "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"collateral "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"vessel "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"formation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"partial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reformatio"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"n"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" left "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"anterior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"posterior"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"tibial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"bold":true,"fontSize":10,"boldBidi":true,"fontSizeBidi":10},"inlines":[{"characterFormat":{"bold":true,"fontSize":10,"boldBidi":true,"fontSizeBidi":10},"text":" "},{"characterFormat":{"bold":true,"fontSize":10,"boldBidi":true,"fontSizeBidi":10},"text":" "},{"characterFormat":{"bold":true,"fontSize":10,"boldBidi":true,"fontSizeBidi":10},"text":" "}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"Visuali"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"sed "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"segments "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"of "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"both "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"the "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"renal "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"arteries "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"appear "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"normal "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"in "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"course "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"& "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"calibr"},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"e "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"with "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"an "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"essentially "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"normal "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"flow "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"morphology.  "}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"No "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"demonstrable "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"narrowing "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"/ "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"stenosis "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"or "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"any "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"dilatation "},{"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"text":"seen."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"Aorta "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"& "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"the "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"IVC "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"under "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"view "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"appear "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"unremarkable."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"Renal "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"veins "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"appear "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"essenti"},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"ally "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"normal."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"Abdominal "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"viscera "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"under "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"view "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"appear "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"unremarkable."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"No "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"obvio"},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"us "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"vascular "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"malformation "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"/ "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"aneurysm "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"seen."}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"underline":"Single","boldBidi":true,"fontSizeBidi":11},"text":"IMPRESSION"},{"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"text":" :- "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"F/S/O "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":":"}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{"listId":0,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"A"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"theros"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"c"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"l"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"eroti"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"c"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"narrowing "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"occlusion "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"popliteal "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"just "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"at "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"the "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"bifurcation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"with "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"collateral "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"vessel "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"formati"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"on "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"partial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"reformation "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"left "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"anterior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"and "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"posterior "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"tibial "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"artery."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"                "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"    "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"            "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"L"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"ikely "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"possibility "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"of "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"B"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"uergers "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"disease."}]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text","listFormat":{}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"S"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"uggested "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"D"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"S"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"A"},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":" if "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"clinically "},{"characterFormat":{"fontSize":11,"fontSizeBidi":11},"text":"indicated. "}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Body Text 2","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"Please "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"correlate "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"clinically "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"& "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"with "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"other "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"relevant "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"investigations "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"li"},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"ke "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"colour "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"doppler "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"studies  "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"/ "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"DSA, "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"if "},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"neces"},{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"sary."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":false,"fontSize":10.5,"boldBidi":false,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"DR.  ARUN GUPTA  M. D."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":" Consultant Radiologist."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"inlines":[{"characterFormat":{"fontSize":10.5,"fontSizeBidi":10.5},"text":"sdfsdf"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":true,"formFieldShading":true,"compatibilityMode":"Word2003","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Book Antiqua","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Book Antiqua"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":144,"firstLineIndent":36,"outlineLevel":"Level1","listFormat":{},"keepWithNext":true},"characterFormat":{"fontSize":11.5,"fontSizeBidi":11.5},"basedOn":"Normal","next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Table Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Table Normal"},{"name":"No List","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"next":"No List"},{"name":"Body Text","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","listFormat":{}},"characterFormat":{"bold":false,"boldBidi":false},"basedOn":"Normal","next":"Body Text"},{"name":"Body Text 2","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","listFormat":{}},"characterFormat":{"bold":false,"italic":true,"boldBidi":false,"italicBidi":true},"basedOn":"Normal","next":"Body Text 2"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Book Antiqua","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Book Antiqua"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Book Antiqua","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Book Antiqua"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":90,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":126,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":126,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":162,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":162,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":198,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":198,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":234,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":270,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":270,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"leftIndent":306,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":306,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":342,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":342,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"leftIndent":378,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":378,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Footer overlap validation ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableLocalPaste: false, enableSfdtExport: true});
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
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
    it('Footer overlap validation', () => {
console.log('Footer overlap validation');
        editor.openBlank();
        editor.selection.goToFooter();
        editor.editor.insertText('footer text');
        editor.selection.select('0;0;0', '0;0;0');
        (editor.editor as any).pasteFormattedContent({ data: copiedContent });
        expect(editor.documentHelper.pages[0].footerWidget.x.toFixed()).toBe('96');
        expect(editor.documentHelper.pages[0].footerWidget.y.toFixed()).toBe('990');
    });
});

describe('Protect and unprotect document with password empty string', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, enableBookmarkDialog: true, isReadOnly: false, enableContextMenu: true, enableFontDialog: true });
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
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Protect document with empty string', () => {
console.log('Protect document with empty string');
       editor.editor.enforceProtection('', 'ReadOnly');
       expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it('Unprotect document', () => {
console.log('Unprotect document');
        editor.editor.stopProtection('');
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
    });
});

describe('Applying section format after inserting endnote validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableLocalPaste: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.openBlank();
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
    it('Applying section format test', () => {
        console.log('Applying section format test');
        editor.editor.insertEndnote();
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.differentOddAndEvenPages = true;
        expect(() => { editor.editor.onApplySectionFormat(undefined, sectionFormat) }).not.toThrowError();
    });
});