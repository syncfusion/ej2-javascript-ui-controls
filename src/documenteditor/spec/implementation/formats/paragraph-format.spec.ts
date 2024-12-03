import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { TestHelper } from '../../test-helper.spec';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { BodyWidget, DocumentHelper, Page, ParagraphWidget } from '../../../src/index';
/**
 * Paragraph format spec
 */
describe('Paragraph Validation Testing', () => {
    afterEach(() => {
        WParagraphFormat.clear();
        WListFormat.clear();
    });
    it('Copy format setting  Testing', () => {
        console.log('Copy format setting  Testing');
        let para: WListFormat = new WListFormat();
        para.listLevelNumber = 20;
        expect('').toBe('');
    });
    it('Copy format Testing', () => {
        console.log('Copy format Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        let para1: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(para1);
        expect('').toBe('');
    });
    it('Copy format undefined Testing', () => {
        console.log('Copy format undefined Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(undefined);
        expect('').toBe('');
    });
    it('Clone format Testing', () => {
        console.log('Clone format Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        para.cloneFormat();
        expect('').toBe('');
    });
    it('destroy Testing', () => {
        console.log('destroy Testing');
        let para: WParagraphFormat = new WParagraphFormat();
        para.destroy();
        para.cloneFormat();
        expect(() => { para.destroy() }).not.toThrowError();
    });
    it('Clear Format validation', () => {
        console.log('Clear Format validation');
        let format: WParagraphFormat = new WParagraphFormat();
        format.leftIndent = 10;
        format.rightIndent = 12;
        format.afterSpacing = 10;
        format.listFormat.listId = 1;
        format.listFormat.listLevelNumber = 0;
        format.clearFormat();
        expect((format as any).uniqueParagraphFormat).toBeUndefined();
        expect(format.leftIndent).toBe(0);
        expect(format.rightIndent).toBe(0);
        expect(format.listFormat.listId).toBe(-1);
    });
    it('Text alignment right valdiation', () => {
        console.log('Text alignment right valdiation');
        let format: WParagraphFormat = new WParagraphFormat();
        format.textAlignment = 'Right';
        format.bidi = true;
        expect(format.textAlignment).toBe("Left");
    });
    it('style property default value', () => {
        console.log('style property default value');
        expect((WParagraphFormat as any).getPropertyDefaultValue('styleName')).toBe('Normal');
    });
});


describe('Default Paragraph Format API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        let defaultParagraphFormat: object = {
            leftIndent: 30,
            afterSpacing: 20,
            textAlignment: 'Center'
        }
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        //setDefaultParagraphFormat API
        editor.setDefaultParagraphFormat(defaultParagraphFormat);
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });

    it('Check Text Alignment is center', () => {
        console.log('Check Text Alignment is center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
});

describe('Checking AutoSpacing value is appending or not', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
    it('Return true if spaceBeforeAuto  is set to false', () => {
        console.log('spaceBeforeAuto');
        editor.editor.insertText('In 2000, Adventure Works Cycles bought a small manufacturing plant, Importadores Neptuno, located in Mexico. Importadores Neptuno manufactures several critical subcomponents for the Adventure Works Cycles product line. These subcomponents are shipped to the Bothell location for final product assembly.');
        expect(editor.documentHelper.paragraphFormat.spaceBeforeAuto).toBe(false);
    });
    it('Return true if spaceAfterAuto  is set to false', () => {
        console.log('spaceAfterAuto');
        expect(editor.documentHelper.paragraphFormat.spaceAfterAuto).toBe(false);
    });
    it('Return true if spaceAfterAuto value is set to true', () => {
        console.log('spaceAfterAuto');
        editor.documentHelper.paragraphFormat.spaceAfterAuto = true;
        expect(editor.documentHelper.paragraphFormat.spaceAfterAuto).toBe(true);
    });
    it('Return true if spaceBeforeAuto value is set to true', () => {
        console.log('spaceBeforeAuto');
        editor.documentHelper.paragraphFormat.spaceBeforeAuto = true;
        expect(editor.documentHelper.paragraphFormat.spaceBeforeAuto).toBe(true);
    });
    it('Return true if the spaceAfterAuto value is set to false', () => {
        console.log('spaceAfterAuto');
        editor.documentHelper.paragraphFormat.spaceAfterAuto = false;
        expect(editor.documentHelper.paragraphFormat.spaceAfterAuto).toBe(false);
    });
    it('Return true if the spaceBeforeAuto value is set to false', () => {
        console.log('spaceBeforeAuto');
        editor.documentHelper.paragraphFormat.spaceBeforeAuto = false;
        expect(editor.documentHelper.paragraphFormat.spaceBeforeAuto).toBe(false);
    });
});

describe('Assign the paragraph formatting', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Assign the paragraph formatting', function () {
        console.log('Assign the paragraph formatting');
        let sourceFormat = new WParagraphFormat();
        let destFormat = new WParagraphFormat();
        destFormat.leftIndent = 36;
        destFormat.rightIndent = 36;
        destFormat.firstLineIndent = 36;
        destFormat.beforeSpacing = 36;
        destFormat.afterSpacing = 36;
        destFormat.spaceBeforeAuto = true;
        destFormat.spaceAfterAuto = true;
        destFormat.lineSpacing = 1.15;
        destFormat.lineSpacingType = 'AtLeast';
        destFormat.textAlignment = 'Center';
        destFormat.outlineLevel = 'Level1';
        destFormat.bidi = true;
        destFormat.contextualSpacing = true;
        destFormat.keepWithNext = true;
        destFormat.keepLinesTogether = true;
        destFormat.widowControl = true;
        sourceFormat.assignFormat(destFormat);
        expect(sourceFormat.leftIndent).toBe(36);
        expect(sourceFormat.rightIndent).toBe(36);
        expect(sourceFormat.firstLineIndent).toBe(36);
        expect(sourceFormat.beforeSpacing).toBe(36);
        expect(sourceFormat.afterSpacing).toBe(36);
        expect(sourceFormat.spaceBeforeAuto).toBe(true);
        expect(sourceFormat.spaceAfterAuto).toBe(true);
        expect(sourceFormat.lineSpacing).toBe(1.15);
        expect(sourceFormat.lineSpacingType).toBe('AtLeast');
        expect(sourceFormat.textAlignment).toBe('Center');
        expect(sourceFormat.outlineLevel).toBe('Level1');
        expect(sourceFormat.bidi).toBe(true);
        expect(sourceFormat.contextualSpacing).toBe(true);
        expect(sourceFormat.keepWithNext).toBe(true);
        expect(sourceFormat.keepLinesTogether).toBe(true);
        expect(sourceFormat.widowControl).toBe(true);
    });
});