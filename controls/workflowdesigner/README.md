[![coverage](http://ej2.syncfusion.com/badges/ej2-workflow-designer/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-workflow-designer)

# Syncfusion Workflow Designer (preview)

The Workflow Designer is a UI component for building workflow applications: users draw a workflow on a canvas, configure each step, and test-run it in the browser. Your application stores the workflow as JSON and runs it on your own backend.

> This is a preview release. The API can change before 1.0.0.

## Install

```sh
npm install @syncfusion/ej2-workflow-designer
```

Add the Syncfusion theme you use (for example Tailwind 3) and the Workflow Designer styles for the same theme. <!-- TODO: confirm the published CSS path for each theme before release. -->

## Quick start

```ts
import { WorkflowDesigner } from '@syncfusion/ej2-workflow-designer';

const designer: WorkflowDesigner = new WorkflowDesigner({
    width: '100%',
    height: '600px',
    toolbarSettings: { visible: true },
    propertyPanelSettings: { visible: true },
    executionLogSettings: { visible: true }
});
designer.appendTo('#workflow');

// Save whenever the user changes the workflow.
designer.workflowChanged = () => {
    saveToServer(designer.exportWorkflow());
};
```

## What the component does, and what your app does

| The designer | Your application |
| --- | --- |
| Canvas, step configuration, validation | Storing workflows and their versions |
| Test runs in the browser, with an execution log | Running workflows in production (scheduler, queue, workers) |
| Import and export as JSON | Users, permissions and audit |
| Raises events for steps it can't run by itself (`notifyRequested`, `customExecutionRequested`); Approve steps show a built-in approval dialog | Sending notifications and custom actions |
| Asks for credentials by name (`credentialRequested`) | Storing secrets securely and resolving them on the server |

## Credentials

Workflows store only credential **references** such as `"crm-api"`, never secrets. When a test run needs a credential, the designer raises `credentialRequested` and your app supplies a short-lived token. For production, resolve the reference on your server.

Keys typed directly into the designer (`executionSettings.credentialMode: 'Inline'`) are sent from the browser and are for local development only.

## Controlling outgoing requests

`beforeRequestSend` is raised before every API Request step, AI step and AI Assist request, before any secret is attached. Use it to send requests through your proxy, answer them yourself, or block hosts that aren't allowed:

```ts
designer.beforeRequestSend = (args) => {
    if (args.requestType === 'ApiRequest' && !isAllowed(args.request.url)) {
        args.cancel = true;
    }
};
```

See `demos/getting-started/request-allow-list` for a complete example, and `demos/live/` for end-to-end demos on live data (webhooks, AI and approvals) with a small demo server.

## Scheduled and webhook triggers

- Running a workflow that starts with a ScheduledTrigger arms the trigger: it fires at its scheduled time while the page is open, and Recurring and Cron triggers keep firing until you stop the run. Set `executionSettings.scheduleMode: 'Immediate'` to fire it at once as a test run instead. Times are read in the step's `timeZone`, which defaults to UTC.
- `designer.triggerWebhook(message)` starts a run from a webhook request that your server received and forwarded to the page.

## AI Assist

```ts
aiAssistSettings: {
    enabled: true,
    server: { url: '/api/ai-assist' }
}
```

`executionSettings.credentialMode` decides how AI steps and AI Assist reach the model. With `Reference` (default) requests go to `server.url` and your backend calls the model with its own key. With `Inline` the browser calls the provider using `direct.provider`, `direct.model` and an API key; this is for development only.

## Keyboard

| Keys | Action |
| --- | --- |
| Alt+Arrow keys | Move to the nearest step in that direction |
| Enter | Open the selected step's properties |
| Alt+N | Add a step after the selected step |
| Ctrl+Enter | Run the workflow, or stop the run in progress |
| Ctrl+Z / Ctrl+Y | Undo / redo |
| Ctrl+S / Ctrl+O | Export / import |

## Localization

All text comes from locale keys under the `workflow-designer` module. The English defaults are listed in `config.json` (`locale.workflow-designer`). See `demos/getting-started/locale` for a French example.
