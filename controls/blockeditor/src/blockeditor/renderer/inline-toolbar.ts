import { detach, isNullOrUndefined, updateCSSText } from '@syncfusion/ej2-base';
import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Tooltip } from '@syncfusion/ej2-popups';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { ToolbarItemClickEventArgs } from '../../models/eventargs';
import { IDropDownRenderOptions, IToolbarRenderOptions } from '../../common/interface';
import { ToolbarRenderer } from './common/index';
import { getInlineToolbarItems, transformIntoToolbarItem } from '../../common/utils/index';
import { InlineToolbarSettingsModel } from '../../models/index';
import { events } from '../../common/constant';
import * as constants from '../../common/constant';
import { BlockEditor } from '../base/blockeditor';
import { BlockEditorModel } from '../base/blockeditor-model';
import { IToolbarItemModel } from '../../models/interface';
import { ToolbarCommandName } from '../../models/types';

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
    public toolbarObj: Toolbar;
    private inlineToolbarTooltip: Tooltip;
    private toolbarEle: HTMLElement;
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
            this.initializeColorPickerAndDropdown('color');
        }
        if (this.hasToolbarItemId('bgColor')) {
            this.initializeColorPickerAndDropdown('bgColor');
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

    private initializeColorPickerAndDropdown(type: 'color' | 'bgColor'): void {
        const toolbarElement: HTMLElement = document.querySelector('#' + this.editor.element.id + constants.BLOCKEDITOR_INLINETBAR_ID);
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
        const cssText: string = 'border-bottom: 3px solid #000000;';
        updateCSSText(iconElement, cssText);
        iconWrapper.appendChild(iconElement);
        dropDown.element.insertBefore(iconWrapper, dropDown.element.querySelector('.e-caret'));
        return dropDown;
    }

    private handleColorChange(type: 'color' | 'bgColor', args: ColorPickerEventArgs): void {
        this.editor.blockManager.observer.notify('handleColorpickerChange', { type, value: args.currentValue.rgba });
        const dropdownButton: DropDownButton = type === 'color' ? this.textColorDDB : this.bgColorDDB;
        dropdownButton.toggle();
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
        return 'inlineToolbarSettings';
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
        if (this.inlineToolbarTooltip) {
            this.inlineToolbarTooltip.destroy();
        }
        this.toolbarRenderer = null;
        this.inlineToolbarTooltip = null;
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
                    break;
                }
                }
            }
        }
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
}
