/**
 * Base toolbar.
 *
 * Composes normalizer + renderer + action handler into a single unit.
 * The main toolbar (and any future quick-access toolbar) both extend
 * from this class.
 */

import {
    ToolbarItem, ToolbarItemUpdate, AddToolbarItem, RemoveToolbarItem,
    ToolbarType
} from '../../richtexteditor-ui/model';
import { L10n } from '@syncfusion/ej2-base';
import { EditorCommandExecutor } from './editor-integration';
import { ToolbarItemNormalizer, ToolbarInitializationError, ToolbarItemModel } from './toolbar-item-normalizer';
import { ToolbarRenderer, ToolbarPopupSync } from './toolbar-renderer';
import { ToolbarActionHandler } from './toolbar-action-handler';
import { RichTextEditorUI } from '../../richtexteditor-ui';
import { FontColorModel, BackgroundColorModel } from '../../richtexteditor-ui/model/color-picker-settings-model';

/**
 * Composes ToolbarItemNormalizer, ToolbarRenderer, and ToolbarActionHandler into
 * a fully functional toolbar instance.
 */
export class EditorToolbar {

    /** Normalizer — converts ToolbarItem union to internal models */
    private itemNormalizer: ToolbarItemNormalizer | null;

    /** Renderer — manages EJ2 Toolbar and nested controls */
    private renderer: ToolbarRenderer | null;

    /** Action handler — routes clicks and syncs editor state */
    private actionHandler: ToolbarActionHandler | null;

    /** Current normalized items (maintained in sync with renderer) */
    private normalizedItems: ToolbarItemModel[];
    /** Resolved editor shortcuts used by built-in toolbar items. */
    private shortcuts: Readonly<Record<string, string>>;

    constructor() {
        this.itemNormalizer = null;
        this.renderer = null;
        this.actionHandler = null;
        this.normalizedItems = [];
        this.shortcuts = {};
    }

    /*
     * Renders the toolbar.
     *
     * @param options - Render options
     */
    public render(options: BaseToolbarOptions): void {
        this.itemNormalizer = new ToolbarItemNormalizer(options.localeObj, options.toolbarContext);
        this.shortcuts = options.shortcuts || {};
        const normalized: ToolbarItemModel[] = this.itemNormalizer.createAll(options.items, this.shortcuts);
        this.normalizedItems = normalized;

        this.renderer = new ToolbarRenderer(options.rteInstance as RichTextEditorUI);
        this.actionHandler = new ToolbarActionHandler(
            options.controller,
            options.rteInstance,
            this.renderer,
            options.statusRefresh
        );
        /* The renderer's `ToolbarItemModel` is module-private; structurally
         * the normalizer's `ToolbarItemModel` (which the renderer re-uses
         * internally) matches, so the cast at the boundary is the only one
         * required. */
        this.renderer.render(
            options.element,
            normalized as unknown as Parameters<ToolbarRenderer['render']>[1],
            this.actionHandler as unknown as Parameters<ToolbarRenderer['render']>[2],
            options.type,
            options.popupSync || null
        );
    }

    /*
     * Adds an item to the toolbar at the given index.
     *
     * @param item - The item to add
     * @param index - Insertion position (default: end)
     */
    public addItem(item: ToolbarItem, index?: number): void {
        if (!this.itemNormalizer || !this.renderer) {
            return;
        }
        const position: number = (index !== undefined) ? index : this.normalizedItems.length;
        const normalized: ToolbarItemModel = this.itemNormalizer.create(item, position, this.shortcuts);
        if (index !== undefined) {
            this.normalizedItems.splice(index, 0, normalized);
        } else {
            this.normalizedItems.push(normalized);
        }
        this.renderer.addItem(
            normalized as unknown as Parameters<ToolbarRenderer['addItem']>[0],
            index
        );
    }

    /*
     * Removes an item from the toolbar.
     *
     * @param itemId - The stable item ID to remove
     */
    public removeItem(itemId: string): void {
        if (!this.renderer) {
            return;
        }
        for (let i: number = 0; i < this.normalizedItems.length; i++) {
            if (this.normalizedItems[i as number].source === itemId) {
                itemId = this.normalizedItems[i as number].id;
                this.normalizedItems.splice(i, 1);
                break;
            }
        }
        this.renderer.removeItem(itemId);
    }

    /*
     * Applies a batch of toolbar item updates.
     * If an `add` operation would introduce a duplicate ID,
     * the entire batch is rejected before applying any update.
     * @param updates - Array of update operations
     */
    public updateItems(updates: ToolbarItemUpdate[]): void {
        // Pre-validation: collect IDs of all add operations and check for duplicates
        const existingIds: string[] = [];
        for (let i: number = 0; i < this.normalizedItems.length; i++) {
            existingIds.push(this.normalizedItems[i as number].id);
        }
        const addedIds: string[] = [];
        for (let i: number = 0; i < updates.length; i++) {
            const update: ToolbarItemUpdate = updates[i as number];
            if (update.action === 'add') {
                const addOp: AddToolbarItem = update as AddToolbarItem;
                const candidateId: string = this.resolveItemId(addOp.item);
                if (existingIds.indexOf(candidateId) !== -1 || addedIds.indexOf(candidateId) !== -1) {
                    throw new ToolbarInitializationError(
                        'updateItems batch rejected: duplicate item ID "' + candidateId + '" in add operation.'
                    );
                }
                addedIds.push(candidateId);
            }
        }

        // Apply updates
        for (let i: number = 0; i < updates.length; i++) {
            const update: ToolbarItemUpdate = updates[i as number];
            switch (update.action) {
            case 'add': {
                const op: AddToolbarItem = update as AddToolbarItem;
                this.addItem(op.item, op.index);
                break;
            }
            case 'remove': {
                const op: RemoveToolbarItem = update as RemoveToolbarItem;
                this.removeItem(op.itemId);
                break;
            }
            default:
                break;
            }
        }
    }

    /*
     * Destroys the toolbar and all sub-modules.
     */
    public destroy(): void {
        if (this.renderer) {
            this.renderer.destroy();
            this.renderer = null;
        }
        if (this.actionHandler) {
            this.actionHandler.destroy();
            this.actionHandler = null;
        }
        if (this.itemNormalizer) {
            this.itemNormalizer.destroy();
            this.itemNormalizer = null;
        }
        this.normalizedItems = [];
    }

    /**
     * Gets the toolbar renderer instance.
     *
     * Used by toolbar status updater to update toolbar UI.
     *
     * @returns {ToolbarRenderer | null} The toolbar renderer, or null if not yet initialized.
     * @internal
     */
    public getRenderer(): ToolbarRenderer | null {
        return this.renderer;
    }

    //Refresh Toolbar
    public refreshOverflow(): void {
        if (this.renderer) {
            this.renderer.refreshOverflow();
        }
    }

    /*
     * Destroys popup-owning nested controls so they can be recreated later.
     *
     * @returns {void}
     */
    public resetQuickPopupNestedItems(): void {
        if (!this.renderer || !this.renderer.isRendered) {
            return;
        }
        this.renderer.resetQuickPopupNestedItems();
    }

    /*
     * Recreates popup-owning nested controls that were reset earlier.
     *
     * @returns {void}
     */
    public ensureQuickPopupNestedItems(): void {
        if (!this.renderer || !this.actionHandler || !this.renderer.isRendered) {
            return;
        }
        this.renderer.ensureQuickPopupNestedItems(
            this.normalizedItems as unknown as Parameters<ToolbarRenderer['ensureQuickPopupNestedItems']>[0],
            this.actionHandler as unknown as Parameters<ToolbarRenderer['ensureQuickPopupNestedItems']>[1]
        );
    }

    /*
     * Resolves the stable ID that a ToolbarItem would receive after normalization.
     * Used for pre-validation in updateItems.
     */
    private resolveItemId(item: ToolbarItem): string {
        if (item === '|') {
            return '__separator';
        }
        if (typeof item === 'string') {
            return item;
        }
        /* The non-string form is either a built-in config (has `item`, no
         * `actionId`) or a custom toolbar item (has `id` / `actionId`). */
        if ('item' in item && !('actionId' in item)) {
            const builtIn: string = (item as { item: string }).item;
            return builtIn;
        }
        const custom: { id?: string; actionId?: string } = item as { id?: string; actionId?: string };
        return custom.id || custom.actionId || '';
    }
}

/** Minimal RichTextEditor surface needed by BaseToolbar (avoids circular import) */
interface IRichTextEditorMinimal {
    trigger(eventName: string, args: object): void;
    notify(eventName: string, args: object): void;
    fontColor?: FontColorModel;
    backgroundColor?: BackgroundColorModel;
}

/**
 * Options passed to BaseToolbar.render().
 */
export interface BaseToolbarOptions {
    /** Host element for the toolbar */
    element: HTMLElement;
    /** Initial set of toolbar items */
    items: ToolbarItem[];
    /** Toolbar layout type */
    type: ToolbarType;
    /** Narrow editor command executor interface — do not pass EditorController directly */
    controller: EditorCommandExecutor;
    /** RTE instance for event delegation */
    rteInstance: IRichTextEditorMinimal;
    /** Locale used to resolve built-in toolbar labels. */
    localeObj?: L10n | null;
    /** Optional status refresh callback for toolbar actions. */
    statusRefresh?: () => void;
    /** Optional callback invoked before toolbar popups open to sync popup state. */
    popupSync?: ToolbarPopupSync;
    /** Quick-toolbar kind used to resolve duplicate item IDs across registries. */
    toolbarContext?: 'Image' | 'Table' | 'Link' | null;
    /** Resolved editor shortcuts keyed by editor command name. */
    shortcuts?: Readonly<Record<string, string>>;
}
