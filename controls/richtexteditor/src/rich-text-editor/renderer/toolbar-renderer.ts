import { addClass, Browser, L10n, removeClass, formatUnit, isNullOrUndefined, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { getInstance, closest, MouseEventArgs, selectAll } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, BeforeCreateArgs, OverflowMode } from '@syncfusion/ej2-navigations';
import { DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Popup, Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { CLS_TOOLBAR, CLS_DROPDOWN_BTN, CLS_RTE_ELEMENTS, CLS_TB_BTN, CLS_INLINE_DROPDOWN,
    CLS_COLOR_CONTENT, CLS_FONT_COLOR_DROPDOWN, CLS_BACKGROUND_COLOR_DROPDOWN, CLS_COLOR_PALETTE,
    CLS_FONT_COLOR_PICKER, CLS_BACKGROUND_COLOR_PICKER, CLS_CUSTOM_TILE, CLS_NOCOLOR_ITEM,
    CLS_BULLETFORMATLIST_TB_BTN, CLS_NUMBERFORMATLIST_TB_BTN, CLS_LIST_PRIMARY_CONTENT } from '../base/classes';
import { IRenderer, IRichTextEditor, IToolbarOptions, IDropDownModel, IColorPickerModel, IColorPickerEventArgs } from '../base/interface';
import { ColorPicker, PaletteTileEventArgs, ModeSwitchEventArgs } from '@syncfusion/ej2-inputs';
import { hasClass } from '../base/util';
import { ServiceLocator } from '../services/service-locator';

/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 *
 * @hidden
 * @deprecated
 */
export class ToolbarRenderer implements IRenderer {
    private mode: OverflowMode;
    private toolbarPanel: Element;
    /**
     *
     * @hidden
     * @private
     */
    public parent: IRichTextEditor;
    private currentElement: HTMLElement;
    private currentDropdown: DropDownButton;
    private tooltip: Tooltip;
    private l10n: L10n;

    /**
     * Constructor for toolbar renderer module
     *
     * @param {IRichTextEditor} parent - specifies the parent element.
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     */
    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        if (serviceLocator){
            this.l10n = serviceLocator.getService<L10n>('rteLocale');
        }
        this.wireEvent();
    }

    private wireEvent(): void {
        this.parent.on(events.destroy, this.unWireEvent, this);
        this.parent.on(events.destroyTooltip, this.destroyTooltip, this);
    }

    private destroyTooltip(): void {
        const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.contentModule.getPanel().ownerDocument :
            this.parent.contentModule.getDocument();
        if (!isNullOrUndefined(currentDocument.querySelector('.e-tooltip-wrap')) && !isNullOrUndefined(currentDocument.querySelector( '[data-tooltip-id]'))) {
            const tooltipTargetEle: HTMLElement = currentDocument.querySelector('[data-tooltip-id]');
            const event: MouseEvent = new MouseEvent('mouseleave', {bubbles: true, cancelable: true});
            tooltipTargetEle.dispatchEvent(event);
        }
    }

    private unWireEvent(): void {
        this.parent.off(events.destroy, this.unWireEvent);
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
        this.parent.trigger('toolbarClick', args);
        if (!this.parent.readonly || isNullOrUndefined(args.item)) {
            this.parent.notify(events.toolbarClick, args);
        }
    }

    private dropDownSelected(args: MenuEventArgs): void {
        this.parent.notify(events.dropDownSelect, args);
    }

    private beforeDropDownItemRender(args: MenuEventArgs): void {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(events.beforeDropDownItemRender, args);
    }

    private tooltipBeforeRender(args: TooltipEventArgs): void {
        if (!isNOU(args.target.getAttribute('title'))) {
            const tooltipTarget: string = args.target.getAttribute('title');
            let tooltipText: string;
            switch (tooltipTarget) {
            case 'Minimize':
                tooltipText = this.l10n.getConstant('minimize');
                args.target.setAttribute('title', tooltipText + ' (Esc)');
                break;
            case 'Maximize':
                tooltipText = this.l10n.getConstant('maximize');
                args.target.setAttribute('title', tooltipText + ' (Ctrl+Shift+F)');
                break;
            }
        }
    }

    private dropDownOpen(args: MenuEventArgs): void {
        if (args.element.parentElement.getAttribute('id').indexOf('TableCell') > -1 && !isNOU(args.element.parentElement.querySelector('.e-cell-merge')) &&
        (!isNOU(args.element.parentElement.querySelector('.e-cell-horizontal-split')) || !isNOU(args.element.parentElement.querySelector('.e-cell-vertical-split')))) {
            const listEle: NodeListOf<HTMLElement> = args.element.querySelectorAll('li');
            if (this.parent.inputElement.querySelectorAll('.e-cell-select').length === 1) {
                addClass([listEle[0]], 'e-disabled');
                removeClass([listEle[1], listEle[2]], 'e-disabled');
            } else if (this.parent.inputElement.querySelectorAll('.e-cell-select').length > 1) {
                removeClass([listEle[0]], 'e-disabled');
                addClass([listEle[1], listEle[2]], 'e-disabled');
            }
        }
        this.parent.notify(events.selectionSave, args);
    }

    private dropDownClose(args: MenuEventArgs): void {
        this.parent.notify(events.selectionRestore, args);
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
            enableRtl: args.enableRtl,
            cssClass: args.cssClass
        });
        args.rteToolbarObj.toolbarObj.isStringTemplate = true;
        args.rteToolbarObj.toolbarObj.createElement = this.parent.createElement;
        args.rteToolbarObj.toolbarObj.appendTo(args.target);
        if (this.parent.showTooltip) {
            this.tooltip = new Tooltip({
                target: '#' + this.parent.getID() + '_toolbar_wrapper [title]',
                showTipPointer: true,
                openDelay: 400,
                opensOn: 'Hover',
                beforeRender: this.tooltipBeforeRender.bind(this),
                cssClass: this.parent.getCssClass(),
                windowCollision: true,
                position: 'BottomCenter'
            });
            this.tooltip.appendTo(args.target);
        }
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
                // Table styles dropdown preselect
                if (proxy.parent.editorMode !== 'Markdown') {
                    const startNode: HTMLElement = proxy.parent.getRange().startContainer.parentElement;
                    const tableEle: HTMLElement = startNode.closest('table');
                    const trow: HTMLElement = startNode.closest('tr');
                    if (!isNOU(tableEle) && tableEle.classList.contains('e-dashed-border')) {
                        for (let index: number = 0; index < args.element.childNodes.length; index++) {
                            if ((args.element.childNodes[index as number] as HTMLElement).classList.contains('e-dashed-borders')) {
                                addClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                            }
                        }
                    }
                    else if (!isNOU(tableEle) && !tableEle.classList.contains('e-dashed-border') && tableEle.classList.contains('e-alternate-rows') && window.getComputedStyle(trow).backgroundColor !== '') {
                        for (let index: number = 0; index < args.element.childNodes.length; index++) {
                            if ((args.element.childNodes[index as number] as HTMLElement).classList.contains('e-alternate-rows')) {
                                addClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                            }
                        }
                    }
                    //Alignments preselect
                    let alignEle: Node = proxy.parent.getRange().startContainer;
                    while (alignEle !== proxy.parent.inputElement && !isNOU(alignEle.parentElement)) {
                        if (alignEle.nodeName === '#text') {
                            alignEle = alignEle.parentElement;
                        }
                        const alignStyle: string = window.getComputedStyle(alignEle as HTMLElement).textAlign;
                        if ((args.items[0 as number] as any).command === 'Alignments') {
                            if ((args.items[0 as number].text === 'Align Left' && (alignStyle === 'left') || alignStyle === 'start')) {
                                addClass([args.element.childNodes[0 as number]] as Element[], 'e-active');
                                break;
                            }
                            else if (args.items[1 as number].text === 'Align Center' && alignStyle === 'center') {
                                addClass([args.element.childNodes[1 as number]] as Element[], 'e-active');
                                break;
                            }
                            else if (args.items[2 as number].text === 'Align Right' && alignStyle === 'right') {
                                addClass([args.element.childNodes[2 as number]] as Element[], 'e-active');
                                break;
                            }
                            else if (args.items[3 as number].text === 'Align Justify' && alignStyle === 'justify') {
                                addClass([args.element.childNodes[3 as number]] as Element[], 'e-active');
                                break;
                            }
                        }
                        alignEle = alignEle.parentElement;
                    }
                    //image preselect
                    const closestNode: HTMLElement = startNode.closest('img');
                    const imageEle: HTMLElement = closestNode ? closestNode : startNode.querySelector('img');
                    if ((args.items[0 as number] as any).command === 'Images') {
                        if (!isNOU(imageEle)) {
                            let index: number;
                            if (imageEle.classList.contains('e-imgleft') || imageEle.classList.contains('e-imginline')) {
                                index = 0;
                            } else if (imageEle.classList.contains('e-imgcenter') || imageEle.classList.contains('e-imgbreak')) {
                                index = 1;
                            } else if (imageEle.classList.contains('e-imgright')) {
                                index = 2;
                            }
                            if (!isNOU(args.element.childNodes[index as number] as HTMLElement)) {
                                addClass([args.element.childNodes[index as number] as Element], 'e-active');
                            }
                        }
                    }
                    //Formats preselect
                    if ((args.items[0 as number] as any).command === 'Formats') {
                        for (let index: number = 0; index < args.element.childNodes.length; index++) {
                            const divNode: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
                            divNode.innerHTML = dropDown.content.trim();
                            if (divNode.textContent.trim() !== ''
                                && args.element.childNodes[index as number].textContent.trim() === divNode.textContent.trim()) {
                                if (!(args.element.childNodes[index as number] as HTMLElement).classList.contains('e-active')) {
                                    addClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                                }
                            } else {
                                removeClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                            }
                        }
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
                proxy.parent.notify(events.selectionRestore, {});
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
        args.element.setAttribute('role', 'button');
        const popupElement: Element = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        if (args.element.childElementCount === 1) {
            dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        }
        args.element.tabIndex = -1;
        dropDown.element.removeAttribute('type');
        dropDown.element.onmousedown = (): void => {
            proxy.parent.notify(events.selectionSave, {});
        };
        dropDown.element.onkeydown = (): void => {
            proxy.parent.notify(events.selectionSave, {});
        };
        return dropDown;
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
     * @param {string} defaultColor -specifies the defaultColor.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderColorPickerDropDown(args: IColorPickerModel, item: string, colorPicker: ColorPicker,
                                     defaultColor: string): DropDownButton {
        // eslint-disable-next-line
        const proxy: this = this;
        let css: string = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_DROPDOWN : CLS_FONT_COLOR_DROPDOWN));
        css += this.parent.getCssClass(true);
        const content: HTMLElement = proxy.parent.createElement('span', { className: CLS_COLOR_CONTENT });
        const inlineEle: HTMLElement = proxy.parent.createElement('span', { className: args.cssClass });
        let range: Range;
        const initialBackgroundColor : string = (isNullOrUndefined(defaultColor)) ? proxy.parent.backgroundColor.default : defaultColor;
        inlineEle.style.borderBottomColor = (item === 'backgroundcolor') ?
            initialBackgroundColor  : proxy.parent.fontColor.default;
        content.appendChild(inlineEle);
        const dropDown: DropDownButton = new DropDownButton({
            target: colorPicker.element.parentElement, cssClass: css,
            enablePersistence: this.parent.enablePersistence, enableRtl: this.parent.enableRtl,
            beforeOpen: (dropDownArgs: BeforeOpenCloseMenuEventArgs): void => {
                colorPicker.inline = true;
                colorPicker.dataBind();
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
                    const closestElement: Element = closest(range.startContainer.parentNode, 'table');
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                            (closest(range.startContainer.parentNode, 'td,th')) ||
                            (proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')))
                            && range.collapsed && args.subCommand === 'BackgroundColor' && closest(closestElement, '.' + classes.CLS_RTE)) {
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
            inline: false,
            value: '#fff',
            created: () => {
                const value: string = (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
                colorPicker.setProperties({ value: value });
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            beforeTileRender: (args: PaletteTileEventArgs) => {
                args.element.classList.add(CLS_COLOR_PALETTE);
                args.element.classList.add(CLS_CUSTOM_TILE);
                if (!isNullOrUndefined(this.parent.cssClass)) {
                    const allClassName: string[] = this.parent.getCssClass().split(' ');
                    for (let i: number = 0; i < allClassName.length; i++) {
                        if (allClassName[i as number].trim() !== '') {
                            args.element.classList.add(allClassName[i as number]);
                        }
                    }
                }
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
                const closestElement: Element = closest(range.startContainer.parentNode, 'table');
                if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' || range.startContainer.nodeName === 'BODY' ||
                        closest(range.startContainer.parentNode, 'td,th')) && range.collapsed && args.subCommand === 'BackgroundColor' && closest(closestElement, '.' + classes.CLS_RTE)) {
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
        colorPicker.cssClass = ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_PICKER : CLS_FONT_COLOR_PICKER) + ' ' + args.cssClass;
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
