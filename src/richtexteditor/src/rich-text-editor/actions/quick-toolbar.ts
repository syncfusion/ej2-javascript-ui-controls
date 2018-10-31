import { select, isNullOrUndefined, Browser, addClass, removeClass, EventHandler, closest } from '@syncfusion/ej2-base';
import { OverflowMode } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import { pageYOffset, hasClass } from '../base/util';
import { IRichTextEditor, IQuickToolbarOptions, IRenderer, IToolbarItems, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { BaseQuickToolbar } from './base-quick-toolbar';
import { BaseToolbar } from './base-toolbar';
import { PopupRenderer } from '../renderer/popup-renderer';
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

    constructor(parent?: IRichTextEditor, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.renderFactory.addRenderer(RenderType.Popup, new PopupRenderer(this.parent));
        this.addEventListener();
    }

    private formatItems(items: (string | IToolbarItems)[]): (string | IToolbarItems)[] {
        let formattedItems: (string | IToolbarItems)[] = [];
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

    public createQTBar(popupType: string, mode: string, items: (string | IToolbarItems)[], type: RenderType): BaseQuickToolbar {
        if (items.length < 1) { return null; }
        let qTBar: BaseQuickToolbar = new BaseQuickToolbar(this.parent, this.locator);
        qTBar.render(this.getQTBarOptions(popupType, mode, this.formatItems(items), type));
        return qTBar;
    }

    private initializeQuickToolbars(): void {
        this.parent.quickToolbarModule = this;
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
    }

    private onMouseDown(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.parent.isRTE = true;
    }

    private renderQuickToolbars(): void {
        if (this.linkQTBar || this.imageQTBar || this.textQTBar || this.tableQTBar) { return; }
        this.linkQTBar = this.createQTBar('Link', 'Scrollable', this.parent.quickToolbarSettings.link, RenderType.LinkToolbar);
        this.renderFactory.addRenderer(RenderType.LinkToolbar, this.linkQTBar);
        this.textQTBar = this.createQTBar('Text', 'Scrollable', this.parent.quickToolbarSettings.text, RenderType.TextToolbar);
        this.renderFactory.addRenderer(RenderType.TextToolbar, this.textQTBar);
        this.imageQTBar = this.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        this.renderFactory.addRenderer(RenderType.ImageToolbar, this.imageQTBar);
        this.tableQTBar = this.createQTBar('Table', 'MultiRow', this.parent.quickToolbarSettings.table, RenderType.TableToolbar);
        this.renderFactory.addRenderer(RenderType.TableToolbar, this.tableQTBar);
        if (this.linkQTBar) { EventHandler.add(this.linkQTBar.element, 'mousedown', this.onMouseDown, this); }
        if (this.imageQTBar) { EventHandler.add(this.imageQTBar.element, 'mousedown', this.onMouseDown, this); }
        if (this.textQTBar) { EventHandler.add(this.textQTBar.element, 'mousedown', this.onMouseDown, this); }
        if (this.tableQTBar) { EventHandler.add(this.tableQTBar.element, 'mousedown', this.onMouseDown, this); }
    }

    private renderInlineQuickToolbar(): void {
        addClass([this.parent.element], [CLS_INLINE]);
        this.inlineQTBar = this.createQTBar('Inline', 'MultiRow', this.parent.toolbarSettings.items, RenderType.InlineToolbar);
        this.renderFactory.addRenderer(RenderType.InlineToolbar, this.inlineQTBar);
        EventHandler.add(this.inlineQTBar.element, 'mousedown', this.onMouseDown, this);
    }

    private showInlineQTBar(x: number, y: number, target: HTMLElement): void {
        this.inlineQTBar.showPopup(x, y, target);
    }

    private hideInlineQTBar(): void {
        if (this.inlineQTBar && !hasClass(this.inlineQTBar.element, 'e-popup-close')) { this.inlineQTBar.hidePopup(); }
    }

    private hideQuickToolbars(): void {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) { this.linkQTBar.hidePopup(); }
        if (this.textQTBar && !hasClass(this.textQTBar.element, 'e-popup-close')) { this.textQTBar.hidePopup(); }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) { this.imageQTBar.hidePopup(); }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) { this.tableQTBar.hidePopup(); }
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            this.hideInlineQTBar();
        }
    }

    private deBounce(x: number, y: number, target: HTMLElement): void {
        clearTimeout(this.deBouncer);
        this.deBouncer = window.setTimeout(() => { this.showInlineQTBar(x, y, target); }, 1000);
    }

    private mouseUpHandler(e: NotifyArgs): void {
        let args: MouseEvent = e.args as MouseEvent;
        let range: Range = this.parent.getRange();
        let target: HTMLElement = args.target as HTMLElement;
        if (isNullOrUndefined(select('.' + CLS_INLINE_POP, document.body))) {
            this.hideInlineQTBar();
            this.offsetX = args.pageX;
            this.offsetY = pageYOffset(args, this.parent.element, this.parent.iframeSettings.enable);
            if (target.nodeName === 'TEXTAREA') {
                this.showInlineQTBar(this.offsetX, this.offsetY, target);
            } else {
                if (target.tagName !== 'IMG' && target.tagName !== 'A' && (!closest(target, 'td,th') || !range.collapsed)) {
                    if (this.parent.inlineMode.onSelection && range.collapsed) { return; }
                    this.target = target;
                    this.showInlineQTBar(this.offsetX, this.offsetY, target);
                }
            }
        }
    }

    private keyDownHandler(): void {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    }

    private inlineQTBarMouseDownHandler(): void {
        if (!isNullOrUndefined(select('.' + CLS_INLINE_POP, document))) {
            this.hideInlineQTBar();
        }
    }

    private keyUpHandler(e: NotifyArgs): void {
        if (this.parent.inlineMode.onSelection) { return; }
        let args: KeyboardEvent = e.args as KeyboardEvent;
        this.deBounce(this.offsetX, this.offsetY, args.target as HTMLElement);
    }

    public getInlineBaseToolbar(): BaseToolbar {
        return this.inlineQTBar && this.inlineQTBar.quickTBarObj;
    }

    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.linkQTBar) {
            EventHandler.remove(this.linkQTBar.element, 'mousedown', this.onMouseDown);
            this.linkQTBar.destroy();
        }
        if (this.textQTBar) {
            EventHandler.remove(this.textQTBar.element, 'mousedown', this.onMouseDown);
            this.textQTBar.destroy();
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
    private toolbarUpdated(args: NotifyArgs): void {
        if (this.linkQTBar && !hasClass(this.linkQTBar.element, 'e-popup-close')) { this.linkQTBar.hidePopup(); }
        if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) { this.imageQTBar.hidePopup(); }
        if (this.tableQTBar && !hasClass(this.tableQTBar.element, 'e-popup-close')) { this.tableQTBar.hidePopup(); }
    }
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.initializeQuickToolbars, this);
        this.parent.on(events.mouseDown, this.renderQuickToolbars, this);
        this.parent.on(events.toolbarUpdated, this.toolbarUpdated, this);
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            this.wireInlineQTBarEvents();
        }
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.on(events.scroll, this.hideQuickToolbars, this);
        }
        this.parent.on(events.focusChange, this.hideQuickToolbars, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
    }

    private onKeyDown(e: NotifyArgs): void {
        let args: KeyboardEvent = e.args as KeyboardEvent;
        if (args.which === 8 || args.which === 46) {
            if (this.imageQTBar && !hasClass(this.imageQTBar.element, 'e-popup-close')) { this.imageQTBar.hidePopup(); }
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
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.initializeQuickToolbars);
        this.parent.off(events.mouseDown, this.renderQuickToolbars);
        this.parent.off(events.toolbarUpdated, this.toolbarUpdated);
        if (this.parent.inlineMode.enable && !Browser.isDevice) {
            this.unWireInlineQTBarEvents();
        }
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        if (this.parent.quickToolbarSettings.actionOnScroll === 'hide') {
            this.parent.off(events.scroll, this.hideQuickToolbars);
        }
        this.parent.off(events.focusChange, this.hideQuickToolbars);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.rtlMode, this.setRtl);
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    protected onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) { return; }
        if (this.inlineQTBar) {
            removeClass([this.parent.element], [CLS_INLINE]);
            this.unWireInlineQTBarEvents();
            this.hideInlineQTBar();
            if (this.parent.inlineMode.enable && !Browser.isDevice) {
                addClass([this.parent.element], [CLS_INLINE]);
                this.wireInlineQTBarEvents();
            }
        }
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'quickToolbar';
    }
}