[![coverage](http://ej2.syncfusion.com/badges/ej2-collaborator/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-collaborator)

# ej2-collaborator

A control-agnostic client package for real-time collaborative editing in Syncfusion EJ2 controls, including Document Editor, PDF Viewer, and Spreadsheet.

---

# Overview of the Package

`ej2-collaborator` provides a simplified architecture for connecting any EJ2 control to a collaboration-capable server. The same client works against two interchangeable real-time backends (both can use a Redis backplane for horizontal scale-out):

- **`CollaborationClient`** — Lifecycle owner (connect → join room → relay remote actions).
- **`ICollaborationProvider`** — Control-side adapter contract (provided by the common package; product teams only implement it).
- **`CollaborationConnection`** — Thin facade over a pluggable `ICollaborationTransport`.
- **`TransportFactory`** — Selects the concrete transport (`SignalRTransport` or `WebSocketTransport`) based on configuration.
- **`CollaborationEvents`** / **`CollaborationClientOptions`** — Event names and client config.

>> **Using this package with an AI coding agent**
>
> Before generating Syncfusion® code, ask your AI coding agent to run the Syncfusion® setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion® before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com/,
> then report the detected platform, installed skill pack, MCP 
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion® skill pack. No Syncfusion® account or MCP key is required to install or read Syncfusion® agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/javascript/llms.txt](https://ai.syncfusion.com/javascript/llms.txt)


## Supported Backend Combinations

The common client is **connection-agnostic**. The backend is selected at construction time via the `connectionType` option, and `TransportFactory` builds the matching implementation:

| `connectionType` value | Backend stack | URL shape | Module |
|---|---|---|---|
| `'signalr'` *(default)* | **Redis + SignalR + ASP.NET Core** | `<serviceUrl>` (base URL of the ASP.NET Core app). The factory appends `/collaborationhub` automatically. | `SignalRTransport` |
| `'websocket'` | **Redis + WebSocket + ASP.NET Core** *or* **Redis + WebSocket + Node.js** | WebSocket URL (e.g. `ws://localhost:8080` or `wss://api.example.com/collab`). | `WebSocketTransport` |

## Collaborator Common Package – Client Integration Guidelines

A reference for teams adopting **`@syncfusion/ej2-collaborator`** for real-time collaborative editing. The pattern used by the Document Editor applies identically to PDF Viewer and Spreadsheet.

### ### What is ej2-collaborator?

`@syncfusion/ej2-collaborator` is a reusable, control-agnostic library that handles all **shared client-side collaboration concerns** so product teams don't re-implement them

### Integration Workflow

1. **Install the package** in your client app:
   `npm install @syncfusion/ej2-collaborator`
   > `@microsoft/signalr` is a transitive dependency and is installed automatically. **No extra dependency is required to use the WebSocket transport** — it uses the browser-native `WebSocket`.
2. **Create your adapter** (`DocumentEditorAdapter.ts` / `PdfViewerAdapter.ts` / `SpreadsheetAdapter.ts`):
   - A class that implements `ICollaborationProvider`.
   - Map your control's native operations ↔ the common action shape.
   - Delegate to your control's internal collaboration handler module inside each method.
3. **Wire it up in your app** (`app.ts`):
   - **Inject and enable the control's collaborative editing module first** (e.g. `DocumentEditor.Inject(CollaborativeEditingHandler)` and `container.documentEditor.enableCollaborativeEditing = true`).
   - Instantiate the EJ2 control, build the adapter, then construct `CollaborationClient` — pick the transport that matches your server.
   - Pass `onUserJoined` / `onUserLeft` to update your title bar / user list UI.
   - Fetch the document from your product's own REST API, then call `client.joinRoomAsync(roomName)` to join the collaboration room.

## Public API

Most integrations require only two public extension points the **`ICollaborationProvider`** interface they implement, and the **`CollaborationClient`** they instantiate.

### `ICollaborationProvider` — implement this in your adapter

| Member | Purpose |
|---|---|
| `applyRemoteAction(action: string, data: ICollaborationActionData): void` | Apply a remote action received from the collaboration backend to the local editor. The action payload is exposed under `data.payload`. **This is the only method the common package calls on the adapter at runtime.** |

### `CollaborationClient` — call this from your app

| Member | Purpose |
|---|---|
| `constructor(adapter: ICollaborationProvider, options: CollaborationClientOptions)` | Bind an adapter to a transport endpoint and current user. Constructs the underlying transport — does **not** start it. |
| `joinRoomAsync(roomName: string): Promise<void>` | Connects the transport and sends a `JoinGroup` for `roomName`. Re-emits the server's `connectionId` / `addUser` / `removeUser` / `action` events. **Does not fetch the document** — do that in your adapter or app first if needed. |


#### `CollaborationClientOptions` — constructor argument

| Field | Type | Purpose |
|---|---|---|
| `serviceUrl` | `string` | | `serviceUrl` | `string` | URL of the collaboration backend. Examples: `ws://localhost:8080` (Node.js WebSocket), `ws://localhost:62870` (ASP.NET Core WebSocket), `http://localhost:62870` (ASP.NET Core SignalR). ||
| `connectionType` | `'signalr' \| 'websocket'` | Selects the backend. Defaults to `'signalr'`. |
| `currentUser` | `string` | Display name broadcast to peers when joining the room. **Required.** |
| `onUserJoined?` | `(user: UserInfo) => void` | Fired when a remote peer enters the same room. **Optional.** |
| `onUserLeft?` | `(user: UserInfo) => void` | Fired when a remote peer leaves the room. **Optional.** |

> NOTE: `serviceUrl` is the **transport** URL, not a product REST API URL. Each product passes its own REST endpoint through a separate field on its own configuration.

#### Picking a transport

```ts
// 1) SignalR + ASP.NET Core (default — same as before)
import {
    CollaborationClient,
    UserInfo
} from '@syncfusion/ej2-collaborator';

const client = new CollaborationClient(adapter, {
    serviceUrl: 'https://api.example.com/',
    connectionType: 'signalr',            // optional, this is the default
    currentUser: 'Guest User',
    onUserJoined: (user: UserInfo) => { /* ... */ },
    onUserLeft:   (user: UserInfo) => { /* ... */ }
});
client.joinRoomAsync('room-42');

// 2) WebSocket + ASP.NET Core (or Node.js)
const client = new CollaborationClient(adapter, {
    serviceUrl: 'ws://localhost:3000',   // base URL — the client appends '/ws'
    connectionType: 'websocket',
    currentUser: 'Guest User'
});
client.joinRoomAsync('room-42');
```

### Tracking users joining and leaving a room

The client exposes two optional callbacks on `CollaborationClientOptions` so product teams can render a live user list (title bar badges, avatars, etc.) without touching the transport layer:

| Callback | When it fires | `user` payload |
|---|---|---|
| `onUserJoined(user)` | A peer enters the same room (server action `addUser` *or* `action`) | The user record broadcast by the server (id, display name, etc.) |
| `onUserLeft(user)` | A peer disconnects from the room (server action `removeUser`) | The user record of the peer that left |

> The current user is **not** delivered to its own `onUserJoined`. Remote peers only. The first `connectionId` message the server sends is captured internally and used to ignore echoes of your own actions.

Typical wiring — push into your title bar (or any user-list UI) and remove on leave:

```ts
import { CollaborationClient, UserInfo } from '@syncfusion/ej2-collaborator';

const client = new CollaborationClient(adapter, {
    serviceUrl: 'https://api.example.com/',
    connectionType: 'signalr',
    currentUser: 'Guest User',
    onUserJoined: (user: UserInfo) => {
        console.log('User Joined', user);
        titleBar.addUser(user);   // your UI: add badge / avatar
    },
    onUserLeft: (user: UserInfo) => {
        console.log('User Left', user);
        titleBar.removeUser(user); // your UI: remove badge / avatar
    }
});
client.joinRoomAsync('Giant Panda.docx');   // room name = document identifier
```

## Getting started

The following application and adapter examples are based on the Document Editor integration and can be used as a reference when implementing collaboration support for PDF Viewer or Spreadsheet.

### 1. `app.ts` — Client Wiring

```ts
import { DocumentEditorContainer, DocumentEditor, Toolbar, CollaborativeEditingHandler } from '@syncfusion/ej2-documenteditor';
import { CollaborationClient, UserInfo } from '@syncfusion/ej2-collaborator';
import { DocumentEditorAdapter } from '../collaboration/DocumentEditorAdapter';
import { TitleBar } from './title-bar';
DocumentEditor.Inject(CollaborativeEditingHandler);
DocumentEditorContainer.Inject(Toolbar);
let serviceUrl: string = 'http://localhost:62870/';
let documenteditor: DocumentEditorContainer = new DocumentEditorContainer({
    enableToolbar: true,
    height: '590px',
    currentUser: currentUser,
    // Use the following service URL only for demo purposes
    serviceUrl: serviceUrl + 'api/documenteditor'
});
documenteditor.appendTo('#DocumentEditor');

documenteditor.documentEditor.enableCollaborativeEditing = true;

let titleBar: TitleBar = new TitleBar(
    document.getElementById('documenteditor_titlebar') as HTMLElement,
    documenteditor.documentEditor,
    true
);
titleBar.updateDocumentTitle();

const adapter: DocumentEditorAdapter = new DocumentEditorAdapter(documenteditor, serviceUrl);

const client: CollaborationClient = new CollaborationClient(adapter, {
    // serviceUrl: "localhost:8080",          // Node.js (websocket)  
    // serviceUrl: "ws://localhost:62870",    // ASP.NET Core (websocket) 
    // serviceUrl: "http://localhost:62870",  // ASP.NET Core (SignalR)   
    serviceUrl: "ws://localhost:8080",
    currentUser: currentUser,
    connectionType: "websocket",
    onUserJoined: (user: UserInfo) => {
        console.log("User Joined", user);
        titleBar.addUser(user);
    },
    onUserLeft: (user: UserInfo) => {
        console.log("User Left", user);
        titleBar.removeUser(user);
    }
});

(async () => {
    const roomName: string = await adapter.loadFromServer("Giant Panda.docx");
    await client.joinRoomAsync(roomName);
})();
```

### 2. `DocumentEditorAdapter.ts` — Reference Adapter

The adapter acts as the integration layer between the EJ2 control and the collaboration framework. Document Editor, PDF Viewer, and Spreadsheet each provide their own implementation while preserving the same contract.

```ts
import {
    DocumentEditor,
    DocumentEditorContainer,
    Operation
} from '@syncfusion/ej2-documenteditor';

import {
    ICollaborationProvider,
    ICollaborationActionData
} from '@syncfusion/ej2-collaborator';

export class DocumentEditorAdapter implements ICollaborationProvider {

    constructor(
        private container: DocumentEditorContainer,
        private serviceUrl: string,
    ) { }

    /**
     * Fetches the document from the product's REST API and opens it in
     * the editor. Returns the room name to be used by `client.joinRoomAsync(...)`.
     */
    public async loadFromServer(fileName: string): Promise<string> {
        const roomName: string = this.getRoomName(fileName);
        const response: Response = await fetch(
            this.serviceUrl + 'api/CollaborativeEditing/ImportFile',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName, roomName })
            }
        );
        if (!response.ok) {
            throw new Error('Failed to load document');
        }
        const responseText: string = await response.text();
        await this.open(responseText, roomName);
        return roomName;
    }

    /**
     * Seeds the editor with the server payload, registers the room
     * with the editor's internal collaboration handler, and bridges
     * local content-change events to the editor's sender.
     */
    public async open(responseText: string, roomName: string): Promise<void> {
        const data: any = JSON.parse(responseText);
        this.container?.documentEditor.collaborativeEditingHandlerModule
            ?.updateRoomInfo(roomName, data.version, this.serviceUrl + 'api/CollaborativeEditing/');
        this.container.documentEditor.open(data.sfdt);
        this.container.contentChange = (args: any) => {
            console.log('[SENT]', new Date().toISOString());
            this.container.documentEditor.collaborativeEditingHandlerModule
                ?.sendActionToServer(args.operations as Operation[]);
        };
    }

    /**
     * The only ICollaborationProvider method — invoked by the common client
     * for every remote action received from the server. The actual payload
     * is exposed at `data.payload` (the typed envelope is
     * `ICollaborationActionData`).
     */
    public applyRemoteAction(action: string, data: ICollaborationActionData): void {
        if (action === 'action') {
            console.log('[RECEIVED]', new Date().toISOString());
        }
        this.container.documentEditor.collaborativeEditingHandlerModule
            ?.applyRemoteAction(action, data.payload);
    }

    private getRoomName(fileName: string): string {
        const queryString: string = window.location.search;
        const urlParams: URLSearchParams = new URLSearchParams(queryString);
        let roomId: string | null = urlParams.get('id');

        if (!roomId) {
            roomId = Math.random().toString(32).slice(2);
            window.history.replaceState({}, '', '?id=' + roomId);
        }

        return roomId;
    }
}
```
