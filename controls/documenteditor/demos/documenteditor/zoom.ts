/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Editor, Selection } from '../../src/index';

DocumentEditor.Inject(Editor, Selection)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true
});

documenteditor.appendTo('#container');

documenteditor.zoomFactor = 3;