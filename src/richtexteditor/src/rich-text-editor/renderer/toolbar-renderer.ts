import { addClass, Browser, L10n, removeClass, isNullOrUndefined, isNullOrUndefined as isNOU, EventHandler, detach } from '@syncfusion/ej2-base';
import { closest} from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, BeforeCreateArgs, OverflowMode } from '@syncfusion/ej2-navigations';
import { DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { CLS_TOOLBAR, CLS_DROPDOWN_BTN, CLS_RTE_ELEMENTS, CLS_INLINE_DROPDOWN,
    CLS_CUSTOM_TILE, CLS_NOCOLOR_ITEM } from '../base/classes';
import { IRichTextEditor, IToolbarOptions, IRenderer } from '../base/interface';
import { IDropDownModel, IColorPickerEventArgs, IDropDownItemModel, ISplitButtonModel, IColorPickerModel } from '../../common/interface';
import { ColorPicker, ModeSwitchEventArgs, PaletteTileEventArgs } from '@syncfusion/ej2-inputs';
import { ServiceLocator } from '../services/service-locator';
import { ToolbarStatus } from '../../editor-manager/plugin/toolbar-status';
import { IToolbarStatus } from '../../common/interface';
import { ToolbarType } from '../../common/enum';

/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 *
 * @hidden
 * @deprecated
 */
export class ToolbarRenderer implements IRenderer {
    private mode: OverflowMode;
    private toolbarPanel: Element;
    private defaultColorPicker: string;
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
    private tooltipTargetEle: Element;
    public isDestroyed: boolean;
    public isEscapeKey: boolean = false;

    /**
     * Constructor for toolbar renderer module
     *
     * @param {IRichTextEditor} parent - specifies the parent element.
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     */
    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.isDestroyed = false;
        if (serviceLocator){
            this.l10n = serviceLocator.getService<L10n>('rteLocale');
        }
        this.wireEvent();
    }

    private wireEvent(): void {
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.destroyTooltip, this.destroyTooltip, this);
        this.parent.on(events.closeTooltip, this.closeTooltip, this);
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
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.destroyTooltip, this.destroyTooltip);
        this.parent.off(events.closeTooltip, this.closeTooltip);
    }

    private toolbarBeforeCreate(e: BeforeCreateArgs): void {
        if (this.mode === 'Extended') {
            e.enableCollision = false;
        }
    }

    private toolbarCreated(): void {
        this.parent.notify(events.toolbarCreated, this);
        if (this.mode === 'Extended') {
            const extendedToolbarElement: HTMLElement = this.toolbarPanel.querySelector('.e-expended-nav');
            if (extendedToolbarElement) {
                EventHandler.add(extendedToolbarElement, 'mousedown', this.extendedToolbarMouseDownHandler, this);
            }
        }
    }

    private extendedToolbarMouseDownHandler(): void {
        if (this.parent.userAgentData.isSafari()) {
            this.parent.notify(events.selectionSave, {});
        }
    }

    private toolbarClicked(args: ClickEventArgs): void {
        if ( !this.parent.enabled) {
            return;
        }
        if (this.parent.toolbarSettings.type === ToolbarType.Popup) {
            let command: string;
            if (args.item && (args.item as any).command) {
                command = (args.item as any).command;
            }
            const commandsArray: string[] = ['Formats', 'Font', 'Alignments', 'EmojiPicker', 'Table', 'BulletFormatList', 'NumberFormatList', 'CodeBlock'];
            const isPresent: boolean = !isNOU(command) &&  commandsArray.indexOf(command) !== -1;
            if (isPresent) {
                args.cancel = true;
            }
        }
        const toolbarClickEventArgs: ClickEventArgs = { item: args.item, originalEvent: args.originalEvent, cancel: false };
        this.parent.trigger('toolbarClick', toolbarClickEventArgs, (clickEventArgs: ClickEventArgs) => {
            if ((!this.parent.readonly || isNullOrUndefined(args.item)) && !clickEventArgs.cancel) {
                this.parent.notify(events.toolbarClick, clickEventArgs);
            }
        });
    }

    private dropDownSelected(args: MenuEventArgs): void {
        this.parent.notify(events.dropDownSelect, { element: args.element, item: args.item, originalEvent: args.event });
        this.destroyTooltip();
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
        if (args.target.querySelector('.e-active')) {
            args.cancel = true;
            if (!isNOU(args.target.getAttribute('title'))) {
                this.closeTooltip({ target: args.target, isTitle: true });
            }
        }
    }

    private dropDownOpen(args: MenuEventArgs): void {
        if (args.element.parentElement.getAttribute('id').indexOf('TableCell') > -1 && !isNOU(args.element.parentElement.querySelector('.e-cell-merge'))) {
            const listEle: NodeListOf<HTMLElement> = args.element.querySelectorAll('li');
            const selectedEles: NodeListOf<HTMLElement> = this.parent.inputElement.querySelectorAll('.e-cell-select');
            if (selectedEles.length === 1) {
                addClass([listEle[0]], 'e-disabled');
                removeClass([listEle[1], listEle[2]], 'e-disabled');
            } else if (selectedEles.length > 1) {
                if (!Array.from(selectedEles).every((element: HTMLElement) =>
                    element.tagName.toLowerCase() === selectedEles[0].tagName.toLowerCase()
                )) {
                    addClass([listEle[0]], 'e-disabled');
                } else {
                    removeClass([listEle[0]], 'e-disabled');
                }
                addClass([listEle[1], listEle[2]], 'e-disabled');
            }
        }
        this.parent.notify(events.selectionSave, args);
    }

    private dropDownClose(args: MenuEventArgs): void {
        if (!this.isEscapeKey)
        {
            this.parent.notify(events.selectionRestore, args);
        }
        this.isEscapeKey = false;
    }

    private dropDownBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        if (!isNOU(args.event) && (args.event as KeyboardEvent).key === 'Escape' && (args.event as KeyboardEvent).keyCode === 27) {
            this.isEscapeKey = true;
            this.parent.notify(events.preventQuickToolbarClose, args);
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
        const isBottomToolbar: boolean = this.parent.toolbarSettings && this.parent.toolbarSettings.position === 'Bottom';
        this.setPanel(args.target);
        this.renderPanel();
        this.mode = args.overflowMode;
        args.rteToolbarObj.toolbarObj = new Toolbar({
            items: args.items,
            width: '100%',
            overflowMode: args.overflowMode,
            beforeCreate: this.toolbarBeforeCreate.bind(this),
            created: () => {
                this.positionToolbar(isBottomToolbar);
                this.toolbarCreated();
            },
            clicked: this.toolbarClicked.bind(this),
            enablePersistence: args.enablePersistence,
            enableRtl: args.enableRtl,
            cssClass: args.cssClass
        });
        args.rteToolbarObj.toolbarObj.isStringTemplate = true;
        args.rteToolbarObj.toolbarObj.createElement = this.parent.createElement;
        args.rteToolbarObj.toolbarObj.appendTo(args.target);
        if (this.parent.showTooltip && args.type === 'toolbar') {
            this.tooltip = new Tooltip({
                target: '#' + this.parent.getID() + '_toolbar_wrapper [title]',
                showTipPointer: true,
                openDelay: 400,
                opensOn: 'Hover',
                beforeRender: this.tooltipBeforeRender.bind(this),
                beforeOpen: this.tooltipBeforeOpen.bind(this),
                cssClass: this.parent.getCssClass(),
                windowCollision: true,
                position: isBottomToolbar ? 'TopCenter' : 'BottomCenter'
            });
            this.tooltip.appendTo(args.target.parentElement);
        }
    }

    private positionToolbar(isBottomToolbar: boolean): void {
        const rteContainer: HTMLElement = this.parent.element.querySelector('.e-rte-container') as HTMLElement;
        const toolbarWrapper: HTMLElement = this.parent.element.querySelector('.e-toolbar-wrapper') as HTMLElement;
        if (isBottomToolbar && rteContainer && toolbarWrapper) {
            addClass([toolbarWrapper], 'e-rte-tb-bottom');
        }
    }

    public tooltipBeforeOpen(args: TooltipEventArgs): void {
        if (args.element) {
            args.element.setAttribute('data-rte-id', this.parent.getID());
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
        const targetEle: HTMLElement = args.activeElement;
        args.element.classList.add(CLS_DROPDOWN_BTN);
        css = args.cssClass + ' ' + CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN_MENU;
        if (this.parent.inlineMode.enable && Browser.isDevice) {
            css = css + ' ' + CLS_INLINE_DROPDOWN;
        }
        const isTesting: boolean = this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true';
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
            animationSettings: isTesting ? { effect: 'None', duration: 0  } : { effect : 'None', duration: 400, easing: 'ease'},
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                if (this.parent.userAgentData.isSafari() && args.event.type === 'keydown' && this.parent.formatter.editorManager.nodeSelection &&
                    !this.parent.inputElement.contains(this.parent.getRange().startContainer)) {
                    this.parent.notify(events.selectionRestore, args);
                }
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
                    if (!isNOU(tableEle) && tableEle.classList.contains('e-alternate-rows') && window.getComputedStyle(trow).backgroundColor !== '') {
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
                        if (!isNOU(args.items[0 as number]) && (args.items[0 as number] as IDropDownItemModel).command === 'Alignments') {
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
                    const imageEle: HTMLElement = closestNode ? closestNode : (targetEle ? targetEle : startNode.querySelector('img'));
                    if (!isNOU(args.items[0 as number]) && (args.items[0 as number] as IDropDownItemModel).command === 'Images') {
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
                    //Video preselect
                    const videoClosestNode: HTMLElement = startNode.closest('.e-video-wrap') as HTMLElement | null;
                    const videoEle: HTMLElement = videoClosestNode ? videoClosestNode : (targetEle ? targetEle : startNode.querySelector('video') as HTMLElement | null);
                    if (!isNOU(args.items[0 as number]) && (args.items[0 as number] as IDropDownItemModel).command === 'Videos') {
                        if (!isNOU(videoEle)) {
                            let index: number;
                            if (videoEle.classList.contains('e-video-left') || videoEle.classList.contains('e-video-inline')) {
                                index = 0;
                            } else if (videoEle.classList.contains('e-video-center') || videoEle.classList.contains('e-video-break')) {
                                index = 1;
                            } else if (videoEle.classList.contains('e-video-right')) {
                                index = 2;
                            }
                            if (!isNOU(args.element.childNodes[index as number] as HTMLElement)) {
                                addClass([args.element.childNodes[index as number] as Element], 'e-active');
                            }
                        }
                    }
                    //Formats preselect
                    if (!isNOU(args.items[0 as number]) && ((args.items[0 as number] as IDropDownItemModel).command === 'Formats' || (args.items[0 as number] as IDropDownItemModel).command === 'Font')) {
                        const fontName: string[] = [];
                        const formats: string[] = [];
                        let hasUpdatedActive: boolean = false;
                        this.parent.format.types.forEach((item: IDropDownItemModel): void => {
                            formats.push(item.value.toLocaleLowerCase());
                        });
                        this.parent.fontFamily.items.forEach((item: IDropDownItemModel): void => {
                            fontName.push(item.value);
                        });
                        const toolbarStatus: IToolbarStatus = ToolbarStatus.get(
                            this.parent.contentModule.getDocument(),
                            this.parent.contentModule.getEditPanel(),
                            formats,
                            null,
                            fontName
                        );
                        for (let index: number = 0; index < args.element.childNodes.length; index++) {
                            const htmlString: string = dropDown.content.trim();
                            const styleMatch: string[] = htmlString.match(/style="([^"]*)"/);
                            let styleValue: string = '';
                            if (styleMatch) {
                                styleValue = styleMatch[1];
                            }
                            const updatedHtml: string = htmlString.replace(/ style="([^"]*)"/, '');
                            const divNode: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
                            divNode.innerHTML = updatedHtml;
                            const spanElement: HTMLSpanElement = divNode.querySelector('span');
                            spanElement.style.cssText = styleValue;
                            if (!hasUpdatedActive && ((divNode.textContent.trim() !== ''
                                && args.element.childNodes[index as number].textContent.trim() === divNode.textContent.trim()) ||
                                (((args.items[0 as number] as IDropDownItemModel).command === 'Formats' && !isNOU(toolbarStatus.formats) && this.parent.format.types[index as number].value.toLowerCase() === toolbarStatus.formats.toLowerCase() && (args.element.childNodes[index as number] as Element).classList.contains(this.parent.format.types[index as number].cssClass))
                                    || ((args.items[0 as number] as IDropDownItemModel).subCommand === 'FontName' && (args.items[0 as number] as IDropDownItemModel).command === 'Font' && !isNOU(toolbarStatus.fontname) && !isNOU(this.parent.fontFamily.items[index as number]) && this.parent.fontFamily.items[index as number].value.toLowerCase() === toolbarStatus.fontname.toLowerCase() && (args.element.childNodes[index as number] as Element).classList.contains(this.parent.fontFamily.items[index as number].cssClass)))
                                || ((((args.items[0 as number] as IDropDownItemModel).subCommand === 'FontName') && this.parent.fontFamily.items[index as number].value === '' && isNullOrUndefined(toolbarStatus.fontname) && (args.element.childNodes[index as number] as Element).classList.contains(this.parent.fontFamily.items[index as number].cssClass)) ||
                                    (((args.items[0 as number] as IDropDownItemModel).subCommand === 'FontSize') && args.element.childNodes[index as number].textContent === 'Default' && divNode.textContent === 'Font Size' && this.parent.fontSize.items[index as number].value === '' && !isNullOrUndefined(toolbarStatus.fontsize))))
                            ) {
                                if (!(args.element.childNodes[index as number] as HTMLElement).classList.contains('e-active')) {
                                    addClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                                    hasUpdatedActive = true;
                                }
                            } else {
                                removeClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                            }
                        }
                    }
                }
                else if (proxy.parent.editorMode === 'Markdown') {
                    if ((args.items[0 as number] as IDropDownItemModel).command === 'Formats') {
                        const formats: string[] = [];
                        let hasUpdatedActive: boolean = false;
                        this.parent.format.types.forEach((item: IDropDownItemModel): void => {
                            formats.push(item.value.toLocaleLowerCase());
                        });
                        const childNodes: NodeListOf<ChildNode> = args.element.childNodes;
                        for (let index: number = 0; index < childNodes.length; index++) {
                            const divNode: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
                            divNode.innerHTML = dropDown.content.trim();
                            if (!hasUpdatedActive && ((divNode.textContent.trim() !== '' && childNodes[index as number].textContent.trim() === divNode.textContent.trim()))) {
                                if (!(childNodes[index as number] as HTMLElement).classList.contains('e-active')) {
                                    addClass([childNodes[index as number]] as Element[], 'e-active');
                                    hasUpdatedActive = true;
                                }
                            } else {
                                removeClass([childNodes[index as number]] as Element[], 'e-active');
                            }
                        }
                    }
                }
                proxy.parent.notify(events.beforeDropDownOpen, args);
            },
            close: this.dropDownClose.bind(this),
            beforeClose: this.dropDownBeforeClose.bind(this),
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
    private mouseOutHandler (): void {
        if (!isNOU(this.tooltipTargetEle)){
            this.tooltipTargetEle.setAttribute('title', this.tooltipTargetEle.getAttribute('data-title'));
        } else {
            const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.contentModule.getPanel().ownerDocument :
                this.parent.contentModule.getDocument();
            this.tooltipTargetEle = currentDocument.querySelector('[data-title]');
            this.tooltipTargetEle.setAttribute('title', this.tooltipTargetEle.getAttribute('data-title'));
        }
        this.tooltipTargetEle.removeAttribute('data-title');
        EventHandler.remove(this.tooltipTargetEle, 'mouseout', this.mouseOutHandler);
    }
    private closeTooltip(args: { [key: string]: HTMLElement | boolean }): void {
        if (args.isTitle as boolean) {
            this.tooltipTargetEle = args.target as HTMLElement;
            this.tooltipTargetEle.setAttribute('data-title', this.tooltipTargetEle.getAttribute('title'));
            this.tooltipTargetEle.removeAttribute('title');
            EventHandler.add(this.tooltipTargetEle, 'mouseout', this.mouseOutHandler, this);
        } else {
            const currentDocument: Document = this.parent.iframeSettings.enable ? this.parent.contentModule.getPanel().ownerDocument :
                this.parent.contentModule.getDocument();
            this.tooltipTargetEle = closest(args.target as HTMLElement, '[data-tooltip-id]');
            if (!isNOU(this.tooltipTargetEle) && this.parent.showTooltip && !isNOU(currentDocument.querySelector('.e-tooltip-wrap'))) {
                this.destroyTooltip();
                this.tooltipTargetEle.setAttribute('data-title', this.tooltipTargetEle.getAttribute('title'));
                this.tooltipTargetEle.removeAttribute('title');
                EventHandler.add(this.tooltipTargetEle, 'mouseout', this.mouseOutHandler, this);
            }
        }
    }
    // Manages code block dropdown menu by detecting if selection is in a code block and highlighting the active language option
    private handleCodeBlockDropdown(args: BeforeOpenCloseMenuEventArgs): void {
        const range: Range = this.parent.getRange();
        const startContainer: Element = this.parent.formatter.editorManager.codeBlockObj
            .isValidCodeBlockStructure(range.startContainer);
        const endContainer: Element = this.parent.formatter.editorManager.codeBlockObj.
            isValidCodeBlockStructure(range.endContainer);
        const codeBlock: boolean = !isNOU(startContainer) || !isNOU(endContainer);
        const codeBlockElement: Element = startContainer || endContainer;
        let currentLanguage: string = '';
        if (codeBlock) {
            currentLanguage = (codeBlockElement as Element).getAttribute('data-language') || '';
            const listItems: NodeListOf<HTMLLIElement> = args.element.querySelectorAll('li');
            for (let i: number = 0; i < listItems.length; i++) {
                const itemLanguage: string = listItems[i as number].getAttribute('data-language') || listItems[i as number].textContent.toLowerCase();
                if (currentLanguage.toLowerCase() === itemLanguage) {
                    addClass([listItems[i as number] as HTMLElement], 'e-active');
                } else {
                    removeClass([listItems[i as number] as HTMLElement], 'e-active');
                }
            }
        }
    }
    // Handles list formatting dropdown menu by checking current list type and highlighting the active list style option
    private handleListsDropdown(args: BeforeOpenCloseMenuEventArgs): void {
        // eslint-disable-next-line
        const proxy: this = this;
        if (proxy.parent.readonly || !proxy.parent.enabled) {
            args.cancel = true;
            return;
        }
        if (Browser.info.name === 'safari' && !proxy.parent.inputElement.contains(proxy.parent.getRange().startContainer)) {
            proxy.parent.notify(events.selectionRestore, {});
        }
        if (proxy.parent.editorMode !== 'Markdown' ) {
            const startNode: HTMLElement = proxy.parent.getRange().startContainer.parentElement;
            const listElem: Element = startNode.closest('LI');
            const currentLiElem: HTMLElement = !isNOU(listElem) ? listElem.parentElement : null;
            const currentAction: string = (args.items[0 as number] as IDropDownItemModel).subCommand;
            if (!isNOU(currentLiElem)) {
                // Checks if current action matches the list type (numbered or bulleted)
                const validNumberFormatAction: boolean  = (currentAction === 'NumberFormatList' && currentLiElem.nodeName === 'OL');
                const validBulletFormatAction: boolean  = (currentAction === 'BulletFormatList' && currentLiElem.nodeName === 'UL');
                if (validNumberFormatAction || validBulletFormatAction) {
                    let currentListStyle: string = currentLiElem.style.listStyleType.split('-').join('').toLocaleLowerCase();
                    currentListStyle = currentListStyle === 'decimal' ? 'number' : currentListStyle;
                    for (let index: number = 0; index < args.element.childNodes.length; index++) {
                        // Marks the active list style in the dropdown
                        if (currentListStyle === (args.element.childNodes[index as number] as HTMLElement).innerHTML.split(' ').join('').toLocaleLowerCase()) {
                            addClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                            break;
                        } else if (currentListStyle === '' && ((args.element.childNodes[index as number] as HTMLElement).innerHTML === 'Number' || (args.element.childNodes[index as number] as HTMLElement).innerHTML === 'Disc') ) {
                            // Handles default list style case
                            addClass([args.element.childNodes[index as number]] as Element[], 'e-active');
                            break;
                        }
                    }
                }
            }
        }
    }
    /**
     * renderSplitButton method
     *
     * @param {ISplitButtonModel} args - specifies the the arguments.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderSplitButton(args: ISplitButtonModel): SplitButton {
        const css: string = args.cssClass;
        const splitButton: SplitButton = new SplitButton({
            items: args.items,
            cssClass: css,
            iconCss: args.iconCss,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            select: this.dropDownSelected.bind(this),
            created: () => {
                const splitBtnDiv: HTMLElement = (args.element.parentElement as HTMLElement);
                if (!splitBtnDiv) { return; }
                splitBtnDiv.tabIndex = -1;
            },
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (this.parent.readonly || !this.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                if (!args.items) { return; }
                if ((args.items[0] as any).command === 'CodeBlock') {
                    this.handleCodeBlockDropdown(args);
                }
                if ((args.items[0] as any).command === 'Lists') {
                    this.handleListsDropdown(args);
                }
                this.currentElement = splitButton.element;
                this.currentDropdown = splitButton;
            },
            close: this.dropDownClose.bind(this),
            beforeClose: this.dropDownBeforeClose.bind(this),
            open: this.dropDownOpen.bind(this),
            beforeItemRender: this.beforeDropDownItemRender.bind(this)
        });
        splitButton.appendTo(args.element);
        return splitButton;
    }
    /**
     * renderColorPicker method
     *
     * @param {IColorPickerModel} args - specifies the arguments
     * @param {string} item - specifies the string values
     * @param {string} toolbarType - Specifies the type of toolbar triggering the color picker.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderColorPicker(args: IColorPickerModel, item: string, toolbarType?: string): ColorPicker {
        // eslint-disable-next-line
        let proxy: this = this;
        let colorValue: string = (isNullOrUndefined(this.defaultColorPicker)) ?
            (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default : this.defaultColorPicker;
        const colorPicker: ColorPicker = new ColorPicker({
            enableRtl: this.parent.enableRtl,
            inline: false,
            value: colorValue,
            showButtons: false,
            cssClass: args.cssClass,
            disabled: !this.parent.enabled,
            created: () => {
                const colorPickerDiv: HTMLElement = (args.element.parentElement as HTMLElement);
                if (!colorPickerDiv) { return; }
                colorPickerDiv.tabIndex = -1;
                const colorPickerSplitDiv: HTMLElement = (colorPickerDiv.childNodes[1] as HTMLElement);
                if (!colorPickerSplitDiv) { return; }
                colorPickerSplitDiv.classList.add(...args.cssClass.split(' '));
                const colorPickerElem: HTMLElement = (colorPickerDiv.querySelector('.e-split-colorpicker') as HTMLElement);
                if (!colorPickerElem) { return; }
                colorPickerElem.classList.add(...args.cssClass.split(' '));
                const dropdownBtn: HTMLElement = (colorPickerDiv.querySelector('.e-dropdown-btn') as HTMLElement);
                if (dropdownBtn) {
                    dropdownBtn.classList.add(...args.cssClass.split(' '));
                }
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            showRecentColors: ((toolbarType === 'quick') ? false : ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.showRecentColors : proxy.parent.fontColor.showRecentColors)),
            presetColors: (item === 'backgroundcolor') ? this.parent.backgroundColor.colorCode : this.parent.fontColor.colorCode,
            columns: (item === 'backgroundcolor') ? this.parent.backgroundColor.columns : this.parent.fontColor.columns,
            beforeTileRender: (args: PaletteTileEventArgs) => {
                args.element.classList.add(classes.CLS_COLOR_PALETTE);
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
                if (!proxy.parent.userAgentData.isSafari() ||
                    (proxy.parent.userAgentData.isSafari() && this.parent.formatter.editorManager.nodeSelection &&
                    this.parent.inputElement.contains(this.parent.getRange().startContainer))) {
                    proxy.parent.notify(events.selectionSave, {});
                }
                const colorpickerValue: string = colorPickerArgs.currentValue.rgba;
                colorPickerArgs.item = {
                    command: args.command,
                    subCommand: args.subCommand,
                    value: colorpickerValue
                };
                proxy.parent.notify(events.selectionRestore, {});
                const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                const closestElement: Element = closest(range.startContainer.parentNode, 'table');
                if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' || range.startContainer.nodeName === 'BODY' ||
                    (range.startContainer.parentNode && closest(range.startContainer.parentNode, 'td,th'))) && range.collapsed && args.subCommand === 'BackgroundColor' && (closestElement && closest(closestElement, '.' + classes.CLS_RTE) || proxy.parent.iframeSettings.enable)
                    && toolbarType === 'quick') {
                    this.defaultColorPicker = colorPickerArgs.currentValue.hex;
                    colorPickerArgs.name = 'tableColorPickerChanged';
                    colorPickerArgs.item.command = 'Table';
                    proxy.parent.formatter.process(this.parent, colorPickerArgs, colorPickerArgs.event, colorPickerArgs.item.value);
                } else {
                    proxy.parent.notify(events.colorPickerChanged, colorPickerArgs);
                }
            },
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                colorValue = colorPicker.value;
                if (colorValue === '') {
                    colorPicker.setProperties({ value: ((args.mode === 'Picker') ? '#008000ff' : '') }, true);
                }
                colorPicker.showButtons = args.mode === 'Palette' ? false : true;
            },
            beforeClose: this.dropDownClose.bind(this)
        });
        colorPicker.isStringTemplate = true;
        colorPicker.createElement = this.parent.createElement;
        colorPicker.appendTo(args.element);
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

    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.tooltip && !this.tooltip.isDestroyed) {
            this.tooltip.destroy();
            const tooltipElements: NodeListOf<Element> = document.querySelectorAll('[data-rte-id="' + this.parent.getID() + '"]');
            for (let i: number = 0; i < tooltipElements.length; i++) {
                const tooltipEle: Element = tooltipElements[i as number] as Element;
                if (this.parent.getID() === tooltipEle.getAttribute('data-rte-id') as string) {
                    detach(tooltipEle);
                }
            }
        }
        this.unWireEvent();
        this.mode = null;
        this.defaultColorPicker = null;
        this.toolbarPanel = null;
        this.currentElement = null;
        this.currentDropdown = null;
        this.tooltip = null;
        this.tooltipTargetEle = null;
        this.isDestroyed = true;
    }
}
