import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { ParagraphWidget } from '../../src/index';
/**
 * Editor API validation
 */
let list_style: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36 }, "blocks": [{ "paragraphFormat": { "leftIndent": 28.350000381469727, "firstLineIndent": -28.350000381469727, "styleName": "Cognia Law Heading 1", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "_Toc512264826" }, { "characterFormat": {}, "text": "Intr" }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }, { "characterFormat": {}, "text": "oduction" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_Toc512264826" }] }, { "paragraphFormat": { "styleName": "Cognia Law Sub-Para 1", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "The " }, { "characterFormat": {}, "text": "Receiving " }, { "characterFormat": {}, "text": "Party" }, { "characterFormat": {}, "text": " understands " }, { "characterFormat": {}, "text": "and " }, { "characterFormat": {}, "text": "acknowledges " }, { "characterFormat": {}, "text": "that " }, { "characterFormat": {}, "text": "the " }, { "characterFormat": {}, "text": "Disclosing " }, { "characterFormat": {}, "text": "Party" }, { "characterFormat": {}, "text": " " }, { "characterFormat": {}, "text": "has " }, { "characterFormat": {}, "text": "disclosed " }, { "characterFormat": {}, "text": "or" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Justify", "beforeSpacing": 6, "afterSpacing": 6, "lineSpacing": 1.5, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontFamily": "Arial" }, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Cognia Law Heading 1", "type": "Paragraph", "paragraphFormat": { "listFormat": { "listId": 0 } }, "characterFormat": { "bold": true, "fontSize": 12 }, "basedOn": "List Paragraph", "link": "Cognia Law Heading 1 Char", "next": "Normal" }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal" }, { "name": "Cognia Law Heading 1 Char", "type": "Character", "characterFormat": { "bold": true, "fontSize": 12, "fontFamily": "Arial" }, "basedOn": "Default Paragraph Font" }, { "name": "Cognia Law Sub-Para 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": 0, "listFormat": { "listId": 0, "listLevelNumber": 1 }, "tabs": [{ "position": 18, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "List Paragraph", "next": "Normal" }, { "name": "Cognia Law Sub-Para 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": 0, "listFormat": { "listId": 0, "listLevelNumber": 2 }, "tabs": [{ "position": 0, "deletePosition": 72, "tabJustification": "Left", "tabLeader": "None" }, { "position": 18, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "List Paragraph" }, { "name": "Cognia Law Sub-Para 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 36, "firstLineIndent": 0, "listFormat": { "listId": 0, "listLevelNumber": 3 }, "tabs": [{ "position": 18, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "characterFormat": {}, "basedOn": "List Paragraph" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [{ "abstractListId": 0, "listId": 0 }], "abstractLists": [{ "abstractListId": 0, "levels": [{ "characterFormat": {}, "paragraphFormat": { "leftIndent": 36, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.", "restartLevel": 0, "startAt": 1 }, { "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal" }, "paragraphFormat": { "leftIndent": 43.099998474121094, "firstLineIndent": -36, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.", "restartLevel": 1, "startAt": 1 }, { "characterFormat": { "bold": false, "fontSize": 11 }, "paragraphFormat": { "leftIndent": 72, "firstLineIndent": -36, "listFormat": {}, "tabs": [{ "position": 72, "deletePosition": 0, "tabJustification": "List", "tabLeader": "None" }] }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.", "restartLevel": 2, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 113.4000015258789, "firstLineIndent": -41.400001525878906, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.", "restartLevel": 3, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 111.5999984741211, "firstLineIndent": -39.599998474121094, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.", "restartLevel": 4, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 136.8000030517578, "firstLineIndent": -46.79999923706055, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.", "restartLevel": 5, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 162, "firstLineIndent": -54, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.", "restartLevel": 6, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 187.1999969482422, "firstLineIndent": -61.20000076293945, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.", "restartLevel": 7, "startAt": 1 }, { "characterFormat": {}, "paragraphFormat": { "leftIndent": 216, "firstLineIndent": -72, "listFormat": {} }, "followCharacter": "Tab", "listLevelPattern": "Arabic", "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9.", "restartLevel": 8, "startAt": 1 }] }] };



describe('Select list text and delete validation', () => {
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
        editor.open(JSON.stringify(list_style));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Select list Text validation', () => {
console.log('Select list Text validation');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.contextType).toBe('List');
    });
    it(' Delete after List Text', () => {
console.log(' Delete after List Text');
        editor.editor.delete();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after delete list Text', () => {
console.log('undo after delete list Text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
    it('redo after delete list Text', () => {
console.log('redo after delete list Text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
});


describe('Select list text and backspace validation', () => {
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
        editor.open(JSON.stringify(list_style));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Select list Text validation', () => {
console.log('Select list Text validation');
        editor.selection.moveDown();
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.contextType).toBe('List');
    });
    it(' backspace after List Text', () => {
console.log(' backspace after List Text');
        editor.editor.onBackSpace();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after backspace list Text', () => {
console.log('undo after backspace list Text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
    it('redo after backspace list Text', () => {
console.log('redo after backspace list Text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it(' undo operation after backspace list Text and multiple undo,redo operation', () => {
console.log(' undo operation after backspace list Text and multiple undo,redo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
});


describe('Enter in between the list paragraph', () => {
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
        editor.open(JSON.stringify(list_style));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('OnEnter in between the list paragraph', () => {
console.log('OnEnter in between the list paragraph');
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
    it('validation previous paragraph contains list', () => {
console.log('validation previous paragraph contains list');
        let paragraph: ParagraphWidget = editor.selection.start.paragraph.previousWidget as ParagraphWidget;
        expect(paragraph.paragraphFormat.listFormat.listId).not.toBe(-1);
    });
    it('undo after enter list Text', () => {
console.log('undo after enter list Text');
        editor.editorHistory.undo();
        expect(editor.selection.start.isAtParagraphEnd).toBe(false);
    });
    it('redo after backspace list Text', () => {
console.log('redo after backspace list Text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
    it(' undo operation after backspace list Text and multiple undo,redo operation', () => {
console.log(' undo operation after backspace list Text and multiple undo,redo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.start.isAtParagraphEnd).toBe(false);
    });
});
let rowAcrossPage: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 150, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36 }, "blocks": [{ "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 2, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 0, "allowBreakAcrossPages": false, "heightType": "Auto", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 0, "allowBreakAcrossPages": false, "heightType": "Auto", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }], "grid": [156, 156, 156], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 468, "preferredWidthType": "Point" } }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": {}, "paragraphFormat": { "listFormat": {} }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('Enter at last row of table with allowrowacross pages is false', () => {
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
        editor.open(JSON.stringify(rowAcrossPage));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('OnEnter at end of last row with row spanned cell', () => {
console.log('OnEnter at end of last row with row spanned cell');
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editor.onEnter();
        expect(editor.selection.rowFormat.allowBreakAcrossPages).toBe(false);
    });
    it('undo after OnEnter at end of last row with row spanned cell', () => {
console.log('undo after OnEnter at end of last row with row spanned cell');
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    });
    it('redo after OnEnter at end of last row with row spanned cell', () => {
console.log('redo after OnEnter at end of last row with row spanned cell');
        expect(() => { editor.editorHistory.redo(); }).not.toThrowError();
    });
    it(' undo operation after OnEnter at end of last row with row spanned cell and multiple undo,redo operation', () => {
console.log(' undo operation after OnEnter at end of last row with row spanned cell and multiple undo,redo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    });
});
