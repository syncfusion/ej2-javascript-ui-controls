import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TextFormField, ElementBox } from '../../src/document-editor/index';
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
let documentData: any = { "sections": [{ "sectionFormat": { "pageWidth": 792, "pageHeight": 612, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": true, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "leftIndent": 0, "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "INFORMATION AUDIT OF " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }] }, { "paragraphFormat": { "leftIndent": 0, "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "Background" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 2, "listLevelNumber": 0 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(A)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "The following Information Audit is a record of mapping the flow of personal data collected, processed or held " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "by " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "." }, { "characterFormat": {}, "bookmarkType": 1, "name": "(A)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 2, "listLevelNumber": 0 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(B)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "Each section focuses on one specific reason for processing personal data. The following details are set out in each section:" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(B)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(i)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "categories of data collected" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(i)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(ii)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "source of information" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(ii)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(iii)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "legal basis for collection and processing" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(iii)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(iv)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "time of collection" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(iv)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(v)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "frequency of updating information" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(v)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(vi)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "data retention period" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(vi)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 3, "listLevelNumber": 1 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(vii)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "location of data storage" }, { "characterFormat": {}, "bookmarkType": 1, "name": "(vii)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 2, "listLevelNumber": 0 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(C)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "This audit is conducted by " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": ", " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": " of " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": " on " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "." }, { "characterFormat": {}, "bookmarkType": 1, "name": "(C)" }] }, { "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": { "listId": 2, "listLevelNumber": 0 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "(D)" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "This audit will be reviewed and updated " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "." }, { "characterFormat": {}, "bookmarkType": 1, "name": "(D)" }] }, { "paragraphFormat": { "leftIndent": 28.350000381469727, "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "Reasons " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "for " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "processing " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "personal " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "data" }] }, { "paragraphFormat": { "leftIndent": 28.350000381469727, "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "Personal " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "data " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "is " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "collected " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "and " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "processed " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "for " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "the " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "following " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "reasons:" }] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "fontSize": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "1" }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "Data " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "storage " }, { "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Arial" }, "text": "location" }, { "characterFormat": {}, "bookmarkType": 1, "name": "1" }] }, { "paragraphFormat": { "leftIndent": 0, "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "____________" }] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "Signed off by:" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "Estella's Company & Sons" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": {}, "bookmarkType": 0, "name": "zs8ufawxdi84467" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "bookmarkType": 1, "name": "zs8ufawxdi84467" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": { "bold": false, "fontColor": "#000000FF" }, "text": "_________________________" }, { "characterFormat": { "bold": false, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "Estella Paul" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": {}, "text": "Director" }, { "characterFormat": {}, "text": "\u000b" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 270, "preferredWidthType": "Point", "cellWidth": 472.5, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": false, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "Signed off by:" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "Estella's Company & Sons" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": {}, "bookmarkType": 0, "name": "gqfn49dsdu373034" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": {}, "bookmarkType": 1, "name": "gqfn49dsdu373034" }, { "characterFormat": {}, "text": "\u000b" }, { "characterFormat": { "bold": false, "fontColor": "#000000FF" }, "text": "_________________________" }, { "characterFormat": { "bold": false, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "Kerry Dawn" }, { "characterFormat": { "bold": true, "fontColor": "#000000FF" }, "text": "\u000b" }, { "characterFormat": {}, "text": "Authorised signatory" }, { "characterFormat": {}, "text": "\u000b" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 270, "preferredWidthType": "Point", "cellWidth": 472.5, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": false, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }], "grid": [472.5], "tableFormat": { "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 472.5, "preferredWidthType": "Point", "bidi": false, "allowAutoFit": true }, "description": null, "title": null }, { "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "footer": { "blocks": [{ "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": " Page " }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": "PAGE \\*MERGEFORMAT" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "2" }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 1 }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": " of " }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": "NUMPAGES" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "2" }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 1 }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 648, "preferredWidthType": "Point", "cellWidth": 648, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }], "grid": [648], "tableFormat": { "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 648, "preferredWidthType": "Point", "bidi": false, "allowAutoFit": true } }] }, "firstPageFooter": { "blocks": [{ "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": " Page " }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": "PAGE \\*MERGEFORMAT" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "1" }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 1 }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": " of " }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "text": "NUMPAGES" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "1" }, { "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "fieldType": 1 }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 648, "preferredWidthType": "Point", "cellWidth": 648, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }], "grid": [648], "tableFormat": { "borders": { "top": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#FFFFFFFF", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 648, "preferredWidthType": "Point", "bidi": false, "allowAutoFit": true } }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 10, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Arial" }, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "listId": 0 }, { "abstractListId": 2, "listId": 2 }, { "abstractListId": 3, "listId": 3 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 51.04999923706055, "firstLineIndent": -22.700000762939453, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%3)", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 73.75, "firstLineIndent": -22.700000762939453, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%4)", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 96.44999694824219, "firstLineIndent": -22.700000762939453, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "(%5).", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 119.1500015258789, "firstLineIndent": -22.700000762939453, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "UpLetter", "numberFormat": "(%6).", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -54, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 187.1999969482422, "firstLineIndent": -61.20000076293945, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -72, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 2, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "UpLetter", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 73.44999694824219, "firstLineIndent": -28.100000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%3)", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 102.25, "firstLineIndent": -28.799999237060547, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%4)", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 111.5999984741211, "firstLineIndent": -39.599998474121094, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 136.8000030517578, "firstLineIndent": -46.79999923706055, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -54, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 187.1999969482422, "firstLineIndent": -61.20000076293945, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -72, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 3, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%2)", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 73.44999694824219, "firstLineIndent": -28.100000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%3)", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 102.25, "firstLineIndent": -28.799999237060547, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%4)", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 111.5999984741211, "firstLineIndent": -39.599998474121094, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 136.8000030517578, "firstLineIndent": -46.79999923706055, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -54, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 187.1999969482422, "firstLineIndent": -61.20000076293945, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -72, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9", "restartLevel": 8, "startAt": 1 }] }] };

describe('Cut and undo operation at end of table in second page', () => {
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
        editor.open(JSON.stringify(documentData));
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
    it('Cut and undo', () => {
console.log('Cut and undo');
        editor.selection.moveToDocumentEnd();
        editor.selection.handleControlUpKey();
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleControlShiftDownKey();
        editor.selection.handleShiftUpKey();
        editor.editor.cut();
        expect(() => { editor.editorHistory.undo() }).not.toThrowError();

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
