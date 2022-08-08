import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TextPosition, SfdtExport, HtmlExport, HelperMethods, TableWidget, ParagraphWidget, LineWidget, SelectionCharacterFormat } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';

describe('Page Break Character Document Copy Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false });
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Test Page Break Character Document Html Export', () => {
console.log('Test Page Break Character Document Html Export');
        let object: any = {};
        expect((editor.selection.htmlWriter as any).serializeSpan('\f', object)).toBe('<br style = "page-break-after:always;"/>');
    });
});
describe('Merge Field Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Test Merge Field Copy', () => {
console.log('Test Merge Field Copy');
        editor.editor.insertField('MERGEFIELD ' + 'Field' + ' \\* MERGEFORMAT');
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        expect(html.indexOf('<a')).toBe(-1);
    });
});

describe('Copy table validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Cell width validation', () => {
console.log('Cell width validation');
        editor.editor.insertTable();
        editor.selection.selectTable();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        let cellWidth: number = editor.selection.cellFormat.preferredWidth;
        expect(html.indexOf(cellWidth.toString())).toBe(-1);
    });
});
describe('Paragraph format copy validation', () => {
    it('Line Spacing validation', () => {
console.log('Line Spacing validation');
        let paragraphFormat: any = { "firstLineIndent": 36, "lineSpacing": 1.14723483284, "styleName": "Normal", "listFormat": {}, "inlineFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 36, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1.147324838434, "lineSpacingType": "Multiple", "styleName": "Normal", "outlineLevel": "BodyText", "listFormat": {}, "bidi": false, "contextualSpacing": false } };
        let lineHeight: string[] = HtmlExport.prototype.serializeParagraphFormat(paragraphFormat, false).split('line-height:');
        expect(lineHeight[1]).toBe('1.1');
    });
});
describe('Get color Validation', () => {
    let colorcode: string = '#2F5496ff';
    it('color code validaton', () => {
console.log('color code validaton');
        let color: string = HelperMethods.getColor(colorcode);
        expect(color.length).toBe(7);
    });
});
describe('Background color validation', () => {
    let cell: any = { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": undefined, "inlineFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "outlineLevel": "BodyText", "listFormat": {}, "bidi": false, "contextualSpacing": false } }, "characterFormat": { "inlineFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "bidi": false, "bdo": "None", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#ee1e1e", "lineStyle": "Single", "lineWidth": 1 }, "left": { "color": "#ee1e1e", "lineStyle": "Single", "lineWidth": 1 }, "right": { "color": "#ee1e1e", "lineStyle": "Single", "lineWidth": 1 }, "bottom": { "color": "#ee1e1e", "lineStyle": "Single", "lineWidth": 1 }, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "shading": { "backgroundColor": "#59efd6ff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "cellWidth": 234, "columnSpan": 1, "rowSpan": 1 }, "columnIndex": 0 };
    let table: any = { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {}, "inlineFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "outlineLevel": "BodyText", "listFormat": {}, "bidi": false, "contextualSpacing": false } }, "characterFormat": { "inlineFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "bidi": false, "bdo": "None", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }, "inlines": [] }], "cellFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "shading": { "backgroundColor": "#5af8a4ff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "cellWidth": 234, "columnSpan": 1, "rowSpan": 1 }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {}, "inlineFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "outlineLevel": "BodyText", "listFormat": {}, "bidi": false, "contextualSpacing": false } }, "characterFormat": { "inlineFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "bidi": false, "bdo": "None", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }, "inlines": [] }], "cellFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "shading": { "backgroundColor": "#5af8a4ff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "cellWidth": 234, "columnSpan": 1, "rowSpan": 1 }, "columnIndex": 1 }], "rowFormat": { "height": 0, "heightType": "Auto", "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "gridBefore": 0, "gridAfter": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {}, "inlineFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "outlineLevel": "BodyText", "listFormat": {}, "bidi": false, "contextualSpacing": false } }, "characterFormat": { "inlineFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "bidi": false, "bdo": "None", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }, "inlines": [] }], "cellFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "shading": { "backgroundColor": "#5af8a4ff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "cellWidth": 234, "columnSpan": 1, "rowSpan": 1 }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {}, "inlineFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "outlineLevel": "BodyText", "listFormat": {}, "bidi": false, "contextualSpacing": false } }, "characterFormat": { "inlineFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "bidi": false, "bdo": "None", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" } }, "inlines": [] }], "cellFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "shading": { "backgroundColor": "#5af8a4ff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "cellWidth": 234, "columnSpan": 1, "rowSpan": 1 }, "columnIndex": 1 }], "rowFormat": { "height": 0, "heightType": "Auto", "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "diagonalDown": {}, "diagonalUp": {}, "horizontal": {}, "vertical": {} }, "gridBefore": 0, "gridAfter": 0 } }], "grid": [234, 234], "tableFormat": { "borders": { "top": { "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": {}, "diagonalUp": {}, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5 } }, "shading": { "backgroundColor": "#5af8a4ff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidthType": "Auto" }, "columnCount": 2 };
    it('cell, table background color validation', () => {
console.log('cell, table background color validation');
        expect(colorCode(HtmlExport.prototype.serializeCell(cell))).toBe(7);
        expect(colorCode(HtmlExport.prototype.createTableStartTag(table))).toBe(7);
    });
});
function colorCode(color: string): number {
    let colorcode: string[] = color.split('bgcolor="');
    let code: string[] = colorcode[1].split('"');
    return code[0].length;
}
describe('Heading style validation', () => {
    it('Default style validation', () => {
console.log('Default style validation');
        expect(HtmlExport.prototype.getStyleName('Heading 1')).toBe('h1');
        expect(HtmlExport.prototype.getStyleName('Normal')).toBe('div');
    });
});


describe('Copy html tag', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('validation', () => {
console.log('validation');
        editor.editor.insertText('<html>');
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        expect(html.indexOf('&lt;html&gt;')).not.toBe(-1);
    });
    it('table with left indent copy validation', () => {
console.log('table with left indent copy validation');
        editor.openBlank();
        editor.editor.insertTable(2,2);
        let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as any;
        table.tableFormat.leftIndent = 1;
        editor.selection.selectAll();
        expect(() => { editor.selection.copy(); }).not.toThrowError();
    });
    it('all caps validation on copy paste', () => {
console.log('all caps validation on copy paste');
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.selectAll();
        editor.selection.copy();
        editor.editor.paste();
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].characterFormat.allCaps).toBe(false);
    });
});

describe('Copy Iamge validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Copy Iamge validation', () => {
console.log('Copy Iamge validation');
        let imageString: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
        editor.editor.insertImage(imageString,200,200);
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        let width: number = editor.selection.imageFormat.width;
        expect(html.indexOf(width.toString())).not.toBe(-1);
    });
});

describe('Copy empty para character format validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
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
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Copy empty para character format validation', () => {
        console.log('Copy empty para character format validation');
        let sfdt: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false, "pageNumberStyle": "Arabic" }, "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "highlightColor": "Green", "bidi": false }, "inlines": [{ "characterFormat": { "highlightColor": "Green", "bidi": false }, "text": "Syncfusion" }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "highlightColor": "Green" }, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": { "highlightColor": "Green" }, "inlines": [{ "characterFormat": { "highlightColor": "Green", "bidi": false }, "text": "Software" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#00000000", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false, "keepLinesTogether": false, "keepWithNext": false, "widowControl": true }, "defaultTabWidth": 36, "trackChanges": false, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "compatibilityMode": "Word2013", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [], "revisions": [], "customXml": [] };
        editor.open(sfdt)
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        let html: string = (editor.selection.htmlWriter as any).serializeParagraphStyle(documentContent.sections[0].blocks[1] as ParagraphWidget);
        expect(html).toBe('text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1')
    });
});
let content: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Syncfusion"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Software"}]}],"headersFooters":{}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Technology"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false,"localeIdBidi":1025},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe("Copied the document contains section break validation",()=>{
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it("Copied the document contains section break validation",()=>{
        console.log("Pasting document contains section break validation");
        editor.open(content);
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        let expectHtml: any = '<div style="font-weight:normal;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:8pt; margin-left:0pt; line-height:1.1;white-space:pre"><span style="font-weight:normal;font-style:normal;">Syncfusion</span></div><div style="font-weight:normal;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:8pt; margin-left:0pt; line-height:1.1;white-space:pre"><span style="font-weight:normal;font-style:normal;">Software</span></div><div style="font-weight:normal;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:8pt; margin-left:0pt; line-height:1.1;white-space:pre"><span style="font-weight:normal;font-style:normal;">Technology</span></div>';
        expect(html).toBe(expectHtml);
    });
});