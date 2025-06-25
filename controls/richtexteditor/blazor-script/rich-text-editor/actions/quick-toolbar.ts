import { select, isNullOrUndefined as isNOU, Browser, EventHandler, closest } from '../../../base'; /*externalscript*/
import * as events from '../constant';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { scrollY, hasClass } from '../util';
import { isIDevice } from '../../src/common/util';
import { NotifyArgs } from '../../src/common/interface';
import { CLS_INLINE_POP, CLS_POPUP, CLS_RTE_HIDDEN, CLS_POPUP_CLOSE } from '../classes';

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
    public audioQTBar: BaseQuickToolbar;
    public videoQTBar: BaseQuickToolbar;
    public tableQTBar: BaseQuickToolbar;
    public inlineQTBar: BaseQuickToolbar;
    public textQTBar: BaseQuickToolbar;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    public showImageQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) {
            return;
        }
        const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.imageQuickPopup);
        if (isNOU(this.imageQTBar)) {
            this.imageQTBar = new BaseQuickToolbar('Image', this.parent);
            this.imageQTBar.render(popupTarget);
        }
        (this.parent.dotNetRef.invokeMethodAsync(events.showImagePopup, this.imageQTBar.popupObj.element.classList.toString()
        ) as unknown as Promise<void>).then(() => {
            if (this.imageQTBar) {
                this.imageQTBar.showPopup(target, originalEvent);
            }
        });
    }
    public showAudioQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.audioQuickPopup);
        if (isNOU(this.audioQTBar)) {
            this.audioQTBar = new BaseQuickToolbar('Audio', this.parent);
            this.audioQTBar.render(popupTarget);
        }
        (this.parent.dotNetRef.invokeMethodAsync(events.showAudioQuickToolbar, this.audioQTBar.popupObj.element.classList.toString()
        ) as unknown as Promise<void>).then(() => {
            this.audioQTBar.showPopup(target, originalEvent);
        });
    }
    public showVideoQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.videoQuickPopup);
        if (isNOU(this.videoQTBar)) {
            this.videoQTBar = new BaseQuickToolbar('Video', this.parent);
            this.videoQTBar.render(popupTarget);
        }
        (this.parent.dotNetRef.invokeMethodAsync(events.showVideoQuickToolbar, this.videoQTBar.popupObj.element.classList.toString()
        ) as unknown as Promise<void>).then(() => {
            if (this.videoQTBar) {
                this.videoQTBar.showPopup(target, originalEvent);
            }
        });
    }
    public hideImageQTBar(): void {
        if (this.imageQTBar) {
            this.imageQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideImagePopup);
        }
    }
    public hideAudioQTBar(): void {
        if (this.audioQTBar) {
            this.audioQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideAudioQuickToolbar);
        }
    }
    public hideVideoQTBar(): void {
        if (this.videoQTBar) {
            this.videoQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideVideoQuickToolbar);
        }
    }
    public showLinkQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.linkQuickPopup);
        if (isNOU(this.linkQTBar)) {
            this.linkQTBar = new BaseQuickToolbar('Link', this.parent);
            this.linkQTBar.render(popupTarget);
        }
        (this.parent.dotNetRef.invokeMethodAsync(events.showLinkPopup, this.linkQTBar.popupObj.element.classList.toString()) as
        unknown as Promise<void>).then(() => {
            this.linkQTBar.showPopup(target, originalEvent);
        });
    }
    public hideLinkQTBar(): void {
        if (this.linkQTBar) {
            this.linkQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideLinkPopup);
        }
    }
    public showTableQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !this.parent.quickToolbarSettings.enable) { return; }
        const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.tableQuickPopup);
        if (isNOU(this.tableQTBar)) {
            this.tableQTBar = new BaseQuickToolbar('Table', this.parent);
            this.tableQTBar.render(popupTarget);
        }
        const tableTarget : string = target.closest('th') ? target.closest('th').nodeName : '';
        (this.parent.dotNetRef.invokeMethodAsync(events.showTablePopup, this.tableQTBar.popupObj.element.classList.toString(),
                                                 tableTarget) as unknown as Promise<void>).then(() => {
            if (this.tableQTBar) {
                this.tableQTBar.showPopup(target, originalEvent);
            }
        });
    }
    public hideTableQTBar(): void {
        if (this.tableQTBar) {
            this.tableQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideTablePopup);
        }
    }
    public showInlineQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !this.parent.inlineMode.enable) { return; }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.inlineQuickPopup);
            if (isNOU(this.inlineQTBar)) {
                this.inlineQTBar = new BaseQuickToolbar('Inline', this.parent);
                this.inlineQTBar.render(popupTarget);
            }
            EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
            const classes: string = this.inlineQTBar.popupObj.element.classList.toString();
            (this.parent.dotNetRef.invokeMethodAsync(events.showInlinePopup, classes) as unknown as Promise<void>).then(() => {
                this.inlineQTBar.showPopup(target, originalEvent);
            });
        }
    }

    public showTextQTBar(target: HTMLElement, originalEvent?: MouseEvent | KeyboardEvent): void {
        if (this.parent.readonly || !(this.parent.quickToolbarSettings.text.length > 0)) { return; }
        const popupTarget: HTMLElement = document.querySelector('#' + this.parent.element.id + events.textQuickPopup);
        if (isNOU(this.textQTBar)) {
            this.textQTBar = new BaseQuickToolbar('Text', this.parent);
            this.textQTBar.render(popupTarget);
        }
        EventHandler.add(this.textQTBar.element, 'mousedown', this.onMouseDown, this);
        const classes: string = this.textQTBar.popupObj.element.classList.toString();
        (this.parent.dotNetRef.invokeMethodAsync(events.showTextPopup, classes) as unknown as Promise<void>).then(() => {
            this.textQTBar.showPopup(target, originalEvent);
        });
    }

    public hideInlineQTBar(): void {
        if (this.inlineQTBar) {
            this.inlineQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideInlinePopup);
        }
    }

    public hideTextQTBar(): void {
        if (this.textQTBar) {
            this.textQTBar.hidePopup();
            this.parent.dotNetRef.invokeMethodAsync(events.hideTextPopup);
        }
    }

    public hideQuickToolbars(): void {
        if (!isNOU(this.linkQTBar)) { this.hideLinkQTBar(); }
        if (!isNOU(this.imageQTBar)) { this.hideImageQTBar(); }
        if (!isNOU(this.audioQTBar)) { this.hideAudioQTBar(); }
        if (!isNOU(this.videoQTBar)) { this.hideVideoQTBar(); }
        if (!isNOU(this.tableQTBar)) { this.hideTableQTBar(); }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) { this.hideInlineQTBar(); }
        if (!isNOU(this.textQTBar)) { this.hideTextQTBar(); }
    }
    private selectionChangeHandler(e: Event): void {
        if (!this.parent.inlineMode.onSelection) { return; }
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.onSelectionChange(e); }, 1000);
    }
    private onSelectionChange(e: Event): void {
        if (!isNOU(select('.' + CLS_INLINE_POP + '.' + CLS_POPUP, document.body))) { return; }
        const selection: Selection = this.parent.getDocument().getSelection();
        if (!selection.isCollapsed) { this.mouseUpHandler({ args: e as MouseEvent }); }
    }
    private toolbarUpdated(args: NotifyArgs): void {
        if (!isNOU(this.linkQTBar)) { this.hideLinkQTBar(); }
        if (!isNOU(this.imageQTBar)) { this.hideImageQTBar(); }
        if (!isNOU(this.audioQTBar)) { this.hideAudioQTBar(); }
        if (!isNOU(this.videoQTBar)) { this.hideVideoQTBar(); }
        if (!isNOU(this.tableQTBar)) { this.hideTableQTBar(); }
    }
    private deBounce(target: HTMLElement, originalEvent: MouseEvent | KeyboardEvent): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.showInlineQTBar(target, originalEvent); }, 1000);
    }
    private onMouseDown(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    }
    private mouseUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            const args: Touch | MouseEvent = (e.args as TouchEvent).touches ? (e.args as TouchEvent).changedTouches[0]
                : e.args as MouseEvent;
            const range: Range = this.parent.getRange();
            let target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
            const inlinePopEle: HTMLElement = select('.' + CLS_INLINE_POP, document.body);
            if (isNOU(inlinePopEle) || inlinePopEle.classList.contains(CLS_RTE_HIDDEN)) {
                if (isIDevice() && e.touchData && e.touchData.prevClientX !== e.touchData.clientX
                    && e.touchData.prevClientY !== e.touchData.clientY) { return; }
                this.hideInlineQTBar();
                const parentLeft: number = this.parent.element.getBoundingClientRect().left;
                this.offsetX = this.parent.iframeSettings.enable ? window.scrollX + parentLeft + args.clientX : args.pageX;
                this.offsetY = scrollY(args, this.parent.element, this.parent.iframeSettings.enable);
                if (target.nodeName === 'TEXTAREA') {
                    this.showInlineQTBar(target, e.args as MouseEvent);
                } else {
                    const closestAnchor: HTMLElement = closest(target, 'a') as HTMLElement;
                    target = closestAnchor ? closestAnchor : target;
                    if (target.tagName !== 'IMG' && target.tagName !== 'A' && (!closest(target, 'td,th') || !range.collapsed)) {
                        const isCursor: boolean = range.startOffset === range.endOffset && range.startContainer === range.endContainer;
                        if ((this.parent.inlineMode.onSelection && isCursor) ||
                            (!this.parent.inlineMode.onSelection && !isCursor)) { return; }
                        this.target = target;
                        this.showInlineQTBar(target, e.args as MouseEvent);
                    }
                }
            }
        }
        if (!this.parent.inlineMode.enable && this.parent.editorMode === 'HTML') {
            const args: Touch | MouseEvent = (e.args as TouchEvent).touches ?
                (e.args as TouchEvent).changedTouches[0] : e.args as MouseEvent;
            const target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
            this.hideQuickToolbars();
            const parentLeft: number = this.parent.element.getBoundingClientRect().left;
            this.offsetX = this.parent.iframeSettings.enable ? this.parent.element.ownerDocument.documentElement.scrollLeft
                + parentLeft + args.clientX : args.pageX;
            this.offsetY = scrollY(args, this.parent.element, this.parent.iframeSettings.enable);
            const range: Range = this.parent.getRange();
            if ((range.endContainer.parentElement.tagName === range.startContainer.parentElement.tagName && (range.startContainer.parentElement.tagName === 'A' && range.endContainer.parentElement.tagName === 'A')) ||
             (target.tagName === 'IMG') || (target.tagName === 'VIDEO' || this.parent.videoModule.isEmbedVidElem(target)) || (target.tagName === 'AUDIO') || (target.childNodes[0] && target.childNodes[0].nodeType === 1 && (target.childNodes[0 as number] as HTMLElement).classList.contains('e-rte-audio')) ||
             (this.parent.getRange().startOffset === this.parent.getRange().endOffset) || this.hasResizeElement(this.parent.inputElement)) {
                return;
            }
            this.target = target;
            this.showTextQTBar(target, e.args as MouseEvent);
        }
    }
    private hasResizeElement(target: HTMLElement): boolean {
        if (target && (target.querySelector('.e-img-resize') || target.querySelector('.e-vid-resize'))) {
            return true;
        }
        return false;
    }
    private keyDownHandler(e: NotifyArgs): void {
        const preventHide: boolean = (e.args as KeyboardEvent).altKey;
        if (!preventHide) {
            if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
                && !isNOU(select('.' + CLS_INLINE_POP + '.' + CLS_POPUP, document))) {
                this.hideInlineQTBar();
            }
        }
        if (!isNOU(this.textQTBar) && !isNOU(this.textQTBar.element) && this.textQTBar.element.classList.contains('e-popup-open')) {
            this.hideTextQTBar();
        }
    }
    private inlineQTBarMouseDownHandler(): void {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNOU(select('.' + CLS_INLINE_POP + '.' + CLS_POPUP, document))) {
            this.hideInlineQTBar();
        }
        if (!isNOU(this.textQTBar) && !isNOU(this.textQTBar.element) && this.textQTBar.element.classList.contains('e-popup-open')) {
            this.hideTextQTBar();
        }
    }
    private keyUpHandler(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            if (this.parent.inlineMode.onSelection) {
                if (this.parent.getSelection().length > 0) {
                    if ((args.ctrlKey && args.keyCode === 65) || (args.shiftKey && (args.keyCode === 33 || args.keyCode === 34 ||
                        args.keyCode === 35 || args.keyCode === 36 || args.keyCode === 37 || args.keyCode === 38 ||
                        args.keyCode === 39 || args.keyCode === 40))) {
                        this.showInlineQTBar(args.target as HTMLElement, e.args as KeyboardEvent);
                    }
                }
                return;
            }
            this.deBounce(args.target as HTMLElement, e.args as KeyboardEvent);
        }
        if (this.parent.quickToolbarSettings.text && !Browser.isDevice && this.parent.getSelection().length > 0) {
            if ((args.ctrlKey && args.keyCode === 65) || (args.shiftKey && (args.keyCode === 33 || args.keyCode === 34 ||
                args.keyCode === 35 || args.keyCode === 36 || args.keyCode === 37 || args.keyCode === 38 ||
                args.keyCode === 39 || args.keyCode === 40))) {
                this.showTextQTBar(args.target as HTMLElement, e.args as KeyboardEvent );
            }
        }
    }
    private onKeyDown(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, CLS_POPUP_CLOSE)) { this.imageQTBar.hidePopup(); }
            if (this.audioQTBar && !hasClass(this.audioQTBar.element, CLS_POPUP_CLOSE)) { this.audioQTBar.hidePopup(); }
            if (this.videoQTBar && !hasClass(this.videoQTBar.element, CLS_POPUP_CLOSE)) { this.videoQTBar.hidePopup(); }
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
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.observer.on(events.scroll, this.hideQuickToolbars, this);
            this.parent.observer.on(events.contentscroll, this.hideQuickToolbars, this);
        } else {
            this.parent.observer.on(events.scroll, this.onScroll, this);
            this.parent.observer.on(events.contentscroll, this.onScroll, this);
        }
        this.parent.observer.on(events.focusChange, this.hideQuickToolbars, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.keyDown, this.onKeyDown, this);
        this.parent.observer.on(events.windowResize, this.onWindowResize, this);
    }
    public removeEventListener(): void {
        EventHandler.remove(this.parent.getDocument(), 'selectionchange', this.selectionChangeHandler);
        this.parent.observer.off(events.toolbarUpdated, this.toolbarUpdated);
        this.unWireInlineQTBarEvents();
        this.parent.observer.off(events.focusChange, this.hideQuickToolbars);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.keyDown, this.onKeyDown);
        this.parent.observer.off(events.windowResize, this.onWindowResize);
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
        if (this.audioQTBar) {
            EventHandler.remove(this.audioQTBar.element, 'mousedown', this.onMouseDown);
            this.audioQTBar.destroy();
        }
        if (this.videoQTBar) {
            EventHandler.remove(this.videoQTBar.element, 'mousedown', this.onMouseDown);
            this.videoQTBar.destroy();
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
    /**
     * Gets the inline Quick Toolbar element.
     *
     * @returns {HTMLElement | null} The inline QTBar element if it exists, otherwise null.
     */
    public getInlineQTBarElement(): HTMLElement | null {
        return this.inlineQTBar && this.inlineQTBar.element as HTMLElement ? this.inlineQTBar.element as HTMLElement : null;
    }

    /**
     * @returns {BaseQuickToolbar[]} - specifies the quick toolbar instance.
     * @hidden
     * @private
     */
    public getQuickToolbarInstance(): BaseQuickToolbar[] {
        return [this.linkQTBar, this.imageQTBar, this.audioQTBar, this.videoQTBar, this.tableQTBar, this.inlineQTBar, this.textQTBar];
    }
    /**
     * Gets the table Quick Toolbar element.
     *
     * @returns {HTMLElement | null} The table QTBar element if it exists, otherwise null.
     */
    public getTableQTBarElement(): HTMLElement | null {
        return this.tableQTBar && this.tableQTBar.element as HTMLElement ? this.tableQTBar.element as HTMLElement : null;
    }

    public onScroll(e: MouseEvent): void {
        this.refreshQuickToolbarPopup(e);
    }

    /**
     * Refreshes the quick toolbar popups by hiding and then displaying them again
     * at a target element's location. This method iterates over all available quick
     * toolbars, checking their rendered state and visibility. If a toolbar is
     * currently visible, it is hidden and then shown again to refresh its position
     * based on the specified mouse event. Additionally, for text toolbars, any
     * previously stored status is restored after the refresh.
     *
     * @param {MouseEvent} e - The mouse event that triggers the refresh, used to
     *                         determine the new position for the toolbars.
     * @returns {void}
     */
    public refreshQuickToolbarPopup(e?: MouseEvent): void {
        const quickToolbars: BaseQuickToolbar[] = this.getQuickToolbarInstance();
        for (const quickToolbar of quickToolbars) {
            if (quickToolbar && quickToolbar.isRendered && quickToolbar.element && quickToolbar.element.classList.contains('e-popup-open')) {
                quickToolbar.hidePopup();
                const target: HTMLElement = quickToolbar.previousTarget as HTMLElement;
                quickToolbar.showPopup(target, e);
            }
        }
    }

    private onWindowResize(e: NotifyArgs): void {
        if (!isNOU(e.args)) {
            this.refreshQuickToolbarPopup(e.args as MouseEvent);
        }
    }
}
