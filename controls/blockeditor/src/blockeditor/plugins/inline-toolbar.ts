import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Popup, Tooltip } from '@syncfusion/ej2-popups';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { BlockEditor, BlockEditorModel, BlockType, BuiltInToolbar, IDropDownRenderOptions, IToolbarRenderOptions, ToolbarCloseEventArgs, ToolbarItemClickedEventArgs, ToolbarOpenEventArgs } from '../base/index';
import { ToolbarRenderer } from '../renderer/common/index';
import { getBlockContentElement, getBlockModelById, getInlineToolbarItems, getNormalizedKey, getParentBlock, getSelectedRange, normalizeRange, transformIntoToolbarItem } from '../utils/index';
import { BaseStylesProp, BlockModel, ContentModel, InlineToolbarSettingsModel, StyleModel, Styles, ToolbarItemModel } from '../models/index';
import { events } from '../base/constant';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { findClosestParent } from '../utils/dom';
import * as constants from '../base/constant';

/**
 * InlineToolbarModule class is used to render the inline toolbar for the block editor.
 *
 * @hidden
 */
export class InlineToolbarModule {

    private editor: BlockEditor;
    private toolbarRenderer: ToolbarRenderer;
    private textColorDDB: DropDownButton;
    private bgColorDDB: DropDownButton;
    private textColorPicker: ColorPicker;
    private bgColorPicker: ColorPicker;
    public popupObj: Popup;
    public toolbarObj: Toolbar;
    private inlineToolbarTooltip: Tooltip;
    private toolbarEle: HTMLElement;
    private popupElement: HTMLElement;
    private textPickerElement: HTMLInputElement;
    private bgPickerElement: HTMLInputElement;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.toolbarRenderer = new ToolbarRenderer(this.editor);
        this.addEventListeners();
        this.init();
        this.bindTooltip();
    }

    private addEventListeners(): void {
        this.editor.on(events.inlineToolbarCreated, this.handleInlineToolbarCreated, this);
        this.editor.on(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick, this);
        this.editor.on(events.inlineToolbarBeforeOpen, this.handleInlineToolbarBeforeOpen, this);
        this.editor.on(events.formattingPerformed, this.toggleToolbarActiveState, this);
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.keydown, this.onKeydown, this);
        this.editor.on(events.rtlChanged, this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.inlineToolbarCreated, this.handleInlineToolbarCreated);
        this.editor.off(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick);
        this.editor.off(events.inlineToolbarBeforeOpen, this.handleInlineToolbarBeforeOpen);
        this.editor.off(events.formattingPerformed, this.toggleToolbarActiveState);
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.keydown, this.onKeydown);
        this.editor.off(events.rtlChanged, this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        this.toolbarEle = this.editor.createElement('div', {
            className: constants.BLOCKEDITOR_INLINETBAR_CLS
        });
        this.popupElement = this.editor.createElement('div', {
            className: constants.INLINE_TBAR_POPUP_CLS
        });
        document.body.appendChild(this.toolbarEle);
        document.body.appendChild(this.popupElement);

        this.toolbarObj = this.renderToolbar({
            element: this.toolbarEle,
            items: this.getToolbarItems(),
            width: this.editor.inlineToolbar.width,
            overflowMode: 'Extended',
            enablePersistence: this.editor.enablePersistence
        });
        this.popupObj = this.editor.popupRenderer.renderPopup({
            element: this.popupElement,
            content: this.toolbarEle
        });
    }

    private getToolbarItems(): ItemModel[] {
        const tbarItems: ToolbarItemModel[] = this.editor.inlineToolbar.items.length > 0
            ? this.editor.inlineToolbar.items
            : getInlineToolbarItems();

        if (this.editor.inlineToolbar.items.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.inlineToolbar.items = tbarItems;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return transformIntoToolbarItem(tbarItems);
    }

    private onKeydown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }

        const command: string = this.editor.keyCommandMap.get(normalizedKey);
        const allowedCommands: string[] = ['bold', 'italic', 'underline', 'strikethrough'];

        if (allowedCommands.indexOf(command) !== -1) {
            e.preventDefault();
            if (window.getSelection().isCollapsed) {
                this.editor.formattingAction.toggleActiveFormats(command as keyof StyleModel);
            }
            else {
                this.editor.formattingAction.execCommand({ command: (command as keyof StyleModel) });
                this.editor.trigger('keyActionExecuted', {
                    keyCombination: normalizedKey, action: command
                });
            }
        }
    }

    private bindTooltip(): void {
        if (!this.editor.inlineToolbar.enableTooltip) { return; }

        this.inlineToolbarTooltip = this.editor.tooltipRenderer.renderTooltip({
            cssClass: constants.INLINE_TBAR_TOOLTIP_CLS,
            position: 'TopCenter',
            target: '.' + constants.TBAR_ITEM_CLS,
            windowCollision: true,
            element: document.querySelector('.' + constants.INLINE_TBAR_POPUP_CLS) as HTMLElement
        });
    }

    /**
     * Shows the inline toolbar at the current selection
     *
     * @param {Range} range - Selection range where the toolbar should appear
     * @param {Event} event - Optional event that triggered the toolbar
     * @returns {void}
     * @hidden
     */
    public showInlineToolbar(range: Range, event?: Event): void {
        const notAllowedTypes: string[] = [BlockType.Code, BlockType.Image];
        const blockElement: HTMLElement = findClosestParent(range.commonAncestorContainer, '.' + constants.BLOCK_CLS);
        const blockType: string = blockElement.getAttribute('data-block-type');
        if (!this.editor.inlineToolbar.enable || (notAllowedTypes.indexOf(blockType) !== -1)) { return; }

        const eventArgs: ToolbarOpenEventArgs = {
            items: this.editor.inlineToolbar.items,
            event: event,
            cancel: false
        };
        if (this.editor.inlineToolbar.open) {
            this.editor.inlineToolbar.open.call(this, eventArgs);
        }
        if (eventArgs.cancel) { return; }

        this.editor.notify(events.inlineToolbarBeforeOpen, event);
        this.editor.popupRenderer.adjustPopupPositionRelativeToTarget(range, this.popupObj);

        this.popupObj.show();
    }

    /**
     * Hides the inline toolbar
     *
     * @param {Event} e - Optional event that triggered hiding the toolbar
     * @returns {void}
     */
    public hideInlineToolbar(e?: Event): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('.' + constants.INLINE_TBAR_POPUP_CLS);
        if (inlineTbarPopup && !inlineTbarPopup.classList.contains('e-popup-open')) {
            return;
        }

        const eventArgs: ToolbarCloseEventArgs = {
            items: this.editor.inlineToolbar.items,
            event: e,
            cancel: false
        };
        if (this.editor.inlineToolbar.close) {
            this.editor.inlineToolbar.close.call(this, eventArgs);
        }
        if (eventArgs.cancel) { return; }

        this.popupObj.hide();
    }

    /**
     * Render the inline toolbar for the block editor.
     *
     * @param {IToolbarRenderOptions} args - The options for rendering the toolbar.
     * @returns {Toolbar} The rendered toolbar instance.
     */
    renderToolbar(args: IToolbarRenderOptions): Toolbar {
        return this.toolbarRenderer.renderToolbar(args);
    }

    private handleInlineToolbarCreated(): void {
        if (this.editor.inlineToolbar.items.find((item: ToolbarItemModel) => item.id === 'color')) {
            this.initializeColorPickerAndDropdown('color');
        }
        if (this.editor.inlineToolbar.items.find((item: ToolbarItemModel) => item.id === 'bgColor')) {
            this.initializeColorPickerAndDropdown('bgColor');
        }
    }

    private handleInlineToolbarItemClick(args: ClickEventArgs): void {
        const itemClickArgs: ToolbarItemClickedEventArgs = {
            item: getInlineToolbarItems().find((item: ToolbarItemModel) => item.id === args.item.id),
            event: args.originalEvent,
            isInteracted: Object.keys(args.originalEvent).length > 0,
            cancel: false
        };
        if (this.editor.inlineToolbar.itemClicked) {
            this.editor.inlineToolbar.itemClicked.call(this.editor, itemClickArgs);
        }
        if (itemClickArgs.cancel) {
            args.cancel = true;
            return;
        }
        const selectedItem: keyof StyleModel = (args.item.id as keyof StyleModel);
        if (selectedItem === 'color' || selectedItem === 'bgColor') {
            // Do not proceed further for color and background color commands. It will be handled by the color picker.
            return;
        }
        this.editor.formattingAction.execCommand({
            command: selectedItem
        });
    }

    private handleInlineToolbarBeforeOpen(): void {
        this.toggleToolbarActiveState();
    }

    /**
     * Updates active state of toolbar buttons based on current selection formatting
     *
     * @returns {void}
     * @hidden
     */
    public toggleToolbarActiveState(): void {
        const range: Range = getSelectedRange();
        if (!range) { return; }

        const blockElement: HTMLElement = getParentBlock(range.startContainer);
        if (!blockElement) { return; }

        const block: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const toolbarEl: HTMLElement = document.querySelector('.' + constants.INLINE_TBAR_POPUP_CLS);
        const toolbarItems: NodeListOf<HTMLElement> = toolbarEl.querySelectorAll('.e-toolbar-item');
        toolbarItems.forEach((item: HTMLElement) => item.classList.remove('e-active'));

        const selectedContentModels: ContentModel[] = this.getSelectedContentModels(range, contentElement, block);
        const commonStyles: Styles = this.getCommonStyles(selectedContentModels);

        for (const item of Array.from(toolbarItems)) {
            const command: BuiltInToolbar = item.getAttribute('data-command') as BuiltInToolbar;
            this.toggleActiveState(item, command, commonStyles);
        }
    }

    private getSelectedContentModels(range: Range, contentElement: HTMLElement, block: BlockModel): ContentModel[] {
        const selectedNodes: Node[] = this.getNodesInRange(normalizeRange(range), contentElement);
        return block.content.filter((content: ContentModel) =>
            selectedNodes.some((node: Node) => content.id === (node as HTMLElement).id)
        );
    }

    private getNodesInRange(range: Range, container: HTMLElement): Node[] {
        const selectedNodes: Node[] = [];
        const walker: TreeWalker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node: Node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const nodeStart: number = range.comparePoint(node, 0);
                        const nodeEnd: number = range.comparePoint(node, node.childNodes.length);

                        if (nodeStart <= 0 && nodeEnd >= 0) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        while (walker.nextNode()) {
            selectedNodes.push(walker.currentNode);
        }

        return selectedNodes;
    }

    private toggleActiveState(item: HTMLElement, command: BuiltInToolbar, styles: Styles): void {
        let isActive: boolean = false;
        switch (command) {
        case 'Bold': isActive = styles.bold === true; break;
        case 'Italic': isActive = styles.italic === true; break;
        case 'Underline': isActive = styles.underline === true; break;
        case 'Strikethrough': isActive = styles.strikethrough === true; break;
        case 'Superscript': isActive = styles.superscript === true; break;
        case 'Subscript': isActive = styles.subscript === true; break;
        case 'Uppercase': isActive = styles.uppercase === true; break;
        case 'Lowercase': isActive = styles.lowercase === true; break;
        case 'Color': this.setColors('color', (styles.color as string)); break;
        case 'BgColor': this.setColors('bgColor', (styles.bgColor as string)); break;
        }
        item.classList.toggle('e-active', isActive);
    }

    private getCommonStyles(contentModels: ContentModel[]): Styles {
        if (!contentModels.length || !contentModels[0].props || !(contentModels[0].props as BaseStylesProp).styles) {
            return {};
        }

        const firstStyles: Styles = (contentModels[0].props as BaseStylesProp).styles;
        const styleKeys: (keyof StyleModel)[] = Object.keys(firstStyles) as (keyof StyleModel)[];
        const result: Styles = {};

        for (const key of styleKeys) {
            const firstValue: string | boolean = firstStyles[key as keyof StyleModel];
            const isCommon: boolean = contentModels.every((model: ContentModel, i: number) => {
                if (i === 0) { return true; }
                const styles: Styles = (model.props as BaseStylesProp).styles || {};
                return (styles as any)[key as any] === firstValue;
            });

            if (isCommon) {
                result[key as keyof StyleModel] = firstValue;
            }
        }

        return result;
    }

    private initializeColorPickerAndDropdown(type: 'color' | 'bgColor'): void {
        const toolbarElement: HTMLElement = document.querySelector('.' + constants.BLOCKEDITOR_INLINETBAR_CLS);
        if (!toolbarElement) { return; }

        const pickerElement: HTMLInputElement = this.editor.createElement('input', { attrs: { type: 'color' } });
        const colorPicker: ColorPicker = this.createColorPicker(type, pickerElement);
        const colorBtn: HTMLSpanElement = toolbarElement.querySelector(`#toolbar-${type.toLowerCase()}-dropdown`) as HTMLSpanElement;

        if (colorBtn) {
            const dropDown: DropDownButton = this.createDropDown({
                instance: { target: colorPicker.element.closest('.e-colorpicker-wrapper') },
                element: colorBtn,
                inlineClass: `e-inline-${type}-icon`,
                type
            });
            if (type === 'color') {
                this.textPickerElement = pickerElement;
                this.textColorPicker = colorPicker;
                this.textColorDDB = dropDown;
            } else {
                this.bgPickerElement = pickerElement;
                this.bgColorPicker = colorPicker;
                this.bgColorDDB = dropDown;
            }
        }
    }

    private createColorPicker(type: 'color' | 'bgColor', element: HTMLInputElement): ColorPicker {
        element.id = type === 'color' ? 'be-colorPicker' : 'be-bgColorPicker';
        document.body.appendChild(element);
        const colorPicker: ColorPicker = new ColorPicker({
            mode: 'Palette',
            inline: true,
            modeSwitcher: false,
            showButtons: false,
            noColor: true,
            value: '#000000',
            cssClass: 'e-be-color-picker',
            change: (args: ColorPickerEventArgs) => {
                this.handleColorChange(type, args);
            }
        });
        colorPicker.appendTo(element);

        return colorPicker;
    }

    private createDropDown(args: IDropDownRenderOptions): DropDownButton {
        const dropDown: DropDownButton = new DropDownButton({
            target: args.instance.target,
            cssClass: args.instance.cssClass,
            createPopupOnClick: args.instance.createPopupOnClick
        });
        dropDown.appendTo(args.element);

        const iconWrapper: HTMLElement = this.editor.createElement('span', { className: 'e-be-color-icon-wrapper' });
        const iconElement: HTMLElement = this.editor.createElement('span', { className: args.inlineClass });
        iconElement.style.borderBottomStyle = 'solid';
        iconElement.style.borderBottomWidth = '3px';
        iconElement.style.borderBottomColor = '#000000';
        iconWrapper.appendChild(iconElement);
        dropDown.element.insertBefore(iconWrapper, dropDown.element.querySelector('.e-caret'));
        return dropDown;
    }

    private setColors(type: 'color' | 'bgColor', value?: string ): void {
        const toolbarElement: HTMLElement = document.querySelector('.' + constants.BLOCKEDITOR_INLINETBAR_CLS);
        const colorBtn: HTMLSpanElement = (toolbarElement.querySelector('#toolbar-color-dropdown') as HTMLSpanElement);
        const bgColorBtn: HTMLSpanElement = (toolbarElement.querySelector('#toolbar-bgcolor-dropdown') as HTMLSpanElement);
        const currentColor: string = value ? value : '#000000';
        if (currentColor) {
            const button: HTMLElement = type === 'color' ?
                colorBtn.querySelector('.e-inline-color-icon') :
                bgColorBtn.querySelector('.e-inline-bgColor-icon');
            if (button) {
                (button as HTMLElement).style.borderBottomColor = currentColor;
            }
        }
    }

    private handleColorChange(type: 'color' | 'bgColor', args: ColorPickerEventArgs): void {
        const color: string = args.currentValue.rgba;

        this.editor.formattingAction.execCommand({
            command: (type as keyof StyleModel),
            value: color
        });
        this.setColors(type, color);
        const dropdownButton: DropDownButton = type === 'color' ? this.textColorDDB : this.bgColorDDB;
        if (dropdownButton) {
            dropdownButton.toggle();
        }
    }

    private applyRtlSettings(): void {
        if (this.toolbarObj) {
            this.toolbarObj.enableRtl = this.editor.enableRtl;
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'inlineToolbar';
    }

    /**
     * Destroys the inline toolbar module and cleans up resources
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        if (this.toolbarObj) {
            this.toolbarObj.destroy();
            detach(this.toolbarEle);
            this.toolbarObj = null;
        }
        if (this.textColorDDB) {
            this.textColorDDB.destroy();
            this.textColorDDB = null;
        }
        if (this.bgColorDDB) {
            this.bgColorDDB.destroy();
            this.bgColorDDB = null;
        }
        if (this.textColorPicker) {
            this.textColorPicker.destroy();
            detach(this.textPickerElement);
            this.textColorPicker = null;
        }
        if (this.bgColorPicker) {
            this.bgColorPicker.destroy();
            detach(this.bgPickerElement);
            this.bgColorPicker = null;
        }
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupElement);
            this.popupObj = null;
        }
        if (this.inlineToolbarTooltip) {
            this.inlineToolbarTooltip.destroy();
        }
        this.toolbarRenderer = null;
        this.inlineToolbarTooltip = null;
        this.editor = null;
    }

    /**
     * Handles property changes to update the toolbar configuration
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    protected onPropertyChanged(e: { [key: string]: BlockEditorModel }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const newProp: InlineToolbarSettingsModel = e.newProp.inlineToolbar;
        const oldProp: InlineToolbarSettingsModel = e.oldProp.inlineToolbar;
        if (!isNullOrUndefined(newProp)) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'width':
                    if (newProp.width !== oldProp.width) {
                        this.popupObj.width = newProp.width;
                    }
                    break;
                case 'items': {
                    const flatenedToolbarItems: ItemModel[] = transformIntoToolbarItem(newProp.items);
                    this.toolbarObj.items = flatenedToolbarItems;
                    break;
                }
                }
            }
        }
    }
}
