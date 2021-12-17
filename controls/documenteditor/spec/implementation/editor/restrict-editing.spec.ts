import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement, select } from '@syncfusion/ej2-base';
import { Editor, TableWidget, TextElementBox, TextFormFieldDialog, TableCellWidget } from '../../../src/index';
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
console.log('Add selected region to readonly case');
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
console.log('highlight selection for editable region');
        editor.selection.isHighlightEditRegion = true;
        editor.selection.highlightEditRegion();
    });
    it('SelectAll for editable region', () => {
console.log('SelectAll for editable region');
        editor.selection.showAllEditingRegion();
    });
    it('remove editrange at current selection', () => {
console.log('remove editrange at current selection');
        editor.selection.handleControlHomeKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.editor.removeUserRestrictions('Everyone');
        expect(editor.documentHelper.editRanges.containsKey('Everyone')).toBe(false);
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
console.log('highlightedit region validation');
        editor.selection.isHighlightEditRegion = true;
        editor.selection.highlightEditRegion();
    });
    it('Navigate edit region validation', () => {
console.log('Navigate edit region validation');
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('Formatting inside edit region validation', () => {
console.log('Formatting inside edit region validation');
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
console.log('Formatting outside edit region validation');
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
console.log('Editing outside edit region validation');
        editor.editor.handleTextInput('sample');
        expect(editor.selection.getText(true)).toBe('')
    });
    it('Editing inside edit region validation', () => {
console.log('Editing inside edit region validation');
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
console.log('highlightedit region validation');
        editor.selection.isHighlightEditRegion = true;
        expect(editor.documentHelper.editRanges.length).toBe(2);
    });
    it('Unhighlightedit region validation', () => {
console.log('Unhighlightedit region validation');
        editor.selection.isHighlightEditRegion = false;
        expect(editor.selection.editRegionHighlighters).toBeUndefined();
    });
    it('Navigate edit region validation', () => {
console.log('Navigate edit region validation');
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('Formatting inside edit region validation', () => {
console.log('Formatting inside edit region validation');
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
console.log('Formatting outside edit region validation');
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
console.log('Editing outside edit region validation');
        editor.editor.handleTextInput('sample');
        expect(editor.selection.getText(true)).toBe('')
    });
    it('Editing inside edit region validation', () => {
console.log('Editing inside edit region validation');
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
console.log('highlightedit region validation');
        editor.selection.isHighlightEditRegion = true;
        expect(editor.selection.editRegionHighlighters.length).not.toBe(0);
    });
    it('Unhighlightedit region validation', () => {
console.log('Unhighlightedit region validation');
        editor.selection.isHighlightEditRegion = false;
        expect(editor.selection.editRegionHighlighters).toBeUndefined();
    });
    it('Navigate edit region validation', () => {
console.log('Navigate edit region validation');
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
        editor.selection.navigateToNextEditingRegion();
    });
    it('BackSpace Validation', () => {
console.log('BackSpace Validation');
        editor.selection.navigateToNextEditingRegion();
        editor.editor.insertText('T');
        editor.editor.onBackSpace();
        editor.editor.onBackSpace();
        expect(editor.selection.isSelectionInEditRegion()).toBe(true);
    });
    it('Public API validation', () => {
console.log('Public API validation');
        editor.selection.navigateToNextEditingRegion();
        expect(editor.selection.isSelectionInEditRegion()).toBe(true);
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
console.log('Add restrictions to selected area in document');
        editor.editor.insertText('sample');
        editor.editor.onEnter();
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });
    it('Undo after edit range collection', () => {
console.log('Undo after edit range collection');
        editor.editorHistory.undo();
        expect(editor.selection.editRangeCollection.length).toBe(0);
    });
    it('Redo after edit range collection', () => {
console.log('Redo after edit range collection');
        editor.editorHistory.redo();
        expect(editor.selection.editRangeCollection.length).toBe(1);
    });
    it('Remove restrictions to selected area in document', () => {
console.log('Remove restrictions to selected area in document');
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
console.log('undo after remove restrictions');
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
console.log('protect document with empty password');
        editor.editor.insertText('sample');
        editor.editor.addProtection('', 'ReadOnly');
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it('Insert text in protected document', () => {
console.log('Insert text in protected document');
        editor.editor.handleTextInput('s');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('sample');
        editor.editor.unProtectDocument();

    });
    it('Insert text after unprotect document', () => {
console.log('Insert text after unprotect document');
        editor.editor.insertText('s');
        expect((editor.selection.start.currentWidget.children[0] as TextElementBox).text).toBe('samples');
        editor.selection.selectAll();
        editor.editor.insertEditRangeElement('everyone');
        editor.editor.addProtection('', 'ReadOnly');
        editor.editor.handleTextInput('s');
        expect((editor.selection.start.currentWidget.children[1] as TextElementBox).text).toBe('samples');
    });

});
let TextFormField: any = {
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
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "fieldType": 0,
                            "hasFieldEnd": true,
                            "formFieldData": {
                                "name": "Text1",
                                "enabled": true,
                                "helpText": "",
                                "statusText": "",
                                "textInput": {
                                    "type": "Text",
                                    "maxLength": 0,
                                    "defaultValue": "Syncfusion",
                                    "format": ""
                                }
                            }
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "Text1"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": " FORMTEXT "
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "Syncfusion"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 1
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "Text1"
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
    "enforcement": true,
    "hashValue": "DtAEDux42ScZP1O4y/wSNBM3VM7798i7zX3uabsX6R5z+tkmWLkenUjf/E893543/lmTZn5nSysnO19TYnD+GQ==",
    "saltValue": "IoYM+ccLHCMT6B8SRquSgw==",
    "formatting": false,
    "protectionType": "FormFieldsOnly",
    "dontUseHTMLParagraphAutoSpacing": false,
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
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
                "listFormat": {
                }
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
                "listFormat": {
                }
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
                "listFormat": {
                }
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
                "listFormat": {
                }
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
                "listFormat": {
                }
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
                "listFormat": {
                }
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
    "lists": [
    ],
    "abstractLists": [
    ],
    "comments": [
    ]
}
describe('Form Filling validation For Formatting', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({
            enableEditor: true, isReadOnly: false, enableEditorHistory: true,
            documentEditorSettings: { formFieldSettings: { formFillingMode: 'Inline' } }
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(TextFormField));
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
    it('Form Filling TextForm Field validation For CharacterFormatting', () => {
console.log('Form Filling TextForm Field validation For CharacterFormatting');
        editor.selection.navigateToNextFormField();
        editor.selection.selectField();
        editor.documentEditorSettings.formFieldSettings.formattingExceptions = ['Bold', 'Italic'];
        editor.editorModule.onApplyCharacterFormat('bold', true, false);
        expect(editor.documentHelper.protectionType).toBe('FormFieldsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('Form Filling TextForm Field validation For ParagraphFormatting', () => {
console.log('Form Filling TextForm Field validation For ParagraphFormatting');
        editor.selection.selectField();
        editor.documentEditorSettings.formFieldSettings.formattingExceptions = ['TextAlignment'];
        editor.editorModule.onApplyParagraphFormat('textAlignment', 'Center', false, true);
        expect(editor.documentHelper.protectionType).toBe('FormFieldsOnly');
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Center');
    });
});

/**
 * Restrict editing inside
 */

// let restrictData: any = {
//     "sections": [
//         {
//             "blocks": [
//                 {
//                     "paragraphFormat": {
//                         "styleName": "Normal"
//                     },
//                     "characterFormat": {},
//                     "inlines": [
//                         {
//                             "characterFormat": {},
//                             "text": "Out of table"
//                         }
//                     ]
//                 },
//                 {
//                     "paragraphFormat": {},
//                     "characterFormat": {},
//                     "inlines": []
//                 },
//                 {
//                     "rows": [
//                         {
//                             "cells": [
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "styleName": "Section Title"
//                                             },
//                                             "characterFormat": {},
//                                             "inlines": [
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": "TITLE IN TABLE"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {
//                                             "backgroundColor": "#415364FF",
//                                             "foregroundColor": "empty",
//                                             "textureStyle": "TextureNone"
//                                         },
//                                         "preferredWidth": 468,
//                                         "preferredWidthType": "Point",
//                                         "cellWidth": 468,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1,
//                                         "verticalAlignment": "Center"
//                                     },
//                                     "columnIndex": 0
//                                 }
//                             ],
//                             "rowFormat": {
//                                 "height": 20,
//                                 "allowBreakAcrossPages": true,
//                                 "heightType": "AtLeast",
//                                 "isHeader": false,
//                                 "borders": {
//                                     "top": {},
//                                     "left": {},
//                                     "right": {},
//                                     "bottom": {},
//                                     "diagonalDown": {},
//                                     "diagonalUp": {},
//                                     "horizontal": {},
//                                     "vertical": {}
//                                 },
//                                 "gridBefore": 1,
//                                 "gridBeforeWidth": 0,
//                                 "gridBeforeWidthType": "Point",
//                                 "gridAfter": 0,
//                                 "leftMargin": 5.4,
//                                 "topMargin": 0,
//                                 "rightMargin": 5.4,
//                                 "bottomMargin": 0
//                             }
//                         }
//                     ],
//                     "grid": [
//                         468
//                     ],
//                     "tableFormat": {
//                         "borders": {
//                             "top": {},
//                             "left": {},
//                             "right": {},
//                             "bottom": {},
//                             "diagonalDown": {},
//                             "diagonalUp": {},
//                             "horizontal": {},
//                             "vertical": {}
//                         },
//                         "shading": {},
//                         "leftIndent": 0,
//                         "topMargin": 0,
//                         "rightMargin": 5.4,
//                         "leftMargin": 5.4,
//                         "bottomMargin": 0,
//                         "bidi": false,
//                         "allowAutoFit": true
//                     },
//                     "columnCount": 1
//                 },
//                 {
//                     "paragraphFormat": {},
//                     "characterFormat": {},
//                     "inlines": []
//                 },
//                 {
//                     "rows": [
//                         {
//                             "cells": [
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "characterFormat": {},
//                                             "inlines": [
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": "Key 0"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 0
//                                 },
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editRangeId": "0",
//                                                     "columnFirst": 1,
//                                                     "columnLast": 1,
//                                                     "user": "Everyone"
//                                                 },
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": " "
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "paragraphFormat": {
//                                                 "styleName": "Restricted Editing"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editableRangeStart": {
//                                                         "user": "Everyone",
//                                                         "group": "",
//                                                         "columnFirst": 1,
//                                                         "columnLast": 1
//                                                     },
//                                                     "editRangeId": "0"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 1
//                                 }
//                             ],
//                             "rowFormat": {
//                                 "height": 0,
//                                 "heightType": "Auto",
//                                 "borders": {
//                                     "top": {},
//                                     "left": {},
//                                     "right": {},
//                                     "bottom": {},
//                                     "diagonalDown": {},
//                                     "diagonalUp": {},
//                                     "horizontal": {},
//                                     "vertical": {}
//                                 },
//                                 "gridBefore": 0,
//                                 "gridAfter": 0
//                             }
//                         },
//                         {
//                             "cells": [
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "characterFormat": {},
//                                             "inlines": [
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": "Key 1"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 0
//                                 },
//                                 {
//                                     "blocks": [
//                                         {
//                                             "paragraphFormat": {
//                                                 "listFormat": {},
//                                                 "styleName": "Normal"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editRangeId": "1",
//                                                     "columnFirst": 1,
//                                                     "columnLast": 1,
//                                                     "user": "Everyone"
//                                                 },
//                                                 {
//                                                     "characterFormat": {},
//                                                     "text": " "
//                                                 }
//                                             ]
//                                         },
//                                         {
//                                             "paragraphFormat": {
//                                                 "styleName": "Restricted Editing"
//                                             },
//                                             "inlines": [
//                                                 {
//                                                     "editableRangeStart": {
//                                                         "user": "Everyone",
//                                                         "group": "",
//                                                         "columnFirst": 1,
//                                                         "columnLast": 1
//                                                     },
//                                                     "editRangeId": "1"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "cellFormat": {
//                                         "borders": {
//                                             "top": {},
//                                             "left": {},
//                                             "right": {},
//                                             "bottom": {},
//                                             "diagonalDown": {},
//                                             "diagonalUp": {},
//                                             "horizontal": {},
//                                             "vertical": {}
//                                         },
//                                         "shading": {},
//                                         "preferredWidth": 234,
//                                         "cellWidth": 234,
//                                         "columnSpan": 1,
//                                         "rowSpan": 1
//                                     },
//                                     "columnIndex": 1
//                                 }
//                             ],
//                             "rowFormat": {
//                                 "height": 0,
//                                 "heightType": "Auto",
//                                 "borders": {
//                                     "top": {},
//                                     "left": {},
//                                     "right": {},
//                                     "bottom": {},
//                                     "diagonalDown": {},
//                                     "diagonalUp": {},
//                                     "horizontal": {},
//                                     "vertical": {}
//                                 },
//                                 "gridBefore": 0,
//                                 "gridAfter": 0
//                             }
//                         }
//                     ],
//                     "grid": [
//                         234,
//                         234
//                     ],
//                     "tableFormat": {
//                         "borders": {
//                             "top": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "left": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "right": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "bottom": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "diagonalDown": {},
//                             "diagonalUp": {},
//                             "horizontal": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             },
//                             "vertical": {
//                                 "lineStyle": "Single",
//                                 "lineWidth": 0.5
//                             }
//                         },
//                         "shading": {},
//                         "topMargin": 0,
//                         "rightMargin": 5.4,
//                         "leftMargin": 5.4,
//                         "bottomMargin": 0,
//                         "preferredWidthType": "Auto"
//                     },
//                     "columnCount": 2
//                 },
//                 {
//                     "paragraphFormat": {},
//                     "characterFormat": {},
//                     "inlines": [
//                         {
//                             "characterFormat": {},
//                             "text": ""
//                         }
//                     ]
//                 }
//             ],
//             "headersFooters": {},
//             "sectionFormat": {
//                 "headerDistance": 36.0,
//                 "footerDistance": 36.0,
//                 "pageWidth": 612.0,
//                 "pageHeight": 792.0,
//                 "leftMargin": 72.0,
//                 "rightMargin": 72.0,
//                 "topMargin": 72.0,
//                 "bottomMargin": 72.0,
//                 "differentFirstPage": false,
//                 "differentOddAndEvenPages": false,
//                 "bidi": false
//             }
//         }
//     ],
//     "characterFormat": {
//         "bold": false,
//         "italic": false,
//         "fontSize": 10,
//         "fontFamily": "Arial",
//         "underline": "None",
//         "strikethrough": "None",
//         "baselineAlignment": "Normal",
//         "highlightColor": "NoColor",
//         "fontColor": "#000000",
//         "fontSizeBidi": 10,
//         "fontFamilyBidi": "Arial"
//     },
//     "paragraphFormat": {
//         "leftIndent": 0,
//         "rightIndent": 0,
//         "firstLineIndent": 0,
//         "textAlignment": "Left",
//         "beforeSpacing": 0,
//         "afterSpacing": 0,
//         "lineSpacing": 1,
//         "lineSpacingType": "Multiple",
//         "listFormat": {},
//         "bidi": false
//     },
//     "defaultTabWidth": 36,
//     "styles": [
//         {
//             "name": "Normal",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0,
//                 "lineSpacing": 1.15,
//                 "lineSpacingType": "Multiple",
//                 "listFormat": {},
//                 "bidi": false
//             },
//             "characterFormat": {
//                 "bold": false,
//                 "italic": false,
//                 "fontSize": 10,
//                 "fontFamily": "Arial",
//                 "underline": "None",
//                 "strikethrough": "None",
//                 "baselineAlignment": "Normal",
//                 "highlightColor": "NoColor",
//                 "fontColor": "#000000",
//                 "fontSizeBidi": 10,
//                 "fontFamilyBidi": "Arial"
//             },
//             "next": "Normal"
//         },
//         {
//             "name": "Notes",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0,
//                 "lineSpacing": 1.15,
//                 "lineSpacingType": "Multiple",
//                 "listFormat": {},
//                 "bidi": false
//             },
//             "characterFormat": {
//                 "bold": false,
//                 "italic": true,
//                 "fontSize": 9,
//                 "fontFamily": "Arial",
//                 "underline": "None",
//                 "strikethrough": "None",
//                 "baselineAlignment": "Normal",
//                 "highlightColor": "NoColor",
//                 "fontColor": "#000000",
//                 "fontSizeBidi": 9,
//                 "fontFamilyBidi": "Arial",
//                 "bidi": false
//             },
//             "next": "Notes"
//         },
//         {
//             "name": "Restricted Editing",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0,
//                 "lineSpacing": 0,
//                 "lineSpacingType": "Multiple",
//                 "listFormat": {},
//                 "bidi": false
//             },
//             "characterFormat": {
//                 "bold": false,
//                 "italic": false,
//                 "fontSize": 1,
//                 "fontFamily": "Arial",
//                 "underline": "None",
//                 "strikethrough": "None",
//                 "baselineAlignment": "Normal",
//                 "highlightColor": "NoColor",
//                 "fontColor": "#000000FF",
//                 "fontSizeBidi": 1,
//                 "fontFamilyBidi": "Arial"
//             },
//             "basedOn": "Normal",
//             "next": "Restricted Editing"
//         },
//         {
//             "name": "Section Title",
//             "type": "Paragraph",
//             "paragraphFormat": {
//                 "leftIndent": 0,
//                 "rightIndent": 0,
//                 "firstLineIndent": 0,
//                 "textAlignment": "Left",
//                 "beforeSpacing": 0,
//                 "afterSpacing": 0.2,
//                 "lineSpacing": 1,
//                 "lineSpacingType": "Multiple",
//                 "outlineLevel": "BodyText",
//                 "listFormat": {},
//                 "bidi": false,
//                 "contextualSpacing": false
//             },
//             "characterFormat": {
//                 "bold": true,
//                 "italic": false,
//                 "fontSize": 12,
//                 "fontFamily": "Arial",
//                 "strikethrough": "None",
//                 "fontColor": "#FFFFFFFF",
//                 "bidi": false,
//                 "fontSizeBidi": 12,
//                 "fontFamilyBidi": "Arial"
//             },
//             "basedOn": "Normal",
//             "next": "Section Title"
//         },
//         {
//             "name": "Notes Index",
//             "type": "Paragraph",
//             "paragraphFormat": {},
//             "characterFormat": {
//                 "baselineAlignment": "Superscript"
//             },
//             "basedOn": "Normal",
//             "next": "Normal"
//         }
//     ],
//     "lists": [
//         {
//             "abstractListId": 0,
//             "listId": 0
//         }
//     ],
//     "abstractLists": [
//         {
//             "abstractListId": 0,
//             "levels": [
//                 {
//                     "characterFormat": {
//                         "bold": false,
//                         "italic": true,
//                         "fontSize": 9,
//                         "fontFamily": "Arial",
//                         "underline": "None",
//                         "strikethrough": "None",
//                         "baselineAlignment": "Normal",
//                         "highlightColor": "NoColor",
//                         "fontColor": "#000000",
//                         "fontSizeBidi": 9,
//                         "fontFamilyBidi": "Arial",
//                         "bidi": false
//                     },
//                     "paragraphFormat": {
//                         "leftIndent": 0,
//                         "firstLineIndent": -18,
//                         "listFormat": {}
//                     },
//                     "followCharacter": "Tab",
//                     "listLevelPattern": "Arabic",
//                     "numberFormat": "%1.",
//                     "restartLevel": 0,
//                     "startAt": 1
//                 }
//             ]
//         }
//     ],
//     "comments": [],
//     "enforcement": true,
//     "hashValue": "0A6BRhgb7C35JUaau8qeETWxzp4O8TjjGorpxLEPw38dZLWfkB///MlunuZDLzDzBHhdK1B2nMyusb0+do6hSQ==",
//     "saltValue": "ij25cMkkS+M/f5fyEQEFdQ==",
//     "formatting": false,
//     "protectionType": "ReadOnly"
// };

// describe('Delete inside restricked content', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         document.body.innerHTML = '';
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection, EditorHistory);
//         editor = new DocumentEditor({
//             enableEditor: true, isReadOnly: false, enableEditorHistory: true,
//             documentEditorSettings: { formFieldSettings: { formFillingMode: 'Inline' } }
//         });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//         editor.open(JSON.stringify(restrictData));
//         editor.selection.isHighlightEditRegion = true;
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });
//     it('Delete', () => {
//         editor.selection.select("0;4;0;1;0;2", "0;4;0;1;0;2");
//         editor.editor.delete();
//         expect(editor.selection.start.currentWidget.children.length).toBe(3);
//         editor.editor.delete();
//         expect(editor.selection.start.currentWidget.children.length).toBe(3);
//     });
//     it('Enter inside restricted area', () => {

//         editor.editor.onEnter();
//         editor.selection.select("0;4;0;1;0;2", "0;4;0;1;0;2");
//         expect(() => { editor.editor.delete(); }).not.toThrowError();
//     });
// });

/**
 * Restrict editing selection and edit region validation
 */
describe('Restrict editing rown and column protection validation', () => {
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
        editor.open(getRowAndColumnProtectedDocument());
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
    it('Validate row protection', () => {
        console.log('Validate row protection');
        editor.selection.select('0;1;0;0;0;0', '0;1;0;0;0;0');
        let rowCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length;
        let columnCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.columns.length;


        for (let i: number = 1; i < (rowCount * columnCount) - 1; i++) {
            let selectedCell: TableCellWidget = editor.selection.start.paragraph.associatedCell;
            if (selectedCell.ownerRow.index == 1) {
                expect(editor.isReadOnlyMode).toBe(false);
            } else {
                expect(editor.isReadOnlyMode).toBe(true);
            }
            (editor.selection as any).selectNextCell()
        }
    });
    it('Validate column protection', () => {
        console.log('Validate column protection');
        editor.selection.select('0;4;0;0;0;0', '0;4;0;0;0;0');
        let rowCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length;
        let columnCount: number = editor.selection.start.paragraph.associatedCell.ownerTable.tableHolder.columns.length;

        for (let i: number = 1; i < (rowCount * columnCount) - 1; i++) {
            let selectedCell: TableCellWidget = editor.selection.start.paragraph.associatedCell;
            if (selectedCell.index == 1) {
                expect(editor.isReadOnlyMode).toBe(false);
            } else {
                expect(editor.isReadOnlyMode).toBe(true);
            }
            (editor.selection as any).selectNextCell()
        }
    });
});

function getRowAndColumnProtectedDocument(): string {
    let protectedDocument: any = { "sections": [{ "blocks": [{ "inlines": [{ "text": "Row" }, { "text": " protection" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "885525315", "columnFirst": 0, "columnLast": 0, "group": "everyone" }, { "editRangeId": "1348348698", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "editRangeId": "2071688626", "columnFirst": 2, "columnLast": 2, "group": "everyone" }, { "editRangeId": "1071409844", "columnFirst": 3, "columnLast": 3, "group": "everyone" }, { "text": "Editable Cell " }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell " }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell " }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell " }, { "editRangeId": "885525315", "editableRangeStart": { "editRangeId": "885525315", "columnFirst": 0, "columnLast": 0, "group": "everyone" } }, { "editRangeId": "1348348698", "editableRangeStart": { "editRangeId": "1348348698", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }, { "editRangeId": "2071688626", "editableRangeStart": { "editRangeId": "2071688626", "columnFirst": 2, "columnLast": 2, "group": "everyone" } }, { "editRangeId": "1071409844", "editableRangeStart": { "editRangeId": "1071409844", "columnFirst": 3, "columnLast": 3, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }, { "inlines": [] }, { "inlines": [{ "text": "Column protection" }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "1147156371", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "1708872778", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "editRangeId": "1147156371", "editableRangeStart": { "editRangeId": "1147156371", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }, { "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "inlines": [{ "editRangeId": "1261197102", "columnFirst": 1, "columnLast": 1, "group": "everyone" }, { "editRangeId": "1708872778", "editableRangeStart": { "editRangeId": "1708872778", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }, { "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 124.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 124.25 } }, { "blocks": [{ "inlines": [{ "text": "Editable Cell" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 121.94999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 121.94999694824219 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }, { "blocks": [{ "inlines": [{ "text": "Protected Cell:" }, { "editRangeId": "1261197102", "editableRangeStart": { "editRangeId": "1261197102", "columnFirst": 1, "columnLast": 1, "group": "everyone" } }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 110.6500015258789, "preferredWidthType": "Point", "verticalAlignment": "Top", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "cellWidth": 110.6500015258789 } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#000000FF" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": false, "horizontalPositionAbs": "Left", "horizontalPosition": 0.0 } }, { "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "characterFormat": { "fontSize": 14.0, "fontSizeBidi": 14.0 }, "paragraphFormat": { "textAlignment": "Center", "styleName": "Header" }, "inlines": [{ "text": "Protected Cells ", "characterFormat": { "fontSize": 14.0, "fontSizeBidi": 14.0 } }] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false, "restartPageNumbering": false, "pageStartingNumber": 0, "endnoteNumberFormat": "LowerCaseRoman", "footNoteNumberFormat": "Arabic", "restartIndexForFootnotes": "DoNotRestart", "restartIndexForEndnotes": "DoNotRestart", "columns": { "column": [{ "width": 468.0, "space": 36.0 }], "numberOfColumns": 1, "equalWidth": true } } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "next": "Header", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "next": "Footer", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }], "defaultTabWidth": 36.0, "formatting": false, "trackChanges": false, "protectionType": "ReadOnly", "enforcement": true, "cryptProviderType": "rsaFull", "cryptAlgorithmClass": "hash", "cryptAlgorithmType": "typeAny", "cryptAlgorithmSid": "4", "cryptSpinCount": "100000", "dontUseHTMLParagraphAutoSpacing": false, "alignTablesRowByRow": false, "formFieldShading": true, "footnotes": { "separator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0004" }] }], "continuationNotice": [{ "inlines": [] }] }, "endnotes": { "separator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" }, "inlines": [{ "text": "\\u0004" }] }], "continuationNotice": [{ "inlines": [] }] }, "compatibilityMode": "Word2013" };
    return JSON.stringify(protectedDocument);
}