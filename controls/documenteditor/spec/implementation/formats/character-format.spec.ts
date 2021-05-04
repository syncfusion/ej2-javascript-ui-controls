import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { Selection } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
/**
 * Character format spec
 */
describe('Character Format Testing', () => {
    afterEach(() => {
        WCharacterFormat.clear();
    });
    it('Copy Format Testing', () => {
console.log('Copy Format Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        let charFormat1: WCharacterFormat = new WCharacterFormat();
        charFormat.bold = true;
        charFormat.fontSize = 12;
        charFormat1.copyFormat(charFormat);
        expect(charFormat1.fontSize).toBe(12);
    });
    it('Copy Format undefined Testing', () => {
console.log('Copy Format undefined Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.copyFormat(undefined);
    });
    it('destroy Testing', () => {
console.log('destroy Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.destroy();
        charFormat.cloneFormat();
        expect(() => { charFormat.destroy() }).not.toThrowError();
    });
    it('Clone Format Testing', () => {
console.log('Clone Format Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.cloneFormat();
    });
    it('Character Format Equal Format Testing', () => {
console.log('Character Format Equal Format Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.isEqualFormat(charFormat);
        expect(charFormat.bold).toBe(false);
    });
    it('Default Value Testing', () => {
console.log('Default Value Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        expect(charFormat.bold).toBe(false);
    });
    it('set Property Value Testing', () => {
console.log('set Property Value Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.bold = undefined;
        expect(charFormat.bold).toBe(false);
    });
    it('Clear Format validation', () => {
console.log('Clear Format validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.bold = true;
        characterFormat.italic = true;
        characterFormat.fontSize = 12;
        characterFormat.clearFormat();
        expect((characterFormat as any).uniqueCharacterFormat).toBeUndefined();
        expect(characterFormat.bold).toBe(false);
        expect(characterFormat.italic).toBe(false);
    });

    it('Character format Boldbidi validation', () => {
console.log('Character format Boldbidi validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.boldBidi = true;
        expect(characterFormat.boldBidi).toBe(true);
    });
    it('Character format Italicbidi validation', () => {
console.log('Character format Italicbidi validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.italicBidi = true;
        expect(characterFormat.italicBidi).toBe(true);
    });
    it('Character format FontFamily validation', () => {
console.log('Character format FontFamily validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.fontFamilyBidi = 'Arial';
        expect(characterFormat.fontFamilyBidi).toBe('Arial');
    });
    it('Character format FontSize validation', () => {
console.log('Character format FontSize validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.fontSizeBidi = 22;
        expect(characterFormat.fontSizeBidi).toBe(22);
    });
    it('Default value validation of bidi properties', () => {
console.log('Default value validation of bidi properties');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        expect(characterFormat.boldBidi).toBe(false);
        expect(characterFormat.italicBidi).toBe(false);
        expect(characterFormat.fontSizeBidi).toBe(11);
        expect(characterFormat.fontFamilyBidi).toBe('Calibri');
    });
});

let toc: object = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "TOC Heading", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light" }, "inlines": [] }, { "paragraphFormat": { "styleName": "TOC 1", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "boldBidi": false, "fontSizeBidi": 11 }, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": { "fontFamily": "Calibri Light" }, "text": " TOC \\o \"1-3\" \\h \\z \\u " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "text": "HYPERLINK \\l \"_Toc15995388\"" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "styleName": "TOC 1" }, "text": "List of lorem " }, { "characterFormat": { "styleName": "TOC 1" }, "text": "ipsum" }, { "characterFormat": {}, "text": "\t" }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "text": " PAGEREF _Toc15995388 \\h " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "2" }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "styleName": "TOC 1", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "boldBidi": false, "fontSizeBidi": 11 }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "text": "HYPERLINK \\l \"_Toc15995389\"" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "styleName": "TOC 1" }, "text": "1" }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "boldBidi": false, "fontSizeBidi": 11 }, "text": "\t" }, { "characterFormat": { "styleName": "TOC 1" }, "text": "Introduction" }, { "characterFormat": {}, "text": "\t" }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "text": " PAGEREF _Toc15995389 \\h " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "3" }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "leftIndent": 0, "firstLineIndent": 0, "styleName": "TOC 2", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri", "fontColor": "#00000000", "fontSizeBidi": 11 }, "inlines": [{ "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": {}, "contextualSpacing": true }, "characterFormat": { "fontSize": 10, "fontFamily": "Calibri Light", "fontSizeBidi": 10 }, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "TOC Heading", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 15, "fontFamily": "Calibri Light", "fontColor": "#EB5015FF", "fontSizeBidi": 10 }, "next": "Normal" }, { "name": "TOC 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "afterSpacing": 6, "listFormat": {}, "tabs": [{ "position": 22.700000762939453, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }, { "position": 450.8500061035156, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Underscore" }] }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri", "fontColor": "#F15C29FF", "boldBidi": true }, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 42.54999923706055, "firstLineIndent": -28.350000381469727, "afterSpacing": 6, "listFormat": {}, "tabs": [{ "position": 44, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }, { "position": 450.8500061035156, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Underscore" }] }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#404040FF" }, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 56.70000076293945, "firstLineIndent": -28.350000381469727, "afterSpacing": 12, "listFormat": {}, "tabs": [{ "position": 450.75, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Underscore" }] }, "characterFormat": { "fontColor": "#404040FF", "italicBidi": true }, "basedOn": "Normal" }, { "name": "Hyperlink", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "underline": "Single", "fontColor": "#0563C1FF" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };

describe('TOC Hyperlink Character Style Validation', () => {
    let editor: DocumentEditor;
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
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(toc));
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('TOC Heading Style Validation', () => {
console.log('TOC Heading Style Validation');
        expect(editor.selection.start.paragraph.paragraphFormat.baseStyle.name).toBe('TOC Heading');
    });
});

describe('Default Character Format API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        let defaultCharacterFormat: object = {
            bold: true,
            italic: false,
            baselineAlignment: 'Normal',
            underline: 'Single',
            fontColor: "#000000",
            fontFamily: 'Times New Roman',
            fontSize: 8
        }
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        //setDefaultCharacterFormat API
        editor.setDefaultCharacterFormat(defaultCharacterFormat);
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });

    it('Check bold is true', () => {
console.log('Check bold is true');
        expect(editor.selection.start.paragraph.characterFormat.bold).toBe(true);
    });
});
