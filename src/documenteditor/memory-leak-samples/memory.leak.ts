import { Dialog } from '@syncfusion/ej2-popups';
import { DocumentEditorContainer, Toolbar } from '../src/index';
import {defaultDocument, WEB_API_ACTION, insertedTrackchanges, deletedTrackchanges} from './data';
/**
 * Default document editor sample
 */

let dialogObj: Dialog= new Dialog({
    minHeight: 500,
    visible: false,
    enableResize: true,
    isModal: false,
    zIndex: 1500,
    position: { X: 'center', Y: 'center' }
  });
dialogObj.appendTo('#defaultDialog');

let hostUrl: string = 'https://services.syncfusion.com/js/production/api/documenteditor/';
let container: DocumentEditorContainer = new DocumentEditorContainer({ height:"90%", serviceUrl:hostUrl, enableToolbar: true , zIndex: 5000 , documentEditorSettings:{ showRuler: true}});
DocumentEditorContainer.Inject(Toolbar);
container.appendTo('#container'); 
container.documentEditor.open(JSON.stringify(defaultDocument));

document.getElementById("render").addEventListener('click', function () {
    renderDocumentEditor();
});
document.getElementById("destroy").addEventListener('click', function () {
    destroyDocumentEditor();
});

function renderDocumentEditor(){
    dialogObj.show();
}
function destroyDocumentEditor(){
    dialogObj.hide();
}

    





