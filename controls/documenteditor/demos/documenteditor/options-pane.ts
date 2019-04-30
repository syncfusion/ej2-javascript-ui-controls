/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,OptionsPane ,Search} from '../../src/index';

DocumentEditor.Inject(Editor, Selection,OptionsPane,Search)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableOptionsPane:true,enableSearch:true
});

documenteditor.appendTo('#container');

documenteditor.showOptionsPane();