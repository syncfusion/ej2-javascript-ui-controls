import { addClass, Browser, removeClass, EventHandler, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getInstance, closest, MouseEventArgs, selectAll, detach } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, BeforeCreateArgs, OverflowMode } from '@syncfusion/ej2-navigations';
import { DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Popup } from '@syncfusion/ej2-popups';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { CLS_TOOLBAR, CLS_DROPDOWN_BTN, CLS_RTE_ELEMENTS, CLS_TB_BTN, CLS_INLINE_DROPDOWN,
    CLS_COLOR_CONTENT, CLS_FONT_COLOR_DROPDOWN, CLS_BACKGROUND_COLOR_DROPDOWN, CLS_COLOR_PALETTE,
    CLS_FONT_COLOR_PICKER, CLS_BACKGROUND_COLOR_PICKER, CLS_CUSTOM_TILE, CLS_NOCOLOR_ITEM,
    CLS_BULLETFORMATLIST_TB_BTN, CLS_NUMBERFORMATLIST_TB_BTN, CLS_LIST_PRIMARY_CONTENT } from '../base/classes';
import { IRenderer, IRichTextEditor, IToolbarOptions, IDropDownModel, IColorPickerModel, IColorPickerEventArgs } from '../base/interface';
import { ColorPicker, PaletteTileEventArgs, ModeSwitchEventArgs } from '@syncfusion/ej2-inputs';
import { hasClass } from '../base/util';

/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 *
 * @hidden
 * @deprecated
 */
export class ToolbarRenderer implements IRenderer {
    private mode: OverflowMode;
    private toolbarPanel: Element;
    protected parent: IRichTextEditor;
    private popupContainer: HTMLElement;
    private currentElement: HTMLElement;
    private currentDropdown: DropDownButton;
    private popupOverlay: HTMLElement;
    /**
     * Constructor for toolbar renderer module
     *
     * @param {IRichTextEditor} parent - specifies the parent element.
     */
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.wireEvent();
    }

    private wireEvent(): void {
        this.parent.on(events.destroy, this.unWireEvent, this);
    }

    private unWireEvent(): void {
        this.parent.off(events.destroy, this.unWireEvent);
        if (this.popupOverlay) {
            EventHandler.remove(this.popupOverlay, 'click touchmove', this.onPopupOverlay);
        }
        this.removePopupContainer();
    }

    private toolbarBeforeCreate(e: BeforeCreateArgs): void {
        if (this.mode === 'Extended') {
            e.enableCollision = false;
        }
    }

    private toolbarCreated(): void {
        this.parent.notify(events.toolbarCreated, this);
    }

    private toolbarClicked(args: ClickEventArgs): void {
        if ( !this.parent.enabled) {
            return;
        }
        if (!this.parent.readonly || isNullOrUndefined(args.item)) {
            this.parent.notify(events.toolbarClick, args);
        }
        this.parent.trigger('toolbarClick', args);
    }

    private dropDownSelected(args: MenuEventArgs): void {
        this.parent.notify(events.dropDownSelect, args);
        this.onPopupOverlay();
    }

    private beforeDropDownItemRender(args: MenuEventArgs): void {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(events.beforeDropDownItemRender, args);
    }

    private dropDownOpen(args: MenuEventArgs): void {
        if (args.element.parentElement.getAttribute('id').indexOf('TableCell') > -1) {
            const listEle: NodeListOf<HTMLElement> = args.element.querySelectorAll('li');
            if (this.parent.inputElement.querySelectorAll('.e-cell-select').length === 1) {
                addClass([listEle[0]], 'e-disabled');
                removeClass([listEle[1], listEle[2]], 'e-disabled');
            } else if (this.parent.inputElement.querySelectorAll('.e-cell-select').length > 1) {
                removeClass([listEle[0]], 'e-disabled');
                addClass([listEle[1], listEle[2]], 'e-disabled');
            }
        }
        if (Browser.isDevice && !args.element.parentElement.classList.contains(classes.CLS_QUICK_DROPDOWN)) {
            this.popupModal(args.element.parentElement);
        }
        this.parent.notify(events.selectionSave, args);
    }

    private dropDownClose(args: MenuEventArgs): void {
        this.removePopupContainer();
        this.parent.notify(events.selectionRestore, args);
    }

    private removePopupContainer(): void {
        if (Browser.isDevice && !isNullOrUndefined(this.popupContainer)) {
            const popupEle : HTMLElement = this.popupContainer.querySelector('.e-dropdown-popup.e-tbar-btn.e-control');
            if (popupEle) {
                this.popupContainer.parentNode.insertBefore(popupEle, this.popupContainer.nextSibling);
                popupEle.style.removeProperty('position');
                removeClass([popupEle], 'e-popup-modal');
            }
            detach(this.popupContainer);
            this.popupContainer = undefined;
        }
    }

    /**
     * renderToolbar method
     *
     * @param {IToolbarOptions} args - specifies the arguments.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderToolbar(args: IToolbarOptions): void {
        this.setPanel(args.target);
        this.renderPanel();
        this.mode = args.overflowMode;
        args.rteToolbarObj.toolbarObj = new Toolbar({
            items: args.items,
            width: '100%',
            overflowMode: args.overflowMode,
            beforeCreate: this.toolbarBeforeCreate.bind(this),
            created: this.toolbarCreated.bind(this),
            clicked: this.toolbarClicked.bind(this),
            enablePersistence: args.enablePersistence,
            enableRtl: args.enableRtl
        });
        args.rteToolbarObj.toolbarObj.isStringTemplate = true;
        args.rteToolbarObj.toolbarObj.createElement = this.parent.createElement;
        args.rteToolbarObj.toolbarObj.appendTo(args.target);
    }

    /**
     * renderDropDownButton method
     *
     * @param {IDropDownModel} args - specifies the the arguments.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderDropDownButton(args: IDropDownModel): DropDownButton {
        let css: string;
        args.element.classList.add(CLS_DROPDOWN_BTN);
        css = args.cssClass + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN;
        if (this.parent.inlineMode.enable && Browser.isDevice) {
            css = css + ' ' + CLS_INLINE_DROPDOWN;
        }
        // eslint-disable-next-line
        let proxy: this = this;
        const dropDown: DropDownButton = new DropDownButton({
            items: args.items,
            iconCss: args.iconCss,
            cssClass: css,
            content: args.content,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            select: this.dropDownSelected.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                // eslint-disable-next-line
            for (let index: number = 0; index < args.element.childNodes.length; index++) {
                    const divNode: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
                    divNode.innerHTML = dropDown.content.trim();
                    if ( divNode.textContent .trim() !== ''
                && args.element.childNodes[index].textContent.trim() === divNode.textContent .trim()) {
                        if (!(args.element.childNodes[index] as HTMLElement).classList.contains('e-active')) {
                            addClass([args.element.childNodes[index]] as Element[], 'e-active');
                        }
                    } else {
                        removeClass([args.element.childNodes[index]] as Element[], 'e-active');
                    }
                }
                proxy.parent.notify(events.beforeDropDownOpen, args);
            },
            close: this.dropDownClose.bind(this),
            open: this.dropDownOpen.bind(this),
            beforeItemRender: this.beforeDropDownItemRender.bind(this)
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        args.element.tabIndex = -1;
        const popupElement: Element = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        return dropDown;
    }
    /**
     * renderListDropDown method
     *
     * @param {IDropDownModel} args - specifies the the arguments.
     * @param {string} item - specifies the string value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderListDropDown(args: IDropDownModel): DropDownButton {
        // eslint-disable-next-line
        const proxy: this = this;
        let css: string = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((args.itemName === 'NumberFormatList') ? CLS_NUMBERFORMATLIST_TB_BTN : CLS_BULLETFORMATLIST_TB_BTN));
        const content: HTMLElement = proxy.parent.createElement('span', { className: CLS_LIST_PRIMARY_CONTENT });
        const inlineEle: HTMLElement = proxy.parent.createElement('span', { className: args.cssClass });
        content.appendChild(inlineEle);
        const dropDown: DropDownButton = new DropDownButton({
            items: args.items,
            cssClass: css,
            content: args.content,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            select: this.dropDownSelected.bind(this),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                const element: HTMLElement = (args.event) ? (args.event.target as HTMLElement) : null;
                proxy.currentElement = dropDown.element;
                proxy.currentDropdown = dropDown;
                if (args.event && args.event.type === 'click' && (element.classList.contains(CLS_LIST_PRIMARY_CONTENT)
                        || element.parentElement.classList.contains(CLS_LIST_PRIMARY_CONTENT))) {
                    args.cancel = true;
                    return;
                }
                proxy.parent.notify(events.beforeDropDownOpen, args);
            },
            close: this.dropDownClose.bind(this),
            open: this.dropDownOpen.bind(this),
            beforeItemRender: this.beforeDropDownItemRender.bind(this)
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        args.element.tabIndex = -1;
        const popupElement: Element = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        if (args.element.childElementCount === 1) {
            dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        }
        args.element.tabIndex = -1; 
        dropDown.element.removeAttribute('type');
        return dropDown;
    }
    // eslint-disable-next-line
    private onPopupOverlay(args?: MouseEvent): void {
        if (!isNullOrUndefined(this.popupOverlay)) {
            (closest(this.popupOverlay, '.e-popup-container') as HTMLElement).style.display = 'none';
            this.popupOverlay.style.display = 'none';
            removeClass([this.popupOverlay], 'e-popup-overlay');
        }
    }

    private setIsModel(element: HTMLElement): void {
        if (!closest(element, '.e-popup-container')) {
            this.popupContainer = this.parent.createElement('div', {
                className: 'e-rte-modal-popup e-popup-container e-center'
            });
            element.parentNode.insertBefore(this.popupContainer, element);
            this.popupContainer.appendChild(element);
            this.popupContainer.style.zIndex = element.style.zIndex;
            this.popupContainer.style.display = 'flex';
            element.style.position = 'relative';
            addClass([element], 'e-popup-modal');
            this.popupOverlay = this.parent.createElement('div', { className: 'e-popup-overlay' });
            // eslint-disable-next-line
            this.popupOverlay.style.zIndex = (parseInt(element.style.zIndex, null) - 1).toString();
            this.popupOverlay.style.display = 'block';
            this.popupContainer.appendChild(this.popupOverlay);
            EventHandler.add(this.popupOverlay, 'click touchmove', this.onPopupOverlay, this);
        } else {
            element.parentElement.style.display = 'flex';
            this.popupOverlay = (element.nextElementSibling as HTMLElement);
            this.popupOverlay.style.display = 'block';
            addClass([this.popupOverlay], 'e-popup-overlay');
        }
    }
    private paletteSelection(dropDownArgs: BeforeOpenCloseMenuEventArgs, currentElement: HTMLElement): void {
        const ele: Element = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
        const colorbox: HTMLElement[] = [].slice.call(selectAll('.e-tile', ele.parentElement));
        removeClass(colorbox, 'e-selected');
        const style: string = (currentElement.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor;
        (colorbox.filter((colorbox: HTMLElement) => {
            if ( colorbox.style.backgroundColor === style) {
                addClass([colorbox], 'e-selected');
            }
        }));
    }
    /**
     * renderColorPickerDropDown method
     *
     * @param {IColorPickerModel} args - specifies the arguments.
     * @param {string} item - specifies the item.
     * @param {ColorPicker} colorPicker - specifies the colorpicker.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderColorPickerDropDown(args: IColorPickerModel, item: string, colorPicker: ColorPicker): DropDownButton {
        // eslint-disable-next-line
        const proxy: this = this;
        let css: string = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_DROPDOWN : CLS_FONT_COLOR_DROPDOWN));
        const content: HTMLElement = proxy.parent.createElement('span', { className: CLS_COLOR_CONTENT });
        const inlineEle: HTMLElement = proxy.parent.createElement('span', { className: args.cssClass });
        let range: Range;
        inlineEle.style.borderBottomColor = (item === 'backgroundcolor') ?
            proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
        content.appendChild(inlineEle);
        const dropDown: DropDownButton = new DropDownButton({
            target: colorPicker.element.parentElement, cssClass: css,
            enablePersistence: this.parent.enablePersistence, enableRtl: this.parent.enableRtl,
            beforeOpen: (dropDownArgs: BeforeOpenCloseMenuEventArgs): void => {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    dropDownArgs.cancel = true; return;
                }
                const element: HTMLElement = (dropDownArgs.event) ? (dropDownArgs.event.target as HTMLElement) : null;
                proxy.currentElement = dropDown.element; proxy.currentDropdown = dropDown;
                proxy.paletteSelection(dropDownArgs, proxy.currentElement);
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                        || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    dropDownArgs.cancel = true;
                    const colorpickerValue: string = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        (element.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor;
                    proxy.parent.notify(events.selectionRestore, {});
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    const parentNode: Node = range.startContainer.parentNode;
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                            (closest(range.startContainer.parentNode, 'td,th')) ||
                            (proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')))
                            && range.collapsed && args.subCommand === 'BackgroundColor') {
                        proxy.parent.notify(events.tableColorPickerChanged,
                                            {
                                                item: { command: args.command, subCommand: args.subCommand,
                                                    value: colorpickerValue }
                                            });
                    } else {
                        proxy.parent.notify(events.colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                            value: colorpickerValue }
                        });
                    }
                    return;
                } else {
                    const ele: HTMLElement = (dropDownArgs.element.querySelector('.e-control.e-colorpicker') as HTMLElement);
                    const inst: ColorPicker = getInstance(ele, ColorPicker) as ColorPicker;
                    inst.showButtons = (dropDownArgs.element.querySelector('.e-color-palette')) ? false : true; inst.dataBind();
                }
                dropDownArgs.element.onclick = (args: MouseEventArgs): void => {
                    if ((args.target as HTMLElement).classList.contains('e-cancel')) {
                        dropDown.toggle();
                    }
                };
            },
            open: (dropDownArgs: OpenCloseMenuEventArgs): void => {
                this.setColorPickerContentWidth(colorPicker); let focusEle: HTMLElement;
                const ele: HTMLElement = (dropDownArgs.element.querySelector('.e-control.e-colorpicker') as HTMLElement);
                if (dropDownArgs.element.querySelector('.e-color-palette')) {
                    focusEle = (ele.parentElement.querySelector('.e-palette') as HTMLElement);
                } else {
                    focusEle = (ele.parentElement.querySelector('e-handler') as HTMLElement);
                }
                if (focusEle) {
                    focusEle.focus();
                }
                if (Browser.isDevice) {
                    this.popupModal(dropDownArgs.element.parentElement);
                }
                this.pickerRefresh(dropDownArgs);
            },
            beforeClose: (dropDownArgs: BeforeOpenCloseMenuEventArgs): void => {
                const element: HTMLElement = (dropDownArgs.event) ? (dropDownArgs.event.target as HTMLElement) : null;
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                        || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    const colorpickerValue: string = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        (element.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor;
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                            closest(range.startContainer.parentNode, 'td,th')) && range.collapsed){
                        proxy.parent.notify(events.tableColorPickerChanged, { item: {
                            command: args.command, subCommand: args.subCommand,
                            value: colorpickerValue }
                        });
                    } else {
                        proxy.parent.notify(events.colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                            value: colorpickerValue }
                        });
                    }
                    return;
                }
            },
            close: (dropDownArgs: BeforeOpenCloseMenuEventArgs): void => {
                proxy.parent.notify(events.selectionRestore, {});
                const dropElement: HTMLElement = closest(dropDownArgs.element.parentElement, '.e-popup-container') as HTMLElement;
                if (dropElement) {
                    dropElement.style.display = 'none'; (dropElement.lastElementChild as HTMLElement).style.display = 'none';
                    removeClass([dropElement.lastElementChild as HTMLElement], 'e-popup-overlay');
                }
                if (Browser.isDevice && !isNullOrUndefined(dropElement)) {
                    const popupEle: HTMLElement = dropElement.querySelector('.e-dropdown-popup.e-tbar-btn.e-control');
                    if (popupEle) {
                        dropElement.parentNode.insertBefore(popupEle, dropElement.nextSibling);
                        popupEle.style.removeProperty('position'); removeClass([popupEle], 'e-popup-modal');
                    }
                    detach(dropElement); proxy.popupContainer = undefined;
                }
            }
        });
        dropDown.isStringTemplate = true; dropDown.createElement = proxy.parent.createElement; args.element.setAttribute('role', 'button');
        dropDown.appendTo(args.element);
        const popupElement: Element = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        args.element.tabIndex = -1; dropDown.element.removeAttribute('type');
        dropDown.element.onmousedown = (): void => {
            proxy.parent.notify(events.selectionSave, {});
        };
        dropDown.element.onkeydown = (): void => {
            proxy.parent.notify(events.selectionSave, {});
        };
        return dropDown;
    }
    private pickerRefresh(dropDownArgs: OpenCloseMenuEventArgs): void {
        if (this.parent.backgroundColor.mode === 'Picker') {
            const popupElem: HTMLElement = dropDownArgs.element.parentElement;
            popupElem.style.width = (popupElem.offsetWidth + 5).toString() + 'px';
            (getInstance(popupElem, Popup) as Popup).refreshPosition(popupElem);
            popupElem.style.width = (popupElem.offsetWidth - 5).toString() + 'px';
        }
    }
    private popupModal(element: HTMLElement): void {
        const popupInst: Popup = getInstance(element, Popup) as Popup;
        popupInst.relateTo = document.body;
        popupInst.position = { X: 0, Y: 0 };
        popupInst.targetType = 'container';
        popupInst.collision = { X: 'fit', Y: 'fit' };
        popupInst.offsetY = 4;
        popupInst.dataBind();
        this.setIsModel(element);
    }
    private setColorPickerContentWidth(colorPicker: ColorPicker): void {
        const colorPickerContent: HTMLElement = (colorPicker.element.nextSibling as HTMLElement);
        if (colorPickerContent.style.width === '0px') {
            colorPickerContent.style.width = '';
            const borderWidth: number = parseInt(getComputedStyle(colorPickerContent).borderBottomWidth, 10);
            colorPickerContent.style.width = formatUnit((colorPickerContent.children[0] as HTMLElement).offsetWidth
                + borderWidth + borderWidth);
        }
    }
    /**
     * renderColorPicker method
     *
     * @param {IColorPickerModel} args - specifies the arguments
     * @param {string} item - specifies the string values
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderColorPicker(args: IColorPickerModel, item: string): ColorPicker {
        // eslint-disable-next-line
        let proxy: this = this;
        let value: string;
        const colorPicker: ColorPicker = new ColorPicker({
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            inline: true,
            created: () => {
                const value: string = (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
                colorPicker.setProperties({ value: value });
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            beforeTileRender: (args: PaletteTileEventArgs) => {
                args.element.classList.add(CLS_COLOR_PALETTE);
                args.element.classList.add(CLS_CUSTOM_TILE);
                if (args.value === '') {
                    args.element.classList.add(CLS_NOCOLOR_ITEM);
                }
            },
            change: (colorPickerArgs: IColorPickerEventArgs): void => {
                const colorpickerValue: string = colorPickerArgs.currentValue.rgba;
                colorPickerArgs.item = {
                    command: args.command,
                    subCommand: args.subCommand,
                    value: colorpickerValue
                };
                proxy.parent.notify(events.selectionRestore, {});
                (proxy.currentElement.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor = colorpickerValue;
                const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' || range.startContainer.nodeName === 'BODY' ||
                        closest(range.startContainer.parentNode, 'td,th')) && range.collapsed && args.subCommand === 'BackgroundColor') {
                    proxy.parent.notify(events.tableColorPickerChanged, colorPickerArgs);
                } else {
                    proxy.parent.notify(events.colorPickerChanged, colorPickerArgs);
                }
                proxy.currentDropdown.toggle();
            },
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                value = colorPicker.value;
                if (value === '') {
                    colorPicker.setProperties({ value: ((args.mode === 'Picker') ? '#008000ff' : '') }, true);
                }
                colorPicker.showButtons = args.mode === 'Palette' ? false : true;
            }
        });
        colorPicker.isStringTemplate = true;
        colorPicker.columns = (item === 'backgroundcolor') ? this.parent.backgroundColor.columns : this.parent.fontColor.columns;
        colorPicker.presetColors = (item === 'backgroundcolor') ? this.parent.backgroundColor.colorCode :
            this.parent.fontColor.colorCode;
        colorPicker.cssClass = (item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_PICKER : CLS_FONT_COLOR_PICKER;
        colorPicker.createElement = this.parent.createElement;
        colorPicker.appendTo(document.getElementById(args.target) as HTMLElement);
        return colorPicker;
    }

    /**
     * The function is used to render Rich Text Editor toolbar
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderPanel(): void {
        this.getPanel().classList.add(CLS_TOOLBAR);
    }

    /**
     * Get the toolbar element of RichTextEditor
     *
     * @returns {Element} - specifies the element.
     * @hidden
     * @deprecated
     */
    public getPanel(): Element {
        return this.toolbarPanel;
    }

    /**
     * Set the toolbar element of RichTextEditor
     *
     * @returns {void}
     * @param  {Element} panel - specifies the element.
     * @hidden
     * @deprecated
     */
    public setPanel(panel: Element): void {
        this.toolbarPanel = panel;
    }
}
