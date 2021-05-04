import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, SfdtExport, WordExport, ParagraphDialog, DocumentHelper } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { XmlWriter } from '@syncfusion/ej2-file-utils';

/**
 * Auto Convert List Test script
 */
let inline: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading 1" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Normal" }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading 1" }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading" }, { "text": " 1" }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading 1" }] }, { "paragraphFormat": { "styleName": "Heading 2" }, "inlines": [{ "text": "Headi" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": "ng 2" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Normal" }] }, { "paragraphFormat": { "styleName": "Heading 2" }, "inlines": [{ "text": "Heading 2" }] }, { "paragraphFormat": { "styleName": "Heading 2" }, "inlines": [{ "text": "Heading 2" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "styleName": "Header" }, "inlines": [{ "text": "Contextual Spacing in style" }] }] } }, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 12.0, "outlineLevel": "Level1", "contextualSpacing": true } }, { "type": "Paragraph", "name": "Heading 2", "basedOn": "Normal", "next": "Normal", "link": "Heading 2 Char", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13.0, "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 24.0, "afterSpacing": 24.0, "outlineLevel": "Level2", "contextualSpacing": true } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "next": "Normal", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 2 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13.0, "fontFamilyBidi": "Calibri Light" } }], "defaultTabWidth": 36.0 };
let direct: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading 1" }] }, { "paragraphFormat": { "afterSpacing": 12.0, "styleName": "Heading 1", "contextualSpacing": true }, "inlines": [{ "text": "Headi" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": "ng 1" }] }, { "paragraphFormat": { "styleName": "Heading 2" }, "inlines": [{ "text": "Heading 2" }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading 1" }] }, { "paragraphFormat": { "styleName": "Heading 1" }, "inlines": [{ "text": "Heading 1" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Paragraph", "name": "Heading 1", "basedOn": "Normal", "next": "Normal", "link": "Heading 1 Char", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 12.0, "afterSpacing": 0.0, "outlineLevel": "Level1" } }, { "type": "Paragraph", "name": "Heading 2", "basedOn": "Normal", "next": "Normal", "link": "Heading 2 Char", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13.0, "fontFamilyBidi": "Calibri Light" }, "paragraphFormat": { "beforeSpacing": 2.0, "afterSpacing": 0.0, "outlineLevel": "Level2" } }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Heading 1 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 16.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 16.0, "fontFamilyBidi": "Calibri Light" } }, { "type": "Character", "name": "Heading 2 Char", "basedOn": "Default Paragraph Font", "characterFormat": { "fontSize": 13.0, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13.0, "fontFamilyBidi": "Calibri Light" } }], "defaultTabWidth": 36.0 };
describe('Contextual spacing preservation validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
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
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('In inline style validation', () => {
console.log('In inline style validation');
        editor.open(JSON.stringify(inline));
    });
    it('direct spacing validation', () => {
console.log('direct spacing validation');
        editor.open(JSON.stringify(direct));
    });
});

describe('Contextual spacing preservation format retrieval validation in direct formatting', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(direct));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Contextual spacing is false', () => {
console.log('Contextual spacing is false');
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('Contextual spacing is true', () => {
console.log('Contextual spacing is true');
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(true);
    });
    it('combination of Contextual spacing is true', () => {
console.log('combination of Contextual spacing is true');
        editor.selection.handleShiftUpKey();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBeUndefined();
    });
});
describe('Contextual spacing preservation apply via selection format API validation in empty selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(direct));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Contextual spacing in empty selection', () => {
console.log('Contextual spacing in empty selection');
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.selection.paragraphFormat.contextualSpacing = false;
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('undo after Contextual spacing in empty selection', () => {
console.log('undo after Contextual spacing in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(true);
    });
    it('redo after Contextual spacing in empty selection', () => {
console.log('redo after Contextual spacing in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('redo after Multiple undo and redo Contextual spacing in empty selection', () => {
console.log('redo after Multiple undo and redo Contextual spacing in empty selection');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(true);
    });
});
describe('Contextual spacing preservation apply via selection format API validation with selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(direct));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Contextual spacing in selection', () => {
console.log('Contextual spacing in selection');
        editor.selection.selectAll();
        editor.selection.paragraphFormat.contextualSpacing = false;
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('undo after Contextual spacing in selection', () => {
console.log('undo after Contextual spacing in selection');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBeUndefined();
    });
    it('redo after Contextual spacing in selection', () => {
console.log('redo after Contextual spacing in selection');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('redo after Multiple undo and redo Contextual spacing in selection', () => {
console.log('redo after Multiple undo and redo Contextual spacing in selection');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBeUndefined();
    });
});
describe('Contextual spacing sfdt export validation in direct formatting', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true, enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(direct));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('export checking without error', () => {
console.log('export checking without error');
        expect(() => { editor.save('cs', 'Sfdt') }).not.toThrowError();
    });
    it('export with Contextual spacing', () => {
console.log('export with Contextual spacing');
        let write = editor.sfdtExportModule.write();
        expect(write.sections[0].blocks[1].paragraphFormat.contextualSpacing).toBe(true);
    });
    it('export without Contextual spacing', () => {
console.log('export without Contextual spacing');
        let write = editor.sfdtExportModule.write();
        expect(write.paragraphFormat.contextualSpacing).toBeUndefined();
    });
});

describe('Contextual spacing sfdt export validation in inline styles', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true, enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(inline));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('export checking without error', () => {
console.log('export checking without error');
        expect(() => { editor.save('cs_inline', 'Sfdt') }).not.toThrowError();
    });
    it('export with Contextual spacing', () => {
console.log('export with Contextual spacing');
        let write = editor.sfdtExportModule.write();
        expect(write.sections[0].blocks[0].paragraphFormat.contextualSpacing).toBeUndefined();
        expect(write.styles[1].paragraphFormat.contextualSpacing).toBe(true);
    });
});
describe('Contextual spacing word export validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, SfdtExport, WordExport);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true, enableSfdtExport: true, enableWordExport: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(direct));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('export checking without error', () => {
console.log('export checking without error');
        expect(() => { editor.save('cs', 'Docx') }).not.toThrowError();
    });
    it('export with Contextual spacing', () => {
console.log('export with Contextual spacing');
        let write = editor.sfdtExportModule.write();
        expect(write.sections[0].blocks[1].paragraphFormat.contextualSpacing).toBe(true);
        let writer: XmlWriter = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraphFormat(writer, write.sections[0].blocks[1].paragraphFormat, write.sections[0].blocks[1]);
        expect((writer as any).bufferText.indexOf('<w:contextualSpacing')).not.toBe(-1);
    });
    it('export with Contextual spacing as false', () => {
console.log('export with Contextual spacing as false');
        let write = editor.sfdtExportModule.write();
        write.sections[0].blocks[1].paragraphFormat.contextualSpacing = false;
        let writer: XmlWriter = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraphFormat(writer, write.sections[0].blocks[1].paragraphFormat, write.sections[0].blocks[1]);
        expect((writer as any).bufferText.indexOf('<w:contextualSpacing w:val="0"')).not.toBe(-1);
    });
    it('export with Contextual spacing as undefined', () => {
console.log('export with Contextual spacing as undefined');
        let write = editor.sfdtExportModule.write();
        expect(write.sections[0].blocks[1].paragraphFormat.contextualSpacing).toBe(true);
        let writer: XmlWriter = new XmlWriter();
        (editor.wordExportModule as any).serializeParagraphFormat(writer, write.sections[0].blocks[0].paragraphFormat, write.sections[0].blocks[1]);
        expect((writer as any).bufferText.indexOf('<w:contextualSpacing')).toBe(-1);
    });
});

describe('Contextual spacing apply validation using paragraph dialog', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    let dialog: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, ParagraphDialog);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableSelection: true, enableEditorHistory: true, enableParagraphDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(direct));
        dialog = editor.paragraphDialogModule;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('apply contextual spacing - 1', () => {
console.log('apply contextual spacing - 1');
        editor.paragraphDialogModule.show();
        let ele = document.getElementById(editor.containerId + '_contextSpacing')
        event = { checked: true, event: { currentTarget: ele } };
        dialog.contextSpacing.change(event);
        editor.paragraphDialogModule.applyParagraphFormat();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(true);
    });
    it('undo after contextual spacing - 1', () => {
console.log('undo after contextual spacing - 1');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('redo after contextual spacing - 1', () => {
console.log('redo after contextual spacing - 1');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(true);
    });
    it('apply contextual spacing - 2', () => {
console.log('apply contextual spacing - 2');
        editor.selection.handleDownKey();
        editor.selection.handleRightKey();
        editor.paragraphDialogModule.show();
        let ele = document.getElementById(editor.containerId + '_contextSpacing')
        event = { checked: false, event: { currentTarget: ele } };
        dialog.contextSpacing.change(event);
        editor.paragraphDialogModule.applyParagraphFormat();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
    it('undo after contextual spacing - 2', () => {
console.log('undo after contextual spacing - 2');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(true);
    });
    it('redo after contextual spacing - 2', () => {
console.log('redo after contextual spacing - 2');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.contextualSpacing).toBe(false);
    });
});
