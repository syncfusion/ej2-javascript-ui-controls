/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection } from '../../src/index';

DocumentEditor.Inject(Editor, Selection)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true
});

documenteditor.appendTo('#container');

documenteditor.editor.insertText('Adventure Works Cycles', false);