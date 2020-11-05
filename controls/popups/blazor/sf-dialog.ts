import { Browser, addClass, removeClass, createElement, Draggable, extend, formatUnit, detach } from '@syncfusion/ej2-base';
import { EventHandler, setStyleAttribute, BlazorDotnetObject, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlazorDragEventArgs, MouseEventArgs, select } from '@syncfusion/ej2-base';
import { Popup, getZindexPartial } from '../src/popup/popup';
import { createResize, removeResize, setMinHeight, setMaxWidth } from '../src/common/resize';

const TAB: number = 9;
const ENTER: number = 13;
const ESCAPE: number = 27;
const BTN: string = 'e-btn';
const FADE: string = 'e-fade';
const ICON: string = 'e-icons';
const POPUP: string = 'e-popup';
const DIALOG: string = 'e-dialog';
const DEVICE: string = 'e-device';
const PRIMARY: string = 'e-primary';
const DRAGGABLE: string = 'e-draggable';
const POPUP_OPEN: string = 'e-popup-open';
const DLG_TARGET: string = 'e-dlg-target';
const DLG_CONTENT: string = 'e-dlg-content';
const DLG_OVERLAY: string = 'e-dlg-overlay';
const DLG_RESIZABLE: string = 'e-dlg-resizable';
const DLG_FULLSCREEN: string = 'e-dlg-fullscreen';
const FOOTER_CONTENT: string = 'e-footer-content';
const SCROLL_DISABLED: string = 'e-scroll-disabled';
const DLG_REF_ELEMENT: string = 'e-dlg-ref-element';
const DLG_RESTRICT_LEFT: string = 'e-restrict-left';
const DLG_RESIZE_HANDLE: string = 'e-resize-handle';
const DLG_RESIZE_VIEWPORT: string = 'e-resize-viewport';
const DLG_CLOSE_ICON_BTN: string = 'e-dlg-closeicon-btn';
const DLG_HEADER_CONTENT: string = 'e-dlg-header-content';

class SfDialog {
    /* Component variables */
    private popupObj: Popup;
    private dragObj: Draggable;
    /* Number variables */
    private zIndex: number;
    /* String variables */
    private height: string;
    private width: string;
    private cssClass: string;
    private minHeight: string;
    private resizeIconDirection: string;
    /* Boolean variables */
    private visible: boolean;
    private isModal: boolean;
    private enableRtl: boolean;
    private enableResize: boolean;
    private closeOnEscape: boolean;
    private allowDragging: boolean;
    private allowMaxHeight: boolean;
    private calculatezIndex: boolean;
    private hasFocusableNode: boolean = false;
    /* HtmlElement variables */
    private targetEle: HTMLElement;
    private refElement: HTMLElement;
    private contentEle: HTMLElement;
    private dlgOverlay: HTMLElement;
    private dlgContainer: HTMLElement;
    private headerContent: HTMLElement;
    private target: string | HTMLElement;
    private primaryButtonEle: HTMLElement;
    private storeActiveElement: HTMLElement;
    /* Complex variables */
    private animationSettings: { [key: string]: Object };
    private position: { [key: string]: string | number };
    /* Common variables */
    private element: BlazorDialogElement;
    private dotNetRef: BlazorDotnetObject;

    constructor(element: BlazorDialogElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        if (this.element) {
            this.element.blazor__instance = this;
        }
    }
    public initialize(): void {
        this.dlgContainer = undefined;
        this.popupObj = null;
        this.calculatezIndex = (this.zIndex === 1000);
        this.render();
        this.dotNetRef.invokeMethodAsync('CreatedEvent', null);
        this.element.classList.remove('e-blazor-hidden');
        if (this.visible) {
            this.dotNetRef.invokeMethodAsync('ShowDialog', null);
        } else {
            if (this.isModal) { this.dlgOverlay.style.display = 'none'; }
        }
        this.setWidth();
        this.setMinHeight();
        if (this.enableResize) {
            this.setResize();
            if (this.animationSettings.effect === 'None') { this.getMinHeight(); }
        }
        this.bindEvent(this.element);
    }
    private updateContext(dlgObj: { [key: string]: Object }): void {
        extend(this, this, dlgObj);
    }
    public setWidth(): void {
        if (this.width === '100%') {
            this.element.style.width = '';
        } else { setStyleAttribute(this.element, { 'width': formatUnit(this.width) }); }
    }
    public setHeight(): void {
        setStyleAttribute(this.element, { 'height': formatUnit(this.height) });
    }
    public setMinHeight(): void {
        if (this.minHeight !== '') { setStyleAttribute(this.element, { 'minHeight': formatUnit(this.minHeight) }); }
    }
    private render(): void {
        this.checkPositionData();
        this.targetEle = this.getTargetEle(this.target);
        if (Browser.isDevice) { addClass([this.element], DEVICE); }
        if (isNOU(this.headerContent)) { this.headerContent = this.element.querySelector('.' + DLG_HEADER_CONTENT); }
        if (isNOU(this.contentEle)) { this.contentEle = this.element.querySelector('.' + DLG_CONTENT); }
        this.setMaxHeight();
        if (this.zIndex === 1000) { this.setzIndex(this.element, false); }
        if (this.allowDragging && (!isNOU(this.headerContent))) { this.setAllowDragging(); }
        if (this.isModal && isNOU(this.dlgContainer)) {
            this.dlgContainer = this.element.parentElement;
            this.dlgOverlay = <HTMLElement>this.element.parentElement.getElementsByClassName(DLG_OVERLAY)[0];
        }
        if (!isNOU(this.element.parentElement)) {
            let parentEle: Element = this.isModal ? this.dlgContainer.parentElement : this.element.parentElement;
            this.refElement = createElement('div', { className: DLG_REF_ELEMENT });
            parentEle.insertBefore(this.refElement, (this.isModal ? this.dlgContainer : this.element));
        }
        if (!isNOU(this.targetEle)) {
            this.isModal ? this.targetEle.appendChild(this.dlgContainer) : this.targetEle.appendChild(this.element);
        }
        this.popupObj = new Popup(this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.getTargetEle(this.target),
            actionOnScroll: 'none',
            enableRtl: this.enableRtl,
            open: () => {
                if (this.enableResize) { this.resetResizeIcon(); }
                this.dotNetRef.invokeMethodAsync('OpenEvent', null);
            },
            close: () => {
                if (this.isModal) {
                    addClass([this.dlgOverlay], FADE);
                    this.dlgContainer.style.display = 'none';
                }
                this.hasFocusableNode = false;
                this.dotNetRef.invokeMethodAsync('CloseEvent', this.element.classList.toString());
            }
        });
        this.positionChange();
        this.setEnableRTL();
    }
    private checkPositionData(): void {
        if (!isNOU(this.position)) {
            if (!isNOU(this.position.X) && (typeof (this.position.X) !== 'number')) {
                let isNumber: boolean = this.isNumberValue(this.position.X);
                if (isNumber) { this.position.X = parseFloat(this.position.X); }
            }
            if (!isNOU(this.position.Y) && (typeof (this.position.Y) !== 'number')) {
                let isNumber: boolean = this.isNumberValue(this.position.Y);
                if (isNumber) { this.position.Y = parseFloat(this.position.Y); }
            }
        }
    }
    private isNumberValue(value: string): boolean {
        return /^[-+]?\d*\.?\d+$/.test(value);
    }
    private getTargetEle(target: string | HTMLElement): HTMLElement {
        let targetEle: Element;
        if (!isNOU(target) && (typeof target) === 'string') { targetEle = document.querySelector(target as string); }
        return (isNOU(targetEle) ? document.body : targetEle) as HTMLElement;
    }
    private setMaxHeight(): void {
        if (!this.allowMaxHeight) { return; }
        let display: string = this.element.style.display;
        this.element.style.display = 'none';
        this.element.style.maxHeight = (!isNOU(this.target)) && (this.targetEle.offsetHeight < window.innerHeight) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
        this.element.style.display = display;
        if (Browser.isIE && this.height === 'auto' && !isNOU(this.contentEle)
            && this.element.offsetHeight < this.contentEle.offsetHeight) {
            this.element.style.height = 'inherit';
        }
    }
    private setzIndex(zIndexElement: HTMLElement, setPopupZindex: boolean): void {
        this.zIndex = getZindexPartial(zIndexElement);
        if (setPopupZindex) { this.popupObj.zIndex = this.zIndex; }
    }
    public updatezIndex(): void {
        this.popupObj.zIndex = this.zIndex;
        if (this.isModal) { this.setOverlayZindex(this.zIndex); }
        this.calculatezIndex = (this.element.style.zIndex !== this.zIndex.toString()) ? false : true;
    }
    public updateTarget(): void {
        this.targetEle = this.getTargetEle(this.target);
        this.popupObj.relateTo = this.targetEle;
        if (this.dragObj) { this.dragObj.dragArea = this.targetEle; }
        this.setMaxHeight();
        if (this.isModal) {
            this.targetEle.appendChild(this.dlgContainer);
        }
        if (this.enableResize) { this.setResize(); }
    }
    private resetResizeIcon(): void {
        let dialogConHeight: number = this.getMinHeight();
        if (this.targetEle.offsetHeight < dialogConHeight) {
            let resizeIcon: HTMLElement = this.element.querySelector('.' + this.resizeIconDirection);
            if (!isNOU(resizeIcon)) { resizeIcon.style.bottom = '-' + dialogConHeight.toString() + 'px'; }
        }
    }
    private getMouseEvtArgs(e: MouseEventArgs): { [key: string]: string | number | boolean } {
        return {
            altKey: e.altKey, button: e.button, buttons: e.buttons, clientX: e.clientX, clientY: e.clientY, ctrlKey: e.ctrlKey,
            detail: e.detail, metaKey: e.metaKey, screenX: e.screenX, screenY: e.screenY, shiftKey: e.shiftKey, type: e.type
        };
    }
    public setAllowDragging(): void {
        let proxy: SfDialog = this;
        this.dragObj = new Draggable(this.element, {
            clone: false,
            isDragScroll: true,
            abort: '.' + DLG_CLOSE_ICON_BTN,
            handle: '.' + DLG_HEADER_CONTENT,
            dragStart: (e: { [key: string]: string | Object } & BlazorDragEventArgs) => {
                proxy.dotNetRef.invokeMethodAsync('DragStartEvent', {
                    target: { ID: (<Element>e.target).id }, event: proxy.getMouseEvtArgs(e.event as MouseEventArgs)
                });
                e.bindEvents(e.dragElement);
            },
            drag: (e: { [key: string]: string | Object }) => {
                proxy.dotNetRef.invokeMethodAsync('DragEvent', {
                    target: { ID: (<Element>e.target).id }, event: proxy.getMouseEvtArgs(e.event as MouseEventArgs)
                });
            },
            dragStop: (e: { [key: string]: string | Object }) => {
                if (proxy.isModal) {
                    if (!isNOU(proxy.position)) {
                        proxy.dlgContainer.classList.remove('e-dlg-' + proxy.position.X + '-' + proxy.position.Y); }
                    proxy.element.style.position = 'relative';
                }
                proxy.dotNetRef.invokeMethodAsync('DragStopEvent', {
                    target: { ID: (<Element>e.target).id }, event: proxy.getMouseEvtArgs(e.event as MouseEventArgs)
                });
                proxy.element.classList.remove(DLG_RESTRICT_LEFT);
            }
        });
        if (!isNOU(this.targetEle)) { this.dragObj.dragArea = this.targetEle; }
    }
    private positionChange(): void {
        if (this.isModal) {
            if (!isNaN(parseFloat(this.position.X as string)) && !isNaN(parseFloat(this.position.Y as string))) {
                this.setPopupPosition();
            } else if ((!isNaN(parseFloat(this.position.X as string)) && isNaN(parseFloat(this.position.Y as string)))
                || (isNaN(parseFloat(this.position.X as string)) && !isNaN(parseFloat(this.position.Y as string)))) {
                this.setPopupPosition();
            } else {
                this.element.style.top = '0px';
                this.element.style.left = '0px';
                this.dlgContainer.classList.add('e-dlg-' + this.position.X + '-' + this.position.Y);
            }
        } else { this.setPopupPosition(); }
    }
    private setPopupPosition(): void {
        this.popupObj.setProperties({ position: { X: this.position.X, Y: this.position.Y } });
    }
    public setEnableRTL(): void {
        let resizeElement : HTMLElement = this.element.querySelector('.' + DLG_RESIZE_HANDLE);
        if (!isNOU(resizeElement) && resizeElement.parentElement === this.element) {
            removeResize();
            this.setResize();
        }
    }
    public setResize(): void {
        if (this.enableResize) {
            if (!isNOU(this.element.querySelector('.' + ICON + '.' + DLG_RESIZE_HANDLE))) { return; }
            let computedHeight: string = getComputedStyle(this.element).minHeight;
            let computedWidth: string = getComputedStyle(this.element).minWidth;
            if (this.isModal && this.enableRtl) {
                this.element.classList.add(DLG_RESTRICT_LEFT);
            } else if (this.isModal && (this.target === document.body || this.target === 'body')) {
                this.element.classList.add(DLG_RESIZE_VIEWPORT);
            }
            createResize({
                element: this.element,
                direction: this.resizeIconDirection,
                minHeight: parseInt(computedHeight.slice(0, computedWidth.indexOf('p')), 10),
                maxHeight: this.targetEle.clientHeight,
                minWidth: parseInt(computedWidth.slice(0, computedWidth.indexOf('p')), 10),
                maxWidth: this.targetEle.clientWidth,
                boundary: (this.target === 'body' || this.target === 'document.body') ? null : this.targetEle,
                resizeBegin: this.onResizeStart.bind(this),
                resizeComplete: this.onResizeComplete.bind(this),
                resizing: this.onResizing.bind(this),
                proxy: this
            });
            this.wireWindowResizeEvent();
        } else {
            removeResize();
            this.unWireWindowResizeEvent();
            if (this.isModal) {
                this.element.classList.remove(DLG_RESTRICT_LEFT);
            } else { this.element.classList.remove(DLG_RESIZE_VIEWPORT); }
        }
    }
    private getMinHeight(): number {
        let computedHeaderHeight: string = '0px';
        let computedFooterHeight: string = '0px';
        if (!isNOU(this.element.querySelector('.' + DLG_HEADER_CONTENT))) {
            computedHeaderHeight = getComputedStyle(this.headerContent).height;
        }
        let footerEle: Element = select('.' + FOOTER_CONTENT, this.element);
        if (!isNOU(footerEle)) { computedFooterHeight = getComputedStyle(footerEle).height; }
        let headerHeight: number = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        let footerHeight: number = parseInt(computedFooterHeight.slice(0, computedFooterHeight.indexOf('p')), 10);
        setMinHeight(headerHeight + 30 + footerHeight);
        return (headerHeight + 30 + footerHeight);
    }
    public changePosition(dlgObj: { [key: string]: Object }): void {
        if (this.isModal && this.dlgContainer.classList.contains('e-dlg-' + this.position.X + '-' + this.position.Y)) {
            this.dlgContainer.classList.remove('e-dlg-' + this.position.X + '-' + this.position.Y);
        }
        this.updateContext(dlgObj);
        this.checkPositionData();
        this.positionChange();
    }
    private setOverlayZindex(zIndexValue?: number): void {
        let zIndex: number;
        if (isNOU(zIndexValue)) {
            zIndex = parseInt(this.element.style.zIndex, 10) ? parseInt(this.element.style.zIndex, 10) : this.zIndex;
        } else { zIndex = zIndexValue; }
        this.dlgOverlay.style.zIndex = (zIndex - 1).toString();
        this.dlgContainer.style.zIndex = zIndex.toString();
    }
    public focusContent(ele: HTMLElement): void {
        let element: HTMLElement = this.getAutoFocusNode(ele) as HTMLElement;
        let node: HTMLElement = !isNOU(element) ? element : ele;
        node.focus();
        this.hasFocusableNode = true;
    }
    private getAutoFocusNode(container: HTMLElement): HTMLElement {
        let node: HTMLElement = container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        let value: string = '[autofocus]';
        let items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>container.querySelectorAll(value);
        let validNode: HTMLElement = this.getValidFocusNode(items) as HTMLElement;
        this.primaryButtonEle = <HTMLElement>this.element.getElementsByClassName(PRIMARY)[0];
        if (!isNOU(validNode)) {
            node = validNode;
        } else {
            validNode = this.focusableElements(this.contentEle);
            if (!isNOU(validNode)) {
                return node = validNode;
            } else if (!isNOU(this.primaryButtonEle)) {
                return this.element.querySelector('.' + PRIMARY);
            }
        }
        return node;
    }
    private getValidFocusNode(items: HTMLElement[]): HTMLElement {
        let node: HTMLElement;
        for (let u: number = 0; u < items.length; u++) {
            node = items[u];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !(node as HTMLInputElement).disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            }
        }
        return node;
    }
    private disableElement(element: HTMLElement, t: string): HTMLElement {
        let elementMatch: Function = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
        if (elementMatch) {
            for (; element; element = <HTMLElement>element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    return element;
                }
            }
        }
        return null;
    }
    private focusableElements(content: HTMLElement): HTMLElement {
        if (!isNOU(content)) {
            let value: string = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            let items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    }
    public getMaxHeight(ele: HTMLElement): string {
        return ele.style.maxHeight;
    }
    public OnPropertyChanged(dlgObj: { [key: string]: Object }, props: string[]): void {
        this.updateContext(dlgObj);
        for (let key of props) {
            switch (key) {
                case 'width':
                    this.setWidth();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'minHeight':
                    this.setMinHeight();
                    break;
                case 'target':
                    this.updateTarget();
                    break;
                case 'zIndex':
                    this.updatezIndex();
                    break;
                case 'allowDragging':
                    this.setAllowDragging();
                    break;
                case 'destroyDraggable':
                    this.destroyDraggable();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'enableResize':
                    this.setResize();
                    break;
            }
        }
    }
    private fullScreen(enable: boolean): void {
        if (enable) {
            addClass([this.element], DLG_FULLSCREEN);
            let display: string = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!isNOU(this.target)) ? (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && !isNOU(this.dragObj)) {
                this.dragObj.destroy();
                this.dragObj = undefined;
            }
        } else {
            removeClass([this.element], DLG_FULLSCREEN);
            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && (!isNOU(this.headerContent))) { this.setAllowDragging(); }
        }
    }
    public show(isFullScreen: boolean, maxHeight: string, dlgObj: { [key: string]: Object }): void {
        this.updateContext(dlgObj);
        if (!this.element.classList.contains(POPUP_OPEN) || !isNOU(isFullScreen)) {
            if (!isNOU(isFullScreen)) { this.fullScreen(isFullScreen); }
            if (this.element.style.maxHeight !== maxHeight) {
                this.allowMaxHeight = false;
                this.element.style.maxHeight = maxHeight;
            }
            this.storeActiveElement = <HTMLElement>document.activeElement;
            this.element.tabIndex = -1;
            if (this.isModal && isNOU(this.dlgOverlay)) { this.dlgOverlay = this.element.parentElement.querySelector('.' + DLG_OVERLAY); }
            if (this.isModal && !isNOU(this.dlgOverlay)) {
                this.dlgOverlay.style.display = 'block';
                this.dlgContainer.style.display = 'flex';
                removeClass([this.dlgOverlay], FADE);
                if (!isNOU(this.targetEle)) {
                    if (this.targetEle === document.body) {
                        this.dlgContainer.style.position = 'fixed';
                    } else {
                        this.dlgContainer.style.position = 'absolute';
                    }
                    this.dlgOverlay.style.position = 'absolute';
                    this.element.style.position = 'relative';
                    addClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
                } else { addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]); }
            }
            let openAnimation: Object = {
                name: this.animationSettings.effect + 'In',
                duration: this.animationSettings.duration,
                delay: this.animationSettings.delay
            };
            let zIndexElement: HTMLElement = (this.isModal) ? this.element.parentElement : this.element;
            if (this.calculatezIndex) {
                this.setzIndex(zIndexElement, true);
                setStyleAttribute(this.element, { 'zIndex': this.zIndex });
                if (this.isModal) { this.setOverlayZindex(this.zIndex); }
            }
            this.animationSettings.effect === 'None' ? this.popupObj.show() : this.popupObj.show(openAnimation);
        }
    }
    public hide(): void {
        if (this.isModal) {
            !isNOU(this.targetEle) ? removeClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]) :
                removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
        }
        let closeAnimation: Object = {
            name: this.animationSettings.effect + 'Out',
            duration: this.animationSettings.duration,
            delay: this.animationSettings.delay
        };
        this.animationSettings.effect === 'None' ? this.popupObj.hide() : this.popupObj.hide(closeAnimation);
    }
    public refreshPosition(): void {
        this.popupObj.refreshPosition();
    }
    public destroyDraggable(): void {
        if (!isNOU(this.dragObj)) {
            this.dragObj.destroy();
            this.dragObj = undefined;
        }
    }
    public destroy(dlgObj: { [key: string]: Object }): void {
        this.updateContext(dlgObj);
        let attrs: string[] = ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-grabbed', 'tabindex', 'style'];
        if (!isNOU(this.cssClass) && this.cssClass !== '') {
            let classes: string[] = this.cssClass.split(' ');
            removeClass([this.element], classes);
        }
        if (Browser.isDevice) { removeClass([this.element], DEVICE); }
        removeClass([this.getTargetEle(this.target)], [DLG_TARGET, SCROLL_DISABLED]);
        this.unBindEvent(this.element);
        if (this.element.classList.contains(DLG_FULLSCREEN)) {
            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
        }
        if (this.isModal) { removeClass([(!isNOU(this.targetEle) ? this.targetEle : document.body)], SCROLL_DISABLED); }
        if (this.element.classList.contains(DLG_RESIZABLE)) {
            this.element.classList.remove(DLG_RESIZABLE);
        }
        if (this.element.classList.contains(DRAGGABLE)) {
            this.dragObj.destroy();
            this.dragObj = undefined;
        }
        if (this.element.classList.contains(POPUP)) {
            this.popupObj.destroy();
            this.popupObj = undefined;
        }
        if (!isNOU(this.refElement) && !isNOU(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore((this.isModal ? this.dlgContainer : this.element), this.refElement);
            detach(this.refElement);
            this.refElement = undefined;
        }
        if (!isNOU(this.element.children)) {
            for (let i: number = 0; i <= this.element.children.length; i++) {
                i = i - i;
                detach(this.element.children[i]);
            }
        }
        for (let i: number = 0; i < attrs.length; i++) { this.element.removeAttribute(attrs[i]); }
        if (this.isModal) {
            detach(this.element.nextElementSibling);
            let parent: Element = this.element.parentElement;
            parent.removeAttribute('class');
            parent.removeAttribute('style');
        }
        this.element.classList.remove(DIALOG);
    }
    private bindEvent(element: HTMLElement): void {
        EventHandler.add(element, 'keydown', this.keyDown, this);
    }
    private unBindEvent(element: HTMLElement): void {
        EventHandler.remove(element, 'keydown', this.keyDown);
    }
    private wireWindowResizeEvent(): void {
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
    }
    private unWireWindowResizeEvent(): void {
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
    }
    /* Event handlers begin */
    public popupCloseHandler(): void {
        let activeEle: HTMLElement = document.activeElement as HTMLElement;
        if (!isNOU(activeEle) && !isNOU(activeEle.blur)) { activeEle.blur(); }
        if (!isNOU(this.storeActiveElement) && !isNOU(this.storeActiveElement.focus)) {
            this.storeActiveElement.focus();
        }
    }
    private windowResizeHandler(): void {
        setMaxWidth(this.targetEle.clientWidth);
    }
    private onResizeStart(args: ResizeMouseEventArgs | ResizeTouchEventArgs, dialogObj: { [key: string]: Object }): void {
        let evtArgs: { [key: string]: string | number | boolean } = this.getMouseEvtArgs(args as MouseEventArgs);
        this.dotNetRef.invokeMethodAsync('ResizeStartEvent', evtArgs);
    }
    private onResizing(args: MouseEvent | TouchEvent, dialogObj: { [key: string]: Object }): void {
        this.dotNetRef.invokeMethodAsync('ResizingEvent', this.getMouseEvtArgs(args as MouseEventArgs));
    }
    private onResizeComplete(args: MouseEvent | TouchEvent, dialogObj: { [key: string]: Object }): void {
        this.dotNetRef.invokeMethodAsync('ResizeStopEvent', this.getMouseEvtArgs(args as MouseEventArgs));
    }
    private keyDown(e: KeyboardEvent): void {
        if (e.keyCode === TAB && this.isModal) {
            let btn: HTMLElement;
            let btns: NodeListOf<HTMLElement>;
            let footer: HTMLElement = this.element.querySelector('.' + FOOTER_CONTENT);
            if (!isNOU(footer)) {
                btns = footer.querySelectorAll('button');
                if (!isNOU(btn) && btns.length > 0) { btn = btns[btns.length - 1]; }
                if (isNOU(btn) && footer.childNodes.length > 0) {
                    let value: string = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
                    let items: NodeListOf<HTMLElement> = footer.querySelectorAll(value);
                    btn = items[items.length - 1] as HTMLElement;
                }
            }
            if (!isNOU(btn) && document.activeElement === btn && !e.shiftKey) {
                e.preventDefault();
                this.focusableElements(this.element).focus();
            }
            if (document.activeElement === this.focusableElements(this.element) && e.shiftKey) {
                e.preventDefault();
                if (!isNOU(btn)) { btn.focus(); }
            }
        }
        if (e.keyCode === ESCAPE && this.closeOnEscape) {
            this.dotNetRef.invokeMethodAsync('CloseDialog', {
                altKey: e.altKey, ctrlKey: e.ctrlKey, code: e.code, key: e.key, location: e.location,
                repeat: e.repeat, shiftKey: e.shiftKey, metaKey: e.metaKey, type: e.type
            });
        }
        if (this.hasFocusableNode) {
            let element: HTMLElement = <HTMLElement>document.activeElement;
            let isTagName: boolean = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
            let isContentEdit: boolean = false;
            if (!isTagName) {
                isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
            }
            if ((e.keyCode === ENTER && !e.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
                isTagName && !isNOU(this.primaryButtonEle)) || (e.keyCode === ENTER && e.ctrlKey &&
                (element.tagName.toLowerCase() === 'textarea' || isContentEdit)) && !isNOU(this.primaryButtonEle)) {
                setTimeout(() => {
                    (this.element.querySelector('.' + FOOTER_CONTENT + ' button.' + BTN + '.' + PRIMARY) as HTMLElement).click();
                });
            }
        }
    }
    /* Event handlers end */
}

// tslint:disable-next-line
let Dialog: object = {
    initialize(element: BlazorDialogElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject): void {
        if (element) {
            new SfDialog(element, options, dotnetRef);
            element.blazor__instance.initialize();
        }
    },
    getClassList(element: BlazorDialogElement): string {
        return element && element.classList.toString();
    },
    getMaxHeight(element: BlazorDialogElement): string {
        return element ? element.blazor__instance.getMaxHeight(element) : null;
    },
    changePosition(dlgObj: { [key: string]: Object }): void {
        if (!isNOU(dlgObj.element)) {
            (dlgObj.element as BlazorDialogElement).blazor__instance.changePosition(dlgObj);
        }
    },
    focusContent(element: BlazorDialogElement): void {
        if (!isNOU(element)) {
            element.blazor__instance.focusContent(element);
        }
    },
    refreshPosition(element: BlazorDialogElement): void {
        if (!isNOU(element)) {
            element.blazor__instance.refreshPosition();
        }
    },
    popupCloseHandler(element: BlazorDialogElement): void {
        if (!isNOU(element)) {
            element.blazor__instance.popupCloseHandler();
        }
    },
    propertyChanged(dlgObj: { [key: string]: Object }, changedProps: string[]): void {
        if (!isNOU(dlgObj.element)) {
            (dlgObj.element as BlazorDialogElement).blazor__instance.OnPropertyChanged(dlgObj, changedProps);
        }
    },
    show(isFullScreen: boolean, maxHeight: string, dlgObj: { [key: string]: Object }): void {
        if (dlgObj.element) {
            (dlgObj.element as BlazorDialogElement).blazor__instance.show(isFullScreen, maxHeight, dlgObj);
        }
    },
    hide(element: BlazorDialogElement): void {
        if (!isNOU(element)) {
            element.blazor__instance.hide();
        }
    },
    destroy(dlgObj: { [key: string]: Object }): void {
        if (!isNOU(dlgObj.element)) {
            (dlgObj.element as BlazorDialogElement).blazor__instance.destroy(dlgObj);
        }
    }
};

interface ResizeMouseEventArgs extends MouseEvent {
    cancel?: boolean;
}

interface ResizeTouchEventArgs extends MouseEvent {
    cancel?: boolean;
}

interface BlazorDialogElement extends HTMLElement {
    blazor__instance: SfDialog;
}

export default Dialog;