/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,ParagraphDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,ParagraphDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableParagraphDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('Paragraph');