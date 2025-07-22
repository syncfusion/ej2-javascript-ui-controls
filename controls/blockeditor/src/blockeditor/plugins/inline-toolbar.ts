import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Popup, Tooltip, Position as TooltipPosition } from '@syncfusion/ej2-popups';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { BlockEditor, BlockEditorModel, BuiltInToolbar, IDropDownButtonArgs, IPopupRenderOptions, IToolbarRenderOptions, ToolbarCloseEventArgs, ToolbarItemClickedEventArgs, ToolbarOpenEventArgs } from '../base/index';
import { ToolbarRenderer } from '../renderer/common/index';
import { deepClone, getBlockContentElement, getBlockModelById, getInlineToolbarItems, getNormalizedKey, getParentBlock, getSelectionRange, normalizeRange, sanitizeContent, sanitizeStyles, transformIntoToolbarItem } from '../utils/index';
import { BlockActionItemModel, BlockModel, ContentModel, InlineToolbarSettingsModel, StyleModel, ToolbarItemModel } from '../models/index';
import { events } from '../base/constant';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { findClosestParent } from '../utils/dom';

/**
 * InlineToolbarModule class is used to render the inline toolbar for the block editor.
 *
 * @hidden
 */
export class InlineToolbarModule {

    private editor: BlockEditor;
    private toolbar: Toolbar;
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
        this.editor.on('keydown', this.onKeydown, this);
        this.editor.on('rtl-changed', this.applyRtlSettings, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.inlineToolbarCreated, this.handleInlineToolbarCreated);
        this.editor.off(events.inlineToolbarItemClick, this.handleInlineToolbarItemClick);
        this.editor.off(events.inlineToolbarBeforeOpen, this.handleInlineToolbarBeforeOpen);
        this.editor.off(events.formattingPerformed, this.toggleToolbarActiveState);
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off('keydown', this.onKeydown);
        this.editor.on('rtl-changed', this.applyRtlSettings);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        let items: ToolbarItemModel[];
        if (this.editor.inlineToolbar.items.length > 0) {
            items = this.editor.inlineToolbar.items;
        }
        else {
            items = getInlineToolbarItems();
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            this.editor.inlineToolbar.items = items;
            (this.editor as any).isProtectedOnChange = prevOnChange;
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
        const flatenedToolbarItems: ItemModel[] = transformIntoToolbarItem(items);
        this.toolbarEle = this.editor.createElement('div', {
            className: 'e-blockeditor-inline-toolbar'
        });
        this.popupElement = this.editor.createElement('div', {
            className: 'e-blockeditor-inline-toolbar-popup'
        });
        document.body.appendChild(this.toolbarEle);
        document.body.appendChild(this.popupElement);

        this.toolbarObj = this.renderToolbar({
            element: this.toolbarEle,
            items: flatenedToolbarItems,
            width: this.editor.inlineToolbar.width,
            overflowMode: 'Extended',
            enablePersistence: this.editor.enablePersistence
        });
        const args: IPopupRenderOptions = {
            element: this.popupElement,
            content: this.toolbarEle
        };
        this.popupObj = this.editor.popupRenderer.renderPopup(args);
    }

    private onKeydown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }
        const command: string = this.editor.keyCommandMap.get(normalizedKey);
        const allowedCommands: string[] = ['bold', 'italic', 'underline', 'strikethrough'];
        if (allowedCommands.indexOf(command) !== -1) {
            e.preventDefault();
            const selection: Selection = window.getSelection();
            if (selection.isCollapsed) {
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
            cssClass: 'e-blockeditor-inline-toolbar-tooltip',
            position: 'TopCenter',
            target: '.e-toolbar-item',
            windowCollision: true,
            element: document.querySelector('.e-blockeditor-inline-toolbar-popup') as HTMLElement
        });
    }

    public showInlineToolbar(range: Range, event?: Event): void {
        const notAllowedTypes: string[] = ['Code', 'Image'];
        const blockElement: HTMLElement = findClosestParent(range.commonAncestorContainer, '.e-block');
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

    public hideInlineToolbar(e?: Event): void {
        const inlineTbarPopup: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar-popup');
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
        this.toolbar = this.toolbarRenderer.renderToolbar(args);
        return this.toolbar;
    }

    private handleInlineToolbarCreated(): void {
        this.initializeColorPickers();
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

    public toggleToolbarActiveState(): void {
        const range: Range = getSelectionRange();
        if (!range) { return; }

        const blockElement: HTMLElement = getParentBlock(range.startContainer);
        if (!blockElement) { return; }

        const block: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        if (!block || !block.content) { return; }

        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return; }

        const toolbarEl: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar-popup');
        if (!toolbarEl) { return; }

        const toolbarItems: NodeListOf<HTMLElement> = toolbarEl.querySelectorAll('.e-toolbar-item');

        toolbarItems.forEach((item: HTMLElement) => item.classList.remove('e-active'));

        const normalizedRange: Range = normalizeRange(range);

        const selectedNodes: Node[] = this.getNodesInRange(normalizedRange, contentElement);
        const selectedContentModels: ContentModel[] = [];

        selectedNodes.forEach((node: Node) => {
            const id: string = (node as HTMLElement).id;
            const model: ContentModel = block.content.find((content: ContentModel) => content.id === id);
            if (model) {
                selectedContentModels.push(model);
            }
        });

        if (!selectedContentModels.length) { return; }

        const commonStyles: Partial<StyleModel> = this.getCommonStyles(selectedContentModels);

        toolbarItems.forEach((item: HTMLElement) => {
            const command: BuiltInToolbar = item.getAttribute('data-command') as BuiltInToolbar;

            let isActive: boolean = false;
            switch (command) {
            case 'Bold':
                isActive = commonStyles.bold === true;
                break;
            case 'Italic':
                isActive = commonStyles.italic === true;
                break;
            case 'Underline':
                isActive = commonStyles.underline === true;
                break;
            case 'Strikethrough':
                isActive = commonStyles.strikethrough === true;
                break;
            case 'Superscript':
                isActive = commonStyles.superscript === true;
                break;
            case 'Subscript':
                isActive = commonStyles.subscript === true;
                break;
            case 'Uppercase':
                isActive = commonStyles.uppercase === true;
                break;
            case 'Lowercase':
                isActive = commonStyles.lowercase === true;
                break;

            case 'Color':
            case 'BgColor': {
                const type: 'color' | 'bgColor' = command === 'Color' ? 'color' : 'bgColor';
                // es-lint-disable-next-line  @typescript-eslint/no-explicit-any
                this.setColors(type, (commonStyles as any)[`${type}`]);
                break;
            }
            }
            item.classList.toggle('e-active', isActive);
        });
    }

    private getNodesInRange(range: Range, container: HTMLElement): Node[] {
        const selectedNodes: Node[] = [];

        const walker: TreeWalker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node: Node) => {
                    const nodeRange: Range = document.createRange();
                    nodeRange.selectNodeContents(node);
                    return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        while (walker.nextNode()) {
            selectedNodes.push(walker.currentNode);
        }

        return selectedNodes;
    }

    private getCommonStyles(contentModels: ContentModel[]): Partial<StyleModel> {
        if (!contentModels.length) { return{}; }

        const commonStyles: Partial<StyleModel> = deepClone(sanitizeStyles(contentModels[0].styles));

        for (let i: number = 1; i < contentModels.length; i++) {
            const currentStyles: Partial<StyleModel> = contentModels[parseInt(i.toString(), 10)].styles;

            commonStyles.bold = commonStyles.bold && currentStyles.bold;
            commonStyles.italic = commonStyles.italic && currentStyles.italic;
            commonStyles.underline = commonStyles.underline && currentStyles.underline;
            commonStyles.strikethrough = commonStyles.strikethrough && currentStyles.strikethrough;
            commonStyles.superscript = commonStyles.superscript && currentStyles.superscript;
            commonStyles.subscript = commonStyles.subscript && currentStyles.subscript;
            commonStyles.uppercase = commonStyles.uppercase && currentStyles.uppercase;
            commonStyles.lowercase = commonStyles.lowercase && currentStyles.lowercase;

            commonStyles.color = (commonStyles.color === currentStyles.color) ? commonStyles.color : '';
            commonStyles.bgColor = (commonStyles.bgColor === currentStyles.bgColor) ? commonStyles.bgColor : '';

            commonStyles.custom = (commonStyles.custom === currentStyles.custom) ? commonStyles.custom : '';
        }

        return commonStyles;
    }

    private initializeColorPickers(): void {
        const toolbarElement: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar');
        if (!toolbarElement) { return; }
        this.textPickerElement = this.editor.createElement('input', { attrs: { type: 'color' } });
        this.textColorPicker = this.createColorPicker('color', this.textPickerElement);
        const colorBtn: HTMLSpanElement = (toolbarElement.querySelector('#toolbar-color-dropdown') as HTMLSpanElement);

        if (colorBtn) {
            this.textColorDDB = this.createDropDown({
                instance: {
                    target: this.textColorPicker.element.closest('.e-colorpicker-wrapper')
                },
                element: colorBtn,
                inlineClass: 'e-inline-color-icon',
                type: 'color'
            });
        }

        this.bgPickerElement = this.editor.createElement('input', { attrs: { type: 'color' } });
        this.bgColorPicker = this.createColorPicker('bgColor', this.bgPickerElement);
        const bgColorBtn: HTMLSpanElement = (toolbarElement.querySelector('#toolbar-bgcolor-dropdown') as HTMLSpanElement);
        if (bgColorBtn) {
            this.bgColorDDB = this.createDropDown({
                instance: {
                    target: this.bgColorPicker.element.closest('.e-colorpicker-wrapper')
                },
                element: bgColorBtn,
                inlineClass: 'e-inline-bgColor-icon',
                type: 'bgColor'
            });
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

    private createDropDown(args: IDropDownButtonArgs): DropDownButton {
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
        const toolbarElement: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar');
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

    public destroy(): void {
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
        this.toolbar = null;
        this.toolbarRenderer = null;
        this.inlineToolbarTooltip = null;
        this.removeEventListeners();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    /* eslint-disable */
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
    /* eslint-enable */
}
