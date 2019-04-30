/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
import { Editor, Selection,BordersAndShadingDialog } from '../../src/index';

DocumentEditor.Inject(Editor, Selection,BordersAndShadingDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true,enableEditor:true,enableBordersAndShadingDialog:true
});

documenteditor.appendTo('#container');
documenteditor.editor.insertTable(2,2);
documenteditor.showDialog('BordersAndShading');