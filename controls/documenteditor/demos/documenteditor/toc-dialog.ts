/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,TableOfContentsDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,TableOfContentsDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableTableOfContentsDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('TableOfContents')