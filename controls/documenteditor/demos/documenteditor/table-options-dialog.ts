/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection, TableOptionsDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,TableOptionsDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableTableOptionsDialog:true
});

documenteditor.appendTo('#container');

documenteditor.editor.insertTable(2,2);
documenteditor.showDialog('TableOptions');