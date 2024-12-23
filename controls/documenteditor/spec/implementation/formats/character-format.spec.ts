import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../../src/index';
import { Selection, SfdtExport } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
/**
 * Character format spec
 */
describe('Character Format Testing', () => {
    afterEach(() => {
        WCharacterFormat.clear();
    });
    it('Copy Format Testing', () => {
console.log('Copy Format Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        let charFormat1: WCharacterFormat = new WCharacterFormat();
        charFormat.bold = true;
        charFormat.fontSize = 12;
        charFormat1.copyFormat(charFormat);
        expect(charFormat1.fontSize).toBe(12);
    });
    it('Copy Format undefined Testing', () => {
console.log('Copy Format undefined Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.copyFormat(undefined);
    });
    it('destroy Testing', () => {
console.log('destroy Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.destroy();
        charFormat.cloneFormat();
        expect(() => { charFormat.destroy() }).not.toThrowError();
    });
    it('Clone Format Testing', () => {
console.log('Clone Format Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.cloneFormat();
    });
    it('Character Format Equal Format Testing', () => {
console.log('Character Format Equal Format Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.isEqualFormat(charFormat);
        expect(charFormat.bold).toBe(false);
    });
    it('Default Value Testing', () => {
console.log('Default Value Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        expect(charFormat.bold).toBe(false);
    });
    it('set Property Value Testing', () => {
console.log('set Property Value Testing');
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.bold = undefined;
        expect(charFormat.bold).toBe(false);
    });
    it('Clear Format validation', () => {
console.log('Clear Format validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.bold = true;
        characterFormat.italic = true;
        characterFormat.fontSize = 12;
        characterFormat.clearFormat();
        expect((characterFormat as any).uniqueCharacterFormat).toBeUndefined();
        expect(characterFormat.bold).toBe(false);
        expect(characterFormat.italic).toBe(false);
    });

    it('Character format Boldbidi validation', () => {
console.log('Character format Boldbidi validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.boldBidi = true;
        expect(characterFormat.boldBidi).toBe(true);
    });
    it('Character format Italicbidi validation', () => {
console.log('Character format Italicbidi validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.italicBidi = true;
        expect(characterFormat.italicBidi).toBe(true);
    });
    it('Character format FontFamily validation', () => {
console.log('Character format FontFamily validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.fontFamilyBidi = 'Arial';
        expect(characterFormat.fontFamilyBidi).toBe('Arial');
    });
    it('Character format FontSize validation', () => {
console.log('Character format FontSize validation');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.fontSizeBidi = 22;
        expect(characterFormat.fontSizeBidi).toBe(22);
    });
    it('Default value validation of bidi properties', () => {
console.log('Default value validation of bidi properties');
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        expect(characterFormat.boldBidi).toBe(false);
        expect(characterFormat.italicBidi).toBe(false);
        expect(characterFormat.fontSizeBidi).toBe(11);
        expect(characterFormat.fontFamilyBidi).toBe('Calibri');
    });
});


describe('Default Character Format API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        let defaultCharacterFormat: object = {
            bold: true,
            italic: false,
            baselineAlignment: 'Normal',
            underline: 'Single',
            fontColor: "#000000",
            fontFamily: 'Times New Roman',
            fontSize: 8
        }
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        //setDefaultCharacterFormat API
        editor.setDefaultCharacterFormat(defaultCharacterFormat);
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });

    it('Check bold is true', () => {
console.log('Check bold is true');
        expect(editor.selection.start.paragraph.characterFormat.bold).toBe(true);
    });
});
describe('Check the characterFormat for arbic format apply', () => {
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
    it('Check the arbic fontFamily ', function () {
        console.log('apply the font family for arial');
        container.openBlank();
        container.editor.insertText("اثممخ");
        container.selection.select('0;0;0','0;0;4');
        container.editorModule.onApplyCharacterFormat('fontFamily','Arial');
        expect(container.selection.characterFormat.fontFamilyBidi).toBe('Arial');
    });
});

describe('Assign the character formatting', () => {
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
    it('Assign the character formatting', function () {
        console.log('Assign the character formatting');
        let sourceFormat = new WCharacterFormat();
        let destFormat = new WCharacterFormat();
        destFormat.fontFamily = 'Arial';
        destFormat.fontSize = 15;
        destFormat.bidi = true;
        destFormat.fontColor = '#b71c1c';
        destFormat.bold = true;
        destFormat.scaling = 1.5;
        destFormat.italic = true;
        destFormat.underline = 'Single';
        destFormat.strikethrough = 'SingleStrike';
        destFormat.highlightColor = 'DarkBlue';
        destFormat.baselineAlignment = 'Subscript';
        destFormat.characterSpacing = 1;
        destFormat.bdo = 'RTL';
        destFormat.complexScript = true;
        destFormat.allCaps = true;
        destFormat.localeIdAscii = 15;
        destFormat.localeIdBidi = 15;
        destFormat.localeIdFarEast = 15;
        destFormat.fontFamilyBidi = 'Arial';
        destFormat.fontFamilyAscii = 'Arial';
        destFormat.fontFamilyFarEast = 'Arial';
        destFormat.fontFamilyNonFarEast = 'Arial';
        sourceFormat.assignFormat(destFormat);
        expect(sourceFormat.fontFamily).toBe('Arial');
        expect(sourceFormat.fontSize).toBe(15);
        expect(sourceFormat.bidi).toBe(true);
        expect(sourceFormat.fontColor).toBe('#b71c1c');
        expect(sourceFormat.bold).toBe(true);
        expect(sourceFormat.italic).toBe(true);
        expect(sourceFormat.scaling).toBe(1.5);
        expect(sourceFormat.underline).toBe('Single');
        expect(sourceFormat.strikethrough).toBe('SingleStrike');
        expect(sourceFormat.highlightColor).toBe('DarkBlue');
        expect(sourceFormat.baselineAlignment).toBe('Subscript');
        expect(sourceFormat.characterSpacing).toBe(1);
        expect(sourceFormat.bdo).toBe('RTL');
        expect(sourceFormat.complexScript).toBe(true);
        expect(sourceFormat.allCaps).toBe(true);
        expect(sourceFormat.localeIdAscii).toBe(15);
        expect(sourceFormat.localeIdBidi).toBe(15);
        expect(sourceFormat.fontFamilyBidi).toBe('Arial');
        expect(sourceFormat.fontFamilyAscii).toBe('Arial');
        expect(sourceFormat.fontFamilyFarEast).toBe('Arial');
        expect(sourceFormat.fontFamilyNonFarEast).toBe('Arial');
    });
});

describe('Apply bidi for the RTL text', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSelection: true });
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
    it('Apply bold for the RTL text', function () {
        console.log('Apply bold for the RTL text');
        container.selectionModule.paragraphFormat.textAlignment = 'Right';
        container.editorModule.insertText('اثممخ صخقمي');
        container.selectionModule.select('0;0;6', '0;0;11');
        container.selectionModule.characterFormat.bold = true;
        expect(container.selectionModule.characterFormat.bold).toBe(true);
        expect(container.selectionModule.characterFormat.boldBidi).toBe(true);
    });
    it('Apply italic for the RTL text', function () {
        console.log('Apply italic for the RTL text');
        container.selectionModule.characterFormat.italic = true;
        expect(container.selectionModule.characterFormat.italic).toBe(true);
        expect(container.selectionModule.characterFormat.italicBidi).toBe(true);
    });
    it('Apply font size for the RTL text', function () {
        console.log('Apply font size for the RTL text');
        container.selectionModule.characterFormat.fontSize = 20;
        expect(container.selectionModule.characterFormat.fontSize).toBe(20);
        expect(container.selectionModule.characterFormat.fontSizeBidi).toBe(20);
    });
});

describe('Applying the default Character Format to document', () => {
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
        container.setDefaultCharacterFormat({ fontSize: 14 });
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
    it('Applying the default font size to document', function () {
        console.log('Applying the default font size to document');
        container.openBlank();
        container.editor.insertText("Default font size")
        container.selection.selectAll();
        expect(container.selection.characterFormat.fontSize).toBe(14);
    });
});