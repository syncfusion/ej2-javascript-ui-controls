import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { DocumentHelper, LineWidget, ParagraphWidget, Selection, TextElementBox } from '../../../src/index';
import { TableCellWidget, TableRowWidget, TableWidget } from '../../../src/index';
import { Editor } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";

/**
 * Table resize on with table auto fit true
 */
describe('Remove content with track changes enabled', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Remove selected content', () => {
        console.log('Remove selected content');
        editor.enableTrackChanges = true;
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(5);
        editor.selection.selectAll();
        editor.editorModule.onBackSpace();
        expect(editor.documentHelper.pages[0].bodyWidgets.length).toBe(1);
        expect(editor.revisions.length).toBe(0);
    });
    it('Undo and redo mutiple times', () => {
        editor.editorHistoryModule.undo();
        expect(editor.revisions.length).toBe(1);
        editor.editorHistoryModule.redo();
        expect(editor.revisions.length).toBe(0);
        editor.editorHistoryModule.undo();
        expect(editor.revisions.length).toBe(1);
        editor.editorHistoryModule.redo();
        expect(editor.revisions.length).toBe(0);
    });

});

describe('Paragraph split revision adding issue', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table Paragraph split', () => {
        console.log('Table Paragraph split');
        editor.editor.insertTable(2, 2);
        editor.editor.insertText("Hello world");
        editor.selection.extendToWordStart();
        editor.selection.handleLeftKey();
        editor.editorModule.onEnter();
        expect(editor.revisions.length).toBe(0);
    });
});
let text = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"hello world","revisionIds":["rvklkjqnkbiq4pf7auezcg"]}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":true,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720948,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720948,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720948,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720948,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720948,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720948,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[{"author":"Guest user","date":"2022-02-04T08:52:42.367Z","revisionType":"Insertion","revisionId":"rvklkjqnkbiq4pf7auezcg"},{"author":"Guest user","date":"2022-02-05T08:52:42.367Z","revisionType":"Insertion","revisionId":"rvklkjqnkbiq4pf7auezbg"}],"customXml":[]}'
describe('document without refered revision in loading sfdt', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Check the revision list', () => {
        console.log('Check the revision list');
        container.open(text);
        expect(container.revisions.changes.length).toBe(1);
    });
    it('Check the revision list after editing', () => {
        console.log('Check the revision list after editing');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.enableTrackChanges = false;
        container.editor.insertText("World");
        expect(container.revisions.changes.length).toBe(2);
        container.enableTrackChanges = true;
        container.revisions.acceptAll();
        expect(container.revisions.changes.length).toBe(0);
    });
});

let revisionText: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "leftIndent": 36, "rightIndent": 12.600000381469727, "textAlignment": "Justify", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal (Web)", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "inlines": [{ "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "Grind " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "the " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "coffee" }] }, { "paragraphFormat": { "leftIndent": 36, "rightIndent": 12.600000381469727, "textAlignment": "Justify", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal (Web)", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "inlines": [{ "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "Boil " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "the " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "water " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "and " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "wait " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "1 " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "minute" }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": ", " }] }, { "paragraphFormat": { "leftIndent": 36, "rightIndent": 12.600000381469727, "textAlignment": "Justify", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal (Web)", "listFormat": { "listId": 0, "listLevelNumber": 0 } }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "Plac" }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "e " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "and " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "wet " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "the " }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "filt" }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "er" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#00000000", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false, "keepLinesTogether": false, "keepWithNext": false, "widowControl": true }, "defaultTabWidth": 36, "trackChanges": false, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "compatibilityMode": "Word2013", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Normal (Web)", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 5, "afterSpacing": 5, "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontSizeBidi": 12 }, "basedOn": "Normal", "next": "Normal (Web)" }], "lists": [{ "abstractListId": 0, "levelOverrides": [], "listId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Courier New", "fontSizeBidi": 10, "fontFamilyBidi": "Courier New" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "o", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Courier New", "fontFamilyBidi": "Courier New" }, "paragraphFormat": { "leftIndent": 72, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "o", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Wingdings", "fontFamilyBidi": "Wingdings" }, "paragraphFormat": { "leftIndent": 108, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Symbol", "fontFamilyBidi": "Symbol" }, "paragraphFormat": { "leftIndent": 144, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Courier New", "fontFamilyBidi": "Courier New" }, "paragraphFormat": { "leftIndent": 180, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "o", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Wingdings", "fontFamilyBidi": "Wingdings" }, "paragraphFormat": { "leftIndent": 216, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Symbol", "fontFamilyBidi": "Symbol" }, "paragraphFormat": { "leftIndent": 252, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Courier New", "fontFamilyBidi": "Courier New" }, "paragraphFormat": { "leftIndent": 288, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "o", "restartLevel": 0, "startAt": 0 }, { "characterFormat": { "fontFamily": "Wingdings", "fontFamilyBidi": "Wingdings" }, "paragraphFormat": { "leftIndent": 324, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Bullet", "numberFormat": "", "restartLevel": 0, "startAt": 0 }] }], "comments": [], "revisions": [], "customXml": [] }
describe('Multiple list of content deletion with trackchange enable mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check revision list after removing the multiple list of content', function () {
        console.log('Check revision list after removing the multiple list of content');
        container.openBlank();
        container.open(revisionText);
        container.enableTrackChanges = true;
        container.selection.selectAll();
        container.editorModule.onBackSpace();
        expect(container.revisions.length).toBe(3);
        container.revisions.acceptAll();
        expect(container.revisions.length).toBe(0);
        container.openBlank();
        container.open(revisionText);
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.selection.selectAll();
        container.editorModule.onBackSpace();
        container.revisions.rejectAll();
        expect(container.revisions.length).toBe(0);

    });
});
describe('Check the revision with empty para after removing that with trackchange enable mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the revision with empty para and text', () => {
        console.log('Check the revision with empty para and text');
        container.openBlank();
        container.editor.insertText("Hi");
        container.editor.onEnter();
        container.editor.onEnter();
        container.editor.insertText("Hi");
        container.enableTrackChanges = true;
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        expect(container.revisions.changes[0].range.length).toBe(6);
        container.revisions.acceptAll();
        expect(container.revisions.changes.length).toBe(0);
    });
    it('Check the revision with empty para', () => {
        console.log('Check the revision with empty para');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.onEnter();
        container.editor.onEnter();
        container.editor.onEnter();
        container.enableTrackChanges = true;
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        expect(container.revisions.changes[0].range.length).toBe(3);
        container.revisions.acceptAll();
        expect(container.revisions.changes.length).toBe(0);
    });
});
describe('Check the revision collection after adding the comments', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true, enableComment: true });
        editor.acceptTab = true;
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Check the revision collection after adding the comments', () => {
        console.log('Check the revision collection after adding the comments');
        editor.openBlank();
        editor.editor.insertComment("Hello world");
        editor.enableTrackChanges = true;
        editor.editor.handleTextInput("Hello");
        expect(editor.revisions.length).toBe(0);
        editor.openBlank();
        editor.enableTrackChanges = false;
        editor.editor.insertComment("Hello world");
        editor.enableTrackChanges = true;
        editor.selection.moveToDocumentStart();
        editor.editor.handleTextInput("Hello");
        expect(editor.revisions.length).toBe(1);
    });
});
describe('Check the revision collection after perform undo', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check firstIndex text and lastIndex text in revision collection', () => {
        console.log('Check firstIndex text and lastIndex text in revision collection');
        container.openBlank();
        container.editor.insertText("helloworld");
        container.enableTrackChanges = true;
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        container.editor.onBackSpace();
        for (let i = 0; i < 4; i++) {
            container.editor.delete();
        }
        for (let i = 0; i < 5; i++) {
            container.editor.onBackSpace();
        }
        for (let i = 0; i < 3; i++) {
            container.editorHistory.undo();
        }
        let textElementBoxFirst: TextElementBox = container.revisions.changes[0].range[0] as TextElementBox;
        let textElementBoxLast: TextElementBox = container.revisions.changes[0].range[3] as TextElementBox;
        expect(textElementBoxFirst.text).toBe('w');
        expect(textElementBoxLast.text).toBe('l');
        container.revisions.acceptAll();
        expect(container.revisions.changes.length).toBe(0);
    });
});
describe('Check the empty paragraph deletion functionality', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the revision after delete empty paragraph', () => {
        console.log('Check the revision after delete empty paragraph');
        container.openBlank();
        container.editor.insertTable(1,1);
        container.editor.insertText("hi");
        container.enableTrackChanges = true;
        container.editor.onEnter();
        container.editor.insertText("hi");
        container.enableTrackChanges = false;
        container.selection.moveToPreviousLine();
        container.selection.moveToParagraphStart();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        container.revisions.acceptAll();
        expect(container.revisions.changes.length).toBe(0);
    });
});
describe('Check the deletion functionality with trackChange enable mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the deletion functionality with trackChange enable mode', () => {
        console.log('Check the deletion functionality with trackChange enable mode');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("abc");
        container.selection.moveToLineStart();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        let paragraphWidget: ParagraphWidget = container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        let lineWidget: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
        expect(lineWidget.children.length).toBe(0);
    });
});
describe('Check the empty para insertion inside the table after insert bookmark with trackChange enable mode', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Check the empty para count after bookmark insertion with trackChange enable mode', () => {
        console.log('Check the empty para count after bookmark insertion with trackChange enable mode');
        container.openBlank();
        container.editor.insertTable(1,1);
        container.editor.insertBookmark('hello');
        container.enableTrackChanges = true;
        container.editor.onEnter();
        container.editor.onEnter();
        container.editor.onEnter();
        let paraLength: number = (((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets.length;
        expect(paraLength).toBe(4);
    });
});
let doc : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},"inlines":[]},{"paragraphFormat":{"firstLineIndent":21,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"6","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":".","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\t","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","underline":"Single","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Confidentiality","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":". Each party (the \"","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Receiving Party","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\") acknowledges that in connection with this ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Agreement it ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"may","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":" gain access to information that is treated as confidential by the other party (the ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\"","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Disclosing Party","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\"), including information about its business operations and strategies, goods and ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"services, customers, pricing, marketing, and other sensitive and proprietary information (collectively, the ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\"","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Confidential Information","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\"). Confidential Information does not include information that, at the time of ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"disclosure","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":",","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":" and as established by documentary evidence: (a) is or becomes generally available to and ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"known by the public other than as a result of, directly or indirectly, any breach of this ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Section 6","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":" by the ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Receiving Party; (b) is or becomes available to Receiving Party on a non-confidential basis from another ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"party","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":", provided that such ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"party","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":" is not and was not prohibited from disclosing such Confidential ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Information; (c) was known by or in the possession of the Receiving Party prior to being disclosed by or ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"on behalf of the Disclosing Party; or (d) is required to be disclosed by Law, including pursuant to the ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"terms of a court order; provided that the Receiving Party","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":" ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"has given the Disclosing Party prior written ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"notice of such disclosure and an opportunity to contest such disclosure and to seek a protective order or ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"other remedy. The Receiving Party shall: (x) protect and safeguard the confidentiality of the Disclosing ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Party's Confidential Information with at least the same degree of care as the Receiving Party would ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"protect its own Confidential Information, but in no event with less than a commercially reasonable ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"degree ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"of care; (y) not use the Disclosing Party's Confidential Information, or permit it to be accessed or used, for ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"any purpose other than to exercise its rights or perform its obligations under this Agreement; and (z) not ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"disclose any such Confidential Information to any ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"party","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":", except to the Receiving Party's officers, ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"employees, consultants, accountants, and legal advisors who are bound by written confidentiality ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"obligations and have a need to know the Confidential Information to assist the Receiving Party, or act on ","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"its behalf, to exercise its rights or perform its obligations under this Agreement.","revisionIds":["803fcb18-a383-48de-bcf8-dada55ccd0ec"]}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"\f"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"SCHEDULE 1"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Licensed Mark(s): "},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":" USPTO Registration: [______]"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Permitted Use"},{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":": "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"text":"Nonprofit or charitable activities centered around outdoor activities."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#252525FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"inlines":[{"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","styleName":"Page Number","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","styleName":"Page Number","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"text":" PAGE "},{"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"fieldType":2},{"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","styleName":"Page Number","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"text":"1"},{"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","styleName":"Page Number","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"fieldType":1}]},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"styleName":"Page Number"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"styleName":"Page Number"},"text":" PAGE "},{"characterFormat":{"styleName":"Page Number"},"fieldType":1}]},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":12,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"beforeSpacing":5,"afterSpacing":5,"spaceBeforeAuto":true,"spaceAfterAuto":true,"outlineLevel":"Level3","listFormat":{}},"characterFormat":{"bold":true,"fontSize":13.5,"fontFamily":"Times New Roman","boldBidi":true,"fontSizeBidi":13.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 3 Char","next":"Heading 3"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"bold":true,"fontSize":13.5,"fontFamily":"Times New Roman","boldBidi":true,"fontSizeBidi":13.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"msonormal","type":"Paragraph","paragraphFormat":{"beforeSpacing":5,"afterSpacing":5,"spaceBeforeAuto":true,"spaceAfterAuto":true,"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"msonormal"},{"name":"Strong","type":"Character","characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"FollowedHyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#800080FF"},"basedOn":"Default Paragraph Font"},{"name":"kh_icon","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"co_bluetxt","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"kh_identifier","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"kh_description","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Emphasis","type":"Character","characterFormat":{"italic":true,"italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"HTML Preformatted","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":45.79999923706055,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":91.5999984741211,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":137.39999389648438,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":183.1999969482422,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":229,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":274.79998779296875,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":320.6000061035156,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":366.3999938964844,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":412.20001220703125,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":458,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":503.79998779296875,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":549.5999755859375,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":595.4000244140625,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":641.2000122070312,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":687,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":732.7999877929688,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":10,"fontFamily":"Courier New","fontSizeBidi":10,"fontFamilyBidi":"Courier New"},"basedOn":"Normal","link":"HTML Preformatted Char","next":"HTML Preformatted"},{"name":"HTML Preformatted Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Courier New","fontSizeBidi":10,"fontFamilyBidi":"Courier New"},"basedOn":"Default Paragraph Font"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"boldBidi":true,"fontSizeBidi":10},"basedOn":"Comment Text Char"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Page Number","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"zzmpTrailerItem","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","fontColor":"#00000000","fontSizeBidi":8,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[{"author":"Kevin O'Connell","date":"2022-04-25T18:14:00Z","revisionType":"Deletion","revisionId":"803fcb18-a383-48de-bcf8-dada55ccd0ec"}],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Open document with contains revisions Accept', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Open document with contains revisions Accept', () => {
        console.log('Open document with contains revisions Accept');
        container.open(doc);
        container.revisions.acceptAll();
        let paraLength: number = container.documentHelper.pages[0].bodyWidgets[0].childWidgets.length;
        expect(paraLength).toBe(2);
    });
});