import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { DocumentHelper } from '../../../../../src/document-editor/implementation/viewer/viewer';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../../test-helper.spec';
import { Editor } from '../../../../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../../../../src/document-editor/implementation/selection/selection';
import { WordExport } from '../../../../../src/document-editor/implementation/writer/word-export';
import { SfdtExport } from '../../../../../src/document-editor/implementation/writer/sfdt-export';
import { BlockContainer, BlockWidget, BodyWidget, FieldElementBox, FootNoteWidget, TextFormField } from '../../../../../src';


describe('Editor functions', () => {
  let editor: DocumentEditor;
  let documentHelper: DocumentHelper;
  beforeAll((): void => {
    document.body.appendChild(createElement('div', { id: 'container' }));
    DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
    editor = new DocumentEditor({ isReadOnly: false, enableComment: true });
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
      document.body.innerHTML = '';
      done();
    }, 1000);
  });
  it('Insert Footnote enter text after backspace validation', () => {
    console.log('Insert Footnote enter text after backspace validation');
    editor.editor.insertFootnote();
    editor.editor.insertText('one');
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.handleBackKey();
    editor.editor.insertText('two');
    let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
    expect(body.childWidgets.length).toBe(1);
  });
  it('Insert Footnote validation', () => {
    console.log('Insert Footnote validation');
    editor.editor.insertFootnote();
    editor.editor.insertText('one');
    editor.editor.handleEnterKey();
    let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
    expect((body.childWidgets[0] as BlockWidget).y < (body.childWidgets[1] as BlockWidget).y).toBe(true);
  });
  it('EditRangeElement validation', () => {
    console.log('EditRangeElement validation');
    // editor.openBlank();
    editor.editor.insertText('Hello');
    editor.documentHelper.selection.selectAll();
    editor.editor.insertEditRangeElement('Everyone');
    editor.documentHelper.selection.handleLeftKey();
    editor.documentHelper.selection.handleRightKey();
    editor.documentHelper.selection.handleRightKey();
    editor.documentHelper.selection.handleRightKey();
    editor.documentHelper.selection.handleRightKey();
    editor.documentHelper.selection.handleRightKey();
    editor.documentHelper.selection.handleRightKey();
    expect(editor.documentHelper.selection.caret.style.display).toBe('block');
  });
  it('Protection inside table checking', () => {
    console.log('Protection inside table checking');
    editor.editor.insertTable();
    editor.selection.selectTable();
    editor.editor.insertEditingRegion();
    editor.editor.insertText('s');
    editor.selection.selectTable();
    expect(editor.selection.text.indexOf('s')).toBe(0);
  });

  it('EditRangeElement paragraph and table validation', () => {
    console.log('EditRangeElement paragraph and table validation');
    // editor.openBlank();
    editor.editor.insertText('Hello');
    editor.editor.insertTable();
    editor.documentHelper.selection.selectAll();
    editor.editor.insertEditRangeElement('Everyone');
    expect(editor.documentHelper.selection.caret.style.display).toBe('none');

  });
  it('EditRangeElement paragraph and table validation with removeUserRestrictions', () => {
    console.log('EditRangeElement paragraph and table validation with removeUserRestrictions');
    // editor.openBlank();
    editor.editor.updateSelectionTextPosition(true);
    editor.editor.insertTable(2, 2);
    editor.editor.onEnter();
    editor.editor.insertText('Hello');
    editor.editor.onEnter();
    editor.editor.insertTable(2, 2);
    editor.documentHelper.selection.selectAll();
    editor.editor.insertEditRangeElement('Everyone');
    editor.editor.removeUserRestrictions('Everyone');
    expect(editor.documentHelper.selection.caret.style.display).toBe('none');
  });

  it('Enforce Protection', () => {
    console.log('Enforce Protection');
    //  editor.openBlank();
    editor.editorModule.insertText('Syncfusion Software');
    editor.selection.selectAll();
    editor.editorModule.enforceProtection('123', 'ReadOnly');
    editor.editorModule.stopProtection('123');
    expect(() => { editor.editorModule.stopProtection('123'); }).not.toThrowError();
  });
  it('Enforce Protection Async ', () => {
    console.log('Enforce Protection Async');
    //  editor.openBlank();
    editor.editorModule.insertText('Syncfusion Software');
    editor.selection.selectAll();
    editor.editorModule.enforceProtectionAsync('123', 'ReadOnly');
    expect(() => { editor.editorModule.stopProtectionAsync('123'); }).not.toThrowError();
  });


});