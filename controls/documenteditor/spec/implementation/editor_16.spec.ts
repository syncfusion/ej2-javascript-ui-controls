import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition, TableWidget } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { Search } from '../../src/document-editor/implementation/search/index';
/**
 * List editing enhancement
 */
let hiddenList: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "afterSpacing": 36, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "#4472C4FF" }, "inlines": [{ "characterFormat": { "fontSize": 18, "fontFamily": "Monotype Corsiva", "fontColor": "#4472C4FF" }, "text": "Types of Animals" }] }, { "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Mammals" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }] }, { "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 1 } }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "body covered by hair or fur" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 1 } }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "warm-blooded" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Notes", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 6, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "bold": true }, "basedOn": "Normal", "next": "Normal" }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "List Paragraph" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "listId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": { "bold": true, "italic": false }, "paragraphFormat": { "leftIndent": 18, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": true }, "paragraphFormat": { "leftIndent": 39.599998474121094, "firstLineIndent": -21.600000381469727, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "fontFamily": "Symbol" }, "paragraphFormat": { "leftIndent": 61.20000076293945, "firstLineIndent": -25.200000762939453, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "", "restartLevel": 0, "startAt": 0 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 86.4000015258789, "firstLineIndent": -32.400001525878906, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 111.5999984741211, "firstLineIndent": -39.599998474121094, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 136.8000030517578, "firstLineIndent": -46.79999923706055, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -54, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 187.1999969482422, "firstLineIndent": -61.20000076293945, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -72, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9.", "restartLevel": 8, "startAt": 1 }] }] };
describe('Hidden list edit validation - 1', () => {
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
        editor.open(hiddenList);
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
    it('valid list conversion on enter', () => {
console.log('valid list conversion on enter');
        editor.selection.handleDownKey();
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('2.1.');
    });
//     it('undo after list conversion', () => {
// console.log('undo after list conversion');
//         editor.editorHistory.undo();
//         editor.selection.handleDownKey();
//         editor.selection.handleDownKey();
//         expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('1.1.');
//     })
});

describe('Hidden list edit validation - 2', () => {
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
        editor.open(hiddenList);
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
    it('valid list conversion on enter in list level 1', () => {
console.log('valid list conversion on enter in list level 1');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleEndKey();
        editor.editor.onEnter();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('1.2.');
    });
//     it('undo after list conversion in list level 1', () => {
// console.log('undo after list conversion in list level 1');
//         editor.editorHistory.undo();
//         expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('1.1.');
//     });
    it('redo after list conversion in list level 1', () => {
console.log('redo after list conversion in list level 1');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('1.2.');
    })
});

var content = { "sections": [{ "blocks": [{ "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left", "styleName": "Normal", "bidi": false }, "inlines": [{ "text": "ampe", "characterFormat": { "bold": true, "italic": false, "strikethrough": "None", "highlightColor": "Yellow", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36, "footerDistance": 36, "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } }], "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "bidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "textAlignment": "Left" } }, { "type": "Character", "name": "Default Paragraph Font" }], "defaultTabWidth": 36, "formatting": false, "protectionType": "NoProtection", "enforcement": false };
describe('Keep Text only validation', () => {
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
        editor.open(hiddenList);
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
    it('Paste format', () => {
console.log('Paste format');
        (editor.editor as any).pasteContents(content);
        (editor.editor as any).copiedTextContent = 'ampe';
        editor.editor.applyPasteOptions('KeepTextOnly');
        expect(editor.selection.characterFormat.bold).toBe(false);
    });
});



describe('Restart Numbering List validation - 1', () => {
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
    it('Apply restart numbering with different numberformat', () => {
console.log('Apply restart numbering with different numberformat');
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.applyNumbering('.%1', 'Arabic');
        editor.selection.handleUpKey();
        editor.selection.handleDownKey();
        editor.editor.applyRestartNumbering(editor.selection);
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
    it('undo after restart numbering list', () => {
console.log('undo after restart numbering list');
        editor.editorHistory.undo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.2');
    });
    it('redo after restart numbering list', () => {
console.log('redo after restart numbering list');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
});

describe('Restart Numbering List validation - 2', () => {
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
    it('Ensuring multiple list level for restart numbering', () => {
console.log('Ensuring multiple list level for restart numbering');
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.applyNumbering('.%1', 'Arabic');
        editor.selection.handleDownKey();
        editor.selection.handleHomeKey();
        editor.selection.handleTabKey(true, false);
        editor.editor.applyBullet('\uf0b7', 'Symbol')
        editor.selection.handleUpKey();
        editor.editor.applyRestartNumbering(editor.selection);
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
        editor.selection.handleDownKey();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).not.toBe('.1');
    });
    it('undo after multiple list level for restart numbering list', () => {
console.log('undo after multiple list level for restart numbering list');
        editor.editorHistory.undo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.2');
    });
    it('redo after multiple list level for restart numbering list', () => {
console.log('redo after multiple list level for restart numbering list');
        editor.editorHistory.redo();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
});
let hyperlinkContent:any = { "sections": [{ "sectionFormat": { "pageWidth": 595.2999877929688, "pageHeight": 841.9000244140625, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "swisscom-inhalt-title", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 70, "fontFamily": "TheSansB", "fontColor": "#000000FF", "fontFamilyBidi": "TheSansB" }, "text": "Lagebericht" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Section_MetaInfo", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "Section_MetaInfo" }, { "name": "Normal", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "bold": false, "italic": false, "fontSize": 12, "fontFamily": "Times New Roman", "strikethrough": "None", "baselineAlignment": "Normal", "fontColor": "#000000FF", "fontFamilyBidi": "Times New Roman" }, "next": "Normal" }, { "name": "swisscom-inhalt-title", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "bold": true, "italic": false, "fontSize": 70, "fontFamily": "TheSansB", "strikethrough": "None", "baselineAlignment": "Normal", "fontColor": "#FFFFFFFF", "fontFamilyBidi": "TheSansB" }, "basedOn": "Normal", "next": "swisscom-inhalt-title" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [] };
describe('Remove hyperlink validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false,enableSearch:true, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory,Search);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(hyperlinkContent))
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
    it('Insert hyperlink at start of paragraph', () => {
console.log('Insert hyperlink at start of paragraph');
        editor.editor.insertHyperlink("google.com", "test");
        expect(editor.selection.start.paragraph.childWidgets.length).toBe(2);
    });
    it('Remove hyperlink at start of paragraph', () => {
console.log('Remove hyperlink at start of paragraph');
        editor.search.findAll("test");
        expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
        editor.editor.removeHyperlink();
        expect(editor.selection.getHyperlinkField()).toBeUndefined();
    });
//     it('undo after remove hyperlink', () => {
// console.log('undo after remove hyperlink');
//         editor.editorHistory.undo();
//         editor.selection.handleLeftKey();
//         expect(editor.selection.getHyperlinkField()).not.toBeUndefined();
//     });
});

//Customer reported issue
let autoTable:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":"11"},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":2,"preferredWidth":234,"preferredWidthType":"Point","cellWidth":234,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"topMargin":2,"preferredWidth":234,"preferredWidthType":"Point","cellWidth":234,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"color":"#000000","hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point"}}],"grid":[234,234],"tableFormat":{"borders":{"top":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalUp":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"horizontal":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{"backgroundColor":"#ffffff","foregroundColor":"empty","textureStyle":"TextureNone"},"cellSpacing":0,"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":0,"preferredWidthType":"Auto"},"description":null,"title":null,"columnCount":2},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Calibri"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"afterSpacing":6,"outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[]};

describe('Insert table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false,enableSearch:true, enableEditorHistory: true, enableLocalPaste: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory,Search);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(autoTable))
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
    it('inside table with preferred width type auto and left margin undefined', () => {
console.log('inside table with preferred width type auto and left margin undefined');
        editor.editor.insertTable(1, 1);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.cellWidth).toBeGreaterThan(0);
    });
    it('Undo after insert Table', () => {
console.log('Undo after insert Table');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.cellWidth).toBeGreaterThan(0);
    });
    it('Redo after insert Table', () => {
console.log('Redo after insert Table');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.cellWidth).toBeGreaterThan(0);
    });
    it('Apply restart list clone validation', () => {
console.log('Apply restart list clone validation');
        editor.openBlank();
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.applyNumbering('.%1', 'Arabic');
        editor.selection.handleUpKey();
        editor.selection.handleDownKey();
        editor.editor.applyRestartNumbering(editor.selection);
        expect((((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as ListTextElementBox).listLevel.paragraphFormat.listFormat as any).uniqueListFormat)).toBe(undefined);
    });
});
describe('Page break revision validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, enableComment: true });
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
    it('Page break revision validation', () => {
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.editor.onEnter();
        expect(editor.revisions.length).toBe(0);
    }); 
});
describe('Pargrapgh indent on table creation validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true });
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
    it('Pargrapgh indent on table creation validtaion', () => {
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.editor.onApplyParagraphFormat('leftIndent', 200, true, false);
        editor.selection.handleHomeKey();
        editor.editor.insertTable(2, 2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBeGreaterThan(0);
    }); 
});