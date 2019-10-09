/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,FontDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,FontDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableFontDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog("Font");