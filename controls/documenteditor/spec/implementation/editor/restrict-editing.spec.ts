import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement, select } from '@syncfusion/ej2-base';
import { Editor, TableWidget, TextElementBox } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Restrict editing selection and edit region validation
 */
describe('Restrict editing Add edit region', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Add selected region to readonly case', () => {
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.selection.handleControlHomeKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        editor.editor.insertEditRangeElement('Everyone');
        editor.editor.protect('ReadOnly');
        expect(editor.documentHelper.editRanges.length).toBe(1);
    });
    it('highlight selection for editable region', () => {
        editor.selection.isHighlightEditRegion = true;
        editor.selection.highlightEditRegion();
    });
    it('SelectAll for editable region', () => {
        editor.selection.showAllEditingRegion();
    });
    it('remove editrange at current selection', () => {
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.removeUserRestrictions('Everyone');
        expect(editor.documentHelper.editRanges.get('Everyone').length).toBe(0);
    });
});

let paragraph: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "afterSpacing": 30.0, "styleName": "Heading 1" }, "inlines": [{ "editRangeId": "1912695574", "group": "everyone" }, { "editRangeId": "514155093", "user": "sample@gmail.com" }, { "text": "Adventure Works Cycles" }, { "editRangeId": "1912695574", "editableRangeStart": { "editRangeId": "1912695574", "group": "everyone" } }, { "editRangeId": "514155093", "editableRangeStart": { "editRangeId": "514155093", "user": "sample@gmail.com" } }] }, { "paragraphFormat": { "firstLineIndent": 36.0, "styleName": "Normal" }, "inlines": [{ "text": "Adventure Works Cycles, the fictitious company on which the " }, { "text": "AdventureWorks" }, { "text": " sample databases are based, is a large, multinational " }, { "editRangeId": "1184707919", "group": "everyone" }, { "text": "manufacturing company. The company manufactures and sells metal and composite bicycles to North American, European and Asian commercial markets. While its base operation " }, { "text": "is located in" }, { "text": " Bothell, Washington wit" }, { "editRangeId": "1184707919", "editableRangeStart": { "editRangeId": "1184707919", "group": "everyone" } }, { "text": "h 290 employees, several regional sales teams are located throughout their market base." }] }, { "paragraphFormat": { "firstLineIndent": 36.0, "styleName": "Normal" }, "inlines": [{ "text": "In 2000, Adventure Works Cycles bought a small manufac" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": "turing plant, Importadores Neptuno, located in Mexico. " }, { "text": "Importadores" }, { "text": " " }, { "editRangeId": "451241714", "group": "everyone" }, { "editRangeId": "1146227303", "user": "sample@gmail.com" }, { "text": "Neptuno manufactures several critical subcomponents for the Adventure Works Cycles product line. These subcomponents are shipped to the Bothell location for final product assembly. In 2001, " }, { "text": "Importadores" }, { "text": " Neptuno" }, { "editRangeId": "451241714", "editableRangeStart": { "editRangeId": "451241714", "group": "everyone" } }, { "editRangeId": "1146227303", "editableRangeStart": { "editRangeId": "1146227303", "user": "sample@gmail.com" } }, { "text": ", became the sole manufacturer and distributor of the touring bicycle product group." }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "editRangeId": "668092358", "group": "everyone" }, { "text": "Product Overview" }, { "editRangeId": "668092358", "editableRangeStart": { "editRangeId": "668092358", "group": "everyone" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontFamilyBidi": "Times New Roman" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 12.0, "outlineLevel": "Level1" } }, { "type": "Paragraph", "name": "Heading 2", "basedOn": "Normal", "next": "Normal", "link": "Heading 2 Char", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "afterSpacing": 6.0, "outlineLevel": "Level2" } }, { "type": "Paragraph", "name": "Heading 3", "basedOn": "Normal", "next": "Normal", "link": "Heading 3 Char", "characterFormat": { "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level3" } }, { "type": "Paragraph", "name": "Heading 4", "basedOn": "Normal", "next": "Normal", "link": "Heading 4 Char", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level4" } }, { "type": "Paragraph", "name": "Heading 5", "basedOn": "Normal", "next": "Normal", "link": "Heading 5 Char", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level5" } }, { "type": "Paragraph", "name": "Heading 6", "basedOn": "Normal", "next": "Normal", "link": "Heading 6 Char", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "outlineLevel": "Level6" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 2 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 3 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 12.0, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 4 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 5 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 6 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" } }], "defaultTabWidth": 36.0, "formatting": false, "protectionType": "ReadOnly", "enforcement": true, "hashValue": "uRsKdmfajrTccbIQUMDO9Nf0cH3r5CF86qNNBwGpBXiqteB/uzjMnkTqefN7LAOn8KI1y9do60XhE/NEpbseyw==", "saltValue": "exv9WhHKEdkNOkzHGmmmxQ==" };


describe('Restrict editing Add edit region with everyone validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(paragraph));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('highlightedit region validation', () => {
        editor.selection.isHighlightEditRegion = true;
        editor.selection.highlightEditRegion();
    });
    it('Navigate edit region validation', () => {
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('Formatting inside edit region validation', () => {
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Formatting outside edit region validation', () => {
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });
    it('Editing outside edit region validation', () => {
        editor.editor.handleTextInput('sample');
        expect(editor.selection.getText(true)).toBe('')
    });
    it('Editing inside edit region validation', () => {
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.insertText(' sample');
        editor.selection.selectCurrentWord();
        let text: string = editor.selection.getText(true)
        expect(text.indexOf('sample')).not.toBe(-1);
    });
});

describe('Restrict editing Add edit region based on currentuser validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(paragraph));
        editor.currentUser = 'sample@gmail.com';
        editor.userColor = '#E0E0E0';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('highlightedit region validation', () => {
        editor.selection.isHighlightEditRegion = true;
        expect(editor.documentHelper.editRanges.length).toBe(2);
    });
    it('Unhighlightedit region validation', () => {
        editor.selection.isHighlightEditRegion = false;
        expect(editor.selection.editRegionHighlighters).toBeUndefined();
    });
    it('Navigate edit region validation', () => {
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('Formatting inside edit region validation', () => {
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Formatting outside edit region validation', () => {
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });
    it('Editing outside edit region validation', () => {
        editor.editor.handleTextInput('sample');
        expect(editor.selection.getText(true)).toBe('')
    });
    it('Editing inside edit region validation', () => {
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.insertText(' sample');
        editor.selection.selectCurrentWord();
        let text: string = editor.selection.getText(true);
        expect(text.indexOf('sample')).not.toBe(-1);
    });
});
let table: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "658904599", "group": "everyone" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }, { "editRangeId": "658904599", "editableRangeStart": { "editRangeId": "658904599", "group": "everyone" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "157440609", "columnFirst": 0, "columnLast": 0, "group": "everyone" }, { "editRangeId": "321197460", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "157440609", "editableRangeStart": { "editRangeId": "157440609", "columnFirst": 0, "columnLast": 0, "group": "everyone" } }, { "editRangeId": "321197460", "editableRangeStart": { "editRangeId": "321197460", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false } }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "editRangeId": "2145070062", "user": "sample@gmail.com" }, { "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "editRangeId": "2145070062", "editableRangeStart": { "editRangeId": "2145070062", "user": "sample@gmail.com" } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Hello World. This is adventure" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }], "defaultTabWidth": 36.0, "formatting": true, "protectionType": "ReadOnly", "enforcement": true, "hashValue": "hft9V2L7YF9LmSQzl7cjjvkAzCexZS5mRBZsT4JtOmCajw1O9HIB6bj2Q2MgCk/ejm5VfFn08dASVdWnlH+EqQ==", "saltValue": "0Ih64ttQ8dIiFXcDfuTQ0Q==" };
describe('Restrict editing Add edit region inside Table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(table));
        editor.currentUser = 'sample@gmail.com';
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('highlightedit region validation', () => {
        editor.selection.isHighlightEditRegion = true;
        expect(editor.selection.editRegionHighlighters.length).not.toBe(0);
    });
    it('Unhighlightedit region validation', () => {
        editor.selection.isHighlightEditRegion = false;
        expect(editor.selection.editRegionHighlighters).toBeUndefined();
    });
    it('Navigate edit region validation', () => {
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('BackSpace Validation', () => {
        editor.selection.navigateToNextEditingRegion();
        editor.editor.insertText('T');
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(editor.selection.isSelectionIsAtEditRegion(false)).toBe(true);
    });
});

describe('Restrict editing add and remove with history preservation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.selection.isHighlightEditRegion = true;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Add restrictions to selected area in document', () => {
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });
    it('Undo after edit range collection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.editRangeCollection.length).toBe(0);
    });
    it('Redo after edit range collection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });
    it('Remove restrictions to selected area in document', () => {
        editor.selection.isHighlightEditRegion = true;
        editor.openBlank();
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        editor.selection.handleHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.removeUserRestrictions('everyone');
        expect(editor.selection.editRangeCollection.length).toBe(0);
    });
    it('undo after remove restrictions', () => {
        editor.editorHistory.undo();
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });

});



describe('Restrict Editing validation with password is empty validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.selection.isHighlightEditRegion = true;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('protect document with empty password', () => {
        editor.editor.insertText('sample');
       editor.editor.addProtection('','ReadOnly');
       expect(editor.documentHelper.protectionType).toBe('ReadOnly');
       expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it('Insert text in protected document', () => {
        editor.editor.handleTextInput('s');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('sample');
    editor.editor.unProtectDocument();
   
    });
    it('Insert text after unprotect document', () => {
        editor.editor.insertText('s');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('samples');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        editor.editor.addProtection('','ReadOnly');
        editor.editor.handleTextInput('s');
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('samples');
    });

});