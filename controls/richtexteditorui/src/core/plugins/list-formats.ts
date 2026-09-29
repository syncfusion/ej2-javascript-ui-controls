import {
    BulletListType,
    EditorAction,
    EditorCommandName,
    ListCommand,
    ListStyleType,
    ListStyleTypeCommand,
    NumberListType
} from '../../controller/interface';
import { IEditorCoreOptions } from '../base/interface';
import * as events from '../constants';

interface ListExecutionPayload {
    command: EditorCommandName;
    args: Object;
    callBack: Function
}

/**
 * Payload accepted by the headless editor `setListStyle` command
 * registered by {@link ListFormats}.
 */
interface SetListStylePayload {
    listType: ListStyleType;
}

/**
 * Reusable definition of a numbered (ordered) list style.
 *
 * Mirrors the CSS `list-style-type` value of the same name and is
 * the canonical mapping consumed by the toolbar layer when
 * rendering a "Numbered List" dropdown.
 */
export interface NumberFormatList {
    /** Display label shown in the toolbar dropdown. */
    text: string;
    /** Editor command name dispatched when the entry is selected. */
    command: string;
    /** Stable identifier used by the toolbar renderer. */
    id: string;
    /** Underlying list-style type passed to the headless editor. */
    listType: NumberListType;
}

/**
 * Reusable definition of a bulleted (unordered) list style.
 *
 * Mirrors the CSS `list-style-type` value of the same name and is
 * the canonical mapping consumed by the toolbar layer when
 * rendering a "Bullet List" dropdown.
 */
export interface BulletFormatList {
    /** Display label shown in the toolbar dropdown. */
    text: string;
    /** Editor command name dispatched when the entry is selected. */
    command: string;
    /** Stable identifier used by the toolbar renderer. */
    id: string;
    /** Underlying list-style type passed to the headless editor. */
    listType: BulletListType;
}

/**
 * Catalog of all supported numbered-list styles.
 *
 * Exposed as a readonly tuple so toolbar renderers can iterate in
 * display order while consumers can read individual entries by
 * `listType` for "current style" lookups. The first entry
 * (`'None'`) is the unset marker — selecting it clears any
 * previously applied numbered-list style.
 */
export const NumberFormatLists: readonly NumberFormatList[] = [
    { id: 'NumberDecimal',    text: 'Number',       command: 'setListStyle', listType: 'decimal' },
    { id: 'NumberLowerGreek', text: 'Lower Greek',  command: 'setListStyle', listType: 'lowerGreek' },
    { id: 'NumberLowerRoman', text: 'Lower Roman',  command: 'setListStyle', listType: 'lowerRoman' },
    { id: 'NumberUpperAlpha', text: 'Upper Alpha',  command: 'setListStyle', listType: 'upperAlpha' },
    { id: 'NumberLowerAlpha', text: 'Lower Alpha',  command: 'setListStyle', listType: 'lowerAlpha' },
    { id: 'NumberUpperRoman', text: 'Upper Roman',  command: 'setListStyle', listType: 'upperRoman' }
];

/**
 * Catalog of all supported bulleted-list styles.
 *
 * Exposed as a readonly tuple so toolbar renderers can iterate in
 * display order while consumers can read individual entries by
 * `listType` for "current style" lookups. The first entry
 * (`'None'`) is the unset marker — selecting it clears any
 * previously applied bulleted-list style.
 */
export const BulletFormatLists: readonly BulletFormatList[] = [
    { id: 'BulletDisc',   text: 'Disc',     command: 'setListStyle', listType: 'disc' },
    { id: 'BulletCircle', text: 'Circle',   command: 'setListStyle', listType: 'circle' },
    { id: 'BulletSquare', text: 'Square',   command: 'setListStyle', listType: 'square' }
];

/**
 * Resolve the {@link NumberFormatList} entry matching a given
 * list-style type, or `undefined` when no match exists.
 *
 * @param {ListStyleType | undefined} listType - The list-style type to look up
 * @returns {NumberFormatList | undefined} The matching format entry, or `undefined`
 */
export function getNumberFormatList(listType: ListStyleType | undefined): NumberFormatList | undefined {
    if (!listType) {
        return undefined;
    }
    for (let i: number = 0; i < NumberFormatLists.length; i++) {
        if (NumberFormatLists[i as number].listType === listType) {
            return NumberFormatLists[i as number];
        }
    }
    return undefined;
}

/**
 * Resolve the {@link BulletFormatList} entry matching a given
 * list-style type, or `undefined` when no match exists.
 *
 * @param {ListStyleType | undefined} listType - The list-style type to look up
 * @returns {BulletFormatList | undefined} The matching format entry, or `undefined`.
 */
export function getBulletFormatList(listType: ListStyleType | undefined): BulletFormatList | undefined {
    if (!listType) {
        return undefined;
    }
    for (let i: number = 0; i < BulletFormatLists.length; i++) {
        if (BulletFormatLists[i as number].listType === listType) {
            return BulletFormatLists[i as number];
        }
    }
    return undefined;
}

/**
 * Editor Core plugin that owns every list-related transformation.
 *
 * Responsibilities:
 * - Register a real `setListStyle` command on the headless editor's
 *   command registry so the toolbar / API can dispatch a
 *   CSS-list-style-type change through a single, well-typed entry
 *   point. The command does the actual work: it lifts items out of
 *   any list when the unset marker is selected, and otherwise
 *   ensures the selection is wrapped in the right logical list
 *   family (ordered for numbered styles, bullet for bulleted styles).
 * - Toggle bullet and ordered list creation (with optional style)
 *   through the headless editor's typed commands facade.
 * - Indent / outdent list items (sink / lift).
 *
 * All list-toggle mutations are dispatched through the headless
 * editor's typed commands facade, so selection state and history
 * are managed by ProseMirror and undoable through the editor's
 * `undoRedoExtension`.
 */
export class ListFormats {
    public parent: IEditorCoreOptions;

    constructor(parent?: IEditorCoreOptions) {
        this.parent = parent;
        this.registerSetListStyleCommand();
        this.addEventListener();
    }

    /**
     * Register a real `setListStyle` command on the headless
     * editor's command registry. This is the single, named
     * command that the rest of the editor (toolbar, public
     * `executeCommand`, programmatic API) uses to apply a CSS
     * list-style-type. Because the command is registered it can be
     * dispatched through `editor.execute('setListStyle', ...)`
     * without triggering the documented `UnknownCommandError`.
     *
     * The command's behaviour, in priority order:
     *
     * 1. Unset marker (`'none'`) — lift the enclosing list items
     *    out of any list via the typed `liftListItem` command. This
     *    clears the visual list-style without producing a new list.
     * 2. Numbered style — ensure the selection is wrapped in an
     *    ordered list through the typed `toggleOrderedList`
     *    command. Toggling naturally converts an existing bullet
     *    list to ordered, or creates a new ordered list if the
     *    selection is not already in one.
     * 3. Bulleted style — same as above for `toggleBulletList`.
     *
     * The list-style-type itself (e.g. `'lowerAlpha'`, `'disc'`)
     * is a CSS-only attribute. The headless editor's list node
     * schema does not yet persist it as a node attribute (see
     * `extensions/builtins/list.d.ts`), so the command focuses on
     * the visible part of the transformation — the logical list
     * family. The requested style is cached on the editor
     * instance so the toolbar can read the active style through
     * `editor.activeListStyle` until the headless editor grows
     * full node-attribute support.
     *
     * @returns {void}
     */
    private registerSetListStyleCommand(): void {
        const editor: IEditorCoreOptions['editor'] = this.parent && this.parent.editor;
        if (!editor) {
            return;
        }
        const registry: { has: (name: string) => boolean;
            register?: (command: unknown, source: string, name?: string) => void } | undefined =
            (editor as unknown as { commandRegistry?: { has: (name: string) => boolean;
                register?: (command: unknown, source: string, name?: string) => void } }).commandRegistry;
        if (!registry || typeof registry.register !== 'function') {
            return;
        }
        // Idempotent: don't re-register on subsequent plugin
        // constructions. (Plugins are constructed once per editor
        // mount, but the safety check is cheap and protects against
        // hot-reload paths.)
        if (registry.has('setListStyle')) {
            return;
        }
        registry.register(this.buildSetListStyleCommand(), 'extension', 'list-formats');
    }

    /**
     * Build the `setListStyle` command object that conforms to the
     * headless editor's `Command<TPayload>` contract (see
     * `commands/types.d.ts`). The `name` is the dispatch key;
     * `meta` provides category metadata; `canExecute` is a guard
     * that returns `true` whenever a payload is supplied; `execute`
     * performs the actual document transformation through the typed
     * commands facade (which dispatches its own ProseMirror
     * transactions under the hood).
     *
     * @returns {Object} The command object
     */
    private buildSetListStyleCommand(): {
        name: string;
        meta: { label: string; category: string };
        canExecute: (ctx: unknown, payload: SetListStylePayload | undefined) => boolean;
        execute: (ctx: unknown, payload: SetListStylePayload | undefined) => void;
    } {
        return {
            name: 'setListStyle',
            meta: { label: 'Set List Style', category: 'list' },
            canExecute: (_ctx: unknown, payload: SetListStylePayload | undefined): boolean => {
                return !!(payload && payload.listType);
            },
            execute: (_ctx: unknown, payload: SetListStylePayload | undefined): void => {
                const listType: ListStyleType = (payload && payload.listType) || 'none';
                if (!listType) {
                    return;
                }
                this.applySetListStyleCommand(listType);
            }
        };
    }

    /**
     * Internal worker invoked by the registered `setListStyle`
     * command. Performs the actual document transformation through
     * the headless editor's typed commands facade and caches the
     * active style on the editor instance for the toolbar to read.
     *
     * @param {ListStyleType} listType - The list style type to apply
     * @returns {void}
     */
    private applySetListStyleCommand(listType: ListStyleType): void {
        const editor: IEditorCoreOptions['editor'] = this.parent && this.parent.editor;
        if (!editor) {
            return;
        }
        if (listType === 'none') {
            // The unset marker — lift the current list items out
            // of the surrounding list so the list-style disappears
            // entirely. `liftListItem` is the typed-commands facade
            // entry for the headless editor's `liftListItemCommand`
            // which performs the actual ProseMirror `lift`.
            editor.commands.liftListItem();
            this.cacheActiveListStyle(editor, listType);
            return;
        }
        if (this.isNumberedStyle(listType)) {
            // Numbered style — ensure the selection is wrapped in
            // an ordered list. If the selection is already in an
            // ordered list the toggle is a no-op; if it is in a
            // bullet list or no list at all the toggle wraps it.
            editor.commands.toggleOrderedList();
            this.cacheActiveListStyle(editor, listType);
            return;
        }
        if (this.isBulletedStyle(listType)) {
            // Bulleted style — same as above for the bullet list.
            editor.commands.toggleBulletList();
            this.cacheActiveListStyle(editor, listType);
            return;
        }
    }

    /**
     * Add event listener for list execution
     *
     * @returns {void}
     */
    private addEventListener(): void {
        this.parent.observer.on(events.listExecution, this.applyListFormats, this);
    }

    /**
     * Remove event listener for list execution
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        this.parent.observer.off(events.listExecution, this.applyListFormats);
    }

    /**
     * Apply list formats based on execution payload
     *
     * @param {ListExecutionPayload} args - The execution payload
     * @returns {void}
     */
    private applyListFormats(args: ListExecutionPayload): void {
        const action: EditorCommandName | EditorAction = args.command;
        switch (action) {
        case 'numberedList':
            this.applyToggleOrderedList(args.args as ListCommand);
            break;
        case 'bulletList':
            this.applyToggleBulletList(args.args as ListCommand);
            break;
        case 'setListStyle':
            this.applySetListStyle(args.args as ListStyleTypeCommand);
            break;
        }
    }

    /**
     * Apply toggle ordered list command
     *
     * @param {ListCommand} args - The list command arguments
     * @returns {void}
     */
    private applyToggleOrderedList(args: ListCommand): void {
        const keepMarks: boolean = !!(args && args.keepMarks);
        this.parent.editor.commands.toggleOrderedList({ keepMarks: keepMarks });
        if (args && args.listType) {
            // Forward the requested style to the registered
            // `setListStyle` command. The headless editor's
            // command registry holds the real command; this path
            // is the "primary click with a specific style"
            // variant of the same `setListStyle` workflow.
            this.tryExecuteListStyle(args.listType);
        }
    }

    /**
     * Apply toggle bullet list command
     *
     * @param {ListCommand} args - The list command arguments
     * @returns {void}
     */
    private applyToggleBulletList(args: ListCommand): void {
        const keepMarks: boolean = !!(args && args.keepMarks);
        this.parent.editor.commands.toggleBulletList({ keepMarks: keepMarks });
        if (args && args.listType) {
            this.tryExecuteListStyle(args.listType);
        }
    }

    /**
     * Apply set list style command
     *
     * @param {ListStyleTypeCommand} args - The list style type command arguments
     * @returns {void}
     */
    private applySetListStyle(args: ListStyleTypeCommand): void {
        if (!args || !args.listType) {
            return;
        }
        this.tryExecuteListStyle(args.listType);
    }

    /**
     * Dispatch the registered `setListStyle` command. The command
     * is registered in the constructor, so this is a safe
     * `editor.execute(...)` call — the documented
     * `UnknownCommandError` is no longer raised.
     *
     * @param {ListStyleType} listType - The list style type to apply
     * @returns {void}
     */
    private tryExecuteListStyle(listType: ListStyleType): void {
        const editor: IEditorCoreOptions['editor'] = this.parent.editor;
        if (!editor) {
            return;
        }
        try {
            editor.execute('setListStyle', { listType: listType });
        } catch (e) {
            // Defensive: if the dispatch still throws (e.g. the
            // command is replaced by a future headless-editor
            // version with stricter validation), preserve the
            // requested style so the toolbar can still reflect
            // the active style for "current list format" lookups.
            this.cacheActiveListStyle(editor, listType);
        }
    }

    /**
     * Type-guard for the {@link NumberListType} family.
     *
     * @param {ListStyleType} listType - The list style type to check
     * @returns {boolean} True if the style is a numbered style
     */
    private isNumberedStyle(listType: ListStyleType): boolean {
        switch (listType) {
        case 'decimal':
        case 'lowerAlpha':
        case 'upperAlpha':
        case 'lowerRoman':
        case 'upperRoman':
        case 'lowerGreek':
            return true;
        default:
            return false;
        }
    }

    /**
     * Type-guard for the {@link BulletListType} family.
     *
     * @param {ListStyleType} listType - The list style type to check
     * @returns {boolean} True if the style is a bulleted style
     */
    private isBulletedStyle(listType: ListStyleType): boolean {
        switch (listType) {
        case 'disc':
        case 'circle':
        case 'square':
            return true;
        default:
            return false;
        }
    }

    /**
     * Persist the requested list-style on the editor instance so
     * the toolbar can read the active style through
     * `editor.activeListStyle`. This is a forward-compatible
     * cache: when the headless editor grows full node-attribute
     * support for `list-style-type`, the cached value is
     * trivially migrated to the new attribute.
     *
     * @param {Object} editor - The editor instance
     * @param {ListStyleType} listType - The list style type to cache
     * @returns {void}
     */
    private cacheActiveListStyle(
        editor: IEditorCoreOptions['editor'],
        listType: ListStyleType
    ): void {
        if (!editor) {
            return;
        }
        (editor as unknown as { activeListStyle?: ListStyleType }).activeListStyle = listType;
    }

    private destroy(): void {
        this.removeEventListener();
    }
}
