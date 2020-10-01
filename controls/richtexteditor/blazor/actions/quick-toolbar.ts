import { select, isNullOrUndefined as isNOU, Browser, EventHandler, closest } from '@syncfusion/ej2-base';
import * as events from '../constant';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { pageYOffset, hasClass, isIDevice } from '../util';
import { NotifyArgs } from '../../src/rich-text-editor/base/interface';
import { CLS_INLINE_POP, CLS_POPUP, CLS_HIDE, CLS_POPUP_CLOSE } from '../classes';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class QuickToolbar {
    private offsetX: number;
    private offsetY: number;
    private deBouncer: number;
    private target: HTMLElement;
    private parent: SfRichTextEditor;
    public linkQTBar: BaseQuickToolbar;
    public imageQTBar: BaseQuickToolbar;
    public tableQTBar: BaseQuickToolbar;
    public inlineQTBar: BaseQuickToolbar;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    public showImageQTBar(x: number, y: number, target: HTMLElement, type: string): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        let popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.imageQuickPopup);
        this.imageQTBar = new BaseQuickToolbar(this.parent);
        this.imageQTBar.render(popupTarget, type);
        this.parent.dotNetRef.invokeMethodAsync(events.showImagePopup, this.imageQTBar.popupObj.element.classList.toString(), type);
        this.imageQTBar.showPopup(x, y, target, type);
    }
    public hideImageQTBar(): void {
        if (this.imageQTBar) {
            this.imageQTBar.hidePopup();
            this.imageQTBar = undefined;
            this.parent.dotNetRef.invokeMethodAsync(events.hideImagePopup);
        }
    }
    public showLinkQTBar(x: number, y: number, target: HTMLElement, type: string): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        let popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.linkQuickPopup);
        this.linkQTBar = new BaseQuickToolbar(this.parent);
        this.linkQTBar.render(popupTarget, type);
        this.parent.dotNetRef.invokeMethodAsync(events.showLinkPopup, this.linkQTBar.popupObj.element.classList.toString());
        this.linkQTBar.showPopup(x, y, target, type);
    }
    public hideLinkQTBar(): void {
        if (this.linkQTBar) {
            this.linkQTBar.hidePopup();
            this.linkQTBar = undefined;
            this.parent.dotNetRef.invokeMethodAsync(events.hideLinkPopup);
        }
    }
    public showTableQTBar(x: number, y: number, target: HTMLElement, type: string): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        let popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.tableQuickPopup);
        this.tableQTBar = new BaseQuickToolbar(this.parent);
        this.tableQTBar.render(popupTarget, type);
        this.parent.dotNetRef.invokeMethodAsync(events.showTablePopup, this.tableQTBar.popupObj.element.classList.toString());
        this.tableQTBar.showPopup(x, y, target, type);
    }
    public hideTableQTBar(): void {
        if (this.tableQTBar) {
            this.tableQTBar.hidePopup();
            this.tableQTBar = undefined;
            this.parent.dotNetRef.invokeMethodAsync(events.hideTablePopup);
        }
    }
    public showInlineQTBar(x: number, y: number, target: HTMLElement): void {
        if (this.parent.readonly || !this.parent.inlineMode.enable) { return; }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            let popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.inlineQuickPopup);
            this.inlineQTBar = new BaseQuickToolbar(this.parent);
            this.inlineQTBar.render(popupTarget, 'Inline');
            EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
            this.parent.dotNetRef.invokeMethodAsync(events.showInlinePopup, this.inlineQTBar.popupObj.element.classList.toString());
            this.inlineQTBar.showPopup(x, y, target, 'Inline');
        }
    }
    public hideInlineQTBar(): void {
        if (this.inlineQTBar) {
            this.inlineQTBar.hidePopup();
            this.inlineQTBar = undefined;
            this.parent.dotNetRef.invokeMethodAsync(events.hideInlinePopup);
        }
    }
    public hideQuickToolbars(): void {
        if (!isNOU(this.linkQTBar)) { this.hideLinkQTBar(); }
        if (!isNOU(this.imageQTBar)) { this.hideImageQTBar(); }
        if (!isNOU(this.tableQTBar)) { this.hideTableQTBar(); }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) { this.hideInlineQTBar(); }
    }
    private scrollHandler(): void {
        if (this.parent.quickToolbarSettings.actionOnScroll.toLocaleLowerCase() === 'hide') {
            this.hideQuickToolbars();
        }
    }
    private selectionChangeHandler(e: Event): void {
        if (!this.parent.inlineMode.onSelection) { return; }
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.onSelectionChange(e); }, 1000);
    }
    private onSelectionChange(e: Event): void {
        if (!isNOU(select('.' + CLS_INLINE_POP + '.' + CLS_POPUP, document.body))) { return; }
        let selection: Selection = this.parent.getDocument().getSelection();
        if (!selection.isCollapsed) { this.mouseUpHandler({ args: e as MouseEvent }); }
    }
    private toolbarUpdated(args: NotifyArgs): void {
        if (!isNOU(this.linkQTBar)) { this.hideLinkQTBar(); }
        if (!isNOU(this.imageQTBar)) { this.hideImageQTBar(); }
        if (!isNOU(this.tableQTBar)) { this.hideTableQTBar(); }
    }
    private deBounce(x: number, y: number, target: HTMLElement): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.showInlineQTBar(x, y, target); }, 1000);
    }
    private onMouseDown(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    }
    private mouseUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            let coordinates: Touch | MouseEvent;
            coordinates = (e.args as TouchEvent).touches ? (e.args as TouchEvent).changedTouches[0] : e.args as MouseEvent;
            let range: Range = this.parent.getRange();
            let target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
            let inlinePopEle: HTMLElement = select('.' + CLS_INLINE_POP, document.body);
            if (isNOU(inlinePopEle) || inlinePopEle.classList.contains(CLS_HIDE)) {
                if (isIDevice() && e.touchData && e.touchData.prevClientX !== e.touchData.clientX
                    && e.touchData.prevClientY !== e.touchData.clientY) { return; }
                this.hideInlineQTBar();
                this.offsetX = coordinates.pageX;
                this.offsetY = pageYOffset(coordinates, this.parent.element, this.parent.iframeSettings.enable);
                if (target.nodeName === 'TEXTAREA') {
                    this.showInlineQTBar(this.offsetX, this.offsetY, target);
                } else {
                    let closestAnchor: HTMLElement = closest(target, 'a') as HTMLElement;
                    target = closestAnchor ? closestAnchor : target;
                    if (target.tagName !== 'IMG' && target.tagName !== 'A' && (!closest(target, 'td,th') || !range.collapsed)) {
                        if (this.parent.inlineMode.onSelection && range.collapsed) { return; }
                        this.target = target;
                        this.showInlineQTBar(this.offsetX, this.offsetY, target);
                    }
                }
            }
        }
    }
    private keyDownHandler(): void {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNOU(select('.' + CLS_INLINE_POP + '.' + CLS_POPUP, document))) {
            this.hideInlineQTBar();
        }
    }
    private inlineQTBarMouseDownHandler(): void {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNOU(select('.' + CLS_INLINE_POP + '.' + CLS_POPUP, document))) {
            this.hideInlineQTBar();
        }
    }
    private keyUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            if (this.parent.inlineMode.onSelection) { return; }
            let args: KeyboardEvent = e.args as KeyboardEvent;
            this.deBounce(this.offsetX, this.offsetY, args.target as HTMLElement);
        }
    }
    private onKeyDown(e: NotifyArgs): void {
        let args: KeyboardEvent = e.args as KeyboardEvent;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, CLS_POPUP_CLOSE)) { this.imageQTBar.hidePopup(); }
        }
    }
    private onIframeMouseDown(): void {
        this.hideQuickToolbars();
        this.hideInlineQTBar();
    }
    public addEventListener(): void {
        if (this.parent.inlineMode.enable && this.parent.inlineMode.onSelection && isIDevice()) {
            EventHandler.add(this.parent.getDocument(), 'selectionchange', this.selectionChangeHandler, this);
        }
        this.parent.observer.on(events.toolbarUpdated, this.toolbarUpdated, this);
        this.wireInlineQTBarEvents();
        this.parent.observer.on(events.scroll, this.scrollHandler, this);
        this.parent.observer.on(events.contentscroll, this.scrollHandler, this);
        this.parent.observer.on(events.focusChange, this.hideQuickToolbars, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
    }
    public removeEventListener(): void {
        EventHandler.remove(this.parent.getDocument(), 'selectionchange', this.selectionChangeHandler);
        this.parent.observer.off(events.toolbarUpdated, this.toolbarUpdated);
        this.unWireInlineQTBarEvents();
        this.parent.observer.off(events.scroll, this.scrollHandler);
        this.parent.observer.off(events.contentscroll, this.scrollHandler);
        this.parent.observer.off(events.focusChange, this.hideQuickToolbars);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
    }
    private wireInlineQTBarEvents(): void {
        this.parent.observer.on(events.mouseUp, this.mouseUpHandler, this);
        this.parent.observer.on(events.mouseDown, this.inlineQTBarMouseDownHandler, this);
        this.parent.observer.on(events.keyDown, this.keyDownHandler, this);
        this.parent.observer.on(events.keyUp, this.keyUpHandler, this);
        this.parent.observer.on(events.sourceCodeMouseDown, this.mouseUpHandler, this);
    }
    private unWireInlineQTBarEvents(): void {
        this.parent.observer.off(events.mouseUp, this.mouseUpHandler);
        this.parent.observer.off(events.mouseDown, this.inlineQTBarMouseDownHandler);
        this.parent.observer.off(events.keyDown, this.keyDownHandler);
        this.parent.observer.off(events.keyUp, this.keyUpHandler);
        this.parent.observer.off(events.sourceCodeMouseDown, this.mouseUpHandler);
    }
    public destroy(): void {
        if (this.linkQTBar) {
            EventHandler.remove(this.linkQTBar.element, 'mousedown', this.onMouseDown);
            this.linkQTBar.destroy();
        }
        if (this.imageQTBar) {
            EventHandler.remove(this.imageQTBar.element, 'mousedown', this.onMouseDown);
            this.imageQTBar.destroy();
        }
        if (this.tableQTBar) {
            EventHandler.remove(this.tableQTBar.element, 'mousedown', this.onMouseDown);
            this.tableQTBar.destroy();
        }
        if (this.inlineQTBar) {
            EventHandler.remove(this.inlineQTBar.element, 'mousedown', this.onMouseDown);
            if (isIDevice()) {
                EventHandler.remove(document, 'selectionchange', this.selectionChangeHandler);
            }
            this.inlineQTBar.destroy();
        }
        this.removeEventListener();
    }
}