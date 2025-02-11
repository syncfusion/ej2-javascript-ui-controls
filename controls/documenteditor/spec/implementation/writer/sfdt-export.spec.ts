import { createElement } from "@syncfusion/ej2-base";
import { Editor, ParagraphWidget, WordExport, LineWidget } from "../../../src/index";
import { DocumentEditor  } from "../../../src/document-editor/document-editor";
import { TestHelper } from "../../test-helper.spec";
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../../src/index';
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';

describe('Sfdt Export auto spacing properties', () => {
    let editor : DocumentEditor;
    beforeAll(() : void => {
        let ele : HTMLElement = createElement('div', { id : 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true , enableWordExport: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport, WordExport);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll(() : void => {
        if(editor){
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it("Check value is true", () => {
        editor.openBlank();
        editor.selection.start.paragraph.paragraphFormat.spaceBeforeAuto = true;
        editor.selection.start.paragraph.paragraphFormat.spaceAfterAuto = true;
        let paragraphFormat : any = (editor.sfdtExportModule as any).writeParagraphFormat(editor.selection.start.paragraph.paragraphFormat);
        expect(paragraphFormat.spaceBeforeAuto).toEqual(true);
        expect(paragraphFormat.spaceAfterAuto).toEqual(true);
    });
    it("Check value is false", () => {
        editor.openBlank();
        editor.selection.start.paragraph.paragraphFormat.spaceBeforeAuto = false;
        editor.selection.start.paragraph.paragraphFormat.spaceAfterAuto = false;
        let paragraphFormat : any = (editor.sfdtExportModule as any).writeParagraphFormat(editor.selection.start.paragraph.paragraphFormat);
        expect(paragraphFormat.spaceBeforeAuto).toEqual(false);
        expect(paragraphFormat.spaceAfterAuto).toEqual(false);
    });
    it("Check value is null or undefined", () => {
        editor.openBlank();
        let paragraphFormat : any = (editor.sfdtExportModule as any).writeParagraphFormat(editor.selection.start.paragraph.paragraphFormat);
        expect(paragraphFormat.spaceBeforeAuto).toEqual(undefined);
        expect(paragraphFormat.spaceAfterAuto).toEqual(undefined);
    });
    it('Dotx -validation', () => {
        console.log('Dotx -validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        expect(() => { editor.save('Sample','Docx'); }).not.toThrowError();
    });
    it('Dotx  save as blob-validation', () => {
        console.log('Dotx - save as blob validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        expect(() => { editor.saveAsBlob('Dotx') }).not.toThrowError();
    });
})
describe('Check that the text with the same character format is combined correctly', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport, WordExport);
        editor.documentEditorSettings.optimizeSfdt = false;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it("Check that the text with the same character format is combined correctly", () => {
        editor.openBlank();
        editor.selection.paragraphFormat.textAlignment = 'Justify';
        editor.editorModule.insertText('$[Liability Limit Amount]');
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.length).toBe(3);
        let exportData: any = JSON.parse(editor.sfdtExportModule.serialize());
        expect(exportData.sections[0].blocks[0].inlines[0].text).toBe('$[Liability Limit Amount]');
    });
});

describe('Validate the bullet list symbol is not render issue on exported document', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport, WordExport);
        editor.documentEditorSettings.optimizeSfdt = false;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it("Validate the bullet list symbol is not render issue on exported document", () => {
        editor.openBlank();
        editor.editor.applyBullet(String.fromCharCode(61623), 'Symbol');
        editor.editor.insertText("List 1");
        editor.editor.onEnter();
        editor.editor.insertText("List 2");
        let exportData: any = JSON.parse(editor.sfdtExportModule.serialize());
        let characterFormat: any = exportData.abstractLists[0].levels[0].characterFormat;
        expect(characterFormat.fontFamily).toBe('Symbol');
        expect(characterFormat.fontFamilyAscii).toBe('Symbol');
        expect(characterFormat.fontFamilyNonFarEast).toBe('Symbol');
    });
});
describe('Ensure the minimal section content on exported sfdt document', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport, WordExport);
        editor.documentEditorSettings.optimizeSfdt = false;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it("Validate the minimal content if pages length is zero", () => {
        editor.openBlank();
        editor.documentHelper.pages = [];
        let exportData: any = JSON.parse(editor.sfdtExportModule.serialize());
        expect(exportData.sections.length).toBe(1);
    });
});
