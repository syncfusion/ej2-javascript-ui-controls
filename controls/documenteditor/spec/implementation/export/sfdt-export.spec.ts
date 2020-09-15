import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer, DocumentHelper } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { LineWidget, ParagraphWidget } from '../../../src/document-editor/implementation/viewer/page';
import { WordExport } from '../../../src/document-editor/implementation/writer/word-export';

let charParaBidi: any = { "sections": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "???", "characterFormat": { "bidi": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second column", "characterFormat": { "bdo": "RTL" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": " ", "characterFormat": { "bdo": "RTL" } }, { "text": "?", "characterFormat": { "bdo": "RTL" } }] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "Third column " }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second Page" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "ssASasAS" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": true } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Line Number", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }] };
let tableBidi: any = { "sections": [{ "blocks": [{ "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "sample" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": true } }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "hgfgfghfgfghfhgfgh" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };


describe('Sfdt export for section,character and paragraph format Bidi validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(charParaBidi));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Section format in export bidi validation', () => {
        expect(exportData.sections[0].sectionFormat.bidi).toBe(true);
    });
    it('Character format in export bidi validation', () => {
        expect(exportData.sections[0].blocks[0].characterFormat.bidi).toBe(true);
        expect(exportData.sections[0].blocks[0].paragraphFormat.bidi).toBeUndefined();
    });
    it('Paragraph format in export bidi validation', () => {
        expect(exportData.sections[0].blocks[2].paragraphFormat.bidi).toBe(true);
    });

    it('Character format in export bdo validation', () => {
        expect(exportData.sections[0].blocks[1].inlines[0].characterFormat.bdo).toBe('RTL');
    });
});

describe('Sfdt export for Table format Bidi validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(tableBidi));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Section format in export bidi validation', () => {
        expect(exportData.sections[0].sectionFormat.bidi).toBe(false);
    });
    it('Table format in export bidi validation', () => {
        expect(exportData.sections[0].blocks[0].tableFormat.bidi).toBe(true);
    });
});


let rtlFormat: any = { "sections": [{ "blocks": [{ "characterFormat": { "bold": true, "boldBidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Sample", "characterFormat": { "bold": true, "boldBidi": true } }] }, { "characterFormat": { "bold": true, "fontSize": 22.0, "fontFamily": "Segoe UI", "boldBidi": true, "fontSizeBidi": 22.0, "fontFamilyBidi": "Segoe UI" }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "سشةحمث", "characterFormat": { "bold": true, "fontSize": 22.0, "fontFamily": "Segoe UI", "bidi": true, "boldBidi": true, "fontSizeBidi": 22.0, "fontFamilyBidi": "Segoe UI" } }] }, { "characterFormat": { "italic": true, "fontSize": 22.0, "bidi": true, "italicBidi": true, "fontSizeBidi": 22.0 }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "text": "דשצפךק", "characterFormat": { "italic": true, "fontSize": 22.0, "bidi": true, "italicBidi": true, "fontSizeBidi": 22.0 } }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };

describe('Sfdt export for Table format Bidi validation', () => {
    let editor: DocumentEditor;
    let exportData: any;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(rtlFormat));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Rtl export font family bidi validation', () => {
        let line: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line.children[0].characterFormat.fontSizeBidi).toBe(22);
        expect(line.children[0].characterFormat.fontFamilyBidi).toBe("Segoe UI");
    });
    it('Word export of RTL format ', () => {
        expect(() => { editor.save('Smaple', 'Docx') }).not.toThrowError();
    });
});


let tab: any = {
    "sections": [
        {
            "blocks": [
                {
                    "inlines": [
                        {
                            "text": "\t"
                        }
                    ]
                }
            ]
        }
    ],
    "defaultTabWidth": 56.0
};
describe('Default tab width export validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('opened document- check default tab width', () => {
        editor.open(JSON.stringify(tab));
        documentHelper = editor.documentHelper;
        let document: any = documentHelper.owner.sfdtExportModule.write();
        expect(document.defaultTabWidth).toBe(56);
    });
    it('open blank default tab width export validation', () => {
        editor.openBlank();
        documentHelper = editor.documentHelper;
        let document: any = documentHelper.owner.sfdtExportModule.write();
        expect(document.defaultTabWidth).toBe(36);
    });
});
let chart: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "chartLegend": { "position": "Bottom", "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 9, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "808080", "rgb": "#808080" } } } }, "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 14, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "000000", "rgb": "#000000" } } }, "chartArea": { "foreColor": "#FFFFFFFF" }, "plotArea": { "foreColor": "#000000FF" }, "chartCategory": [{ "chartData": [{ "yValue": 4.3 }, { "yValue": 2.4 }, { "yValue": 2 }], "categoryXName": "Category 1" }, { "chartData": [{ "yValue": 2.5 }, { "yValue": 4.4 }, { "yValue": 2 }], "categoryXName": "Category 2" }, { "chartData": [{ "yValue": 3.5 }, { "yValue": 1.8 }, { "yValue": 3 }], "categoryXName": "Category 3" }, { "chartData": [{ "yValue": 4.5 }, { "yValue": 2.8 }, { "yValue": 5 }], "categoryXName": "Category 4" }], "chartSeries": [{ "dataPoints": [{ "fill": { "foreColor": "4472c4", "rgb": "#4472c4" }, "line": { "color": "000000", "rgb": "#000000" } }], "seriesName": "Series 1", "dataLabel": { "position": "Outside", "fontName": "+mn-lt", "fontColor": "404040", "fontSize": 9, "isLegendKey": false, "isBubbleSize": false, "isCategoryName": false, "isSeriesName": false, "isValue": true, "isPercentage": false, "isLeaderLines": false }, "errorBar": { "type": "StandardError", "direction": "Both", "endStyle": "Cap", "errorValue": 10 }, "trendLines": [{ "name": "Linear (Series 1)", "type": "Linear", "forward": 0, "backward": 0, "intercept": 2, "isDisplayEquation": true, "isDisplayRSquared": true }] }, { "dataPoints": [{ "fill": { "foreColor": "ed7d31", "rgb": "#ed7d31" }, "line": { "color": "000000", "rgb": "#000000" } }], "seriesName": "Series 2", "dataLabel": { "position": "Outside", "fontName": "+mn-lt", "fontColor": "404040", "fontSize": 9, "isLegendKey": false, "isBubbleSize": false, "isCategoryName": false, "isSeriesName": false, "isValue": true, "isPercentage": false, "isLeaderLines": false }, "errorBar": { "type": "StandardError", "direction": "Both", "endStyle": "Cap", "errorValue": 10 } }, { "dataPoints": [{ "fill": { "foreColor": "a5a5a5", "rgb": "#a5a5a5" }, "line": { "color": "000000", "rgb": "#000000" } }], "seriesName": "Series 3", "dataLabel": { "position": "Outside", "fontName": "+mn-lt", "fontColor": "404040", "fontSize": 9, "isLegendKey": false, "isBubbleSize": false, "isCategoryName": false, "isSeriesName": false, "isValue": true, "isPercentage": false, "isLeaderLines": false }, "errorBar": { "type": "StandardError", "direction": "Both", "endStyle": "Cap", "errorValue": 10 } }], "chartPrimaryCategoryAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "categoryType": "Automatic", "fontSize": 9, "fontName": "+mn-lt", "numberFormat": "General", "maximumValue": 0, "minimumValue": 0, "majorUnit": 0, "hasMajorGridLines": false, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartPrimaryValueAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "fontSize": 9, "fontName": "+mn-lt", "maximumValue": 6, "minimumValue": 0, "majorUnit": 1, "hasMajorGridLines": true, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartTitle": "ClusterBar", "chartType": "Bar_Clustered", "gapWidth": 182, "overlap": 0, "height": 252, "width": 432 }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
let lineChart: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "chartLegend": { "position": "Bottom", "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 9, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "808080", "rgb": "#808080" } } } }, "chartTitleArea": { "fontName": "+mn-lt", "fontSize": 14, "layout": { "layoutX": 0, "layoutY": 0 }, "dataFormat": { "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "000000", "rgb": "#000000" } } }, "chartArea": { "foreColor": "#FFFFFFFF" }, "plotArea": { "foreColor": "#000000FF" }, "chartCategory": [{ "chartData": [{ "yValue": 4.3 }, { "yValue": 2.4 }, { "yValue": 2 }], "categoryXName": "Category 1" }, { "chartData": [{ "yValue": 2.5 }, { "yValue": 4.4 }, { "yValue": 2 }], "categoryXName": "Category 2" }, { "chartData": [{ "yValue": 3.5 }, { "yValue": 1.8 }, { "yValue": 3 }], "categoryXName": "Category 3" }, { "chartData": [{ "yValue": 4.5 }, { "yValue": 2.8 }, { "yValue": 5 }], "categoryXName": "Category 4" }], "chartSeries": [{ "dataPoints": [{ "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "4472c4", "rgb": "#4472c4" } }], "seriesName": "Series 1", "seriesFormat": { "markerStyle": "Circle", "markerSize": 5, "markerColor": "ff4472c4" } }, { "dataPoints": [{ "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "ed7d31", "rgb": "#ed7d31" } }], "seriesName": "Series 2", "seriesFormat": { "markerStyle": "Circle", "markerSize": 5, "markerColor": "ffed7d31" } }, { "dataPoints": [{ "fill": { "foreColor": "000000", "rgb": "#000000" }, "line": { "color": "a5a5a5", "rgb": "#a5a5a5" } }], "seriesName": "Series 3", "seriesFormat": { "markerStyle": "Circle", "markerSize": 5, "markerColor": "ffa5a5a5" } }], "chartPrimaryCategoryAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "categoryType": "Automatic", "fontSize": 9, "fontName": "+mn-lt", "numberFormat": "General", "maximumValue": 0, "minimumValue": 0, "majorUnit": 0, "hasMajorGridLines": false, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartPrimaryValueAxis": { "chartTitle": null, "chartTitleArea": { "layout": {}, "dataFormat": { "fill": {}, "line": {} } }, "fontSize": 9, "fontName": "+mn-lt", "maximumValue": 6, "minimumValue": 0, "majorUnit": 1, "hasMajorGridLines": true, "hasMinorGridLines": false, "majorTickMark": "TickMark_None", "minorTickMark": "TickMark_None", "tickLabelPosition": "TickLabelPosition_NextToAxis" }, "chartTitle": "Chart Title", "chartType": "Line_Markers", "gapWidth": 0, "overlap": 0, "height": 252, "width": 432 }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "ReadOnly", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('Chart export validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('opened document- check chart title', () => {
        editor.open(JSON.stringify(chart));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    it('opened document- check line marker', () => {
        editor.open(JSON.stringify(lineChart));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
});


let breakHypen: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "rightIndent": 0.34999999403953552,
                        "textAlignment": "Justify",
                        "styleName": "List Paragraph"
                    },
                    "inlines": [
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        },
                        {
                            "text": "non"
                        },
                        {
                            "text": "\u001e"
                        },
                        {
                            "text": "refundable "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 72.0,
                        "beforeSpacing": 12.0,
                        "afterSpacing": 4.0,
                        "lineSpacing": 0.85833334922790527,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Justify",
                        "styleName": "List Paragraph",
                        "contextualSpacing": false
                    },
                    "inlines": []
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 13.699999809265137,
                "pageWidth": 612.0,
                "pageHeight": 1008.0,
                "leftMargin": 36.0,
                "rightMargin": 36.0,
                "topMargin": 43.200000762939453,
                "bottomMargin": 43.200000762939453,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false
            }
        }
    ],
    "characterFormat": {
        "fontFamily": "Times New Roman",
        "fontFamilyBidi": "Times New Roman"
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "defaultTabWidth": 36.0,
    "formatting": false,
    "protectionType": "NoProtection",
    "enforcement": false
};

describe('No break hyphen character validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('opened document- check default tab width', () => {
        editor.open(JSON.stringify(breakHypen));
        documentHelper = editor.documentHelper;
        let document: any = documentHelper.owner.sfdtExportModule.write();
        expect(document.sections[0].blocks[0].inlines[3].text).toBe('-');
    });
});

let listJson: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 72,
                "bottomMargin": 72,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "leftIndent": 50.20000076293945,
                        "textAlignment": "Left",
                        "afterSpacing": 6,
                        "styleName": "Body",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "underline": "Single"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "underline": "Single"
                            },
                            "text": " "
                        }
                    ]
                }
            ],
            "headersFooters": {
            }
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "fontSize": 11,
        "fontFamily": "Calibri",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 8,
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 10
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 1
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Heading 2"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 16,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 1
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Body"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Body",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 0,
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            },
            "link": "Body Char",
            "next": "Normal"
        },
        {
            "name": "Body Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 14,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Body"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontColor": "#EB501FFF",
                "italicBidi": true
            },
            "basedOn": "Heading 3",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#EB501FFF",
                "boldBidi": true,
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 12,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#ED7D31FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#ED7D31FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level6",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level7",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "italicBidi": true,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "italicBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level9",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "italicBidi": true,
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 9 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 9 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "italicBidi": true,
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 1,
            "listId": 1
        },
        {
            "abstractListId": 5,
            "listId": 7
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 1,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 21.600000381469727,
                        "firstLineIndent": -21.600000381469727,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.799999237060547,
                        "firstLineIndent": -28.799999237060547,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.20000076293945,
                        "firstLineIndent": -43.20000076293945,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 50.400001525878906,
                        "firstLineIndent": -50.400001525878906,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 57.599998474121094,
                        "firstLineIndent": -57.599998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 64.80000305175781,
                        "firstLineIndent": -64.80000305175781,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -72,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.19999694824219,
                        "firstLineIndent": -79.19999694824219,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 5,
            "levels": [
                {
                    "characterFormat": {
                        "bold": false
                    },
                    "paragraphFormat": {
                        "leftIndent": 32.20000076293945,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%3.",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%4.",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 180,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%5.",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 216,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%6.",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 252,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%7.",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 288,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%8.",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 324,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%9.",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        }
    ]
};
describe('Sfdt export for validating abstract list collection', () => {
    let editor: DocumentEditor;
    let exportData: any;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(listJson));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Abstract list collection validation', () => {
        expect(exportData.abstractLists.length).toBe(2);
    });
});

let sfdt: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bidi": false }, "text": "First Page" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bidi": false }, "text": "Second Page" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": "PAGE  \\* MERGEFORMAT" }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "2" }, { "characterFormat": {}, "fieldType": 1 }] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };

describe('Header Page Number Validation', () => {
    let editor: DocumentEditor;
    let exportData: any;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(sfdt));
        exportData = documentHelper.owner.sfdtExportModule.write();
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('FieldEnd Validation', () => {
        expect(exportData.sections[0].headersFooters.header.blocks[0].inlines[0].hasFieldEnd).toBe(true);
    });
    it('FieldType Validation', () => {
        expect(exportData.sections[0].headersFooters.header.blocks[0].inlines[0].fieldType).toBe(0);
    });
});

let bidi: any = { "sections": [{ "sectionFormat": { "pageWidth": 595.2999877929688, "pageHeight": 841.9000244140625, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 35.400001525878906, "footerDistance": 35.400001525878906, "bidi": true }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bidi": true }, "inlines": [{ "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "bidi": true, "fontFamilyBidi": "Arial" }, "text": "הגיעה קולקציית " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "text": "<<" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "text": "Lead#First" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "text": " name>>" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "bidi": true, "fontFamilyBidi": "Arial" }, "text": " " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "bidi": true, "fontFamilyBidi": "Arial" }, "text": "מרהיבה! עשרות דגמים חדשים במחירים מפתיעים לחברי מועדון " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "bidi": true, "fontFamilyBidi": "Arial" }, "text": "בלבד. מחכים לכם ב" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "bidi": true, "fontFamilyBidi": "Arial" }, "text": " " }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "text": "<<" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "text": "Lead#Last" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "text": " name>>" }, { "characterFormat": { "fontFamily": "Arial", "fontColor": "#000080FF", "bidi": true, "fontFamilyBidi": "Arial" }, "text": "." }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "minorBidi" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Right", "listFormat": {}, "bidi": true }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };

describe('Bidi Property Validation', () => {
    let editor: DocumentEditor;
    let exportData: any;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(bidi));
        exportData = documentHelper.owner.sfdtExportModule.write();
    });
    afterAll((): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
    });
    it('Check Bidi Has a value', () => {
        expect(exportData.styles[0].paragraphFormat.bidi).toBe(true);
    });
});


describe('Export for paragraph and character format validation when document contains selection', () => {
    let editor: DocumentEditor;
    let exportData: any;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);

        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('sfdt export validation', () => {
        editor.editor.insertText('Hello world');
        editor.selection.selectAll();
        editor.selection.characterFormat.bold = true;
        editor.selection.paragraphFormat.textAlignment = 'Center';
        editor.selection.handleHomeKey();
        editor.selection.handleControlShiftRightKey();
        exportData = editor.sfdtExportModule.write();
        expect(exportData.sections[0].blocks[0].paragraphFormat.textAlignment).toBe('Center');
        expect(exportData.sections[0].blocks[0].characterFormat.bold).toBe(true);
    });
});

let jsonData: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": true, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Arial" }, "text": "Issue with the heading styled text" }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }, { "paragraphFormat": { "leftIndent": 28.350000381469727, "textAlignment": "Justify", "afterSpacing": 0, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "afterSpacing": 0, "styleName": "RTZ Heading 2", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "Sub " }, { "characterFormat": {}, "text": "heading" }] }, { "paragraphFormat": { "textAlignment": "Justify", "afterSpacing": 0, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "afterSpacing": 0, "styleName": "RTZ Heading 3", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "List " }, { "characterFormat": {}, "text": "item1" }] }], "headersFooters": { "footer": { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Footer", "listFormat": {} }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10 }, "inlines": [{ "characterFormat": { "fontSize": 10, "fontSizeBidi": 10 }, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontSize": 10, "fontSizeBidi": 10 }, "text": " PAGE   \\* MERGEFORMAT " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "fontSize": 10, "fontSizeBidi": 10 }, "text": "2" }, { "characterFormat": { "fontSize": 10, "fontSizeBidi": 10 }, "fieldType": 1 }] }, { "paragraphFormat": { "styleName": "Footer", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageFooter": { "blocks": [{ "paragraphFormat": { "styleName": "Footer", "listFormat": {} }, "characterFormat": { "italic": true, "fontSize": 8, "italicBidi": true, "fontSizeBidi": 8 }, "inlines": [] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 10, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Arial" }, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 0, "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Cambria", "fontColor": "#365F91FF", "fontSizeBidi": 16, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Cambria", "fontColor": "#365F91FF", "fontSizeBidi": 16, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Header", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 225.64999389648438, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 451.29998779296875, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "link": "Header Char" }, { "name": "Header Char", "type": "Character", "characterFormat": { "fontFamily": "Arial" }, "basedOn": "Default Paragraph Font" }, { "name": "Footer", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 225.64999389648438, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 451.29998779296875, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "link": "Footer Char", "next": "Normal" }, { "name": "Footer Char", "type": "Character", "characterFormat": { "fontFamily": "Arial" }, "basedOn": "Default Paragraph Font" }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "TOC Heading", "type": "Paragraph", "paragraphFormat": { "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "BodyText", "listFormat": {} }, "characterFormat": {}, "basedOn": "Heading 1", "next": "Normal" }, { "name": "TOC 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 11, "afterSpacing": 5, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri", "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 1", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 5, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 22, "afterSpacing": 5, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri", "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "next": "Normal" }, { "name": "RTZ Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 18, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": { "listId": 16 } }, "characterFormat": { "bold": true, "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "RTZ Heading 1 Char", "next": "RTZ Heading 2" }, { "name": "RTZ Heading 1 Char", "type": "Character", "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Heading 2", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 0, "outlineLevel": "BodyText", "listFormat": { "listLevelNumber": 1 } }, "characterFormat": { "bold": false }, "basedOn": "RTZ Heading 1", "next": "RTZ Body Text 2" }, { "name": "RTZ Body Text 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "listFormat": {} }, "characterFormat": { "fontFamilyBidi": "Arial" }, "basedOn": "RTZ Body Text 1" }, { "name": "RTZ Body Text 1", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal" }, { "name": "No Spacing", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial" } }, { "name": "Hyperlink", "type": "Character", "characterFormat": { "underline": "Single", "baselineAlignment": "Normal" }, "basedOn": "Default Paragraph Font" }, { "name": "FollowedHyperlink", "type": "Character", "characterFormat": { "underline": "Single", "fontColor": "#800080FF" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Heading 3", "type": "Paragraph", "paragraphFormat": { "listFormat": { "listLevelNumber": 2 } }, "characterFormat": {}, "basedOn": "RTZ Heading 2", "next": "Normal" }, { "name": "RTZ Heading 4", "type": "Paragraph", "paragraphFormat": { "listFormat": { "listLevelNumber": 3 } }, "characterFormat": {}, "basedOn": "RTZ Heading 3" }, { "name": "RTZ Heading 6", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": { "listId": 16, "listLevelNumber": 5 } }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "RTZ Heading 6 Char" }, { "name": "RTZ Heading 6 Char", "type": "Character", "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Heading 5", "type": "Paragraph", "paragraphFormat": { "listFormat": { "listLevelNumber": 4 } }, "characterFormat": {}, "basedOn": "RTZ Heading 6" }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "listFormat": {}, "contextualSpacing": true }, "characterFormat": {}, "basedOn": "Normal" }, { "name": "RTZ Schedule5 SubHeading 3", "type": "Paragraph", "paragraphFormat": { "outlineLevel": "Level3", "listFormat": { "listLevelNumber": 4 } }, "characterFormat": { "bold": true }, "basedOn": "RTZ Schedule4 SubHeading 2", "link": "RTZ Schedule5 SubHeading 3 Char" }, { "name": "RTZ Schedule4 SubHeading 2", "type": "Paragraph", "paragraphFormat": { "listFormat": { "listLevelNumber": 3 } }, "characterFormat": { "bold": false }, "basedOn": "RTZ Schedule3 SubHeading 1", "link": "RTZ Schedule4 SubHeading 2 Char", "next": "Body Text 2" }, { "name": "RTZ Schedule3 SubHeading 1", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": { "listId": 20, "listLevelNumber": 2 } }, "characterFormat": { "bold": true, "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "RTZ Schedule3 SubHeading 1 Char", "next": "Normal" }, { "name": "RTZ Schedule3 SubHeading 1 Char", "type": "Character", "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Schedule4 SubHeading 2 Char", "type": "Character", "characterFormat": { "bold": false, "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "RTZ Schedule3 SubHeading 1 Char" }, { "name": "Body Text 2", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 6, "lineSpacing": 2, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "link": "Body Text 2 Char" }, { "name": "Body Text 2 Char", "type": "Character", "characterFormat": { "fontFamily": "Arial" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Schedule5 SubHeading 3 Char", "type": "Character", "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Schedule8 SubHeading 6", "type": "Paragraph", "paragraphFormat": { "listFormat": { "listLevelNumber": 7 } }, "characterFormat": {}, "basedOn": "RTZ Schedule7 SubHeading 5" }, { "name": "RTZ Schedule7 SubHeading 5", "type": "Paragraph", "paragraphFormat": { "outlineLevel": "Level5", "listFormat": { "listLevelNumber": 6 } }, "characterFormat": {}, "basedOn": "RTZ Schedule5 SubHeading 3", "link": "RTZ Schedule7 SubHeading 5 Char" }, { "name": "RTZ Schedule7 SubHeading 5 Char", "type": "Character", "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "RTZ Schedule5 SubHeading 3 Char" }, { "name": "RTZ Schedule1 Number & Title", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "textAlignment": "Center", "afterSpacing": 0, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": { "listId": 20 } }, "characterFormat": { "bold": true, "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "next": "Normal" }, { "name": "RTZ Schedule6 SubHeading 4", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 0, "afterSpacing": 0, "outlineLevel": "Level4", "listFormat": { "listLevelNumber": 5 } }, "characterFormat": { "bold": false }, "basedOn": "RTZ Schedule5 SubHeading 3" }, { "name": "RTZ Schedule2 Part Number & Title", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 6, "outlineLevel": "Level2", "listFormat": { "listId": 20, "listLevelNumber": 1 } }, "characterFormat": { "fontFamily": "Arial Bold", "underline": "Single" }, "basedOn": "RTZ Schedule1 Number & Title", "next": "Normal" }, { "name": "annotation reference", "type": "Character", "characterFormat": { "fontSize": 8, "fontSizeBidi": 8 }, "basedOn": "Default Paragraph Font" }, { "name": "annotation text", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "Comment Text Char" }, { "name": "Comment Text Char", "type": "Character", "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Appendix Number", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "afterSpacing": 0, "lineSpacing": 2, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": { "listId": 9 } }, "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial Bold", "boldBidi": true, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal" }, { "name": "RTZ Appendix Title", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 6, "afterSpacing": 0, "lineSpacing": 2, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 10, "boldBidi": true, "fontSizeBidi": 10, "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "RTZ Body Text 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 72, "listFormat": {} }, "characterFormat": {}, "basedOn": "RTZ Body Text 2" }, { "name": "RTZ Body Text 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 108, "listFormat": {} }, "characterFormat": {}, "basedOn": "RTZ Body Text 3" }, { "name": "RTZ Body Text 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 144, "listFormat": {} }, "characterFormat": {}, "basedOn": "RTZ Body Text 4" }, { "name": "RTZ Body Text 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 180, "listFormat": {} }, "characterFormat": {}, "basedOn": "RTZ Body Text 5" }, { "name": "RTZ Body Text Gen", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 56.70000076293945, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "characterFormat": { "fontFamily": "Times New Roman", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "RTZ Body Text Gen Char" }, { "name": "RTZ Body Text Gen Char", "type": "Character", "characterFormat": { "fontFamily": "Times New Roman", "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "RTZ Document Title", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 18, "afterSpacing": 18, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 10, "boldBidi": true, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal" }, { "name": "RTZ Heading 7", "type": "Paragraph", "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -36, "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 216, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal" }, { "name": "RTZ Notice - Party Names", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 24, "afterSpacing": 5, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 10, "boldBidi": true, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Body Text 2" }, { "name": "RTZ Party & Recital Headings", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 56.70000076293945, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "characterFormat": { "bold": true, "fontSize": 10, "boldBidi": true, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal" }, { "name": "RTZ Party Names", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": { "listId": 2 }, "tabs": [{ "position": 0, "deletePosition": 36, "tabJustification": "Left", "tabLeader": "None" }] }, "characterFormat": { "fontSize": 10, "boldBidi": true, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "next": "Normal" }, { "name": "RTZ Recitals", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.100000023841858, "lineSpacingType": "Multiple", "listFormat": { "listId": 0 } }, "characterFormat": { "fontSize": 10, "fontSizeBidi": 10, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "listId": 0 }, { "abstractListId": 2, "listId": 2 }, { "abstractListId": 9, "listId": 9 }, { "abstractListId": 16, "listId": 16 }, { "abstractListId": 20, "listId": 20 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": { "bold": true, "italic": false, "fontSize": 10, "fontFamily": "Arial Bold", "strikethrough": "None", "baselineAlignment": "Normal", "boldBidi": false, "italicBidi": false, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "UpLetter", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 2, "levels": [{ "characterFormat": { "bold": true, "italic": false, "fontSize": 10, "fontFamily": "Arial Bold" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "(%1)", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 72, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -9, "listFormat": {}, "tabs": [{ "position": 108, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 144, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 180, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -9, "listFormat": {}, "tabs": [{ "position": 216, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 252, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 288, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 324, "firstLineIndent": -9, "listFormat": {}, "tabs": [{ "position": 324, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "%9.", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 9, "levels": [{ "characterFormat": { "bold": true, "italic": false, "fontSize": 10, "fontFamily": "Arial Bold", "strikethrough": "None", "baselineAlignment": "Normal", "fontSizeBidi": 11, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 0, "firstLineIndent": 0, "listFormat": {} }, "followCharacter": "None", "listLevelPattern": "UpLetter", "numberFormat": "Appendix %1", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial", "strikethrough": "None", "baselineAlignment": "Normal", "fontSizeBidi": 11, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial", "fontSizeBidi": 11, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%3)", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Times New Roman" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 72, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 108, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 144, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 180, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 216, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 252, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 16, "levels": [{ "characterFormat": { "bold": true, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.", "restartLevel": 0, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2", "restartLevel": 1, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 72, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%3)", "restartLevel": 2, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 108, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%4)", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 144, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "UpLetter", "numberFormat": "(%5)", "restartLevel": 4, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 180, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "UpRoman", "numberFormat": "(%6)", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 216, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 252, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 216, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 288, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 252, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 8, "startAt": 1 }] }, { "abstractListId": 20, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 248.10000610351562, "firstLineIndent": 0, "listFormat": {} }, "followCharacter": "None", "listLevelPattern": "Arabic", "numberFormat": "Schedule %1", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "bold": true, "italic": false, "fontSize": 10, "fontFamily": "Arial Bold", "underline": "Single", "strikethrough": "None", "baselineAlignment": "Normal", "fontColor": "#000000FF", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 0, "firstLineIndent": 0, "listFormat": {} }, "followCharacter": "None", "listLevelPattern": "UpLetter", "numberFormat": "Part %2", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "bold": true, "italic": false, "fontSize": 10, "fontFamily": "Arial Bold", "strikethrough": "None", "baselineAlignment": "Normal" }, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 36, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%3.%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 72, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowLetter", "numberFormat": "(%5)", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 108, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 108, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "LowRoman", "numberFormat": "(%6)", "restartLevel": 5, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 144, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 144, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "UpLetter", "numberFormat": "(%7)", "restartLevel": 6, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "(%8)", "restartLevel": 7, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Arial" }, "paragraphFormat": { "leftIndent": 180, "firstLineIndent": -18, "listFormat": {}, "tabs": [{ "position": 180, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "None", "numberFormat": "", "restartLevel": 8, "startAt": 1 }] }], "comments": [] };
describe('export list level number validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);

        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('sfdt export validation', () => {
        editor.open(JSON.stringify(jsonData));
        exportData = editor.sfdtExportModule.write();
        expect(exportData.styles[16].paragraphFormat.listFormat.listLevelNumber).toBe(1);
    });
});

let levelOverrides: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"RTZ Body Text 2","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Hlk23323837"},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"[Abbreviated "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"name "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"Party "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"used "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"bold":true,"underline":"Single","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"Agreement]"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSizeBidi":10,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"highlightColor":"BrightGreen","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"[SIGNATURE "},{"characterFormat":{"bold":true,"highlightColor":"BrightGreen","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"BLOCK "},{"characterFormat":{"bold":true,"highlightColor":"BrightGreen","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"FOR "},{"characterFormat":{"bold":true,"highlightColor":"BrightGreen","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"CORPORATE "},{"characterFormat":{"bold":true,"highlightColor":"BrightGreen","fontSizeBidi":10,"fontFamilyBidi":"Arial"},"text":"ENTITY]"}]},{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Hlk23323631"},{"characterFormat":{},"bookmarkType":0,"name":"_Hlk23323632"},{"characterFormat":{},"bookmarkType":0,"name":"_Hlk23323634"},{"characterFormat":{},"bookmarkType":0,"name":"_Hlk23323635"},{"characterFormat":{"italic":true,"fontSize":8},"text":"Execution page to Shareholders’ Agreement"},{"characterFormat":{},"bookmarkType":1,"name":"_Hlk23323631"},{"characterFormat":{},"bookmarkType":1,"name":"_Hlk23323632"},{"characterFormat":{},"bookmarkType":1,"name":"_Hlk23323634"},{"characterFormat":{},"bookmarkType":1,"name":"_Hlk23323635"}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":10,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Arial"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":15}},"characterFormat":{"bold":true,"fontFamily":"Arial Bold","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial Bold","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level2","listFormat":{"listLevelNumber":1}},"characterFormat":{"fontFamily":"Arial"},"basedOn":"Heading 1","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{"listId":14,"listLevelNumber":2}},"characterFormat":{"fontColor":"#000000FF","boldBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 3 Char","next":"Heading 3"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{"listId":14,"listLevelNumber":3}},"characterFormat":{"boldBidi":true,"italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{"listId":14,"listLevelNumber":4}},"characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{"listId":14,"listLevelNumber":5}},"characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Appendix Number","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"afterSpacing":0,"lineSpacing":2,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":6}},"characterFormat":{"bold":true,"fontFamily":"Arial Bold","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Appendix Number"},{"name":"RTZ Appendix Title","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"afterSpacing":0,"lineSpacing":2,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"RTZ Appendix Title"},{"name":"RTZ Body Text 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Body Text 1"},{"name":"RTZ Body Text 2","type":"Paragraph","paragraphFormat":{"leftIndent":36,"beforeSpacing":0,"afterSpacing":0,"listFormat":{}},"characterFormat":{"fontFamilyBidi":"Arial"},"basedOn":"RTZ Body Text 1","next":"RTZ Body Text 2"},{"name":"RTZ Body Text 3","type":"Paragraph","paragraphFormat":{"leftIndent":72,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 2","next":"RTZ Body Text 3"},{"name":"RTZ Body Text 4","type":"Paragraph","paragraphFormat":{"leftIndent":108,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 3","next":"RTZ Body Text 4"},{"name":"RTZ Body Text 5","type":"Paragraph","paragraphFormat":{"leftIndent":144,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 4","next":"RTZ Body Text 5"},{"name":"RTZ Body Text 6","type":"Paragraph","paragraphFormat":{"leftIndent":180,"listFormat":{}},"characterFormat":{},"basedOn":"RTZ Body Text 5","next":"RTZ Body Text 6"},{"name":"RTZ Body Text Gen","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":56.70000076293945,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"RTZ Body Text Gen Char","next":"RTZ Body Text Gen"},{"name":"RTZ Body Text Gen Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Document Title","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":18,"afterSpacing":18,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Document Title"},{"name":"RTZ Heading 1","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":9}},"characterFormat":{"bold":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"RTZ Heading 1 Char","next":"Normal"},{"name":"RTZ Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Heading 2","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","outlineLevel":"BodyText","listFormat":{"listLevelNumber":1}},"characterFormat":{"bold":false},"basedOn":"RTZ Heading 1","next":"RTZ Body Text 2"},{"name":"RTZ Heading 3","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":2}},"characterFormat":{},"basedOn":"RTZ Heading 2","next":"RTZ Heading 3"},{"name":"RTZ Heading 4","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":3}},"characterFormat":{},"basedOn":"RTZ Heading 3","next":"RTZ Heading 4"},{"name":"RTZ Heading 6","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":9,"listLevelNumber":5}},"characterFormat":{"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"RTZ Heading 6 Char","next":"RTZ Heading 6"},{"name":"RTZ Heading 6 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Heading 5","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":4}},"characterFormat":{},"basedOn":"RTZ Heading 6","next":"RTZ Heading 5"},{"name":"RTZ Heading 7","type":"Paragraph","paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Heading 7"},{"name":"RTZ Notice - Party Names","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":24,"afterSpacing":5,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Body Text 2","next":"RTZ Notice - Party Names"},{"name":"Body Text 2","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":2,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"basedOn":"Normal","link":"Body Text 2 Char","next":"Body Text 2"},{"name":"Body Text 2 Char","type":"Character","characterFormat":{"fontFamily":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Party & Recital Headings","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":56.70000076293945,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Party & Recital Headings"},{"name":"RTZ Party Names","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":1},"tabs":[{"position":0,"deletePosition":36,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Normal"},{"name":"RTZ Recitals","type":"Paragraph","paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":0}},"characterFormat":{"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"RTZ Recitals"},{"name":"RTZ Schedule1 Number & Title","type":"Paragraph","paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"textAlignment":"Center","beforeSpacing":6,"afterSpacing":6,"lineSpacing":2,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":5}},"characterFormat":{"bold":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Normal"},{"name":"RTZ Schedule2 Part Number & Title","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level2","listFormat":{"listLevelNumber":1}},"characterFormat":{"fontFamily":"Arial Bold","underline":"Single"},"basedOn":"RTZ Schedule1 Number & Title","next":"Normal"},{"name":"RTZ Schedule3 SubHeading 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{"listId":5,"listLevelNumber":2}},"characterFormat":{"bold":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"RTZ Schedule3 SubHeading 1 Char","next":"Normal"},{"name":"RTZ Schedule3 SubHeading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Schedule4 SubHeading 2","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":3}},"characterFormat":{},"basedOn":"RTZ Schedule3 SubHeading 1","link":"RTZ Schedule4 SubHeading 2 Char","next":"Body Text 2"},{"name":"RTZ Schedule4 SubHeading 2 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"RTZ Schedule3 SubHeading 1 Char"},{"name":"RTZ Schedule5 SubHeading 3","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level3","listFormat":{"listLevelNumber":4}},"characterFormat":{"bold":false},"basedOn":"RTZ Schedule4 SubHeading 2","link":"RTZ Schedule5 SubHeading 3 Char","next":"RTZ Schedule5 SubHeading 3"},{"name":"RTZ Schedule5 SubHeading 3 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"RTZ Schedule6 SubHeading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":0,"afterSpacing":0,"outlineLevel":"Level4","listFormat":{"listLevelNumber":5}},"characterFormat":{},"basedOn":"RTZ Schedule5 SubHeading 3","next":"RTZ Schedule6 SubHeading 4"},{"name":"RTZ Schedule7 SubHeading 5","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level5","listFormat":{"listLevelNumber":6}},"characterFormat":{},"basedOn":"RTZ Schedule5 SubHeading 3","link":"RTZ Schedule7 SubHeading 5 Char","next":"RTZ Schedule7 SubHeading 5"},{"name":"RTZ Schedule7 SubHeading 5 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"RTZ Schedule5 SubHeading 3 Char"},{"name":"RTZ Schedule8 SubHeading 6","type":"Paragraph","paragraphFormat":{"listFormat":{"listLevelNumber":7}},"characterFormat":{},"basedOn":"RTZ Schedule7 SubHeading 5","next":"RTZ Schedule8 SubHeading 6"},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention","type":"Character","characterFormat":{"fontColor":"#605E5CFF"},"basedOn":"Default Paragraph Font"},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":5,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":22.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":450.79998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Normal"},{"name":"List Bullet Table","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":3}},"characterFormat":{"fontSize":9,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"List Bullet Table"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"TOC 9","type":"Paragraph","paragraphFormat":{"leftIndent":88,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontFamily":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"TOC Heading","type":"Paragraph","paragraphFormat":{"textAlignment":"Left","beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"BodyText","listFormat":{"listId":-1,"listLevelNumber":0}},"characterFormat":{"bold":false,"fontSize":16,"fontFamily":"Cambria","fontColor":"#365F91FF","boldBidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 1","next":"Normal"},{"name":"TOC 2","type":"Paragraph","paragraphFormat":{"leftIndent":11,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"TOC 3","type":"Paragraph","paragraphFormat":{"leftIndent":22,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"TOC 5","type":"Paragraph","paragraphFormat":{"leftIndent":44,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":1,"levelOverrides":[],"listId":1},{"abstractListId":3,"levelOverrides":[],"listId":3},{"abstractListId":5,"levelOverrides":[],"listId":5},{"abstractListId":6,"levelOverrides":[],"listId":6},{"abstractListId":9,"levelOverrides":[],"listId":9},{"abstractListId":13,"levelOverrides":[{"levelNumber":0,"overrideListLevel":{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":0,"startAt":1}},{"levelNumber":1,"overrideListLevel":{"characterFormat":{"bold":true,"italic":false,"fontColor":"#00000000"},"paragraphFormat":{"leftIndent":64.3499984741211,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1}},{"levelNumber":2,"overrideListLevel":{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":1}},{"levelNumber":3,"overrideListLevel":{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":1}},{"levelNumber":4,"overrideListLevel":{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":1}},{"levelNumber":5,"overrideListLevel":{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":1}},{"levelNumber":6,"overrideListLevel":{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":1}}],"listId":14},{"abstractListId":13,"levelOverrides":[{"levelNumber":0,"overrideListLevel":{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1}},{"levelNumber":1,"overrideListLevel":{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1}}],"listId":15}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold","strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":1,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"(%1)","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":288,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{},"tabs":[{"position":324,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":3,"levels":[{"characterFormat":{"bold":false,"italic":false,"fontSize":8,"fontFamily":"Symbol","fontSizeBidi":8},"paragraphFormat":{"leftIndent":14.199999809265137,"firstLineIndent":-14.199999809265137,"listFormat":{},"tabs":[{"position":14.199999809265137,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":5,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"Schedule %1","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"Part %2","restartLevel":1,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":8,"startAt":1}]},{"abstractListId":6,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":10,"fontFamily":"Arial Bold","strikethrough":"None","baselineAlignment":"Normal","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"UpLetter","numberFormat":"Appendix %1","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial","strikethrough":"None","baselineAlignment":"Normal","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":8,"startAt":1}]},{"abstractListId":9,"levels":[{"characterFormat":{"bold":true,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%4)","restartLevel":3,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"fontFamily":"Arial"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":8,"startAt":1}]},{"abstractListId":13,"levels":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","baselineAlignment":"Normal","boldBidi":false,"italicBidi":false,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":true,"fontColor":"#00000000"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%3)","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%4)","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"UpLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-90,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-90,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-108,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9","restartLevel":8,"startAt":1}]}],"comments":[]}';



describe('Sfdt export level overrides', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);

        editor = new DocumentEditor({ isReadOnly: false });
        editor.enableAllModules();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('document validation', () => {
        editor.open(levelOverrides);
        expect(() => { editor.save('levelOverrides', 'Sfdt') }).not.toThrowError();
    });
});

describe('FormField Validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        documentHelper = editor.documentHelper;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('FormField document validation', () => {
        let formfielddoc: string = '{"sections":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"hasFieldEnd":true,"formFieldData":{"name":"Text1","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"REGULARTEXT","format":""}},"fieldType":0},{"name":"Text1","bookmarkType":0},{"text":" FORMTEXT "},{"fieldType":2},{"text":"REGULARTEXT"},{"fieldType":1},{"name":"Text1","bookmarkType":1}]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"hasFieldEnd":true,"formFieldData":{"name":"Text2","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Number","maxLength":0,"defaultValue":"500,000","format":"#,##0"}},"fieldType":0},{"name":"Text2","bookmarkType":0},{"text":" FORMTEXT "},{"fieldType":2},{"text":"500,000"},{"fieldType":1},{"name":"Text2","bookmarkType":1}]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"hasFieldEnd":true,"formFieldData":{"name":"Text3","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Date","maxLength":0,"defaultValue":"1/1/2020","format":"M/d/yyyy"}},"fieldType":0},{"name":"Text3","bookmarkType":0},{"text":" FORMTEXT "},{"fieldType":2},{"text":"1/1/2020"},{"fieldType":1},{"name":"_GoBack","bookmarkType":0},{"name":"Text3","bookmarkType":1},{"name":"_GoBack","bookmarkType":1}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Character","name":"Placeholder Text","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#808080FF"}}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text1","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"REGULARTEXT","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"Text1"},{"characterFormat":{},"text":" FORMTEXT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"REGULARTEXT"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"Text1"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text2","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Number","maxLength":0,"defaultValue":"500,000","format":"#,##0"}}},{"characterFormat":{},"bookmarkType":0,"name":"Text2"},{"characterFormat":{},"text":" FORMTEXT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"500,000"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"Text2"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text3","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Date","maxLength":0,"defaultValue":"1/1/2020","format":"M/d/yyyy"}}},{"characterFormat":{},"bookmarkType":0,"name":"Text3"},{"characterFormat":{},"text":" FORMTEXT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"1/1/2020"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"Text3"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(formfielddoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });

});

let shapeSfdt: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "fontSize": 20.0,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 20.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 0.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 1,
                            "name": "Text Box 2",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 185.9,
                            "height": 110.6,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#FF0000FF",
                                "weight": 12.5,
                                "lineStyle": "Solid"
                            },
                            "verticalPosition": 29.88,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 18.23,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251660288,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "[Grab your reader’s attention with a great quote from the document or use this space to emphasize a key point. To place this text box anywhere on the page, just drag it.]"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "shapeId": 217,
                            "name": "Text Box 2",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 149.04,
                            "height": 46.8,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#00B0F0FF",
                                "weight": 1.0,
                                "lineStyle": "Solid"
                            },
                            "verticalPosition": 12.07,
                            "verticalOrigin": "Margin",
                            "verticalAlignment": "None",
                            "horizontalPosition": 132.37,
                            "horizontalOrigin": "Margin",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251658240,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 0.0,
                                "rightMargin": 72.0,
                                "topMargin": 0.0,
                                "bottomMargin": 0.0,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontSize": 10.0,
                                            "fontFamily": "Arial",
                                            "fontSizeBidi": 10.0,
                                            "fontFamilyBidi": "Arial"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": " ",
                                                "characterFormat": {
                                                    "fontSize": 10.0,
                                                    "fontFamily": "Arial",
                                                    "fontSizeBidi": 10.0,
                                                    "fontFamilyBidi": "Arial"
                                                }
                                            },
                                            {
                                                "text": "Syncfusion",
                                                "characterFormat": {
                                                    "fontSize": 10.0,
                                                    "fontFamily": "Arial",
                                                    "fontSizeBidi": 10.0,
                                                    "fontFamilyBidi": "Arial"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Action is the foundational key to all success",
                            "characterFormat": {
                                "fontSize": 20.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 20.0,
                                "fontFamilyBidi": "Arial"
                            }
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0
            }
        }
    ]
}
describe('Sfdt export for Shape', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(shapeSfdt));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Shape sfdt', () => {
        let exportShape: any = exportData.sections[0].blocks[0].inlines[0];
        let sfdtShape: any = shapeSfdt.sections[0].blocks[0].inlines[0];
        expect(exportShape.allowOverlap).toBe(sfdtShape.allowOverlap);
        expect(exportShape.alternativeText).toBe(sfdtShape.alternativeText);
        expect(exportShape.autoShapeType).toBe(sfdtShape.autoShapeType);
        expect(exportShape.height).toBe(sfdtShape.height);
        expect(exportShape.heightScale).toBe(sfdtShape.heightScale);
        expect(exportShape.horizontalAlignment).toBe(sfdtShape.horizontalAlignment);
        expect(exportShape.horizontalOrigin).toBe(sfdtShape.horizontalOrigin);
        expect(exportShape.horizontalPosition.toFixed(2)).toBe(sfdtShape.horizontalPosition.toFixed(2));
        expect(exportShape.layoutInCell).toBe(sfdtShape.layoutInCell);
        expect(exportShape.lockAnchor).toBe(sfdtShape.lockAnchor);
        expect(exportShape.name).toBe(sfdtShape.name);
        expect(exportShape.shapeId).toBe(sfdtShape.shapeId);
        expect(exportShape.title).toBe(sfdtShape.title);
        expect(exportShape.width).toBe(sfdtShape.width);
        expect(exportShape.widthScale).toBe(sfdtShape.widthScale);
        expect(exportShape.verticalAlignment).toBe(sfdtShape.verticalAlignment);
        expect(exportShape.verticalOrigin).toBe(sfdtShape.verticalOrigin);
        expect(exportShape.verticalPosition.toFixed(2)).toBe(sfdtShape.verticalPosition.toFixed(2));
        expect(exportShape.zOrderPosition).toBe(sfdtShape.zOrderPosition);
    });
});

let allCapsSFDT: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":"11","fontFamily":"Calibri","allCaps":true},"inlines":[{"characterFormat":{"fontSize":"11","fontFamily":"Calibri","bidi":false,"allCaps":true},"text":"hello world"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[]}

describe('Sfdt export for allCaps property validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(allCapsSFDT));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Character format in export allCaps validation', () => {
        expect(exportData.sections[0].blocks[0].characterFormat.allCaps).toBe(true);
    });
    it('Character format in export allCaps validation in inline', () => {
        expect(exportData.sections[0].blocks[0].inlines[0].characterFormat.allCaps).toBe(true);
    });
});

describe('contentControl Validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        documentHelper = editor.documentHelper;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Rich text validation', () => {
        let richTextdoc: string = '{ "sections": [ { "blocks": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "text": "Text content control" } ] } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "tag": "1", "color": "#003366FF", "title": "sample", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": true, "isChecked": false, "uncheckedState": { "font": null, "value": null }, "checkedState": { "font": null, "value": null }, "contentControlListItems": [] } } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } } ], "defaultTabWidth": 35.400001525878906, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Text content control"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"tag":"1","color":"#003366FF","title":"sample","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":true,"characterFormat":{},"contentControlListItems":[]}}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(richTextdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('Plain text validation in inlines method', () => {
        let plainTextdoc: string = '{ "sections": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "text": "Plain text content control" } ], "contentControlProperties": { "lockContentControl": true, "lockContents": false, "tag": "sample", "color": "#00000000", "title": "plain text", "appearance": "Tags", "type": "Text", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "isChecked": false, "uncheckedState": { "font": null, "value": null }, "checkedState": { "font": null, "value": null }, "contentControlListItems": [] } }, { "text": " check box content control" } ] } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"inlines":[{"characterFormat":{},"text":"Plain text content control"}],"contentControlProperties":{"lockContentControl":true,"lockContents":false,"tag":"sample","color":"#00000000","title":"plain text","appearance":"Tags","type":"Text","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" check box content control"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(plainTextdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('Checkbox validation in inlines method', () => {
        let checkboxdoc: string = '{ "sections": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "inlines": [ { "text": "☐", "characterFormat": { "fontFamily": "MS Gothic" } } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "title": "", "type": "CheckBox", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "isChecked": false, "uncheckedState": { "font": "MS Gothic", "value": "☐" }, "checkedState": { "font": "MS Gothic", "value": "☒" }, "contentControlListItems": [] } }, { "text": " check box content control" } ] } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"inlines":[{"characterFormat":{"fontFamily":"MS Gothic"},"text":"☐"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","title":"","type":"CheckBox","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"isChecked":false,"uncheckedState":{"font":"MS Gothic","value":"☐"},"checkedState":{"font":"MS Gothic","value":"☒"},"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" check box content control"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(checkboxdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('Dropdownlist validation in inlines method', () => {
        let dropDownListdoc: string = '{ "sections": [ { "blocks": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "text": "Choose an item.", "characterFormat": { "styleName": "Placeholder Text" } } ] } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "title": "", "type": "DropDownList", "hasPlaceHolderText": true, "multiline": false, "isTemporary": false, "isChecked": false, "uncheckedState": { "font": null, "value": null }, "checkedState": { "font": null, "value": null }, "contentControlListItems": [ { "displayText": null, "value": "Choose an item." }, { "displayText": "sasa", "value": "sasa" } ] } } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"styleName":"Placeholder Text"},"text":"Choose an item."}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","title":"","type":"DropDownList","hasPlaceHolderText":true,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[{"displayText":null,"value":"Choose an item."},{"displayText":"sasa","value":"sasa"}]}}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(dropDownListdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('Combobox validation in inlines method', () => {
        let Comboboxdoc: string = '{ "sections": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "inlines": [ { "text": "Sample" } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "title": "", "type": "ComboBox", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "isChecked": false, "uncheckedState": { "font": null, "value": null }, "checkedState": { "font": null, "value": null }, "contentControlListItems": [] } } ] } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } } ], "defaultTabWidth": 35.400001525878906, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"inlines":[{"characterFormat":{},"text":"Sample"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","title":"","type":"ComboBox","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(Comboboxdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('date validation in inlines method', () => {
        let dateboxdoc: string = '{ "sections": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [ { "inlines": [ { "text": "7/30/2020" } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "title": "", "type": "Date", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "isChecked": false, "dateCalendarType": "Gregorian", "dateStorageFormat": "DateStorageDateTime", "dateDisplayLocale": "en_US", "dateDisplayFormat": "M/d/yyyy", "uncheckedState": { "font": null, "value": null }, "checkedState": { "font": null, "value": null }, "contentControlListItems": [] } }, { "text": " asdasdsadsadsadasd asdaskldj sakdjaklsd" } ] } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Times New Roman" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"inlines":[{"characterFormat":{},"text":"7/30/2020"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","title":"","type":"Date","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","dateStorageFormat":"DateStorageDateTime","dateDisplayLocale":"en_US","dateDisplayFormat":"M/d/yyyy","characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{},"text":" asdasdsadsadsadasd asdaskldj sakdjaklsd"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(dateboxdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('richtext validation in table block', () => {
        let dateboxdoc: string = '{ "sections": [ { "blocks": [ { "blocks": [ { "rows": [ { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 } }, { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 } } ] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 } }, { "blocks": [ { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 } } ] } ], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[233.75,233.75],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(dateboxdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('content control validation table row', () => {
        let dateboxdoc: string = '{ "sections": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal", "listFormat":{} }, "inlines": [] }, { "rows": [ { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal", "listFormat":{} }, "inlines": [ { "text": "e" } ] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "shading": {}, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 }, "columnIndex": 0 }, { "blocks": [ { "paragraphFormat": { "styleName": "Normal", "listFormat":{} }, "inlines": [ { "text": "e" } ] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "shading": {}, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 }, "columnIndex": 1 } ], "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal", "listFormat":{} }, "inlines": [] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "shading": {}, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 }, "columnIndex": 0 }, { "blocks": [ { "paragraphFormat": { "styleName": "Normal", "listFormat":{} }, "inlines": [] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "shading": {}, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 233.75 }, "columnIndex": 1 } ] } ], "title": null, "description": null, "grid": [ 233.75, 233.75 ], "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "shading": {}, "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } } ], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0 } } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"e"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"e"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0},"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":233.75,"preferredWidthType":"Point","cellWidth":233.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[233.75,233.75],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(dateboxdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('table cell validation content control', () => {
        let dateboxdoc: string = '{ "sections": [ { "blocks": [ { "rows": [ { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [ { "blocks": [ { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "inlines": [ { "text": "a" } ] } ], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 467.5, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "shading": {}, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 467.5 }, "columnIndex": 0, "contentControlProperties": { "lockContentControl": false, "lockContents": false, "color": "#00000000", "type": "RichText", "hasPlaceHolderText": false, "multiline": false, "isTemporary": false, "dateCalendarType": "Gregorian", "isChecked": false } } ] } ], "title": null, "description": null, "grid": [ 234, 234 ], "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "shading": {}, "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } } ] } ], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720948, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [ { "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Placeholder Text", "basedOn": "Default Paragraph Font", "characterFormat": { "fontColor": "#808080FF" } } ], "defaultTabWidth": 35.400001525878909, "formatting": false, "trackChanges": false, "protectionType": "NoProtection", "enforcement": false, "dontUseHTMLParagraphAutoSpacing": false }';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"a"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0,"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#00000000","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[467.5],"tableFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(dateboxdoc);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('Custom Xml content control validation', () => {
        let customXML: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "styleName": "Normal"
                            },
                            "inlines": [
                                {
                                    "text": "Book author name : ",
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    }
                                },
                                {
                                    "inlines": [
                                        {
                                            "text": "Matt Hank",
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            }
                                        }
                                    ],
                                    "contentControlProperties": {
                                        "lockContentControl": false,
                                        "lockContents": false,
                                        "color": "#00000000",
                                        "type": "Text",
                                        "hasPlaceHolderText": false,
                                        "multiline": false,
                                        "isTemporary": false,
                                        "dateCalendarType": "Gregorian",
                                        "isChecked": false,
                                        "xmlMapping": {
                                            "isMapped": true,
                                            "isWordMl": false,
                                            "xPath": "/books/book/author",
                                            "storeItemId": "2cb1cafd-a41c-4f50-af12-e35d762302f7"
                                        },
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "styleName": "Normal"
                            },
                            "inlines": [
                                {
                                    "text": "Book title: ",
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    }
                                },
                                {
                                    "inlines": [
                                        {
                                            "text": "New Migration Paths of the Red Breasted Robin",
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            }
                                        }
                                    ],
                                    "contentControlProperties": {
                                        "lockContentControl": false,
                                        "lockContents": false,
                                        "color": "#00000000",
                                        "type": "Text",
                                        "hasPlaceHolderText": false,
                                        "multiline": false,
                                        "isTemporary": false,
                                        "dateCalendarType": "Gregorian",
                                        "isChecked": false,
                                        "xmlMapping": {
                                            "isMapped": true,
                                            "isWordMl": false,
                                            "xPath": "/books/book/title",
                                            "storeItemId": "2cb1cafd-a41c-4f50-af12-e35d762302f7"
                                        },
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    "headersFooters": {},
                    "sectionFormat": {
                        "headerDistance": 36.0,
                        "footerDistance": 36.0,
                        "pageWidth": 595.29998779296875,
                        "pageHeight": 841.9000244140625,
                        "leftMargin": 50.0,
                        "rightMargin": 20.0,
                        "topMargin": 20.0,
                        "bottomMargin": 20.0,
                        "differentFirstPage": false,
                        "differentOddAndEvenPages": false,
                        "bidi": false,
                        "restartPageNumbering": false,
                        "pageStartingNumber": 0
                    }
                }
            ],
            "characterFormat": {
                "fontColor": "empty"
            },
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
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0
                    }
                },
                {
                    "type": "Character",
                    "name": "Default Paragraph Font",
                    "characterFormat": {
                        "fontColor": "empty"
                    }
                }
            ],
            "customXml": [
                {
                    "itemID": "2cb1cafd-a41c-4f50-af12-e35d762302f7",
                    "xml": "<books>\r\n  <book>\r\n    <author>Matt Hank</author>\r\n    <title>New Migration Paths of the Red Breasted Robin</title>\r\n    <genre>New non-fiction</genre>\r\n    <price>29.95</price>\r\n    <pub_datee>12/1/2007</pub_datee>\r\n    <abstract>New You see them in the spring outside your windows.</abstract>\r\n  </book>\r\n</books>"
                }
            ],
            "defaultTabWidth": 36.0,
            "formatting": false,
            "trackChanges": false,
            "protectionType": "NoProtection",
            "enforcement": false,
            "dontUseHTMLParagraphAutoSpacing": false,
            "alignTablesRowByRow": false,
            "formFieldShading": true
        };
        let expectdoc: any = {
            "sections": [
                {
                    "sectionFormat": {
                        "pageWidth": 595.2999877929688,
                        "pageHeight": 841.9000244140625,
                        "leftMargin": 50,
                        "rightMargin": 20,
                        "topMargin": 20,
                        "bottomMargin": 20,
                        "differentFirstPage": false,
                        "differentOddAndEvenPages": false,
                        "headerDistance": 36,
                        "footerDistance": 36,
                        "bidi": false
                    },
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    },
                                    "text": "Book author name : "
                                },
                                {
                                    "inlines": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "text": "Matt Hank"
                                        }
                                    ],
                                    "contentControlProperties": {
                                        "lockContentControl": false,
                                        "lockContents": false,
                                        "color": "#00000000",
                                        "type": "Text",
                                        "hasPlaceHolderText": false,
                                        "multiline": false,
                                        "isTemporary": false,
                                        "xmlMapping": {
                                            "isMapped": true,
                                            "isWordMl": false,
                                            "xPath": "/books/book/author",
                                            "storeItemId": "2cb1cafd-a41c-4f50-af12-e35d762302f7"
                                        },
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "contentControlListItems": []
                                    }
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    },
                                    "text": "Book title: "
                                },
                                {
                                    "inlines": [
                                        {
                                            "characterFormat": {
                                                "fontColor": "empty"
                                            },
                                            "text": "New Migration Paths of the Red Breasted Robin"
                                        }
                                    ],
                                    "contentControlProperties": {
                                        "lockContentControl": false,
                                        "lockContents": false,
                                        "color": "#00000000",
                                        "type": "Text",
                                        "hasPlaceHolderText": false,
                                        "multiline": false,
                                        "isTemporary": false,
                                        "xmlMapping": {
                                            "isMapped": true,
                                            "isWordMl": false,
                                            "xPath": "/books/book/title",
                                            "storeItemId": "2cb1cafd-a41c-4f50-af12-e35d762302f7"
                                        },
                                        "characterFormat": {
                                            "fontColor": "empty"
                                        },
                                        "contentControlListItems": []
                                    }
                                }
                            ]
                        }
                    ],
                    "headersFooters": {}
                }
            ],
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "fontFamily": "Calibri",
                "underline": "None",
                "strikethrough": "None",
                "baselineAlignment": "Normal",
                "highlightColor": "NoColor",
                "fontColor": "empty",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Calibri",
                "allCaps": false
            },
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 0,
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {},
                "bidi": false
            },
            "defaultTabWidth": 36,
            "trackChanges": false,
            "enforcement": false,
            "hashValue": "",
            "saltValue": "",
            "formatting": false,
            "protectionType": "NoProtection",
            "dontUseHTMLParagraphAutoSpacing": false,
            "formFieldShading": true,
            "styles": [
                {
                    "name": "Normal",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                    },
                    "next": "Normal"
                },
                {
                    "name": "Default Paragraph Font",
                    "type": "Character",
                    "characterFormat": {
                        "fontColor": "empty"
                    }
                },
                {
                    "name": "Heading 1",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 12,
                        "afterSpacing": 0,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level1",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 16,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Normal",
                    "link": "Heading 1 Char",
                    "next": "Normal"
                },
                {
                    "name": "Heading 1 Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontSize": 16,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 2",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 2,
                        "afterSpacing": 0,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level2",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 13,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Normal",
                    "link": "Heading 2 Char",
                    "next": "Normal"
                },
                {
                    "name": "Heading 2 Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontSize": 13,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 3",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 2,
                        "afterSpacing": 0,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level3",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#1F3763"
                    },
                    "basedOn": "Normal",
                    "link": "Heading 3 Char",
                    "next": "Normal"
                },
                {
                    "name": "Heading 3 Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#1F3763"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 4",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 2,
                        "afterSpacing": 0,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level4",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "italic": true,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Normal",
                    "link": "Heading 4 Char",
                    "next": "Normal"
                },
                {
                    "name": "Heading 4 Char",
                    "type": "Character",
                    "characterFormat": {
                        "italic": true,
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 5",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 2,
                        "afterSpacing": 0,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level5",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Normal",
                    "link": "Heading 5 Char",
                    "next": "Normal"
                },
                {
                    "name": "Heading 5 Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontFamily": "Calibri Light",
                        "fontColor": "#2F5496"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 6",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "rightIndent": 0,
                        "firstLineIndent": 0,
                        "textAlignment": "Left",
                        "beforeSpacing": 2,
                        "afterSpacing": 0,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level6",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "Calibri Light",
                        "fontColor": "#1F3763"
                    },
                    "basedOn": "Normal",
                    "link": "Heading 6 Char",
                    "next": "Normal"
                },
                {
                    "name": "Heading 6 Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontFamily": "Calibri Light",
                        "fontColor": "#1F3763"
                    },
                    "basedOn": "Default Paragraph Font"
                }
            ],
            "lists": [],
            "abstractLists": [],
            "comments": [],
            "revisions": [],
            "customXml": [
                {
                    "itemID": "2cb1cafd-a41c-4f50-af12-e35d762302f7",
                    "xml": "<books>\r\n  <book>\r\n    <author>Matt Hank</author>\r\n    <title>New Migration Paths of the Red Breasted Robin</title>\r\n    <genre>New non-fiction</genre>\r\n    <price>29.95</price>\r\n    <pub_datee>12/1/2007</pub_datee>\r\n    <abstract>New You see them in the spring outside your windows.</abstract>\r\n  </book>\r\n</books>"
                }
            ]
        };
        editor.open(JSON.stringify(customXML));
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(JSON.stringify(expectdoc));
    });
    it('Block nested Content Control validation', () => {
        let nestedContent: string = '{"sections":[{"blocks":[{"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[{"inlines":[{"text":"Participants are eligible to be included in the study only if all of the following criteria apply","characterFormat":{"fontColor":"empty"}}],"contentControlProperties":{"lockContentControl":false,"lockContents":true,"color":"#008000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}},{"text":":","characterFormat":{"fontColor":"empty"}}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"tag":"Inclusion Criteria","color":"#939393FF","title":"Inclusion Criteria","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Header","tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":234.0},{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":468.0},{"tabJustification":"Left","position":135.5,"tabLeader":"None","deletePosition":0.0}]},"inlines":[]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"lists":[{"listId":2,"abstractListId":2}],"abstractLists":[{"abstractListId":2,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","characterFormat":{"strikethrough":"None","fontColor":"#00000000"},"paragraphFormat":{"leftIndent":54.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":54.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":0,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}},{"startAt":0,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"#00000000"}}]}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"beforeSpacing":12.0,"outlineLevel":"Level1"}},{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"beforeSpacing":2.0,"outlineLevel":"Level2"}},{"type":"Character","name":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Character","name":"Placeholder Text","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#808080FF"}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16.0,"fontFamilyBidi":"Times New Roman"}},{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","characterFormat":{"underline":"Single","fontColor":"#0563C1FF"}},{"type":"Character","name":"Unresolved Mention","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#605E5CFF"}},{"type":"Paragraph","name":"List Paragraph","basedOn":"Normal","next":"List Paragraph","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"leftIndent":36.0,"contextualSpacing":true}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Header Char","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","link":"Footer Char","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Paragraph","name":"Balloon Text","basedOn":"Normal","next":"Balloon Text","link":"Balloon Text Char","characterFormat":{"fontSize":9.0,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9.0,"fontFamilyBidi":"Segoe UI"}},{"type":"Character","name":"Balloon Text Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9.0,"fontFamilyBidi":"Segoe UI"}},{"type":"Paragraph","name":"Paragraph","next":"Paragraph","link":"Paragraph Char","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Character","name":"Paragraph Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"}},{"type":"Character","name":"TableText 9","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"}},{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13.0,"fontFamilyBidi":"Times New Roman"}},{"type":"Paragraph","name":"TableText Footnote","next":"TableText Footnote","characterFormat":{"fontSize":10.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":10.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Left","position":18.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Instructions","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontColor":"#008000FF","italicBidi":true}},{"type":"Paragraph","name":"List Number 3","next":"List Number 3","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","listFormat":{"listId":2}}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false}';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Participants are eligible to be included in the study only if all of the following criteria apply"}],"contentControlProperties":{"lockContentControl":false,"lockContents":true,"color":"#008000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"characterFormat":{"fontColor":"empty"},"text":":"}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"tag":"Inclusion Criteria","color":"#939393FF","title":"Inclusion Criteria","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"characterFormat":{},"contentControlListItems":[]}},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{},"tabs":[{"position":0,"deletePosition":234,"tabJustification":"Left","tabLeader":"None"},{"position":0,"deletePosition":468,"tabJustification":"Left","tabLeader":"None"},{"position":135.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0563C1FF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention","type":"Character","characterFormat":{"fontColor":"#605E5CFF"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"List Paragraph"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontColor":"empty"},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Paragraph","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"link":"Paragraph Char","next":"Paragraph"},{"name":"Paragraph Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TableText 9","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TableText Footnote","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"TableText Footnote"},{"name":"Instructions","type":"Character","characterFormat":{"italic":true,"fontColor":"#008000FF","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"List Number 3","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":2}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"List Number 3"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":2,"levelOverrides":[],"listId":2}],"abstractLists":[{"abstractListId":2,"levels":[{"characterFormat":{"strikethrough":"None","fontColor":"#00000000"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":54,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{"fontColor":"#00000000"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(nestedContent);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });
    it('inline nested Content Control validation', () => {
        let nestedContent: any = {
            "sections": [
                {
                    "blocks": [
                        {
                            "blocks": [
                                {
                                    "characterFormat": {
                                        "italic": false,
                                        "styleName": "Instructions"
                                    },
                                    "paragraphFormat": {
                                        "styleName": "List Number 3"
                                    },
                                    "inlines": [
                                        {
                                            "inlines": [
                                                {
                                                    "text": "The investigator ",
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    }
                                                }
                                            ],
                                            "contentControlProperties": {
                                                "lockContentControl": false,
                                                "lockContents": false,
                                                "color": "#008000FF",
                                                "type": "RichText",
                                                "hasPlaceHolderText": false,
                                                "multiline": false,
                                                "isTemporary": false,
                                                "dateCalendarType": "Gregorian",
                                                "isChecked": false
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rows": [
                                        {
                                            "rowFormat": {
                                                "allowBreakAcrossPages": true,
                                                "isHeader": false,
                                                "height": 0.0,
                                                "heightType": "AtLeast",
                                                "borders": {
                                                    "left": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "right": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "top": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "bottom": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "vertical": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "horizontal": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalDown": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    },
                                                    "diagonalUp": {
                                                        "lineStyle": "None",
                                                        "lineWidth": 0.0,
                                                        "shadow": false,
                                                        "space": 0.0,
                                                        "hasNoneStyle": false
                                                    }
                                                }
                                            },
                                            "cells": [
                                                {
                                                    "blocks": [
                                                        {
                                                            "characterFormat": {
                                                                "fontColor": "empty"
                                                            },
                                                            "paragraphFormat": {
                                                                "styleName": "List Number 3",
                                                                "listFormat": {
                                                                    "listLevelNumber": 0,
                                                                    "listId": -1
                                                                }
                                                            },
                                                            "inlines": [
                                                                {
                                                                    "text": "Hello world.",
                                                                    "characterFormat": {
                                                                        "fontColor": "empty"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "cellFormat": {
                                                        "columnSpan": 1,
                                                        "rowSpan": 1,
                                                        "preferredWidth": 233.75,
                                                        "preferredWidthType": "Point",
                                                        "verticalAlignment": "Top",
                                                        "isSamePaddingAsTable": true,
                                                        "borders": {
                                                            "left": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "right": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "top": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "bottom": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "vertical": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "horizontal": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "diagonalDown": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "diagonalUp": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            }
                                                        },
                                                        "cellWidth": 233.75
                                                    }
                                                },
                                                {
                                                    "blocks": [
                                                        {
                                                            "characterFormat": {
                                                                "fontColor": "empty"
                                                            },
                                                            "paragraphFormat": {
                                                                "styleName": "List Number 3",
                                                                "listFormat": {
                                                                    "listLevelNumber": 0,
                                                                    "listId": -1
                                                                }
                                                            },
                                                            "inlines": []
                                                        }
                                                    ],
                                                    "cellFormat": {
                                                        "columnSpan": 1,
                                                        "rowSpan": 1,
                                                        "preferredWidth": 233.75,
                                                        "preferredWidthType": "Point",
                                                        "verticalAlignment": "Top",
                                                        "isSamePaddingAsTable": true,
                                                        "borders": {
                                                            "left": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "right": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "top": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "bottom": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "vertical": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "horizontal": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "diagonalDown": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            },
                                                            "diagonalUp": {
                                                                "lineStyle": "None",
                                                                "lineWidth": 0.0,
                                                                "shadow": false,
                                                                "space": 0.0,
                                                                "hasNoneStyle": false
                                                            }
                                                        },
                                                        "cellWidth": 233.75
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    "title": null,
                                    "description": null,
                                    "tableFormat": {
                                        "allowAutoFit": true,
                                        "leftIndent": 0.0,
                                        "tableAlignment": "Left",
                                        "preferredWidthType": "Auto",
                                        "borders": {
                                            "left": {
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "right": {
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "top": {
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "bottom": {
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "vertical": {
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "horizontal": {
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalDown": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            },
                                            "diagonalUp": {
                                                "lineStyle": "None",
                                                "lineWidth": 0.0,
                                                "shadow": false,
                                                "space": 0.0,
                                                "hasNoneStyle": false
                                            }
                                        },
                                        "bidi": false,
                                        "horizontalPositionAbs": "Left",
                                        "horizontalPosition": 0.0
                                    }
                                },
                                {
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    },
                                    "paragraphFormat": {
                                        "styleName": "List Number 3",
                                        "listFormat": {
                                            "listLevelNumber": 0,
                                            "listId": -1
                                        }
                                    },
                                    "inlines": []
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "tag": "Preparation",
                                "color": "#939393FF",
                                "title": "Preparation",
                                "type": "RichText",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "dateCalendarType": "Gregorian",
                                "isChecked": false
                            }
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "styleName": "Normal"
                            },
                            "inlines": []
                        }
                    ],
                    "headersFooters": {},
                    "sectionFormat": {
                        "headerDistance": 36.0,
                        "footerDistance": 36.0,
                        "pageWidth": 612.0,
                        "pageHeight": 792.0,
                        "leftMargin": 72.0,
                        "rightMargin": 72.0,
                        "topMargin": 72.0,
                        "bottomMargin": 72.0,
                        "differentFirstPage": false,
                        "differentOddAndEvenPages": false,
                        "bidi": false,
                        "restartPageNumbering": false,
                        "pageStartingNumber": 0
                    }
                }
            ],
            "characterFormat": {
                "fontSize": 11.0,
                "fontFamily": "Calibri",
                "fontColor": "empty",
                "fontSizeBidi": 11.0,
                "fontFamilyBidi": "Arial"
            },
            "paragraphFormat": {
                "afterSpacing": 8.0,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple"
            },
            "lists": [
                {
                    "listId": 1,
                    "abstractListId": 1
                },
                {
                    "listId": 7,
                    "abstractListId": 7
                },
                {
                    "listId": 10,
                    "abstractListId": 10
                },
                {
                    "listId": 11,
                    "abstractListId": 4,
                    "levelOverrides": [
                        {
                            "startAt": 1,
                            "levelNumber": 0
                        }
                    ]
                },
                {
                    "listId": 13,
                    "abstractListId": 0,
                    "levelOverrides": [
                        {
                            "startAt": 1,
                            "levelNumber": 0
                        }
                    ]
                }
            ],
            "abstractLists": [
                {
                    "abstractListId": 0,
                    "levels": [
                        {
                            "startAt": 1,
                            "restartLevel": 0,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "numberFormat": "%1.",
                            "characterFormat": {
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 54.0,
                                "firstLineIndent": -18.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 54.0,
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
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 2,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 3,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 4,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 5,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 6,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 7,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 8,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "abstractListId": 1,
                    "levels": [
                        {
                            "listLevelPattern": "Bullet",
                            "followCharacter": "Tab",
                            "numberFormat": "",
                            "characterFormat": {
                                "strikethrough": "None",
                                "fontFamily": "Symbol",
                                "fontColor": "empty",
                                "allCaps": false
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
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 2,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 3,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 4,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 5,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 6,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 7,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 8,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "abstractListId": 4,
                    "levels": [
                        {
                            "startAt": 1,
                            "restartLevel": 0,
                            "listLevelPattern": "LowLetter",
                            "followCharacter": "Tab",
                            "numberFormat": "%1.",
                            "characterFormat": {
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "allCaps": false
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
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 2,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 3,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 4,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 5,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 6,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 7,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 8,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        }
                    ]
                },
                {
                    "abstractListId": 7,
                    "levels": [
                        {
                            "startAt": 1,
                            "restartLevel": 0,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Space",
                            "numberFormat": "%1.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": true
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
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
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "#00000000",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
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
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
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
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.%4.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
                                        "tabLeader": "None",
                                        "deletePosition": 0.0
                                    }
                                ]
                            }
                        },
                        {
                            "startAt": 1,
                            "restartLevel": 4,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.%4.%5.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
                                        "tabLeader": "None",
                                        "deletePosition": 0.0
                                    }
                                ]
                            }
                        },
                        {
                            "startAt": 1,
                            "restartLevel": 5,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
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
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.%7.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
                                        "tabLeader": "None",
                                        "deletePosition": 0.0
                                    }
                                ]
                            }
                        },
                        {
                            "startAt": 1,
                            "restartLevel": 7,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
                                        "tabLeader": "None",
                                        "deletePosition": 0.0
                                    }
                                ]
                            }
                        },
                        {
                            "startAt": 1,
                            "restartLevel": 8,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Space",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "strikethrough": "None",
                                "fontSize": 12.0,
                                "fontFamily": "Times New Roman",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0.0,
                                "firstLineIndent": 0.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 0.0,
                                        "tabLeader": "None",
                                        "deletePosition": 0.0
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    "abstractListId": 10,
                    "levels": [
                        {
                            "listLevelPattern": "Bullet",
                            "followCharacter": "Tab",
                            "numberFormat": "",
                            "characterFormat": {
                                "strikethrough": "None",
                                "fontFamily": "Symbol",
                                "fontColor": "empty",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 54.0,
                                "firstLineIndent": -18.0,
                                "tabs": [
                                    {
                                        "tabJustification": "List",
                                        "position": 54.0,
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
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 2,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 3,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 4,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 5,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 6,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 7,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
                            }
                        },
                        {
                            "startAt": 0,
                            "restartLevel": 8,
                            "listLevelPattern": "Arabic",
                            "followCharacter": "Tab",
                            "characterFormat": {
                                "fontColor": "empty"
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
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 0.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 1",
                    "next": "Paragraph",
                    "link": "Heading 1 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 14.0,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 7
                        }
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 2",
                    "next": "Paragraph",
                    "link": "Heading 2 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 13.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level2",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 7
                        }
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 3",
                    "next": "Paragraph",
                    "link": "Heading 3 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 13.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level3",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 7
                        }
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 4",
                    "next": "Paragraph",
                    "link": "Heading 4 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level4",
                        "listFormat": {
                            "listLevelNumber": 3,
                            "listId": 7
                        }
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Heading 5",
                    "next": "Paragraph",
                    "link": "Heading 5 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0,
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level5",
                        "listFormat": {
                            "listLevelNumber": 4,
                            "listId": 7
                        },
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 0.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            },
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
                    "type": "Paragraph",
                    "name": "Heading 6",
                    "next": "Paragraph",
                    "link": "Heading 6 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0,
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level6",
                        "listFormat": {
                            "listLevelNumber": 5,
                            "listId": 7
                        },
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 0.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            },
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
                    "type": "Paragraph",
                    "name": "Heading 7",
                    "next": "Paragraph",
                    "link": "Heading 7 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0,
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level7",
                        "listFormat": {
                            "listLevelNumber": 6,
                            "listId": 7
                        },
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 0.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            },
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
                    "type": "Paragraph",
                    "name": "Heading 8",
                    "next": "Paragraph",
                    "link": "Heading 8 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0,
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level8",
                        "listFormat": {
                            "listLevelNumber": 7,
                            "listId": 7
                        },
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 0.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            },
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
                    "type": "Paragraph",
                    "name": "Heading 9",
                    "next": "Paragraph",
                    "link": "Heading 9 Char",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.0,
                        "firstLineIndent": -18.0,
                        "beforeSpacing": 6.0,
                        "afterSpacing": 6.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level9",
                        "listFormat": {
                            "listLevelNumber": 8,
                            "listId": 7
                        },
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 0.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            },
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
                    "type": "Character",
                    "name": "Default Paragraph Font",
                    "characterFormat": {
                        "fontColor": "empty"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "List Alpha Table",
                    "next": "List Alpha Table",
                    "characterFormat": {
                        "fontSize": 10.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 10.0,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 0.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 11
                        }
                    }
                },
                {
                    "type": "Character",
                    "name": "Placeholder Text",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "fontColor": "#808080FF"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 1 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 14.0,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 2 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 13.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 3 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 13.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 4 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 5 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 6 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 7 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 8 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Character",
                    "name": "Heading 9 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "Paragraph",
                    "next": "Paragraph",
                    "link": "Paragraph Char",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 12.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple"
                    }
                },
                {
                    "type": "Character",
                    "name": "Paragraph Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Times New Roman"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "List Bullet",
                    "next": "List Bullet",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 12.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 1
                        }
                    }
                },
                {
                    "type": "Character",
                    "name": "List Bullet 3 Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "List Bullet 3",
                    "next": "List Bullet 3",
                    "link": "List Bullet 3 Char",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0
                    },
                    "paragraphFormat": {
                        "afterSpacing": 12.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 10
                        }
                    }
                },
                {
                    "type": "Character",
                    "name": "TableText Char",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "fontFamily": "DengXian",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "TableText",
                    "next": "TableText",
                    "link": "TableText Char",
                    "characterFormat": {
                        "fontFamily": "DengXian",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 0.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "TableText Footnote",
                    "next": "TableText Footnote",
                    "characterFormat": {
                        "fontSize": 10.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 10.0,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 0.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "tabs": [
                            {
                                "tabJustification": "Left",
                                "position": 18.0,
                                "tabLeader": "None",
                                "deletePosition": 0.0
                            }
                        ]
                    }
                },
                {
                    "type": "Character",
                    "name": "TableText 12",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Times New Roman"
                    }
                },
                {
                    "type": "Character",
                    "name": "Hyperlink",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "strikethrough": "None",
                        "fontColor": "#0000FFFF"
                    }
                },
                {
                    "type": "Paragraph",
                    "name": "List Number 3",
                    "next": "List Number 3",
                    "characterFormat": {
                        "fontSize": 12.0,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12.0,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 12.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 13
                        }
                    }
                },
                {
                    "type": "Character",
                    "name": "Instructions",
                    "basedOn": "Default Paragraph Font",
                    "characterFormat": {
                        "italic": true,
                        "fontColor": "#008000FF",
                        "italicBidi": true
                    }
                }
            ],
            "defaultTabWidth": 36.0,
            "formatting": false,
            "trackChanges": false,
            "protectionType": "NoProtection",
            "enforcement": false,
            "dontUseHTMLParagraphAutoSpacing": false,
            "alignTablesRowByRow": false
        };
        let expectdoc: any = {
            "sections": [
                {
                    "sectionFormat": {
                        "pageWidth": 612,
                        "pageHeight": 792,
                        "leftMargin": 72,
                        "rightMargin": 72,
                        "topMargin": 72,
                        "bottomMargin": 72,
                        "differentFirstPage": false,
                        "differentOddAndEvenPages": false,
                        "headerDistance": 36,
                        "footerDistance": 36,
                        "bidi": false
                    },
                    "blocks": [
                        {
                            "blocks": [
                                {
                                    "paragraphFormat": {
                                        "styleName": "List Number 3",
                                        "listFormat": {}
                                    },
                                    "characterFormat": {
                                        "italic": false
                                    },
                                    "inlines": [
                                        {
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "empty"
                                                    },
                                                    "text": "The investigator "
                                                }
                                            ],
                                            "contentControlProperties": {
                                                "lockContentControl": false,
                                                "lockContents": false,
                                                "color": "#008000FF",
                                                "type": "RichText",
                                                "hasPlaceHolderText": false,
                                                "multiline": false,
                                                "isTemporary": false,
                                                "characterFormat": {},
                                                "contentControlListItems": []
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rows": [
                                        {
                                            "cells": [
                                                {
                                                    "blocks": [
                                                        {
                                                            "paragraphFormat": {
                                                                "styleName": "List Number 3",
                                                                "listFormat": {
                                                                    "listId": -1,
                                                                    "listLevelNumber": 0
                                                                }
                                                            },
                                                            "characterFormat": {
                                                                "fontColor": "empty"
                                                            },
                                                            "inlines": [
                                                                {
                                                                    "characterFormat": {
                                                                        "fontColor": "empty"
                                                                    },
                                                                    "text": "Hello world."
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "cellFormat": {
                                                        "borders": {
                                                            "top": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "left": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "right": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "bottom": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalDown": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalUp": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "horizontal": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "vertical": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            }
                                                        },
                                                        "shading": {},
                                                        "preferredWidth": 233.75,
                                                        "preferredWidthType": "Point",
                                                        "cellWidth": 233.75,
                                                        "columnSpan": 1,
                                                        "rowSpan": 1,
                                                        "verticalAlignment": "Top"
                                                    },
                                                    "columnIndex": 0
                                                },
                                                {
                                                    "blocks": [
                                                        {
                                                            "paragraphFormat": {
                                                                "styleName": "List Number 3",
                                                                "listFormat": {
                                                                    "listId": -1,
                                                                    "listLevelNumber": 0
                                                                }
                                                            },
                                                            "characterFormat": {
                                                                "fontColor": "empty"
                                                            },
                                                            "inlines": []
                                                        }
                                                    ],
                                                    "cellFormat": {
                                                        "borders": {
                                                            "top": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "left": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "right": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "bottom": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalDown": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "diagonalUp": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "horizontal": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            },
                                                            "vertical": {
                                                                "hasNoneStyle": false,
                                                                "lineStyle": "None",
                                                                "lineWidth": 0
                                                            }
                                                        },
                                                        "shading": {},
                                                        "preferredWidth": 233.75,
                                                        "preferredWidthType": "Point",
                                                        "cellWidth": 233.75,
                                                        "columnSpan": 1,
                                                        "rowSpan": 1,
                                                        "verticalAlignment": "Top"
                                                    },
                                                    "columnIndex": 1
                                                }
                                            ],
                                            "rowFormat": {
                                                "height": 1,
                                                "allowBreakAcrossPages": true,
                                                "heightType": "AtLeast",
                                                "isHeader": false,
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "diagonalDown": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "diagonalUp": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    },
                                                    "vertical": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "None",
                                                        "lineWidth": 0
                                                    }
                                                },
                                                "gridBefore": 0,
                                                "gridAfter": 0
                                            }
                                        }
                                    ],
                                    "grid": [
                                        233.75,
                                        233.75
                                    ],
                                    "tableFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.5
                                            }
                                        },
                                        "shading": {},
                                        "leftIndent": 0,
                                        "tableAlignment": "Left",
                                        "topMargin": 0,
                                        "rightMargin": 5.4,
                                        "leftMargin": 5.4,
                                        "bottomMargin": 0,
                                        "preferredWidthType": "Auto",
                                        "bidi": false,
                                        "allowAutoFit": true
                                    },
                                    "description": null,
                                    "title": null,
                                    "columnCount": 2
                                },
                                {
                                    "paragraphFormat": {
                                        "styleName": "List Number 3",
                                        "listFormat": {
                                            "listId": -1,
                                            "listLevelNumber": 0
                                        }
                                    },
                                    "characterFormat": {
                                        "fontColor": "empty"
                                    },
                                    "inlines": []
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "tag": "Preparation",
                                "color": "#939393FF",
                                "title": "Preparation",
                                "type": "RichText",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "characterFormat": {},
                                "contentControlListItems": []
                            }
                        },
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "inlines": []
                        }
                    ],
                    "headersFooters": {}
                }
            ],
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 11,
                "fontFamily": "Calibri",
                "underline": "None",
                "strikethrough": "None",
                "baselineAlignment": "Normal",
                "highlightColor": "NoColor",
                "fontColor": "empty",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Arial",
                "allCaps": false
            },
            "paragraphFormat": {
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 0,
                "afterSpacing": 8,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {},
                "bidi": false
            },
            "defaultTabWidth": 36,
            "trackChanges": false,
            "enforcement": false,
            "hashValue": "",
            "saltValue": "",
            "formatting": false,
            "protectionType": "NoProtection",
            "dontUseHTMLParagraphAutoSpacing": false,
            "formFieldShading": true,
            "styles": [
                {
                    "name": "Normal",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "next": "Normal"
                },
                {
                    "name": "Heading 1",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 7
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 14,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    },
                    "link": "Heading 1 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 1 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 14,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Default Paragraph Font",
                    "type": "Character",
                    "characterFormat": {
                        "fontColor": "empty"
                    }
                },
                {
                    "name": "Paragraph",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 12,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "link": "Paragraph Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Paragraph Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 2",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level2",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 1
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 13,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 2 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 2 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 13,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 3",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level3",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 2
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 13,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 3 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 3 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 13,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 4",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level4",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 3
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 4 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 4 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "boldBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 5",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level5",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 4
                        },
                        "tabs": [
                            {
                                "position": 0,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 5 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 5 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 6",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level6",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 5
                        },
                        "tabs": [
                            {
                                "position": 0,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 6 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 6 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 7",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level7",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 6
                        },
                        "tabs": [
                            {
                                "position": 0,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 7 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 7 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 8",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level8",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 7
                        },
                        "tabs": [
                            {
                                "position": 0,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 8 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 8 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Heading 9",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "outlineLevel": "Level9",
                        "listFormat": {
                            "listId": 7,
                            "listLevelNumber": 8
                        },
                        "tabs": [
                            {
                                "position": 0,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "Heading 9 Char",
                    "next": "Paragraph"
                },
                {
                    "name": "Heading 9 Char",
                    "type": "Character",
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "italicBidi": true,
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "List Alpha Table",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 11
                        }
                    },
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 10,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "next": "List Alpha Table"
                },
                {
                    "name": "Placeholder Text",
                    "type": "Character",
                    "characterFormat": {
                        "fontColor": "#808080FF"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "List Bullet",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 12,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 1
                        }
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "next": "List Bullet"
                },
                {
                    "name": "List Bullet 3 Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "List Bullet 3",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 12,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 10
                        }
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontColor": "empty",
                        "fontSizeBidi": 12
                    },
                    "link": "List Bullet 3 Char",
                    "next": "List Bullet 3"
                },
                {
                    "name": "TableText Char",
                    "type": "Character",
                    "characterFormat": {
                        "fontFamily": "DengXian",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "TableText",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "DengXian",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Arial"
                    },
                    "link": "TableText Char",
                    "next": "TableText"
                },
                {
                    "name": "TableText Footnote",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 0,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 18,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 10,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "next": "TableText Footnote"
                },
                {
                    "name": "TableText 12",
                    "type": "Character",
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "Hyperlink",
                    "type": "Character",
                    "characterFormat": {
                        "strikethrough": "None",
                        "fontColor": "#0000FFFF"
                    },
                    "basedOn": "Default Paragraph Font"
                },
                {
                    "name": "List Number 3",
                    "type": "Paragraph",
                    "paragraphFormat": {
                        "afterSpacing": 12,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "listFormat": {
                            "listId": 13
                        }
                    },
                    "characterFormat": {
                        "fontSize": 12,
                        "fontFamily": "Times New Roman",
                        "fontColor": "empty",
                        "fontSizeBidi": 12,
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "next": "List Number 3"
                },
                {
                    "name": "Instructions",
                    "type": "Character",
                    "characterFormat": {
                        "italic": true,
                        "fontColor": "#008000FF",
                        "italicBidi": true
                    },
                    "basedOn": "Default Paragraph Font"
                }
            ],
            "lists": [
                {
                    "abstractListId": 1,
                    "levelOverrides": [],
                    "listId": 1
                },
                {
                    "abstractListId": 7,
                    "levelOverrides": [],
                    "listId": 7
                },
                {
                    "abstractListId": 10,
                    "levelOverrides": [],
                    "listId": 10
                },
                {
                    "abstractListId": 4,
                    "levelOverrides": [
                        {
                            "levelNumber": 0,
                            "startAt": 1
                        }
                    ],
                    "listId": 11
                },
                {
                    "abstractListId": 0,
                    "levelOverrides": [
                        {
                            "levelNumber": 0,
                            "startAt": 1
                        }
                    ],
                    "listId": 13
                }
            ],
            "abstractLists": [
                {
                    "abstractListId": 0,
                    "levels": [
                        {
                            "characterFormat": {
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 54,
                                "firstLineIndent": -18,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 54,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.",
                            "restartLevel": 0,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 1,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 2,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 3,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 4,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 5,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 6,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 7,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 8,
                            "startAt": 0
                        }
                    ]
                },
                {
                    "abstractListId": 1,
                    "levels": [
                        {
                            "characterFormat": {
                                "fontFamily": "Symbol",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 18,
                                "firstLineIndent": -18,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 18,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 1,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 2,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 3,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 4,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 5,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 6,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 7,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 8,
                            "startAt": 0
                        }
                    ]
                },
                {
                    "abstractListId": 4,
                    "levels": [
                        {
                            "characterFormat": {
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 18,
                                "firstLineIndent": -18,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 18,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "LowLetter",
                            "numberFormat": "%1.",
                            "restartLevel": 0,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 1,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 2,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 3,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 4,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 5,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 6,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 7,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 8,
                            "startAt": 0
                        }
                    ]
                },
                {
                    "abstractListId": 7,
                    "levels": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": true
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.",
                            "restartLevel": 0,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "#00000000",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.",
                            "restartLevel": 1,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.",
                            "restartLevel": 2,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.%4.",
                            "restartLevel": 3,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.%4.%5.",
                            "restartLevel": 4,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.",
                            "restartLevel": 5,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.%7.",
                            "restartLevel": 6,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.",
                            "restartLevel": 7,
                            "startAt": 1
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": false,
                                "fontSize": 12,
                                "fontFamily": "Times New Roman",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "fontFamilyBidi": "Times New Roman",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 0,
                                "firstLineIndent": 0,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 0,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Space",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9.",
                            "restartLevel": 8,
                            "startAt": 1
                        }
                    ]
                },
                {
                    "abstractListId": 10,
                    "levels": [
                        {
                            "characterFormat": {
                                "fontFamily": "Symbol",
                                "strikethrough": "None",
                                "fontColor": "empty",
                                "allCaps": false
                            },
                            "paragraphFormat": {
                                "leftIndent": 54,
                                "firstLineIndent": -18,
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 54,
                                        "deletePosition": 0,
                                        "tabJustification": "List",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Bullet",
                            "numberFormat": "",
                            "restartLevel": 0,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 1,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 2,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 3,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 4,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 5,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 6,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 7,
                            "startAt": 0
                        },
                        {
                            "characterFormat": {
                                "fontColor": "empty"
                            },
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "followCharacter": "Tab",
                            "listLevelPattern": "Arabic",
                            "numberFormat": "",
                            "restartLevel": 8,
                            "startAt": 0
                        }
                    ]
                }
            ],
            "comments": [],
            "revisions": [],
            "customXml": []
        };
        editor.open(JSON.stringify(nestedContent));
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(JSON.stringify(expectdoc));
    });
    /*it('Blocks with inline nested Content Control validation', () => {
        let blocksNestedContent: string = '{"sections":[{"blocks":[{"blocks":[{"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"inlines":[{"inlines":[{"text":"The definitions y events (ADEs and SADEs) can be found in","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}},{"text":" ","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"text":"Appendix 8","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"#0000FFFF","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"text":". ","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}},{"inlines":[{"inlines":[{"text":"Device deficiencies are covered in","characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"}}],"contentControlProperties":{"lockContentControl":false,"lockContents":true,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"tag":"IN:Device Studies","color":"#008000FF","title":"Device Studies","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"dateCalendarType":"Gregorian","isChecked":false}}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"lists":[{"listId":0,"abstractListId":0},{"listId":2,"abstractListId":2},{"listId":13,"abstractListId":13},{"listId":17,"abstractListId":17},{"listId":18,"abstractListId":9,"levelOverrides":[{"startAt":1,"levelNumber":0}]},{"listId":20,"abstractListId":1,"levelOverrides":[{"startAt":1,"levelNumber":0}]}],"abstractLists":[{"abstractListId":0,"levels":[{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"fontFamily":"Symbol","fontColor":"empty"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":0,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}}]},{"abstractListId":1,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Tab","numberFormat":"%1.","characterFormat":{"strikethrough":"None","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":54.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":54.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":0,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}}]},{"abstractListId":2,"levels":[{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"strikethrough":"None","fontFamily":"Symbol","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":18.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":18.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":0,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}}]},{"abstractListId":9,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"LowLetter","followCharacter":"Tab","numberFormat":"%1.","characterFormat":{"strikethrough":"None","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":18.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":18.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":0,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}}]},{"abstractListId":13,"levels":[{"startAt":1,"restartLevel":0,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":true},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"#00000000","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}}'
        + ',{"startAt":1,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.%4.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.%4.%5.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.%4.%5.%6.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.%4.%5.%6.%7.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":1,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Space","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9.","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0.0,"firstLineIndent":0.0,"tabs":[{"tabJustification":"List","position":0.0,"tabLeader":"None","deletePosition":0.0}]}}]},{"abstractListId":17,"levels":[{"listLevelPattern":"Bullet","followCharacter":"Tab","numberFormat":"","characterFormat":{"strikethrough":"None","fontFamily":"Symbol","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":54.0,"firstLineIndent":-18.0,"tabs":[{"tabJustification":"List","position":54.0,"tabLeader":"None","deletePosition":0.0}]}},{"startAt":0,"restartLevel":1,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":2,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":3,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":4,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":5,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":6,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":7,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}},{"startAt":0,"restartLevel":8,"listLevelPattern":"Arabic","followCharacter":"Tab","characterFormat":{"fontColor":"empty"}}]}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"Heading 1","next":"Paragraph","link":"Heading 1 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":14.0,"fontFamilyBidi":"Arial","allCaps":true},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":13}}},{"type":"Paragraph","name":"Heading 2","next":"Paragraph","link":"Heading 2 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":13.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{"listLevelNumber":1,"listId":13}}},{"type":"Paragraph","name":"Heading 3","next":"Paragraph","link":"Heading 3 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":13.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{"listLevelNumber":2,"listId":13}}},{"type":"Paragraph","name":"Heading 4","next":"Paragraph","link":"Heading 4 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{"listLevelNumber":3,"listId":13}}},{"type":"Paragraph","name":"Heading 5","next":"Paragraph","link":"Heading 5 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{"listLevelNumber":4,"listId":13},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Heading 6","next":"Paragraph","link":"Heading 6 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{"listLevelNumber":5,"listId":13},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Heading 7","next":"Paragraph","link":"Heading 7 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level7","listFormat":{"listLevelNumber":6,"listId":13},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Heading 8","next":"Paragraph","link":"Heading 8 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level8","listFormat":{"listLevelNumber":7,"listId":13},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Paragraph","name":"Heading 9","next":"Paragraph","link":"Heading 9 Char","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.0,"firstLineIndent":-18.0,"beforeSpacing":6.0,"afterSpacing":6.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","outlineLevel":"Level9","listFormat":{"listLevelNumber":8,"listId":13},"tabs":[{"tabJustification":"Left","position":0.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"List","position":36.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Paragraph","name":"List Alpha Table","next":"List Alpha Table","characterFormat":{"fontSize":10.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":10.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","listFormat":{"listId":18}}},{"type":"Character","name":"Placeholder Text","basedOn":"Default Paragraph Font","characterFormat":{"fontColor":"#808080FF"}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":14.0,"fontFamilyBidi":"Arial","allCaps":true}},{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":13.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":13.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 4 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 5 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 6 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 7 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 8 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"type":"Character","name":"Heading 9 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12.0,"fontFamilyBidi":"Arial"}},{"type":"Paragraph","name":"Paragraph","next":"Paragraph","link":"Paragraph Char","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Character","name":"Paragraph Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"}},{"type":"Paragraph","name":"List Bullet","next":"List Bullet","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","listFormat":{"listId":2}}},{"type":"Character","name":"List Bullet 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontColor":"empty","fontSizeBidi":12.0}},{"type":"Paragraph","name":"List Bullet 3","next":"List Bullet 3","link":"List Bullet 3 Char","characterFormat":{"fontSize":12.0,"fontColor":"empty","fontSizeBidi":12.0},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","listFormat":{"listId":17}}},{"type":"Character","name":"TableText Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"DengXian","fontColor":"empty","fontFamilyBidi":"Arial"}},{"type":"Paragraph","name":"TableText","next":"TableText","link":"TableText Char","characterFormat":{"fontFamily":"DengXian","fontColor":"empty","fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"TableText Footnote","next":"TableText Footnote","characterFormat":{"fontSize":10.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":10.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Left","position":18.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"TableText 12","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"}},{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","characterFormat":{"strikethrough":"None","fontColor":"#0000FFFF"}},{"type":"Paragraph","name":"List Number 3","next":"List Number 3","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":12.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","listFormat":{"listId":20}}},{"type":"Character","name":"Instructions","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontColor":"#008000FF","italicBidi":true}},{"type":"Paragraph","name":"Balloon Text","basedOn":"Normal","next":"Balloon Text","link":"Balloon Text Char","characterFormat":{"fontSize":9.0,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9.0,"fontFamilyBidi":"Segoe UI"}},{"type":"Character","name":"Balloon Text Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9.0,"fontFamilyBidi":"Segoe UI"}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Header Char","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"}},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","link":"Footer Char","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"}},{"type":"Character","name":"TableText 9","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":9.0,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"}},{"type":"Paragraph","name":"List Bullet 2","basedOn":"Normal","next":"List Bullet 2","characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{"listId":0},"contextualSpacing":true}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false}';
        let expectdoc: string = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"blocks":[{"paragraphFormat":{"afterSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11},"inlines":[{"inlines":[{"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The definitions y events (ADEs and SADEs) can be found in"}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"contentControlListItems":[]}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"contentControlListItems":[]}},{"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#0000FFFF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Appendix 8"},{"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":". "},{"inlines":[{"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Device deficiencies are covered in"}],"contentControlProperties":{"lockContentControl":false,"lockContents":true,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"contentControlListItems":[]}}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"color":"#000000FF","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"contentControlListItems":[]}}]}],"contentControlProperties":{"lockContentControl":false,"lockContents":false,"tag":"IN:Device Studies","color":"#008000FF","title":"Device Studies","type":"RichText","hasPlaceHolderText":false,"multiline":false,"isTemporary":false,"contentControlListItems":[]}}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":13}},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Arial","allCaps":true},"link":"Heading 1 Char","next":"Paragraph"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Arial","allCaps":true},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Paragraph","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"link":"Paragraph Char","next":"Paragraph"},{"name":"Paragraph Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{"listId":13,"listLevelNumber":1}},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Arial"},"link":"Heading 2 Char","next":"Paragraph"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{"listId":13,"listLevelNumber":2}},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":13,"fontFamilyBidi":"Arial"},"link":"Heading 3 Char","next":"Paragraph"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":13,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{"listId":13,"listLevelNumber":3}},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"link":"Heading 4 Char","next":"Paragraph"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{"listId":13,"listLevelNumber":4},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"link":"Heading 5 Char","next":"Paragraph"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{"listId":13,"listLevelNumber":5},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"link":"Heading 6 Char","next":"Paragraph"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 7","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level7","listFormat":{"listId":13,"listLevelNumber":6},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"link":"Heading 7 Char","next":"Paragraph"},{"name":"Heading 7 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 8","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level8","listFormat":{"listId":13,"listLevelNumber":7},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"link":"Heading 8 Char","next":"Paragraph"}'
        + ',{"name":"Heading 8 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 9","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level9","listFormat":{"listId":13,"listLevelNumber":8},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"link":"Heading 9 Char","next":"Paragraph"},{"name":"Heading 9 Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"List Alpha Table","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":18}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"List Alpha Table"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"List Bullet","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":2}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"List Bullet"},{"name":"List Bullet 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"basedOn":"Default Paragraph Font"},{"name":"List Bullet 3","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":17}},"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"link":"List Bullet 3 Char","next":"List Bullet 3"},{"name":"TableText Char","type":"Character","characterFormat":{"fontFamily":"DengXian","fontColor":"empty","fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"TableText","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"DengXian","fontColor":"empty","fontFamilyBidi":"Arial"},"link":"TableText Char","next":"TableText"},{"name":"TableText Footnote","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"TableText Footnote"},{"name":"TableText 12","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"strikethrough":"None","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"List Number 3","type":"Paragraph","paragraphFormat":{"afterSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":20}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"List Number 3"},{"name":"Instructions","type":"Character","characterFormat":{"italic":true,"fontColor":"#008000FF","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontColor":"empty","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TableText 9","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Times New Roman","fontColor":"empty","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"List Bullet 2","type":"Paragraph","paragraphFormat":{"listFormat":{"listId":0},"contextualSpacing":true},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"List Bullet 2"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":2,"levelOverrides":[],"listId":2},{"abstractListId":13,"levelOverrides":[],"listId":13},{"abstractListId":17,"levelOverrides":[],"listId":17},{"abstractListId":9,"levelOverrides":[{"levelNumber":0,"startAt":1}],"listId":18},{"abstractListId":1,"levelOverrides":[{"levelNumber":0,"startAt":1}],"listId":20}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"empty"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":1,"levels":[{"characterFormat":{"strikethrough":"None","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":54,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":2,"levels":[{"characterFormat":{"fontFamily":"Symbol","strikethrough":"None","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":9,"levels":[{"characterFormat":{"strikethrough":"None","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":13,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":true},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"#00000000","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.","restartLevel":1,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.","restartLevel":2,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.","restartLevel":3,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.","restartLevel":4,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.","restartLevel":5,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.","restartLevel":6,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.","restartLevel":7,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"Times New Roman","strikethrough":"None","fontColor":"empty","fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Space","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9.","restartLevel":8,"startAt":1}]},{"abstractListId":17,"levels":[{"characterFormat":{"fontFamily":"Symbol","strikethrough":"None","fontColor":"empty","allCaps":false},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":54,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[]}';
        editor.open(blocksNestedContent);
        let json: string = editor.serialize();
        editor.save('Sample', 'Sfdt');
        expect(json).toBe(expectdoc);
    });*/
});