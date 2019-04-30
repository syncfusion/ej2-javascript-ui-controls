/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection ,PageSetupDialog} from '../../src/index';

DocumentEditor.Inject(Editor, Selection,PageSetupDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enablePageSetupDialog:true
});

documenteditor.appendTo('#container');

documenteditor.showDialog('PageSetup');