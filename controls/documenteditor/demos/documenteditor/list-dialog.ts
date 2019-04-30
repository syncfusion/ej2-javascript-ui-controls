/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,ListDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,ListDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableListDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('List');