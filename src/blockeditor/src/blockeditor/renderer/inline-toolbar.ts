import { detach, isNullOrUndefined, updateCSSText, EventHandler } from '@syncfusion/ej2-base';
import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { Tooltip } from '@syncfusion/ej2-popups';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ToolbarItemClickEventArgs, TransformItemSelectEventArgs } from '../../models/eventargs';
import { IDropDownRenderOptions, IToolbarRenderOptions } from '../../common/interface';
import { ToolbarRenderer, ColorPickerRenderer } from './common/index';
import { getInlineToolbarItems, transformIntoToolbarItem, defaultTransformModel, getBlockModelById } from '../../common/utils/index';
import { InlineToolbarSettingsModel, IHeadingBlockSettings, BlockModel } from '../../models/index';
import { events } from '../../common/constant';
import * as constants from '../../common/constant';
import { BlockEditor } from '../base/blockeditor';
import { BlockEditorModel } from '../base/blockeditor-model';
import { IToolbarItemModel, TransformItemModel } from '../../models/interface';
import { ToolbarCommandName, TransformCommandName } from '../../models/types';
import { BlockType } from '../../models/enums';

/**
 * InlineToolbarModule class is used to render the inline toolbar for the block editor.
 *
 * @hidden
 */
export class InlineToolbarModule {

    private editor: BlockEditor;
    private toolbarRenderer: ToolbarRenderer;
    private textColorPicker: ColorPicker;
    private bgColorPicker: ColorPicker;
    public toolbarObj: Toolbar;
    private inlineToolbarTooltip: Tooltip;
    private toolbarEle: HTMLElement;
    private pickerHandler: ColorPickerRenderer;
    private transformDDB: DropDownButton;
    private updateTransformLabelHandler: () => void;
    private currentTransformItems: TransformItemModel[] = [];

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.toolbarRenderer = new ToolbarRenderer(this.editor);
        this.pickerHandler = new ColorPickerRenderer(this.editor);
        this.addEventListeners();
        this.init();
        this.bindTooltip();
    }

    private addEventListeners(): void {
        this.editor.blockManager.observer.on('enableDisableTbarItems', this.enableDisableTbarItems, this);
        this.editor.on(events.inlineToolbarCreated, this.handleInlineToolbarCreated, this);
        this.editor.on(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick, this);
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.blockManager.observer.off('enableDisableTbarItems', this.enableDisableTbarItems);
        this.editor.off(events.inlineToolbarCreated, this.handleInlineToolbarCreated);
        this.editor.off(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick);
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        this.toolbarEle = this.editor.createElement('div', {
            id: (this.editor.element.id + constants.BLOCKEDITOR_INLINETBAR_ID),
            className: constants.BLOCKEDITOR_INLINETBAR_CLS
        });
        this.editor.element.appendChild(this.toolbarEle);

        this.toolbarObj = this.renderToolbar({
            element: this.toolbarEle,
            items: this.getToolbarItems(this.editor.inlineToolbarSettings.items),
            width: this.editor.inlineToolbarSettings.popupWidth,
            overflowMode: 'MultiRow'
        });
        const popupElement: HTMLElement = this.editor.createElement('div', {
            id: (this.editor.element.id + constants.INLINE_TBAR_POPUP_ID),
            className: constants.INLINE_TBAR_POPUP_CLS
        });
        this.toolbarObj.isStringTemplate = true;
        this.editor.element.appendChild(popupElement);
        this.editor.blockManager.observer.notify('toolbarCreated');
    }

    private bindTooltip(): void {
        this.inlineToolbarTooltip = this.editor.tooltipRenderer.renderTooltip({
            cssClass: constants.INLINE_TBAR_TOOLTIP_CLS,
            position: 'TopCenter',
            target: '.' + constants.TBAR_ITEM_CLS,
            windowCollision: true,
            element: document.querySelector('#' + this.editor.element.id + constants.INLINE_TBAR_POPUP_ID) as HTMLElement
        });
    }

    /**
     * Render the inline toolbar for the block editor.
     *
     * @param {IToolbarRenderOptions} args - The options for rendering the toolbar.
     * @returns {Toolbar} The rendered toolbar instance.
     * @hidden
     */
    public renderToolbar(args: IToolbarRenderOptions): Toolbar {
        return this.toolbarRenderer.renderToolbar(args);
    }

    private handleInlineToolbarCreated(): void {
        if (this.hasToolbarItemId('color')) {
            this.initializeColorPicker('color');
        }
        if (this.hasToolbarItemId('bgColor')) {
            this.initializeColorPicker('bgColor');
        }
        if (this.hasToolbarItemId('transform')) {
            this.initializeTransformDropdown();
        }
    }

    private handleInlineToolbarItemClick(args: ClickEventArgs): void {
        const itemClickArgs: ToolbarItemClickEventArgs = {
            item: getInlineToolbarItems().find((item: IToolbarItemModel) => item.id === args.item.id),
            event: args.originalEvent,
            isInteracted: Object.keys(args.originalEvent).length > 0,
            cancel: false
        };
        if (this.editor.inlineToolbarSettings.itemClick) {
            this.editor.inlineToolbarSettings.itemClick.call(this.editor, itemClickArgs);
        }
        if (itemClickArgs.cancel) {
            args.cancel = true;
            return;
        }
        this.editor.blockManager.observer.notify('inlineToolbarItemClick', args);
    }

    private enableDisableTbarItems(args: { items: any, isEnable: boolean }): void {
        this.toolbarObj.enableItems(args.items, args.isEnable);
    }

    private initializeColorPicker(type: 'color' | 'bgColor'): void {
        const toolbarElement: HTMLElement = document.querySelector('#' + this.editor.element.id + constants.BLOCKEDITOR_INLINETBAR_ID);
        if (!toolbarElement) { return; }

        const colorBtn: HTMLSpanElement = toolbarElement.querySelector(`#toolbar-${type.toLowerCase()}-dropdown`) as HTMLSpanElement;

        // create and attach the ColorPicker popup directly to the toolbar button via handler
        const colorPicker: ColorPicker = this.pickerHandler.renderColorPicker({
            element: colorBtn,
            type: type,
            iconCss: `e-inline-${type}-icon`,
            onChange: (value: string) => {
                this.editor.blockManager.observer.notify('handleColorpickerChange', { type, value });
            }
        });

        if (type === 'color') {
            this.textColorPicker = colorPicker;
        } else {
            this.bgColorPicker = colorPicker;
        }
    }

    private createDropDown(args: IDropDownRenderOptions): DropDownButton {
        const dropDown: DropDownButton = new DropDownButton({
            target: args.instance.target,
            items: args.instance.items,
            cssClass: args.instance.cssClass,
            popupWidth: args.instance.popupWidth,
            createPopupOnClick: args.instance.createPopupOnClick,
            select: args.instance.select,
            beforeOpen: args.instance.beforeOpen,
            itemTemplate: args.instance.itemTemplate
        });
        dropDown.appendTo(args.element);

        if (args.inlineClass) {
            const iconWrapper: HTMLElement = this.editor.createElement('span', { className: 'e-be-color-icon-wrapper' });
            const iconElement: HTMLElement = this.editor.createElement('span', { className: args.inlineClass });
            const cssText: string = 'border-bottom: 3px solid #000000;';
            updateCSSText(iconElement, cssText);
            iconWrapper.appendChild(iconElement);
            dropDown.element.insertBefore(iconWrapper, dropDown.element.querySelector('.e-caret'));
        }
        return dropDown;
    }

    private applyRtlSettings(): void {
        if (this.toolbarObj) {
            this.toolbarObj.enableRtl = this.editor.enableRtl;
        }
        if (this.textColorPicker && this.pickerHandler) {
            this.textColorPicker.enableRtl = this.editor.enableRtl;
        }
        if (this.bgColorPicker && this.pickerHandler) {
            this.bgColorPicker.enableRtl = this.editor.enableRtl;
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'inlineToolbarSettings';
    }

    /**
     * Handles property changes to update the toolbar configuration
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    protected onPropertyChanged(e: { [key: string]: BlockEditorModel }): void {
        if (e.module === this.getModuleName()) {
            const newProp: InlineToolbarSettingsModel = e.newProp.inlineToolbarSettings;
            const oldProp: InlineToolbarSettingsModel = e.oldProp.inlineToolbarSettings;
            if (!isNullOrUndefined(newProp)) {
                for (const prop of Object.keys(newProp)) {
                    switch (prop) {
                    case 'popupWidth':
                        this.editor.blockManager.observer.notify('popupWidthChanged', { value: newProp.popupWidth });
                        break;
                    case 'items': {
                        const flattenedToolbarItems: ItemModel[] = this.getToolbarItems(
                            newProp.items as (ToolbarCommandName | IToolbarItemModel)[]
                        );
                        this.toolbarObj.items = flattenedToolbarItems;
                        setTimeout(() => {
                            this.handleInlineToolbarCreated();
                        }, 10);
                        break;
                    }
                    }
                }
            }
        } else {
            const moduleName: string = (e as any).module;
            if (moduleName === 'fontColorSettings') {
                const fontModel: any = (e as any).newProp.fontColorSettings;
                if (fontModel && this.textColorPicker && this.pickerHandler) {
                    this.pickerHandler.updatePickerProperties(this.textColorPicker, fontModel);
                }
                return;
            }
            if (moduleName === 'backgroundColorSettings') {
                const bgModel: any = (e as any).newProp.backgroundColorSettings;
                if (bgModel && this.bgColorPicker && this.pickerHandler) {
                    this.pickerHandler.updatePickerProperties(this.bgColorPicker, bgModel);
                }
                return;
            }
        }
    }

    //Initializes the Transform dropdown (Paragraph, Headings, Lists)
    private initializeTransformDropdown(): void {
        const toolbarElement: HTMLElement = document.querySelector('#' + this.editor.element.id + constants.BLOCKEDITOR_INLINETBAR_ID);
        const transformBtn: HTMLSpanElement = toolbarElement.querySelector('#toolbar-transform-dropdown') as HTMLSpanElement;
        const cssClass: string = 'e-flat e-be-blocktype-ddb e-blockeditor-command-menu';

        // Determine dropdown items: use custom transformSettings if provided, otherwise fall back to defaultTransformModel
        this.currentTransformItems = defaultTransformModel;
        if (this.editor.transformSettings &&
            this.editor.transformSettings.items &&
            this.editor.transformSettings.items.length > 0) {
            // Use custom transform items from transformSettings
            this.currentTransformItems = this.resolveTransformItems(this.editor.transformSettings.items);
        }

        type TransformDropdownItem = {
            id: string;
            label: string;
            iconCss: string;
            shortcut: string;
            disabled: boolean;
            tooltip: string;
            type: BlockType;
        };
        const items: TransformDropdownItem[] = this.currentTransformItems.map((m: TransformItemModel) => ({
            type: m.type,
            id: m.id,
            label: m.label,
            iconCss: m.iconCss,
            shortcut: m.shortcut,
            disabled: m.disabled,
            tooltip: m.tooltip
        }));

        const selectHandler: (args: { item?: { id?: string } }) => void = (args: { item?: { id?: string } }) => {
            const itemId: string = args.item && args.item.id;
            if (!itemId) { return; }
            const model: TransformItemModel = this.currentTransformItems.find((m: TransformItemModel) => m.id === itemId);
            if (!model) { return; }

            // Respect disabled flag on transform items
            if (model.disabled) { return; }

            // Check if the selected item is the same as the current block type
            const currentItemId: string | null = this.getMatchingTransformItemId();
            if (currentItemId === itemId) {
                // Same block type selected, no need to transform
                return;
            }

            // Trigger itemSelect event if defined in transformSettings
            if (this.editor.transformSettings && this.editor.transformSettings.itemSelect) {
                const eventArgs: TransformItemSelectEventArgs = {
                    command: model,
                    element: args.item as HTMLElement || null,
                    event: null,
                    cancel: false
                };
                this.editor.transformSettings.itemSelect.call(this.editor, eventArgs);
                if (eventArgs.cancel) {
                    return;
                }
            }

            let props: IHeadingBlockSettings | undefined;
            if (model.type === BlockType.Heading) {
                const match: RegExpMatchArray = itemId.match(/heading(\d)/i);
                const level: number = match ? Math.max(1, Math.min(4, parseInt(match[1], 10))) : 1;
                props = { level } as IHeadingBlockSettings;
            }
            this.editor.blockManager.blockCommand.transformBlocksForSelection(model.type as string, props);
        };

        const beforeOpenHandler: () => void = () => {
            // Apply selected menu item styling when dropdown opens
            setTimeout(() => {
                this.applyTransformMenuSelection();
            }, 0);
        };

        // Create dropdown button with items and select handler
        const dropDown: DropDownButton = this.createDropDown({
            instance: {
                items,
                cssClass: cssClass,
                createPopupOnClick: true,
                popupWidth: '250px',
                select: selectHandler,
                beforeOpen: beforeOpenHandler,
                itemTemplate: '<div class=\'e-transform-item-template\'><div class=\'e-transform-icon-info\'>' +
                '<span class="${iconCss}"></span></div><div class=\'e-transform-item-info\'>' +
                '<span title="${tooltip}">${label}' +
                '</span><span class=\'e-be-transform-shortcut\'>${shortcut}</span></div></div>'
            },
            element: transformBtn,
            inlineClass: null,
            type: null
        });
        this.transformDDB = dropDown;

        // Initialize icon for the existing e-be-transform-block element
        const iconCss: string = this.getCurrentTransformIcon();
        const transformBlockElement: HTMLElement = toolbarElement.querySelector('.e-be-transform-block') as HTMLElement;
        if (transformBlockElement) {
            // Keep base classes and add the icon class
            transformBlockElement.className = `e-be-transform-block ${iconCss}`;
        }

        // Update label live when selection/focus changes
        this.updateTransformLabelHandler = () => {
            const newIconCss: string = this.getCurrentTransformIcon();
            const hasIgnoredBlocks: boolean = this.hasIgnoredBlockTypes();

            if (this.transformDDB) {
                // Query select the e-be-transform-block element and update its icon
                const transformIcon: HTMLElement = document.querySelector('.e-be-transform-block') as HTMLElement;
                if (transformIcon) {
                    // Update icon classes while keeping base classes
                    transformIcon.className = `e-be-transform-block ${newIconCss}`;
                }

                // Disable/enable the dropdown based on ignored block types
                this.transformDDB.disabled = hasIgnoredBlocks;

                // Add/remove e-disabled class to the transform button
                if (hasIgnoredBlocks) {
                    toolbarElement.firstElementChild.firstElementChild.classList.add('e-disabled');
                } else {
                    toolbarElement.firstElementChild.firstElementChild.classList.remove('e-disabled');
                }
            }
        };
        EventHandler.add(document, 'selectionchange', this.updateTransformLabelHandler);

        // Initialize disabled state based on current selection
        const hasIgnoredBlocks: boolean = this.hasIgnoredBlockTypes();
        if (this.transformDDB) {
            this.transformDDB.disabled = hasIgnoredBlocks;
            if (hasIgnoredBlocks) {
                toolbarElement.firstElementChild.firstElementChild.classList.add('e-disabled');
            }
        }
    }

    private applyTransformMenuSelection(): void {
        // Get the current block's corresponding menu item
        const currentItemId: string | null = this.getMatchingTransformItemId();

        // Query all menu items in the dropdown popup - look for li elements with data-text attribute
        const menuPopup: HTMLDivElement = document.querySelector('#toolbar-transform-dropdown-popup') as HTMLDivElement;
        if (!menuPopup) { return; }

        // Add e-selected class to the matching item only if it is not disabled
        if (currentItemId) {
            const matchingModel: TransformItemModel | undefined = this.currentTransformItems.find(
                (m: TransformItemModel) => m.id === currentItemId
            );
            // Only add e-selected if the item is not disabled
            if (matchingModel && !matchingModel.disabled) {
                const selectedItem: Element = menuPopup.querySelector(`#${currentItemId}`);
                if (selectedItem) {
                    selectedItem.classList.add('e-selected');
                }
            }
        }
    }

    private getMatchingTransformItemId(): string | null {
        // If multiple blocks are selected, return null (no single item to highlight)
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks ? this.editor.getSelectedBlocks() : null;
        if (selectedBlocks && selectedBlocks.length > 1) {
            return null;
        }

        // Prefer selected block model when single block is selected
        let blockModel: BlockModel = null;
        if (selectedBlocks && selectedBlocks.length === 1) {
            blockModel = selectedBlocks[0];
        } else {
            const focusedBlk: HTMLElement = this.editor.blockManager.currentFocusedBlock;
            if (!focusedBlk) { return null; }
            blockModel = getBlockModelById(focusedBlk.id, this.editor.blockManager.getEditorBlocks());
        }

        if (!blockModel) { return null; }

        const selType: string = blockModel.blockType;
        let model: TransformItemModel = null;
        if (selType === BlockType.Heading) {
            const level: number = (blockModel.properties as IHeadingBlockSettings) ?
                (blockModel.properties as IHeadingBlockSettings).level || 1 : 1;
            model = this.currentTransformItems.find((m: TransformItemModel) => m.id === `heading${level}-command`);
        }
        if (!model) {
            model = this.currentTransformItems.find((m: TransformItemModel) => m.type === selType);
        }
        return model ? model.id : null;
    }

    private getCurrentTransformIcon(): string {
        // Get default icon from first item (Paragraph)
        const defaultIcon: string = this.currentTransformItems.length > 0 ? this.currentTransformItems[0].iconCss : '';

        // If multiple blocks are selected, return paragraph icon
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks ? this.editor.getSelectedBlocks() : null;
        if (selectedBlocks && selectedBlocks.length > 1) {
            return defaultIcon;
        }

        // Prefer selected block model when single block is selected
        let blockModel: BlockModel = null;
        if (selectedBlocks && selectedBlocks.length === 1) {
            blockModel = selectedBlocks[0];
        } else {
            const focusedBlk: HTMLElement = this.editor.blockManager.currentFocusedBlock;
            if (!focusedBlk) { return defaultIcon; }
            blockModel = getBlockModelById(focusedBlk.id, this.editor.blockManager.getEditorBlocks());
        }

        if (!blockModel) { return defaultIcon; }

        const selType: string = blockModel.blockType;
        let model: TransformItemModel = null;
        if (selType === BlockType.Heading) {
            const level: number = (blockModel.properties as IHeadingBlockSettings) ?
                (blockModel.properties as IHeadingBlockSettings).level || 1 : 1;
            model = this.currentTransformItems.find((m: TransformItemModel) => m.id === `heading${level}-command`);
        }
        if (!model) {
            model = this.currentTransformItems.find((m: TransformItemModel) => m.type === selType);
        }
        return model ? model.iconCss : defaultIcon;
    }

    private getToolbarItems(items: (string | ToolbarCommandName | IToolbarItemModel)[]): ItemModel[] {
        const defaults: IToolbarItemModel[] = getInlineToolbarItems();
        const resolved: (string | ToolbarCommandName | IToolbarItemModel)[] = items.map((item: string) => {
            if (typeof item === 'string') {
                const match: IToolbarItemModel = defaults.find((d: IToolbarItemModel) =>
                    d.command && d.command.toLowerCase() === item.toLowerCase());
                return match ? match : item;
            }
            return item;
        });
        return transformIntoToolbarItem(resolved);
    }

    private hasToolbarItemId(targetId: string): boolean {
        const items: ItemModel[] = this.getToolbarItems(this.editor.inlineToolbarSettings.items);
        return items.some((item : ItemModel) => {
            const id: string = item.id;
            return id && id.toLowerCase() === targetId.toLowerCase();
        });
    }

    private hasIgnoredBlockTypes(): boolean {
        // Check if any selected blocks have ignored types
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks ? this.editor.getSelectedBlocks() : null;
        const ignoredTypes: string[] = [BlockType.Callout, BlockType.Quote, BlockType.Image, BlockType.Divider, BlockType.Code];

        // If blocks are selected, check if any are of ignored type
        if (selectedBlocks && selectedBlocks.length > 0) {
            return selectedBlocks.some((block: BlockModel) => ignoredTypes.indexOf(block.blockType) !== -1);
        }

        // If no selected blocks, check the currently focused block
        const focusedBlk: HTMLElement = this.editor.blockManager.currentFocusedBlock;
        if (!focusedBlk) { return false; }

        const blockModel: BlockModel = getBlockModelById(focusedBlk.id, this.editor.blockManager.getEditorBlocks());
        if (!blockModel) { return false; }

        return ignoredTypes.indexOf(blockModel.blockType) !== -1;
    }

    /**
     * Resolves custom transform items from transformSettings into a normalized TransformItemModel array.
     * Handles string identifiers and model objects.
     *
     * @param {(string | TransformCommandName | TransformItemModel)[]} items - The raw transform items.
     * @returns {TransformItemModel[]} - The resolved transform items.
     * @private
     */
    private resolveTransformItems(items: (string | TransformCommandName | TransformItemModel)[]): TransformItemModel[] {
        return items
            .map((item: string | TransformCommandName | TransformItemModel) => {
                // Handle object models
                if (typeof item === 'object' && item !== null) {
                    return item as TransformItemModel;
                }

                // Handle string identifiers - find matching item from defaultTransformModel
                const itemStr: string = String(item).trim().toLowerCase();
                return defaultTransformModel.find((m: TransformItemModel) =>
                    m.label.toLowerCase() === itemStr
                );
            })
            .filter((item: TransformItemModel) => item);
    }

    /**
     * Destroys the inline toolbar module and cleans up resources
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        if (this.textColorPicker) {
            this.textColorPicker.destroy();
            this.textColorPicker = null;
        }
        if (this.bgColorPicker) {
            this.bgColorPicker.destroy();
            this.bgColorPicker = null;
        }
        if (this.inlineToolbarTooltip) {
            this.inlineToolbarTooltip.destroy();
        }
        if (this.toolbarObj) {
            this.toolbarObj.destroy();
            detach(this.toolbarEle);
            this.toolbarObj = null;
        }
        if (this.updateTransformLabelHandler) {
            EventHandler.remove(document, 'selectionchange', this.updateTransformLabelHandler);
            this.updateTransformLabelHandler = null;
        }
        this.toolbarRenderer = null;
        this.inlineToolbarTooltip = null;
        this.pickerHandler = null;
    }
}
