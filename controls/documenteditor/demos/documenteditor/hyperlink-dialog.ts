/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */

import { Editor, HyperlinkDialog,Selection } from '../../src/index';
DocumentEditor.Inject(Editor,Selection,HyperlinkDialog)
let documenteditor: DocumentEditor = new DocumentEditor({
  enableHyperlinkDialog:true,enableEditor:true,isReadOnly:false,enableSelection:true
});

documenteditor.appendTo('#container');
documenteditor.showDialog('Hyperlink')