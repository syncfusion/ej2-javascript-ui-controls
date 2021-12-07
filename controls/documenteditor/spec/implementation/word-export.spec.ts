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
