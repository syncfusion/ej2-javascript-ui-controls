import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { LineWidget, ParagraphWidget } from '../../../src/document-editor/implementation/viewer/page';
import { WordExport } from '../../../src/document-editor/implementation/writer/word-export';
import { XmlWriter } from '@syncfusion/ej2-file-utils';

let restrictExport: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "658904599", "group": "everyone" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }, { "editRangeId": "658904599", "editableRangeStart": { "editRangeId": "658904599", "group": "everyone" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "157440609", "columnFirst": 0, "columnLast": 0, "group": "everyone" }, { "editRangeId": "321197460", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "157440609", "editableRangeStart": { "editRangeId": "157440609", "columnFirst": 0, "columnLast": 0, "group": "everyone" } }, { "editRangeId": "321197460", "editableRangeStart": { "editRangeId": "321197460", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "2145070062", "user": "sample@gmail.com" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "editRangeId": "2145070062", "editableRangeStart": { "editRangeId": "2145070062", "user": "sample@gmail.com" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }], "defaultTabWidth": 36.0, "formatting": true, "protectionType": "ReadOnly", "enforcement": true, "hashValue": "hft9V2L7YF9LmSQzl7cjjvkAzCexZS5mRBZsT4JtOmCajw1O9HIB6bj2Q2MgCk/ejm5VfFn08dASVdWnlH+EqQ==", "saltValue": "0Ih64ttQ8dIiFXcDfuTQ0Q==" };

describe('Restrict editing export validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let json:any;
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
        editor.open(JSON.stringify(restrictExport));
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
    it('Formatting and protection type validation', () => {
      expect(()=>{  editor.wordExportModule.save(editor.viewer, 'RestrictEditing');}).not.toThrowError();
    });
    it('Permstart and end in paragraph validation', () => {
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        (editor.wordExportModule as any).section = (editor.wordExportModule as any).document.sections[0];
        let writer: XmlWriter = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraphItems(writer, json.sections[0].blocks[1].inlines);
        expect((writer as any).bufferText.indexOf('<w:permStart w:edGrp="everyone"')).not.toBe(-1);      
    });
});

let format:any={"sections":[{"blocks":[{"paragraphFormat":{"afterSpacing":30.0,"styleName":"Heading 1"},"inlines":[{"text":"Adventure Work"},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1},{"text":"s Cycles"}]},{"paragraphFormat":{"firstLineIndent":36.0,"styleName":"Normal"},"inlines":[{"text":"Adventure Works Cycles, the fictitious company on which the "},{"text":"AdventureWorks"},{"text":" sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation "},{"text":"is located in"},{"text":" Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base."}]},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontFamily":"Calibri","fontSizeBidi":10.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"beforeSpacing":12.0,"outlineLevel":"Level1"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":10.0,"fontFamilyBidi":"Times New Roman"}}],"defaultTabWidth":36.0,"formatting":true,"protectionType":"NoProtection","enforcement":true,"hashValue":"eVoNOXijTwRG8BOdeNzDDfHsmd+qOT/aaKgI8NhmnXkKJcCxatJyWYaED+5RG52qgIXFlcAVQvQPp0EqPDskjg==","saltValue":"Qb4b+Mg0aedgk8Al1wNpLQ=="};


describe('Format word export validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    let json:any;
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
        editor.open(JSON.stringify(restrictExport));
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
    it('Formatting and no protection type validation', () => {
       expect(()=>{ editor.wordExportModule.save(editor.viewer, 'Format');}).not.toThrowError();
    });
    it('Formatting tag validation validation', () => {
        json = editor.sfdtExportModule.write();
        (editor.wordExportModule as any).setDocument(json);
        
        let writer: XmlWriter = new XmlWriter();
        (editor.wordExportModule as any).serializeDocumentProtectionSettings(writer);
        expect((writer as any).bufferText.indexOf('<w:documentProtection w:formatting="1"')).not.toBe(-1);      
    });
});