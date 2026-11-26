/**
 * Public barrel exports for the Workflow Designer module.
 *
 * This file defines the complete public API. The root src/index.ts
 * should only re-export this module barrel.
 */

// Workflow Designer component and generated model
export * from './workflow-designer';
export * from './workflow-designer-model';

// Workflow runtime interfaces and classes
export * from './models/workflow-step';
export * from './models/workflow-connection';
export * from './models/workflow-sticky-note';
export * from './models/workflow-settings';
export * from './models/workflow-position';
export * from './models/workflow-size';
export * from './models/workflow-appearance';
export * from './models/workflow-step-template';
export * from './models/workflow-error-handling';
export * from './models/workflow-style';
export * from './models/workflow-toolbar-settings';
export * from './models/workflow-node-collection-settings';
export * from './models/workflow-custom-step';
export * from './models/workflow-property-panel-settings';
export * from './models/workflow-execution-log-settings';
export * from './models/workflow-execution-settings';
export {
    WorkflowAIAssistSettings, WorkflowAIAssistServerSettings, WorkflowAIAssistDirectSettings,
    WorkflowAIAssistProvider, WorkflowAIAssistTransportMode
} from './models/workflow-ai-assist-settings';

// Generated workflow model declarations (where applicable)
export * from './models/workflow-settings-model';
export * from './models/workflow-toolbar-settings-model';
export * from './models/workflow-node-collection-settings-model';
export * from './models/workflow-custom-step-model';
export * from './models/workflow-property-panel-settings-model';
export * from './models/workflow-execution-log-settings-model';
export * from './models/workflow-execution-settings-model';
export * from './models/workflow-ai-assist-settings-model';

// Public workflow contracts and types
export { WorkflowDefinitionModel } from './models/workflow-definition';
export * from './models/workflow-runtime-context';
export * from './models/workflow-enums';
export * from './models/workflow-events';
export * from './models/workflow-validation';
export * from './models/workflow-shared-types';
export * from './models/workflow-ai-server';
export { WorkflowWebhookTriggerMessage, WorkflowWebhookRequestContext } from './runtime/workflow-webhook-trigger-api';

// Public persistence errors
export { WorkflowError, WorkflowImportError } from './persistence/errors';
