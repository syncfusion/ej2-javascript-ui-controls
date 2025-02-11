import { detach, getUniqueID, append, closest, selectAll, select, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { addClass, removeClass, Browser, isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { Popup, isCollide, Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RenderType } from '../base/enum';
import { setToolbarStatus, updateUndoRedoStatus, isIDevice } from '../base/util';
import { IRichTextEditor, IToolbarRenderOptions, IDropDownRenderArgs, IToolbarItemModel, IColorPickerRenderArgs, IBaseQuickToolbar } from '../base/interface';
import { IToolbarItems, IRenderer, IQuickToolbarOptions, IShowQuickTBarOptions, ISetToolbarStatusArgs } from '../base/interface';
import { BeforeQuickToolbarOpenArgs, QuickToolbarEventArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { BaseToolbar } from './base-toolbar';
import { DropDownButtons } from './dropdown-buttons';
import { IToolbarStatus } from '../../common/interface';
import { ColorPickerInput } from './color-picker';
import { RichTextEditorModel } from '../base/rich-text-editor-model';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class BaseQuickToolbar implements IBaseQuickToolbar {
    public isDestroyed: boolean;
    public popupObj: Popup;
    public element: HTMLElement;
    public isRendered: boolean;
    public quickTBarObj: BaseToolbar;
    private stringItems: (string | IToolbarItems)[];
    private dropDownButtons: DropDownButtons;
    private colorPickerObj: ColorPickerInput;
    private locator: ServiceLocator;
    private parent: IRichTextEditor;
    private contentRenderer: IRenderer;
    private popupRenderer: IRenderer;
    public toolbarElement: HTMLElement;
    private renderFactory: RendererFactory;
    private tooltip: Tooltip;

    public constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.isRendered = false;
        this.isDestroyed = false;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.popupRenderer = this.renderFactory.getRenderer(RenderType.Popup);
        this.dropDownButtons = new DropDownButtons(this.parent, this.locator);
        this.colorPickerObj = new ColorPickerInput(this.parent, this.locator);
    }

    private appendPopupContent(): void {
        this.toolbarElement = this.parent.createElement('div', { className: classes.CLS_QUICK_TB });
        if (this.element.classList.contains(classes.CLS_TEXT_POP)) {
            this.toolbarElement.classList.add(classes.CLS_TEXT_QUICK_TB);
        }
        this.element.appendChild(this.toolbarElement);
    }

    /**
     * render method
     *
     * @param {IQuickToolbarOptions} args - specifies the arguments
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public render(args: IQuickToolbarOptions): void {
        let className: string;
        if (args.popupType === 'Image') {
            className = classes.CLS_IMAGE_POP;
        } else if (args.popupType === 'Inline') {
            className = classes.CLS_INLINE_POP;
        } else if (args.popupType === 'Text') {
            className = classes.CLS_TEXT_POP;
        } else {
            className = '';
        }
        const popupId: string = getUniqueID(args.popupType + '_Quick_Popup');
        this.stringItems = args.toolbarItems;
        this.element = this.parent.createElement('div', { id: popupId, className: className + ' ' + classes.CLS_RTE_ELEMENTS });
        this.element.setAttribute('aria-owns', this.parent.getID());
        this.appendPopupContent();
        this.createToolbar(args.toolbarItems, args.mode, args.cssClass);
        this.popupRenderer.renderPopup(this);
        this.addEventListener();
    }

    private createToolbar(items: (string | IToolbarItems)[], mode: OverflowMode, cssClass: string): void {
        this.quickTBarObj = new BaseToolbar(this.parent, this.locator);
        this.quickTBarObj.render({
            container: 'quick',
            target: this.toolbarElement,
            items: items,
            mode: mode,
            cssClass: cssClass
        } as IToolbarRenderOptions);
        this.quickTBarObj.toolbarObj.refresh();
    }

    private setPosition(e: IShowQuickTBarOptions): void {
        let x: number;
        let y: number;
        let target: HTMLElement;
        const imgWrapper: HTMLElement = <HTMLElement>closest(e.target, '.e-img-caption');
        const isAligned: boolean = (e.target.classList.contains('e-imginline')) ? true : false;
        if (isAligned && !isNOU(imgWrapper)) {
            target = imgWrapper;
        } else {
            target = e.target;
        }
        addClass([this.toolbarElement], [classes.CLS_RM_WHITE_SPACE]);
        let targetOffsetTop: number;
        const notAllowedType: boolean = (!isNullOrUndefined(target.classList) && ['e-rte-image', 'e-clickelem', 'e-rte-audio', 'e-rte-video'].some((value: string) => target.classList.contains(value)));
        if (!isNOU(closest(target, 'table')) && !target.classList.contains('e-multi-cells-select') && !notAllowedType) {
            targetOffsetTop = target.offsetTop;
            let parentTable: Element = closest(target, 'table');
            while (!isNOU(parentTable)) {
                targetOffsetTop += (parentTable as HTMLElement).offsetTop;
                parentTable = closest(parentTable.parentElement, 'table');
            }
        } else {
            if (this.parent.iframeSettings.enable) {
                if (target.classList.contains('e-clickelem')) {
                    target = target.childNodes[0] as HTMLElement;
                }
                targetOffsetTop = target.offsetTop;
            } else {
                if (target.parentElement && target.classList.contains('e-rte-audio') || target.parentElement.classList.contains('e-video-clickelem')) {
                    targetOffsetTop = target.parentElement.offsetTop;
                } else {
                    targetOffsetTop = target.offsetTop;
                }
            }
        }
        const parentOffsetTop: number = window.pageYOffset + e.parentData.top;
        if ((targetOffsetTop - e.editTop) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) - e.popHeight - 5;
        } else if (((e.editTop + e.editHeight) - (targetOffsetTop + target.offsetHeight)) > e.popHeight) {
            y = parentOffsetTop + e.tBarElementHeight + (targetOffsetTop - e.editTop) + target.offsetHeight + 5;
        } else {
            y = e.y;
        }
        let targetOffsetLeft: number;
        if (!isNOU(closest(target, 'table')) && !target.classList.contains('e-multi-cells-select') && !notAllowedType) {
            targetOffsetLeft = target.offsetLeft;
            let parentTable: Element = closest(target.parentElement, 'th, td');
            while (!isNOU(parentTable)) {
                targetOffsetLeft += (parentTable as HTMLElement).offsetLeft;
                parentTable = closest(parentTable.parentElement, 'table');
            }
        } else {
            if (this.parent.iframeSettings.enable) {
                targetOffsetLeft = target.offsetLeft;
            } else {
                if (target.parentElement && target.classList.contains('e-rte-audio') || target.parentElement.classList.contains('e-video-clickelem')) {
                    targetOffsetLeft = target.parentElement.offsetLeft;
                } else {
                    targetOffsetLeft = target.offsetLeft;
                }
            }
        }
        if (target.offsetWidth > e.popWidth) {
            x = (target.offsetWidth / 2) - (e.popWidth / 2) + e.parentData.left + targetOffsetLeft;
        } else {
            x = e.parentData.left + targetOffsetLeft;
        }
        this.popupObj.position.X = ((x + e.popWidth) > e.parentData.right) ? e.parentData.right - e.popWidth : x;
        this.popupObj.position.Y = (y >= 0) ? y : e.y + 5;
        this.popupObj.dataBind();
        removeClass([this.toolbarElement], [classes.CLS_RM_WHITE_SPACE]);
    }

    private checkCollision(e: IShowQuickTBarOptions, viewPort: string, type: string): void {
        let x: number;
        let y: number;
        const parentTop: number = e.parentData.top;
        const contentTop: number = e.windowY + parentTop + e.tBarElementHeight;
        let collision: string[] = [];
        if (viewPort === 'document') {
            collision = isCollide(e.popup);
        } else {
            collision = isCollide(e.popup, e.parentElement);
        }
        for (let i: number = 0; i < collision.length; i++) {
            switch (collision[i as number]) {
            case 'top':
                if (viewPort === 'document') {
                    y = e.windowY;
                } else {
                    y = (window.pageYOffset + parentTop) + e.tBarElementHeight;
                }
                break;
            case 'bottom': {
                let posY: number;
                if (viewPort === 'document') {
                    if (type === 'inline' || type === 'text') {
                        posY = (e.y - e.popHeight - 10);
                    } else {
                        if ((e.windowHeight - (parentTop + e.tBarElementHeight)) > e.popHeight) {
                            if ((contentTop - e.windowHeight) > e.popHeight) {
                                posY = (contentTop + (e.windowHeight - parentTop)) - e.popHeight;
                            } else {
                                posY = contentTop;
                            }
                        } else {
                            posY = e.windowY + (parentTop + e.tBarElementHeight);
                        }
                    }
                } else {
                    if (e.target.tagName !== 'IMG') {
                        posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 10;
                    } else {
                        posY = (e.parentData.bottom + window.pageYOffset) - e.popHeight - 5;
                    }
                }
                y = posY;
                break; }
            case 'right':
                if (type === 'inline' || type === 'text') {
                    x = window.pageXOffset + (e.windowWidth - (e.popWidth + e.bodyRightSpace + 10));
                } else {
                    x = e.x - e.popWidth;
                }
                break;
            case 'left':
                if (type === 'inline' || type === 'text') {
                    x = 0;
                } else {
                    x = e.parentData.left;
                }
                break;
            }
        }
        this.popupObj.position.X = (x) ? x : this.popupObj.position.X;
        this.popupObj.position.Y = (y) ? y : this.popupObj.position.Y;
        this.popupObj.dataBind();
    }

    /**
     * showPopup method
     *
     * @param {number} x - specifies the x value
     * @param {number} y - specifies the y value
     * @param {Element} target - specifies the element
     * @param {string} type - specifies the type
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public showPopup(x: number, y: number, target: Element, type?: string): void {
        const eventArgs: BeforeQuickToolbarOpenArgs = { popup: this.popupObj, cancel: false, targetElement: target,
            positionX: x, positionY: y };
        this.parent.trigger(events.beforeQuickToolbarOpen, eventArgs, (beforeQuickToolbarArgs: BeforeQuickToolbarOpenArgs) => {
            if (!beforeQuickToolbarArgs.cancel) {
                let editPanelTop: number;
                let editPanelHeight: number;
                const bodyStyle: CSSStyleDeclaration = window.getComputedStyle(document.body);
                const bodyRight: number = parseFloat(
                    bodyStyle.marginRight.split('px')[0]) + parseFloat(bodyStyle.paddingRight.split('px')[0]
                );
                const windowHeight: number = window.innerHeight;
                const windowWidth: number = window.innerWidth;
                const parent: HTMLElement = this.parent.element;
                const toolbarAvail: boolean = !isNullOrUndefined(this.parent.getToolbar());
                const tbHeight: number = toolbarAvail && this.parent.toolbarModule.getToolbarHeight();
                const expTBHeight: number = toolbarAvail && this.parent.toolbarModule.getExpandTBarPopHeight();
                const tBarHeight: number = (toolbarAvail) ? (tbHeight + expTBHeight) : 0;
                addClass([this.element], [classes.CLS_HIDE]);
                if (Browser.isDevice && !isIDevice()) {
                    addClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
                }
                if (this.parent.iframeSettings.enable) {
                    const cntEle: Window = (<HTMLIFrameElement>this.contentRenderer.getPanel()).contentWindow;
                    editPanelTop = cntEle.pageYOffset;
                    editPanelHeight = cntEle.innerHeight;
                } else {
                    const cntEle: HTMLElement = <HTMLElement>closest(target, '.' + classes.CLS_RTE_CONTENT);
                    editPanelTop = (cntEle) ? cntEle.scrollTop : 0;
                    editPanelHeight = (cntEle) ? cntEle.offsetHeight : 0;
                }
                const allowedType: boolean = (!isNullOrUndefined(target.classList) && ['e-rte-image', 'e-clickelem', 'e-rte-audio', 'e-rte-video'].some((value: string) => target.classList.contains(value)));
                if ((!this.parent.inlineMode.enable && !closest(target, 'table') && type !== 'text' && type !== 'link') || allowedType) {
                    this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
                    this.parent.enableToolbarItem(['Undo', 'Redo']);
                }
                else {
                    this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
                }
                append([this.element], document.body);
                if (this.parent.showTooltip) {
                    this.tooltip  = new Tooltip({
                        target: '#' + this.element.id + ' [title]',
                        openDelay: 400,
                        showTipPointer: true,
                        beforeRender: this.tooltipBeforeRender.bind(this),
                        windowCollision: true,
                        position: 'BottomCenter',
                        cssClass: this.parent.getCssClass()
                    });
                    this.tooltip.appendTo(this.element);
                }
                this.popupObj.position.X = beforeQuickToolbarArgs.positionX + 20;
                this.popupObj.position.Y = beforeQuickToolbarArgs.positionY + 20;
                this.popupObj.dataBind();
                this.popupObj.element.classList.add('e-popup-open');
                this.dropDownButtons.renderDropDowns({
                    container: this.toolbarElement,
                    containerType: 'quick',
                    items: this.stringItems
                } as IDropDownRenderArgs);
                this.colorPickerObj.renderColorPickerInput({
                    container: this.toolbarElement,
                    containerType: 'quick',
                    items: this.stringItems
                } as IColorPickerRenderArgs);
                const showPopupData: IShowQuickTBarOptions = {
                    x: x, y: y,
                    target: target as HTMLElement,
                    editTop: editPanelTop,
                    editHeight: editPanelHeight,
                    popup: this.popupObj.element,
                    popHeight: this.popupObj.element.offsetHeight,
                    popWidth: this.popupObj.element.offsetWidth,
                    parentElement: parent,
                    bodyRightSpace: bodyRight,
                    windowY: window.pageYOffset,
                    windowHeight: windowHeight,
                    windowWidth: windowWidth,
                    parentData: parent.getBoundingClientRect(),
                    tBarElementHeight: tBarHeight
                };
                if ((closest(target, 'TABLE') || target.tagName === 'IMG' || target.tagName === 'AUDIO' || target.tagName === 'VIDEO' || target.tagName === 'IFRAME' || (target.classList &&
                    (target.classList.contains(classes.CLS_AUDIOWRAP) || target.classList.contains(classes.CLS_CLICKELEM) ||
                    target.classList.contains(classes.CLS_VID_CLICK_ELEM)))) &&
                    (x === beforeQuickToolbarArgs.positionX || y === beforeQuickToolbarArgs.positionY)) {
                    this.setPosition(showPopupData);
                }
                if (!this.parent.inlineMode.enable) {
                    this.checkCollision(showPopupData, 'parent', '');
                }
                this.checkCollision(showPopupData, 'document', ((this.parent.inlineMode.enable) ? 'inline' : (type === 'text') ? 'text' : ''));
                this.popupObj.element.classList.remove('e-popup-open');
                removeClass([this.element], [classes.CLS_HIDE]);
                this.popupObj.show({ name: 'ZoomIn', duration: (Browser.isIE ? 250 : 400) }, (target as HTMLElement));
                if (this.popupObj && this.parent.cssClass) {
                    removeClass([this.popupObj.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                    addClass([this.popupObj.element], this.parent.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                setStyleAttribute(this.element, {
                    maxWidth: window.outerWidth + 'px'
                });
                addClass([this.element], [classes.CLS_POP]);
                this.isRendered = true;
            }
        });
    }

    private tooltipBeforeRender(args: TooltipEventArgs): void {
        if (args.target.querySelector('.e-active')) {
            args.cancel = true;
            if (!isNOU(args.target.getAttribute('title'))) {
                this.parent.notify(events.closeTooltip, { target: args.target, isTitle: true });
            }
        }
    }

    /**
     * hidePopup method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public hidePopup(): void {
        const isSourceCodeEnabled: boolean = !isNOU(this.parent.rootContainer) && this.parent.rootContainer.classList.contains('e-source-code-enabled');
        if (Browser.isDevice && !isIDevice()) {
            removeClass([this.parent.getToolbar()], [classes.CLS_HIDE]);
        }
        if (!isNOU(this.element.querySelectorAll('[data-title]'))) {
            const removeHandEle: NodeListOf<Element> = this.element.querySelectorAll('[data-title]');
            removeHandEle.forEach((e: Element) => {
                const event: MouseEvent = new MouseEvent('mouseout', { bubbles: true, cancelable: true });
                e.dispatchEvent(event);
            });
        }
        if (!isNullOrUndefined(document.querySelector('.e-tooltip-wrap'))) {
            if (!isNullOrUndefined(document.querySelector('#' + this.element.id + ' [data-tooltip-id]'))) {
                const tooltipTargetEle: HTMLElement = <HTMLElement>document.querySelector('#' + this.element.id + ' [data-tooltip-id]');
                const dataContent: string = tooltipTargetEle.getAttribute('data-content');
                tooltipTargetEle.removeAttribute('data-content');
                tooltipTargetEle.setAttribute('title', dataContent);
                tooltipTargetEle.removeAttribute('data-tooltip-id');
            }
            this.tooltip.destroy();
        }
        else {
            if (!isNullOrUndefined(this.tooltip)){
                this.tooltip.destroy();
            }
        }
        if (!isNullOrUndefined(this.parent.getToolbar()) && !this.parent.inlineMode.enable) {
            if (!isSourceCodeEnabled) {
                this.parent.enableToolbarItem(this.parent.toolbarSettings.items as string[]);
            }
        }
        this.removeEleFromDOM();
        this.isRendered = false;
    }
    /**
     * @param {string} item - specifies the string value
     * @param {number} index - specifies the index value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addQTBarItem(item: (string | IToolbarItems)[], index: number): void {
        this.quickTBarObj.toolbarObj.addItems((this.quickTBarObj.getItems(item, 'toolbar') as IToolbarItemModel[]), index);
    }
    /**
     * @param {number} index - specifies the index value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public removeQTBarItem(index: number | HTMLElement[] | Element[]): void {
        this.quickTBarObj.toolbarObj.removeItems(index as HTMLElement[] | number);
    }

    private removeEleFromDOM(): void {
        const element: Element = this.popupObj.element;
        if (this.isRendered) {
            this.dropDownButtons.destroyDropDowns();
            this.colorPickerObj.destroyColorPicker();
            removeClass([this.element], [classes.CLS_POP]);
            detach(element);
            const args: QuickToolbarEventArgs | Popup = this.popupObj;
            this.parent.trigger(events.quickToolbarClose, args);
        }
    }

    private updateStatus(args: IToolbarStatus): void {
        const options: ISetToolbarStatusArgs = {
            args: args,
            dropDownModule: this.dropDownButtons,
            parent: this.parent,
            tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.element),
            tbItems: this.quickTBarObj.toolbarObj.items
        };
        setToolbarStatus(options, true, this.parent);
        if (this.parent.quickToolbarSettings.text && this.parent.quickToolbarModule.textQTBar) {
            const options: ISetToolbarStatusArgs = {
                args: args,
                dropDownModule: this.parent.quickToolbarModule.textQTBar.dropDownButtons,
                parent: this.parent,
                tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.parent.quickToolbarModule.textQTBar.element),
                tbItems: this.parent.quickToolbarModule.textQTBar.quickTBarObj.toolbarObj.items
            };
            setToolbarStatus(options, true, this.parent);
            updateUndoRedoStatus(this.parent.quickToolbarModule.textQTBar.quickTBarObj,
                                 this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
        if (!select('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA, this.parent.element)) {
            updateUndoRedoStatus(this.parent.getBaseToolbarObject(), this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    }

    /**
     * Destroys the Quick toolbar.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.tooltip && !this.tooltip.isDestroyed) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        this.removeEventListener();
        this.quickTBarObj.destroy();
        this.quickTBarObj = null;
        if (this.popupObj && !this.popupObj.isDestroyed) {
            this.removeEleFromDOM();
            this.popupObj.destroy();
        }
        this.colorPickerObj = null;
        this.dropDownButtons = null;
        this.stringItems = null;
        this.dropDownButtons = null;
        this.colorPickerObj = null;
        this.toolbarElement = null;
        this.isDestroyed = true;
    }
    /**
     * addEventListener method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        if (this.parent.inlineMode.enable || this.parent.quickToolbarSettings.text) {
            this.parent.on(events.toolbarUpdated, this.updateStatus, this);
        }
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {RichTextEditorModel} e - specifies the model element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    protected onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (const prop of Object.keys(e.newProp.inlineMode)) {
                switch (prop) {
                case 'enable':
                    if (e.newProp.inlineMode.enable) {
                        this.parent.on(events.toolbarUpdated, this.updateStatus, this);
                    } else {
                        this.parent.off(events.toolbarUpdated, this.updateStatus);
                    }
                    break;
                }
            }
        }
    }
    /**
     * removeEventListener method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public removeEventListener(): void {
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        if (this.parent.inlineMode.enable || this.parent.quickToolbarSettings.text) {
            this.parent.off(events.toolbarUpdated, this.updateStatus);
        }
    }
}
