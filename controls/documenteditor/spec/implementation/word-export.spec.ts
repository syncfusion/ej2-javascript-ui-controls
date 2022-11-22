import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, Dictionary, DocumentHelper } from '../../src/index';
import { SfdtExport, WordExport } from '../../src/document-editor/implementation/writer/index';

import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { LineWidget, ParagraphWidget, TextElementBox, BodyWidget, TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { ZipArchive } from '@syncfusion/ej2-compression';
import { XmlWriter } from '@syncfusion/ej2-file-utils';

let saveformat: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36 }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "italic": true, "underline": "Single", "fontColor": "#FF0000" }, "inlines": [{ "characterFormat": { "bold": true, "italic": true, "underline": "Single", "fontColor": "#FF0000" }, "text": "sam" }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }, { "characterFormat": { "bold": true, "italic": true, "underline": "Single", "fontColor": "#FF0000" }, "text": "ple" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {} }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }], "lists": [], "abstractLists": [] };
//Save Module spec validation


describe('Save validation', () => {
    let editor: DocumentEditor = undefined;
    let json: string;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(saveformat));
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('save validation in json format', () => {
console.log('save validation in json format');
        let preservedString: string = 'characterFormat":{"bold":true';
        json = editor.serialize();
        expect(json.substring(313, 342)).toBe(preservedString);
    });
    it('Open the saved Json', () => {
console.log('Open the saved Json');
        editor.open(json);
        expect((documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).characterFormat.bold).toBe(true);
    });
});


let charParaBidi: any = { "sections": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "???", "characterFormat": { "bidi": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second column", "characterFormat": { "bdo": "RTL" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": " ", "characterFormat": { "bdo": "RTL" } }, { "text": "?", "characterFormat": { "bdo": "RTL" } }] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "Third column " }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second Page" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "ssASasAS" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": true } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Line Number", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }] };
let tableBidi: any = { "sections": [{ "blocks": [{ "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "sample" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": true } }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "hgfgfghfgfghfhgfgh" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };

describe('Word export validation of RTL content with section and paragraph format', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(charParaBidi));
        writer = new XmlWriter();

    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('section bidi export validation', () => {
console.log('section bidi export validation');
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        (editor.wordExportModule as any).serializeSectionProperties(writer, json.sections[0]);
        expect(writer.bufferText.indexOf('<w:bidi />')).not.toBe(-1);
    });
    it('Paragraph format with bidi export validation', () => {
console.log('Paragraph format with bidi export validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[2], true);
        expect((writer as any).bufferText.indexOf('<w:bidi />')).not.toBe(-1);
    });
    it('Paragraph format without bidi export validation', () => {
console.log('Paragraph format without bidi export validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[0], true);
        expect((writer as any).bufferText.indexOf('<w:bidi />')).toBe(-1);
    });

});


describe('Word export validation of RTL content with character format Bidi vaidation', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(charParaBidi));
        writer = new XmlWriter();
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Character format with bidi export validation', () => {
console.log('Character format with bidi export validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[0], true);
        expect((writer as any).bufferText.indexOf('<w:rtl />')).not.toBe(-1);
    });
    it('Character format without bidi export validation', () => {
console.log('Character format without bidi export validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[1], true);
        expect((writer as any).bufferText.indexOf('<w:rtl />')).toBe(-1);
    });

});

let characterBdo: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "sample", "characterFormat": { "bdo": "RTL" } }] }, { "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "sample ", "characterFormat": { "bdo": "LTR" } }, { "text": "سشةحمث", "characterFormat": { "bidi": true, "bdo": "LTR" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "sam" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": "ple", "characterFormat": { "bdo": "RTL" } }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };

describe('Word export validation of RTL content with character format bdo vaidation', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(characterBdo));
        writer = new XmlWriter();
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Character format with bdo RTL export validation-1', () => {
console.log('Character format with bdo RTL export validation-1');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[0], true);
        expect((writer as any).bufferText.indexOf('<w:bdo w:val="rtl">')).not.toBe(-1);
    });
    it('Character format with bdo LTR export validation', () => {
console.log('Character format with bdo LTR export validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[1], true);
        expect((writer as any).bufferText.indexOf('<w:bdo w:val="ltr">')).not.toBe(-1);
    });
    it('Character format with bdo None export validation', () => {
console.log('Character format with bdo None export validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[2], true);
        expect((writer as any).bufferText.indexOf('<w:bdo w:val="rtl">')).not.toBe(-1);
    });
});


describe('Word export validation of RTL content', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(tableBidi));
        writer = new XmlWriter();

    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('section without bidi export validation', () => {
console.log('section without bidi export validation');
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        (editor.wordExportModule as any).serializeSectionProperties(writer, json.sections[0]);
        expect(writer.bufferText.indexOf('<w:bidi />')).toBe(-1);
    });
    it('Table format with bidi validation', () => {
console.log('Table format with bidi validation');
        writer = new XmlWriter();
        (editor.wordExportModule as any).mVerticalMerge = new Dictionary<number, number>();
        (editor.wordExportModule as any).mGridSpans = new Dictionary<number, number>();
        writer.writeStartElement('w', 'document', (editor.wordExportModule as any).wNamespace);
        (editor.wordExportModule as any).serializeDocumentBody(writer);
        writer.writeEndElement('w', 'document', (editor.wordExportModule as any).wNamespace);
        expect(writer.bufferText.indexOf('<w:bidiVisual />')).not.toBe(-1);
    });
});
let sfdt: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":90,"rightMargin":90,"topMargin":72,"bottomMargin":61.20000076293945,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":0,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Left","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Title","listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":11,"underline":"None","boldBidi":true,"fontSizeBidi":11},"inlines":[{"characterFormat":{"fontSize":11,"underline":"None","fontSizeBidi":11},"text":"n"},{"characterFormat":{"fontSize":11,"underline":"None","fontSizeBidi":11},"text":"ew"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"PAGE"},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"1"},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Garamond","fontSizeBidi":11,"fontFamilyBidi":"Garamond"},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false,"localeIdBidi":1025},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{"fontSize":13,"fontColor":"#000000FF","fontSizeBidi":13},"next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":12,"afterSpacing":3,"outlineLevel":"Level3","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"#00000000","boldBidi":true,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"bold":true,"fontSize":13,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"outlineLevel":"Level5","listFormat":{},"keepLinesTogether":true,"keepWithNext":true},"characterFormat":{"fontFamily":"Cambria","fontColor":"#365F91FF","fontFamilyBidi":"Cambria"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Cambria","fontColor":"#365F91FF","fontSizeBidi":13,"fontFamilyBidi":"Cambria"},"basedOn":"Default Paragraph Font"},{"name":"Body Text Indent Char","type":"Character","characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"Title Char","type":"Character","characterFormat":{"underline":"Single","fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"Body Text 3 Char","type":"Character","characterFormat":{"fontSize":8,"fontColor":"#000000FF","fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"Body Text Indent 3 Char","type":"Character","characterFormat":{"fontSize":8,"fontColor":"#000000FF","fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":1,"fontColor":"#000000FF","fontSizeBidi":1},"basedOn":"Default Paragraph Font"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":13,"fontColor":"#000000FF","fontSizeBidi":13},"basedOn":"Default Paragraph Font"},{"name":"Page Number","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontColor":"#000000FF"},"basedOn":"Default Paragraph Font"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontColor":"#000000FF","boldBidi":true},"basedOn":"Comment Text Char"},{"name":"Numbering Symbols","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Heading","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":12,"afterSpacing":6,"listFormat":{},"keepWithNext":true},"characterFormat":{"fontSize":14,"fontFamily":"Arial","fontSizeBidi":14,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Body Text"},{"name":"Body Text","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":7,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Body Text"},{"name":"List","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"basedOn":"Body Text","next":"List"},{"name":"Caption","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":6,"afterSpacing":6,"listFormat":{}},"characterFormat":{"italic":true,"fontSize":12,"italicBidi":true,"fontSizeBidi":12},"basedOn":"Normal","next":"Caption"},{"name":"Index","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Index"},{"name":"Body Text Indent","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":108,"firstLineIndent":-36,"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","listFormat":{},"widowControl":false},"characterFormat":{"fontSize":14,"fontColor":"#00000000","fontSizeBidi":14},"basedOn":"Normal","link":"Body Text Indent Char","next":"Body Text Indent"},{"name":"Title","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Center","listFormat":{}},"characterFormat":{"fontSize":10,"underline":"Single","fontSizeBidi":10},"basedOn":"Normal","link":"Title Char","next":"Title"},{"name":"Body Text 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Justify","listFormat":{},"widowControl":false},"characterFormat":{"fontColor":"#00000000"},"basedOn":"Normal","link":"Body Text 3 Char","next":"Body Text 3"},{"name":"Char Char Char Char","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Verdana","fontColor":"#00000000","fontSizeBidi":10,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"Char Char Char Char"},{"name":"Body Text Indent 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":18,"afterSpacing":6,"listFormat":{}},"characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Normal","link":"Body Text Indent 3 Char","next":"Body Text Indent 3"},{"name":"Char1 Char Char Char","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Verdana","fontColor":"#00000000","fontSizeBidi":10,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"Char1 Char Char Char"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Char Char Char Char Char Char Char Char Char Char Char Char","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Verdana","fontColor":"#00000000","fontSizeBidi":10,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"Char Char Char Char Char Char Char Char Char Char Char Char"},{"name":"Header and Footer","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Header and Footer"},{"name":"Header","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Char","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Verdana","fontColor":"#00000000","fontSizeBidi":10,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"Char"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":36,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Char1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Verdana","fontColor":"#00000000","fontSizeBidi":10,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","next":"Char1"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Word export validation of content with character format Underline vaidation', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(sfdt));
        writer = new XmlWriter();

    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Character format with underline "none" - export validation', () => {
console.log('Character format with underline "none" - export validation');
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[0], true);
        expect(writer.bufferText.indexOf('<w:u w:val="none" />')).not.toBe(-1);
    });
});
let comment: any = {"sections":[{"blocks":[{"inlines":[{"commentId":"4ed79fdd-6a1e-4aac-b367-96f40048baf0","commentCharacterType":0},{"text":"Ragu"},{"commentId":"4ed79fdd-6a1e-4aac-b367-96f40048baf0","commentCharacterType":1}]}],"headersFooters":{"header":{"blocks":[{"inlines":[]}]},"footer":{"blocks":[{"inlines":[]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"Arabic","columns":{"column":[{"width":468.0,"space":0.0}],"numberOfColumns":1,"equalWidth":true}}}],"characterFormat":{"bold":false,"italic":false,"underline":"None","strikethrough":"None","baselineAlignment":"Normal","fontSize":11.0,"fontColor":"#00000000","italicBidi":false,"fontSizeBidi":11.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":0.0,"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","textAlignment":"Left","keepWithNext":false,"keepLinesTogether":false,"widowControl":true},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontColor":"#2F5496FF","fontSizeBidi":16.0},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":12.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left"}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontColor":"#2F5496FF","fontSizeBidi":16.0}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":13.0,"fontColor":"#2F5496FF","fontSizeBidi":13.0},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","textAlignment":"Left"}},{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":13.0,"fontColor":"#2F5496FF","fontSizeBidi":13.0}},{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Heading 3 Char","characterFormat":{"fontSize":12.0,"fontColor":"#1F3763FF","fontSizeBidi":12.0},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","textAlignment":"Left"}},{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontColor":"#1F3763FF","fontSizeBidi":12.0}},{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","link":"Heading 4 Char","characterFormat":{"italic":true,"fontColor":"#2F5496FF","italicBidi":true},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","textAlignment":"Left"}},{"type":"Character","name":"Heading 4 Char","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontColor":"#2F5496FF","italicBidi":true}},{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","link":"Heading 5 Char","characterFormat":{"fontColor":"#2F5496FF"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","textAlignment":"Left"}},{"type":"Character","name":"Heading 5 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#2F5496FF"}},{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","link":"Heading 6 Char","characterFormat":{"fontColor":"#1F3763FF"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","textAlignment":"Left"}},{"type":"Character","name":"Heading 6 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#1F3763FF"}}],"comments":[{"commentId":"4ed79fdd-6a1e-4aac-b367-96f40048baf0","author":"Guest user","initial":"Gu","date":"2022-11-15T19:11:36.22Z","blocks":[{"inlines":[{"text":"syncfusion"}]},{"inlines":[{"text":"software"}]}],"done":false,"replyComments":[]}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"inlines":[{"text":"\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"inlines":[{"text":"\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"}
describe('Word export validation of Comment with mutiple paragraph', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(comment));
        writer = new XmlWriter();
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Comment with multiple paragraph - export validation', () => {
console.log('Comment with multiple paragraph - export validation');
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        writer = new XmlWriter();
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        (editor.wordExportModule as any).serializeSection(writer,json.sections[0],true);
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[0], true);
        (editor.wordExportModule as any).serializeCommentInternal(writer,editor.documentHelper.comments);
        expect(writer.bufferText.indexOf('<w:t xml:space="preserve">syncfusion</w:t>')).not.toBe(-1);
    });
});
let TextBox: any = {
	"sections": [
		{
			"blocks": [
				{
					"characterFormat": {
						"fontSize": 11.0,
						"fontSizeBidi": 11.0
					},
					"paragraphFormat": {
						"textAlignment": "Left",
						"widowControl": false
					},
					"inlines": [
						{
							"shapeId": 1,
							"name": "Text Box 2",
							"visible": true,
							"width": 185.9,
							"height": 22.0,
							"widthScale": 100.0,
							"heightScale": 100.0,
							"lineFormat": {
								"line": false,
								"lineFormatType": "Solid",
								"color": "#000000FF",
								"weight": 0.75,
								"lineStyle": "Solid"
							},
							"fillFormat": {
								"color": "#FFFFFFFF",
								"fill": true
							},
							"textWrappingStyle": "Square",
							"textWrappingType": "Both",
							"verticalPosition": 1.1,
							"verticalOrigin": "Paragraph",
							"verticalAlignment": "None",
							"verticalRelativePercent": -3.4028235e38,
							"horizontalPosition": 151.65,
							"horizontalOrigin": "Column",
							"horizontalAlignment": "None",
							"horizontalRelativePercent": -3.4028235e38,
							"zOrderPosition": 1024,
							"allowOverlap": true,
							"layoutInCell": true,
							"lockAnchor": false,
							"distanceBottom": 3.6,
							"distanceLeft": 9.0,
							"distanceRight": 9.0,
							"distanceTop": 3.6,
							"autoShapeType": "Rectangle",
							"textFrame": {
								"textVerticalAlignment": "Top",
								"leftMargin": 7.2,
								"rightMargin": 7.2,
								"topMargin": 3.6,
								"bottomMargin": 3.6,
								"blocks": [
									{
										"inlines": [
											{
												"text": "Text "
											},
											{
												"text": "within "
											},
											{
												"text": "text, "
											},
											{
												"text": "outline "
											},
											{
												"text": "= "
											},
											{
												"text": "No"
											}
										]
									}
								]
							}
						}
					]
				}
			],
			"headersFooters": {},
			"sectionFormat": {
				"headerDistance": 28.350000381469728,
				"footerDistance": 28.350000381469728,
				"pageWidth": 595.3499755859375,
				"pageHeight": 842.0,
				"leftMargin": 45.349998474121097,
				"rightMargin": 45.349998474121097,
				"topMargin": 56.70000076293945,
				"bottomMargin": 56.70000076293945,
				"differentFirstPage": false,
				"differentOddAndEvenPages": false,
				"bidi": false,
				"restartPageNumbering": true,
				"pageStartingNumber": 1,
				"endnoteNumberFormat": "LowerCaseRoman",
				"footNoteNumberFormat": "Arabic",
				"restartIndexForFootnotes": "DoNotRestart",
				"restartIndexForEndnotes": "DoNotRestart",
				"pageNumberStyle": "Arabic",
				"breakCode": "NewPage"
			}
		}
	],
	"characterFormat": {
		"bold": false,
		"italic": false,
		"underline": "None",
		"strikethrough": "None",
		"baselineAlignment": "Normal",
		"fontSize": 11.0,
		"fontFamily": "Times New Roman",
		"fontColor": "#00000000",
		"italicBidi": false,
		"fontSizeBidi": 11.0,
		"fontFamilyBidi": "Times New Roman",
		"fontFamilyAscii": "Times New Roman",
		"fontFamilyFarEast": "Times New Roman",
		"fontFamilyNonFarEast": "Times New Roman"
	},
	"paragraphFormat": {
		"leftIndent": 0.0,
		"rightIndent": 0.0,
		"firstLineIndent": 0.0,
		"beforeSpacing": 0.0,
		"afterSpacing": 0.0,
		"lineSpacing": 1.0,
		"lineSpacingType": "Multiple",
		"textAlignment": "Left",
		"keepWithNext": false,
		"keepLinesTogether": false,
		"widowControl": true
	},
	"lists": [
		{
			"listId": 0,
			"abstractListId": 0
		},
		{
			"listId": 1,
			"abstractListId": 1
		},
		{
			"listId": 2,
			"abstractListId": 2
		},
		{
			"listId": 3,
			"abstractListId": 3
		}
	],
	"abstractLists": [
		{
			"abstractListId": 0,
			"levels": [
				{
					"listLevelPattern": "Bullet",
					"followCharacter": "Tab",
					"numberFormat": "",
					"characterFormat": {
						"fontFamily": "Symbol",
						"fontFamilyAscii": "Symbol",
						"fontFamilyNonFarEast": "Symbol"
					},
					"paragraphFormat": {
						"leftIndent": 32.150001525878909,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 32.150001525878909,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 0,
					"restartLevel": 1,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 2,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 3,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 4,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 5,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 6,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 7,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 8,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				}
			]
		},
		{
			"abstractListId": 1,
			"levels": [
				{
					"startAt": 1,
					"restartLevel": 0,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab",
					"numberFormat": "%1.",
					"paragraphFormat": {
						"leftIndent": 18.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 18.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 0,
					"restartLevel": 1,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 2,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 3,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 4,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 5,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 6,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 7,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 8,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				}
			]
		},
		{
			"abstractListId": 2,
			"levels": [
				{
					"listLevelPattern": "Bullet",
					"followCharacter": "Tab",
					"numberFormat": "",
					"characterFormat": {
						"fontFamily": "Symbol",
						"fontFamilyAscii": "Symbol",
						"fontFamilyNonFarEast": "Symbol"
					},
					"paragraphFormat": {
						"leftIndent": 18.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 18.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 0,
					"restartLevel": 1,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 2,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 3,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 4,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 5,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 6,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 7,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				},
				{
					"startAt": 0,
					"restartLevel": 8,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab"
				}
			]
		},
		{
			"abstractListId": 3,
			"levels": [
				{
					"startAt": 1,
					"restartLevel": 0,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab",
					"numberFormat": " %1",
					"characterFormat": {
						"bold": false,
						"italic": false,
						"italicBidi": false
					},
					"paragraphFormat": {
						"leftIndent": 36.0,
						"firstLineIndent": -36.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 36.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 1,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab",
					"numberFormat": "%1.%2",
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 12.0,
						"fontFamily": "Times New Roman",
						"italicBidi": false,
						"fontSizeBidi": 12.0,
						"fontFamilyBidi": "Times New Roman",
						"fontFamilyAscii": "Times New Roman",
						"fontFamilyNonFarEast": "Times New Roman"
					},
					"paragraphFormat": {
						"leftIndent": 36.0,
						"firstLineIndent": -36.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 36.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 2,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab",
					"numberFormat": "%1.%2.%3",
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 12.0,
						"fontFamily": "Times New Roman",
						"italicBidi": false,
						"fontSizeBidi": 12.0,
						"fontFamilyBidi": "Times New Roman",
						"fontFamilyAscii": "Times New Roman",
						"fontFamilyNonFarEast": "Times New Roman"
					},
					"paragraphFormat": {
						"leftIndent": 72.0,
						"firstLineIndent": -36.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 72.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 3,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab",
					"numberFormat": "(%4)",
					"paragraphFormat": {
						"leftIndent": 72.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 72.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 4,
					"listLevelPattern": "LowLetter",
					"followCharacter": "Tab",
					"numberFormat": "(%5)",
					"paragraphFormat": {
						"leftIndent": 90.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 90.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 5,
					"listLevelPattern": "LowRoman",
					"followCharacter": "Tab",
					"numberFormat": "(%6)",
					"paragraphFormat": {
						"leftIndent": 108.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 108.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 6,
					"listLevelPattern": "Arabic",
					"followCharacter": "Tab",
					"numberFormat": "%7.",
					"paragraphFormat": {
						"leftIndent": 126.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 126.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 7,
					"listLevelPattern": "LowLetter",
					"followCharacter": "Tab",
					"numberFormat": "%8.",
					"paragraphFormat": {
						"leftIndent": 144.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 144.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				},
				{
					"startAt": 1,
					"restartLevel": 8,
					"listLevelPattern": "LowRoman",
					"followCharacter": "Tab",
					"numberFormat": "%9.",
					"paragraphFormat": {
						"leftIndent": 162.0,
						"firstLineIndent": -18.0,
						"tabs": [
							{
								"tabJustification": "List",
								"position": 162.0,
								"tabLeader": "None",
								"deletePosition": 0.0
							}
						]
					}
				}
			]
		}
	],
	"background": {
		"color": "#FFFFFFFF"
	},
	"styles": [
		{
			"type": "Paragraph",
			"name": "Normal",
			"next": "Normal",
			"characterFormat": {
				"fontSize": 12.0,
				"fontFamily": "Calibri",
				"fontSizeBidi": 12.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "minorHAnsi"
			},
			"paragraphFormat": {
				"textAlignment": "Justify"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 1",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"fontFamily": "Times New Roman",
				"boldBidi": true,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"outlineLevel": "Level1",
				"tabs": [
					{
						"tabJustification": "Right",
						"position": 396.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 1 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"fontSize": 12.0,
				"boldBidi": true,
				"fontSizeBidi": 12.0
			}
		},
		{
			"type": "Character",
			"name": "Default Paragraph Font"
		},
		{
			"type": "Paragraph",
			"name": "Heading 2",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"afterSpacing": 2.9000000953674318,
				"lineSpacing": 0.8958333134651184,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 2 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 14.0,
				"fontFamily": "Cambria",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 14.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Cambria",
				"fontFamilyNonFarEast": "Cambria"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 3",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"fontFamily": "Times New Roman",
				"boldBidi": true,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"afterSpacing": 2.9000000953674318,
				"lineSpacing": 1.5,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 3 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"fontSize": 13.0,
				"fontFamily": "Cambria",
				"boldBidi": true,
				"fontSizeBidi": 13.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Cambria",
				"fontFamilyNonFarEast": "Cambria"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 4",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"fontFamily": "Times New Roman",
				"boldBidi": true,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"outlineLevel": "Level4",
				"tabs": [
					{
						"tabJustification": "Left",
						"position": -18.950000762939454,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 0.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 36.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 72.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 108.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 189.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 4 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"fontSize": 14.0,
				"fontFamily": "Calibri",
				"boldBidi": true,
				"fontSizeBidi": 14.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 5",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"underline": "Single",
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"leftIndent": 22.299999237060548,
				"rightIndent": 1.4500000476837159,
				"afterSpacing": 6.0,
				"outlineLevel": "Level5",
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 22.5,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 49.5,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 5 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"italic": true,
				"fontSize": 13.0,
				"fontFamily": "Calibri",
				"boldBidi": true,
				"italicBidi": true,
				"fontSizeBidi": 13.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 6",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"underline": "Single",
				"fontFamily": "Times New Roman",
				"boldBidi": true,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"rightIndent": 5.75,
				"afterSpacing": 6.0,
				"outlineLevel": "Level6",
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 6 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"fontFamily": "Calibri",
				"boldBidi": true,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 7",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"underline": "Single",
				"fontFamily": "Times New Roman",
				"boldBidi": true,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"rightIndent": 4.300000190734863,
				"afterSpacing": 6.0,
				"outlineLevel": "Level7",
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 7 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 12.0,
				"fontFamily": "Calibri",
				"fontSizeBidi": 12.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 8",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"boldBidi": true
			},
			"paragraphFormat": {
				"leftIndent": 22.299999237060548,
				"rightIndent": 1.4500000476837159,
				"afterSpacing": 3.0,
				"outlineLevel": "Level8",
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 22.5,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 49.5,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 8 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"italic": true,
				"fontSize": 12.0,
				"fontFamily": "Calibri",
				"italicBidi": true,
				"fontSizeBidi": 12.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		},
		{
			"type": "Paragraph",
			"name": "Heading 9",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"fontSize": 11.5,
				"boldBidi": true,
				"fontSizeBidi": 11.5
			},
			"paragraphFormat": {
				"afterSpacing": 3.0,
				"outlineLevel": "Level9",
				"keepWithNext": true,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Heading 9 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontFamily": "Cambria",
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "Cambria",
				"fontFamilyNonFarEast": "Cambria"
			}
		},
		{
			"type": "Paragraph",
			"name": "envelope address",
			"basedOn": "Normal",
			"next": "envelope address",
			"paragraphFormat": {
				"leftIndent": 144.0
			}
		},
		{
			"type": "Paragraph",
			"name": "indent",
			"basedOn": "Normal",
			"next": "indent",
			"paragraphFormat": {
				"leftIndent": 36.0
			}
		},
		{
			"type": "Paragraph",
			"name": "Body Text",
			"basedOn": "Normal",
			"next": "Body Text",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Body Text Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Paragraph",
			"name": "Body Text Indent",
			"basedOn": "Normal",
			"next": "Body Text Indent",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"leftIndent": 36.0,
				"tabs": [
					{
						"tabJustification": "Left",
						"position": -18.950000762939454,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 0.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 36.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 72.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 108.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 189.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Body Text Indent Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Paragraph",
			"name": "Header",
			"basedOn": "Normal",
			"next": "Header",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "Times New Roman",
				"fontSizeBidi": 10.0,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"tabs": [
					{
						"tabJustification": "Center",
						"position": 207.64999389648438,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Right",
						"position": 415.29998779296877,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Header Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Paragraph",
			"name": "Text",
			"basedOn": "Normal",
			"next": "Text",
			"characterFormat": {
				"fontSize": 11.0,
				"fontFamily": "Times New Roman",
				"fontSizeBidi": 11.0,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"afterSpacing": 13.0,
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 14.199999809265137,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Text Char",
			"basedOn": "Default Paragraph Font"
		},
		{
			"type": "Paragraph",
			"name": "List Bullet",
			"basedOn": "Normal",
			"next": "List Bullet",
			"paragraphFormat": {
				"textAlignment": "Left",
				"listFormat": {
					"listId": 2
				}
			}
		},
		{
			"type": "Paragraph",
			"name": "Bullet",
			"basedOn": "Normal",
			"next": "Bullet",
			"characterFormat": {
				"fontSize": 11.0,
				"fontFamily": "Times New Roman",
				"fontSizeBidi": 11.0,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"leftIndent": 14.199999809265137,
				"firstLineIndent": -14.199999809265137,
				"afterSpacing": 13.0,
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 14.199999809265137,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Bullet Char",
			"basedOn": "Default Paragraph Font"
		},
		{
			"type": "Paragraph",
			"name": "Subject",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"bold": true,
				"fontSize": 11.0,
				"fontFamily": "Times New Roman",
				"boldBidi": true,
				"fontSizeBidi": 11.0,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"afterSpacing": 6.5,
				"lineSpacing": 13.0,
				"lineSpacingType": "Exactly",
				"keepLinesTogether": true
			}
		},
		{
			"type": "Paragraph",
			"name": "Body Text Indent 3",
			"basedOn": "Normal",
			"next": "Body Text Indent 3",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"leftIndent": 22.5,
				"afterSpacing": 6.0,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Body Text Indent 3 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 8.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 8.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Paragraph",
			"name": "Block Text",
			"basedOn": "Normal",
			"next": "Block Text",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"leftIndent": 22.5,
				"rightIndent": 1.4500000476837159,
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 22.5,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Left",
						"position": 49.5,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"widowControl": false
			}
		},
		{
			"type": "Paragraph",
			"name": "Body Text 2",
			"basedOn": "Normal",
			"next": "Body Text 2",
			"paragraphFormat": {
				"rightIndent": 10.199999809265137,
				"widowControl": false
			}
		},
		{
			"type": "Character",
			"name": "Body Text 2 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Paragraph",
			"name": "Document Map",
			"basedOn": "Normal",
			"next": "Document Map",
			"characterFormat": {
				"fontFamily": "Tahoma",
				"fontFamilyAscii": "Tahoma",
				"fontFamilyNonFarEast": "Tahoma"
			}
		},
		{
			"type": "Character",
			"name": "Document Map Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 1.0,
				"fontSizeBidi": 1.0
			}
		},
		{
			"type": "Paragraph",
			"name": "Body Text Indent 2",
			"basedOn": "Normal",
			"next": "Body Text Indent 2",
			"paragraphFormat": {
				"leftIndent": 22.299999237060548
			}
		},
		{
			"type": "Character",
			"name": "Body Text Indent 2 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Paragraph",
			"name": "Footer",
			"basedOn": "Normal",
			"next": "Footer",
			"paragraphFormat": {
				"tabs": [
					{
						"tabJustification": "Center",
						"position": 216.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Right",
						"position": 432.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Footer Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Character",
			"name": "Page Number",
			"basedOn": "Default Paragraph Font"
		},
		{
			"type": "Paragraph",
			"name": "Balloon Text",
			"basedOn": "Normal",
			"next": "Balloon Text",
			"characterFormat": {
				"fontSize": 8.0,
				"fontFamily": "Tahoma",
				"fontSizeBidi": 8.0,
				"fontFamilyBidi": "Tahoma",
				"fontFamilyAscii": "Tahoma",
				"fontFamilyNonFarEast": "Tahoma"
			}
		},
		{
			"type": "Character",
			"name": "Balloon Text Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 1.0,
				"fontSizeBidi": 1.0
			}
		},
		{
			"type": "Paragraph",
			"name": "Filestamp",
			"basedOn": "Normal",
			"next": "Filestamp",
			"characterFormat": {
				"fontSize": 5.0,
				"fontFamily": "Arial",
				"fontSizeBidi": 5.0,
				"fontFamilyBidi": "Arial",
				"fontFamilyAscii": "Arial",
				"fontFamilyNonFarEast": "Arial"
			},
			"paragraphFormat": {
				"textAlignment": "Left"
			}
		},
		{
			"type": "Paragraph",
			"name": "Section Start",
			"basedOn": "Normal",
			"next": "Heading 1",
			"characterFormat": {
				"fontSize": 24.0,
				"fontFamily": "Arial Black",
				"fontSizeBidi": 24.0,
				"fontFamilyAscii": "Arial Black",
				"fontFamilyNonFarEast": "Arial Black"
			},
			"paragraphFormat": {
				"leftIndent": 18.0,
				"rightIndent": 342.0,
				"firstLineIndent": -8.649999618530274,
				"beforeSpacing": 75.0,
				"afterSpacing": 24.0,
				"lineSpacing": 91.0,
				"lineSpacingType": "Exactly",
				"textAlignment": "Left",
				"listFormat": {
					"listId": 3
				},
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 0.0,
						"tabLeader": "None",
						"deletePosition": 36.0
					},
					{
						"tabJustification": "Left",
						"position": 27.350000381469728,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				],
				"borders": {
					"left": {
						"lineStyle": "Single",
						"lineWidth": 1.5,
						"shadow": false,
						"space": 9.0,
						"hasNoneStyle": false,
						"color": "#000000FF"
					},
					"right": {
						"lineStyle": "Single",
						"lineWidth": 1.5,
						"shadow": false,
						"space": 0.0,
						"hasNoneStyle": false,
						"color": "#000000FF"
					},
					"top": {
						"lineStyle": "Single",
						"lineWidth": 1.5,
						"shadow": false,
						"space": 1.0,
						"hasNoneStyle": false,
						"color": "#000000FF"
					},
					"bottom": {
						"lineStyle": "Single",
						"lineWidth": 1.5,
						"shadow": false,
						"space": 1.0,
						"hasNoneStyle": false,
						"color": "#000000FF"
					}
				}
			}
		},
		{
			"type": "Paragraph",
			"name": "Outline Num 2",
			"basedOn": "Normal",
			"next": "Outline Num 2",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"afterSpacing": 12.0,
				"outlineLevel": "Level2",
				"textAlignment": "Left",
				"listFormat": {
					"listLevelNumber": 1,
					"listId": 3
				}
			}
		},
		{
			"type": "Character",
			"name": "Outline Num 2 Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 12.0,
				"fontSizeBidi": 12.0
			}
		},
		{
			"type": "Paragraph",
			"name": "Outline Num 3",
			"basedOn": "Normal",
			"next": "Outline Num 3",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"afterSpacing": 12.0,
				"outlineLevel": "Level3",
				"textAlignment": "Left",
				"listFormat": {
					"listLevelNumber": 2,
					"listId": 3
				}
			}
		},
		{
			"type": "Paragraph",
			"name": "Footnote Text",
			"basedOn": "Normal",
			"next": "Footnote Text",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "Times New Roman",
				"fontSizeBidi": 10.0,
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyFarEast": "ＭＳ 明朝",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"textAlignment": "Left"
			}
		},
		{
			"type": "Character",
			"name": "Footnote Text Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "CG Times",
				"fontSizeBidi": 10.0,
				"fontFamilyBidi": "Times New Roman",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			}
		},
		{
			"type": "Character",
			"name": "Footnote Reference",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"baselineAlignment": "Superscript"
			}
		},
		{
			"type": "Paragraph",
			"name": "List Paragraph",
			"basedOn": "Normal",
			"next": "List Paragraph",
			"paragraphFormat": {
				"leftIndent": 36.0,
				"contextualSpacing": true
			}
		},
		{
			"type": "Character",
			"name": "Hyperlink",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"underline": "Single",
				"fontColor": "#0000FFFF"
			}
		},
		{
			"type": "Paragraph",
			"name": "Default",
			"next": "Default",
			"characterFormat": {
				"fontSize": 12.0,
				"fontFamily": "Arial",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12.0,
				"fontFamilyBidi": "Arial",
				"fontFamilyAscii": "Arial",
				"fontFamilyNonFarEast": "Arial"
			}
		},
		{
			"type": "Paragraph",
			"name": "Normal (Web)",
			"basedOn": "Normal",
			"next": "Normal (Web)",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyFarEast": "minorHAnsi",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"beforeSpacing": 5.0,
				"afterSpacing": 5.0,
				"spaceBeforeAuto": true,
				"spaceAfterAuto": true,
				"textAlignment": "Left"
			}
		},
		{
			"type": "Paragraph",
			"name": "List Bullet 2",
			"basedOn": "Normal",
			"next": "List Bullet 2",
			"paragraphFormat": {
				"listFormat": {
					"listId": 0
				},
				"contextualSpacing": true
			}
		},
		{
			"type": "Paragraph",
			"name": "Normal Indent 2",
			"basedOn": "Normal",
			"next": "Normal Indent 2",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"leftIndent": 36.0,
				"afterSpacing": 12.0,
				"textAlignment": "Left"
			}
		},
		{
			"type": "Character",
			"name": "Normal Indent 2 Char1",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 12.0,
				"fontSizeBidi": 12.0
			}
		},
		{
			"type": "Paragraph",
			"name": "Outline Num 2 + Arial",
			"basedOn": "Outline Num 2",
			"next": "Outline Num 2 + Arial",
			"characterFormat": {
				"bold": true,
				"boldBidi": true
			},
			"paragraphFormat": {
				"leftIndent": 64.4000015258789,
				"firstLineIndent": -64.4000015258789,
				"outlineLevel": "Level2",
				"listFormat": {
					"listLevelNumber": 0,
					"listId": -1
				},
				"tabs": [
					{
						"tabJustification": "List",
						"position": 35.45000076293945,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Emphasis",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"italic": true,
				"italicBidi": true
			}
		},
		{
			"type": "Paragraph",
			"name": "TOC 1",
			"basedOn": "Normal",
			"next": "Normal",
			"characterFormat": {
				"fontSize": 11.0,
				"fontFamily": "Calibri",
				"fontSizeBidi": 11.0,
				"fontFamilyBidi": "Calibri",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"afterSpacing": 10.0,
				"lineSpacing": 1.5,
				"lineSpacingType": "Multiple",
				"tabs": [
					{
						"tabJustification": "Right",
						"position": 504.1499938964844,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Paragraph",
			"name": "TOC 3",
			"basedOn": "Normal",
			"next": "Normal",
			"paragraphFormat": {
				"leftIndent": 24.0,
				"afterSpacing": 5.0
			}
		},
		{
			"type": "Paragraph",
			"name": "b76105cf-b244-439c-a918-e19508fdc417",
			"basedOn": "Normal",
			"next": "b76105cf-b244-439c-a918-e19508fdc417",
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyAscii": "Times New Roman",
				"fontFamilyNonFarEast": "Times New Roman"
			},
			"paragraphFormat": {
				"textAlignment": "Left"
			}
		},
		{
			"type": "Paragraph",
			"name": "List Number",
			"basedOn": "Normal",
			"next": "List Number",
			"characterFormat": {
				"fontFamily": "CG Times",
				"fontFamilyAscii": "CG Times",
				"fontFamilyNonFarEast": "CG Times"
			},
			"paragraphFormat": {
				"listFormat": {
					"listId": 1
				},
				"contextualSpacing": true
			}
		},
		{
			"type": "Paragraph",
			"name": "Table heading",
			"next": "Table heading",
			"characterFormat": {
				"bold": true,
				"fontSize": 9.0,
				"fontFamily": "Calibri",
				"fontColor": "#FFFFFFFF",
				"boldBidi": true,
				"fontSizeBidi": 9.0,
				"fontFamilyBidi": "Arial",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"beforeSpacing": 2.0,
				"afterSpacing": 2.0,
				"keepWithNext": true
			}
		},
		{
			"type": "Paragraph",
			"name": "Table column left",
			"basedOn": "Normal",
			"next": "Table column left",
			"characterFormat": {
				"fontSize": 9.0,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"fontSizeBidi": 9.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"beforeSpacing": 2.0,
				"afterSpacing": 2.0,
				"textAlignment": "Left",
				"keepWithNext": true
			}
		},
		{
			"type": "Paragraph",
			"name": "Table column right",
			"basedOn": "Normal",
			"next": "Table column right",
			"characterFormat": {
				"fontSize": 9.0,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"fontSizeBidi": 9.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"beforeSpacing": 2.0,
				"afterSpacing": 2.0,
				"textAlignment": "Right"
			}
		},
		{
			"type": "Paragraph",
			"name": "Table subtitle",
			"basedOn": "Normal",
			"next": "Table subtitle",
			"characterFormat": {
				"bold": true,
				"fontSize": 9.0,
				"fontFamily": "Calibri",
				"fontColor": "#8064A2FF",
				"boldBidi": true,
				"fontSizeBidi": 9.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"beforeSpacing": 2.0,
				"afterSpacing": 2.0,
				"textAlignment": "Left",
				"keepWithNext": true
			}
		},
		{
			"type": "Character",
			"name": "Table subtitle Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"fontSize": 9.0,
				"fontFamily": "Calibri",
				"fontColor": "#8064A2FF",
				"boldBidi": true,
				"fontSizeBidi": 9.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		},
		{
			"type": "Paragraph",
			"name": "Bullet last",
			"basedOn": "Bullet",
			"next": "Normal",
			"characterFormat": {
				"fontSize": 10.0,
				"fontFamily": "Calibri",
				"fontSizeBidi": 10.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"beforeSpacing": 3.0,
				"afterSpacing": 12.0,
				"textAlignment": "Left",
				"tabs": [
					{
						"tabJustification": "Left",
						"position": 0.0,
						"tabLeader": "None",
						"deletePosition": 14.2
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Strong",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"bold": true,
				"boldBidi": true
			}
		},
		{
			"type": "Paragraph",
			"name": "Plain Text",
			"basedOn": "Normal",
			"next": "Plain Text",
			"characterFormat": {
				"fontSize": 11.0,
				"fontFamily": "Calibri",
				"fontSizeBidi": 11.0,
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			},
			"paragraphFormat": {
				"textAlignment": "Left"
			}
		},
		{
			"type": "Character",
			"name": "Plain Text Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontFamily": "Calibri",
				"fontFamilyAscii": "Calibri",
				"fontFamilyNonFarEast": "Calibri"
			}
		}
	],
	"defaultTabWidth": 36.0,
	"formatting": false,
	"trackChanges": false,
	"protectionType": "NoProtection",
	"enforcement": false,
	"dontUseHTMLParagraphAutoSpacing": false,
	"alignTablesRowByRow": false,
	"formFieldShading": true,
	"footnotes": {
		"separator": [
			{
				"inlines": [
					{
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"inlines": [
					{
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"inlines": []
			}
		]
	},
	"endnotes": {
		"separator": [
			{
				"inlines": [
					{
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"inlines": [
					{
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"inlines": []
			}
		]
	},
	"compatibilityMode": "Word2013",
	"themeFontLanguages": {
		"localeIdBidi": 1025
	},
	"themes": {
		"fontScheme": {
			"majorFontScheme": {
				"fontSchemeList": [
					{
						"name": "latin",
						"typeface": "Cambria"
					},
					{
						"name": "ea"
					},
					{
						"name": "cs"
					}
				]
			},
			"minorFontScheme": {
				"fontSchemeList": [
					{
						"name": "latin",
						"typeface": "Calibri"
					},
					{
						"name": "ea"
					},
					{
						"name": "cs"
					}
				]
			}
		}
	}
};
    describe('Outline is added for texbox in the exported document', () => {
    let editor: DocumentEditor = undefined;
    let json: any;
    let writer: any = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(TextBox));
        writer = new XmlWriter();
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('To check Outline is added for texbox - export validation', () => {
console.log('To check Outline is added for texbox - export validation');
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        writer = new XmlWriter();
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        (editor.wordExportModule as any).serializeParagraph(writer, json.sections[0].blocks[0], true);
        expect(writer.bufferText.indexOf('<a:noFill />')).not.toBe(-1);
    });
});
