[![coverage](http://ej2.syncfusion.com/badges/ej2-collaborator/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-collaborator)

# ej2-collaborator

A control-agnostic client package for real-time collaborative editing in Syncfusion EJ2 controls, including Document Editor, PDF Viewer, and Spreadsheet.

## Features

- Shared collaboration client for multiple EJ2 controls
- SignalR transport support
- WebSocket transport support
- Room-based collaboration
- User join and leave notifications
- Compatible with ASP.NET Core and Node.js collaboration servers
- Adapter-based integration model

---

## Using this Package with an AI Coding Agent

Before generating Syncfusion code, ask your AI coding agent to run the Syncfusion setup using the following prompt:

```text
Set up this project for Syncfusion before generating code. Fetch
and follow the official instructions at https://ai.syncfusion.com/,
then report the detected platform, installed skill pack, MCP 
status, and any required licensing action.
```

The setup detects your project’s platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.

**Platform reference:** [https://ai.syncfusion.com/javascript/llms.txt](https://ai.syncfusion.com/javascript/llms.txt)

## Installation

```bash
npm install @syncfusion/ej2-collaborator
```

> `@microsoft/signalr` is installed automatically as a transitive dependency. No additional dependency is required to use the WebSocket transport because it uses the browser-native `WebSocket`.

## Getting Started

Integrating collaborative editing consists of the following steps:

1. Install the package.
2. Implement an `ICollaborationProvider` adapter.
3. Initialize the EJ2 control.
4. Configure the `CollaborationClient`.
5. Load the document or content.
6. Join a collaboration room.
7. Exchange collaboration actions with connected users.

## Supported Backend Combinations

The common client is connection-agnostic. The backend is selected at construction time via the `connectionType` option, and `TransportFactory` builds the matching implementation:

| `connectionType` value | Backend stack | URL shape | Module |
|---|---|---|---|
| `'signalr'` *(default)* | Redis + SignalR + ASP.NET Core | Base URL of the ASP.NET Core application. | `SignalRTransport` |
| `'websocket'` | Redis + WebSocket + ASP.NET Core or Redis + WebSocket + Node.js | WebSocket URL such as `ws://localhost:8080` or `wss://api.example.com/collab`. | `WebSocketTransport` |

## Integration Guidelines

A reference for teams adopting `@syncfusion/ej2-collaborator` for real-time collaborative editing. The pattern used by the Document Editor applies identically to PDF Viewer and Spreadsheet.

### Integration Workflow

1. **Install the package** in your client app:

   ```bash
   npm install @syncfusion/ej2-collaborator
   ```

   > `@microsoft/signalr` is a transitive dependency and is installed automatically. No extra dependency is required to use the WebSocket transport.

2. **Create your adapter** (`DocumentEditorAdapter.ts` / `PdfViewerAdapter.ts` / `SpreadsheetAdapter.ts`).

   - Implement `ICollaborationProvider`.
   - Map your control-specific operations to the collaboration action format.
   - Delegate actions to the control's collaboration handler implementation.

3. **Wire it up in your application**.

   - Inject and enable the control's collaborative editing module.
   - Create the adapter.
   - Configure the `CollaborationClient`.
   - Load the document or content.
   - Join a collaboration room.

---

## Public API

Most integrations require only two public extension points: the **`ICollaborationProvider`** interface they implement, and the **`CollaborationClient`** they instantiate.

### `ICollaborationProvider` — implement this in your adapter

| Member | Purpose |
|---|---|
| `applyRemoteAction(action: string, data: ICollaborationActionData): void` | Apply a remote action received from the collaboration backend to the local editor. The action payload is exposed under `data.payload`. |

### `CollaborationClient` — call this from your app

| Member | Purpose |
|---|---|
| `constructor(adapter: ICollaborationProvider, options: CollaborationClientOptions)` | Bind an adapter to a transport endpoint and current user. Constructs the underlying transport and does **not** start it. |
| `joinRoomAsync(roomName: string): Promise<void>` | Connects the transport and joins the specified collaboration room. Re-emits server events such as `connectionId`, `addUser`, `removeUser`, and `action`. |

### `CollaborationClientOptions` — constructor argument

| Field | Type | Purpose |
|---|---|---|
| `serviceUrl` | `string` | URL of the collaboration backend. Examples: `ws://localhost:8080` (Node.js WebSocket), `ws://localhost:62870` (ASP.NET Core WebSocket), `http://localhost:62870` (ASP.NET Core SignalR). |
| `connectionType` | `'signalr' \| 'websocket'` | Selects the backend. Defaults to `'signalr'`. |
| `currentUser` | `string` | Display name broadcast to peers when joining the room. **Required.** |
| `onUserJoined?` | `(user: UserInfo) => void` | Fired when a remote peer enters the same room. |
| `onUserLeft?` | `(user: UserInfo) => void` | Fired when a remote peer leaves the room. |

> **Note:** `serviceUrl` is the transport URL, not a product REST API URL. Each product passes its own REST endpoint through a separate field on its own configuration.

#### Picking a Transport

```ts
// SignalR + ASP.NET Core
import {
    CollaborationClient,
    UserInfo
} from '@syncfusion/ej2-collaborator';

const client = new CollaborationClient(adapter, {
    serviceUrl: 'http://localhost:62870',
    connectionType: 'signalr',
    currentUser: 'Guest User',
    onUserJoined: (user: UserInfo) => { /* ... */ },
    onUserLeft: (user: UserInfo) => { /* ... */ }
});

client.joinRoomAsync('room-42');
```

```ts
// WebSocket + ASP.NET Core or Node.js
const client= new CollaborationClient(adapter,{
    serviceUrl: 'ws://localhost:8080',
    connectionType: 'websocket',
    currentUser: 'Guest User'
});

client.joinRoomAsync('room-42');
```

### Tracking Users Joining and Leaving a Room

The client exposes two optional callbacks on `CollaborationClientOptions` so product teams can render a live user list without touching the transport layer.

| Callback | When it fires | User payload |
|---|---|---|
| `onUserJoined(user)` | A peer enters the same room | User information broadcast by the server |
| `onUserLeft(user)` | A peer disconnects from the room | User information of the peer that left |

```ts
import {
    CollaborationClient,
    UserInfo
} from '@syncfusion/ej2-collaborator';

const client = new CollaborationClient(adapter, {
    serviceUrl: 'http://localhost:62870',
    connectionType: 'signalr',
    currentUser: 'Guest User',
    onUserJoined: (user: UserInfo) => {
        titleBar.addUser(user);
    },
    onUserLeft: (user: UserInfo) => {
        titleBar.removeUser(user);
    }
});

client.joinRoomAsync('Giant Panda.docx');
```
## Reference Implementation

The following application and adapter examples are based on the Document Editor integration and can be used as a reference when implementing collaboration support for PDF Viewer or Spreadsheet.

### 1. app.ts — Client Wiring

```ts
import { CollaborationClient, UserInfo } from '@syncfusion/ej2-collaborator';

const adapter = new DocumentEditorAdapter();
const client = new CollaborationClient(adapter, {
    serviceUrl: 'ws://localhost:8080',
    connectionType: 'websocket',
    currentUser: currentUser,
    onUserJoined: (user: UserInfo) => {
        console.log('User Joined', user);
    },
   onUserLeft: (user: UserInfo) => {
       console.log('User Left', user);
    }
});

await client.joinRoomAsync('room-42');
```

### 2. DocumentEditorAdapter.ts — Reference Adapter

```ts
import {
    ICollaborationProvider,
    ICollaborationActionData
} from '@syncfusion/ej2-collaborator';

export class DocumentEditorAdapter implements ICollaborationProvider {

    public applyRemoteAction(action: string, data: ICollaborationActionData): void {

        this.container.documentEditor.collaborativeEditingHandlerModule?.applyRemoteAction(action, data.payload);
    }
}
```