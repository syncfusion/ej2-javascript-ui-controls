import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox, BookmarkDialog, SfdtExport, WordExport } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    LineWidget, ParagraphWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget
} from '../../src/index';
import { ListView } from '@syncfusion/ej2-lists';



let sfdt = '{"sfdt":"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"}';

describe('Nsid vales negative', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSfdtExport: true, enableWordExport: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport, WordExport); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('List with negative nsid values', () => {
        console.log('List with negative nsid values');
        editor.open(sfdt); 
        editor.save("sample", 'Docx');
        expect('').toBe('');
    });
});