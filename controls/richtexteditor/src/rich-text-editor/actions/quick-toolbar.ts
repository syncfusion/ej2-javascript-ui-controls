import { select, isNullOrUndefined, Browser, addClass, removeClass, EventHandler, closest, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import { pageYOffset, hasClass } from '../base/util';
import { IRichTextEditor, IQuickToolbarOptions, ICssClassArgs, IQuickToolbar, IRenderer } from '../base/interface';
import { NotifyArgs, IToolbarItems, IToolbarStatus } from '../../common/interface';
import { isIDevice } from '../../common/util';
import { ServiceLocator } from '../services/service-locator';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { BaseToolbar } from './base-toolbar';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { CLS_INLINE_TOOLBAR, CLS_INLINE, CLS_VID_CLICK_ELEM} from '../base/classes';
import { QuickToolbarType } from '../../common/types';
import { BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class QuickToolbar implements IQuickToolbar {
    private offsetX: number;
    private offsetY: number;
    private deBouncer: number;
    private target: HTMLElement;
    private locator: ServiceLocator;
    private parent: IRichTextEditor;
    private contentRenderer: IRenderer;
    public linkQTBar: BaseQuickToolbar;
    public textQTBar: BaseQuickToolbar;
    public imageQTBar: BaseQuickToolbar;
    public audioQTBar: BaseQuickToolbar;
    public videoQTBar: BaseQuickToolbar;
    public tableQTBar: BaseQuickToolbar;
    public inlineQTBar: BaseQuickToolbar;
    public debounceTimeout: number = 1000;
    public isDestroyed: boolean;
    private escapeKeyPressed: boolean = false;
    private showInlineQTBarTimeOut: number | null;

    public constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
        this.isDestroyed = false;
    }

    private formatItems(items: (string | IToolbarItems)[]): (string | IToolbarItems)[] {
        const formattedItems: (string | IToolbarItems)[] = [];
        items.forEach((item: string | IToolbarItems) => {
            if (typeof item === 'string') {
                switch (item.toLocaleLowerCase()) {
                case 'open':
                    formattedItems.push('openLink');
                    break;
                case 'edit':
                    formattedItems.push('editLink');
                    break;
                case 'unlink':
                    formattedItems.push('removeLink');
                    break;
                default:
                    formattedItems.push(item);
                    break;
                }
            } else {
                formattedItems.push(item);
            }
        });
        return formattedItems;
    }

    private getQTBarOptions(popType: string, mode: string, items: (string | IToolbarItems)[], type: RenderType): IQuickToolbarOptions {
        return {
            popupType: popType,
            toolbarItems: items,
            mode: mode as OverflowMode,
            renderType: type,
            cssClass: this.parent.getCssClass()
        };
    }

    /**
     * createQTBar method
     *
     * @param {string} popupType - specifies the string value
     * @param {string} mode - specifies the string value.
     * @param {string} items - specifies the string.
     * @param {RenderType} type - specifies the render type.
     * @returns {BaseQuickToolbar} - specifies the quick toolbar
     * @hidden
     * @deprecated
     */
    public createQTBar(popupType: QuickToolbarType, mode: string, items: (string | IToolbarItems)[], type: RenderType): BaseQuickToolbar {
        if (items.length < 1) {
            return null;
        }
        const qTBar: BaseQuickToolbar = new BaseQuickToolbar(popupType, this.parent, this.locator);
        qTBar.render(this.getQTBarOptions(popupType, mode, this.formatItems(items), type));
        return qTBar;
    }

    private initializeQuickToolbars(): void {
        this.parent.quickToolbarModule = this;
        this.contentRenderer = this.parent.contentModule;
        if (this.parent.inlineMode.enable && this.parent.inlineMode.onSelection && isIDevice()) {
            EventHandler.add(this.contentRenderer.getDocument(), 'selectionchange', this.selectionChangeHandler, this);
        }
    }

    // eslint-disable-next-line
    private onMouseDown(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    }

    private keyUpQT(e: KeyboardEvent): void {
        if (e.which === 27) {
            this.hideQuickToolbars();
        }
    }

    private renderQuickToolbars(): void {
        if (this.linkQTBar || this.imageQTBar || this.audioQTBar || this.videoQTBar || this.textQTBar || this.tableQTBar) {
            return;
        }
        if (this.parent.quickToolbarSettings.link && this.parent.quickToolbarSettings.link.length > 0) {
            this.linkQTBar = this.createQTBar('Link', 'Scrollable', this.parent.quickToolbarSettings.link, RenderType.LinkToolbar);
        }
        if (!isNOU(this.parent.quickToolbarSettings.text) && !this.parent.inlineMode.enable) {
            this.textQTBar = this.createQTBar('Text', 'MultiRow', this.parent.quickToolbarSettings.text, RenderType.TextToolbar);
        }
        if (this.parent.quickToolbarSettings.image && this.parent.quickToolbarSettings.image.length > 0) {
            this.imageQTBar = this.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        }
        if (this.parent.quickToolbarSettings.audio && this.parent.quickToolbarSettings.audio.length > 0) {
            this.audioQTBar = this.createQTBar('Audio', 'MultiRow', this.parent.quickToolbarSettings.audio, RenderType.AudioToolbar);
        }
        if (this.parent.quickToolbarSettings.video && this.parent.quickToolbarSettings.video.length > 0) {
            this.videoQTBar = this.createQTBar('Video', 'MultiRow', this.parent.quickToolbarSettings.video, RenderType.VideoToolbar);
        }
        if (this.parent.quickToolbarSettings.table && this.parent.quickToolbarSettings.table.length > 0) {
            this.tableQTBar = this.createQTBar('Table', 'MultiRow', this.parent.quickToolbarSettings.table, RenderType.TableToolbar);
        }
        if (this.linkQTBar) {
            EventHandler.add(this.linkQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.linkQTBar.element, 'keyup', this.keyUpQT, this);
        }
        if (this.imageQTBar) {
            EventHandler.add(this.imageQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.imageQTBar.element, 'keyup', this.keyUpQT, this);
        }
        if (this.audioQTBar) {
            EventHandler.add(this.audioQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.audioQTBar.element, 'keyup', this.keyUpQT, this);
        }
        if (this.videoQTBar) {
            EventHandler.add(this.videoQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.videoQTBar.element, 'keyup', this.keyUpQT, this);
        }
        if (this.textQTBar) {
            EventHandler.add(this.textQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.textQTBar.element, 'keyup', this.keyUpQT, this);
        }
        if (this.tableQTBar) {
            EventHandler.add(this.tableQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.tableQTBar.element, 'keyup', this.keyUpQT, this);
        }
    }

    private renderInlineQuickToolbar(): void {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.inlineQTBar = this.createQTBar('Inline', 'MultiRow', this.parent.toolbarSettings.items, RenderType.InlineToolbar);
            EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.inlineQTBar.element, 'keyup', this.keyUpQT, this);
        }
    }

    /**
     * Method for showing the inline quick toolbar
     *
     * @param {number} x -specifies the value of x.
     * @param {number} y - specifies the y valu.
     * @param {HTMLElement} target - specifies the target element.
     * @param {KeyboardEvent | MouseEvent} originalEvent - specifies the original event.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public showInlineQTBar(x: number, y: number, target: HTMLElement, originalEvent?: KeyboardEvent | MouseEvent): void {
        if (target.nodeName === 'HTML' || target.nodeName === '#document') {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            target = range.commonAncestorContainer.parentElement;
        }
        if (isNOU(this.parent) || this.parent.readonly || target.tagName.toLowerCase() === 'img' || this.inlineQTBar.element.querySelector('.e-rte-color-content')) {
            return;
        }
        this.inlineQTBar.showPopup(target, originalEvent);
    }

    /**
     * Method for hidding the inline quick toolbar
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public hideInlineQTBar(): void {
        if (this.inlineQTBar && this.inlineQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.inlineQTBar.element)) {
            this.inlineQTBar.hidePopup();
        }
        this.escapeKeyPressed = false;
    }

    /**
     * Method for hidding the quick toolbar
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public hideQuickToolbars(): void {
        if (this.linkQTBar && this.linkQTBar.element && this.linkQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.linkQTBar.element)) {
            this.linkQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.textQTBar && this.textQTBar.element && this.textQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.textQTBar.element)) {
            this.textQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.imageQTBar && this.imageQTBar.element && this.imageQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.imageQTBar.element)) {
            this.imageQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.audioQTBar && this.audioQTBar.element && this.audioQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.audioQTBar.element)) {
            this.audioQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.videoQTBar && this.videoQTBar.element && this.videoQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.videoQTBar.element)) {
            this.videoQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.tableQTBar && this.tableQTBar.element && this.tableQTBar.element.classList.contains('e-popup-open') && document.body.contains(this.tableQTBar.element)) {
            this.tableQTBar.hidePopup();
        }
        if (!isNOU(this.parent) && this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            this.hideInlineQTBar();
        }
        this.escapeKeyPressed = false;
    }

    private deBounce(x: number, y: number, target: HTMLElement, args: KeyboardEvent | MouseEvent): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => {
            this.showInlineQTBar(x, y, target, args);
        }, this.debounceTimeout);
    }

    private mouseUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            const args: Touch | MouseEvent = (e.args as TouchEvent).touches ?
                (e.args as TouchEvent).changedTouches[0] : e.args as MouseEvent;
            const range: Range = this.parent.getRange();
            let target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
            if (isNullOrUndefined(select('.' + CLS_INLINE_TOOLBAR, document.body))) {
                if (isIDevice() && e.touchData && e.touchData.prevClientX !== e.touchData.clientX
                    && e.touchData.prevClientY !== e.touchData.clientY) {
                    return;
                }
                this.hideInlineQTBar();
                const parentLeft: number = this.parent.element.getBoundingClientRect().left;
                this.offsetX = this.parent.iframeSettings.enable ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                this.offsetY = pageYOffset(args, this.parent.element, this.parent.iframeSettings.enable);
                if (target.nodeName === 'TEXTAREA') {
                    this.showInlineQTBar(this.offsetX, this.offsetY, target, e.args as MouseEvent);
                } else {
                    const closestAnchor: HTMLElement = closest(target, 'a') as HTMLElement;
                    target = closestAnchor ? closestAnchor : target;
                    const startNode: HTMLElement = this.parent.getRange().startContainer.parentElement;
                    const endNode: HTMLElement = this.parent.getRange().endContainer.parentElement;
                    if ((isNOU(closest(startNode, 'A')) || isNOU(closest(endNode, 'A'))) && (!closest(target, 'td,th') || !range.collapsed) &&
                    (target.tagName !== 'IMG' || this.parent.getRange().startOffset !== this.parent.getRange().endOffset)) {
                        const isCursor: boolean = range.startOffset === range.endOffset && range.startContainer === range.endContainer;
                        const isEmptyContentRange: boolean = isCursor && ((range.startContainer.nodeName === 'P' && range.startContainer.childNodes[0].nodeName === 'BR')
                        || (range.startContainer.nodeName === 'DIV' && range.startContainer.childNodes[0].nodeName === 'BR') || (range.startContainer.nodeName === 'BR')
                        || (range.startContainer.nodeName === 'BODY'));
                        if ((this.parent.inlineMode.onSelection && isCursor) ||
                        (!this.parent.inlineMode.onSelection && !isCursor && !isEmptyContentRange)) {
                            return;
                        }
                        this.target = target;
                        this.showInlineQTBar(this.offsetX, this.offsetY, target, e.args as MouseEvent);
                    }
                }
            }
        }
        if (!isNOU(this.textQTBar) && !isNOU(this.parent.quickToolbarSettings.text) && !this.parent.inlineMode.enable ) {
            if (!isNOU(e) && !isNOU(e.name) && e.name === 'sourceCodeMouseDown') {
                return;
            }
            const args: Touch | MouseEvent = (e.args as TouchEvent).touches ?
                (e.args as TouchEvent).changedTouches[0] : e.args as MouseEvent;
            const target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
            this.hideQuickToolbars();
            const parentLeft: number = this.parent.element.getBoundingClientRect().left;
            this.offsetX = this.parent.iframeSettings.enable ? this.parent.element.ownerDocument.documentElement.scrollLeft
                + parentLeft + args.clientX : args.pageX;
            this.offsetY = pageYOffset(args, this.parent.element, this.parent.iframeSettings.enable);
            const range: Range = this.parent.getRange();
            if ((range.endContainer.parentElement.tagName === range.startContainer.parentElement.tagName && (range.startContainer.parentElement.tagName === 'A' && range.endContainer.parentElement.tagName === 'A')) ||
             (target.tagName === 'IMG') || (target.tagName === 'VIDEO' || this.isEmbedVidElem(target)) || (target.tagName === 'AUDIO') || (target.childNodes[0] && target.childNodes[0].nodeType === 1 && (target.childNodes[0 as number] as HTMLElement).classList.contains('e-rte-audio')) ||
             (this.parent.getRange().startOffset === this.parent.getRange().endOffset) || this.hasResizeElement(this.parent.inputElement)) {
                return;
            }
            this.target = target;
            this.textQTBar.showPopup(target, args as MouseEvent);
        }
    }

    private hasResizeElement(target: HTMLElement): boolean {
        if (target && (target.querySelector('.e-img-resize') || target.querySelector('.e-vid-resize'))) {
            return true;
        }
        return false;
    }

    private isEmbedVidElem(target: HTMLElement): boolean {
        if ((target && target.nodeType !== 3 && target.nodeName !== 'BR' && (target.classList && target.classList.contains(CLS_VID_CLICK_ELEM))) ||
        (target && target.nodeName === 'IFRAME')) {
            return true;
        } else {
            return false;
        }
    }

    private keyDownHandler(e: NotifyArgs): void {
        const preventHide: boolean = (e.args as KeyboardEvent).altKey;
        if (this.parent.inlineMode.enable && (e.args as KeyboardEvent).metaKey && (e.args as KeyboardEvent).keyCode === 65) {
            this.showInlineQTBar(this.offsetX, this.offsetY, (e.args as KeyboardEvent).target as HTMLElement, e.args as KeyboardEvent);
            return;
        }
        if (!preventHide) {
            if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
                && !isNullOrUndefined(select('.' + CLS_INLINE_TOOLBAR, document))) {
                this.hideInlineQTBar();
            }
            if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close')) {
                this.textQTBar.hidePopup();
            }
        }
    }

    private inlineQTBarMouseDownHandler(): void {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_TOOLBAR, document))) {
            this.hideInlineQTBar();
        }
        if (!isNOU(this.parent.quickToolbarSettings.text)) {
            if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close') && document.body.contains(this.textQTBar.element)) {
                this.textQTBar.hidePopup();
            }
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
                        if (this.showInlineQTBarTimeOut) {
                            clearTimeout(this.showInlineQTBarTimeOut);
                            this.showInlineQTBarTimeOut = null;
                        }
                        const isRteUnitTesting: boolean = (this.parent.element && this.parent.element.dataset && this.parent.element.dataset.rteUnitTesting === 'true');
                        if (isRteUnitTesting) {
                            this.showInlineQTBar(this.offsetX, this.offsetY, (e.args as KeyboardEvent).target as HTMLElement,
                                                 e.args as KeyboardEvent);
                        } else {
                            this.showInlineQTBarTimeOut = window.setTimeout(() => {
                                this.showInlineQTBar(this.offsetX, this.offsetY, (e.args as KeyboardEvent).target as HTMLElement,
                                                     e.args as KeyboardEvent);
                            }, 600);
                        }
                    }
                }
                return;
            }
            this.deBounce(this.offsetX, this.offsetY, args.target as HTMLElement, e.args as KeyboardEvent);
        }
        if (this.parent.quickToolbarSettings.text && !Browser.isDevice) {
            if ((args.ctrlKey && args.keyCode === 65) || (args.shiftKey && (args.keyCode === 33 || args.keyCode === 34 ||
                args.keyCode === 35 || args.keyCode === 36 || args.keyCode === 37 || args.keyCode === 38 ||
                args.keyCode === 39 || args.keyCode === 40))) {
                this.textQTBar.showPopup(args.target as HTMLElement , args as KeyboardEvent);
            }
        }
    }

    private selectionChangeHandler(e: Event): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => {
            this.onSelectionChange(e);
        }, this.debounceTimeout);
    }

    private onSelectionChange(e: Event): void {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_TOOLBAR, document.body))) {
            return;
        }
        const selection: Selection = this.contentRenderer.getDocument().getSelection();
        if (!selection.isCollapsed) {
            this.mouseUpHandler({ args: e as MouseEvent });
        }
    }

    /**
     * getInlineBaseToolbar method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getInlineBaseToolbar(): BaseToolbar {
        return this.inlineQTBar && this.inlineQTBar.quickTBarObj;
    }

    /**
     * Destroys the ToolBar.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.linkQTBar && !this.linkQTBar.isDestroyed) {
            EventHandler.remove(this.linkQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.linkQTBar.element, 'keyup', this.keyUpQT);
            this.linkQTBar.destroy();
        }
        if (this.textQTBar && !this.textQTBar.isDestroyed) {
            EventHandler.remove(this.textQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.textQTBar.element, 'keyup', this.keyUpQT);
            this.textQTBar.destroy();
        }
        if (this.imageQTBar && !this.imageQTBar.isDestroyed) {
            EventHandler.remove(this.imageQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.imageQTBar.element, 'keyup', this.keyUpQT);
            this.imageQTBar.destroy();
        }
        if (this.audioQTBar && !this.audioQTBar.isDestroyed) {
            EventHandler.remove(this.audioQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.audioQTBar.element, 'keyup', this.keyUpQT);
            this.audioQTBar.destroy();
        }
        if (this.videoQTBar && !this.videoQTBar.isDestroyed) {
            EventHandler.remove(this.videoQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.videoQTBar.element, 'keyup', this.keyUpQT);
            this.videoQTBar.destroy();
        }
        if (this.tableQTBar && !this.tableQTBar.isDestroyed) {
            EventHandler.remove(this.tableQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.tableQTBar.element, 'keyup', this.keyUpQT);
            this.tableQTBar.destroy();
        }
        if (this.inlineQTBar && !this.inlineQTBar.isDestroyed ) {
            EventHandler.remove(this.inlineQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.inlineQTBar.element, 'keyup', this.keyUpQT);
            if (isIDevice()) {
                EventHandler.remove(document, 'selectionchange', this.selectionChangeHandler);
            }
            this.inlineQTBar.destroy();
        }
        this.removeEventListener();
        this.isDestroyed = true;
    }

    private wireInlineQTBarEvents(): void {
        this.parent.on(events.mouseUp, this.mouseUpHandler, this);
        this.parent.on(events.mouseDown, this.inlineQTBarMouseDownHandler, this);
        this.parent.on(events.keyDown, this.keyDownHandler, this);
        this.parent.on(events.keyUp, this.keyUpHandler, this);
        this.parent.on(events.sourceCodeMouseDown, this.mouseUpHandler, this);
        this.parent.on(events.renderInlineToolbar, this.renderInlineQuickToolbar, this);
    }

    private unWireInlineQTBarEvents(): void {
        this.parent.off(events.mouseUp, this.mouseUpHandler);
        this.parent.off(events.mouseDown, this.inlineQTBarMouseDownHandler);
        this.parent.off(events.keyDown, this.keyDownHandler);
        this.parent.off(events.keyUp, this.keyUpHandler);
        this.parent.off(events.sourceCodeMouseDown, this.mouseUpHandler);
        this.parent.off(events.renderInlineToolbar, this.renderInlineQuickToolbar);
    }
    // eslint-disable-next-line
    private toolbarUpdated(args: NotifyArgs): void {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) {
            this.linkQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
            this.imageQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.audioQTBar && !hasClass(this.audioQTBar.element, 'e-popup-close')) {
            this.audioQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.videoQTBar && !hasClass(this.videoQTBar.element, 'e-popup-close')) {
            this.videoQTBar.hidePopup();
        }
        if (!this.escapeKeyPressed && this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) {
            this.tableQTBar.hidePopup();
        }
        this.escapeKeyPressed = false;
    }
    /**
     * addEventListener
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.initializeQuickToolbars, this);
        this.parent.on(events.mouseDown, this.renderQuickToolbars, this);
        this.parent.on(events.toolbarUpdated, this.toolbarUpdated, this);
        this.parent.on(events.drop, this.renderQuickToolbars, this);
        this.wireInlineQTBarEvents();
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.on(events.scroll, this.hideQuickToolbars, this);
            this.parent.on(events.contentscroll, this.hideQuickToolbars, this);
        } else {
            this.parent.on(events.scroll, this.onScroll, this);
            this.parent.on(events.contentscroll, this.onScroll, this);
        }
        this.parent.on(events.focusChange, this.hideQuickToolbars, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.hidePopup, this.hideQuickToolbars, this);
        this.parent.on(events.renderQuickToolbar, this.renderQuickToolbars, this);
        this.parent.on(events.preventQuickToolbarClose, this.preventQuickToolbarClose, this);
        this.parent.on(events.windowResize, this.onWindowResize, this);
        this.parent.on(events.selectionChangeMouseUp, this.mouseUpHandler, this);
    }
    private preventQuickToolbarClose(args: BeforeOpenCloseMenuEventArgs): void {
        const editorBaseId: string = this.parent.getID();
        const dropDownPopup: string[] = [editorBaseId + '_quick_Display-popup', editorBaseId + '_quick_Align-popup',
            editorBaseId + '_quick_VideoLayoutOption-popup', editorBaseId + '_quick_VideoAlign-popup',
            editorBaseId + '_quick_TableRows-popup', editorBaseId + '_quick_TableColumns-popup', editorBaseId + '_quick_TableCell-popup', editorBaseId + '_quick_TableCellVerticalAlign-popup', editorBaseId + '_quick_Styles-popup', editorBaseId + '_quick_Alignments-popup', editorBaseId + '_quick_BackgroundColor-popup',
            editorBaseId + '_quick_AudioLayoutOption-popup', editorBaseId + '_quick_FontSize-popup', editorBaseId + '_quick_FontName-popup', editorBaseId + '_quick_FontColor-popup', editorBaseId + '_quick_BackgroundColor-popup',
            editorBaseId + '_quick_Formats-popup', editorBaseId + '_quick_Alignments-popup', editorBaseId + '_quick_NumberFormatList-popup', editorBaseId + '_quick_BulletFormatList-popup'];
        if (!isNOU(args.element) && !isNOU(args.element.parentElement) && dropDownPopup.indexOf(args.element.parentElement.id) > -1) {
            this.escapeKeyPressed = true;
        }
    }
    private onKeyDown(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
                this.imageQTBar.hidePopup();
            }
            if (this.audioQTBar && !hasClass(this.audioQTBar.element, 'e-popup-close')) {
                this.audioQTBar.hidePopup();
            }
            if (this.videoQTBar && !hasClass(this.videoQTBar.element, 'e-popup-close')) {
                this.videoQTBar.hidePopup();
            }
            if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) {
                this.tableQTBar.hidePopup();
            }
            if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) {
                this.linkQTBar.hidePopup();
            }
            if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close')) {
                this.textQTBar.hidePopup();
            }
        }
    }

    private onIframeMouseDown(): void {
        this.hideQuickToolbars();
        this.hideInlineQTBar();
    }

    private updateCss(baseQTObj: BaseQuickToolbar, e: ICssClassArgs) : void {
        if (baseQTObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass && baseQTObj.quickTBarObj.toolbarObj.cssClass !== e.cssClass)) {
                baseQTObj.quickTBarObj.toolbarObj.setProperties({ cssClass: (baseQTObj.quickTBarObj.toolbarObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                baseQTObj.quickTBarObj.toolbarObj.setProperties({ cssClass: (baseQTObj.quickTBarObj.toolbarObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    private setCssClass(e: ICssClassArgs): void {
        const baseQuickToolbarObj: BaseQuickToolbar[] = [
            this.inlineQTBar, this.imageQTBar, this.linkQTBar, this.textQTBar, this.tableQTBar
        ];
        for (let i: number = 0; i < baseQuickToolbarObj.length; i++) {
            this.updateCss(baseQuickToolbarObj[i as number], e);
        }
    }
    private setRtl(args: { [key: string]: Object }): void {
        if (this.inlineQTBar) {
            this.inlineQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.audioQTBar) {
            this.audioQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.videoQTBar) {
            this.videoQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.linkQTBar) {
            this.linkQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.textQTBar) {
            this.textQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    }
    /**
     * removeEventListener
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public removeEventListener(): void {
        if (this.deBouncer) {
            clearTimeout(this.deBouncer);
            this.deBouncer = null;
        }
        this.parent.off(events.initialEnd, this.initializeQuickToolbars);
        this.parent.off(events.mouseDown, this.renderQuickToolbars);
        this.parent.off(events.toolbarUpdated, this.toolbarUpdated);
        this.parent.off(events.drop, this.renderQuickToolbars);
        this.unWireInlineQTBarEvents();
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.off(events.scroll, this.hideQuickToolbars);
            this.parent.off(events.contentscroll, this.hideQuickToolbars);
        } else {
            this.parent.off(events.scroll, this.onScroll);
            this.parent.off(events.contentscroll, this.onScroll);
        }
        this.parent.off(events.focusChange, this.hideQuickToolbars);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.hidePopup, this.hideQuickToolbars);
        this.parent.off(events.renderQuickToolbar, this.renderQuickToolbars);
        this.parent.off(events.preventQuickToolbarClose, this.preventQuickToolbarClose);
        this.parent.off(events.windowResize, this.onWindowResize);
        this.parent.off(events.selectionChangeMouseUp, this.mouseUpHandler);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {RichTextEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    protected onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        if (!isNullOrUndefined(e.newProp.quickToolbarSettings)) {
            for (const prop of Object.keys(e.newProp.quickToolbarSettings)) {
                switch (prop) {
                case 'actionOnScroll':
                    if (e.newProp.quickToolbarSettings.actionOnScroll === 'none') {
                        this.parent.on(events.scroll, this.onScroll);
                        this.parent.on(events.contentscroll, this.onScroll);
                        this.parent.off(events.scroll, this.hideQuickToolbars);
                        this.parent.off(events.contentscroll, this.hideQuickToolbars);
                    } else {
                        this.parent.on(events.scroll, this.hideQuickToolbars, this);
                        this.parent.on(events.contentscroll, this.hideQuickToolbars, this);
                        this.parent.off(events.scroll, this.onScroll);
                        this.parent.off(events.contentscroll, this.onScroll);
                    }
                    break;
                case 'text':
                    this.refreshTextQTBar();
                    break;
                case 'image':
                    this.refreshImageQTbar();
                    break;
                case 'audio':
                    this.refreshAudioQTbar();
                    break;
                case 'video':
                    this.refreshVideoQTbar();
                    break;
                case 'link':
                    this.refreshLinkQTbar();
                    break;
                case 'table':
                    this.refreshTableQTbar();
                    break;
                }
            }
        }
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (this.inlineQTBar) {
            removeClass([this.parent.element], [CLS_INLINE]);
            this.unWireInlineQTBarEvents();
            this.hideInlineQTBar();
        }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            addClass([this.parent.element], [CLS_INLINE]);
            this.wireInlineQTBarEvents();
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'quickToolbar';
    }

    /**
     *
     * @returns {BaseQuickToolbar[]} - specifies the quick toolbar instance.
     * @hidden
     * @private
     */
    public getQuickToolbarInstance(): BaseQuickToolbar[] {
        return [this.linkQTBar, this.imageQTBar, this.audioQTBar, this.videoQTBar, this.tableQTBar, this.textQTBar, this.inlineQTBar];
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
                // update previous status
                if (this.parent.quickToolbarSettings.text || (this.parent.quickToolbarModule.inlineQTBar &&
                    this.parent.quickToolbarModule.inlineQTBar.isRendered)) {
                    const previousStatus: IToolbarStatus = quickToolbar.getPreviousStatus();
                    if (previousStatus) {
                        quickToolbar.updateStatus(previousStatus);
                    }
                }
            }
        }
    }

    private onWindowResize(e: NotifyArgs): void {
        if (!isNOU(e.args)) {
            this.refreshQuickToolbarPopup(e.args as MouseEvent);
        }
    }

    // This method called when the text quicktoolbar properties got changed
    private refreshTextQTBar(): void {
        if (this.parent.quickToolbarSettings.enable) {
            if (this.textQTBar) {
                this.textQTBar.destroy();
            }
            if (this.parent.quickToolbarSettings.text && this.parent.quickToolbarSettings.text.length > 0 &&
                !this.parent.inlineMode.enable) {
                this.textQTBar = this.createQTBar('Text', 'MultiRow', this.parent.quickToolbarSettings.text, RenderType.TextToolbar);
            }
        }
    }

    // This method called when the image quicktoolbar properties got changed
    private refreshImageQTbar(): void {
        if (this.parent.quickToolbarSettings.enable) {
            if (this.imageQTBar) {
                this.imageQTBar.destroy();
            }
            if (this.parent.quickToolbarSettings.image && this.parent.quickToolbarSettings.image.length > 0) {
                this.imageQTBar = this.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
            }
        }
    }

    // This method called when the audio quicktoolbar properties got changed
    private refreshAudioQTbar(): void {
        if (this.parent.quickToolbarSettings.enable) {
            if (this.audioQTBar) {
                this.audioQTBar.destroy();
            }
            if (this.parent.quickToolbarSettings.audio && this.parent.quickToolbarSettings.audio.length > 0) {
                this.audioQTBar = this.createQTBar('Audio', 'MultiRow', this.parent.quickToolbarSettings.audio, RenderType.AudioToolbar);
            }
        }
    }

    // This method called when the video quicktoolbar properties got changed
    private refreshVideoQTbar(): void {
        if (this.parent.quickToolbarSettings.enable) {
            if (this.videoQTBar) {
                this.videoQTBar.destroy();
            }
            if (this.parent.quickToolbarSettings.video && this.parent.quickToolbarSettings.video.length > 0) {
                this.videoQTBar = this.createQTBar('Video', 'MultiRow', this.parent.quickToolbarSettings.video, RenderType.VideoToolbar);
            }
        }
    }

    // This method called when the Link quicktoolbar properties got changed
    private refreshLinkQTbar(): void {
        if (this.parent.quickToolbarSettings.enable) {
            if (this.linkQTBar) {
                this.linkQTBar.destroy();
            }
            if (this.parent.quickToolbarSettings.link && this.parent.quickToolbarSettings.link.length > 0) {
                this.linkQTBar = this.createQTBar('Link', 'Scrollable', this.parent.quickToolbarSettings.link, RenderType.LinkToolbar);
            }
        }
    }

    // This method called when the table quicktoolbar properties got changed
    private refreshTableQTbar(): void {
        if (this.parent.quickToolbarSettings.enable) {
            if (this.tableQTBar) {
                this.tableQTBar.destroy();
            }
            if (this.parent.quickToolbarSettings.table && this.parent.quickToolbarSettings.table.length > 0) {
                this.tableQTBar = this.createQTBar('Table', 'MultiRow', this.parent.quickToolbarSettings.table, RenderType.TableToolbar);
            }
        }
    }
}
