import { InsertTablePayload } from '../../common/table-payload';
import { IEditorCoreOptions } from '../base/interface';
import * as events from '../constants';

// Payload for table commands dispatched through the `tableExecution` channel.
export interface TableExecutionPayload {
    command: string;
    args?: InsertTablePayload | { align?: string } | { background?: string } | unknown;
    callBack?: Function;
}

// Handles table command execution.
export class Table {
    public parent: IEditorCoreOptions;

    constructor(parent?: IEditorCoreOptions) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.tableExecution, this.applyTable, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.tableExecution, this.applyTable);
    }

    private applyTable(args: TableExecutionPayload): void {
        const parentRecord: { editor?: { commands?: Record<string, (...payload: unknown[]) => unknown> } } =
            this.parent as unknown as { editor?: { commands?: Record<string, (...payload: unknown[]) => unknown> } };
        const editor: { commands?: Record<string, (...payload: unknown[]) => unknown> } | undefined =
            parentRecord && parentRecord.editor;
        // Translate toolbar commands to their headless editor equivalents.
        const dispatch: { command: string; args?: unknown } = this.translate(args);
        editor.commands[dispatch.command](dispatch.args);

    }

    // Maps Table Quick Toolbar commands to headless editor commands.
    private translate(args: TableExecutionPayload): { command: string; args?: unknown } {
        const unknownArgs: unknown = args.args;
        const cellAttrs: { attribute?: string; value?: unknown; color?: string } =
         (unknownArgs as { attribute?: string; value?: unknown; color?: string });
        switch (args.command) {
        case 'tableCellBackground': {
            // Map color picker output to a cell background attribute.
            const color: string = cellAttrs.color;
            return { command: 'setCellAttribute', args: { attribute: 'backgroundColor', value: color } };
        }
        case 'setTableCellVerticalAlign': {
            const typed: { attribute?: string; value?: unknown } = cellAttrs;
            return { command: 'setCellAttribute', args: { attribute: typed.attribute, value: typed.value } };
        }
        case 'setTableCellHorizontalAlign': {
            const typed: { attribute?: string; value?: unknown } = cellAttrs;
            return { command: 'setCellAttribute', args: { attribute: typed.attribute, value: typed.value } };
        }
        default:
            return { command: args.command, args: args.args };
        }
    }

    /**
     * Detaches the `tableExecution` listener. Called by `EditorCore.destroy`.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
