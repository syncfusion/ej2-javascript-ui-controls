import { Component, ModuleDeclaration, L10n, EmitType, Browser, addClass, removeClass, KeyboardEventArgs, classList } from '@syncfusion/ej2-base';
import { createElement, compile as templateCompiler, EventHandler, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Property, Event, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { PagerModel } from './pager-model';
import { PagerDropDown } from './pager-dropdown';
import { NumericContainer } from './numeric-container';
import { PagerMessage } from './pager-message';
import { ExternalMessage } from './external-message';
import { appendChildren, parentsUntil } from '../grid/base/util';
import * as events from '../grid/base/constant';

/** @hidden */
export interface IRender {
    render(): void;
    refresh(): void;
}

/**
 * @hidden
 */
export interface keyPressHandlerKeyboardEventArgs extends KeyboardEvent {
    cancel?: boolean;
}

/**
 * Represents the `Pager` component.
 * ```html
 * <div id="pager"/>
 * ```
 * ```typescript
 * <script>
 *   var pagerObj = new Pager({ totalRecordsCount: 50, pageSize:10 });
 *   pagerObj.appendTo("#pager");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Pager extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Internal variables
    /*** @hidden */
    public totalPages: number;
    /** @hidden */
    public templateFn: Function;
    /** @hidden */
    public hasParent: boolean = false;
    /*** @hidden */
    public previousPageNo: number;
    /** @hidden */
    public isAllPage: boolean;
    public checkAll: boolean = true;
    /** @hidden */
    public isPagerResized: boolean;
    /** @hidden */
    public keyAction: string;
    /** @hidden */
    public avgNumItems: number;
    private averageDetailWidth: number;
    private defaultConstants: Object;
    private pageRefresh: string = 'pager-refresh';
    private parent: object;
    private firstPagerFocus: boolean = false;
    /** @hidden */
    public isCancel: boolean = false;
    /** @hidden */
    public isInteracted: boolean = false;

    //Module declarations
    /*** @hidden */
    public localeObj: L10n;
    /**
     * `containerModule` is used to manipulate numeric container behavior of Pager.
     */
    public containerModule: NumericContainer;
    /**
     * `pagerMessageModule` is used to manipulate pager message of Pager.
     */
    public pagerMessageModule: PagerMessage;
    /**
     * `externalMessageModule` is used to manipulate external message of Pager.
     */
    public externalMessageModule: ExternalMessage;
    /**
     * @hidden
     * `pagerdropdownModule` is used to manipulate pageSizes of Pager.
     */
    public pagerdropdownModule: PagerDropDown;

    //Pager Options
    /**
     * If `enableQueryString` set to true,
     * then it pass current page information as a query string along with the URL while navigating to other page.
     *
     * @default false
     */
    @Property(false)
    public enableQueryString: boolean;

    /**
     * If `enableExternalMessage` set to true, then it adds the message to Pager.
     *
     * @default false
     */
    @Property(false)
    public enableExternalMessage: boolean;

    /**
     * If `enablePagerMessage` set to true, then it adds the pager information.
     *
     * @default true
     */
    @Property(true)
    public enablePagerMessage: boolean;

    /**
     * Defines the records count of visible page.
     *
     * @default 12
     */
    @Property(12)
    public pageSize: number;

    /**
     * Defines the number of pages to display in pager container.
     *
     * @default 10
     */
    @Property(10)
    public pageCount: number;

    /**
     * Defines the current page number of pager.
     *
     * @default 1
     */
    @Property(1)
    public currentPage: number;

    /**
     * Gets or Sets the total records count which is used to render numeric container.
     *
     * @default null
     */
    @Property()
    public totalRecordsCount: number;

    /**
     * Defines the external message of Pager.
     *
     * @default null
     */
    @Property()
    public externalMessage: string;

    /**
     * If `pageSizes` set to true or Array of values,
     * It renders DropDownList in the pager which allow us to select pageSize from DropDownList.
     *
     * @default false
     */
    @Property(false)
    public pageSizes: boolean | (number | string)[];

    /**
     *  Defines the template as string or HTML element ID which renders customized elements in pager instead of default elements.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public template: string | Function;

    /**
     * Defines the customized text to append with numeric items.
     *
     * @default null
     */
    @Property('')
    public customText: string;

    /**
     * Triggers when click on the numeric items.
     *
     * @default null
     */
    @Event()
    public click: EmitType<Object>;

    /**
     * Defines the own class for the pager element.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Triggers after pageSize is selected in DropDownList.
     *
     * @default null
     */
    @Event()
    public dropDownChanged: EmitType<Object>;

    /**
     * Triggers when Pager is created.
     *
     * @default null
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Constructor for creating the component.
     *
     * @param {PagerModel} options - specifies the options
     * @param {string} element - specifies the element
     * @param {string} parent - specifies the pager parent
     * @hidden
     */
    constructor(options?: PagerModel, element?: string | HTMLElement, parent?: object) {
        super(options, <HTMLElement | string>element);
        this.parent = parent;
    }

    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} returns the modules declaration
     * @hidden
     */
    protected requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.enableExternalMessage) {
            modules.push({
                member: 'externalMessage',
                args: [this],
                name: 'ExternalMessage'
            });
        }
        if (this.checkpagesizes()) {
            modules.push({
                member: 'pagerdropdown',
                args: [this],
                name: 'PagerDropDown'
            });
        }
        return modules;
    }


    /**
     * Initialize the event handler
     *
     * @returns {void}
     * @hidden
     */
    protected preRender(): void {
        //preRender
        this.defaultConstants = {
            currentPageInfo: '{0} of {1} pages',
            totalItemsInfo: '({0} items)',
            totalItemInfo: '({0} item)',
            firstPageTooltip: 'Go to first page',
            lastPageTooltip: 'Go to last page',
            nextPageTooltip: 'Go to next page',
            previousPageTooltip: 'Go to previous page',
            nextPagerTooltip: 'Go to next pager items',
            previousPagerTooltip: 'Go to previous pager items',
            pagerDropDown: 'Items per page',
            pagerAllDropDown: 'Items',
            CurrentPageInfo: '{0} of {1} pages',
            TotalItemsInfo: '({0} items)',
            FirstPageTooltip: 'Go to first page',
            LastPageTooltip: 'Go to last page',
            NextPageTooltip: 'Go to next page',
            PreviousPageTooltip: 'Go to previous page',
            NextPagerTooltip: 'Go to next pager items',
            PreviousPagerTooltip: 'Go to previous pager items',
            PagerDropDown: 'Items per page',
            PagerAllDropDown: 'Items',
            All: 'All',
            Container: 'Pager Container',
            Information: 'Pager Information',
            ExternalMsg: 'Pager external message',
            Page: 'Page ',
            Of: ' of ',
            Pages: ' Pages'
        };
        this.containerModule = new NumericContainer(this);
        this.pagerMessageModule = new PagerMessage(this);
    }

    /**
     * To Initialize the component rendering
     *
     * @returns {void}
     */
    protected render(): void {
        this.element.setAttribute('data-role', 'pager');
        this.element.setAttribute('tabindex', '-1');
        this.initLocalization();
        if (this.cssClass) {
            if (this.cssClass.indexOf(' ') !== -1) {
                addClass([this.element], this.cssClass.split(' '));
            } else {
                addClass([this.element], [this.cssClass]);
            }
        }
        if (!this.hasParent) {
            this.element.setAttribute('tabindex', '0');
        }
        if (this.enableQueryString) {
            const pageValue: string = new URL(window.location.href).searchParams.get('page');
            if (!isNullOrUndefined(pageValue) && window.location.href.indexOf('?page=') > 0) {
                const currentPageValue: number = parseInt(pageValue, 10);
                if (this.hasParent) {
                    (this.parent as { setProperties(prop: Object, muteOnChange: boolean): void })
                        .setProperties({ pageSettings: { currentPage: currentPageValue } }, true);
                }
                this.currentPage = currentPageValue;
            }
        }
        if (this.template) {
            if (this.isReactTemplate()) {
                this.on(this.pageRefresh, this.pagerTemplate, this);
                this.notify(this.pageRefresh, {});
            } else {
                this.pagerTemplate();
            }
        } else {
            this.updateRTL();
            this.totalRecordsCount = this.totalRecordsCount || 0;
            this.renderFirstPrevDivForDevice();
            this.containerModule.render();
            if (this.enablePagerMessage) {
                this.pagerMessageModule.render();
            }
            this.renderNextLastDivForDevice();
            if (this.checkpagesizes() && this.pagerdropdownModule) {
                this.pagerdropdownModule.render();
            }
            this.addAriaLabel();
            if (this.enableExternalMessage && this.externalMessageModule) {
                this.externalMessageModule.render();
            }
            this.refresh();
            this.trigger('created', { 'currentPage': this.currentPage, 'totalRecordsCount': this.totalRecordsCount });
        }
        this.wireEvents();
        this.addListener();
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} returns the persist data
     * @hidden
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['currentPage', 'pageSize'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * To destroy the Pager component.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.isReactTemplate()) {
            this.off(this.pageRefresh, this.pagerTemplate);
            if (!this.hasParent) {
                this.destroyTemplate(['pagerTemplate']);
            }
        }
        this.removeListener();
        this.unwireEvents();
        super.destroy();
        this.containerModule.destroy();
        this.pagerMessageModule.destroy();
        if (!this.isReactTemplate()) {
            this.element.innerHTML = '';
        }
    }

    /**
     * Destroys the given template reference.
     *
     * @param {string[]} propertyNames - Defines the collection of template name.
     * @param {any} index - Defines the index
     */
    // eslint-disable-next-line
    public destroyTemplate(propertyNames?: string[], index?: any): void {
        this.clearTemplate(propertyNames, index);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'pager';
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {PagerModel} newProp - specifies the new property
     * @param {PagerModel} oldProp - specifies the old propety
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(newProp: PagerModel, oldProp: PagerModel): void {
        if (this.isDestroyed) { return; }
        if (((newProp.pageSize as number | string) === this.getLocalizedLabel('All')) && oldProp.pageSize === this.totalRecordsCount) {
            this.pageSize = this.totalRecordsCount;
            return;
        }
        if (newProp.pageCount !== oldProp.pageCount) {
            this.containerModule.refreshNumericLinks();
            this.containerModule.refresh();
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'currentPage':
                if (this.checkGoToPage(newProp.currentPage, oldProp.currentPage)) {
                    this.currentPageChanged(newProp, oldProp);
                }
                break;
            case 'pageSize':
            case 'totalRecordsCount':
            case 'customText':
                if (this.checkpagesizes() && this.pagerdropdownModule) {
                    if (oldProp.pageSize !== newProp.pageSize) {
                        this.currentPage = 1;
                    }
                    this.pagerdropdownModule.setDropDownValue('value', this.pageSize);
                }
                if (newProp.pageSize !== oldProp.pageSize) {
                    this.pageSize = newProp.pageSize;
                    this.currentPageChanged(newProp, oldProp);
                    if (this.isCancel && this.hasParent) {
                        (this.parent as { setProperties(prop: Object, muteOnChange: boolean): void })
                            .setProperties({ pageSettings: { pageSize: oldProp.pageSize } }, true);
                    }
                } else {
                    this.refresh();
                }
                break;
            case 'pageSizes':
                if (this.checkpagesizes() && this.pagerdropdownModule) {
                    this.pagerdropdownModule.destroy();
                    this.pagerdropdownModule.render();
                }
                this.refresh();
                break;
            case 'template':
                this.templateFn = this.compile(this.template);
                this.refresh();
                break;
            case 'locale':
                this.initLocalization();
                this.refresh();
                break;
            case 'enableExternalMessage':
                if (this.enableExternalMessage && this.externalMessageModule) {
                    this.externalMessageModule.render();
                }
                break;
            case 'externalMessage':
                if (this.externalMessageModule) {
                    this.externalMessageModule.refresh();
                }
                break;
            case 'enableRtl':
                this.updateRTL();
                break;
            case 'enablePagerMessage':
                if (this.enablePagerMessage) {
                    this.pagerMessageModule.showMessage();
                } else {
                    this.pagerMessageModule.hideMessage();
                }
                break;
            }
        }
        this.resizePager();
    }

    private wireEvents(): void {
        if (!this.hasParent) {
            EventHandler.add(this.element, 'keydown', this.keyPressHandler, this);
            EventHandler.add(document.body, 'keydown', this.keyDownHandler, this);
        }
        EventHandler.add(this.element, 'focusin', this.onFocusIn, this);
        EventHandler.add(this.element, 'focusout', this.onFocusOut, this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.add(window as any, 'resize', this.resizePager, this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.add(window as any, 'load', this.resizePager, this);
    }

    private unwireEvents(): void {
        if (!this.hasParent) {
            EventHandler.remove(this.element, 'keydown', this.keyPressHandler);
            EventHandler.remove(document.body, 'keydown', this.keyDownHandler);
        }
        EventHandler.remove(this.element, 'focusin', this.onFocusIn);
        EventHandler.remove(this.element, 'focusout', this.onFocusOut);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.remove(window as any, 'resize', this.resizePager);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.remove(window as any, 'load', this.resizePager);
    }

    private onFocusIn(e: FocusEvent): void {
        const focusedTabIndexElement: Element = this.getFocusedTabindexElement();
        if (isNullOrUndefined(focusedTabIndexElement)) {
            const target: Element = e.target as Element;
            const dropDownPage: Element = this.getDropDownPage();
            if (!this.hasParent) {
                this.element.tabIndex = -1;
            }
            if (target === this.element && !this.hasParent) {
                const focusablePagerElements: Element[] = this.getFocusablePagerElements(this.element, []);
                this.addFocus(focusablePagerElements[0], true);
                return;
            }
            if (target === this.element) {
                this.element.tabIndex = 0;
                return;
            }
            if (target !== dropDownPage && !target.classList.contains('e-disable')) {
                this.addFocus(target, true);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onFocusOut(e: FocusEvent): void {
        const focusedElement: Element = this.getFocusedElement();
        const dropDownPage: Element = this.getDropDownPage();
        if (!isNullOrUndefined(focusedElement)) {
            this.removeFocus(focusedElement, true);
        }
        if (this.pageSizes && dropDownPage && dropDownPage.classList.contains('e-input-focus')) {
            this.removeFocus(dropDownPage, true);
        }
        this.setTabIndexForFocusLastElement();
        if (!this.hasParent) {
            this.element.tabIndex = 0;
        }
        if (this.hasParent) {
            this.element.tabIndex = -1;
        }
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if (e.altKey) {
            if (e.keyCode === 74) {
                const focusablePagerElements: Element[] = this.getFocusablePagerElements(this.element, []);
                if (focusablePagerElements.length > 0) {
                    (focusablePagerElements[0] as HTMLElement).focus();
                }
            }
        }
    }

    private keyPressHandler(e: keyPressHandlerKeyboardEventArgs): void {
        const presskey: keyPressHandlerKeyboardEventArgs = <keyPressHandlerKeyboardEventArgs>extend(e, { cancel: false });
        this.notify(events.keyPressed, presskey);
        if (presskey.cancel === true) {
            e.stopImmediatePropagation();
        }
    }

    private addListener(): void {
        if (this.isDestroyed) { return; }
        if (!this.hasParent) {
            this.on(events.keyPressed, this.onKeyPress, this);
        }
    }

    private removeListener(): void {
        if (this.isDestroyed) { return; }
        if (!this.hasParent) {
            this.off(events.keyPressed, this.onKeyPress);
        }
    }

    private onKeyPress(e: KeyboardEventArgs): void {
        if (!this.hasParent) {
            if (this.checkPagerHasFocus()) {
                this.changePagerFocus(e);
            } else {
                e.preventDefault();
                this.setPagerFocus();
            }
        }
    }

    /**
     * @returns {boolean} - Return the true value if pager has focus
     * @hidden */
    public checkPagerHasFocus(): boolean {
        return this.getFocusedTabindexElement() ? true : false;
    }

    /**
     * @returns {void}
     * @hidden */
    public setPagerContainerFocus(): void {
        (this.element as HTMLElement).focus();
    }

    /**
     * @returns {void}
     * @hidden */
    public setPagerFocus(): void {
        const focusablePagerElements: Element[] = this.getFocusablePagerElements(this.element, []);
        if (focusablePagerElements.length > 0) {
            (focusablePagerElements[0] as HTMLElement).focus();
        }
    }

    private setPagerFocusForActiveElement(): void {
        const currentActivePage: Element = this.getActiveElement();
        if (currentActivePage) {
            (currentActivePage as HTMLElement).focus();
        }
    }

    private setTabIndexForFocusLastElement(): void {
        const focusablePagerElements: Element[] = this.getFocusablePagerElements(this.element, []);
        const dropDownPage: Element = this.getDropDownPage();
        if (this.pageSizes && dropDownPage && !isNullOrUndefined((dropDownPage as HTMLElement).offsetParent)) {
            (dropDownPage as HTMLElement).tabIndex = 0;
        } else if (focusablePagerElements.length > 0) {
            (focusablePagerElements[focusablePagerElements.length - 1] as HTMLElement).tabIndex = 0;
        }
    }

    /**
     * @param {KeyboardEventArgs} e - Keyboard Event Args
     * @returns {void}
     * @hidden */
    public changePagerFocus(e: KeyboardEventArgs): void {
        this.keyAction = e.key;
        if (e.shiftKey && e.keyCode === 9) {
            this.changeFocusByShiftTab(e);
        } else if (e.keyCode === 9) {
            this.changeFocusByTab(e);
        } else if (e.keyCode === 13 || e.keyCode === 32) {
            this.navigateToPageByEnterOrSpace(e);
        } else if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 35 || e.keyCode === 36) {
            this.navigateToPageByKey(e);
        }
        this.keyAction = '';
    }

    private getFocusedTabindexElement(): Element {
        let focusedTabIndexElement: Element;
        const tabindexElements: NodeListOf<Element> = this.element.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        for ( let i: number = 0; i < tabindexElements.length; i++) {
            const element: Element = tabindexElements[parseInt(i.toString(), 10)];
            if (element && (element.classList.contains('e-focused') || element.classList.contains('e-input-focus'))) {
                focusedTabIndexElement = element;
                break;
            }
        }
        return focusedTabIndexElement;
    }

    private changeFocusByTab(e: KeyboardEventArgs): void {
        const currentItemPagerFocus: Element = this.getFocusedTabindexElement();
        const focusablePagerElements: Element[] = this.getFocusablePagerElements(this.element, []);
        const dropDownPage: Element = this.getDropDownPage();
        if (focusablePagerElements.length > 0) {
            if (this.pageSizes && dropDownPage && currentItemPagerFocus === focusablePagerElements[focusablePagerElements.length - 1]) {
                (dropDownPage as HTMLElement).tabIndex = 0;
            } else {
                for (let i: number = 0; i < focusablePagerElements.length; i++) {
                    if (currentItemPagerFocus === focusablePagerElements[parseInt(i.toString(), 10)]) {
                        const incrementNumber: number = i + 1;
                        if (incrementNumber < focusablePagerElements.length) {
                            e.preventDefault();
                            (focusablePagerElements[parseInt(incrementNumber.toString(), 10)] as HTMLElement).focus();
                        }
                        break;
                    }
                }
            }
        }
    }

    private changeFocusByShiftTab(e: KeyboardEventArgs): void {
        const currentItemPagerFocus: Element = this.getFocusedTabindexElement();
        const focusablePagerElements: Element[] = this.getFocusablePagerElements(this.element, []);
        const dropDownPage: Element = this.getDropDownPage();
        if (this.pageSizes && dropDownPage && dropDownPage.classList.contains('e-input-focus')) {
            (dropDownPage as HTMLElement).tabIndex = -1;
            this.addFocus(focusablePagerElements[focusablePagerElements.length - 1], true);
        } else if (focusablePagerElements.length > 0) {
            for (let i: number = 0; i < focusablePagerElements.length; i++) {
                if (currentItemPagerFocus === focusablePagerElements[parseInt(i.toString(), 10)]) {
                    const decrementNumber: number = i - 1;
                    if (decrementNumber >= 0) {
                        e.preventDefault();
                        (focusablePagerElements[parseInt(decrementNumber.toString(), 10)] as HTMLElement).focus();
                    } else if (this.hasParent) {
                        const rows: Element[] = (this.parent as {getRows(): Element[]}).getRows();
                        const lastRow: Element = rows[rows.length - 1];
                        const lastCell: Element = lastRow.lastChild as Element;
                        e.preventDefault();
                        (lastCell as HTMLElement).focus();
                        this.firstPagerFocus = true;
                    }
                    break;
                }
            }
        }
    }

    /**
     * @returns {void}
     * @hidden */
    public checkFirstPagerFocus(): boolean {
        if (this.firstPagerFocus) {
            this.firstPagerFocus = false;
            return true;
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private navigateToPageByEnterOrSpace(e: KeyboardEventArgs): void {
        const currentItemPagerFocus: Element = this.getFocusedElement();
        if (currentItemPagerFocus) {
            this.goToPage(parseInt(currentItemPagerFocus.getAttribute('index'), 10));
            const currentActivePage: Element = this.getActiveElement();
            const selectedClass: string = this.getClass(currentItemPagerFocus);
            const classElement: Element = this.getElementByClass(selectedClass);
            if ((selectedClass === 'e-first' || selectedClass === 'e-prev' || selectedClass === 'e-next'
                || selectedClass === 'e-last' || selectedClass === 'e-pp' || selectedClass === 'e-np')
                && classElement && !classElement.classList.contains('e-disable')) {
                (classElement as HTMLElement).focus();
            } else if (this.checkFocusInAdaptiveMode(currentItemPagerFocus)) {
                this.changeFocusInAdaptiveMode(currentItemPagerFocus);
            }
            else {
                if (currentActivePage) {
                    (currentActivePage as HTMLElement).focus();
                }
            }
        }
    }

    private navigateToPageByKey(e: KeyboardEventArgs): void {
        const actionClass: string = e.keyCode === 37 ? '.e-prev' : e.keyCode === 39 ? '.e-next'
            : e.keyCode === 35 ? '.e-last' : e.keyCode === 36 ? '.e-first' : '';
        const pagingItem: Element = this.element.querySelector(actionClass);
        const currentItemPagerFocus: Element = this.getFocusedElement();
        if (!isNullOrUndefined(pagingItem) && pagingItem.hasAttribute('index')
            && !isNaN(parseInt(pagingItem.getAttribute('index'), 10))) {
            this.goToPage(parseInt(pagingItem.getAttribute('index'), 10));
            const currentActivePage: Element = this.getActiveElement();
            if (this.checkFocusInAdaptiveMode(currentItemPagerFocus)) {
                this.changeFocusInAdaptiveMode(currentItemPagerFocus);
            } else {
                if (currentActivePage) {
                    (currentActivePage as HTMLElement).focus();
                }
            }
        }
    }

    private checkFocusInAdaptiveMode(element: Element): boolean {
        const selectedClass: string = this.getClass(element);
        return selectedClass === 'e-mfirst' || selectedClass === 'e-mprev' || selectedClass === 'e-mnext'
        || selectedClass === 'e-mlast' ? true : false;
    }

    private changeFocusInAdaptiveMode(element: Element): void {
        const selectedClass: string = this.getClass(element);
        const classElement: Element = this.getElementByClass(selectedClass);
        if (classElement && classElement.classList.contains('e-disable')) {
            if (selectedClass === 'e-mnext' || selectedClass === 'e-mlast') {
                const mPrev: Element = this.element.querySelector('.e-mprev');
                (mPrev as HTMLElement).focus();
            } else {
                this.setPagerFocus();
            }
        }
    }

    private removeTabindexLastElements(): void {
        const tabIndexElements: NodeListOf<Element> = this.element.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        if (tabIndexElements.length > 1) {
            for ( let i: number = 1; i < tabIndexElements.length; i++) {
                const element: Element = tabIndexElements[parseInt(i.toString(), 10)];
                if (element) {
                    (element as HTMLElement).tabIndex = -1;
                }
            }
        }
    }

    private getActiveElement(): Element {
        return this.element.querySelector('.e-active');
    }

    /**
     * @returns {Element} - Returns DropDown Page
     * @hidden */
    public getDropDownPage(): Element {
        const dropDownPageHolder: Element = this.element.querySelector('.e-pagerdropdown');
        let dropDownPage: Element;
        if (dropDownPageHolder) {
            dropDownPage = dropDownPageHolder.children[0];
        }
        return dropDownPage;
    }

    private getFocusedElement(): Element {
        return this.element.querySelector('.e-focused');
    }

    private getClass(element: Element): string {
        let currentClass: string;
        const classList: string[] = ['e-mfirst', 'e-mprev', 'e-first', 'e-prev', 'e-pp',
            'e-np', 'e-next', 'e-last', 'e-mnext', 'e-mlast'];
        for ( let i: number = 0; i < classList.length; i++) {
            if (element && element.classList.contains(classList[parseInt(i.toString(), 10)])) {
                currentClass = classList[parseInt(i.toString(), 10)];
                return currentClass;
            }
        }
        return currentClass;
    }

    private getElementByClass(className: string): Element {
        return this.element.querySelector('.' + className);
    }

    /**
     * @param {Element} element - Pager element
     * @param {Element[]} previousElements - Iterating pager element
     * @returns {Element[]} - Returns focusable pager element
     * @hidden */
    public getFocusablePagerElements(element: Element, previousElements: Element[]): Element[] {
        const target: Element = element;
        const targetChildrens: HTMLCollection = target.children;
        let pagerElements: Element[] = previousElements;
        for (let i: number = 0; i < targetChildrens.length; i++) {
            const element: Element = targetChildrens[parseInt(i.toString(), 10)];
            if (element.children.length > 0 && !element.classList.contains('e-pagesizes')) {
                pagerElements = this.getFocusablePagerElements(element, pagerElements);
            } else {
                const tabindexElement: Element = targetChildrens[parseInt(i.toString(), 10)];
                if (tabindexElement.hasAttribute('tabindex') && !element.classList.contains('e-disable')
                    && (element as HTMLElement).style.display !== 'none'
                    && !isNullOrUndefined((element as HTMLElement).offsetParent)){
                    pagerElements.push(tabindexElement);
                }
            }
        }
        return pagerElements;
    }

    private addFocus(element: Element, addFocusClass: boolean): void {
        if (!isNullOrUndefined(element)) {
            if (addFocusClass) {
                addClass([element], ['e-focused', 'e-focus']);
            }
            (element as HTMLElement).tabIndex = 0;
        }
    }

    private removeFocus(element: Element, removeFocusClass: boolean): void {
        if (removeFocusClass) {
            removeClass([element], ['e-focused', 'e-focus']);
        }
        (element as HTMLElement).tabIndex = -1;
    }

    /**
     * Gets the localized label by locale keyword.
     *
     * @param  {string} key - specifies the key
     * @returns {string} returns the localized label
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObj.getConstant(key);
    }

    /**
     * Navigate to target page by given number.
     *
     * @param  {number} pageNo - Defines page number.
     * @returns {void}
     */
    public goToPage(pageNo: number): void {
        if (this.checkGoToPage(pageNo)) {
            this.currentPage = pageNo;
            this.isInteracted = false;
            this.dataBind();
        }
    }

    /**
     * @param {number} pageSize - specifies the pagesize
     * @returns {void}
     * @hidden
     */
    public setPageSize(pageSize: number): void {
        this.pageSize = pageSize;
        this.dataBind();
    }

    private checkpagesizes(): boolean {
        if (this.pageSizes === true || (<number[]>this.pageSizes).length) {
            return true;
        }
        return false;
    }

    private checkGoToPage(newPageNo: number, oldPageNo?: number): boolean {
        if (newPageNo !== this.currentPage) {
            this.previousPageNo = this.currentPage;
        }
        if (!isNullOrUndefined(oldPageNo)) {
            this.previousPageNo = oldPageNo;
        }
        if (this.previousPageNo !== newPageNo && (newPageNo >= 1 && newPageNo <= this.totalPages)) {
            return true;
        }
        return false;
    }

    private currentPageChanged(newProp: PagerModel, oldProp: PagerModel): void {
        if (this.enableQueryString) {
            this.updateQueryString(this.currentPage);
        }
        if (newProp.currentPage !== oldProp.currentPage || newProp.pageSize !== oldProp.pageSize) {
            const args: { currentPage: number, newProp: PagerModel, oldProp: PagerModel, cancel: boolean, isInteracted: boolean } = {
                currentPage: this.currentPage,
                newProp: newProp, oldProp: oldProp, cancel: false, isInteracted: this.isInteracted
            };
            this.trigger('click', args);
            if (!args.cancel) {
                this.isCancel = false;
                this.refresh();
            }
            else {
                this.isCancel = true;
                if (oldProp && oldProp.pageSize) {
                    this.setProperties({ pageSize: oldProp.pageSize }, true);
                    if (this.pagerdropdownModule) {
                        this.pagerdropdownModule.setDropDownValue('value', oldProp.pageSize);
                        this.pagerdropdownModule['dropDownListObject'].text = oldProp.pageSize + '';
                    }
                }
            }
        }
    }

    private pagerTemplate(): void {
        if (this.isReactTemplate() && this.hasParent) { return; }
        let result: Element[];
        this.element.classList.add('e-pagertemplate');
        this.compile(this.template);
        const data: object = {
            currentPage: this.currentPage, pageSize: this.pageSize, pageCount: this.pageCount,
            totalRecordsCount: this.totalRecordsCount, totalPages: this.totalPages
        };
        const tempId: string = this.element.parentElement.id + '_template';
        if (this.isReactTemplate() && !this.isVue) {
            this.getPagerTemplate()(data, this, 'pagerTemplate', tempId, null, null, this.element);
            this.renderReactTemplates();
        } else {
            result = this.isVue ? this.getPagerTemplate()(data, this, 'pagerTemplate', null, null, null, null, this.root) as Element[]
                : this.getPagerTemplate()(data);
            appendChildren(this.element, result);
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public updateTotalPages(): void {
        this.totalPages = this.isAllPage ? 1 : (this.totalRecordsCount % this.pageSize === 0) ? (this.totalRecordsCount / this.pageSize) :
            (parseInt((this.totalRecordsCount / this.pageSize).toString(), 10) + 1);
    }

    /**
     * @returns {Function} returns the function
     * @hidden
     */
    public getPagerTemplate(): Function {
        return this.templateFn;
    }

    /**
     * @param {string | Function} template - specifies the template
     * @returns {Function} returns the function
     * @hidden
     */
    public compile(template: string | Function): Function {
        if (template) {
            try {
                if (typeof template === 'function') {
                    this.templateFn = templateCompiler(template);
                } else {
                    if (document.querySelectorAll(template).length) {
                        this.templateFn = templateCompiler(document.querySelector(template).innerHTML.trim());
                    } else {
                        this.templateFn = templateCompiler(template);
                    }
                }
            } catch (e) {
                this.templateFn = templateCompiler(template);
            }
        }
        return undefined;
    }

    /**
     * Refreshes page count, pager information and external message.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (this.template) {
            if (this.isReactTemplate()) {
                this.updateTotalPages();
                this.notify(this.pageRefresh, {});
            } else {
                this.element.innerHTML = '';
                this.updateTotalPages();
                this.pagerTemplate();
            }
        } else {
            this.updateRTL();
            const focusedTabIndexElement: Element = this.getFocusedTabindexElement();
            this.containerModule.refresh();
            this.removeTabindexLastElements();
            if (focusedTabIndexElement && focusedTabIndexElement.classList.contains('e-disable')) {
                if (this.checkFocusInAdaptiveMode(focusedTabIndexElement)) {
                    this.changeFocusInAdaptiveMode(focusedTabIndexElement);
                } else {
                    this.setPagerFocusForActiveElement();
                }
            }
            if (this.enablePagerMessage) {
                this.pagerMessageModule.refresh();
            }
            if (this.pagerdropdownModule) {
                this.pagerdropdownModule.refresh();
            }
            if (this.enableExternalMessage && this.externalMessageModule) {
                this.externalMessageModule.refresh();
            }
            this.setTabIndexForFocusLastElement();
            this.resizePager();
        }
    }

    private updateRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private initLocalization(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultConstants, this.locale);
    }

    private updateQueryString(value: number): void {
        const updatedUrl: string = this.getUpdatedURL(window.location.href, 'page', value.toString());
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);
    }

    private getUpdatedURL(uri: string, key: string, value: string): string {
        const regExp: RegExpConstructor = RegExp;
        const regx: RegExp = new regExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
        if (uri.match(regx)) {
            return uri.replace(regx, '$1' + key + '=' + value + '$2');
        } else {
            let hash: string = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            return uri + (uri.indexOf('?') !== -1 ? '&' : '?') + key + '=' + value + hash;
        }
    }

    private renderFirstPrevDivForDevice(): void {
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mfirst e-icons e-icon-first',
                attrs: { title: this.getLocalizedLabel('firstPageTooltip'), tabindex: '-1' }
            }));
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mprev e-icons e-icon-prev',
                attrs: { title: this.getLocalizedLabel('previousPageTooltip'), tabindex: '-1' }
            }));
    }

    private renderNextLastDivForDevice(): void {
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mnext e-icons e-icon-next',
                attrs: { title: this.getLocalizedLabel('nextPageTooltip'), tabindex: '-1' }
            }));
        this.element.appendChild(createElement(
            'div', {
                className: 'e-mlast e-icons e-icon-last',
                attrs: { title: this.getLocalizedLabel('lastPageTooltip'), tabindex: '-1' }
            }));
    }

    private addAriaLabel(): void {
        const classList: string[] = ['.e-mfirst', '.e-mprev', '.e-mnext', '.e-mlast'];
        if (!Browser.isDevice) {
            for (let i: number = 0; i < classList.length; i++) {
                const element: Element = this.element.querySelector(classList[parseInt(i.toString(), 10)]);
                element.setAttribute('aria-label', element.getAttribute('title'));
            }
        }
    }

    private isReactTemplate(): boolean {
        return (this.isReact || this.isVue) && this.template && typeof (this.template) !== 'string';
    }

    /**
     * Loop through all the inner elements of pager to calculate the required width for pager child elements.
     *
     * @returns {number} returns the actual width occupied by pager elements.
     */
    private calculateActualWidth(): number {
        const pagerElements: NodeListOf<HTMLElement> = this.element.querySelectorAll(
            /* tslint:disable-next-line:max-line-length */
            '.e-mfirst, .e-mprev, .e-icon-first, .e-icon-prev, .e-pp:not(.e-disable), .e-numericitem:not(.e-hide), .e-numericitem.e-active.e-hide, .e-np:not(.e-disable), .e-icon-next, .e-icon-last, .e-parentmsgbar, .e-mnext, .e-mlast, .e-pagerdropdown, .e-pagerconstant');
        let actualWidth: number = 0;
        for (let i: number = 0; i < pagerElements.length; i++) {
            if (getComputedStyle(pagerElements[parseInt(i.toString(), 10)]).display !== 'none') {
                actualWidth += pagerElements[parseInt(i.toString(), 10)].offsetWidth
                + parseFloat(getComputedStyle(pagerElements[parseInt(i.toString(), 10)]).marginLeft)
                + parseFloat(getComputedStyle(pagerElements[parseInt(i.toString(), 10)]).marginRight);
            }
        }
        const pagerContainer: HTMLElement = this.element.querySelector('.e-pagercontainer');
        actualWidth += parseFloat(getComputedStyle(pagerContainer).marginLeft)
        + parseFloat(getComputedStyle(pagerContainer).marginRight);
        return actualWidth;
    }

    /**
     * Resize pager component by hiding pager component's numeric items based on total width available for pager.
     *
     * @returns {void}
     */
    private resizePager(): void {
        const isStyleApplied: boolean = this.element.classList.contains('e-pager') ? getComputedStyle(this.element).getPropertyValue('border-style').includes('solid') : null;
        if (!(this.template) && isStyleApplied) {
            const pagerContainer: HTMLElement = this.element.querySelector('.e-pagercontainer');
            let actualWidth: number = this.calculateActualWidth();
            const pagerWidth: number = this.element.clientWidth
             - parseFloat(getComputedStyle(this.element).paddingLeft)
            - parseFloat(getComputedStyle(this.element).paddingRight)
             - parseFloat(getComputedStyle(this.element).marginLeft)
              - parseFloat(getComputedStyle(this.element).marginRight);
            let numItems: NodeListOf<HTMLElement> = pagerContainer.querySelectorAll(
                '.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
            const hiddenNumItems: NodeListOf<HTMLElement> = pagerContainer.querySelectorAll(
                '.e-numericitem.e-hide:not([style*="display: none"])');
            const hideFrom: number = numItems.length;
            const showFrom: number = 1;
            const bufferWidth: number = (!isNullOrUndefined(parentsUntil(this.element, 'e-bigger'))) ? 10 : 5;
            const NP: HTMLElement = pagerContainer.querySelector('.e-np');
            const PP: HTMLElement = pagerContainer.querySelector('.e-pp');
            const detailItems: NodeListOf<HTMLElement> = this.element.querySelectorAll('.e-parentmsgbar:not(.e-hide):not([style*="display: none"]), .e-pagesizes:not(.e-hide):not([style*="display: none"])');
            let totDetailWidth: number = 0;
            if (detailItems.length) {
                detailItems.forEach((item: HTMLElement) => {
                    totDetailWidth += item.offsetWidth;
                });
                this.averageDetailWidth = totDetailWidth / detailItems.length;
            }
            let totalWidth: number = 0;
            /**
             * Loop to calculate average width of numeric item.
             */
            for (let i: number = 0; i < numItems.length; i++) {
                totalWidth += numItems[parseInt(i.toString(), 10)].offsetWidth
                + parseFloat(getComputedStyle(numItems[parseInt(i.toString(), 10)]).marginLeft)
                + parseFloat(getComputedStyle(numItems[parseInt(i.toString(), 10)]).marginRight);
            }
            const numericItemWidth: number = totalWidth / numItems.length ;
            /**
             * Condition to hide numeric items when calculated actual width exceeds available pager space.
             */
            if (pagerWidth > 0 && (actualWidth >= (pagerWidth - (numericItemWidth ? numericItemWidth : 0)))) {
                this.isPagerResized = true;
                if (this.currentPage !== this.totalPages) {
                    classList(NP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
                }
                actualWidth = this.calculateActualWidth();
                const diff: number = Math.abs((actualWidth) - pagerWidth);
                // To calculate number of numeric items need to be hidden.
                let numToHide: number = Math.ceil(diff / (numericItemWidth));
                numToHide = (numToHide === 0) ? 1 : (numToHide > numItems.length) ? (numItems.length - 1) : numToHide;

                for (let i: number = 1; i <= numToHide; i++) {
                    let hideIndex: number = hideFrom - parseInt(i.toString(), 10);
                    numItems = pagerContainer.querySelectorAll('.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
                    if (this.currentPage !== 1 && ((parseInt(numItems[Math.abs(hideIndex)].getAttribute('index'), 10) === this.currentPage)
                    || parseInt(numItems[numItems.length - 1].getAttribute('index'), 10) === this.currentPage)) {
                        hideIndex = 0;
                        classList(PP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
                    }
                    if (numItems[Math.abs(hideIndex)] && !(numItems[Math.abs(hideIndex)].classList.contains('e-currentitem'))) {
                        numItems[Math.abs(hideIndex)].classList.add('e-hide');
                    }
                }
                numItems = pagerContainer.querySelectorAll('.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
                // To hide Pager message elements when no more numeric items available to hide.
                if (numItems.length <= 1 && detailItems.length && window.innerWidth >= 768) {
                    const pagerDetailItemsWidth: number = this.calculateActualWidth();
                    if ((pagerDetailItemsWidth) > (pagerWidth - bufferWidth)) {
                        let detailtoHide: number = Math.floor((pagerWidth - (pagerDetailItemsWidth - totDetailWidth))
                         / this.averageDetailWidth);
                        detailtoHide = detailItems.length - detailtoHide;
                        for (let i: number = 0; i < (detailtoHide > detailItems.length ? detailItems.length : detailtoHide); i++) {
                            detailItems[parseInt(i.toString(), 10)].classList.add('e-hide');
                        }
                    }
                }
            }
            /**
             * Condition to show numeric items when space availble in pager at dom.
             */
            else if (actualWidth < (pagerWidth) && hiddenNumItems.length) {
                const diff: number = Math.abs(pagerWidth - (actualWidth));
                const hiddenDetailItems: NodeListOf<HTMLElement> = this.element.querySelectorAll('.e-parentmsgbar.e-hide, .e-pagesizes.e-hide');
                // To show Pager message elements.
                if (hiddenDetailItems.length && (diff > (this.averageDetailWidth + (this.averageDetailWidth / 4)))) {
                    hiddenDetailItems[(hiddenDetailItems.length - 1)].classList.remove('e-hide');
                }
                if ((diff > (numericItemWidth * 2) && !hiddenDetailItems.length  && window.innerWidth >= 768)) {
                    // To calculate number of numeric items need to be shown.
                    let numToShow: number = Math.floor((diff) / (numericItemWidth + bufferWidth));
                    numToShow = (numToShow > hiddenNumItems.length) ? hiddenNumItems.length : (numToShow - 1);
                    //Seggregating hidden num items as less index and greater index values than current page value.
                    const lesserIndexItems: HTMLElement[] = Array.from(hiddenNumItems).filter((item: HTMLElement) => parseInt(item.getAttribute('index'), 10) < this.currentPage).sort((a: HTMLElement, b: HTMLElement) => parseInt(b.getAttribute('index'), 10) - parseInt(a.getAttribute('index'), 10));
                    const greaterIndexItems: HTMLElement[] = Array.from(hiddenNumItems).filter((item: HTMLElement) => parseInt(item.getAttribute('index'), 10) > this.currentPage);

                    let showItems: HTMLElement[] = (lesserIndexItems.length && lesserIndexItems)
                        || (greaterIndexItems.length && greaterIndexItems);

                    for (let i: number = 1; i <= numToShow; i++) {
                        const showItem: HTMLElement = showItems && showItems[Math.abs(showFrom - i)];

                        if (showItem) {
                            showItem.classList.remove('e-hide');

                            if (showItem === showItems[showItems.length - 1]) {
                                showItems = null;
                            }
                        }
                    }
                }
            }
            numItems = pagerContainer.querySelectorAll(
                '.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
            if (numItems.length) {
                if (parseInt(numItems[numItems.length - 1].getAttribute('index'), 10) === this.totalPages) {
                    classList(NP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
                }
                if (parseInt(numItems[0].getAttribute('index'), 10) === 1) {
                    classList(PP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
                }
                const isLastSet: boolean = Array.from(numItems).some((item: HTMLElement) => parseInt(item.getAttribute('index'), 10) === this.totalPages);
                const ppIndex: number = (parseInt(numItems[0].getAttribute('index'), 10) - (isLastSet ? this.avgNumItems : numItems.length));
                PP.setAttribute('index', (ppIndex < 1) ? '1' : ppIndex.toString());
                NP.setAttribute('index', (parseInt(numItems[numItems.length - 1].getAttribute('index'), 10) + 1).toString());
                this.avgNumItems = isLastSet ? this.avgNumItems : numItems.length;
            }
            /**
             * Condition to add adaptive class name and set pagermessage content with "/" when media query css has been applied.
             */
            if (((this.element.offsetWidth < 769) && window.getComputedStyle(this.element.querySelector('.e-mfirst')).getPropertyValue('display') !== 'none') && this.pageSizes) {
                this.element.querySelector('.e-pagesizes').classList.remove('e-hide');
                this.element.querySelector('.e-parentmsgbar').classList.remove('e-hide');
                this.element.classList.add('e-adaptive');
                this.element.querySelector('.e-pagenomsg').innerHTML = this.element.offsetWidth < 481 ? (this.currentPage + ' / ' + this.totalPages) : this.pagerMessageModule.format(
                    this.getLocalizedLabel('currentPageInfo'), [this.totalRecordsCount === 0 ? 0 :
                        this.currentPage, this.totalPages || 0, this.totalRecordsCount || 0]) + ' ';
            }
            else {
                this.element.classList.remove('e-adaptive');
                this.element.querySelector('.e-pagenomsg').innerHTML = this.pagerMessageModule.format(
                    this.getLocalizedLabel('currentPageInfo'), [this.totalRecordsCount === 0 ? 0 :
                        this.currentPage, this.totalPages || 0, this.totalRecordsCount || 0]) + ' ';
            }
        }
    }
}
