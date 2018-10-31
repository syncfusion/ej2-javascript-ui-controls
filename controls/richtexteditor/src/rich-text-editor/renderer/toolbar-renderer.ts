import { addClass, Browser, removeClass, EventHandler } from '@syncfusion/ej2-base';
import { getInstance, closest, MouseEventArgs, selectAll } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, BeforeCreateArgs, OverflowMode } from '@syncfusion/ej2-navigations';
import { DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Popup } from '@syncfusion/ej2-popups';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { CLS_TOOLBAR, CLS_DROPDOWN_BTN, CLS_RTE_ELEMENTS, CLS_TB_BTN, CLS_INLINE_DROPDOWN,
        CLS_COLOR_CONTENT, CLS_FONT_COLOR_DROPDOWN, CLS_BACKGROUND_COLOR_DROPDOWN, CLS_COLOR_PALETTE,
        CLS_FONT_COLOR_PICKER, CLS_BACKGROUND_COLOR_PICKER } from '../base/classes';
import { IRenderer, IRichTextEditor, IToolbarOptions, IDropDownModel, IColorPickerModel, IColorPickerEventArgs } from '../base/interface';
import { isIDevice } from '../base/util';
import { ColorPicker, PaletteTileEventArgs, ModeSwitchEventArgs } from '@syncfusion/ej2-inputs';

/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 * @hidden
 */
export class ToolbarRenderer implements IRenderer {
    private mode: OverflowMode;
    private toolbarPanel: Element;
    protected parent: IRichTextEditor;
    private currentElement: HTMLElement;
    private currentDropdown: DropDownButton;
    private popupOverlay: HTMLElement;
    private colorPicker: ColorPicker;
    /**
     * Constructor for toolbar renderer module
     */
    constructor(parent?: IRichTextEditor) {
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
        if (this.parent.readonly || !this.parent.enabled) { return; }
        this.parent.notify(events.toolbarClick, args);
        this.parent.trigger('toolbarClick', args);
    }

    private dropDownSelected(args: MenuEventArgs): void {
        this.parent.notify(events.dropDownSelect, args);
    }

    private beforeDropDownItemRender(args: MenuEventArgs): void {
        if (this.parent.readonly || !this.parent.enabled) { return; }
        this.parent.notify(events.beforeDropDownItemRender, args);
    }

    private dropDownOpen(args: MenuEventArgs): void {
        this.parent.notify(events.selectionSave, args);
    }

    private dropDownClose(args: MenuEventArgs): void {
        this.parent.notify(events.selectionRestore, args);
    }

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
        args.rteToolbarObj.toolbarObj.createElement = this.parent.createElement;
        args.rteToolbarObj.toolbarObj.appendTo(args.target);
    }

    public renderDropDownButton(args: IDropDownModel): DropDownButton {
        let css: string;
        args.element.classList.add(CLS_DROPDOWN_BTN);
        css = args.cssClass + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN;
        if (this.parent.inlineMode.enable && Browser.isDevice) {
            css = css + ' ' + CLS_INLINE_DROPDOWN;
        }
        let proxy: this = this;
        let dropDown: DropDownButton = new DropDownButton({
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
                for (let index: number = 0; index < args.element.childNodes.length; index++) {
                    let divNode: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
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
                if (Browser.isDevice && !args.element.parentElement.classList.contains(classes.CLS_QUICK_DROPDOWN)) {
                    let popupInst: Popup = getInstance(args.element.parentElement, Popup) as Popup;
                    popupInst.relateTo = document.body;
                    popupInst.position = { X: 0, Y: 0 };
                    popupInst.targetType = 'container';
                    popupInst.collision = { X: 'none', Y: 'none' };
                    popupInst.offsetY = 4;
                    this.setIsModel(args.element.parentElement);
                }
            },
            close: this.dropDownClose.bind(this),
            open: this.dropDownOpen.bind(this),
            beforeItemRender: this.beforeDropDownItemRender.bind(this)
        });
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        args.element.tabIndex = -1;
        return dropDown;
    }
    private onPopupOverlay(args: MouseEvent): void {
        (closest(this.popupOverlay, '.e-popup-container') as HTMLElement).style.display = 'none';
        this.popupOverlay.style.display = 'none';
        removeClass([this.popupOverlay], 'e-popup-overlay');
    }

    private setIsModel(element: HTMLElement): void {
        if (!closest(element, '.e-popup-container')) {
            let popupContainer: HTMLElement = this.parent.createElement('div', {
                className: 'e-rte-modal-popup e-popup-container e-center'
            });
            element.parentNode.insertBefore(popupContainer, element);
            popupContainer.appendChild(element);
            popupContainer.style.zIndex = element.style.zIndex;
            popupContainer.style.display = 'flex';
            element.style.position = 'relative';
            addClass([element], 'e-popup-modal');
            this.popupOverlay = this.parent.createElement('div', { className: 'e-popup-overlay' });
            this.popupOverlay.style.zIndex = (parseInt(element.style.zIndex, null) - 1).toString();
            this.popupOverlay.style.display = 'block';
            popupContainer.appendChild(this.popupOverlay);
            EventHandler.add(this.popupOverlay, 'click touchmove', this.onPopupOverlay, this);
        } else {
            element.parentElement.style.display = 'flex';
            (element.nextElementSibling as HTMLElement).style.display = 'block';
            addClass([element.nextElementSibling], 'e-popup-overlay');
        }
    }
    private paletteSelection(dropDownArgs: BeforeOpenCloseMenuEventArgs, currentElement: HTMLElement): void {
        let ele: Element = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
        let colorbox: HTMLElement[] = [].slice.call(selectAll('.e-tile', ele.parentElement));
        removeClass(colorbox, 'e-selected');
        let style: string = (currentElement.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor;
        (colorbox.filter((colorbox: HTMLElement) => {
            if ( colorbox.style.backgroundColor === style) {
                addClass([colorbox], 'e-selected');
            }
        }));
    }
    public renderColorPickerDropDown(args: IColorPickerModel, item: string, colorPicker: ColorPicker): DropDownButton {
        let proxy: this = this;
        let css: string = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_DROPDOWN : CLS_FONT_COLOR_DROPDOWN));
        let content: HTMLElement = proxy.parent.createElement('span', { className: CLS_COLOR_CONTENT });
        let inlineEle: HTMLElement = proxy.parent.createElement('span', { className: args.cssClass }); let range: Range;
        inlineEle.style.borderBottomColor = (item === 'backgroundcolor') ?
            proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
        content.appendChild(inlineEle);
        let dropDown: DropDownButton = new DropDownButton({
            target: colorPicker.element.parentElement,
            cssClass: css,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            beforeOpen: (dropDownArgs: BeforeOpenCloseMenuEventArgs): void => {
                proxy.parent.notify(events.selectionRestore, {});
                if (proxy.parent.readonly || !proxy.parent.enabled) { dropDownArgs.cancel = true; return; }
                let element: HTMLElement = (dropDownArgs.event) ? (dropDownArgs.event.target as HTMLElement) : null;
                proxy.currentElement = dropDown.element; proxy.currentDropdown = dropDown;
                proxy.paletteSelection(dropDownArgs, proxy.currentElement);
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    dropDownArgs.cancel = true;
                    let colorpickerValue: string = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        (element.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor;
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    if ((range.startContainer.nodeName === 'TD' || closest(range.startContainer.parentNode, 'td')) && range.collapsed) {
                        proxy.parent.notify(events.tableColorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                            value: colorpickerValue }
                        });
                    } else {
                        proxy.parent.notify(events.colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    return;
                } else {
                    if (Browser.isDevice) {
                        let popupInst: Popup = getInstance(dropDownArgs.element.parentElement, Popup) as Popup;
                        popupInst.relateTo = document.body;
                        popupInst.position = { X: 0, Y: 0 };
                        popupInst.targetType = 'container';
                        popupInst.collision = { X: 'fit', Y: 'fit' };
                        popupInst.offsetY = 4;
                        this.setIsModel(dropDownArgs.element.parentElement);
                    }
                    let ele: HTMLElement = (dropDownArgs.element.querySelector('.e-control.e-colorpicker') as HTMLElement);
                    let inst: ColorPicker = getInstance(ele, ColorPicker) as ColorPicker;
                    inst.showButtons = (dropDownArgs.element.querySelector('.e-color-palette')) ? false : true;
                }
                dropDownArgs.element.onclick = (args: MouseEventArgs): void => {
                    if ((args.target as HTMLElement).classList.contains('e-cancel')) { dropDown.toggle(); }
                };
            },
            open: (dropDownArgs: OpenCloseMenuEventArgs): void => {
                let ele: HTMLElement = (dropDownArgs.element.querySelector('.e-control.e-colorpicker') as HTMLElement);
                let focusEle: HTMLElement;
                if (dropDownArgs.element.querySelector('.e-color-palette')) {
                    focusEle = (ele.parentElement.querySelector('.e-palette') as HTMLElement);
                } else { focusEle = (ele.parentElement.querySelector('e-handler') as HTMLElement); }
                if (focusEle) { focusEle.focus(); }
            },
            beforeClose: (dropDownArgs: BeforeOpenCloseMenuEventArgs): void => {
                let element: HTMLElement = (dropDownArgs.event) ? (dropDownArgs.event.target as HTMLElement) : null;
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    let colorpickerValue: string = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        (element.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor;
                    /* tslint:enable */
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    if ((range.startContainer.nodeName === 'TD' || closest(range.startContainer.parentNode, 'td')) && range.collapsed) {
                        proxy.parent.notify(events.tableColorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
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
                let dropElement: HTMLElement = closest(dropDownArgs.element.parentElement, '.e-popup-container') as HTMLElement;
                if (dropElement) {
                    dropElement.style.display = 'none'; (dropElement.lastElementChild as HTMLElement).style.display = 'none';
                    removeClass([dropElement.lastElementChild as HTMLElement], 'e-popup-overlay');
                }
            }
        });
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        args.element.tabIndex = -1;
        dropDown.element.onmousedown = (): void => {
            proxy.parent.notify(events.selectionSave, {});
        };
        return dropDown;
    }
    public renderColorPicker(args: IColorPickerModel, item: string): ColorPicker {
        let proxy: this = this;
        this.colorPicker = new ColorPicker({
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            inline: true,
            created: () => {
                let value: string = (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
                this.colorPicker.setProperties({ value: value });
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            beforeTileRender: (args: PaletteTileEventArgs) => {
                args.element.classList.add(CLS_COLOR_PALETTE);
            },
            change: (colorPickerArgs: IColorPickerEventArgs): void => {
                /* tslint:disable */
                let colorpickerValue: string = Browser.info.name === 'msie' || Browser.info.name === 'edge' || isIDevice() ? colorPickerArgs.currentValue.rgba : colorPickerArgs.currentValue.hex;
                /* tslint:enable */
                colorPickerArgs.item = {
                    command: args.command,
                    subCommand: args.subCommand,
                    value: colorpickerValue
                };
                (proxy.currentElement.querySelector('.' + CLS_RTE_ELEMENTS) as HTMLElement).style.borderBottomColor = colorpickerValue;
                let range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(
                    proxy.parent.contentModule.getDocument());
                if ((range.startContainer.nodeName === 'TD' || closest(range.startContainer.parentNode, 'td')) && range.collapsed) {
                    proxy.parent.notify(events.tableColorPickerChanged, colorPickerArgs);
                } else {
                    proxy.parent.notify(events.colorPickerChanged, colorPickerArgs);
                }
                proxy.currentDropdown.toggle();
            },
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                this.colorPicker.showButtons = args.mode === 'Palette' ? false : true;
            }
        });
        this.colorPicker.columns = (item === 'backgroundcolor') ? this.parent.backgroundColor.columns : this.parent.fontColor.columns;
        this.colorPicker.presetColors = (item === 'backgroundcolor') ? this.parent.backgroundColor.colorCode :
          this.parent.fontColor.colorCode;
        this.colorPicker.cssClass = (item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_PICKER : CLS_FONT_COLOR_PICKER;
        this.colorPicker.createElement = this.parent.createElement;
        this.colorPicker.appendTo(document.body.querySelector(args.target) as HTMLElement);
        return this.colorPicker;
    }

    /**
     * The function is used to render RichTextEditor toolbar
     */
    public renderPanel(): void {
        this.getPanel().classList.add(CLS_TOOLBAR);
    }

    /**
     * Get the toolbar element of RichTextEditor
     * @return {Element}
     */
    public getPanel(): Element {
        return this.toolbarPanel;
    }

    /**
     * Set the toolbar element of RichTextEditor
     * @param  {Element} panel
     */
    public setPanel(panel: Element): void {
        this.toolbarPanel = panel;
    }
}