export const inlineExecution: string = 'inline-executeAction';
export const blockExecution: string = 'block-executeAction';
export const undoRedoExecution: string = 'undoredo-executeAction';
export const listExecution: string = 'list-executeAction';
export const alignmentxecution: string = 'alignment-executeAction';
export const imageExecution: string = 'image-executeAction';
export const linkExecution: string = 'link-executeAction';
/**
 * Observer channel emitted by the Table module when a table insertion
 * command is dispatched. The Table core plugin
 * (`src/core/plugins/table.ts`) subscribes to this channel and forwards the
 * payload to the headless `insertTableCommand`.
 */
export const tableExecution: string = 'table-executeAction';

export const destroyCore: string = 'destroy_core';
