import { RichTextEditorUI } from '../richtexteditor-ui/richtexteditor-ui';
import * as events from '../common/constant';
import { IEditorCoreOptions } from '../core/base/interface';
import { FormattingState } from '../common/services/formatting-state.service';
import { ActionBeginEventArgs, ActionCompleteEventArgs, EditorAction, EditorCommandName } from './interface';
import { SelectedNode } from '@syncfusion/ej2-headless-editor';


export class EditorController {
    private editorCore: IEditorCoreOptions;

    constructor(editorCore: IEditorCoreOptions) {
        this.editorCore = editorCore;
    }

    /**
     * To execute the command
     *
     * @param  {RichTextEditorUI} self - specifies the self element.
     * @param  {ActionBeginEventArgs | EditorCommandName} args - either a structured
     *         `ActionBeginEventArgs` (legacy callers) or a command name string
     *         (the toolbar dispatch shape). When a string is supplied the
     *         `actionBegin` event is raised with a synthetic event args object.
     * @param  {MouseEvent|KeyboardEvent} event - specifies the keyboard event.
     * @param  {unknown} value - optional command value (e.g. a list style type).
     * @returns {void}
     * @hidden
     */
    public process(self: RichTextEditorUI, args?: ActionBeginEventArgs | EditorCommandName, event?: MouseEvent | KeyboardEvent,
                   value?: unknown): void {
        const action: EditorCommandName = typeof args === 'string'
            ? args as EditorCommandName
            : (args ? (args as ActionBeginEventArgs).action : '' as EditorCommandName);
        const eventArgs: ActionBeginEventArgs = (args && typeof args !== 'string')
            ? args as ActionBeginEventArgs
            : { name: 'actionBegin', action: action, cancel: false, actionId: '', source: {}, isInteracted: true } as ActionBeginEventArgs;
        self.trigger(events.actionBegin, eventArgs, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                const actionCompleteArgs: ActionCompleteEventArgs = {
                    name: 'actionComplete',
                    action: actionBeginArgs.action as unknown as EditorAction,
                    actionId: actionBeginArgs.actionId,
                    source: actionBeginArgs.source,
                    isInteracted: actionBeginArgs.isInteracted,
                    documentChanged: true
                };
                if (action === 'table') {
                    self.notify(events.insertTable, {
                        callBack: this.onSuccess.bind(this, self, actionCompleteArgs)
                    });
                    return;
                }
                this.editorCore.observer.notify(events.executeCommand, {
                    action: actionBeginArgs.action,
                    args: value !== undefined ? value : actionBeginArgs,
                    callBack: this.onSuccess.bind(this, self, actionCompleteArgs)
                });
            }
        });
    }

    /**
     * Executes a built-in editor command on the headless editor.
     *
     * This is the narrow entry point used by the toolbar layer. It
     * forwards the call through the `executeCommand` observer on the
     * editor core, which is the single mutation gateway between the
     * component layer and the headless engine. For inline mark
     * commands (`bold`, `italic`, `underline`, `strikethrough`,
     * `subscript`, `superscript`) the core dispatches to the
     * `InlineFormats` plugin which calls the typed `editor.commands`
     * facade on the headless editor.
     *
     * @param {EditorCommandName}command - The built-in command name to execute.
     * @param {unknown}value - Optional value associated with the command.
     * @returns {void}
     * @param  {RichTextEditorUI} self - specifies the self element.
     */
    public execute(command: EditorCommandName, value?: unknown, self?: RichTextEditorUI): void {
        if (!this.editorCore || !this.editorCore.observer) {
            return;
        }
        this.editorCore.observer.notify(events.executeCommand, {
            action: command,
            args: value,
            callBack: undefined
        });
    }

    /**
     * onSuccess method
     *
     * Called after a command executes successfully on the headless editor.
     * Queries the formatting state once and broadcasts it to toolbar modules.
     *
     * @param {RichTextEditorUI} self - specifies the self element.
     * @param {ActionCompleteEventArgs} args  - Action complete args
     * @returns {void}
     * @hidden
     */
    public onSuccess(self?: RichTextEditorUI, args?: ActionCompleteEventArgs): void {
        // Step 1: Query formatting state once via the centralized service
        const state: FormattingState = self.formattingStateService.refreshFormattingState(this.editorCore as unknown as any);
        self.triggerUpdatedToolbarStatus(state);
        self.trigger(events.actionComplete, args);
        self.notify(events.insertCompleted, {args: args, value: args.action , event: event});
    }
    /**
     * Save the data for undo and redo action.
     *
     * @param {KeyboardEvent} e - specifies the keyboard event.
     * @returns {void}
     * @deprecated
     */
    public saveData(e?: KeyboardEvent | MouseEvent): void {
        //
    }

    public getSelectedBlock(): { node: { type: string; attrs: Record<string, unknown> }; source: string } | null {
        return this.editorCore.editor.getSelectedBlock();
    }

    /**
     * Returns the names of the marks that are currently active at the selection
     * or cursor position. Safe to call even if the headless editor does not
     * expose `getActiveMarks`; returns an empty set in that case.
     *
     * @returns {Set<string>} The set of active mark names, or an empty set
     */
    public getActiveMarks(): Set<string> {
        const editor: {
            getActiveMarks?: () => Set<string>;
        } = this.editorCore.editor as unknown as {
            getActiveMarks?: () => Set<string>;
        };
        if (!editor || typeof editor.getActiveMarks !== 'function') {
            return new Set<string>();
        }
        const marks: Set<string> = editor.getActiveMarks();
        return marks ? marks : new Set<string>();
    }

    /**
     * Returns whether the named mark is active at the current selection or
     * cursor position. Safe to call even if the underlying headless editor
     * does not expose `isMarkActive`; returns `false` in that case.
     *
     * @param {string} name - The mark name (e.g. 'bold', 'italic', 'underline')
     * @returns {boolean} `true` if the mark is active, otherwise `false`
     */
    public isMarkActive(name: string): boolean {
        const editor: {
            isMarkActive?: (markName: string) => boolean;
        } = this.editorCore.editor as unknown as {
            isMarkActive?: (markName: string) => boolean;
        };
        if (!editor || typeof editor.isMarkActive !== 'function') {
            return false;
        }
        return editor.isMarkActive(name);
    }

    /**
     * Returns the attribute map of the named mark at the current selection
     * (e.g. color / backgroundColor / fontFamily / fontSize for 'textStyle').
     * Returns `null` if the mark is not present or the headless editor does not
     * expose `getMarkAttributes`.
     *
     * @param {string} name - The mark name (e.g. 'textStyle')
     * @returns {Record<string, unknown> | null} The mark attribute map, or null
     */
    public getMarkAttributes(name: string): Record<string, unknown> | null {
        const editor: {
            getMarkAttributes?: (markName: string) => Record<string, unknown> | null;
        } = this.editorCore.editor as unknown as {
            getMarkAttributes?: (markName: string) => Record<string, unknown> | null;
        };
        if (!editor || typeof editor.getMarkAttributes !== 'function') {
            return null;
        }
        return editor.getMarkAttributes(name);
    }

    /**
     * To get whether undo is able to be executed.
     *
     * @returns {boolean} Whether undo is able to be executed.
     * @hidden
     */
    public canUndo(): boolean {
        return this.editorCore.editor.can().undo();
    }

    /**
     * To get whether redo is able to be executed.
     *
     * @returns {boolean} Whether undo is able to be executed.
     * @hidden
     */
    public canRedo(): boolean {
        return this.editorCore.editor.can().redo();
    }

    public getCurrentStackIndex(): undefined | number {
        return 0;
    }

    public getWindowSelection(): Selection {
        return this.editorCore.hostElement.ownerDocument.getSelection();
    }

    public getSelectedBlockElem(): HTMLElement {
        return this.editorCore.editor.getSelectedBlock().dom;
    }

    public getSelectedBlockElements(): HTMLElement[] {
        const elementArray: HTMLElement[] = [];
        const blocks: SelectedNode[] = this.editorCore.editor.getSelectedBlocks();
        if (blocks.length === 0) {
            return elementArray;
        }
        for (let i: number = 0; i < blocks.length; i++) {
            const element: HTMLElement = blocks[i as number].dom;
            elementArray.push(element);
        }
        return elementArray;
    }
}
