import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer } from '../../../src/document-editor/implementation/viewer/viewer';;
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
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(charParaBidi));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
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
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(tableBidi));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
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
    let viewer: LayoutViewer;
    let exportData: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        editor.open(JSON.stringify(rtlFormat));
        exportData = JSON.parse(editor.sfdtExportModule.serialize());
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
    it('Rtl export font family bidi validation', () => {
        let line: LineWidget = (editor.viewer.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0] as LineWidget;
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
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport, WordExport);
        editor = new DocumentEditor({ enableSfdtExport: true, enableWordExport: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('opened document- check default tab width', () => {
        editor.open(JSON.stringify(tab));
        let document: any = viewer.owner.sfdtExportModule.write();
        expect(document.defaultTabWidth).toBe(56);
    });
    it('open blank default tab width export validation', () => {
        editor.openBlank();
        let document: any = viewer.owner.sfdtExportModule.write();
        expect(document.defaultTabWidth).toBe(36);
    });
});
