import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor} from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Content control Spec
 */

describe('check apply content control', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('apply plain text content control', () => {
        console.log('apply plain text content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Text');
                expect(editor.documentHelper.contentControlCollection.length).toBe(1);
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Text');
            });
    it('apply Rich text content control', () => {
        console.log('apply rich text content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('RichText');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('RichText');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.contentControlListItems.length).toBe(0);
            });
    it('apply combo box  content control', () => {
        console.log('apply combo box content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('ComboBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('ComboBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.contentControlListItems.length).toBe(1);
            });
    it('apply drop down list content control', () => {
        console.log('apply drop down list content control');
                editor.openBlank();
                editor.editorModule.insertContentControl('DropDownList');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('DropDownList');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.hasPlaceHolderText).toBe(true);
            });
    it('apply check box content control', () => {
        console.log('apply check box content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('CheckBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('CheckBox');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(false);
            });
    it('apply date picker content control', () => {
        console.log('apply date picker content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Date','5/12/24');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Date');
            });
    it('apply picture content control', () => {
        console.log('apply picture content control');
                editor.openBlank();
                editor.editorModule.insertContentControl('Picture');
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.type).toBe('Picture');
            });
    it('check remove content control', () => {
        console.log('check remove content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('Text');
                expect(editor.documentHelper.contentControlCollection.length).toBe(1);
                editor.selection.handleLeftKey();
                editor.editorModule.removeContentControl();
                expect(editor.documentHelper.contentControlCollection.length).toBe(0);
            });
    it('check remove content control', () => {
        console.log('check remove content control');
                editor.openBlank();
                editor.editorModule.insertText('sample');
                editor.selection.selectAll();
                editor.editorModule.insertContentControl('CheckBox');
                editor.selection.handleLeftKey();
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(false);
                editor.editorModule.toggleContentControlCheckBox(editor.documentHelper.contentControlCollection[0]);
                expect(editor.documentHelper.contentControlCollection[0].contentControlProperties.isChecked).toBe(true);
            });
    it('validate text insertion after content control',()=>{
        console.log('insert text after content control');
        editor.openBlank();
        editor.editor.insertContentControl('RichText','Text inside CC');
        let count = editor.selection.start.currentWidget.children.length;
        editor.selection.select('0;0;17','0;0;17');
        editor.editor.insertText("Text after CC");
        expect(editor.selection.start.currentWidget.children.length > count).toBe(true);
    })
    });