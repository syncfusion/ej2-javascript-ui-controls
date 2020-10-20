import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { EditorHistory, WidthInfo } from '../../../src/index';


/**
 * Get Next and previous widget validation
 */
describe('Numbering apply validation in different scenario', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
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
    it('Get next Rendered widget validation in splitted table ', () => {
console.log('Get next Rendered widget validation in splitted table ');
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertText('Syncfusion');
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('Syncfusion');
        for (let i: number = 0; i < 60; i++) {
            editor.editorModule.onEnter();
        }
        editor.selection.handleTabKey(true, true);
        expect(editor.selection.start.paragraph.nextRenderedWidget).toBeUndefined();
    });
});

describe('Get Minimum and maximum width form cell', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container', styles: 'width:100%;height:500px' }));
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 500);
    });
    it('Get minimum and maximum width from cell', () => {
console.log('Get minimum and maximum width from cell');
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company.');
        editor.editor.insertHyperlinkInternal('https://syncfusion.com', 'Syncfusion', true, false);
        let widthInfo: WidthInfo = editor.selection.start.paragraph.associatedCell.getMinimumAndMaximumWordWidth(0, 0);
        expect(widthInfo.minimumWordWidth).toBeGreaterThan(70);
        expect(widthInfo.minimumWordWidth).toBeLessThan(78);
        expect(widthInfo.maximumWordWidth).toBeGreaterThan(738);
        expect(widthInfo.maximumWordWidth).toBeLessThan(758);
    });
    it('Get min and max width from table', () => {
console.log('Get min and max width from table');
        editor.editor.insertTable(1, 2);
        // get width info from nested cell
        editor.selection.start.paragraph.associatedCell.ownerTable.isGridUpdated = false;
        let widthInfo: WidthInfo = editor.selection.start.paragraph.associatedCell.ownerTable.getMinimumAndMaximumWordWidth(0, 0);
        expect(widthInfo.maximumWordWidth).toBe(editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.getTotalWidth(0));
        expect(widthInfo.minimumWordWidth).toBe(editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.getTotalWidth(0));
    });
    it('Get min and max width from Row', () => {
console.log('Get min and max width from Row');
        let widthInfo: WidthInfo = editor.selection.start.paragraph.associatedCell.ownerRow.getMinimumAndMaximumWordWidth(0, 0);
        expect(widthInfo.minimumWordWidth).toBe(0);
        expect(widthInfo.maximumWordWidth).toBe(0);
    });
});

let sfdt: any = { "sections": [{ "sectionFormat": { "pageWidth": 595.2999877929688, "pageHeight": 841.9000244140625, "leftMargin": 53.849998474121094, "rightMargin": 53.849998474121094, "topMargin": 43.099998474121094, "bottomMargin": 43.099998474121094, "differentFirstPage": true, "differentOddAndEvenPages": false, "headerDistance": 43.099998474121094, "footerDistance": 0, "bidi": false }, "blocks": [{ "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Date Dictated}" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Salutation} " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Forename} " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Surname}" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Address Line 1}" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Address Line 2}" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Town}" }] }, { "paragraphFormat": { "styleName": "Endnote Text", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{County}" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Postcode}   " }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 249.0500030517578, "preferredWidthType": "Point", "cellWidth": 98.27271602060131, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Right", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "PRIVATE " }, { "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 249.0500030517578, "preferredWidthType": "Point", "cellWidth": 389.32727482412525, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftMargin": 5.4, "topMargin": 0, "rightMargin": 5.4, "bottomMargin": 0, "leftIndent": 0 } }], "grid": [98.27271602060131, 389.32727482412525], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 0, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": true }, "description": null, "title": null }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "Dear {Salutation} {Surname}" }] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Calibri" }, "text": "Admission to {Select Hospital} {Hospital Name}" }] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "I " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "am " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "writing " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "to " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "confirm " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "details " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "of " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "your " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "admission " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "as " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "a " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "day-case " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "patient " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "to " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "the " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "above " }, { "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "hospital." }] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "{START}" }] }, { "paragraphFormat": { "textAlignment": "Justify", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "Yours sincerely" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 11, "fontFamily": "Calibri" }, "text": "{Secretary Fullname} " }] }, { "paragraphFormat": { "styleName": "Heading 1", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "text": "Secretary to " }] }, { "paragraphFormat": { "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "styleName": "No Spacing", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 14, "fontSizeBidi": 14, "fontFamilyBidi": "Calibri" }, "text": "Professor Dorota Dworakowska" }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": " " }, { "characterFormat": { "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "MD (hons.) " }, { "characterFormat": { "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "PhD" }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": " " }, { "characterFormat": { "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "MRCP UK Endocrinology & Diabetes" }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": " " }] }, { "paragraphFormat": { "textAlignment": "Justify", "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "styleName": "No Spacing", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "Consultant " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "in " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "Endocrinology, " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "Diabetes " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "and " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "General " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "Internal " }, { "characterFormat": { "bold": true, "fontSize": 12, "fontSizeBidi": 12, "fontFamilyBidi": "Calibri" }, "text": "Medicine" }] }, { "paragraphFormat": { "styleName": "Heading 1", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "inlines": [] }], "headersFooters": { "firstPageHeader": { "blocks": [{ "paragraphFormat": { "afterSpacing": 10, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": { "fontFamily": "Times New Roman" }, "text": "INCLUDETEXT \"lethead.doc\"" }, { "characterFormat": {}, "fieldType": 2 }] }, { "paragraphFormat": { "afterSpacing": 10, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "afterSpacing": 10, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "afterSpacing": 10, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "inlines": [] }, { "paragraphFormat": { "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontFamily": "Times New Roman" }, "inlines": [{ "characterFormat": {}, "fieldType": 1 }] }] }, "firstPageFooter": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontFamilyBidi": "Calibri" }, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": " INCLUDETEXT \"letfoot.doc\" " }, { "characterFormat": {}, "fieldType": 2 }] }, { "paragraphFormat": { "styleName": "Footer", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 1 }] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "CG Times" }, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "bold": true, "fontFamily": "Times New Roman" }, "basedOn": "Normal", "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Table Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Table Normal" }, { "name": "No List", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Times New Roman" }, "next": "No List" }, { "name": "Endnote Text", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "Endnote Text" }, { "name": "Endnote Reference", "type": "Character", "characterFormat": { "baselineAlignment": "Superscript" }, "basedOn": "Default Paragraph Font" }, { "name": "Footnote Text", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "Footnote Text" }, { "name": "Footnote Reference", "type": "Character", "characterFormat": { "baselineAlignment": "Superscript" }, "basedOn": "Default Paragraph Font" }, { "name": "TOC 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "rightIndent": 36, "firstLineIndent": -36, "beforeSpacing": 24, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 72, "rightIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 108, "rightIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 144, "rightIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 180, "rightIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 7", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 8", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOC 9", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "Index 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 72, "rightIndent": 36, "firstLineIndent": -72, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "Index 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 72, "rightIndent": 36, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "Dot" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "TOA Heading", "type": "Paragraph", "paragraphFormat": { "listFormat": {}, "tabs": [{ "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "Caption", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal", "next": "Normal" }, { "name": "_Equation Caption", "type": "Character", "characterFormat": {}, "basedOn": "Default Paragraph Font" }, { "name": "Header", "type": "Paragraph", "paragraphFormat": { "listFormat": {}, "tabs": [{ "position": 207.64999389648438, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 415.29998779296875, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Header" }, { "name": "Footer", "type": "Paragraph", "paragraphFormat": { "listFormat": {}, "tabs": [{ "position": 207.64999389648438, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 415.29998779296875, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "Normal", "next": "Footer" }, { "name": "No Spacing", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontSizeBidi": 11 }, "next": "No Spacing" }, { "name": "Normal (Web)", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 5, "afterSpacing": 5, "listFormat": {} }, "characterFormat": { "fontFamily": "Times New Roman", "fontSizeBidi": 12 }, "basedOn": "Normal", "next": "Normal (Web)" }, { "name": "Hyperlink", "type": "Character", "characterFormat": { "underline": "Single", "fontColor": "#0000FFFF", "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };

describe('Link Field Validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
    });
    it('Check Error on Link Field', () => {
console.log('Check Error on Link Field');
        expect(() => { editor.open(JSON.stringify(sfdt)) }).not.toThrowError();
    });
});

let restartNumberSfdt: any = {
    "sections": [
      {
        "blocks": [
          {
            "characterFormat": { "fontColor": "empty" },
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          }
        ],
        "headersFooters": {
          "header": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Header" },
                "inlines": []
              }
            ]
          },
          "footer": {
            "blocks": [
              {
                "blocks": [
                  {
                    "characterFormat": { "fontColor": "empty" },
                    "paragraphFormat": { "styleName": "Footer" },
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
                        "hasFieldEnd": true,
                        "characterFormat": { "fontColor": "empty" },
                        "fieldType": 0
                      },
                      {
                        "text": " PAGE \\* MERGEFORMAT ",
                        "characterFormat": { "fontColor": "empty" }
                      },
                      { "fieldType": 2 },
                      {
                        "text": "2",
                        "characterFormat": { "fontColor": "empty" }
                      },
                      { "fieldType": 1 }
                    ]
                  }
                ],
                "contentControlProperties": {
                  "lockContentControl": false,
                  "lockContents": false,
                  "color": "#00000000",
                  "type": "BuildingBlockGallery",
                  "hasPlaceHolderText": false,
                  "multiline": false,
                  "isTemporary": false,
                  "dateCalendarType": "Gregorian",
                  "isChecked": false,
                  "characterFormat": { "fontColor": "empty" }
                }
              },
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Footer" },
                "inlines": []
              }
            ]
          },
          "evenHeader": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Header" },
                "inlines": []
              }
            ]
          },
          "evenFooter": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Footer" },
                "inlines": []
              }
            ]
          },
          "firstPageHeader": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Header" },
                "inlines": []
              }
            ]
          },
          "firstPageFooter": {
            "blocks": [
              {
                "characterFormat": { "fontColor": "empty" },
                "paragraphFormat": { "styleName": "Footer" },
                "inlines": []
              }
            ]
          }
        },
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
      },
      {
        "blocks": [
          {
            "characterFormat": { "fontColor": "empty" },
            "paragraphFormat": { "styleName": "Normal" },
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
          "restartPageNumbering": true,
          "pageStartingNumber": 9
        }
      },
      {
        "blocks": [
          {
            "characterFormat": { "fontColor": "empty" },
            "paragraphFormat": { "styleName": "Normal" },
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
    "background": { "color": "#FFFFFFFF" },
    "styles": [
      {
        "type": "Paragraph",
        "name": "Normal",
        "next": "Normal",
        "characterFormat": { "fontColor": "empty" }
      },
      {
        "type": "Character",
        "name": "Default Paragraph Font",
        "characterFormat": { "fontColor": "empty" }
      },
      {
        "type": "Paragraph",
        "name": "Header",
        "basedOn": "Normal",
        "next": "Header",
        "link": "Header Char",
        "characterFormat": { "fontColor": "empty" },
        "paragraphFormat": {
          "afterSpacing": 0.0,
          "lineSpacing": 1.0,
          "lineSpacingType": "Multiple",
          "tabs": [
            {
              "tabJustification": "Center",
              "position": 234.0,
              "tabLeader": "None",
              "deletePosition": 0.0
            },
            {
              "tabJustification": "Right",
              "position": 468.0,
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
        "characterFormat": { "fontColor": "empty" }
      },
      {
        "type": "Paragraph",
        "name": "Footer",
        "basedOn": "Normal",
        "next": "Footer",
        "link": "Footer Char",
        "characterFormat": { "fontColor": "empty" },
        "paragraphFormat": {
          "afterSpacing": 0.0,
          "lineSpacing": 1.0,
          "lineSpacingType": "Multiple",
          "tabs": [
            {
              "tabJustification": "Center",
              "position": 234.0,
              "tabLeader": "None",
              "deletePosition": 0.0
            },
            {
              "tabJustification": "Right",
              "position": 468.0,
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
        "characterFormat": { "fontColor": "empty" }
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

describe('Restart Page Numbering Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Page Numbering Validation', () => {
console.log('Restart Page Numbering Validation');
        editor.open(restartNumberSfdt);
        expect(editor.documentHelper.pages[0].currentPageNum).toBe(1);
        expect(editor.documentHelper.pages[1].currentPageNum).toBe(9);
        expect(editor.documentHelper.pages[2].currentPageNum).toBe(10);
    });
    
});
