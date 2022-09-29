import { addClass, Browser, EventHandler, detach, removeClass, select, selectAll, KeyboardEvents} from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, KeyboardEventArgs, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { setStyleAttribute, extend } from '@syncfusion/ej2-base';
import { Toolbar as tool, OverflowMode, ClickEventArgs } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RenderType, ToolbarType, ToolbarItems } from '../base/enum';
import { setToolbarStatus, updateUndoRedoStatus, getTBarItemsIndex, getCollection, toObjectLowerCase, isIDevice } from '../base/util';
import { updateDropDownFontFormatLocale } from '../base/util';
import * as model from '../models/items';
import { IRichTextEditor, IRenderer, NotifyArgs, IToolbarRenderOptions, IColorPickerRenderArgs, ICssClassArgs } from '../base/interface';
import { IToolbarItemModel, IToolsItems, IUpdateItemsModel, IDropDownRenderArgs, ISetToolbarStatusArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { ToolbarRenderer } from '../renderer/toolbar-renderer';
import { BaseToolbar } from './base-toolbar';
import { DropDownButtons } from './dropdown-buttons';
import { ToolbarAction } from './toolbar-action';
import { IToolbarStatus } from '../../common/interface';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class Toolbar {
    public toolbarObj: tool;
    private editPanel: Element;
    private isToolbar: boolean;
    private editableElement: Element;
    private tbItems: HTMLElement[];
    public baseToolbar: BaseToolbar;
    private tbElement: HTMLElement;
    private tbWrapper: HTMLElement;
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    private isTransformChild: boolean;
    private contentRenderer: IRenderer;
    protected toolbarRenderer: IRenderer;
    private dropDownModule: DropDownButtons;
    private toolbarActionModule: ToolbarAction;
    protected renderFactory: RendererFactory;
    private keyBoardModule: KeyboardEvents;
    private tools: { [key: string]: IToolsItems };

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.isToolbar = false;
        this.locator = serviceLocator;
        this.isTransformChild = false;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        model.updateDropDownLocale(this.parent);
        updateDropDownFontFormatLocale(this.parent);
        this.renderFactory.addRenderer(RenderType.Toolbar, new ToolbarRenderer(this.parent));
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        this.baseToolbar = new BaseToolbar(this.parent, this.locator);
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, model.tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        } else {
            this.tools = model.tools;
        }
    }

    private initializeInstance(): void {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        this.editableElement = this.contentRenderer.getEditPanel();
        this.editPanel = this.contentRenderer.getPanel();
    }
    private toolbarBindEvent(): void {
        if (!this.parent.inlineMode.enable) {
            this.keyBoardModule = new KeyboardEvents(this.getToolbarElement() as HTMLElement, {
                keyAction: this.toolBarKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
        }
    }
    private toolBarKeyDown(e: KeyboardEvent): void {
        switch ((e as KeyboardEventArgs).action) {
        case 'escape':
            (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
            break;
        }
    }
    private createToolbarElement(): void {
        this.tbElement = this.parent.createElement('div', { id: this.parent.getID() + '_toolbar' });
        if (!Browser.isDevice && this.parent.inlineMode.enable && isIDevice()) {
            return;
        } else {
            if (this.parent.toolbarSettings.enableFloating && !this.parent.inlineMode.enable) {
                this.tbWrapper = this.parent.createElement('div', {
                    id: this.parent.getID() + '_toolbar_wrapper',
                    innerHTML: this.tbElement.outerHTML,
                    className: classes.CLS_TB_WRAP
                });
                this.tbElement = this.tbWrapper.firstElementChild as HTMLElement;
                this.parent.element.insertBefore(this.tbWrapper, this.editPanel);
            } else {
                this.parent.element.insertBefore(this.tbElement, this.editPanel);
            }
        }
    }

    private getToolbarMode(): OverflowMode {
        let tbMode: OverflowMode;
        switch (this.parent.toolbarSettings.type) {
        case ToolbarType.Expand:
            tbMode = 'Extended';
            break;
        case ToolbarType.Scrollable:
            tbMode = 'Scrollable';
            break;
        default:
            tbMode = 'MultiRow';
        }
        if (isIDevice() && this.parent.toolbarSettings.type === ToolbarType.Expand) {
            tbMode =  ToolbarType.Scrollable;
        }
        return tbMode;
    }

    private checkToolbarResponsive(ele: HTMLElement): boolean {
        if (!Browser.isDevice || isIDevice()) {
            return false;
        }
        let tBarMode : string;
        if (this.parent.toolbarSettings.type === ToolbarType.Expand) {
            tBarMode = ToolbarType.MultiRow;
        } else {
            tBarMode = this.parent.toolbarSettings.type;
        }
        this.baseToolbar.render({
            container: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'),
            items: this.parent.toolbarSettings.items,
            mode: tBarMode,
            target: ele,
            cssClass: this.parent.cssClass
        } as IToolbarRenderOptions);
        if (this.parent.toolbarSettings.type === ToolbarType.Expand) {
            addClass([ele], ['e-rte-tb-mobile']);
            if (this.parent.inlineMode.enable) {
                this.addFixedTBarClass();
            } else {
                addClass([ele], [classes.CLS_TB_STATIC]);
            }
        }
        this.wireEvents();
        this.dropDownModule.renderDropDowns({
            container: ele,
            containerType: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'),
            items: this.parent.toolbarSettings.items
        } as IDropDownRenderArgs);
        this.parent.notify(events.renderColorPicker, {
            container: this.tbElement,
            containerType: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'),
            items: this.parent.toolbarSettings.items
        } as IColorPickerRenderArgs);
        return true;
    }

    private checkIsTransformChild(): void {
        this.isTransformChild = false;
        const transformElements: HTMLElement[] = <HTMLElement[]>selectAll('[style*="transform"]', document);
        for (let i: number = 0; i < transformElements.length; i++) {
            if (!isNullOrUndefined(transformElements[i].contains) && transformElements[i].contains(this.parent.element)) {
                this.isTransformChild = true;
                break;
            }
        }
    }

    private toggleFloatClass(e?: Event): void {
        let topValue: number;
        let isBody: boolean = false;
        let isFloat: boolean = false;
        let scrollParent: HTMLElement;
        const floatOffset: number = this.parent.floatingToolbarOffset;
        if (e && this.parent.iframeSettings.enable && this.parent.inputElement.ownerDocument === e.target) {
            scrollParent = (e.target as Document).body as HTMLElement;
        } else if (e && e.target !== document) {
            scrollParent = e.target as HTMLElement;
        } else {
            isBody = true;
            scrollParent = document.body;
        }
        const tbHeight: number = this.getToolbarHeight() + this.getExpandTBarPopHeight();
        if (this.isTransformChild) {
            topValue = 0;
            let scrollParentRelativeTop: number = 0;
            const trgHeight: number = this.parent.element.offsetHeight;
            if (isBody) {
                const bodyStyle: CSSStyleDeclaration = window.getComputedStyle(scrollParent);
                scrollParentRelativeTop = parseFloat(bodyStyle.marginTop.split('px')[0]) + parseFloat(bodyStyle.paddingTop.split('px')[0]);
            }
            const targetTop: number = this.parent.element.getBoundingClientRect().top;
            const scrollParentYOffset: number = (Browser.isMSPointer && isBody) ? window.pageYOffset : scrollParent.parentElement.scrollTop;
            const scrollParentRect: ClientRect = scrollParent.getBoundingClientRect();
            const scrollParentTop: number = (!isBody) ? scrollParentRect.top : (scrollParentRect.top + scrollParentYOffset);
            const outOfRange: boolean = ((targetTop - ((!isBody) ? scrollParentTop : 0))
                + trgHeight > tbHeight + floatOffset) ? false : true;
            if (targetTop > (scrollParentTop + floatOffset) || targetTop < -trgHeight || ((targetTop < 0) ? outOfRange : false)) {
                isFloat = false;
                removeClass([this.tbElement], [classes.CLS_TB_ABS_FLOAT]);
            } else if (targetTop < (scrollParentTop + floatOffset)) {
                if (targetTop < 0) {
                    topValue = (-targetTop) + scrollParentTop;
                } else {
                    topValue = scrollParentTop - targetTop;
                }
                topValue = (isBody) ? topValue - scrollParentRelativeTop : topValue;
                addClass([this.tbElement], [classes.CLS_TB_ABS_FLOAT]);
                isFloat = true;
            }
        } else {
            const parent: ClientRect = this.parent.element.getBoundingClientRect();
            if (window.innerHeight < parent.top) {
                return;
            }
            topValue = (e && e.target !== document) ? scrollParent.getBoundingClientRect().top : 0;
            if ((parent.bottom < (floatOffset + tbHeight + topValue)) || parent.bottom < 0 || parent.top > floatOffset + topValue) {
                isFloat = false;
            } else if (parent.top < floatOffset || parent.top < floatOffset + topValue) {
                isFloat = true;
            }
        }
        if (!isFloat) {
            removeClass([this.tbElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement, { top: 0 + 'px', width: '100%' });
        } else {
            addClass([this.tbElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement, { width: this.parent.element.offsetWidth + 'px', top: (floatOffset + topValue) + 'px' });
        }
    }

    private renderToolbar(): void {
        this.initializeInstance();
        this.createToolbarElement();
        if (this.checkToolbarResponsive(this.tbElement)) {
            return;
        }
        if (this.parent.inlineMode.enable) {
            this.parent.notify(events.renderInlineToolbar, {});
        } else {
            this.baseToolbar.render({
                container: 'toolbar',
                items: this.parent.toolbarSettings.items,
                mode: this.getToolbarMode(),
                target: this.tbElement,
                cssClass: this.parent.cssClass
            } as IToolbarRenderOptions);
            if (!this.parent.inlineMode.enable) {
                if (this.parent.toolbarSettings.enableFloating) {
                    this.checkIsTransformChild();
                    this.toggleFloatClass();
                }
                addClass([this.parent.element], [classes.CLS_RTE_TB_ENABLED]);
                if (this.parent.toolbarSettings.type === ToolbarType.Expand) {
                    addClass([this.parent.element], [classes.CLS_RTE_EXPAND_TB]);
                }
            }
        }
        this.wireEvents();
        if (this.parent.inlineMode.enable && !isIDevice()) {
            this.addFixedTBarClass();
        }
        if (!this.parent.inlineMode.enable) {
            this.dropDownModule.renderDropDowns({
                container: this.tbElement,
                containerType: 'toolbar',
                items: this.parent.toolbarSettings.items
            } as IDropDownRenderArgs);
            this.parent.notify(events.renderColorPicker, {
                container: this.tbElement,
                containerType: 'toolbar',
                items: this.parent.toolbarSettings.items
            } as IColorPickerRenderArgs);
            this.refreshToolbarOverflow();
        }
        const divEle: HTMLElement = this.parent.element.querySelector('.e-rte-srctextarea') as HTMLElement;
        const iframeEle: HTMLElement = this.parent.element.querySelector('.e-source-content') as HTMLElement;
        if ((!this.parent.iframeSettings.enable && (!isNOU(divEle) && divEle.style.display === 'block')) ||
          (this.parent.iframeSettings.enable && (!isNOU(iframeEle) && iframeEle.style.display === 'block'))) {
            this.parent.notify(events.updateToolbarItem, {
                targetItem: 'SourceCode', updateItem: 'Preview',
                baseToolbar: this.parent.getBaseToolbarObject()
            });
            this.parent.disableToolbarItem(this.parent.toolbarSettings.items as string[]);
        }
    }

    /**
     * addFixedTBarClass method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addFixedTBarClass(): void {
        addClass([this.tbElement], [classes.CLS_TB_FIXED]);
    }

    /**
     * removeFixedTBarClass method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public removeFixedTBarClass(): void {
        removeClass([this.tbElement], [classes.CLS_TB_FIXED]);
    }

    private showFixedTBar(): void {
        addClass([this.tbElement], [classes.CLS_SHOW]);
        if (Browser.isIos) {
            addClass([this.tbElement], [classes.CLS_TB_IOS_FIX]);
        }
    }

    private hideFixedTBar(): void {
        // eslint-disable-next-line
        (!this.isToolbar) ? removeClass([this.tbElement], [classes.CLS_SHOW, classes.CLS_TB_IOS_FIX]) : this.isToolbar = false;
    }

    /**
     * updateItem method
     *
     * @param {IUpdateItemsModel} args - specifies the arguments.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public updateItem(args: IUpdateItemsModel): void {
        const item: IToolsItems = this.tools[args.updateItem.toLocaleLowerCase() as ToolbarItems];
        const trgItem: IToolsItems = this.tools[args.targetItem.toLocaleLowerCase() as ToolbarItems];
        const index: number = getTBarItemsIndex(getCollection(trgItem.subCommand), args.baseToolbar.toolbarObj.items)[0];
        if (!isNOU(index)) {
            const prefixId: string = this.parent.inlineMode.enable ? '_quick_' : '_toolbar_';
            args.baseToolbar.toolbarObj.items[index].id = this.parent.getID() + prefixId + item.id;
            args.baseToolbar.toolbarObj.items[index].prefixIcon = item.icon;
            args.baseToolbar.toolbarObj.items[index].tooltipText = item.tooltip;
            (args.baseToolbar.toolbarObj.items as IToolbarItemModel[])[index].subCommand = item.subCommand;
            args.baseToolbar.toolbarObj.dataBind();
        } else {
            this.addTBarItem(args, 0);
        }
    }

    private updateToolbarStatus(args: IToolbarStatus): void {
        if (!this.tbElement || (this.parent.inlineMode.enable && (isIDevice() || !Browser.isDevice))) {
            return;
        }
        const options: ISetToolbarStatusArgs = {
            args: args,
            dropDownModule: this.dropDownModule,
            parent: this.parent,
            tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.tbElement),
            tbItems: this.baseToolbar.toolbarObj.items
        };
        setToolbarStatus(options, (this.parent.inlineMode.enable ? true : false), this.parent);
    }

    private fullScreen(e?: MouseEvent): void {
        this.parent.fullScreenModule.showFullScreen(e);
    }

    private hideScreen(e?: MouseEvent): void {
        this.parent.fullScreenModule.hideFullScreen(e);
    }

    /**
     * getBaseToolbar method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getBaseToolbar(): BaseToolbar {
        return this.baseToolbar;
    }

    /**
     * addTBarItem method
     *
     * @param {IUpdateItemsModel} args - specifies the arguments.
     * @param {number} index - specifies the index value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public addTBarItem(args: IUpdateItemsModel, index: number): void {
        args.baseToolbar.toolbarObj.addItems([args.baseToolbar.getObject(args.updateItem, 'toolbar')], index);
    }

    /**
     * enableTBarItems method
     *
     * @param {BaseToolbar} baseToolbar - specifies the toolbar.
     * @param {string} items - specifies the string value.
     * @param {boolean} isEnable - specifies the boolean value.
     * @param {boolean} muteToolbarUpdate - specifies the toolbar.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public enableTBarItems(baseToolbar: BaseToolbar, items: string | string[], isEnable: boolean , muteToolbarUpdate?: boolean): void {
        const trgItems: number[] = getTBarItemsIndex(getCollection(items), baseToolbar.toolbarObj.items);
        this.tbItems = selectAll('.' + classes.CLS_TB_ITEM, baseToolbar.toolbarObj.element);
        for (let i: number = 0; i < trgItems.length; i++) {
            const item: HTMLElement = this.tbItems[trgItems[i]];
            if (item) {
                baseToolbar.toolbarObj.enableItems(item, isEnable);
            }
        }
        if (!select('.e-rte-srctextarea', this.parent.element) && !muteToolbarUpdate) {
            updateUndoRedoStatus(baseToolbar, this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
        }
    }

    /**
     * removeTBarItems method
     *
     * @param {string} items - specifies the string value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public removeTBarItems(items: string | string[]): void {
        if (isNullOrUndefined(this.baseToolbar.toolbarObj)) {
            this.baseToolbar = this.parent.getBaseToolbarObject();
        }
        const trgItems: number[] = getTBarItemsIndex(getCollection(items), this.baseToolbar.toolbarObj.items);
        this.tbItems = (this.parent.inlineMode.enable) ? selectAll('.' + classes.CLS_TB_ITEM, this.baseToolbar.toolbarObj.element)
            : selectAll('.' + classes.CLS_TB_ITEM, this.parent.element);
        for (let i: number = 0; i < trgItems.length; i++) {
            this.baseToolbar.toolbarObj.removeItems(this.tbItems[trgItems[i]]);
        }
    }

    /**
     * getExpandTBarPopHeight method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getExpandTBarPopHeight(): number {
        let popHeight: number = 0;
        if (this.parent.toolbarSettings.type === ToolbarType.Expand && this.tbElement.classList.contains('e-extended-toolbar')) {
            const expandPopup: HTMLElement = <HTMLElement>select('.e-toolbar-extended', this.tbElement);
            if (expandPopup && this.tbElement.classList.contains('e-expand-open')
                || expandPopup && expandPopup.classList.contains('e-popup-open')) {
                addClass([expandPopup], [classes.CLS_VISIBLE]);
                popHeight = popHeight + expandPopup.offsetHeight;
                removeClass([expandPopup], [classes.CLS_VISIBLE]);
            } else {
                removeClass([this.tbElement], [classes.CLS_EXPAND_OPEN]);
            }
        }
        return popHeight;
    }

    /**
     * getToolbarHeight method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getToolbarHeight(): number {
        return this.tbElement.offsetHeight;
    }

    /**
     * getToolbarElement method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getToolbarElement(): Element {
        return select('.' + classes.CLS_TOOLBAR, this.parent.element);
    }

    /**
     * refreshToolbarOverflow method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public refreshToolbarOverflow(): void {
        this.baseToolbar.toolbarObj.refreshOverflow();
    }

    private isToolbarDestroyed(): boolean {
        return this.baseToolbar.toolbarObj && !this.baseToolbar.toolbarObj.isDestroyed;
    }

    private destroyToolbar(): void {
        if (this.isToolbarDestroyed()) {
            this.parent.unWireScrollElementsEvents();
            this.unWireEvents();
            this.parent.notify(events.destroyColorPicker, {});
            this.dropDownModule.destroyDropDowns();
            this.baseToolbar.toolbarObj.destroy();
            this.removeEventListener();
            removeClass([this.parent.element], [classes.CLS_RTE_TB_ENABLED]);
            removeClass([this.parent.element], [classes.CLS_RTE_EXPAND_TB]);
            const tbWrapper: HTMLElement = <HTMLElement>select('.' + classes.CLS_TB_WRAP, this.parent.element);
            const tbElement: HTMLElement = <HTMLElement>select('.' + classes.CLS_TOOLBAR, this.parent.element);
            if (!isNullOrUndefined(tbWrapper)) {
                detach(tbWrapper);
            } else if (!isNullOrUndefined(tbElement)) {
                detach(tbElement);
            }
        }
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
        if (this.isToolbarDestroyed()) {
            this.destroyToolbar();
            if (this.keyBoardModule) {
                this.keyBoardModule.destroy();
            }
        }
    }

    private moduleDestroy(): void {
        this.parent = null;
        this.baseToolbar.parent = null;
        this.toolbarActionModule.parent = null;
        this.dropDownModule.parent = null;
    }

    private scrollHandler(e: NotifyArgs): void {
        if (!this.parent.inlineMode.enable) {
            if (this.parent.toolbarSettings.enableFloating && this.getDOMVisibility(this.tbElement)) {
                this.toggleFloatClass(e.args as Event);
            }
        }
    }

    private getDOMVisibility(el: HTMLElement): boolean {
        if (!el.offsetParent && el.offsetWidth === 0 && el.offsetHeight === 0) {
            return false;
        }
        return true;
    }

    private mouseDownHandler(): void {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.showFixedTBar();
        }
    }

    private focusChangeHandler(): void {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.isToolbar = false;
            this.hideFixedTBar();
        }
    }

    private dropDownBeforeOpenHandler(): void {
        this.isToolbar = true;
    }

    // eslint-disable-next-line
    private tbFocusHandler(e: Event): void {
        const activeElm: Element = document.activeElement;
        const isToolbaractive: Element = closest(activeElm as Element, '.e-rte-toolbar');
        if (activeElm === this.parent.getToolbarElement() || isToolbaractive === this.parent.getToolbarElement()) {
            const toolbarItem: NodeList = this.parent.getToolbarElement().querySelectorAll('.e-expended-nav');
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if (isNOU(this.parent.getToolbarElement().querySelector('.e-insert-table-btn'))) {
                    (toolbarItem[i] as HTMLElement).setAttribute('tabindex', '0');
                } else {
                    (toolbarItem[i] as HTMLElement).setAttribute('tabindex', '1');
                }
            }
        }
    }

    private tbKeydownHandler(e: Event): void {
        if ((e.target as HTMLElement).classList.contains('e-dropdown-btn') ||
        (e.target as HTMLElement).getAttribute('id') === this.parent.getID() + '_toolbar_CreateTable') {
            (e.target as HTMLElement).setAttribute('tabindex', '0');
        }
    }

    private toolbarClickHandler(e: ClickEventArgs): void {
        const trg: Element = closest(e.originalEvent.target as Element, '.e-hor-nav');
        if (trg && this.parent.toolbarSettings.type === ToolbarType.Expand && !isNOU(trg)) {
            if (!trg.classList.contains('e-nav-active')) {
                removeClass([this.tbElement], [classes.CLS_EXPAND_OPEN]);
                this.parent.setContentHeight('toolbar', false);
            } else {
                addClass([this.tbElement], [classes.CLS_EXPAND_OPEN]);
                this.parent.setContentHeight('toolbar', true);
            }
        } else if (Browser.isDevice || this.parent.inlineMode.enable) {
            this.isToolbar = true;
        }
        if (isNOU(trg) && this.parent.toolbarSettings.type === ToolbarType.Expand) {
            removeClass([this.tbElement], [classes.CLS_EXPAND_OPEN]);
        }
    }

    protected wireEvents(): void {
        if (this.parent.inlineMode.enable && isIDevice()) {
            return;
        }
        EventHandler.add(this.tbElement, 'focusin', this.tbFocusHandler, this);
        EventHandler.add(this.tbElement, 'keydown', this.tbKeydownHandler, this);
    }

    protected unWireEvents(): void {
        EventHandler.remove(this.tbElement, 'focusin', this.tbFocusHandler);
        EventHandler.remove(this.tbElement, 'keydown', this.tbKeydownHandler);
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.dropDownModule = new DropDownButtons(this.parent, this.locator);
        this.toolbarActionModule = new ToolbarAction(this.parent);
        this.parent.on(events.initialEnd, this.renderToolbar, this);
        this.parent.on(events.scroll, this.scrollHandler, this);
        this.parent.on(events.bindOnEnd, this.toolbarBindEvent, this);
        this.parent.on(events.toolbarUpdated, this.updateToolbarStatus, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.refreshBegin, this.onRefresh, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.enableFullScreen, this.fullScreen, this);
        this.parent.on(events.disableFullScreen, this.hideScreen, this);
        this.parent.on(events.updateToolbarItem, this.updateItem, this);
        this.parent.on(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler, this);
        this.parent.on(events.expandPopupClick, this.parent.setContentHeight, this.parent);
        this.parent.on(events.focusChange, this.focusChangeHandler, this);
        this.parent.on(events.mouseDown, this.mouseDownHandler, this);
        this.parent.on(events.sourceCodeMouseDown, this.mouseDownHandler, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.moduleDestroy, this.moduleDestroy, this);
        if (!this.parent.inlineMode.enable && !isIDevice()) {
            this.parent.on(events.toolbarClick, this.toolbarClickHandler, this);
        }
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.renderToolbar);
        this.parent.off(events.scroll, this.scrollHandler);
        this.parent.off(events.bindOnEnd, this.toolbarBindEvent);
        this.parent.off(events.toolbarUpdated, this.updateToolbarStatus);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.refreshBegin, this.onRefresh);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.enableFullScreen, this.parent.fullScreenModule.showFullScreen);
        this.parent.off(events.disableFullScreen, this.parent.fullScreenModule.hideFullScreen);
        this.parent.off(events.updateToolbarItem, this.updateItem);
        this.parent.off(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler);
        this.parent.off(events.expandPopupClick, this.parent.setContentHeight);
        this.parent.off(events.focusChange, this.focusChangeHandler);
        this.parent.off(events.mouseDown, this.mouseDownHandler);
        this.parent.off(events.sourceCodeMouseDown, this.mouseDownHandler);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.moduleDestroy, this.moduleDestroy);
        if (!this.parent.inlineMode.enable && !isIDevice()) {
            this.parent.off(events.toolbarClick, this.toolbarClickHandler);
        }
    }

    private setCssClass(e: ICssClassArgs) {
        if (this.toolbarObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                this.toolbarObj.setProperties({ cssClass: (this.toolbarObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                this.toolbarObj.setProperties({ cssClass: (this.toolbarObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    private onRefresh(): void {
        if (!this.parent.inlineMode.enable){
            this.refreshToolbarOverflow();
        }
        this.parent.setContentHeight('', true);
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {RichTextEditorModel} e - specifies the string value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    protected onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        if (!isNullOrUndefined(e.newProp.inlineMode)) {
            for (const prop of Object.keys(e.newProp.inlineMode)) {
                switch (prop) {
                case 'enable':
                    this.refreshToolbar();
                    break;
                }
            }
        }
        if (e.module !== this.getModuleName()) {
            return;
        }
        this.refreshToolbar();
    }

    private refreshToolbar(): void {
        if (isNullOrUndefined(this.baseToolbar.toolbarObj)) {
            this.baseToolbar = this.parent.getBaseToolbarObject();
        }
        const tbWrapper: Element = select('.' + classes.CLS_TB_WRAP, this.parent.element);
        const tbElement: Element = select('.' + classes.CLS_TOOLBAR, this.parent.element);
        if (tbElement || tbWrapper) {
            this.destroyToolbar();
        }
        if (this.parent.toolbarSettings.enable) {
            this.addEventListener();
            this.renderToolbar();
            this.parent.wireScrollElementsEvents();
            if (!select('.e-rte-srctextarea', this.parent.element)) {
                updateUndoRedoStatus(this.baseToolbar, this.parent.formatter.editorManager.undoRedoManager.getUndoStatus());
            }
            this.parent.notify(events.dynamicModule, {});
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'toolbar';
    }
}
