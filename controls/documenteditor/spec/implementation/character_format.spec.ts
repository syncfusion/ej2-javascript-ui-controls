import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, WParagraphFormat } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * setFieldInfo validation
 */
describe('Field insertion in LTR and RTL document', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
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
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert field in the LTR text', function () {
        console.log('insert field in empty paragraph');
        container.openBlank();
        container.selection.selectAll();
        container.selection.characterFormat.fontFamily='Calibri';
        container.selection.characterFormat.fontSize = 18;
        container.selection.characterFormat.fontColor='#2E74B5FF';
        container.editor.insertTable();
        container.editor.insertText('\v');
        container.editor.insertBookmark('AAAA');
        container.editor.insertTable(1, 2);
        container.selection.selectCell();
        container.editor.insertField('FIELD \\MERGEFORMAT', 'AAAA');
        container.selection.select('0;0;0;0;1;0;0;0;22','0;0;0;0;1;0;0;0;22');
        expect(container.selection.characterFormat.fontFamily).toBe('Calibri');
        expect(container.selection.characterFormat.fontSize).toBe(18);
    });
    it('insert field in the RTL text', function () {
        console.log('insert field inside the arabic text');
        container.openBlank();
        container.selection.paragraphFormat.bidi = true;
        container.selection.characterFormat.bidi = true;
        container.selection.paragraphFormat.textAlignment="Right";
        container.editor.insertText('سشةحمث');
        container.selection.select('0;0;5', '0;0;5');
        container.editor.insertField('FIELD \\MERGEFORMAT', 'AAAA');
        container.selection.select('0;0;27', '0;0;27');
        expect(container.selection.characterFormat.fontFamily).toBe('Calibri');
        expect(container.selection.characterFormat.fontSize).toBe(11);
        expect(container.selection.characterFormat.bidi).toBe(false);
        container.selection.select('0;0;1', '0;0;1');
        expect(container.selection.characterFormat.bidi).toBe(true);
    });
    it('PasteContent API validation', function () {
        console.log('paste the copied text');
        container.openBlank();
        container.selection.selectAll();
        container.selection.characterFormat.fontFamily = 'Arial';
        container.selection.characterFormat.fontSize = 18;
        container.selection.characterFormat.fontColor = '#2E74B5FF';
        let text: string = 'Syncfusion Software';
        let paragraphFormat: WParagraphFormat = container.selection.start.paragraph.paragraphFormat;
        container.editor.pasteContents(text, paragraphFormat);
        container.selection.select('0;0;1', '0;0;17');
        expect(container.selection.characterFormat.fontFamily).toBe('Arial');
        expect(container.selection.characterFormat.fontSize).toBe(18);
    });
 
});

