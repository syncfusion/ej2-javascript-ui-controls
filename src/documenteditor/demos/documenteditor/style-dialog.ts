/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection, StyleDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,StyleDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableStyleDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('Style');