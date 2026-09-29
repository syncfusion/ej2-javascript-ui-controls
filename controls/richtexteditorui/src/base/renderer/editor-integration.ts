/**
 * Headless Editor narrow integration interfaces.
 *
 * Defines the local type-only contracts used throughout the toolbar module
 * to communicate with the headless editor engine. Contains no runtime code.
 *
 * When @syncfusion/ej2-headless-editor exposes these types publicly, this
 * file can be replaced with a re-export from that package.
 */

/**
 * Name of an editor command (e.g., 'bold', 'italic', 'undo').
 */
export type EditorCommandName = string;

/**
 * State snapshot for a single editor command.
 */
export interface EditorCommandState {
    /** Whether the command can currently be executed */
    readonly enabled: boolean;
    /** Current activation status of the command */
    readonly activation: 'active' | 'inactive' | 'mixed';
    /** Optional value associated with the command (e.g., font size) */
    readonly value?: string | number | boolean | null;
}

/**
 * Minimal editor instance shape required for action processing.
 */
export interface IEditorInstance {
    trigger(eventName: string, args: object): void;
}

/**
 * Interface for executing editor commands.
 *
 * @remarks
 * The toolbar module uses this narrow interface to execute commands without
 * depending on the full EditorCore or EditorController implementation.
 */
export interface EditorCommandExecutor {
    /**
     * Executes a named editor command with an optional value.
     *
     * @param command - The command name to execute
     * @param value - Optional parameter value for the command
     */
    execute(command: EditorCommandName, value?: unknown): void;

    /**
     * Processes a command with full action pipeline including actionBegin/actionComplete events.
     * This is the proper entry point for toolbar item clicks and dropdown selections.
     *
     * @param editorInstance - The editor instance for event triggering
     * @param action - The command name to execute
     * @param event - Optional DOM event that triggered this action (for source tracking)
     * @param value - Optional command value (e.g. `{ listType: 'decimal' }`)
     */
    process?(
        editorInstance: IEditorInstance,
        action: EditorCommandName,
        event?: MouseEvent | KeyboardEvent,
        value?: unknown
    ): void;
}
