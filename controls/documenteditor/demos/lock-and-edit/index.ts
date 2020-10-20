import { DocumentEditorContainer, CollaborativeEditingEventArgs, DocumentEditor } from '../../src/index';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { CollaborativeEditing } from '../../src/document-editor/implementation/editor/collaborative-editing';


let roomName: string = 'Track Changes.docx';
let serviceUrl: string = 'http://localhost:62869/';

DocumentEditorContainer.Inject(Toolbar);
DocumentEditor.Inject(CollaborativeEditing);

/**
 * Container component
 */
let container: DocumentEditorContainer = new DocumentEditorContainer({
    enableTrackChanges: true, height: "590px", created: loadDefaultDocument,
    showPropertiesPane: false, enableLockAndEdit: true,
    documentEditorSettings: {
        collaborativeEditingSettings: {
            roomName: roomName,
            editableRegionColor: 'green',
            lockedRegionColor: 'red',
            saveTimeout: 3000
        }
    }
});
container.serviceUrl = serviceUrl + 'api/DocumentEditor/';
container.appendTo('#container');

container.documentEditor.actionComplete = (args: any) => {
    connection.send('BroadcastData', args);
}

(window as any).container = container;
(window as any).collaborativeEditing = container.documentEditor.collaborativeEditingModule;


const signalR = (window as any).signalR;
// For signalR Hub connection
const connection = new signalR.HubConnectionBuilder().withUrl(serviceUrl + 'hubs/documenteditorhub', {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
}).withAutomaticReconnect().build();

(window as any).connection = connection;

connection.on('dataReceived', (data: CollaborativeEditingEventArgs) => {
    container.documentEditor.collaborativeEditingModule.updateAction(data);
});

connection.onreconnected((connectionId: string) => {
    console.assert(connection.state === signalR.HubConnectionState.Connected);
    container.documentEditor.collaborativeEditingModule.pullAction();
});

function start() {
    try {
        connection.start().then(() => {
            connection.send('JoinGroup', roomName);
            container.documentEditor.collaborativeEditingModule.pullAction();
        });
    } catch (err) {
        setTimeout(() => start(), 5000);
    }
}


function loadDefaultDocument(): void {
    let fileName: string = roomName;
    let httpRequest: XMLHttpRequest = new XMLHttpRequest();
    httpRequest.open('Post', serviceUrl + '/api/DocumentEditor/ImportFile', true);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 304) {
                container.documentEditor.open(httpRequest.responseText);
                setTimeout(() => {
                    start();
                });
            } else {
                alert('Fail to load the document');
            }
        }
    };
    container.documentEditor.documentName = fileName.substr(0, fileName.lastIndexOf('.'));
    httpRequest.send(JSON.stringify({ "fileName": fileName }));
}

let items: ItemModel[] = [
    {
        text: 'Anton Davolio',
        iconCss: 'e-ddb-icons e-dashboard'
    },
    {
        text: 'Leverling Michael',
        iconCss: 'e-ddb-icons e-notifications',
    },
    {
        text: 'Dodsworth Kathryn',
        iconCss: 'e-ddb-icons e-settings',
    },
    {
        text: 'Laura Buchanan',
        iconCss: 'e-ddb-icons e-logout'
    }];

let btnObj: DropDownButton = new DropDownButton({
    items: items, iconCss: 'e-ddb-icons e-profile', select: (args: MenuEventArgs) => {
        container.currentUser = args.item.text;
    }
});
btnObj.appendTo('#userButton');
