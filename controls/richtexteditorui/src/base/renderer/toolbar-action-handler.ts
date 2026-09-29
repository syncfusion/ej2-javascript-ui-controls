/**
 * Toolbar action handler.
 *
 * Routes toolbar actions, executes commands, and asks the toolbar
 * status updater to re-sync the toolbar after every interaction. All
 * visual-state concerns (active-class management, dropdown launcher text,
 * color picker value, etc.) are owned by {@link ToolbarStatusUpdater}.
 * This handler is intentionally thin: it just runs the command and
 * requests a refresh.
 */

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IColorPickerEventArgs } from '../toolbar-interface';
import { EditorCommandExecutor } from './editor-integration';
import { ToolbarRenderer } from './toolbar-renderer';
import { ColorCommand } from '../../controller/interface';
import { RichTextEditorUI } from '../../richtexteditor-ui';
import * as events from '../../common/constant';

const IMAGE_QUICK_TOOLBAR_COMMANDS: readonly string[] = [
    'altText', 'caption', 'alignImage', 'setAlignImage',
    'displayImage', 'inlineImage', 'breakImage', 'wrapTextImage',
    'setWrapTextImage', 'dimensionImage', 'replaceImage', 'removeImage'
];


/** Notifies the toolbar to refresh its status. */
export type ToolbarStatusRefresh = () => void;

/**
 * Handles toolbar interactions:
 * - Executes commands
 * - Enforces read-only mode
 * - Syncs editor state
 * - Delegates complex controls
 * - Requests a toolbar status refresh after each interaction
 */
export class ToolbarActionHandler {

    /** Per-item custom handlers for complex controls */
    private handlers: { [itemId: string]: ToolbarItemHandler };

    /** Executes commands on the headless editor */
    private controller: EditorCommandExecutor;

    /** RTE instance for raising events */
    private rteInstance: IRichTextEditorMinimal;

    /** Renderer for applying visual state changes */
    private renderer: ToolbarRenderer;

    /** Optional toolbar status refresh callback. */
    private statusRefresh: ToolbarStatusRefresh | null;

    constructor(
        controller: EditorCommandExecutor,
        rteInstance: IRichTextEditorMinimal,
        renderer: ToolbarRenderer,
        statusRefresh?: ToolbarStatusRefresh
    ) {
        this.controller = controller;
        this.rteInstance = rteInstance;
        this.renderer = renderer;
        this.handlers = {};
        this.statusRefresh = statusRefresh || null;
    }

    /*
     * Sets (or replaces) the toolbar status refresh callback. The host can
     * wire it up after construction if it isn't available at construct time.
     *
     * @param {ToolbarStatusRefresh | null} callback - The refresh callback
     * @returns {void}
     */
    public setStatusRefresh(callback: ToolbarStatusRefresh | null): void {
        this.statusRefresh = callback;
    }

    /*
     * Handles toolbar item clicks.
     *
     * Executes the item's command and refreshes toolbar status.
     *
     * @param itemId - Clicked item ID
     * @param item - Item reference
     * @param originalEvent - Source event
     */
    public handleItemClick(itemId: string, item: ItemRef, originalEvent: Event, parent?: RichTextEditorUI): void {
        if (!item || !item.command) {
            return;
        }
        if (!parent.isSelectionInRTE()) {
            return;
        }
        // Items whose command names map to a sub-component dialog are
        // routed through the RTE's `open<Feature>Dialog` callback (e.g.
        // `openImageDialog` set by `ImageModule`). Built-in mark / block
        // / list commands fall through to the controller.
        if (item.command === 'image') {
            const opener: (() => void) | null | undefined = (this.rteInstance as unknown as {
                openImageDialog?: (() => void) | null | undefined;
            }).openImageDialog;
            if (typeof opener === 'function') {
                opener();
                this.requestStatusRefresh();
                return;
            }
        }
        const selection: Selection = parent.inputElement.ownerDocument.getSelection();
        switch (item.command) {
        case 'createLink':
        case 'editLink':
            if (parent) {
                parent.notify(events.insertLink, {
                    member: 'link',
                    item: item,
                    originalEvent: originalEvent,
                    selection: selection
                });
            }
            this.requestStatusRefresh();
            return;
        case 'copyLink':
        case 'openLink':
        case 'removeLink':
            if (parent) {
                parent.notify(events.linkOperations, {
                    member: 'link',
                    item: item,
                    originalEvent: originalEvent,
                    selection: selection
                });
            }
            this.requestStatusRefresh();
            return;
        }
        if (item.command && IMAGE_QUICK_TOOLBAR_COMMANDS.indexOf(item.command) !== -1) {
            parent.notify(events.imageOperations, {
                member: 'image',
                item: item,
                originalEvent: originalEvent,
                selection: selection
            });
            this.requestStatusRefresh();
            return;
        }
        if (this.controller && this.controller.process) {
            const mouseEvent: MouseEvent = originalEvent as MouseEvent;
            this.controller.process(this.rteInstance, item.command, mouseEvent);
        }
        this.requestStatusRefresh();
    }

    /*
     * Handles dropdown and split-button selections.
     *
     * Executes the selected command and refreshes toolbar status.
     *
     * @param itemId - Parent item ID
     * @param args - Selection arguments (command / value)
     */
    public handleSelect(itemId: string, args: { command?: string; value?: unknown }): void {
        const command: string = args && typeof args.command === 'string' ? args.command : '';
        if (!command) {
            return;
        }
        const value: unknown = (args && typeof args !== 'undefined' && 'value' in args) ? args.value : undefined;
        if (IMAGE_QUICK_TOOLBAR_COMMANDS.indexOf(command) !== -1) {
            this.rteInstance.notify(events.imageOperations, {
                member: 'image',
                item: { id: itemId, command: command },
                value: value
            });
            this.requestStatusRefresh();
            return;
        }
        if (this.controller.process) {
            this.controller.process(this.rteInstance, command, undefined, value);
        }
        this.requestStatusRefresh();
    }

    /*
     * Invoke the host's status-refresh callback if it was wired up.
     *
     * @returns {void}
     * @private
     */
    private requestStatusRefresh(): void {
        if (this.statusRefresh) {
            try {
                this.statusRefresh();
            } catch (e) {
                /* Never let a refresh failure break the click handler. */
            }
        }
    }
    /*
     * Handles a colorPicker value change.
     *
     * @param itemId - The stable item ID of the colorPicker
     * @param args - The (renderer-enriched) change event arguments
     */
    public handleChange(itemId: string, args: IColorPickerEventArgs): void {
        const command: string = args && typeof args.item.command === 'string' ? args.item.command : '';
        if (!command) {
            return;
        }
        if (this.controller.process) {
            const pickedColor: string = !isNullOrUndefined(args) && !isNullOrUndefined(args.item) ? args.item.value : undefined;
            const colorCommand: ColorCommand = { color: pickedColor };
            this.controller.process(this.rteInstance, command, args.event as MouseEvent | KeyboardEvent, colorCommand);
        }
    }

    /*
     * Destroys all registered handlers and cleans up.
     */
    public destroy(): void {
        const keys: string[] = Object.keys(this.handlers);
        for (let i: number = 0; i < keys.length; i++) {
            const handler: ToolbarItemHandler = this.handlers[keys[i as number] as string];
            if (handler.destroy) {
                handler.destroy();
            }
        }
        this.handlers = {};
        this.statusRefresh = null;
    }
}

/** Minimal RichTextEditor surface needed by the action handler */
interface IRichTextEditorMinimal {
    trigger(eventName: string, args: object): void;
    notify(eventName: string, args: object): void;
}

/**
 * Optional per-item handler interface for complex controls that manage
 * their own interactions (e.g., font-name dropdown, color picker).
 */
export interface ToolbarItemHandler {
    /** Called when the item's primary action is triggered */
    onClick?(event: Event): void;
    /** Called when a dropdown/popup is opened */
    onOpen?(args: object): void;
    /** Called when a dropdown/popup is closed */
    onClose?(args: object): void;
    /** Called when a dropdown menu item is selected */
    onSelect?(args: object): void;
    /** Called when a value control (e.g., colorPicker) changes */
    onChange?(args: object): void;
    /** Called when the handler should clean up */
    destroy?(): void;
}

/** Internal normalized item shape (mirrors ToolbarItemModel, avoids cross-import) */
interface ItemRef {
    id: string;
    command?: string;
}

export interface LinkEventArgs {
    itemId: string
    item: ItemRef
    originalEvent: MouseEvent | KeyboardEvent
    selection?: Selection
    element?: HTMLElement
}

export interface ImageEventArgs {
    itemId?: string
    item: ItemRef
    originalEvent?: MouseEvent | KeyboardEvent
    selection?: Selection
    value?: unknown
}
