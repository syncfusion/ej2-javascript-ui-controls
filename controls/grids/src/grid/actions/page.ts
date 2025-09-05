import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Pager } from '../../pager/pager';
import { PagerDropDown } from '../../pager/pager-dropdown';
import { ExternalMessage } from '../../pager/external-message';
import { PageSettingsModel } from '../models/page-settings-model';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { extend as gridExtend, getActualProperties, isActionPrevent, addRemoveEventListener, appendChildren } from '../base/util';
import * as events from '../base/constant';
import { PagerModel } from '../../pager';
import * as literals from '../base/string-literals';

/**
 * The `Page` module is used to render pager and handle paging action.
 */
export class Page implements IAction {
    //Internal variables
    private element: HTMLElement;
    private pageSettings: PageSettingsModel;
    /** @hidden */
    public isForceCancel: boolean;
    private isInitialLoad: boolean;
    private isInitialRender: boolean = true;
    private evtHandlers: { event: string, handler: Function }[];
    /** @hidden */
    public isCancel: boolean = false;

    //Module declarations
    private parent: IGrid;
    /** @hidden */
    public pagerObj: Pager;
    private handlers: {
        load: Function,
        end: Function,
        inboundChange?: Function,
        ready: Function,
        updateLayout: Function,
        complete: Function,
        keyPress: Function,
        created: Function
    };

    /**
     * Constructor for the Grid paging module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {PageSettingsModel} pageSettings - specifies the PageSettingsModel
     * @hidden
     */
    constructor(parent?: IGrid, pageSettings?: PageSettingsModel) {
        Pager.Inject(ExternalMessage, PagerDropDown);
        this.parent = parent;
        this.pageSettings = pageSettings;
        this.addEventListener();
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
     * The function used to render pager from grid pageSettings
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        const gObj: IGrid = this.parent;
        this.pagerDestroy();
        if (!isNullOrUndefined(this.parent.pagerTemplate)) {
            this.pageSettings.template = this.parent.pagerTemplate;
            this.parent.pageTemplateChange = true;
        }
        this.element = this.parent.createElement('div', { className: 'e-gridpager' });
        const pagerObj: PagerModel = <PagerModel>gridExtend(
            {},
            extend({}, getActualProperties(this.pageSettings)),
            {
                click: this.clickHandler.bind(this),
                dropDownChanged: this.onSelect.bind(this),
                enableRtl: gObj.enableRtl, locale: gObj.locale,
                created: this.addAriaAttr.bind(this)
            },
            ['parentObj', 'propName']);
        pagerObj.cssClass = this.parent.cssClass ? this.parent.cssClass : '';
        this.pagerObj = new Pager(pagerObj, undefined, this.parent);
        this.pagerObj.root = gObj.root ? gObj.root : gObj;
        this.pagerObj.hasParent = true;
        this.pagerObj.on(events.pagerRefresh, this.renderReactPagerTemplate, this);
        this.pagerObj.allowServerDataBinding = false;
    }

    private onSelect(e: Pager): void {
        this.pageSettings.pageSize = e.pageSize;
        if (!this.isInitialLoad) {
            this.pageSettings.currentPage = 1;
        }
    }

    private addAriaAttr(): void {
        if (!(this.pageSettings.template)) {
            if (this.parent.getContentTable()) {
                this.element.setAttribute('aria-controls', this.parent.getContentTable().id);
            }
            const numericContainerNew: Element = this.parent.createElement('div', { className: 'e-numericcontainer' });
            const pagerContainer: Element = this.element.querySelector('.e-pagercontainer');
            const frag: DocumentFragment = document.createDocumentFragment();
            const numericContainer: Element = this.element.querySelector('.e-numericcontainer');
            const links: NodeList = numericContainer.querySelectorAll('a');
            for (let i: number = 0; i < links.length; i++) {
                const numericContainerDiv: Element = this.parent.createElement('div');
                numericContainerDiv.appendChild(links[parseInt(i.toString(), 10)]);
                frag.appendChild(numericContainerDiv);
            }
            numericContainerNew.appendChild(frag);
            pagerContainer.replaceChild(numericContainerNew, numericContainer);
        }
    }

    private dataReady(e?: NotifyArgs): void {
        this.updateModel(e);
    }

    /**
     * Refreshes the page count, pager information, and external message.
     *
     * @returns {void}
     */
    public refresh(): void {
        this.pagerObj.refresh();
    }

    /**
     * Navigates to the target page according to the given number.
     *
     * @param  {number} pageNo - Defines the page number to navigate.
     * @returns {void}
     */
    public goToPage(pageNo: number): void {
        this.pagerObj.goToPage(pageNo);
    }

    /**
     * @param {number} pageSize - specifies the page size
     * @returns {void}
     * @hidden
     */
    public setPageSize(pageSize: number): void {
        this.pagerObj.setPageSize(pageSize);
    }

    /**
     * The function used to update pageSettings model
     *
     * @param {NotifyArgs} e - specfies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public updateModel(e?: NotifyArgs): void {
        this.parent.pageSettings.totalRecordsCount = e.count;
        const isAddAction: boolean = (e.action === 'add' && e.requestType === 'save') || (e.requestType === 'batchsave');
        if (this.pagerObj.isAllPage && !isAddAction) {
            this.parent.pageSettings.pageSize = this.parent.pageSettings.totalRecordsCount;
        }
        if (isAddAction) {
            if (this.pagerObj.isAllPage && (e.count === this.pageSettings.pageSize)) {
                this.pagerObj.setProperties({ pageSize: e.count }, true);
            }
        }
        this.parent.dataBind();
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, {
            currentPage: this.parent.pageSettings.currentPage, requestType: 'paging',
            type: events.actionComplete
        }));
    }

    /**
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const newProp: Object = e.properties;
        for (const prop of Object.keys(newProp)) {
            this.pagerObj[`${prop}`] = newProp[`${prop}`];
        }
        this.pagerObj.dataBind();
    }

    private clickHandler(e: { currentPage: number, newProp: PagerModel, oldProp: PagerModel, cancel: boolean }): void {
        const gObj: IGrid = this.parent;
        if (this.isForceCancel || isActionPrevent(gObj) && !gObj.prevPageMoving && !this.isCancel) {
            if (!this.isForceCancel) {
                if (!isNullOrUndefined(e.newProp) && !isNullOrUndefined(e.newProp.pageSize)) {
                    gObj.notify(events.preventBatch, { instance: this, handler: this.setPageSize, arg1: e.newProp.pageSize });
                    this.pagerObj.setProperties({ pageSize: e.oldProp.pageSize }, true);
                    this.parent.setProperties({ pageSettings: { pageSize: e.oldProp.pageSize } }, true);
                    this.pagerObj.setProperties({
                        currentPage: gObj.pageSettings.currentPage === this.pagerObj.currentPage ?
                            this.pagerObj.previousPageNo : gObj.pageSettings.currentPage
                    }, true);
                } else if (e.currentPage) {
                    gObj.notify(events.preventBatch, { instance: this, handler: this.goToPage, arg1: e.currentPage });
                    this.pagerObj.currentPage = gObj.pageSettings.currentPage === this.pagerObj.currentPage ?
                        this.pagerObj.previousPageNo : gObj.pageSettings.currentPage;
                }
                this.isForceCancel = true;

                this.pagerObj.dataBind();
            } else {
                this.isForceCancel = false;
            }
            e.cancel = true;
            return;
        }
        gObj.pageSettings.pageSize = this.pagerObj.pageSize;
        gObj.prevPageMoving = false;
        const prevPage: number = this.pageSettings.currentPage;
        const args: Object = {
            cancel: false, requestType: 'paging', previousPage: prevPage,
            currentPage: e.currentPage, pageSize: gObj.pageSettings.pageSize, type: events.actionBegin
        };
        if (!this.isCancel) {
            this.pageSettings.currentPage = e.currentPage;
            this.parent.notify(events.modelChanged, args);
            gObj.pageRequireRefresh = false;
        }
        if ((<{ cancel?: boolean }>args).cancel) {
            e.cancel = true;
            this.parent.setProperties({ pageSettings: { currentPage: prevPage }}, true);
            this.pagerObj.setProperties({ currentPage: prevPage }, true);
            this.isCancel = true;
            return;
        }
        this.isCancel = false;
        this.parent.requestTypeAction = 'paging';
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        if (e.action in keyActions) {
            e.preventDefault();
            const element: HTMLElement = this.element.querySelector(keyActions[e.action]) as HTMLElement;
            if (!element.classList.contains('e-nextprevitemdisabled')) {
                element.click();
            }
        }
    }

    /**
     * Defines the text of the external message.
     *
     * @param  {string} message - Defines the message to update.
     * @returns {void}
     */
    public updateExternalMessage(message: string): void {
        if (!this.pagerObj.enableExternalMessage) {
            this.pagerObj.enableExternalMessage = true;
            this.pagerObj.dataBind();
        }
        this.pagerObj.externalMessage = message;
        this.pagerObj.dataBind();
    }

    private appendToElement(): void {
        this.isInitialLoad = true;
        this.parent.element.appendChild(this.element);
        this.parent.setGridPager(this.element);
        this.pagerObj.isReact = this.parent.isReact;
        this.pagerObj.isVue = this.parent.isVue || (this.parent.parentDetails && this.parent.parentDetails.parentInstObj
            && this.parent.parentDetails.parentInstObj.isVue);
        this.pagerObj.appendTo(this.element);
        this.isInitialLoad = false;
    }

    private enableAfterRender(e?: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
            this.appendToElement();
            if (this.isReactTemplate()) {
                this.pagerObj.updateTotalPages();
                this.created();
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.render,
            end: this.appendToElement,
            ready: this.dataReady,
            complete: this.onActionComplete,
            updateLayout: this.enableAfterRender,
            inboundChange: this.onPropertyChanged,
            keyPress: this.keyPressHandler,
            created: this.created
        };
        if (this.parent.isDestroyed) { return; }
        if (this.parent.isReact || this.parent.isVue) {
            this.parent.addEventListener(literals.create, this.handlers.created.bind(this));
        }
        this.evtHandlers = [{ event: events.initialLoad, handler: this.handlers.load },
            { event: events.initialEnd, handler: this.handlers.end },
            { event: events.dataReady, handler: this.handlers.ready },
            { event: events.pageComplete, handler: this.handlers.complete },
            { event: events.uiUpdate, handler: this.handlers.updateLayout },
            { event: events.inBoundModelChanged, handler: this.handlers.inboundChange },
            { event: events.keyPressed, handler: this.handlers.keyPress },
            {event: events.destroy, handler: this.destroy}];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    }

    private created(): void {
        if (this.isInitialRender && this.isReactTemplate()) {
            this.isInitialRender = false;
            this.renderReactPagerTemplate();
        }
    }

    private isReactTemplate(): boolean {
        return (this.parent.isReact || this.parent.isVue) && this.pagerObj.template && typeof (this.pagerObj.template) !== 'string';
    }

    private renderReactPagerTemplate(): void {
        if (!this.isInitialRender && this.isReactTemplate()) {
            let result: Element[];
            this.parent.destroyTemplate(['pagerTemplate']);
            this.element.classList.add('e-pagertemplate');
            this.pagerObj.compile(this.pagerObj.template);
            const page: PageSettingsModel = this.parent.pageSettings;
            const data: Object = {
                currentPage: page.currentPage, pageSize: page.pageSize, pageCount: page.pageCount,
                totalRecordsCount: page.totalRecordsCount, totalPages: this.pagerObj.totalPages
            };
            const tempId: string = this.parent.id + '_pagertemplate';
            if (this.parent.isReact) {
                this.pagerObj.templateFn(data, this.parent, 'pagerTemplate', tempId, null, null, this.pagerObj.element);
                this.parent.renderTemplates();
            } else {
                result = this.pagerObj.templateFn(data, this.parent, 'pagerTemplate');
                appendChildren(this.pagerObj.element, result);
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.parent.isReact || this.parent.isVue) {
            this.parent.removeEventListener(literals.create, this.handlers.created);
        }
        this.parent.off(events.pagerRefresh, this.renderReactPagerTemplate);
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    }

    /**
     * To destroy the pager
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.isReactTemplate()) {
            this.parent.destroyTemplate(['pagerTemplate']);
        }
        this.pagerObj.destroy();
    }

    private pagerDestroy(): void {
        if (this.pagerObj && !this.pagerObj.isDestroyed) {
            this.pagerObj.destroy();
            remove(this.element);
        }
    }
}

/**
 * @hidden
 */
const keyActions: {
    pageDown: string;
    pageUp: string;
    ctrlAltPageDown: string;
    ctrlAltPageUp: string;
    altPageUp: string;
    altPageDown: string;
} = {
    pageUp: '.e-prev',
    pageDown: '.e-next',
    ctrlAltPageDown: '.e-last',
    ctrlAltPageUp: '.e-first',
    altPageUp: '.e-pp',
    altPageDown: '.e-np'
};
