import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { DocumentHelper } from '../../../../../src/document-editor/implementation/viewer/viewer';
import { createElement} from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';
import { Editor } from '../../../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../../../../src/document-editor/implementation/selection/selection';
import { WordExport } from '../../../../../src/document-editor/implementation/writer/word-export';
import { SfdtExport } from '../../../../../src/document-editor/implementation/writer/sfdt-export';
import { BlockContainer, BlockWidget, BodyWidget, FieldElementBox, FieldInfo, FootNoteWidget, TextFormField } from '../../../../../src';


describe('Editor functions - 1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableComment: true});
        editor.enableAllModules();
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
    it('EditRangeElement with same table selection ', () => {
        console.log('EditRangeElement with same table selection ');
        editor.editor.insertText('Hello');
        editor.editor.onEnter();
        editor.editor.insertText('Hello');
        editor.editor.onEnter();
        editor.editor.insertTable(2,2);
        editor.editor.onEnter();
        editor.editor.insertText('Hello');
        editor.editor.onEnter();
        editor.editor.insertTable(2,2);
        editor.documentHelper.selection.select('0;2;0;0;0;1','0;2;0;1;0;1');
        editor.editor.insertEditRangeElement('Everyone');
        expect(editor.documentHelper.selection.caret.style.display).toBe('none');
     });
     it('Edit region with user', () => {
        console.log('Edit region with user');
        editor.editor.insertTable();
        editor.selection.selectTable();
        editor.editor.insertEditingRegion();
        editor.editor.insertText('s');
        editor.selection.selectTable();
       expect( editor.selection.text.indexOf('s')).toBe(0);
      });
      
     it('set field code and result Returns `undefined`for non-field', () => {
        console.log('set field code and result Returns `undefined`for non-field');
        editor.editorModule.setFieldInfo({ code: 'NUMPAGES  \\* Ordinal  \\* MERGEFORMAT', result: '1' });
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo).toBe(undefined);
    }); 
          
    it('Empty paragraph predict text', () => {
        console.log('Empty paragraph predict text');
        editor.selection.selectAll();
        editor.editor.predictText ();
        expect(editor.documentHelper.selection.caret.style.display).toBe('none');  
    });
});
describe('Editor functions styles', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableComment: true});
        editor.enableAllModules();
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
    it('Character Styles  ', () => {
        var styleJson = {
            "type": "Character",
            "name": "New CharacterStyle",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontSize": 16.0,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496",
                "bold": true,
                "italic": true,
                "underline": "Single"
            }
        };
        editor.editor.createStyle(JSON.stringify(styleJson));
        editor.editor.insertText("hello");
        editor.selection.selectAll();
        editor.editorModule.applyStyle('New CharacterStyle',true);
        expect(editor.documentHelper.selection.characterFormat.bold).toBe(true);
     });
 });

 describe('Editor functions  delete Comments', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableComment: true});
        editor.enableAllModules();
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });
        it('Inserted two comments and deleted all comments', () => {
            console.log('Inserted two comments and deleted all comments');
            editor.editor.insertText('the first line is added for comment')
            editor.editor.insertComment('first comment');
            editor.selection.selectAll();
            editor.editor.insertComment('second comment');
            editor.editor.deleteAllComments();
            expect(editor.documentHelper.comments.length).toBe(0);
        });
        it('Inserted two comments and delete comment', () => {
            console.log('Inserted two comments and delete comment');
            editor.editor.insertText('the first line is added for comment')
            editor.editor.insertComment('first comment');
            editor.selection.selectAll();
            editor.editor.insertComment('second comment');
           editor.editor.deleteComment();
        expect(editor.documentHelper.comments.length).toBe(1);
        });
    });
