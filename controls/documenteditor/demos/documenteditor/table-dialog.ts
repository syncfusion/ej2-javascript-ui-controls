/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,TableDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,TableDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableTableDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('Table');