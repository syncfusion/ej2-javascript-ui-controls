/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection ,TablePropertiesDialog} from '../../src/index';

DocumentEditor.Inject(Editor, Selection,TablePropertiesDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableTablePropertiesDialog:true
});

documenteditor.appendTo('#container');
documenteditor.editor.insertTable(2,2);
documenteditor.showDialog('TableProperties');