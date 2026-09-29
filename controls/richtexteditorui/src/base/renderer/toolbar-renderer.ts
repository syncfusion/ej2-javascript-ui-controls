/**
 * Toolbar renderer.
 *
 * Manages the EJ2 Toolbar instance and all nested toolbar items
 * (button, dropdown, splitButton, colorPicker, template).
 *
 * Per spec §26: Items with missing feature modules remain visible-but-disabled.
 * They are never skipped from rendering.
 */

import { ClickEventArgs, Toolbar as EJ2Toolbar, ItemModel } from '@syncfusion/ej2-navigations';
import { DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { SplitButton } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, PaletteTileEventArgs } from '@syncfusion/ej2-inputs';
import { Tooltip } from '@syncfusion/ej2-popups';
import { ToolbarItem, ToolbarType, ToolbarPosition } from '../../richtexteditor-ui/model';
import { NumberFormatListItem, BulletFormatListItem, BulletFormatList, BulletFormatLists, NumberFormatLists, NumberFormatList } from '../../richtexteditor-ui/model/list-settings';
import { RichTextEditorUI } from '../../richtexteditor-ui';
import { FontColorModel, BackgroundColorModel } from '../../richtexteditor-ui/model/color-picker-settings-model';
import { ColorPickerType, DEFAULT_BGCOLOR_PRESETS, DEFAULT_FONTCOLOR_PRESETS } from '../../richtexteditor-ui/model/color-picker.types';
import { CLS_OVERLAY } from '../classes';
import { addClass, createElement, detach } from '@syncfusion/ej2-base';
import * as classes from '../classes';
import { IColorPickerEventArgs } from '../toolbar-interface';
import { ToolbarItemClickedEventArgs } from '../../richtexteditor-ui/model/toolbar-settings';



/**
 * Renders the EJ2 Toolbar and all nested controls for toolbar items.
 */
export class ToolbarRenderer {

    /** Map of item ID → nested EJ2 instance (for dropdown, splitButton, colorPicker items) */
    private nestedItems: { [itemId: string]: NestedItemInstance };

    /** Map of item ID → root HTMLElement for show/hide/enable/disable */
    private itemElements: { [itemId: string]: HTMLElement };

    /** Map of item ID → EJ2 Tooltip instance for the corresponding item */
    private tooltips: { [itemId: string]: Tooltip };

    /** A single, shared EJ2 Tooltip instance used to show all toolbar item tooltips via a CSS selector */
    private sharedTooltip: Tooltip | null;

    /** The host element for the toolbar */
    private hostElement: HTMLElement | null;

    /** A reference back to the action handler, needed for delayed wiring */
    private actionHandler: IActionHandler | null;

    /** Optional callback invoked before a toolbar popup opens to sync state. */
    private popupSync: ToolbarPopupSync | null;

    /** The EJ2 Toolbar instance */
    public ej2Toolbar: EJ2Toolbar | null;

    /** The parent RTE instance */
    public parent: RichTextEditorUI;

    /** Whether the toolbar is positioned at the bottom (drives tooltip position) */
    private isBottomToolbar: boolean | null;

    /** Whether the renderer currently owns a live EJ2 toolbar instance. */
    public isRendered: boolean;

    /** Active-state CSS class applied to a toolbar item when its format is active. */
    public static readonly ACTIVE_CLASS: string = 'e-active';

    /** Disabled CSS class */
    private static DISABLED_CLASS: string = 'e-disabled';

    constructor(parent: RichTextEditorUI, position?: ToolbarPosition) {
        this.nestedItems = {};
        this.itemElements = {};
        this.tooltips = {};
        this.sharedTooltip = null;
        this.hostElement = null;
        this.ej2Toolbar = null;
        this.actionHandler = null;
        this.popupSync = null;
        this.parent = parent;
        this.isBottomToolbar = (position === 'Bottom');
        this.isRendered = false;
    }

    /*
     * Renders the toolbar onto the given element.
     *
     * @param element - Host element to render the toolbar into
     * @param items - Normalized toolbar items
     * @param actionHandler - Handler for toolbar item interactions
     * @param type - Toolbar display type to map to EJ2 overflowMode
     * @param popupSync - Optional callback for popup state synchronization.
     */
    public render(
        element: HTMLElement,
        items: ToolbarItemModel[],
        actionHandler: IActionHandler,
        type: ToolbarType,
        popupSync: ToolbarPopupSync | null = null
    ): void {
        this.hostElement = element;
        this.actionHandler = actionHandler;
        this.popupSync = popupSync;
        const toolbarItems: ItemModel[] = this.buildToolbarItems(items, actionHandler);
        this.ej2Toolbar = new EJ2Toolbar({
            items: toolbarItems,
            overflowMode: this.mapToolbarTypeToOverflowMode(type),
            width: '100%',
            cssClass: classes.CLS_TOOLBAR + ' ' + classes.CLS_RTE_ELEMENTS,
            clicked: (args: ClickEventArgs): void => {
                if (!args.item) {
                    return;
                }
                const clickedItem: ToolbarItemModel | undefined = items.find((item: ToolbarItemModel) => item.id === args.item.id);
                const eventArgs: ToolbarItemClickedEventArgs = {
                    item: clickedItem,
                    event: args.originalEvent,
                    cancel: false
                };
                if (this.parent.toolbarSettings.itemClicked) {
                    this.parent.toolbarSettings.itemClicked.call(this.parent, eventArgs);
                }
            }
        });
        this.ej2Toolbar.appendTo(element);

        /* Mount nested controls and collect toolbar item references. */
        this.collectItemElements(items, actionHandler);

        // Initialize a single shared Tooltip instance for the whole toolbar.
        // Per spec: must be called once after the toolbar (and all items) are rendered.
        this.initTooltips();
        this.isRendered = true;
    }

    // Refresh Toolbar
    public refreshOverflow(): void {
        this.ej2Toolbar.refreshOverflow();
    }

    /*
     * Destroys popup-owning nested toolbar controls so they can be recreated
     * later with fresh popup positioning state.
     *
     * @returns {void}
     */
    public resetQuickPopupNestedItems(): void {
        if (!this.isRendered) {
            return;
        }
        const nestedIds: string[] = Object.keys(this.nestedItems);
        for (let i: number = 0; i < nestedIds.length; i++) {
            const id: string = nestedIds[i as number];
            const inst: NestedItemInstance = this.nestedItems[id as string];
            if (inst instanceof DropDownButton || inst instanceof SplitButton || inst instanceof ColorPicker) {
                inst.destroy();
                delete this.nestedItems[id as string];
                this.cleanupQuickPopupHost(id);
            }
        }
    }

    /*
     * Recreates popup-owning nested controls that were previously reset.
     *
     * @param {ToolbarItemModel[]} items - Normalized toolbar items
     * @param {IActionHandler} actionHandler - Toolbar action handler
     * @returns {void}
     */
    public ensureQuickPopupNestedItems(items: ToolbarItemModel[], actionHandler: IActionHandler): void {
        if (!this.isRendered || !this.hostElement) {
            return;
        }
        for (let i: number = 0; i < items.length; i++) {
            const item: ToolbarItemModel = items[i as number];
            if (!this.isQuickPopupNestedControl(item.controlType) || this.nestedItems[item.id as string]) {
                continue;
            }
            const slotEl: HTMLElement | null = this.resolveItemElement(item.id);
            if (!slotEl) {
                continue;
            }
            this.prepareQuickPopupHost(item, slotEl);
            this.renderNestedControl(item, actionHandler);
            this.itemElements[item.id] = slotEl;
        }
    }

    /*
     * Maps the editor toolbar type to the EJ2 Toolbar overflowMode value.
     */
    private mapToolbarTypeToOverflowMode(type: ToolbarType): 'Scrollable' | 'Popup' | 'MultiRow' | 'Extended' {
        switch (type) {
        case 'Expanded':
            return 'Extended';
        case 'MultiRow':
            return 'MultiRow';
        case 'Scrollable':
        default:
            return 'Scrollable';
        }
    }

    /*
     * Sets or clears the popup sync callback.
     */
    public setPopupSync(sync: ToolbarPopupSync | null): void {
        this.popupSync = sync;
    }

    /*
     * Adds an item to the toolbar at the given index.
     *
     * @param item - Normalized item to add
     * @param index - Insertion position (default: end)
     */
    public addItem(item: ToolbarItemModel, index?: number): void {
        const toolbarItem: ItemModel = item.toolbarItem;
        const parentId: string| undefined = this.hostElement?.parentElement?.id?.replace(/_wrapper$/, '');
        toolbarItem.id = `${parentId}_${item.id}`;
        const insertIndex: number = (index !== undefined) ? index : -1;
        if (this.ej2Toolbar) {
            if (insertIndex >= 0) {
                this.ej2Toolbar.addItems([toolbarItem], insertIndex);
            } else {
                this.ej2Toolbar.addItems([toolbarItem]);
            }
        }
        if (item.controlType !== 'button' && item.controlType !== 'template' && item.controlType !== 'separator' && this.actionHandler) {
            this.renderNestedControl(item, this.actionHandler);
        }
        const el: HTMLElement | null = this.resolveItemElement(item.id);
        if (el) {
            this.itemElements[item.id] = el;
            if (item.shortcut) {
                el.setAttribute('aria-keyshortcuts', item.shortcut);
            }
        }
        // Ensure the shared tooltip is live (idempotent — no-op if already initialized).
        this.initTooltips();
    }

    /*
     * Removes an item from the toolbar, destroying any nested EJ2 instance.
     *
     * @param itemId - The stable item ID to remove
     */
    public removeItem(itemId: string): void {
        const el: HTMLElement | undefined = this.itemElements[itemId as string];
        if (el) {
            // Destroy nested instance if present
            const nested: NestedItemInstance = this.nestedItems[itemId as string];
            if (nested) {
                if (nested instanceof EJ2Toolbar || nested instanceof DropDownButton ||
                    nested instanceof SplitButton || nested instanceof ColorPicker) {
                    nested.destroy();
                }
                delete this.nestedItems[itemId as string];
            }
            // Destroy tooltip if present
            this.destroyTooltip(itemId);
            // Remove the element from the toolbar
            if (this.ej2Toolbar) {
                this.ej2Toolbar.removeItems(el);
            }
            delete this.itemElements[itemId as string];
        }
    }

    /*
     * Returns the toolbar item element for the given ID.
     *
     * @param itemId - The stable item ID (built-in name like 'Bold' or full id)
     * @returns {HTMLElement | null} The toolbar item element, or null if not present
     */
    public getItemElement(itemId: string): HTMLElement | null {
        const cached: HTMLElement | undefined = this.itemElements[itemId as string];
        if (cached && this.hostElement && this.hostElement.contains(cached)) {
            return cached;
        }
        return this.resolveLiveItem(itemId);
    }

    public getFontNameDropdownWidth(): string {
        return this.parent.fontFamily.width;
    }

    /*
     * Resolves a toolbar item element by name or ID.
     *
     * @param {string} itemName - The id or built-in name (case-sensitive)
     * @returns {HTMLElement | null} The live `.e-toolbar-item` element, or null
     */
    public resolveLiveItem(itemName: string): HTMLElement | null {
        if (!this.hostElement) {
            return null;
        }

        /* 1) Exact-id cache hit. */
        const cached: HTMLElement | undefined = this.itemElements[itemName as string];
        if (cached && this.hostElement.contains(cached)) {
            return cached;
        }

        /* 2) Cache suffix match (built-in name -> 'rte_Bold'). */
        const ids: string[] = Object.keys(this.itemElements);
        const suffix: string = '_' + itemName;
        for (let i: number = 0; i < ids.length; i++) {
            const key: string = ids[i as number];
            if (key === itemName || key.endsWith(suffix)) {
                const el: HTMLElement | undefined = this.itemElements[key as string];
                if (el && this.hostElement.contains(el)) {
                    return el;
                }
            }
        }
        return null;
    }

    /*
     * Escapes an ID for safe use in a CSS selector.
     *
     * @param {string} value - The unescaped id
     * @returns {string} The escaped selector fragment
     */
    private escapeSelector(value: string): string {
        if (typeof (CSS as { escape?: (s: string) => string }) !== 'undefined' &&
            typeof (CSS as { escape?: (s: string) => string }).escape === 'function') {
            return (CSS as { escape: (s: string) => string }).escape(value);
        }
        // Manual fallback for environments without CSS.escape
        return value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    }

    /*
     * Returns the DropDownButton nested control for the given item id. Tries the
     * live DOM first (most reliable), then falls back to the cache.
     *
     * @param {string} itemId - The toolbar item id (the prefixed or unprefixed built-in name)
     * @returns {DropDownButton | null} The nested DropDownButton, or null
     */
    public getDropDown(itemId: string): DropDownButton | null {
        return this.findNestedByName<DropDownButton>(itemId, 'e-dropdown-btn');
    }

    /*
     * Returns the SplitButton nested control for the given item id.
     *
     * @param {string} itemId - The item id
     * @returns {SplitButton | null} The nested SplitButton, or null
     */
    public getSplitButton(itemId: string): SplitButton | null {
        return this.findNestedByName<SplitButton>(itemId, 'e-split-btn');
    }

    /*
     * Returns the ColorPicker nested control for the given item id.
     *
     * @param {string} itemId - The item id
     * @returns {ColorPicker | null} The nested ColorPicker, or null
     */
    public getColorPicker(itemId: string): ColorPicker | null {
        return this.findNestedByName<ColorPicker>(itemId, 'e-colorpicker-wrapper');
    }

    /**
     * Finds a nested EJ2 control by item ID.
     *
     * @param {string} itemId - Full or built-in item ID
     * @param {string} markerClass - EJ2 marker class
     * @returns {T | null} Matching control instance
     */
    private findNestedByName<T>(itemId: string, markerClass: string): T | null {
        /* 1) Exact id in the cache. */
        const cached: NestedItemInstance | undefined = this.nestedItems[itemId as string];
        if (cached) {
            return cached as unknown as T;
        }
        /* 2) Suffix match in the cache. itemId is always a built-in literal here,
         *    never user input — eslint-safe to index with bracket notation. */
        const suffix: string = '_' + itemId;
        const keys: string[] = Object.keys(this.nestedItems);
        for (let i: number = 0; i < keys.length; i++) {
            const k: string = keys[i as number];
            if (k === itemId || k.endsWith(suffix)) {
                const inst: NestedItemInstance | undefined = this.nestedItems[k as string];
                if (inst) {
                    return inst as unknown as T;
                }
            }
        }
        return null;
    }

    /*
     * Returns the item elements map (id -> HTMLElement). Used by status updaters.
     *
     * @returns {{ [itemId: string]: HTMLElement }} The item elements map
     */
    public getItemElements(): { [itemId: string]: HTMLElement } {
        return this.itemElements;
    }

    /*
     * Destroys the renderer, all nested EJ2 instances, and the EJ2 toolbar.
     */
    public destroy(): void {
        // Clear the popup sync callback before destroy.
        this.popupSync = null;
        const nestedIds: string[] = Object.keys(this.nestedItems);
        for (let i: number = 0; i < nestedIds.length; i++) {
            const id: string = nestedIds[i as number];
            const inst: NestedItemInstance = this.nestedItems[id as string];
            if (inst instanceof EJ2Toolbar || inst instanceof DropDownButton ||
                inst instanceof SplitButton || inst instanceof ColorPicker) {
                inst.destroy();
            }
        }
        this.nestedItems = {};
        this.itemElements = {};

        // Destroy the shared tooltip (single instance for the whole toolbar)
        this.destroySharedTooltip();
        this.tooltips = {};

        if (this.ej2Toolbar) {
            this.ej2Toolbar.destroy();
            if (this.ej2Toolbar.element) {
                const tbWrapper: HTMLElement = this.ej2Toolbar.element;
                const tbElement: HTMLElement = tbWrapper.parentElement as HTMLElement;
                if (tbWrapper && tbWrapper.classList.contains('e-rte-ui-toolbar')) {
                    detach(tbWrapper);
                }
                if (tbElement && tbElement.classList.contains('e-rte-ui-toolbar-wrapper')) {
                    detach(tbElement);
                }
            }
            this.ej2Toolbar = null;
        }
        this.hostElement = null;
        this.actionHandler = null;
        this.isRendered = false;
        this.isBottomToolbar = null;
    }

    /*
     * Builds the flat ItemModel array for the initial Toolbar render.
     * Complex toolbar items (dropdown, splitButton, colorPicker) use 'Input' type
     * so the Toolbar reserves a slot for the nested instance.
     */
    private buildToolbarItems(items: ToolbarItemModel[], actionHandler: IActionHandler): ItemModel[] {
        const result: ItemModel[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const item: ToolbarItemModel = items[i as number];
            const parentId: string| undefined = this.hostElement?.parentElement?.id?.replace(/_wrapper$/, '');
            item.id = `${parentId}_${item.id}`;
            result.push(this.toToolbarItemModel(item, actionHandler));
        }
        return result;
    }

    /*
     * Converts a normalized item to an EJ2 Toolbar ItemModel.
     * Button items get a direct click binding.
     * Complex items use 'Input' type so the toolbar preserves a container slot.
     */
    private toToolbarItemModel(item: ToolbarItemModel, actionHandler: IActionHandler): ItemModel {
        if (item.controlType === 'separator') {
            return { type: 'Separator' };
        }
        if (item.controlType === 'button') {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self: ToolbarRenderer = this;
            const capturedItem: ToolbarItemModel = item;
            const parent: RichTextEditorUI = this.parent;
            return {
                id: item.id,
                prefixIcon: item.toolbarItem.prefixIcon,
                tooltipText: item.toolbarItem.tooltipText,
                text: item.toolbarItem.text,
                type: 'Button',
                click: function (e: object): void {
                    self.actionHandler?.handleItemClick(capturedItem.id, capturedItem, e as Event, parent);
                }
            };
        }
        if (item.controlType === 'dropdown' || item.controlType === 'splitButton') {
            return {
                id: item.id,
                type: 'Input',
                template: `<button id="${item.id}"></button>`,
                tooltipText: item.toolbarItem.tooltipText
            };
        }
        if (item.controlType === 'colorPicker') {
            return {
                id: item.id,
                type: 'Input',
                template: `<span id="${item.id}"></span>`,
                tooltipText: item.toolbarItem.tooltipText
            };
        }
        return {
            id: item.id,
            type: 'Input',
            template: `<div id="${item.id}">${item.toolbarItem.template}</div>`
        };
    }

    /*
     * Renders the appropriate nested control for complex item types into the
     * 'Input' slot previously created in the Toolbar.
     *
     * Per spec §26: if control construction fails, the item stays visible-but-disabled
     * and emits a MISSING_FEATURE_MODULE diagnostic — never removed from the toolbar.
     */
    private renderNestedControl(item: ToolbarItemModel, actionHandler: IActionHandler): void {
        const slotEl: HTMLElement | null = this.resolveItemElement(item.id);
        if (!slotEl) {
            return;
        }
        try {
            if (item.controlType === 'dropdown') {
                this.renderDropDown(item, slotEl, actionHandler);
            } else if (item.controlType === 'splitButton') {
                this.renderSplitButton(item, slotEl, actionHandler);
            } else if (item.controlType === 'colorPicker') {
                this.renderColorPicker(item, slotEl, actionHandler);
            }
        } catch (e) {
            // Per spec §26: stay visible but disabled; emit diagnostic
            this.markMissingFeature(item, slotEl);
        }
    }

    /*
     * Creates and appends a DropDownButton into the given slot element.
     */
    private renderDropDown(item: ToolbarItemModel, slotEl: HTMLElement, actionHandler: IActionHandler): void {
        const btn: HTMLButtonElement = slotEl.querySelector('button');
        btn.classList.add(classes.CLS_DROPDOWN_BTN);
        const css: string = classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_RTE_ELEMENTS;
        const capturedId: string = item.id;
        const captureKind: string = item.source as string;
        const capturedItems: ActionItemModel[] = item.toolbarItem.items || [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const selfRenderer: ToolbarRenderer = this;
        const ddb: DropDownButton = new DropDownButton({
            content: this.dropdownContent(capturedItems[0].text && item.renderMode && item.renderMode === 'textContent' ? capturedItems[0].text : '', item),
            cssClass: css,
            iconCss:
                item.toolbarItem?.prefixIcon &&
                    (item.toolbarItem.prefixIcon.includes('e-table-columns') || item.toolbarItem.prefixIcon.includes('e-table-rows') || item.toolbarItem.prefixIcon.includes('e-display'))
                    ? item.toolbarItem.prefixIcon
                    : (capturedItems[0] && item.renderMode === 'iconContent' ? capturedItems[0].iconCss : ''),
            items: capturedItems,
            select: function (args: object): void {
                actionHandler.handleSelect(capturedId, enrichSelectArgs(args, capturedItems));
            },
            beforeItemRender: this.beforeDropDownItemRender.bind(this),
            beforeOpen: (e: BeforeOpenCloseMenuEventArgs): void => {
                // Read the latest popup sync callback for late-bound status updates.
                const sync: ToolbarPopupSync | null = selfRenderer.popupSync;
                if (sync) {
                    sync(captureKind, e && (e.element as HTMLElement) ? e.element : null);
                }
            },
            close: () => {
                this.parent.baseEditorCore.focusEditorView();
            }
        });
        ddb.appendTo(btn);
        this.nestedItems[item.id] = ddb;
    }

    /*
     * Creates and appends a SplitButton into the given slot element.
     */
    private renderSplitButton(item: ToolbarItemModel, slotEl: HTMLElement, actionHandler: IActionHandler): void {
        const btn: HTMLButtonElement = slotEl.querySelector('button');
        const capturedId: string = item.id;
        const capturedKind: string = item.source as string;
        const parent: RichTextEditorUI = this.parent;
        let capturedItems: ActionItemModel[] = item.toolbarItem.items || [];
        if (item.source === 'NumberFormatList' && this.parent.listSettings?.numberFormatListItems?.length ) {
            capturedItems = this.parent.listSettings.numberFormatListItems.map((listItem: NumberFormatListItem) => {
                if (typeof listItem !== 'string') {
                    return {
                        id: listItem.text,
                        text: listItem.text,
                        command: 'setListStyle',
                        value: {listType: listItem.listType}
                    } as ActionItemModel;
                }
                return NumberFormatLists.find((item: NumberFormatList) => item.listType === listItem) as unknown as ActionItemModel;
            });
        }
        if ( item.source === 'BulletFormatList' && this.parent.listSettings?.bulletFormatListItems?.length ) {
            capturedItems = this.parent.listSettings.bulletFormatListItems.map((listItem: BulletFormatListItem) => {
                if (typeof listItem !== 'string') {
                    return {
                        id: listItem.text,
                        text: listItem.text,
                        command: 'setListStyle',
                        value: {listType: listItem.listType}
                    } as ActionItemModel;
                }
                return BulletFormatLists.find((item: BulletFormatList) => item.listType === listItem) as unknown as ActionItemModel;
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self: ToolbarRenderer = this;
        const capturedItem: ToolbarItemModel = item;
        const sb: SplitButton = new SplitButton({
            cssClass: classes.CLS_DROPDOWN_BTN + ' ' + classes.CLS_RTE_ELEMENTS ,
            content: capturedItems[0].text && item.renderMode && item.renderMode === 'textContent' ? capturedItems[0].text : '',
            items: capturedItems,
            iconCss: capturedItems[0] && item.renderMode && item.renderMode === 'iconContent' ? item.toolbarItem.prefixIcon : '',
            click: function (e: object): void {
                if (self.actionHandler) {
                    self.actionHandler.handleItemClick(capturedId, capturedItem, e as Event, parent);
                }
            },
            select: function (args: object): void {
                actionHandler.handleSelect(capturedId, enrichSelectArgs(args, capturedItems));
            },
            beforeOpen: (e: BeforeOpenCloseMenuEventArgs): void => {
                // Read the current popup sync callback for late-bound updates.
                const sync: ToolbarPopupSync | null = self.popupSync;
                if (sync) {
                    sync(capturedId, e && e.element ? e.element : null);
                }
            }
        });
        sb.appendTo(btn);
        this.nestedItems[item.id] = sb;
    }

    /*
     * Creates and appends a ColorPicker into the given slot element.
     */
    private renderColorPicker(item: ToolbarItemModel, slotEl: HTMLElement, actionHandler: IActionHandler): void {
        const colorPickerTypeName: string = item.editorColorPickerType || 'BackgroundColor';
        const colorPickerType: ColorPickerType = colorPickerTypeName.toLowerCase() === 'fontcolor' ? 'FontColor' : 'BackgroundColor';
        let cssClass: string = 'e-rte-ui-dropdown e-rte-ui-dropdown-popup';
        if (colorPickerType === 'FontColor') {
            cssClass += ' ' + 'e-rte-ui-font-colorpicker';
        } else {
            cssClass += ' ' + 'e-rte-ui-background-colorpicker';
        }
        const capturedId: string = item.id;
        const capturedType: ColorPickerType = colorPickerType;
        const rte: RichTextEditorUI = this.parent;
        // Resolve the user-supplied color config from the editor model
        const colorConfig: FontColorModel | BackgroundColorModel = this.resolveColorConfig(capturedType, rte);
        const presetColors: { [key: string]: string[] } = this.flattenPresetColors(colorConfig, capturedType);
        /* `prefixIcon` is a string of one-or-more CSS classes. Splitting
         * on whitespace yields the class names. */
        const prefixIcon: string = item.toolbarItem.prefixIcon || '';
        const prefixClasses: string[] = prefixIcon.length > 0 ? prefixIcon.split(/\s+/) : [];
        const host: HTMLElement = this.getOrCreateColorPickerHost(slotEl, item.id);
        const cp: ColorPicker = new ColorPicker({
            beforeTileRender: (args: PaletteTileEventArgs): void => {
                addClass([args.element], ['e-icons', 'e-custom-tile']);
            },
            cssClass: cssClass + ' ' + classes.CLS_RTE_ELEMENTS ,
            created: (): void => {
                const colorPickerDiv: HTMLElement = slotEl.querySelector('.e-colorpicker-wrapper') as HTMLElement;
                if (!colorPickerDiv) {
                    return;
                }
                colorPickerDiv.tabIndex = -1;
                const colorPickerElem: HTMLElement = colorPickerDiv.querySelector('.e-split-colorpicker') as HTMLElement;
                const spanEle: HTMLElement = createElement('span');
                if (prefixClasses.length > 0) {
                    spanEle.classList.add(...prefixClasses);
                }
                if (colorPickerElem) {
                    colorPickerElem.prepend(spanEle);
                }
            },
            value: colorConfig.default,
            mode: colorConfig.mode,
            columns: colorConfig.columns,
            presetColors: presetColors,
            showRecentColors: colorConfig.showRecentColors,
            modeSwitcher: colorConfig.modeSwitcher,
            showButtons: false,
            noColor: true,
            change: (colorPickerArgs: IColorPickerEventArgs) => {
                const colorpickerValue: string = colorPickerArgs.currentValue.rgba;
                colorPickerArgs.item = {
                    command : item.command,
                    value: colorpickerValue
                };
                actionHandler.handleChange(capturedId, colorPickerArgs );
            }
        });
        cp.appendTo(host);
        this.nestedItems[item.id] = cp;
    }

    private isQuickPopupNestedControl(controlType: ToolbarItemModel['controlType']): boolean {
        return controlType === 'dropdown' || controlType === 'splitButton' || controlType === 'colorPicker';
    }

    private cleanupQuickPopupHost(itemId: string): void {
        const slotEl: HTMLElement | null = this.resolveItemElement(itemId);
        if (!slotEl) {
            return;
        }
        this.removeTransientButtons(slotEl, itemId);
        const colorPickerWrapper: HTMLElement | null = slotEl.querySelector('.e-colorpicker-wrapper');
        if (colorPickerWrapper && colorPickerWrapper.parentNode) {
            colorPickerWrapper.parentNode.removeChild(colorPickerWrapper);
        }
        const colorPickerHost: HTMLElement | null = slotEl.querySelector('#' + this.escapeSelector(itemId));
        if (colorPickerHost) {
            colorPickerHost.innerHTML = '';
        }
    }

    private prepareQuickPopupHost(item: ToolbarItemModel, slotEl: HTMLElement): void {
        this.cleanupQuickPopupHost(item.id);
        if (item.controlType === 'colorPicker') {
            this.getOrCreateColorPickerHost(slotEl, item.id);
        }
    }

    private removeTransientButtons(slotEl: HTMLElement, itemId: string): void {
        const existingButton: HTMLElement | null = slotEl.querySelector('#' + this.escapeSelector(itemId + '_btn'));
        if (existingButton && existingButton.parentNode) {
            existingButton.parentNode.removeChild(existingButton);
        }
    }

    private getOrCreateColorPickerHost(slotEl: HTMLElement, itemId: string): HTMLElement {
        let host: HTMLElement | null = slotEl.querySelector('#' + this.escapeSelector(itemId));
        if (!host) {
            host = createElement('span', { id: itemId });
            slotEl.appendChild(host);
        }
        return host;
    }

    /**
     * Returns the color configuration for the specified picker type.
     *
     * @param {ColorPickerType} type - Picker type.
     * @param {RichTextEditor} rte - Parent editor instance.
     * @returns {FontColorModel | BackgroundColorModel} Resolved color settings.
     */
    private resolveColorConfig(type: ColorPickerType, rte: RichTextEditorUI): FontColorModel | BackgroundColorModel {
        return (type === 'FontColor' ? rte?.fontColor : rte?.backgroundColor) || {};
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Returns preset colors for the EJ2 ColorPicker. The picker-type-specific
     * default (`DEFAULT_FONTCOLOR_PRESETS` or `DEFAULT_BGCOLOR_PRESETS`) is used
     * when no custom `preset` is configured on the model.
     *
     * @param {FontColorModel | BackgroundColorModel} config - Color configuration.
     * @param {ColorPickerType} type - Picker type used to pick the default preset.
     * @returns {{ [key: string]: string[] }} Preset colors.
     */
    private flattenPresetColors(
        config: FontColorModel | BackgroundColorModel,
        type: ColorPickerType
    ): { [key: string]: string[] } {
        if (config && config.preset) {
            return config.preset;
        }
        return type === 'FontColor' ? DEFAULT_FONTCOLOR_PRESETS : DEFAULT_BGCOLOR_PRESETS;
    }

    /**
     * Updates the existing color picker (font or background) configuration.
     *
     * @param {ColorPickerType} type - Which picker to update (`'FontColor'` or `'BackgroundColor'`).
     * @param {FontColorModel | BackgroundColorModel} newColor - New color settings.
     * @param {FontColorModel | BackgroundColorModel} oldColor - Previous settings (optional).
     * @returns {void}
     */
    public updateColor(type: ColorPickerType, newColor: FontColorModel | BackgroundColorModel,
                       oldColor?: FontColorModel | BackgroundColorModel): void {
        const picker: ColorPicker | null = this.getColorPicker(type);
        if (!picker || typeof (picker as { setProperties?: unknown }).setProperties !== 'function') {
            return;
        }
        const newColorMap: Record<string, unknown> = newColor as Record<string, unknown>;
        const oldColorMap: Record<string, unknown> | null = oldColor
            ? (oldColor as Record<string, unknown>)
            : null;
        for (const key of Object.keys(newColor)) {
            switch (key) {
            case 'default': {
                if ((newColor as FontColorModel).default !== undefined) {
                    (picker as { setProperties: (p: object) => void }).setProperties(
                        { value: (newColor as FontColorModel).default }
                    );
                }
                break;
            }
            case 'mode':
                (picker as unknown as { showButtons: boolean }).showButtons =
                        (newColor as FontColorModel).mode === 'Picker';
                (picker as { setProperties: (p: object) => void }).setProperties(
                    { mode: (newColor as FontColorModel).mode }
                );
                break;
            case 'columns':
                (picker as { setProperties: (p: object) => void }).setProperties(
                    { columns: (newColor as FontColorModel).columns }
                );
                break;
            case 'preset':
                (picker as { setProperties: (p: object) => void }).setProperties(
                    { presetColors: (newColor as FontColorModel).preset }
                );
                break;
            case 'modeSwitcher':
                (picker as { setProperties: (p: object) => void }).setProperties(
                    { modeSwitcher: (newColor as FontColorModel).modeSwitcher }
                );
                break;
            case 'showRecentColors':
                (picker as { setProperties: (p: object) => void }).setProperties(
                    { showRecentColors: (newColor as FontColorModel).showRecentColors }
                );
                break;
            }
        }
    }

    /*
     * Marks an item as having a missing feature module.
     * The item stays visible and disabled; a diagnostic code is reported.
     *
     * @param item - The item that failed to construct
     * @param slotEl - The DOM element for the item
     */
    private markMissingFeature(item: ToolbarItemModel, slotEl: HTMLElement): void {
        slotEl.setAttribute('aria-disabled', 'true');
        slotEl.classList.add(ToolbarRenderer.DISABLED_CLASS);
        slotEl.setAttribute('data-diagnostic', MISSING_FEATURE_MODULE);
        this.itemElements[item.id] = slotEl;
    }

    /*
     * Renders nested controls and caches toolbar item elements after mount.
     *
     * @param {ToolbarItemModel[]} items - Rendered toolbar items
     * @returns {void}
     */
    private collectItemElements(items: ToolbarItemModel[], actionHandler: IActionHandler): void {
        if (!this.hostElement || !this.actionHandler) {
            return;
        }
        for (let i: number = 0; i < items.length; i++) {
            const item: ToolbarItemModel = items[i as number];
            /* Separators have no id-derived slot; templates own their own DOM. */
            if (item.controlType === 'separator' || item.controlType === 'template') {
                continue;
            }
            /* Render nested EJ2 controls (dropdowns, split buttons, color pickers). */
            if (item.controlType !== 'button') {
                this.renderNestedControl(item, actionHandler);
            }
            const el: HTMLElement | null = this.resolveItemElement(item.id);
            if (el) {
                this.itemElements[item.id] = el;
                if (item.shortcut) {
                    el.setAttribute('aria-keyshortcuts', item.shortcut);
                }
                if (item.command === 'undo' || item.command === 'redo') {
                    el.classList.add(CLS_OVERLAY);
                }
            }
        }
    }

    /*
     * Resolves the toolbar item element for the given item ID.
     *
     * @param {string} itemId - Full item ID
     * @returns {HTMLElement | null}
     */
    private resolveItemElement(itemId: string): HTMLElement | null {
        if (!this.hostElement) {
            return null;
        }

        const inner: HTMLElement | null =
            this.hostElement.querySelector('#' + this.escapeSelector(itemId));

        return inner
            ? inner.closest('.e-toolbar-item') as HTMLElement
            : null;
    }

    /*
     * Initializes a single, shared EJ2 Tooltip for the entire toolbar.
     *
     * Per design: tooltip rendering happens once after items are rendered, not per-item.
     * The tooltip uses a CSS selector target so it works for all current and future
     * items that carry a native `title` attribute (which `findTooltipTarget` ensures
     * is set on every interactive toolbar item).
     *
     * Safe to call multiple times — destroys any prior shared instance first.
     */
    private initTooltips(): void {
        if (!this.parent || !this.hostElement) {
            return;
        }
        // Tear down any prior shared instance so we never leak Tooltip components.
        this.destroySharedTooltip();
        const tipHost: HTMLElement = this.hostElement.parentElement
            ? this.hostElement.parentElement
            : this.hostElement;
        this.sharedTooltip = new Tooltip({
            target: '#' + this.parent.element.id + '_toolbar_wrapper [title]',
            showTipPointer: true,
            openDelay: 400,
            opensOn: 'Hover',
            //cssClass: this.parent.getCssClass(),
            windowCollision: true,
            position: this.isBottomToolbar ? 'TopCenter' : 'BottomCenter'
        });
        this.sharedTooltip.appendTo(tipHost);
    }

    /*
     * Destroys the shared Tooltip instance, if any.
     */
    private destroySharedTooltip(): void {
        if (this.sharedTooltip) {
            this.sharedTooltip.destroy();
            this.sharedTooltip = null;
        }
    }

    /*
     * Destroys the tooltip instance for the given item ID, if any.
     *
     * @param itemId - The stable item ID whose tooltip should be removed
     */
    private destroyTooltip(itemId: string): void {
        const tip: Tooltip | undefined = this.tooltips[itemId as string];
        if (tip) {
            tip.destroy();
            delete this.tooltips[itemId as string];
        }
    }

    private beforeDropDownItemRender(args: MenuEventArgs): void {
        if (this.parent.readonly || !this.parent.enable) {
            return;
        }
        const item: any = args.item as any;
        if (item.cssClass) {
            addClass([args.element], item.cssClass);
        }
    }

    private dropdownContent(content: string, item: ToolbarItemModel): string {
        let renderContent: string = content;
        const ddbContentwidth: string = this.parent.fontFamily.width;
        if (item.renderMode && item.renderMode === 'customContent') {
            if (item.command.toLowerCase() === 'fontname') {
                renderContent = 'Font Name';
            } else {
                renderContent = 'Font Size';
            }
        }
        return ('<span class="e-rte-ui-dropdown-btn-text-wrapper" ' + ((item.command === 'fontName') ? 'style="width: ' + ddbContentwidth + '"' : '') + '>' +
            '<span class="e-rte-ui-dropdown-btn-text">' + renderContent + '</span></span>');
    }

    public enableToolbarItems(items: string | string[], isEnable: boolean): void {
        if (!this.ej2Toolbar) {
            return;
        }
        const itemList: string[] = Array.isArray(items) ? items : [items];
        for (let i: number = 0; i < itemList.length; i++) {
            const item: string = itemList[i as number];
            const itemElement: HTMLElement | null = this.getItemElement(item);
            if (itemElement) {
                this.ej2Toolbar.enableItems(itemElement, isEnable);
            }
        }
    }
}

/**
 * Adds command metadata to dropdown selection args.
 *
 * Looks up the selected sub-item and attaches its
 * command and value before forwarding the event.
 *
 * @param { object} args - Selection event args
 * @param { ActionItemModel[] } capturedItems - Available sub-items
 * @returns { an } Enriched event args
 */
function enrichSelectArgs(
    args: object,
    capturedItems: ActionItemModel[]
): { command?: string; value?: unknown } {
    if (!args) {
        return {};
    }
    /* EJ2 dispatches its `select` events with `MenuEventArgs` shape. The
     * safest way to read the chosen sub-item id without `any` is to
     * narrow through `Record<string, unknown>` and re-check the shape. */
    const record: Record<string, unknown> = args as Record<string, unknown>;
    const item: unknown = record['item'];
    if (!item || typeof item !== 'object') {
        return { command: undefined, value: undefined };
    }
    const itemRecord: Record<string, unknown> = item as Record<string, unknown>;
    const itemId: unknown = itemRecord['id'];
    if (typeof itemId !== 'string' || itemId.length === 0) {
        return { command: undefined, value: undefined };
    }
    for (let i: number = 0; i < capturedItems.length; i++) {
        const sub: ActionItemModel = capturedItems[i as number];
        if (sub && sub.id === itemId) {
            const result: { command?: string; value?: unknown } = {};
            if (typeof sub.command === 'string' && sub.command.length > 0) {
                result.command = sub.command;
            }
            if (typeof sub.value !== 'undefined') {
                result.value = sub.value;
            }
            return result;
        }
    }
    return { command: undefined, value: undefined };
}

/** Internal — imported from toolbar-item-normalizer via module extension */
interface ToolbarItemModel {
    id: string;
    source: ToolbarItem;
    controlType: 'button' | 'dropdown' | 'splitButton' | 'colorPicker' | 'template' | 'separator';
    editorColorPickerType: 'FontColor' | 'BackgroundColor';
    shortcut?: string;
    command?: string;
    /* The toolbar item is the EJ2 `ItemModel` widened with the optional
     * popup `items` array. Modeled inline so the type name follows the
     * `ToolbarItem` family naming convention used elsewhere in this module. */
    toolbarItem: ItemModel & { items?: ActionItemModel[] };
    template?: string;
    renderMode?: string;
}

/**
 * Menu item model for dropdown and split-button popups.
 * Supports optional command and value metadata.
 */
export interface ActionItemModel {
    id: string;
    text: string;
    command?: string;
    value?: unknown;
    iconCss?: string;
}

/** Minimal interface to decouple from the full ToolbarActionHandler class */
export interface IActionHandler {
    handleItemClick(itemId: string, item: ToolbarItemModel, event: Event, parent?: RichTextEditorUI): void;
    handleSelect(itemId: string, args: object): void;
    handleChange(itemId: string, args: IColorPickerEventArgs): void;
}

/**
 * Any EJ2 instance hosted inside a toolbar item slot.
 * Covers the toolbar, dropdown button, split button, color picker,
 * and a raw HTML element fallback.
 */
type NestedItemInstance = EJ2Toolbar | DropDownButton | SplitButton | ColorPicker | HTMLElement;

/** Diagnostic code emitted when a nested item fails to construct */
const MISSING_FEATURE_MODULE: string = 'MISSING_FEATURE_MODULE';

/**
 *Callback invoked before a toolbar popup opens to sync its state with the current editor selection.
 */
export interface ToolbarPopupSync {
    (kind: string, popup: HTMLElement | null | undefined): void;
}
