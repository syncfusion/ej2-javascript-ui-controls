import { select, isNullOrUndefined, Browser, addClass, removeClass, EventHandler, closest, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import { pageYOffset, hasClass, isIDevice } from '../base/util';
import { IRichTextEditor, IQuickToolbarOptions, IRenderer, IToolbarItems, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { BaseToolbar } from './base-toolbar';
import { PopupRenderer } from '../renderer/popup-renderer';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { CLS_INLINE_POP, CLS_INLINE } from '../base/classes';

/**
 * `Quick toolbar` module is used to handle Quick toolbar actions.
 */
export class QuickToolbar {
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
    public tableQTBar: BaseQuickToolbar;
    public inlineQTBar: BaseQuickToolbar;
    private renderFactory: RendererFactory;

    public constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.renderFactory.addRenderer(RenderType.Popup, new PopupRenderer(this.parent));
        this.addEventListener();
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
            renderType: type
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
    public createQTBar(popupType: string, mode: string, items: (string | IToolbarItems)[], type: RenderType): BaseQuickToolbar {
        if (items.length < 1) {
            return null;
        }
        const qTBar: BaseQuickToolbar = new BaseQuickToolbar(this.parent, this.locator);
        qTBar.render(this.getQTBarOptions(popupType, mode, this.formatItems(items), type));
        return qTBar;
    }

    private initializeQuickToolbars(): void {
        this.parent.quickToolbarModule = this;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
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
        if(e.which == 27) {
            this.hideQuickToolbars();
        }
        
    }

    private renderQuickToolbars(): void {
        if (this.linkQTBar || this.imageQTBar || this.textQTBar || this.tableQTBar) {
            return;
        }
        this.linkQTBar = this.createQTBar('Link', 'Scrollable', this.parent.quickToolbarSettings.link, RenderType.LinkToolbar);
        this.renderFactory.addRenderer(RenderType.LinkToolbar, this.linkQTBar);
        this.textQTBar = this.createQTBar('Text', 'Scrollable', this.parent.quickToolbarSettings.text, RenderType.TextToolbar);
        this.renderFactory.addRenderer(RenderType.TextToolbar, this.textQTBar);
        this.imageQTBar = this.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        this.renderFactory.addRenderer(RenderType.ImageToolbar, this.imageQTBar);
        this.tableQTBar = this.createQTBar('Table', 'MultiRow', this.parent.quickToolbarSettings.table, RenderType.TableToolbar);
        this.renderFactory.addRenderer(RenderType.TableToolbar, this.tableQTBar);
        if (this.linkQTBar) {
            EventHandler.add(this.linkQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.linkQTBar.element, 'keyup', this.keyUpQT, this);
        }
        if (this.imageQTBar) {
            EventHandler.add(this.imageQTBar.element, 'mousedown', this.onMouseDown, this);
            EventHandler.add(this.imageQTBar.element, 'keyup', this.keyUpQT, this);
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
            this.renderFactory.addRenderer(RenderType.InlineToolbar, this.inlineQTBar);
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
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public showInlineQTBar(x: number, y: number, target: HTMLElement): void {
        if (this.parent.readonly || target.tagName.toLowerCase() === "img") {
            return;
        }
        this.inlineQTBar.showPopup(x, y, target);
    }

    /**
     * Method for hidding the inline quick toolbar
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public hideInlineQTBar(): void {
        if (this.inlineQTBar && !hasClass(this.inlineQTBar.element, 'e-popup-close')) {
            this.inlineQTBar.hidePopup();
        }
    }

    /**
     * Method for hidding the quick toolbar
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public hideQuickToolbars(): void {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close') && document.body.contains(this.linkQTBar.element)) {
            this.linkQTBar.hidePopup();
        }
        if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close') && document.body.contains(this.textQTBar.element)) {
            this.textQTBar.hidePopup();
        }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close') && document.body.contains(this.imageQTBar.element)) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close') && document.body.contains(this.tableQTBar.element)) {
            this.tableQTBar.hidePopup();
        }
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            this.hideInlineQTBar();
        }
    }

    private deBounce(x: number, y: number, target: HTMLElement): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => {
            this.showInlineQTBar(x, y, target);
        }, 1000);
    }

    private mouseUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            const args: Touch | MouseEvent = (e.args as TouchEvent).touches ?
                (e.args as TouchEvent).changedTouches[0] : e.args as MouseEvent;
            const range: Range = this.parent.getRange();
            let target: HTMLElement = (e.args as MouseEvent).target as HTMLElement;
            if (isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
                if (isIDevice() && e.touchData && e.touchData.prevClientX !== e.touchData.clientX
                    && e.touchData.prevClientY !== e.touchData.clientY) {
                    return;
                }
                this.hideInlineQTBar();
                const parentLeft: number = this.parent.element.getBoundingClientRect().left;
                this.offsetX = this.parent.iframeSettings.enable ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                this.offsetY = pageYOffset(args, this.parent.element, this.parent.iframeSettings.enable);
                if (target.nodeName === 'TEXTAREA') {
                    this.showInlineQTBar(this.offsetX, this.offsetY, target);
                } else {
                    const closestAnchor: HTMLElement = closest(target, 'a') as HTMLElement;
                    target = closestAnchor ? closestAnchor : target;
                    const startNode: HTMLElement = this.parent.getRange().startContainer.parentElement;
                    const endNode: HTMLElement = this.parent.getRange().endContainer.parentElement;
                    if ((isNOU(closest(startNode, 'A')) || isNOU(closest(endNode, 'A'))) && (!closest(target, 'td,th') || !range.collapsed) &&
                    (target.tagName !== 'IMG' || this.parent.getRange().startOffset !== this.parent.getRange().endOffset)) {
                        if (this.parent.inlineMode.onSelection && range.collapsed) {
                            return;
                        }
                        this.target = target;
                        this.showInlineQTBar(this.offsetX, this.offsetY, target);
                    }
                }
            }
        }
    }

    private keyDownHandler(): void {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    }

    private inlineQTBarMouseDownHandler(): void {
        if ((this.parent.inlineMode.enable && (!Browser.isDevice || isIDevice()))
            && !isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    }

    private keyUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            if (this.parent.inlineMode.onSelection) {
                return;
            }
            const args: KeyboardEvent = e.args as KeyboardEvent;
            this.deBounce(this.offsetX, this.offsetY, args.target as HTMLElement);
        }
    }

    private selectionChangeHandler(e: Event): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => {
            this.onSelectionChange(e);
        }, 1000);
    }

    private onSelectionChange(e: Event): void {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
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
        if (this.linkQTBar) {
            EventHandler.remove(this.linkQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.linkQTBar.element, 'keyup', this.keyUpQT);
            this.linkQTBar.destroy();
        }
        if (this.textQTBar) {
            EventHandler.remove(this.textQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.textQTBar.element, 'keyup', this.keyUpQT);
            this.textQTBar.destroy();
        }
        if (this.imageQTBar) {
            EventHandler.remove(this.imageQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.imageQTBar.element, 'keyup', this.keyUpQT);
            this.imageQTBar.destroy();
        }
        if (this.tableQTBar) {
            EventHandler.remove(this.tableQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.tableQTBar.element, 'keyup', this.keyUpQT);
            this.tableQTBar.destroy();
        }
        if (this.inlineQTBar) {
            EventHandler.remove(this.inlineQTBar.element, 'mousedown', this.onMouseDown);
            EventHandler.remove(this.inlineQTBar.element, 'keyup', this.keyUpQT);
            if (isIDevice()) {
                EventHandler.remove(document, 'selectionchange', this.selectionChangeHandler);
            }
            this.inlineQTBar.destroy();
        }
        this.removeEventListener();
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
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
            this.imageQTBar.hidePopup();
        }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) {
            this.tableQTBar.hidePopup();
        }
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
        }
        this.parent.on(events.focusChange, this.hideQuickToolbars, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
    }

    private onKeyDown(e: NotifyArgs): void {
        const args: KeyboardEvent = e.args as KeyboardEvent;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) {
                this.imageQTBar.hidePopup();
            }
        }
    }

    private onIframeMouseDown(): void {
        this.hideQuickToolbars();
        this.hideInlineQTBar();
    }
    private setRtl(args: { [key: string]: Object }): void {
        if (this.inlineQTBar) {
            this.inlineQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.imageQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.linkQTBar) {
            this.imageQTBar.quickTBarObj.toolbarObj.setProperties({ enableRtl: args.enableRtl });
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
        if (this.parent.isDestroyed) {
            return;
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
        }
        this.parent.off(events.focusChange, this.hideQuickToolbars);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.rtlMode, this.setRtl);
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
                        this.parent.off(events.scroll, this.hideQuickToolbars);
                        this.parent.off(events.contentscroll, this.hideQuickToolbars);
                    } else {
                        this.parent.on(events.scroll, this.hideQuickToolbars, this);
                        this.parent.on(events.contentscroll, this.hideQuickToolbars, this);
                    }
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
}
