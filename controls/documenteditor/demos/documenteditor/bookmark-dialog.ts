/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,BookmarkDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,BookmarkDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableBookmarkDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('Bookmark')