
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TableWidget, FieldElementBox, TextFormField, ElementBox, WParagraphFormat, WCharacterFormat, HelperMethods, ContentControlWidgetType, ContentControlType, IWidget, TableRowWidget, DocumentHelper, Page, PageSetupDialog, SfdtExport } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { ImageResizer } from '../../src/document-editor/implementation/editor/image-resizer';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';

describe('Resolve inconsistent behaviour of text selection inside an editable table cell within a read only document', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      editor = new DocumentEditor({isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true,height:"800px"});
      editor = new DocumentEditor({ isReadOnly: false,height:"800px" });
      editor.enableAllModules();
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
    it('Protection inside table checking', () => {
      editor.editor.insertTable();
      editor.selection.selectTable();
      editor.editor.insertEditingRegion();
      editor.editor.insertText('s');
      editor.selection.selectTable();
     expect( editor.selection.text.indexOf('s')).toBe(0);
    });
  });