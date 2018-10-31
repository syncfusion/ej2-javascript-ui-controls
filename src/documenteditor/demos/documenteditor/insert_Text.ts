/**
 * DocumentEditor Default Sample
 */
import { DocumentEditor } from '../../src/document-editor/document-editor';
/* tslint:disable */
/**
 *  Toolbar sample to demonstrate default functionalities.
 */
import { Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Slider, SliderChangeEventArgs } from '@syncfusion/ej2-inputs';
import { Editor, Selection } from '../../src/index';

DocumentEditor.Inject(Editor, Selection)
let documenteditor: DocumentEditor = new DocumentEditor({
    isReadOnly: false, enableSelection: true
});

documenteditor.appendTo('#container');

documenteditor.editorModule.insertText('Adventure Works Cycles', false);