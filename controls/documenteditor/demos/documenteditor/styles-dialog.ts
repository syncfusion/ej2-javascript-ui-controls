/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,StyleDialog, StylesDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,StylesDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableStyleDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('Styles')