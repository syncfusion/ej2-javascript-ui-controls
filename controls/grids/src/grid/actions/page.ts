import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { remove, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { Pager } from '../../pager/pager';
import { PagerDropDown } from '../../pager/pager-dropdown';
import { ExternalMessage } from '../../pager/external-message';
import { PageSettingsModel } from '../models/page-settings-model';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { extend as gridExtend, getActualProperties, isActionPrevent } from '../base/util';
import * as events from '../base/constant';
import { PagerModel } from '../../pager';

/**
 * The `Page` module is used to render pager and handle paging action.
 */
export class Page implements IAction {
    //Internal variables          
    private element: HTMLElement;
    private pageSettings: PageSettingsModel;
    private isForceCancel: boolean;
    private isInitialLoad: boolean;
    private isInitialRender: boolean = true;

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
     * @private
     */
    protected getModuleName(): string {
        return 'pager';
    }

    /**
     * The function used to render pager from grid pageSettings
     * @return {void}
     * @hidden
     */
    public render(): void {
        let gObj: IGrid = this.parent;
        let pagerObj: PagerModel;
        this.pagerDestroy();
        if (!isNullOrUndefined(this.parent.pagerTemplate)) {
            this.pageSettings.template = this.parent.pagerTemplate;
            this.parent.pageTemplateChange = true;
        }
        this.element = this.parent.createElement('div', { className: 'e-gridpager' });
        pagerObj = <PagerModel>gridExtend(
            {},
            extend({}, getActualProperties(this.pageSettings)),
            {
                click: this.clickHandler.bind(this),
                dropDownChanged: this.onSelect.bind(this),
                enableRtl: gObj.enableRtl, locale: gObj.locale,
                created: this.addAriaAttr.bind(this)
            },
            ['parentObj', 'propName']);
        this.pagerObj = new Pager(pagerObj);
        this.pagerObj.hasParent = true;
        this.pagerObj.on('pager-refresh', this.renderReactPagerTemplate, this);
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
            let numericContainerNew: Element = this.parent.createElement('div', { className: 'e-numericcontainer' });
            let pagerContainer: Element = this.element.querySelector('.e-pagercontainer');
            let frag: DocumentFragment = document.createDocumentFragment();
            let numericContainer: Element = this.element.querySelector('.e-numericcontainer');
            let links: NodeList = numericContainer.querySelectorAll('a');
            for (let i: number = 0; i < links.length; i++) {
                if (this.parent.getContentTable()) {
                    (<Element>links[i]).setAttribute('aria-owns', this.parent.getContentTable().id);
                } else {
                    (<Element>links[i]).setAttribute('aria-owns', this.parent.element.getAttribute('id') + '_content_table');
                }
                let numericContainerDiv: Element = this.parent.createElement('div');
                numericContainerDiv.appendChild(links[i]);
                frag.appendChild(numericContainerDiv);
            }
            numericContainerNew.appendChild(frag);
            pagerContainer.replaceChild(numericContainerNew, numericContainer);
            let classList: string[] = ['.e-mfirst', '.e-mprev', '.e-first', '.e-prev', '.e-next', '.e-last', '.e-mnext', '.e-mlast'];
            for (let j: number = 0; j < classList.length; j++) {
                let element: Element = this.element.querySelector(classList[j]);
                if (this.parent.getContentTable()) {
                    element.setAttribute('aria-owns', this.parent.getContentTable().id);
                }
            }
        }
    }

    private dataReady(e?: NotifyArgs): void {
        this.updateModel(e);
    }

    /** 
     * Refreshes the page count, pager information, and external message. 
     * @return {void} 
     */
    public refresh(): void {
        this.pagerObj.refresh();
    }

    /** 
     * Navigates to the target page according to the given number. 
     * @param  {number} pageNo - Defines the page number to navigate. 
     * @return {void} 
     */
    public goToPage(pageNo: number): void {
        this.pagerObj.goToPage(pageNo);
    }

    /**
     * @hidden
     */
    public setPageSize(pageSize: number): void {
        this.pagerObj.setPageSize(pageSize);
    }

    /**
     * The function used to update pageSettings model
     * @return {void}
     * @hidden
     */
    public updateModel(e?: NotifyArgs): void {
        this.parent.pageSettings.totalRecordsCount = e.count;
        this.parent.dataBind();
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        if (isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        this.parent.trigger(events.actionComplete, extend(e, {
            currentPage: this.parent.pageSettings.currentPage, requestType: 'paging',
            type: events.actionComplete
        }));
    }
    /**
     * @hidden
     */
    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }

        let newProp: Object = e.properties;
        for (let prop of Object.keys(newProp)) {
            this.pagerObj[prop] = newProp[prop];
        }
        this.pagerObj.dataBind();
    }

    private clickHandler(e: { currentPage: number, newProp: PagerModel, oldProp: PagerModel, cancel: boolean }): void {
        let gObj: IGrid = this.parent;
        if (this.isForceCancel || isActionPrevent(gObj) && !gObj.prevPageMoving) {
            if (!this.isForceCancel) {
                if (!isNullOrUndefined(e.newProp) && !isNullOrUndefined(e.newProp.pageSize)) {
                    gObj.notify(events.preventBatch, { instance: this, handler: this.setPageSize, arg1: e.newProp.pageSize });
                    this.pagerObj.pageSize = e.oldProp.pageSize;
                    gObj.pageSettings.pageSize = e.newProp.pageSize;
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
        let prevPage: number = this.pageSettings.currentPage;
        this.pageSettings.currentPage = e.currentPage;
        let args: Object = {
            cancel: false, requestType: 'paging', previousPage: prevPage,
            currentPage: e.currentPage, type: events.actionBegin
        };
        this.parent.notify(events.modelChanged, args);
        if ((<{ cancel?: boolean }>args).cancel) {
            e.cancel = true;
        }
        this.parent.requestTypeAction = 'paging';
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        if (e.action in keyActions) {
            e.preventDefault();
            (this.element.querySelector(keyActions[e.action]) as HTMLElement).click();
        }
    }

    /** 
     * Defines the text of the external message.
     * @param  {string} message - Defines the message to update. 
     * @return {void} 
     */
    public updateExternalMessage(message: string): void {
        if (!this.pagerObj.enableExternalMessage) {
            this.pagerObj.enableExternalMessage = true;
            this.pagerObj.dataBind();
        }
        this.pagerObj.externalMessage = message;
        this.pagerObj.dataBind();
    }

    private appendToElement(e?: NotifyArgs): void {
        this.isInitialLoad = true;
        this.parent.element.appendChild(this.element);
        this.parent.setGridPager(this.element);
        this.pagerObj.isReact = this.parent.isReact;
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
        if (this.parent.isReact) {
            this.parent.addEventListener('created', this.handlers.created.bind(this));
        }
        this.parent.on(events.initialLoad, this.handlers.load, this);
        this.parent.on(events.initialEnd, this.handlers.end, this); //For initial rendering
        this.parent.on(events.dataReady, this.handlers.ready, this);
        this.parent.on(events.pageComplete, this.handlers.complete, this);
        this.parent.on(events.uiUpdate, this.handlers.updateLayout, this);
        this.parent.on(events.inBoundModelChanged, this.handlers.inboundChange, this);
        this.parent.on(events.keyPressed, this.handlers.keyPress, this);
    }

    private created(): void {
        if (this.isInitialRender && this.isReactTemplate()) {
            this.isInitialRender = false;
            this.renderReactPagerTemplate();
        }
    }

    private isReactTemplate(): boolean {
        return this.parent.isReact && this.pagerObj.template && typeof (this.pagerObj.template) !== 'string';
    }

    private renderReactPagerTemplate(): void {
        if (!this.isInitialRender && this.isReactTemplate()) {
            this.parent.destroyTemplate(['pagerTemplate']);
            this.element.classList.add('e-pagertemplate');
            this.pagerObj.compile(this.pagerObj.template);
            let page: PageSettingsModel = this.parent.pageSettings;
            let data: Object = {
                currentPage: page.currentPage, pageSize: page.pageSize, pageCount: page.pageCount,
                totalRecordsCount: page.totalRecordsCount, totalPages: this.pagerObj.totalPages
            };
            let tempId: string = this.parent.id + '_pagertemplate';
            this.pagerObj.templateFn(data, this.parent, 'pagerTemplate', tempId, null, null, this.pagerObj.element);
            this.parent.renderTemplates();
        }
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.parent.isReact) {
            this.parent.removeEventListener('created', this.handlers.created);
        }
        this.parent.off('pager-refresh', this.renderReactPagerTemplate);
        this.parent.off(events.initialLoad, this.handlers.load);
        this.parent.off(events.initialEnd, this.handlers.end); //For initial rendering
        this.parent.off(events.dataReady, this.handlers.ready);
        this.parent.off(events.pageComplete, this.handlers.complete);
        this.parent.off(events.uiUpdate, this.handlers.updateLayout);
        this.parent.off(events.inBoundModelChanged, this.handlers.inboundChange);
        this.parent.off(events.keyPressed, this.handlers.keyPress);
    }

    /**
     * To destroy the pager 
     * @return {void}
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