import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableCellWidget, TableWidget, TableRowWidget, WSectionFormat } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BorderSettings } from '../../src/document-editor/implementation/editor/editor';
/**
 * Section Break Validation
 */
describe('Section Break API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        editor.acceptTab = true;
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
    it('Insert Section break inside paragraph', () => {
console.log('Insert Section break inside paragraph');
        editor.editorModule.insertText('Section 1');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Section 1');
        editor.selection.moveUp();
        editor.editorModule.insertSectionBreak();
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.selection.start.paragraph.bodyWidget.index).toBe(1);
    });
    it('Undo redo mutiple times', () => {
console.log('Undo redo mutiple times');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.selection.start.paragraph.bodyWidget.index).toBe(1);
    });
});

describe('Section Break API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Insert Section break inside table', () => {
console.log('Insert Section break inside table');
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertSectionBreak();
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.selection.start.paragraph.bodyWidget.previousRenderedWidget.childWidgets.length).toBe(1);
    });
    it('Insert Section break at second row', () => {
console.log('Insert Section break at second row');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editorModule.insertSectionBreak();
        expect(editor.documentHelper.pages.length).toBe(2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.selection.start.paragraph.bodyWidget.previousRenderedWidget.childWidgets.length).toBe(2);
    });
    it('Apply section format on second column', () => {
console.log('Apply section format on second column');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleTabKey(true, false)
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        let sectoinFormat: WSectionFormat = new WSectionFormat();
        let currentWidth = editor.selection.start.paragraph.bodyWidget.sectionFormat.pageWidth;
        let currentHeight = editor.selection.start.paragraph.bodyWidget.sectionFormat.pageHeight;
        sectoinFormat.pageHeight = currentWidth;
        sectoinFormat.pageWidth = currentHeight;
        editor.editorModule.onApplySectionFormat(undefined, sectoinFormat);
        expect(currentHeight).toBe(editor.selection.start.paragraph.bodyWidget.sectionFormat.pageWidth);
        expect(currentWidth).toBe(editor.selection.start.paragraph.bodyWidget.sectionFormat.pageHeight);
    });
});

let style: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36 }, "blocks": [{ "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "Sample" }] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Heading 1", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "Sample" }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }, { "paragraphFormat": { "styleName": "Heading 1", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 0, "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "List Paragraph" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "listId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 54, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 90, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 126, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 198, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 234, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 270, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 306, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 342, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }] };

// Need to uncomment this, after docio fixed the reported issue: Parsing issue when style and style for following paragraph is same.

// describe('On enter at end of list paragraph', () => {
//     let editor: DocumentEditor = undefined;
//     beforeEach(() => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
//         DocumentEditor.Inject(Editor, Selection, EditorHistory);
//         editor.enableEditorHistory = true;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterEach((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });
//     it('Style for paragraph is list paragraph and style for following paragraph is also same', () => {
//         editor.open(JSON.stringify(style));
//         expect(editor.selection.paragraphFormat.styleName).toBe('List Paragraph');
//         editor.selection.handleEndKey();
//         editor.editor.onEnter();
//         expect(editor.selection.paragraphFormat.styleName).toBe('List Paragraph');
//     });
//     it('Style for paragraph is list paragraph and style for following paragraph is also same', () => {
//         editor.open(JSON.stringify(style));        
//         editor.selection.moveDown();
//         editor.selection.handleEndKey();                
//         editor.editor.onEnter();
//         expect(editor.selection.paragraphFormat.styleName).toBe('Heading 1');
//         expect(editor.selection.paragraphFormat.textAlignment).toBe('Center');
//     });
// });





let listObj: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36 }, "blocks": [{ "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "First" }] }, { "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 1 } }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "Second" }] }, { "paragraphFormat": { "styleName": "List Paragraph", "listFormat": { "listId": 0, "listLevelNumber": 2 } }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "third" }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "List Paragraph" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "listId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }] };
describe('List document with multilevel layouting validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(listObj));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('First Level validation', () => {
console.log('First Level validation');
        expect(editor.selection.paragraphFormat.leftIndent).toBe(36);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(-18);
    });
    it('second level validation', () => {
console.log('second level validation');
        editor.selection.handleDownKey();
        expect(editor.selection.paragraphFormat.leftIndent).toBe(72);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(-18);
    });
    it('Third level validation', () => {
console.log('Third level validation');
        editor.selection.handleDownKey();
        expect(editor.selection.paragraphFormat.leftIndent).toBe(108);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(-9);
    });
});

describe('Apply Borders Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
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
    describe('Apply OutsideBorder', () => {
        it('On empty selection', () => {
console.log('On empty selection');
            let settings: BorderSettings = { type: 'OutsideBorders', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
            editor.editor.applyBorders(settings);
            let cell = editor.selection.start.paragraph.associatedCell;
            expect(cell.cellFormat.borders.left.color).toBe('green');
            expect(cell.cellFormat.borders.top.color).toBe('green');
            expect(cell.cellFormat.borders.right.color).toBe('green');
            expect(cell.cellFormat.borders.bottom.color).toBe('green');
            expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
            expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');

        });
        it('Undo action', () => {
console.log('Undo action');
            editor.editorHistory.undo();
            let cell = editor.selection.start.paragraph.associatedCell;
            expect(cell.cellFormat.borders.left.color).not.toBe('green');
            expect(cell.cellFormat.borders.top.color).not.toBe('green');
            expect(cell.cellFormat.borders.right.color).not.toBe('green');
            expect(cell.cellFormat.borders.bottom.color).not.toBe('green');
            expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
            expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');

        });
        // it('Redo action', () => {
        //     editor.editorHistory.redo();
        //     let cell = editor.selection.start.paragraph.associatedCell;
        //     expect(cell.cellFormat.borders.left.color).toBe('green');
        //     expect(cell.cellFormat.borders.top.color).toBe('green');
        //     expect(cell.cellFormat.borders.right.color).toBe('green');
        //     expect(cell.cellFormat.borders.bottom.color).toBe('green');
        //     expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
        //     expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');
        // });
    })
});

describe('Apply AllBorders', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
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
    it('On empty selection', () => {
console.log('On empty selection');
        let settings: BorderSettings = { type: 'AllBorders', borderColor: 'red', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).toBe('red');
        expect(cell.cellFormat.borders.top.color).toBe('red');
        expect(cell.cellFormat.borders.right.color).toBe('red');
        expect(cell.cellFormat.borders.bottom.color).toBe('red');
        expect(cell.cellFormat.borders.vertical.color).toBe('red');
        expect(cell.cellFormat.borders.horizontal.color).toBe('red');

    });
    it('Undo action', () => {
console.log('Undo action');
        editor.editorHistory.undo();
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).not.toBe('red');
        expect(cell.cellFormat.borders.top.color).not.toBe('red');
        expect(cell.cellFormat.borders.right.color).not.toBe('red');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('red');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('red');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('red');

    });
    // it('Redo action', () => {
    //     editor.editorHistory.redo();
    //     let cell = editor.selection.start.paragraph.associatedCell;
    //     expect(cell.cellFormat.borders.left.color).toBe('red');
    //     expect(cell.cellFormat.borders.top.color).toBe('red');
    //     expect(cell.cellFormat.borders.right.color).toBe('red');
    //     expect(cell.cellFormat.borders.bottom.color).toBe('red');
    //     expect(cell.cellFormat.borders.vertical.color).toBe('red');
    //     expect(cell.cellFormat.borders.horizontal.color).toBe('red');
    // });
})

describe('Apply Single border', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });

    beforeEach(() => {
        editor.openBlank();
        editor.editor.insertTable(2, 2);
    });

    it('Apply LeftBorder', () => {
console.log('Apply LeftBorder');
        let settings: BorderSettings = { type: 'LeftBorder', borderColor: 'Yellow', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).toBe('Yellow');
        expect(cell.cellFormat.borders.top.color).not.toBe('Yellow');
        expect(cell.cellFormat.borders.right.color).not.toBe('Yellow');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('Yellow');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('Yellow');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('Yellow');
    });
    it('Apply RightBorder', () => {
console.log('Apply RightBorder');
        let settings: BorderSettings = { type: 'RightBorder', borderColor: 'gray', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).not.toBe('gray');
        expect(cell.cellFormat.borders.top.color).not.toBe('gray');
        expect(cell.cellFormat.borders.right.color).toBe('gray');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('gray');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('gray');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('gray');
    });
    it('Apply TopBorder', () => {
console.log('Apply TopBorder');
        let settings: BorderSettings = { type: 'TopBorder', borderColor: 'blue', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).not.toBe('blue');
        expect(cell.cellFormat.borders.top.color).toBe('blue');
        expect(cell.cellFormat.borders.right.color).not.toBe('blue');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('blue');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('blue');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('blue');
    });
    it('Apply BottomBorder', () => {
console.log('Apply BottomBorder');
        let settings: BorderSettings = { type: 'BottomBorder', borderColor: 'orange', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).not.toBe('orange');
        expect(cell.cellFormat.borders.top.color).not.toBe('orange');
        expect(cell.cellFormat.borders.right.color).not.toBe('orange');
        expect(cell.cellFormat.borders.bottom.color).toBe('orange');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('orange');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('orange');
    });
    it('Apply NoBorder', () => {
console.log('Apply NoBorder');
        let settings: BorderSettings = { type: 'NoBorder', borderColor: 'red', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.lineStyle).toBe('Cleared');
        expect(cell.cellFormat.borders.top.lineStyle).toBe('Cleared');
        expect(cell.cellFormat.borders.right.lineStyle).toBe('Cleared');
        expect(cell.cellFormat.borders.bottom.lineStyle).toBe('Cleared');
        expect(cell.cellFormat.borders.vertical.lineStyle).toBe('Cleared');
        expect(cell.cellFormat.borders.horizontal.lineStyle).toBe('Cleared');
    });
    it('Apply InsideHorizontalBorder', () => {
console.log('Apply InsideHorizontalBorder');
        let settings: BorderSettings = { type: 'InsideHorizontalBorder', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).not.toBe('green');
        expect(cell.cellFormat.borders.top.color).not.toBe('green');
        expect(cell.cellFormat.borders.right.color).not.toBe('green');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('green');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
        expect(cell.cellFormat.borders.horizontal.color).toBe('green');
    });
    it('Apply InsideVerticalBorder', () => {
console.log('Apply InsideVerticalBorder');
        let settings: BorderSettings = { type: 'InsideVerticalBorder', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cell = editor.selection.start.paragraph.associatedCell;
        expect(cell.cellFormat.borders.left.color).not.toBe('green');
        expect(cell.cellFormat.borders.top.color).not.toBe('green');
        expect(cell.cellFormat.borders.right.color).not.toBe('green');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('green');
        expect(cell.cellFormat.borders.vertical.color).toBe('green');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');
    });
    // it('Apply InsideBorders', () => {
    //     let settings: BorderSettings = { type: 'InsideBorders', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
    //     editor.editor.applyBorders(settings);
    // });
});

describe('Apply Borders Validation with selection', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
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
    describe('Apply OutsideBorder', () => {
        it('On empty selection', () => {
console.log('On empty selection');
            editor.selection.selectColumn();

            let settings: BorderSettings = { type: 'OutsideBorders', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
            editor.editor.applyBorders(settings);
            let cells: TableCellWidget[] = editor.selection.getSelectedCells();
            let cell1: TableCellWidget = cells[0];
            expect(cell1.cellFormat.borders.left.color).toBe('green');
            expect(cell1.cellFormat.borders.top.color).toBe('green');
            expect(cell1.cellFormat.borders.right.color).toBe('green');
            expect(cell1.cellFormat.borders.bottom.color).not.toBe('green');
            expect(cell1.cellFormat.borders.vertical.color).not.toBe('green');
            expect(cell1.cellFormat.borders.horizontal.color).not.toBe('green');

            let cell2: TableCellWidget = cells[1];
            expect(cell2.cellFormat.borders.left.color).toBe('green');
            expect(cell2.cellFormat.borders.top.color).not.toBe('green');
            expect(cell2.cellFormat.borders.right.color).toBe('green');
            expect(cell2.cellFormat.borders.bottom.color).toBe('green');
            expect(cell2.cellFormat.borders.vertical.color).not.toBe('green');
            expect(cell2.cellFormat.borders.horizontal.color).not.toBe('green');
        });
        it('Undo action', () => {
console.log('Undo action');
            editor.editorHistory.undo();
            let cells: TableCellWidget[] = editor.selection.getSelectedCells();
            for (let i: number = 0; i < cells.length; i++) {
                let cell: TableCellWidget = cells[i];
                expect(cell.cellFormat.borders.left.color).not.toBe('green');
                expect(cell.cellFormat.borders.top.color).not.toBe('green');
                expect(cell.cellFormat.borders.right.color).not.toBe('green');
                expect(cell.cellFormat.borders.bottom.color).not.toBe('green');
                expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
                expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');
            }

        });
        // it('Redo action', () => {
        //     editor.editorHistory.redo();
        //     let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        //     for (let i: number = 0; i < cells.length; i++) {
        //         let cell: TableCellWidget = cells[i];
        //         expect(cell.cellFormat.borders.left.color).toBe('green');
        //         expect(cell.cellFormat.borders.top.color).toBe('green');
        //         expect(cell.cellFormat.borders.right.color).toBe('green');
        //         expect(cell.cellFormat.borders.bottom.color).toBe('green');
        //         expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
        //         expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');
        //     }
        // });
    })
});

describe('Apply AllBorders with selection', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
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
    it('On empty selection', () => {
console.log('On empty selection');
        let settings: BorderSettings = { type: 'AllBorders', borderColor: 'red', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            expect(cell.cellFormat.borders.left.color).toBe('red');
            expect(cell.cellFormat.borders.top.color).toBe('red');
            expect(cell.cellFormat.borders.right.color).toBe('red');
            expect(cell.cellFormat.borders.bottom.color).toBe('red');
            expect(cell.cellFormat.borders.vertical.color).toBe('red');
            expect(cell.cellFormat.borders.horizontal.color).toBe('red');
        }

    });
    it('Undo action', () => {
console.log('Undo action');
        editor.editorHistory.undo();
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            expect(cell.cellFormat.borders.left.color).not.toBe('red');
            expect(cell.cellFormat.borders.top.color).not.toBe('red');
            expect(cell.cellFormat.borders.right.color).not.toBe('red');
            expect(cell.cellFormat.borders.bottom.color).not.toBe('red');
            expect(cell.cellFormat.borders.vertical.color).not.toBe('red');
            expect(cell.cellFormat.borders.horizontal.color).not.toBe('red');
        }

    });
    //     it('Redo action', () => {
    //         editor.editorHistory.redo();
    //         let cells: TableCellWidget[] = editor.selection.getSelectedCells();
    //         for (let i: number = 0; i < cells.length; i++) {
    //             let cell: TableCellWidget = cells[i];
    //             expect(cell.cellFormat.borders.left.color).toBe('red');
    //             expect(cell.cellFormat.borders.top.color).toBe('red');
    //             expect(cell.cellFormat.borders.right.color).toBe('red');
    //             expect(cell.cellFormat.borders.bottom.color).toBe('red');
    //             expect(cell.cellFormat.borders.vertical.color).toBe('red');
    //             expect(cell.cellFormat.borders.horizontal.color).toBe('red');
    //         }
    //     });
});

describe('Apply Single border with selection', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });

    beforeEach(() => {
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.selectColumn();
    });

    it('Apply LeftBorder', () => {
console.log('Apply LeftBorder');
        let settings: BorderSettings = { type: 'LeftBorder', borderColor: 'Yellow', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            expect(cell.cellFormat.borders.left.color).toBe('Yellow');
            expect(cell.cellFormat.borders.top.color).not.toBe('Yellow');
            expect(cell.cellFormat.borders.right.color).not.toBe('Yellow');
            expect(cell.cellFormat.borders.bottom.color).not.toBe('Yellow');
            expect(cell.cellFormat.borders.vertical.color).not.toBe('Yellow');
            expect(cell.cellFormat.borders.horizontal.color).not.toBe('Yellow');
        }
    });
    it('Apply RightBorder', () => {
console.log('Apply RightBorder');
        let settings: BorderSettings = { type: 'RightBorder', borderColor: 'gray', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            expect(cell.cellFormat.borders.left.color).not.toBe('gray');
            expect(cell.cellFormat.borders.top.color).not.toBe('gray');
            expect(cell.cellFormat.borders.right.color).toBe('gray');
            expect(cell.cellFormat.borders.bottom.color).not.toBe('gray');
            expect(cell.cellFormat.borders.vertical.color).not.toBe('gray');
            expect(cell.cellFormat.borders.horizontal.color).not.toBe('gray');
        }
    });
    it('Apply TopBorder', () => {
console.log('Apply TopBorder');
        let settings: BorderSettings = { type: 'TopBorder', borderColor: 'blue', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        let cell: TableCellWidget = cells[0];
        expect(cell.cellFormat.borders.left.color).not.toBe('blue');
        expect(cell.cellFormat.borders.top.color).toBe('blue');
        expect(cell.cellFormat.borders.right.color).not.toBe('blue');
        expect(cell.cellFormat.borders.bottom.color).not.toBe('blue');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('blue');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('blue');
        let cell1: TableCellWidget = cells[1];
        expect(cell1.cellFormat.borders.left.color).not.toBe('blue');
        expect(cell1.cellFormat.borders.top.color).not.toBe('blue');
        expect(cell1.cellFormat.borders.right.color).not.toBe('blue');
        expect(cell1.cellFormat.borders.bottom.color).not.toBe('blue');
        expect(cell1.cellFormat.borders.vertical.color).not.toBe('blue');
        expect(cell1.cellFormat.borders.horizontal.color).not.toBe('blue');
    });
    it('Apply BottomBorder', () => {
console.log('Apply BottomBorder');
        let settings: BorderSettings = { type: 'BottomBorder', borderColor: 'orange', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        let cell: TableCellWidget = cells[1];
        expect(cell.cellFormat.borders.left.color).not.toBe('orange');
        expect(cell.cellFormat.borders.top.color).not.toBe('orange');
        expect(cell.cellFormat.borders.right.color).not.toBe('orange');
        expect(cell.cellFormat.borders.bottom.color).toBe('orange');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('orange');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('orange');
        let cell1: TableCellWidget = cells[0];
        expect(cell1.cellFormat.borders.left.color).not.toBe('orange');
        expect(cell1.cellFormat.borders.top.color).not.toBe('orange');
        expect(cell1.cellFormat.borders.right.color).not.toBe('orange');
        expect(cell1.cellFormat.borders.bottom.color).not.toBe('orange');
        expect(cell1.cellFormat.borders.vertical.color).not.toBe('orange');
        expect(cell1.cellFormat.borders.horizontal.color).not.toBe('orange');
    });
    it('Apply NoBorder', () => {
console.log('Apply NoBorder');
        let settings: BorderSettings = { type: 'NoBorder', borderColor: 'red', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            expect(cell.cellFormat.borders.left.lineStyle).toBe('Cleared');
            expect(cell.cellFormat.borders.top.lineStyle).toBe('Cleared');
            expect(cell.cellFormat.borders.right.lineStyle).toBe('Cleared');
            expect(cell.cellFormat.borders.bottom.lineStyle).toBe('Cleared');
        }
    });
    it('Apply InsideHorizontalBorder', () => {
console.log('Apply InsideHorizontalBorder');
        let settings: BorderSettings = { type: 'InsideHorizontalBorder', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();

        let cell: TableCellWidget = cells[0];
        expect(cell.cellFormat.borders.left.color).not.toBe('green');
        expect(cell.cellFormat.borders.top.color).not.toBe('green');
        expect(cell.cellFormat.borders.right.color).not.toBe('green');
        expect(cell.cellFormat.borders.bottom.color).toBe('green');
        expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
        expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');

        let cell1: TableCellWidget = cells[1];
        expect(cell1.cellFormat.borders.left.color).not.toBe('green');
        expect(cell1.cellFormat.borders.top.color).toBe('green');
        expect(cell1.cellFormat.borders.right.color).not.toBe('green');
        expect(cell1.cellFormat.borders.bottom.color).not.toBe('green');
        expect(cell1.cellFormat.borders.vertical.color).not.toBe('green');
        expect(cell1.cellFormat.borders.horizontal.color).not.toBe('green');

    });
    it('Apply InsideVerticalBorder', () => {
console.log('Apply InsideVerticalBorder');
        let settings: BorderSettings = { type: 'InsideVerticalBorder', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
        editor.editor.applyBorders(settings);
        let cells: TableCellWidget[] = editor.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            expect(cell.cellFormat.borders.left.color).not.toBe('green');
            expect(cell.cellFormat.borders.top.color).not.toBe('green');
            expect(cell.cellFormat.borders.right.color).not.toBe('green');
            expect(cell.cellFormat.borders.bottom.color).not.toBe('green');
            expect(cell.cellFormat.borders.vertical.color).not.toBe('green');
            expect(cell.cellFormat.borders.horizontal.color).not.toBe('green');
        }
    });
    // it('Apply InsideBorders', () => {
    //     let settings: BorderSettings = { type: 'InsideBorders', borderColor: 'green', lineWidth: 1, borderStyle: 'Single' };
    //     editor.editor.applyBorders(settings);
    // });
});

let headerTable: any = { "sections": [{ "sectionFormat": { "pageWidth": 595.2999877929688, "pageHeight": 841.9000244140625, "leftMargin": 36, "rightMargin": 36, "topMargin": 28.350000381469727, "bottomMargin": 28.350000381469727, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 21.25, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "leftIndent": -18, "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Tms Rmn" }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 167.0500030517578, "preferredWidthType": "Point", "cellWidth": 165.00049602756667, "columnSpan": 1, "rowSpan": 2, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 1, "afterSpacing": 1, "styleName": "Header", "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": { "fontFamily": "Verdana" }, "text": "FM01" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "SAP Authority " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "request" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " Form" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 289.1000061035156, "preferredWidthType": "Point", "cellWidth": 285.5530891183104, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 1, "afterSpacing": 1, "styleName": "Header", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Arial" }, "text": "FG" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 73.6500015258789, "preferredWidthType": "Point", "cellWidth": 72.74640264709164, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 20.799999237060547, "allowBreakAcrossPages": false, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "afterSpacing": 6, "styleName": "Header", "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Verdana" }, "text": "SCHS_FO_SAP_0001" }, { "characterFormat": { "bold": true, "fontFamily": "Verdana" }, "text": "_V5_FG" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 289.1000061035156, "preferredWidthType": "Point", "cellWidth": 285.5530891183104, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "beforeSpacing": 6, "afterSpacing": 6, "styleName": "Header", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": { "bold": true, "fontFamily": "Verdana" }, "text": "   " }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": { "fontFamily": "Verdana", "styleName": "Page Number" }, "text": " PAGE " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "fontFamily": "Verdana", "styleName": "Page Number" }, "text": "1" }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana", "styleName": "Page Number" }, "text": " of " }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": { "fontFamily": "Verdana", "styleName": "Page Number" }, "text": " NUMPAGES " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "fontFamily": "Verdana", "styleName": "Page Number" }, "text": "1" }, { "characterFormat": {}, "fieldType": 1 }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 73.6500015258789, "preferredWidthType": "Point", "cellWidth": 72.74640264709164, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }], "rowFormat": { "height": 1.899999976158142, "allowBreakAcrossPages": false, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }], "grid": [165.00049602756667, 285.5530891183104, 72.74640264709164], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.75, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 3.5, "leftMargin": 3.5, "bottomMargin": 0, "preferredWidth": 0, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": false } }, { "paragraphFormat": { "textAlignment": "Right", "styleName": "Header", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Header", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Header", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "styleName": "Footer", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": { "blocks": [{ "paragraphFormat": { "styleName": "Header", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenFooter": { "blocks": [{ "paragraphFormat": { "styleName": "Footer", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageHeader": { "blocks": [{ "paragraphFormat": { "styleName": "Header", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageFooter": { "blocks": [{ "paragraphFormat": { "styleName": "Footer", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Times New Roman", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000FF", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "styles": [], "lists": [], "abstractLists": [] };
describe('Table shift downward validation when field is present inside header widget table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, enableEditorHistory: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('header height valdiation', () => {
console.log('header height valdiation');
        editor.open(JSON.stringify(headerTable));
        let height: number = editor.documentHelper.pages[0].headerWidget.height;
        expect(height).toBeLessThanOrEqual(108);
    });
    it('header table border render validation', () => {
console.log('header table border render validation');
        let cellWidget: TableCellWidget = ((editor.documentHelper.pages[0].headerWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[2] as TableCellWidget;
        expect(cellWidget.cellFormat.columnSpan).toBe(1);
    });
    it('header height validation after text insert', () => {
console.log('header height validation after text insert');
        let height: number = editor.documentHelper.pages[0].headerWidget.height;
        editor.editor.insertText('s');
        expect(height).toEqual(editor.documentHelper.pages[0].headerWidget.height);
        editor.editor.insertText('s');
        expect(height).toEqual(editor.documentHelper.pages[0].headerWidget.height);
    });
});
