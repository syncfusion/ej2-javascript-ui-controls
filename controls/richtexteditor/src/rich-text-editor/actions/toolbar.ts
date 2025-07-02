import { addClass, Browser, EventHandler, detach, removeClass, select, selectAll, KeyboardEvents } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, KeyboardEventArgs, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { setStyleAttribute, extend } from '@syncfusion/ej2-base';
import { Toolbar as tool, OverflowMode, ItemModel } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RenderType } from '../base/enum';
import { setToolbarStatus, updateUndoRedoStatus, getTBarItemsIndex, getCollection, toObjectLowerCase, getTooltipText } from '../base/util';
import { isIDevice } from '../../common/util';
import { updateDropDownFontFormatLocale } from '../base/util';
import * as model from '../models/items';
import { IRichTextEditor, IToolbarRenderOptions, ICssClassArgs } from '../base/interface';
import { IUpdateItemsModel, IDropDownRenderArgs, ISetToolbarStatusArgs, IRenderer } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { BaseToolbar } from './base-toolbar';
import { DropDownButtons } from './dropdown-buttons';
import { ToolbarAction } from './toolbar-action';
import { IToolbarStatus, IToolbarItemModel, IToolsItems, IColorPickerRenderArgs } from '../../common/interface';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { ColorPickerInput } from './color-picker';
import { ToolbarType, ToolbarItems } from '../../common/enum';
/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class Toolbar {
    public isDestroyed: boolean;
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
    public dropDownModule: DropDownButtons;
    public colorPickerModule: ColorPickerInput;
    private toolbarActionModule: ToolbarAction;
    protected renderFactory: RendererFactory;
    private keyBoardModule: KeyboardEvents;
    private tools: { [key: string]: IToolsItems } = {};

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.isDestroyed = false;
        this.isToolbar = false;
        this.locator = serviceLocator;
        this.isTransformChild = false;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        model.updateDropDownLocale(this.parent);
        updateDropDownFontFormatLocale(this.parent);
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
        if (!this.parent.inlineMode.enable && this.getToolbarElement()) {
            this.keyBoardModule = new KeyboardEvents(this.getToolbarElement() as HTMLElement, {
                keyAction: this.toolBarKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
        }
    }
    private toolBarKeyDown(e: KeyboardEvent): void {
        let target: HTMLElement;
        switch ((e as KeyboardEventArgs).action) {
        case 'escape':
            (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
            break;
        case 'enter':
            target = e.target as HTMLElement;
            if (!isNOU(target)) {
                const targetEle: HTMLElement = target.nodeName === 'BUTTON' ?
                    target.closest('.e-split-btn-wrapper.e-rte-dropdown') as HTMLElement : target;
                if (targetEle) {
                    const hasFontColor: Element | null = targetEle.querySelector('.e-rte-font-colorpicker');
                    if (hasFontColor || targetEle.querySelector('.e-rte-background-colorpicker')) {
                        this.parent.notify(events.showColorPicker, {
                            toolbarClick: hasFontColor ?
                                'fontcolor' : 'backgroundcolor'
                        });
                        return;
                    }
                    const hasNumberList: Element | null = targetEle.querySelector('.e-rte-numberformatlist-dropdown');
                    if (hasNumberList || targetEle.querySelector('.e-rte-bulletformatlist-dropdown')) {
                        this.parent.notify(events.showDropDown, {
                            toolbarClick: hasNumberList ?
                                'NumberFormatList' : 'BulletFormaList'
                        });
                        return;
                    }
                    const codeBlockToolbarItem: Element | null = targetEle.querySelector('.e-rte-codeblock-dropdown');
                    if (codeBlockToolbarItem) {
                        this.parent.notify(events.showDropDown, { toolbarClick: 'CodeBlock' });
                        return;
                    }
                }
            }
        }
    }
    private createToolbarElement(): void {
        this.tbElement = this.parent.createElement('div', { id: this.parent.getID() + '_toolbar' });
        if (!Browser.isDevice && this.parent.inlineMode.enable && isIDevice()) {
            return;
        } else {
            if (!this.parent.inlineMode.enable) {
                this.tbWrapper = this.parent.createElement('div', {
                    id: this.parent.getID() + '_toolbar_wrapper',
                    innerHTML: this.tbElement.outerHTML,
                    className: classes.CLS_TB_WRAP
                });
                this.tbElement = this.tbWrapper.firstElementChild as HTMLElement;
                if (this.parent.iframeSettings.enable) {
                    this.parent.rootContainer.prepend(this.tbWrapper);
                } else {
                    this.parent.rootContainer.insertBefore(this.tbWrapper, this.editPanel);
                }
            } else {
                if (this.parent.iframeSettings.enable) {
                    this.parent.rootContainer.prepend(this.tbElement);
                } else {
                    this.parent.rootContainer.insertBefore(this.tbElement, this.editPanel);
                }
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
        case ToolbarType.Popup:
            tbMode = 'Popup';
            break;
        default:
            tbMode = 'MultiRow';
        }
        if (isIDevice() && this.parent.toolbarSettings.type === ToolbarType.Expand) {
            tbMode = ToolbarType.Scrollable;
        }
        return tbMode;
    }

    private checkToolbarResponsive(ele: HTMLElement): boolean {
        if (!Browser.isDevice || isIDevice()) {
            return false;
        }
        let tBarMode: string;
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
            cssClass: this.parent.getCssClass()
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
        this.renderColorPicker({
            container: this.tbElement, containerType: ((this.parent.inlineMode.enable) ? 'quick' : 'toolbar'), items:
                this.parent.toolbarSettings.items
        } as IColorPickerRenderArgs);
        return true;
    }

    private checkIsTransformChild(): void {
        this.isTransformChild = false;
        const transformElements: HTMLElement[] = <HTMLElement[]>selectAll('[style*="transform"]', document);
        for (let i: number = 0; i < transformElements.length; i++) {
            // eslint-disable-next-line max-len
            if (!isNullOrUndefined(transformElements[i as number].contains) && transformElements[i as number].contains(this.parent.element)) {
                this.isTransformChild = true;
                break;
            }
        }
    }

    private toggleFloatClass(): void {
        const floatOffset: number = this.parent.floatingToolbarOffset;
        if (this.parent.toolbarSettings.enableFloating) {
            addClass([this.tbElement.parentElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement.parentElement, { top: (floatOffset) + 'px' });
        }
        else {
            removeClass([this.tbElement.parentElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement.parentElement, { top: '' });
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
                cssClass: this.parent.getCssClass()
            } as IToolbarRenderOptions);
            if (this.parent.element.classList.contains('e-rte-full-screen')) {
                this.updateItem({
                    targetItem: 'Maximize',
                    updateItem: 'Minimize',
                    baseToolbar: this.parent.getBaseToolbarObject()
                });
            }
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
            this.renderColorPicker({ container: this.tbElement, containerType: 'toolbar', items: this.parent.toolbarSettings.items } as IColorPickerRenderArgs);
            this.refreshToolbarOverflow();
        }
        if (this.parent.rootContainer && this.parent.rootContainer.classList.contains('e-source-code-enabled')) {
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
        if (this.parent.enabled) {
            if ((getTooltipText(args.updateItem.toLocaleLowerCase(), this.locator) !== 'Code View' && getTooltipText(args.updateItem.toLocaleLowerCase(), this.locator) !== 'Preview') || this.parent.locale !== 'en-US') {
                item.tooltip = getTooltipText(args.updateItem.toLocaleLowerCase(), this.locator);
            }
        }
        const trgItem: IToolsItems = this.tools[args.targetItem.toLocaleLowerCase() as ToolbarItems];
        const index: number = getTBarItemsIndex(getCollection(trgItem.subCommand), args.baseToolbar.toolbarObj.items)[0];
        if (!isNOU(index)) {
            const prefixId: string = this.parent.inlineMode.enable ? '_quick_' : '_toolbar_';
            args.baseToolbar.toolbarObj.items[index as number].id = this.parent.getID() + prefixId + item.id;
            args.baseToolbar.toolbarObj.items[index as number].prefixIcon = item.icon;
            args.baseToolbar.toolbarObj.items[index as number].tooltipText = item.tooltip;
            (args.baseToolbar.toolbarObj.items as IToolbarItemModel[])[index as number].subCommand = item.subCommand;
            args.baseToolbar.toolbarObj.dataBind();
            args.baseToolbar.toolbarObj.refreshOverflow();
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
    public enableTBarItems(baseToolbar: BaseToolbar, items: string | string[], isEnable: boolean, muteToolbarUpdate?: boolean): void {
        let filterItems: string[];
        let trgItems: number[];
        let baseToolbaritems: ItemModel[];
        if (this.parent.toolbarSettings.type === 'Popup' && typeof (items) != 'string') {
            filterItems = (items as string[]).filter((item: string) => { return item !== '|'; });
            baseToolbaritems = (baseToolbar.toolbarObj.items as ItemModel[]).filter((item: ItemModel) => { return item.type !== 'Separator'; });
            trgItems = getTBarItemsIndex(getCollection(filterItems), baseToolbaritems);
            this.tbItems = selectAll('.' + classes.CLS_TB_ITEM + ':not(.e-separator)', baseToolbar.toolbarObj.element);
        } else {
            trgItems = getTBarItemsIndex(getCollection(items), baseToolbar.toolbarObj.items);
            this.tbItems = selectAll('.' + classes.CLS_TB_ITEM, baseToolbar.toolbarObj.element);

        }
        for (let i: number = 0; i < trgItems.length; i++) {
            const item: HTMLElement = this.tbItems[trgItems[i as number]];
            if (item) {
                baseToolbar.toolbarObj.enableItems(item, isEnable);
            }
        }
        if (!select('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA, this.parent.element) && !muteToolbarUpdate) {
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
            this.baseToolbar.toolbarObj.removeItems(this.tbItems[trgItems[i as number]]);
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
        return this.parent && this.parent.element ? select('.' + classes.CLS_TOOLBAR, this.parent.element) : null;
    }

    /**
     * refreshToolbarOverflow method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public refreshToolbarOverflow(): void {
        this.parent.element.classList.remove(classes.CLS_RTL);
        this.baseToolbar.toolbarObj.refreshOverflow();
        if (this.parent.enableRtl) {
            this.parent.element.classList.add(classes.CLS_RTL);
        }
    }

    private isToolbarDestroyed(): boolean {
        return this.baseToolbar && this.baseToolbar.toolbarObj && this.baseToolbar.toolbarObj.isDestroyed ? true : false;
    }

    private destroyToolbar(): void {
        if (!this.isToolbarDestroyed()) {
            this.parent.unWireScrollElementsEvents();
            this.unWireEvents();
            this.dropDownModule.destroy();
            if (this.parent.emojiPickerModule && !this.parent.emojiPickerModule.isPopupDestroyed) {
                this.parent.emojiPickerModule.childDestroy();
            }
            this.dropDownModule = null;
            this.colorPickerModule.destroy();
            this.colorPickerModule = null;
            if (this.keyBoardModule) {
                this.keyBoardModule.destroy();
                this.keyBoardModule = null;
            }
            this.baseToolbar.destroy();
            this.removeEventListener();
            removeClass([this.parent.element], [classes.CLS_RTE_TB_ENABLED]);
            removeClass([this.parent.element], [classes.CLS_RTE_EXPAND_TB]);
            const tbWrapper: HTMLElement = <HTMLElement>select('.' + classes.CLS_TB_WRAP, this.parent.element);
            const tbElement: HTMLElement = <HTMLElement>select('.' + classes.CLS_TOOLBAR, this.parent.element);
            if (!isNullOrUndefined(tbWrapper)) {
                detach(tbWrapper);
            }
            if (!isNullOrUndefined(tbElement)) {
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
        if (this.isDestroyed) { return; }
        if (!this.isToolbarDestroyed()) {
            this.destroyToolbar();
        }
        this.toolbarObj = null;
        this.editPanel = null;
        this.isToolbar = null;
        this.editableElement = null;
        this.tbItems = null;
        this.baseToolbar = null;
        this.tbElement = null;
        this.tbWrapper = null;
        this.isTransformChild = null;
        this.contentRenderer = null;
        this.dropDownModule = null;
        this.colorPickerModule = null;
        this.toolbarActionModule = null;
        this.tools = null;
        this.locator = null;
        this.renderFactory = null;
        this.isDestroyed = true;
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
                    (toolbarItem[i as number] as HTMLElement).setAttribute('tabindex', '0');
                } else {
                    (toolbarItem[i as number] as HTMLElement).setAttribute('tabindex', '1');
                }
            }
        }
    }

    protected wireEvents(): void {
        if (this.parent.inlineMode.enable && isIDevice()) {
            return;
        }
        EventHandler.add(this.tbElement, 'focusin', this.tbFocusHandler, this);
    }

    protected unWireEvents(): void {
        EventHandler.remove(this.tbElement, 'focusin', this.tbFocusHandler);
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.dropDownModule = new DropDownButtons(this.parent, this.locator);
        this.toolbarActionModule = new ToolbarAction(this.parent);
        this.colorPickerModule = new ColorPickerInput(this.parent, this.locator);
        this.parent.on(events.initialEnd, this.renderToolbar, this);
        this.parent.on(events.bindOnEnd, this.toolbarBindEvent, this);
        this.parent.on(events.toolbarUpdated, this.updateToolbarStatus, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.refreshBegin, this.onRefresh, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.enableFullScreen, this.fullScreen, this);
        this.parent.on(events.disableFullScreen, this.hideScreen, this);
        this.parent.on(events.updateToolbarItem, this.updateItem, this);
        this.parent.on(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler, this);
        this.parent.on(events.focusChange, this.focusChangeHandler, this);
        this.parent.on(events.mouseDown, this.mouseDownHandler, this);
        this.parent.on(events.sourceCodeMouseDown, this.mouseDownHandler, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.initialEnd, this.renderToolbar);
        this.parent.off(events.bindOnEnd, this.toolbarBindEvent);
        this.parent.off(events.toolbarUpdated, this.updateToolbarStatus);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.refreshBegin, this.onRefresh);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.enableFullScreen, this.parent.fullScreenModule.showFullScreen);
        this.parent.off(events.disableFullScreen, this.parent.fullScreenModule.hideFullScreen);
        this.parent.off(events.updateToolbarItem, this.updateItem);
        this.parent.off(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler);
        this.parent.off(events.focusChange, this.focusChangeHandler);
        this.parent.off(events.mouseDown, this.mouseDownHandler);
        this.parent.off(events.sourceCodeMouseDown, this.mouseDownHandler);
        this.parent.off(events.bindCssClass, this.setCssClass);
    }

    // eslint-disable-next-line @typescript-eslint/tslint/config
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
        if (!this.parent.inlineMode.enable) {
            this.refreshToolbarOverflow();
        }
        this.parent.autoResize();
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
        if (!isNullOrUndefined(e.newProp.toolbarSettings)) {
            if (!isNullOrUndefined(e.newProp.toolbarSettings.enableFloating)) {
                this.toggleFloatClass();
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
            if (this.baseToolbar && this.baseToolbar.toolbarObj && !this.baseToolbar.toolbarObj.isDestroyed) {
                this.baseToolbar.destroy();
            }
            this.baseToolbar = new BaseToolbar(this.parent, this.locator);
            this.addEventListener();
            this.renderToolbar();
            this.parent.wireScrollElementsEvents();
            if (!select('.' + classes.CLS_RTE_SOURCE_CODE_TXTAREA, this.parent.element) && !this.parent.inlineMode.enable) {
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

    private renderColorPicker(args: IColorPickerRenderArgs): void {
        this.colorPickerModule.renderColorPickerInput(args);
    }
}
