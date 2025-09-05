/* tslint:disable-next-line:max-line-length */
import { EventHandler, L10n, isNullOrUndefined, extend, classList, addClass, removeClass, Browser, getValue, setValue, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { parentsUntil, getUid, appendChildren, getDatePredicate, getObject, extendObjWithFn, eventPromise, setChecked, clearReactVueTemplates, padZero, Global } from '../base/util';
import { remove, debounce, Internationalization, DateFormatOptions, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DataUtil, Query, DataManager, Predicate, Deferred, QueryOptions, ReturnOption } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { ReturnType } from '../base/type';
import { IFilterArgs, FilterSearchBeginEventArgs, CheckBoxBeforeRenderer, IGrid } from '../base/interface';
import * as events from '../base/constant';
import { PredicateModel } from '../base/grid-model';
import { ValueFormatter } from '../services/value-formatter';
import { getForeignData, resetDialogAppend } from '../base/util';
import { Column, ColumnModel } from '../models/column';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { createSpinner, hideSpinner,     showSpinner } from '@syncfusion/ej2-popups';
import { getFilterMenuPostion, toogleCheckbox, createCboxWithWrap, removeAddCboxClasses, getColumnByForeignKeyValue, getListHeight, infiniteRemoveElements, infiniteAppendElements } from '../base/util';
import { InputArgs } from '@syncfusion/ej2-inputs';
import { SearchSettingsModel } from '../base/grid-model';
import { IXLFilter, FilterStateObj } from '../common/filter-interface';
import { DataResult, EJ2Intance } from '../base/interface';

/**
 * @hidden
 * `CheckBoxFilterBase` module is used to handle filtering action.
 */
export class CheckBoxFilterBase {
    //Internal variables
    protected sBox: HTMLElement;
    private searchInputArgs: InputArgs = null;
    protected isExcel: boolean;
    protected id: string;
    protected colType: string;
    protected fullData: Object[];
    protected filteredData: Object[];
    protected isFiltered: boolean | number;
    protected dlg: Element;
    protected dialogObj: Dialog;
    protected cBox: HTMLElement;
    protected spinner: HTMLElement;
    protected searchBox: Element;
    protected sInput: HTMLInputElement;
    protected sIcon: Element;
    protected isExecuteLocal: boolean = false;
    private queryFilteredColumn: Object[] = [];
    /** @hidden */
    public options: IFilterArgs;
    protected customQuery: boolean;
    protected existingPredicate: { [key: string]: PredicateModel[] } = {};
    protected foreignKeyData: Object[];
    protected foreignKeyQuery: Query = new Query();
    /** @hidden */
    public filterState: boolean = true;
    protected values: Object = {};
    private cBoxTrue: Element;
    private cBoxFalse: Element;
    private itemsCnt: number;
    private result: Object;
    protected renderEmpty: boolean = false;
    //Module declarations
    protected parent: IXLFilter;
    protected localeObj: L10n;
    protected valueFormatter: ValueFormatter;
    private searchHandler: Function;
    private isMenuNotEqual: boolean;
    private isBlanks: boolean;
    private isCheckboxFilterTemplate: boolean = false;
    private infiniteRenderMod: boolean = false;
    // for infinite scroll ui
    private infiniteInitialLoad: boolean = false;
    private infiniteSearchValChange: boolean = false;
    private infinitePermenantLocalData: Object[] = [];
    private infiniteQuery: Query;
    private infiniteQueryExecutionPending: boolean = false;
    private infiniteSkipCnt: number = 0;
    private infiniteScrollAppendDiff: number = 0;
    private prevInfiniteScrollDirection: string = '';
    private infiniteLoadedElem: HTMLElement[] = [];
    private infiniteDataCount: number = 0;
    // for infinite scroll filter selection(query)
    private infiniteSearchPred: Predicate;
    private infiniteLocalSelectAll: boolean = true;
    private localInfiniteSelectAllClicked: boolean = false;
    private localInfiniteSelectionInteracted: boolean = false;
    private infiniteManualSelectMaintainPred: PredicateModel[] = [];
    private infiniteUnloadParentExistPred: PredicateModel[];
    private filterPreventColumns: PredicateModel[];

    /**
     * Constructor for checkbox filtering module
     *
     * @param {IXLFilter} parent - specifies the IXLFilter
     * @hidden
     */
    constructor(parent?: IXLFilter) {
        this.parent = parent;
        this.id = this.parent.element.id;
        this.valueFormatter = new ValueFormatter(this.parent.locale);
        this.cBoxTrue = createCheckBox(this.parent.createElement, false, { checked: true, label: ' ' });
        this.cBoxFalse = createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
        this.cBoxTrue.insertBefore(
            this.parent.createElement('input', {
                className: 'e-chk-hidden', attrs: { type: 'checkbox' }
            }),
            this.cBoxTrue.firstChild);
        this.cBoxFalse.insertBefore(
            this.parent.createElement('input', {
                className: 'e-chk-hidden', attrs: { 'type': 'checkbox' }
            }),
            this.cBoxFalse.firstChild);
        this.cBoxFalse.querySelector('.e-frame').classList.add('e-uncheck');
        if (this.parent.enableRtl) {
            addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
        }
        if (this.parent.cssClass) {
            if (this.parent.cssClass.indexOf(' ') !== -1) {
                addClass([this.cBoxTrue, this.cBoxFalse], this.parent.cssClass.split(' '));
            } else {
                addClass([this.cBoxTrue, this.cBoxFalse], [this.parent.cssClass]);
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.closeDialog();
    }


    private wireEvents(): void {
        EventHandler.add(this.dlg, 'click', this.clickHandler, this);
        EventHandler.add(this.dlg, 'keyup', this.keyupHandler, this);
        this.searchHandler = debounce(this.searchBoxKeyUp, 200);
        const elem: Element = this.dialogObj.element.querySelector('.e-searchinput');
        if (elem) {
            EventHandler.add(elem, 'keyup', this.searchHandler, this);
            EventHandler.add(elem, 'input', this.searchHandler, this);
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(this.dlg, 'click', this.clickHandler);
        EventHandler.remove(this.dlg, 'keyup', this.keyupHandler);
        const elem: Element = this.dialogObj.element.querySelector('.e-searchinput');
        if (elem) {
            EventHandler.remove(elem, 'keyup', this.searchHandler);
            EventHandler.remove(elem, 'input', this.searchHandler);
        }
    }

    protected foreignKeyFilter(args: Object, fColl?: Object[], mPredicate?: Predicate): void {
        const fPredicate: { predicate?: Predicate } = {};
        const filterCollection: PredicateModel[] = [];
        const query: Query = this.foreignKeyQuery.clone();
        (<Promise<Object>>(<DataManager>this.options.column.dataSource).
            executeQuery(query.where(mPredicate))).then((e: ReturnType) => {
            this.options.column.columnData = e.result;
            this.parent.notify(events.generateQuery, { predicate: fPredicate, column: this.options.column });
            (<{ ejpredicate: Predicate[] }>args).ejpredicate = fPredicate.predicate.predicates;
            const fpred: Predicate[] = fPredicate.predicate.predicates;
            for (let i: number = 0; i < fpred.length; i++) {
                filterCollection.push({
                    field: fpred[parseInt(i.toString(), 10)].field,
                    predicate: 'or',
                    matchCase: fpred[parseInt(i.toString(), 10)].ignoreCase,
                    ignoreAccent: fpred[parseInt(i.toString(), 10)].ignoreAccent,
                    operator: fpred[parseInt(i.toString(), 10)].operator,
                    value: <string>fpred[parseInt(i.toString(), 10)].value,
                    type: this.options.type
                });
            }
            (<{ filterCollection: PredicateModel[] }>args).filterCollection = filterCollection.length ? filterCollection :
                fColl.filter((col: PredicateModel) => col.field = this.options.field);
            this.options.handler(args);
        });
    }

    private searchBoxClick(e: MouseEvent): void {
        const target: Element = e.target as Element;
        if (target.classList.contains('e-searchclear')) {
            this.sInput.value = target.classList.contains('e-chkcancel-icon') ? '' : this.sInput.value;
            if (this.isCheckboxFilterTemplate) {
                this.parent.notify('refreshCheckbox', { event: e });
            } else {
                this.refreshCheckboxes();
            }
            this.updateSearchIcon();
            this.sInput.focus();
        }
    }

    private searchBoxKeyUp(e?: KeyboardEvent): void {
        if (isNullOrUndefined(this.sInput)) { return; }
        if (isNullOrUndefined(e) || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Tab' && !(e.key === 'Tab' && e.shiftKey))) {
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer') {
                this.parent.showMaskRow(undefined, this.dialogObj.element);
            }
            if (this.isCheckboxFilterTemplate) {
                this.parent.notify('refreshCheckbox', { event: e });
            } else {
                this.refreshCheckboxes();
            }
            this.updateSearchIcon();
        }
    }

    private updateSearchIcon(): void {
        if (this.sInput.value.length) {
            classList(this.sIcon, ['e-chkcancel-icon'], ['e-search-icon']);
            if (!isNullOrUndefined(document.body.querySelector('.e-chkcancel-icon'))) {
                document.body.querySelector('.e-chkcancel-icon').setAttribute('title', this.localeObj.getConstant('Clear'));
            }
        } else {
            classList(this.sIcon, ['e-search-icon'], ['e-chkcancel-icon']);
            if (!isNullOrUndefined(document.body.querySelector('.e-searchclear.e-search-icon'))) {
                document.body.querySelector('.e-searchclear.e-search-icon').setAttribute('title', this.localeObj.getConstant('Search'));
            }
        }
    }

    /**
     * Gets the localized label by locale keyword.
     *
     * @param {string} key - Defines localization key
     * @returns {string} - returns localization label
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObj.getConstant(key);
    }

    private updateDataSource(): void {
        const dataSource: Object[] = this.options.dataSource as Object[];
        const str: string = 'object';
        if (!(dataSource instanceof DataManager)) {
            for (let i: number = 0; i < dataSource.length; i++) {
                // eslint-disable-next-line valid-typeof
                if (typeof dataSource !== str) {
                    const obj: Object = {};
                    obj[this.options.field] = dataSource[parseInt(i.toString(), 10)];
                    dataSource[parseInt(i.toString(), 10)] = obj;
                }
            }
        }
    }

    protected updateModel(options: IFilterArgs): void {
        this.options = options;
        this.existingPredicate = options.actualPredicate || {};
        this.options.dataSource = options.dataSource;
        this.options.dataManager = options.dataManager ? options.dataManager : options.dataSource as DataManager;
        this.updateDataSource();
        this.options.type = options.type;
        this.options.format = options.format || '';
        this.options.ignoreAccent = options.ignoreAccent || false;
        this.options.filteredColumns = options.filteredColumns || this.parent.filterSettings.columns;
        this.options.query = options.query || new Query();
        this.options.allowCaseSensitive = options.allowCaseSensitive || false;
        this.options.uid = options.column.uid;
        this.options.disableHtmlEncode = options.column.disableHtmlEncode || false;
        this.values = {};
        this.localeObj = options.localeObj;
        this.isFiltered = options.filteredColumns.length;
        this.infiniteRenderMod = this.parent.filterSettings && this.parent.filterSettings.enableInfiniteScrolling ? true : false;
        this.infiniteUnloadParentExistPred = this.infiniteRenderMod && this.existingPredicate[this.options.column.field] ?
            [...this.existingPredicate[this.options.column.field]] : [];
    }

    protected getAndSetChkElem(options: IFilterArgs): HTMLElement {
        this.dlg = this.parent.createElement('div', {
            id: this.id + this.options.type + '_excelDlg',
            attrs : { 'data-uid': this.options.column.uid},
            className: 'e-checkboxfilter e-filter-popup'
        });

        this.sBox = this.parent.createElement('div', { className: 'e-searchcontainer' });

        if (!options.hideSearchbox) {
            this.sInput = this.parent.createElement('input', {
                id: this.id + '_SearchBox',
                className: 'e-searchinput'
            }) as HTMLInputElement;
            this.sIcon = this.parent.createElement('span', {
                className: 'e-searchclear e-search-icon e-icons e-input-group-icon', attrs: {
                    type: 'text', title: this.getLocalizedLabel('Search')
                }
            });
            this.searchBox = this.parent.createElement('span', { className: 'e-searchbox e-fields' });
            this.searchBox.appendChild(this.sInput);
            this.sBox.appendChild(this.searchBox);
            this.searchInputArgs = {
                element: this.sInput as HTMLInputElement, floatLabelType: 'Never', properties: {
                    placeholder: this.getLocalizedLabel('Search'),
                    cssClass: this.parent.cssClass
                }
            };
            Input.createInput(this.searchInputArgs, this.parent.createElement);
            this.searchBox.querySelector('.e-input-group').appendChild(this.sIcon);
        }

        this.spinner = this.parent.createElement('div', { className: 'e-spinner' }); //for spinner
        this.cBox = this.parent.createElement('div', {
            id: this.id + this.options.type + '_CheckBoxList',
            className: 'e-checkboxlist e-fields'
        }) as HTMLElement;


        this.spinner.appendChild(this.cBox);
        this.sBox.appendChild(this.spinner);
        return this.sBox;
    }

    protected showDialog(options: IFilterArgs): void {
        const args: {
            requestType: string, filterModel?: CheckBoxFilterBase, columnName: string,
            columnType: string, cancel: boolean
        } = {
            requestType: events.filterBeforeOpen,
            columnName: this.options.field, columnType: this.options.type, cancel: false
        };
        const filterModel: string = 'filterModel';
        args[`${filterModel}`] = this;
        this.parent.notify(events.cBoxFltrBegin, args);
        if (args.cancel) {
            options.cancel = args.cancel;
            return;
        }
        this.dialogObj = new Dialog({
            visible: false, content: this.sBox as HTMLElement,
            close: this.closeDialog.bind(this),
            enableRtl: this.parent.enableRtl,
            width: (!isNullOrUndefined(parentsUntil(options.target, 'e-bigger')))
                || this.parent.element.classList.contains('e-device') ? 260 : 255,
            target: this.parent.element, animationSettings:
                { effect: 'None' },
            buttons: [{
                click: this.btnClick.bind(this),
                buttonModel: {
                    content: this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton'),
                    cssClass: this.parent.cssClass ? 'e-primary' + ' ' + this.parent.cssClass : 'e-primary',
                    isPrimary: true
                }
            },
            {
                click: this.btnClick.bind(this),
                buttonModel: { cssClass: this.parent.cssClass ? 'e-flat' + ' ' + this.parent.cssClass : 'e-flat',
                    content: this.getLocalizedLabel(this.isExcel ? 'CancelButton' : 'ClearButton') }
            }],
            created: this.dialogCreated.bind(this),
            open: this.dialogOpen.bind(this),
            cssClass: this.parent.cssClass ? this.parent.cssClass : ''
        });
        const isStringTemplate: string = 'isStringTemplate';
        this.dialogObj[`${isStringTemplate}`] = true;
        this.renderResponsiveFilter(options);
        const dialogLabel: string = this.parent.filterSettings && (<{type: string}>this.parent.filterSettings).type === 'CheckBox' ?
            this.getLocalizedLabel('CheckBoxFilterDialogARIA') : this.getLocalizedLabel('ExcelFilterDialogARIA');
        this.dlg.setAttribute('aria-label', dialogLabel);
        if (options.isResponsiveFilter) {
            const responsiveCnt: HTMLElement = document.querySelector('.e-responsive-dialog > .e-dlg-content > .e-mainfilterdiv');
            responsiveCnt.appendChild(this.dlg);
        } else {
            this.parent.element.appendChild(this.dlg);
        }
        this.dialogObj.appendTo(this.dlg as HTMLElement);
        this.dialogObj.element.style.maxHeight = options.isResponsiveFilter ? 'none' : this.options.height + 'px';
        this.dialogObj.show();
        if ((this.parent as IGrid) && (this.parent as IGrid).filterSettings && ((this.parent as IGrid).filterSettings.type === 'CheckBox'
            || (this.options.column && this.options.column.filter && this.options.column.filter.type === 'CheckBox')) &&
            ((this.parent as IGrid).getContent().firstElementChild as HTMLElement).offsetHeight < this.dialogObj.element.offsetHeight &&
            !parentsUntil(this.parent.element, 'e-gantt-dialog')) {
            resetDialogAppend((this.parent as IGrid), this.dialogObj);
        }
        const content: HTMLElement = this.dialogObj.element.querySelector('.e-dlg-content');
        content.appendChild(this.sBox);
        this.wireEvents();
        if (!(this.parent as IGrid).enableAdaptiveUI) {
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer'
                && !this.infiniteRenderMod) {
                this.parent.showMaskRow(undefined, this.dialogObj.element);
            }
            if (this.infiniteRenderMod && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
                this.showMask();
            }
        } else {
            if (this.infiniteRenderMod && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
                this.getAllData();
                return;
            }
            if (this.infiniteRenderMod) {
                this.cBox.style.marginTop = getListHeight(this.cBox) + 'px';
            }
        }
        if (!(this.infiniteRenderMod && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer')) {
            createSpinner({ target: this.spinner, cssClass: this.parent.cssClass ? this.parent.cssClass : null },
                          this.parent.createElement);
            showSpinner(this.spinner);
        }
        this.getAllData();
    }

    private renderResponsiveFilter(options: IFilterArgs): void {
        if (options.isResponsiveFilter) {
            this.dialogObj.buttons = [{}];
            this.dialogObj.position = { X: '', Y: '' };
            this.dialogObj.target = document.querySelector('.e-resfilter > .e-dlg-content > .e-mainfilterdiv') as HTMLElement;
            this.dialogObj.width = '100%';
        }
    }

    private dialogCreated(e: {}): void {
        if (this.options.isResponsiveFilter) {
            this.dialogObj.element.style.left = '0px';
        } else {
            if (!Browser.isDevice) {
                getFilterMenuPostion(this.options.target, this.dialogObj, this.parent as IGrid);
            } else {
                this.dialogObj.position = { X: 'center', Y: 'center' };
            }
        }
        if (this.options.column.showColumnMenu) {
            this.parent.notify(events.filterDialogCreated, e);
        }
    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
    }

    public closeDialog(): void {
        if (this.infiniteRenderMod && this.infinitePermenantLocalData.length && !this.options.isRemote) {
            (this.options.dataSource as DataManager).dataSource.json = this.infinitePermenantLocalData;
        }
        if (this.dialogObj && !this.dialogObj.isDestroyed) {
            this.isBlanks = false;
            const filterTemplateCol: Column[] = (this.options.columns as Column[]).filter((col: Column) => col.getFilterItemTemplate());
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const registeredTemplate: any = (this.parent as any).registeredTemplate;
            if (filterTemplateCol.length && !isNullOrUndefined(registeredTemplate) && registeredTemplate.filterItemTemplate) {
                this.parent.destroyTemplate(['filterItemTemplate']);
            }
            if ((this.parent.isReact || this.parent.isVue) && this.parent.destroyTemplate !== undefined) {
                clearReactVueTemplates(this.parent, ['filterItemTemplate']);
            }
            this.parent.notify(events.filterMenuClose, { field: this.options.field });
            this.unWireEvents();
            if (this.searchInputArgs && this.searchInputArgs.element && this.searchInputArgs.element.parentElement) {
                Input.destroy(this.searchInputArgs);
                remove(this.searchInputArgs.element);
            }
            this.searchInputArgs = null;
            this.sInput = null;
            if (this.parent.isReact && this.options.column.filter && typeof (this.options.column.filter.itemTemplate) !== 'string'
             && (this.options.column.filter.type === 'CheckBox' || this.options.column.filter.type === 'Excel')) {
                this.dialogObj.element.querySelector('.e-dlg-content').innerHTML = '';
            }
            this.dialogObj.destroy();
            if (this.dialogObj['dlgClosedBy'] === 'escape') {
                (this.parent as IGrid).isColumnMenuFilterClosing = true;
            }
            if (this.dlg && this.dlg.parentElement) {
                remove(this.dlg);
                let gridPopup: HTMLElement = document.getElementById(this.parent.element.id + '_e-popup');
                if (!isNullOrUndefined(gridPopup)) {
                    remove(gridPopup);
                    gridPopup = null;
                }
            }
            this.dlg = null;
            this.parent.notify(events.filterDialogClose, {});
        }
    }

    /**
     * @param {Column} col - Defines column details
     * @returns {void}
     * @hidden
     */
    public clearFilter(col?: Column): void {
        // eslint-disable-next-line max-len
        const args: { instance: CheckBoxFilterBase, handler: Function, cancel: boolean } = { instance: this, handler: this.clearFilter, cancel: false };
        this.parent.notify(events.fltrPrevent, args);
        if (args.cancel) {
            return;
        }
        this.options.handler({ action: 'clear-filter', field: col ? col.field : this.options.field });
    }

    private btnClick(e: MouseEvent): void {
        if (this.filterState) {
            if (((<Element>e.target).tagName.toLowerCase() === 'input' && (<Element>e.target).classList.contains('e-searchinput')) ||
                (<{ keyCode?: number }>e).keyCode === 13) {
                if (!this.isCheckboxFilterTemplate) {
                    this.fltrBtnHandler();
                }
            } else {
                const text: string = (e.target as HTMLElement).firstChild.textContent.toLowerCase();
                if (this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton').toLowerCase() === text) {
                    if (!this.isCheckboxFilterTemplate) {
                        this.fltrBtnHandler();
                    }
                } else if (this.getLocalizedLabel('ClearButton').toLowerCase() === text) {
                    this.clearFilter();
                }
            }
            this.closeDialog();
        } else if (e.target && (e.target as HTMLElement).firstChild &&
            (e.target as HTMLElement).firstChild.textContent.toLowerCase() === this.getLocalizedLabel('CancelButton').toLowerCase()) {
            this.closeDialog();
        } else if (!((<Element>e.target).tagName.toLowerCase() === 'input')) {
            this.clearFilter();
            this.closeDialog();
        }
        if (this.options.column.showColumnMenu) {
            this.parent.notify(events.afterFilterColumnMenuClose, {});
        }
        if (!isNullOrUndefined((this.parent as IGrid).focusModule)) {
            (this.parent as IGrid).focusModule.filterfocus();
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public fltrBtnHandler(): void {
        if (this.infiniteRenderMod) {
            this.cBox.innerHTML = '';
            appendChildren(this.cBox, [...this.infiniteLoadedElem]);
        }
        let checked: Element[] = [].slice.call(this.cBox.querySelectorAll('.e-check:not(.e-selectall):not(.e-add-current)'));
        const check: Element[] = checked;
        let optr: string = 'equal';
        const ddlValue: EJ2Intance = (this.dialogObj.element.querySelector('.e-dropdownlist') as EJ2Intance);
        if (ddlValue) {
            this.options.operator = optr = ddlValue.ej2_instances[0].value as string;
        }
        this.isMenuNotEqual = this.options.operator === 'notequal';
        let searchInput: HTMLInputElement;
        if (!this.options.hideSearchbox) {
            searchInput = this.searchBox.querySelector('.e-searchinput') as HTMLInputElement;
        }
        const caseSen: boolean = this.options.allowCaseSensitive;
        const defaults: {
            predicate?: string, field?: string, type?: string, uid?: string
            operator?: string, matchCase?: boolean, ignoreAccent?: boolean
        } = {
            field: this.options.field, predicate: this.isMenuNotEqual ? 'and' : 'or', uid: this.options.uid,
            operator: optr, type: this.options.type, matchCase: caseSen, ignoreAccent: this.options.ignoreAccent
        };
        const isNotEqual: boolean = this.itemsCnt !== checked.length && this.itemsCnt - checked.length < checked.length;
        if (isNotEqual && searchInput && searchInput.value === '') {
            optr = this.isMenuNotEqual ? 'equal' : 'notequal';
            checked = [].slice.call(this.cBox.querySelectorAll('.e-uncheck:not(.e-selectall)'));
            defaults.predicate = this.isMenuNotEqual ? 'or' : 'and';
            defaults.operator = optr;
        }
        let val: string;
        let length: number;
        let coll: PredicateModel[] = [];
        if ((checked.length !== this.itemsCnt || (searchInput && searchInput.value && searchInput.value !== ''))
        || this.infiniteRenderMod) {
            if (!this.infiniteRenderMod) {
                coll = this.complexQueryPredicate(checked, defaults, isNotEqual);
                if (isNullOrUndefined(coll)) {
                    return;
                }
                coll = this.filterPreventColumns ? this.filterPreventColumns : coll;
            } else if (this.infiniteRenderMod &&
                (!this.infiniteSearchPred || (this.infiniteSearchPred && !this.infiniteSearchPred.isComplex))) {
                this.infiniteFltrBtnHandler(coll);
            } else {
                if (this.infiniteSearchPred.isComplex) {
                    coll = this.complexQueryPredicate(checked, defaults, isNotEqual);
                }
            }
            if ((this.options.type === 'date' || this.options.type === 'dateonly' || this.options.type === 'datetime') && check.length) {
                length = check.length - 1;
                val = this.values[parentsUntil(check[parseInt(length.toString(), 10)], 'e-ftrchk').getAttribute('data-uid')];
                if (isNullOrUndefined(val) && isNotEqual) {
                    coll.push({
                        field: defaults.field, matchCase: defaults.matchCase, operator: 'equal',
                        predicate: 'or', value: null
                    });
                }
            }
            const addCurrSelection: HTMLElement = this.infiniteRenderMod ? this.sBox.querySelector('.e-add-current') :
                this.cBox.querySelector('.e-add-current');
            if (addCurrSelection && addCurrSelection.classList.contains('e-check')) {
                const existingPredicate: PredicateModel[] = this.existingPredicate[this.options.field];
                if (existingPredicate) {
                    for (let j: number = 0; j < existingPredicate.length; j++) {
                        if (!coll.some(function (data: PredicateModel): boolean { return data
                            .value === existingPredicate[parseInt(j.toString(), 10)].value; })) {
                            coll.push(existingPredicate[parseInt(j.toString(), 10)]);
                        }
                    }
                } else {
                    return;
                }
            }
            if (!this.infiniteRenderMod) {
                this.initiateFilter(coll);
            } else if (coll.length) {
                this.initiateFilter(coll);
            } else if (this.sBox.querySelector('.e-selectall').classList.contains('e-check') && !coll.length) {
                const isClearFilter: boolean = this.options.filteredColumns.some((value: PredicateModel) => {
                    return this.options.field === value.field;
                });
                if (isClearFilter) {
                    this.clearFilter();
                }
            }
        } else {
            const isClearFilter: boolean = this.options.filteredColumns.some((value: PredicateModel) => {
                return this.options.field === value.field;
            });
            if (isClearFilter) {
                this.clearFilter();
            }
        }
    }

    private complexQueryPredicate(checkBoxChecked: Element[], defaults: object, isNotEqual: boolean): PredicateModel[] {
        let value: string;
        let fObj: PredicateModel;
        let coll: PredicateModel[] = [];
        for (let i: number = 0; i < checkBoxChecked.length; i++) {
            value = this.values[parentsUntil(checkBoxChecked[parseInt(i.toString(), 10)], 'e-ftrchk').getAttribute('data-uid')];
            fObj = extend({}, { value: value }, defaults) as {
                field: string, predicate: string, operator: string, matchCase: boolean, ignoreAccent: boolean, value: string
            };
            if (value && !value.toString().length) {
                fObj.operator = isNotEqual ? 'notequal' : 'equal';
            }
            if (value === '' || isNullOrUndefined(value)) {
                coll = coll.concat(CheckBoxFilterBase.generateNullValuePredicates(defaults));
            } else {
                coll.push(fObj);
            }
        }
        const filterColumns: PredicateModel = this.filterPreventColumns && this.filterPreventColumns.length ?
            this.filterPreventColumns[0] : fObj;
        if (filterColumns && !this.notifyFilterPrevEvent(filterColumns)) {
            this.filterPreventColumns = coll;
            return null;
        } else {
            return coll;
        }
    }

    private infiniteFltrBtnHandler(coll: PredicateModel[]): PredicateModel[] | void {
        let value: string;
        if (this.infiniteManualSelectMaintainPred.length) {
            for (let i: number = 0; i < this.infiniteManualSelectMaintainPred.length; i++) {
                const pred: PredicateModel = this.infiniteManualSelectMaintainPred[i as number];
                value = pred.value + '';
                if (value === '' || isNullOrUndefined(value)) {
                    const dummyDefaults: { predicate?: string, field?: string, type?: string, uid?: string
                        operator?: string, matchCase?: boolean, ignoreAccent?: boolean
                    } = { predicate: pred.predicate, field: pred.field, type: pred.type, uid: pred.uid, operator: pred.operator,
                        matchCase: pred.matchCase, ignoreAccent: pred.ignoreAccent };
                    coll.push(...CheckBoxFilterBase.generateNullValuePredicates(dummyDefaults));
                } else {
                    coll.push(this.infiniteManualSelectMaintainPred[i as number]);
                }
                this.notifyFilterPrevEvent(this.infiniteManualSelectMaintainPred[i as number]);
            }
        }
        if (!this.localInfiniteSelectAllClicked && this.sInput.value === '' && !(!this.options.parentCurrentViewDataCount && coll.length)) {
            for (let i: number = 0; i < this.infiniteUnloadParentExistPred.length; i++) {
                coll.unshift(this.infiniteUnloadParentExistPred[i as number]);
                this.notifyFilterPrevEvent(this.existingPredicate[this.options.field][i as number]);
            }
        }
        if (this.sInput.value !== '' && (!this.localInfiniteSelectAllClicked || this.infiniteLocalSelectAll)) {
            this.infiniteSearchPred['predicate'] = 'or';
            coll.unshift(this.infiniteSearchPred as PredicateModel);
            this.notifyFilterPrevEvent(this.infiniteSearchPred as PredicateModel);
        }
    }

    private notifyFilterPrevEvent(predicate: PredicateModel): boolean {
        const args: {
            cancel: boolean, instance: CheckBoxFilterBase, handler: Function, arg1: string, arg2: Object, arg3: string, arg4: boolean,
            arg5: boolean, arg6: string } = {
            instance: this, handler: this.fltrBtnHandler, arg1: predicate.field, arg2: predicate.predicate, arg3: predicate.operator,
            arg4: predicate.matchCase, arg5: predicate.ignoreAccent, arg6: predicate.value as string, cancel: false };
        this.parent.notify(events.fltrPrevent, args);
        if (args.cancel) {
            return false;
        }
        return true;
    }

    // eslint-disable-next-line
    /** @hidden */
    public static generateNullValuePredicates(
        defaults: {
            predicate?: string, field?: string, type?: string, uid?: string
            operator?: string, matchCase?: boolean, ignoreAccent?: boolean
        }
    ): PredicateModel[] {
        const coll: PredicateModel[] = [];
        if (defaults.type === 'string') {
            coll.push(
                {
                    field: defaults.field, ignoreAccent: defaults.ignoreAccent, matchCase: defaults.matchCase,
                    operator: defaults.operator, predicate: defaults.predicate, value: ''
                });
        }
        coll.push(
            {
                field: defaults.field,
                matchCase: defaults.matchCase, operator: defaults.operator, predicate: defaults.predicate, value: null
            });
        coll.push(
            {
                field: defaults.field, matchCase: defaults.matchCase, operator: defaults.operator,
                predicate: defaults.predicate, value: undefined
            });
        return coll;
    }

    // eslint-disable-next-line
    /** @hidden */
    public initiateFilter(fColl: PredicateModel[]): void {
        const firstVal: PredicateModel = fColl[0];
        let predicate: PredicateModel;
        if (!isNullOrUndefined(firstVal)) {
            predicate = firstVal.ejpredicate ? firstVal.ejpredicate :
                new Predicate(firstVal.field, firstVal.operator, firstVal.value, !firstVal.matchCase, firstVal.ignoreAccent);
            for (let j: number = 1; j < fColl.length; j++) {
                predicate = fColl[parseInt(j.toString(), 10)].ejpredicate !== undefined ?
                    predicate[fColl[parseInt(j.toString(), 10)].predicate](fColl[parseInt(j.toString(), 10)].ejpredicate) :
                    predicate[fColl[parseInt(j.toString(), 10)].predicate](
                        fColl[parseInt(j.toString(), 10)].field, fColl[parseInt(j.toString(), 10)].operator,
                        fColl[parseInt(j.toString(), 10)].value, !fColl[parseInt(j.toString(), 10)].matchCase,
                        fColl[parseInt(j.toString(), 10)].ignoreAccent
                    );
            }
            const args: Object = {
                action: 'filtering', filterCollection: fColl, field: this.options.field,
                ejpredicate: Predicate.or(predicate)
            };
            this.options.handler(args);
        }
    }

    protected isForeignColumn(col: Column): boolean {
        return col.isForeignColumn ? col.isForeignColumn() : false;
    }

    private refreshCheckboxes(): void {
        const val: string = this.sInput.value;
        const column: Column = this.options.column as Column;
        const query: Query = this.isForeignColumn(column) ? this.foreignKeyQuery.clone() : this.options.query.clone();
        const foreignQuery: Query = this.options.query.clone();
        const pred: QueryOptions = query.queries.filter((e : QueryOptions) => { return e && e.fn === 'onWhere'; })[0];
        query.queries = [];
        foreignQuery.queries = [];
        let parsed: string | number | Date | boolean = (this.options.type !== 'string' && parseFloat(val)) ? parseFloat(val) : val;
        let operator: string = this.options.isRemote ?
            (this.options.type === 'string' ? 'contains' : 'equal') : (this.options.type ? 'contains' : 'equal');
        const matchCase: boolean = true;
        const ignoreAccent: boolean = this.options.ignoreAccent;
        const field: string = this.isForeignColumn(column) ? column.foreignKeyValue : column.field;
        parsed = (parsed === '' || parsed === undefined) ? undefined : parsed;
        let coll: PredicateModel[] = [];
        const defaults: {
            predicate?: string, field?: string, type?: string, uid?: string
            operator?: string, matchCase?: boolean, ignoreAccent?: boolean
        } = {
            field: field, predicate: 'or', uid: this.options.uid,
            operator: 'equal', type: this.options.type, matchCase: matchCase, ignoreAccent: ignoreAccent
        };
        let predicte: Predicate;
        const moduleName : Function = (<{ getModuleName?: Function }>this.options.dataManager.adaptor).getModuleName;
        if (this.options.type === 'boolean') {
            if (parsed !== undefined &&
                this.getLocalizedLabel('FilterTrue').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1) {
                parsed = 'true';
            } else if (parsed !== undefined &&
                this.getLocalizedLabel('FilterFalse').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1) {
                parsed = 'false';
            }
            if (parsed !== undefined &&
                this.getLocalizedLabel('FilterTrue').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1 && moduleName) {
                // eslint-disable-next-line no-constant-condition
                parsed = (moduleName() === 'ODataAdaptor' || 'ODataV4Adaptor') ? true : 'true';
            } else if (parsed !== undefined &&
                this.getLocalizedLabel('FilterFalse').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1 && moduleName) {
                // eslint-disable-next-line no-constant-condition
                parsed = (moduleName() === 'ODataAdaptor' || 'ODataV4Adaptor') ? false : 'false';
            }
            operator = 'equal';
        }
        if ((this.options.type === 'date' || this.options.type === 'datetime' || this.options.type === 'dateonly') && this.options.format) {
            const intl: Internationalization = new Internationalization();
            const format: string = typeof (this.options.format) === 'string' ? this.options.format :
                (<DateFormatOptions>this.options.format).format;
            if (format) {
                parsed = intl.parseDate(val, { format: format }) || new Date(val);
            } else {
                parsed = new Date(val);
            }
            if (this.options.type === 'dateonly') {
                parsed = parsed.getFullYear()  + '-' + padZero(parsed.getMonth() + 1) + '-' + padZero(parsed.getDate());
            }
        }
        this.infiniteSearchValChange = true;
        this.infiniteLoadedElem = [];
        this.infiniteLocalSelectAll = true;
        this.localInfiniteSelectAllClicked = false;
        this.localInfiniteSelectionInteracted = false;
        this.infiniteSkipCnt = 0;
        this.infiniteDataCount = 0;
        this.infiniteManualSelectMaintainPred = [];
        if (this.sInput.value === '') {
            this.infiniteUnloadParentExistPred = this.infiniteRenderMod && this.existingPredicate[this.options.column.field] ?
                [...this.existingPredicate[this.options.column.field]] : [];
        } else {
            this.infiniteUnloadParentExistPred = [];
        }
        if (!this.isForeignColumn(column)) {
            this.addDistinct(query);
        }
        const args: FilterSearchBeginEventArgs = {
            requestType: events.filterSearchBegin,
            filterModel: this, columnName: field, column: column,
            operator: operator, matchCase: matchCase, ignoreAccent: ignoreAccent, filterChoiceCount: null,
            query: query, value: parsed, cancel: false
        };
        if (this.infiniteRenderMod && this.parent.filterSettings.itemsCount) {
            args.filterChoiceCount = this.parent.filterSettings.itemsCount;
        }
        this.parent.trigger(events.actionBegin, args, (filterargs: FilterSearchBeginEventArgs) => {
            if (filterargs.cancel) {
                return;
            }
            // eslint-disable-next-line no-self-assign
            filterargs.operator = filterargs.operator;
            predicte = new Predicate(field, filterargs.operator, args.value, filterargs.matchCase, filterargs.ignoreAccent);
            if (this.options.type === 'date' || this.options.type === 'datetime' || this.options.type === 'dateonly') {
                operator = 'equal';
                const filterObj: Object = {
                    field: field, operator: operator, value: parsed, matchCase: matchCase,
                    ignoreAccent: ignoreAccent
                };
                if (!isNullOrUndefined(parsed)) {
                    predicte = getDatePredicate(filterObj, this.options.type);
                }
            }
            if (val && typeof val === 'string' && this.isBlanks &&
                this.getLocalizedLabel('Blanks').toLowerCase().indexOf((val as string).toLowerCase()) >= 0) {
                coll = coll.concat(CheckBoxFilterBase.generateNullValuePredicates(defaults));
                const emptyValPredicte: Predicate = CheckBoxFilterBase.generatePredicate(coll);
                emptyValPredicte.predicates.push(predicte);
                predicte = emptyValPredicte;
                query.where(emptyValPredicte);
            } else if (val.length) {
                predicte = !isNullOrUndefined(pred) ? predicte.and(pred.e as Predicate) : predicte;
                query.where(predicte);
            } else if (!isNullOrUndefined(pred)) {
                predicte = pred.e as Predicate;
                query.where(pred.e as Predicate);
            }
            this.infiniteSearchPred = predicte;
            filterargs.filterChoiceCount = !isNullOrUndefined(filterargs.filterChoiceCount) ? filterargs.filterChoiceCount : 1000;
            if (this.infiniteRenderMod && this.parent.filterSettings.itemsCount !== filterargs.filterChoiceCount) {
                this.parent.filterSettings.itemsCount = args.filterChoiceCount;
            }
            const fPredicate: { predicate?: Predicate } = {};
            showSpinner(this.spinner);
            this.renderEmpty = false;
            if (this.isForeignColumn(column) && val.length) {
                const colData: DataManager = ('result' in column.dataSource) ? new DataManager((column.dataSource as DataResult).result) :
                    column.dataSource as DataManager;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                colData.executeQuery(query).then((e: any) => {
                    const columnData: Object[] = this.options.column.columnData;
                    this.options.column.columnData = e.result;
                    this.parent.notify(events.generateQuery, { predicate: fPredicate, column: column });
                    if (fPredicate.predicate.predicates.length) {
                        foreignQuery.where(fPredicate.predicate);
                    } else {
                        this.renderEmpty = true;
                    }
                    this.options.column.columnData = columnData;
                    if (this.infiniteRenderMod) {
                        this.infiniteInitialLoad = isNullOrUndefined(this.fullData) ? true : false;
                        this.makeInfiniteScrollRequest(foreignQuery);
                        foreignQuery.requiresCount();
                    } else {
                        foreignQuery.take(filterargs.filterChoiceCount);
                    }
                    this.search(filterargs, foreignQuery);
                });
            } else {
                if (this.infiniteRenderMod && this.parent.filterSettings.itemsCount) {
                    this.infiniteInitialLoad = isNullOrUndefined(this.fullData) ? true : false;
                    this.makeInfiniteScrollRequest(query);
                    query.requiresCount();
                } else {
                    query.take(filterargs.filterChoiceCount);
                }
                this.search(filterargs, query);
            }
        });
    }

    protected search(args: FilterSearchBeginEventArgs, query: Query): void {
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.filterEvent(args, query);
        } else {
            this.processSearch(query);
        }
    }

    private getPredicateFromCols(columns: Object[], isExecuteLocal?: boolean): Predicate {
        const predicates: Predicate = CheckBoxFilterBase.getPredicate(columns, isExecuteLocal);
        const predicateList: Predicate[] = [];
        const fPredicate: { predicate?: Predicate } = {};
        const isGrid: boolean = this.parent.getForeignKeyColumns !== undefined;
        const foreignColumn: Column[] = isGrid ? this.parent.getForeignKeyColumns() : [];
        for (const prop of Object.keys(predicates)) {
            let col: Column;
            if (isGrid && !this.parent.getColumnByField(prop)) {
                col = getColumnByForeignKeyValue(prop, foreignColumn);
            }
            if (col) {
                this.parent.notify(events.generateQuery, { predicate: fPredicate, column: col });
                if (fPredicate.predicate.predicates.length) {
                    predicateList.push(Predicate.or(fPredicate.predicate.predicates));
                }
            } else {
                predicateList.push(<Predicate>predicates[`${prop}`]);
            }
        }
        return predicateList.length && Predicate.and(predicateList);
    }

    protected getQuery(): Query {
        return this.parent.getQuery ? this.parent.getQuery().clone() : new Query();
    }

    private getAllData(): void {
        this.customQuery = false;
        const query: Query = this.getQuery();
        const moduleName : Function = (<{ getModuleName?: Function }>this.options.dataManager.adaptor).getModuleName;
        if (!(!isNullOrUndefined((this.parent as IGrid).getDataModule) && moduleName && moduleName() === 'ODataV4Adaptor')) {
            query.requiresCount(); //consider take query
        }
        this.addDistinct(query);
        const args: FilterSearchBeginEventArgs = {
            requestType: events.filterChoiceRequest, query: query, filterChoiceCount: null
        };
        const filterModel: string = 'filterModel';
        args[`${filterModel}`] = this;
        if (this.infiniteRenderMod && this.parent.filterSettings.itemsCount) {
            args.filterChoiceCount = this.parent.filterSettings.itemsCount;
        }
        this.parent.trigger(events.actionBegin, args, (args: FilterSearchBeginEventArgs) => {
            args.filterChoiceCount = !isNullOrUndefined(args.filterChoiceCount) ? args.filterChoiceCount : 1000;
            if (this.infiniteRenderMod && this.parent.filterSettings.itemsCount !== args.filterChoiceCount) {
                this.parent.filterSettings.itemsCount = args.filterChoiceCount;
            }
            if (!this.infiniteRenderMod) {
                query.take(args.filterChoiceCount);
            }
            if (!args.query.distincts.length || this.infiniteRenderMod){
                this.customQuery = true;
                this.queryGenerate(query);
            }
            if (this.infiniteRenderMod) {
                this.infiniteInitialLoad = isNullOrUndefined(this.fullData) ? true : false;
                this.makeInfiniteScrollRequest(query);
            }
            if (this.parent.dataSource && 'result' in this.parent.dataSource) {
                this.filterEvent(args, query);
            } else {
                this.processDataOperation(query, true);
            }
        });
    }

    private addDistinct(query: Query): Query {
        let filteredColumn: Object[] = DataUtil.distinct(this.options.filteredColumns, 'field');
        if (filteredColumn.indexOf(this.options.column.field) <= -1) {
            filteredColumn = filteredColumn.concat(this.options.column.field);
        }
        const moduleName: Function = (<{ getModuleName?: Function }>this.options.dataManager.adaptor).getModuleName;
        if (moduleName && moduleName() === 'ODataV4Adaptor' && this.parent &&
            (this.parent as IGrid).query instanceof Query) {
            const gridQuery: Query = (this.parent as IGrid).query;
            for (let i: number = 0; i < gridQuery.queries.length; i++) {
                const queryOptions: QueryOptions = gridQuery.queries[parseInt(i.toString(), 10)];
                if (queryOptions.fn === 'onWhere') {
                    this.getPredicateFields(queryOptions.e);
                    this.queryFilteredColumn.map((field: string) => {
                        if (filteredColumn.indexOf(field) === -1) {
                            filteredColumn.push(field);
                        }
                    });
                    this.queryFilteredColumn = [];
                }
            }
        }
        if (!this.infiniteRenderMod) {
            query.distinct(filteredColumn as string[]);
        }
        if (this.infiniteRenderMod && !this.options.isRemote && this.sInput.value === '') {
            this.options.dataSource = this.options.dataSource instanceof DataManager ?
                this.options.dataSource : new DataManager(this.options.dataSource as JSON[]);
            this.infinitePermenantLocalData = [...this.options.dataSource.dataSource.json];
            const query1: Query = new Query();
            this.queryGenerate(query1);
            const result : Object[] = new DataManager(this.options.dataSource.dataSource).executeLocal(query1);
            this.options.dataSource = new DataManager(DataUtil.distinct(result, this.options.column.field, true));
            if (this.isForeignColumn(this.options.column as Column)) {
                this.options.column.dataSource = this.options.column.dataSource instanceof DataManager ?
                    this.options.column.dataSource : new DataManager(this.options.column.dataSource as JSON[]);
                this.options.dataSource.dataSource.json = this.options.dataSource.dataSource.json.map((item: Object, i: number) =>
                    Object.assign({}, item, (this.options.column.dataSource as DataManager).dataSource.json[i as number]));
            }
        } else if (this.infiniteRenderMod && this.options.isRemote) {
            query.select(this.options.column.field);
            query.sortBy(this.options.column.field, 'ascending');
            const moduleName: Function = (<{ getModuleName?: Function }>this.options.dataManager.adaptor).getModuleName;
            if (moduleName && moduleName() && (moduleName() === 'ODataV4Adaptor' || moduleName() === 'WebApiAdaptor'
            || moduleName() === 'CustomDataAdaptor' || moduleName() === 'GraphQLAdaptor' || moduleName() === 'ODataAdaptor')) {
                query.distinct(filteredColumn as string[]);
            }
        }
        return query;
    }

    private getPredicateFields(query: QueryOptions): void {
        if (query.isComplex && query.predicates) {
            query.predicates.forEach((predicate: Predicate) => {
                if (Array.isArray(predicate)) {
                    predicate.forEach((p: Predicate) => this.getPredicateFields(p));
                } else {
                    this.getPredicateFields(predicate);
                }
            });
        }
        else {
            if (query.field && !query.isComplex) {
                if (this.queryFilteredColumn.indexOf(query.field) <= -1) {
                    this.queryFilteredColumn = this.queryFilteredColumn.concat(DataUtil.distinct([query.field], 'field'));
                }
            }
        }
    }

    private filterEvent(args: Object, query: Query): void {
        const defObj: FilterStateObj = eventPromise(args, query);
        this.parent.trigger(events.dataStateChange, defObj.state);
        this.addInfiniteScrollEvent(query);
        const def: Deferred = defObj.deffered;
        def.promise.then((e: ReturnType[]) => {
            this.infiniteDataCount = this.infiniteRenderMod && !this.infiniteDataCount ? e['count'] : this.infiniteDataCount;
            const dataResult: Object[] = this.infiniteRenderMod ? e['result'] : e;
            this.dataSuccess(dataResult);
        });
    }

    private addInfiniteScrollEvent(query: Query): void {
        if (this.infiniteRenderMod) {
            this.infiniteQuery = query.clone();
            if (this.infiniteInitialLoad) {
                this.cBox.classList.add('e-checkbox-infinitescroll');
                EventHandler.add(this.cBox, 'scroll', this.infiniteScrollHandler, this);
                EventHandler.add(this.cBox, 'mouseup', this.infiniteScrollMouseKeyUpHandler, this);
                EventHandler.add(this.cBox, 'mousedown', this.infiniteScrollMouseKeyDownHandler, this);
            } else if (this.infiniteSearchValChange) {
                this.cBox.innerHTML = '';
            }
        }
    }

    private infiniteScrollMouseKeyDownHandler(): void {
        EventHandler.remove(this.cBox, 'scroll', this.infiniteScrollHandler);
    }

    private infiniteScrollMouseKeyUpHandler(e: MouseEvent): void {
        EventHandler.add(this.cBox, 'scroll', this.infiniteScrollHandler, this);
        const target: HTMLElement = this.cBox;
        if (target.children.length > 1 && (target.scrollTop >= target.scrollHeight - target.offsetHeight || target.scrollTop <= 0)) {
            this.infiniteScrollHandler();
        }
        Global.timer = (setTimeout(() => { this.clickHandler(e); Global.timer = null; }, 0) as Object);
    }

    private getShimmerTemplate(): string {
        return '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave"></span>';
    }

    /**
     * @returns {void}
     * @hidden
     */
    public showMask(): void {
        let maskRowCount: number = 5;
        let maskItemHeight: string;
        const maskList: HTMLElement = this.parent.createElement('div', { id: this.id + this.options.type + '_CheckBoxMaskList',
            className: 'e-checkboxlist e-fields e-infinite-list e-masklist' }) as HTMLElement;
        maskList.style.zIndex = '10';
        const wrapperElem: HTMLElement = this.cBox;
        this.removeMask();
        if (wrapperElem) {
            const computedStyle: CSSStyleDeclaration = getComputedStyle(wrapperElem);
            const liHeight: number = getListHeight(wrapperElem);
            const height: number = wrapperElem.children.length ? parseInt(computedStyle.height, 10) :
                Math.floor(parseInt(computedStyle.height.split('px')[0], 10)) - 5;
            if ((this.parent as IGrid).enableAdaptiveUI && this.infiniteRenderMod) {
                maskList.style.height = (height - liHeight) + 'px';
                (this.dlg.querySelector('.e-dlg-content') as HTMLElement).style.overflow = 'hidden';
            }
            const backgroundColor: string = this.isExcel && !wrapperElem.children.length && !this.dlg.classList.contains('e-excelfilter') ?
                '' : getComputedStyle(this.dlg.querySelector('.e-dlg-content')).backgroundColor;
            maskList.style.cssText = 'width: ' + computedStyle.width + '; min-height: ' + computedStyle.minHeight + '; height: ' +
            height + 'px; margin: ' + computedStyle.margin + '; border-style: ' + computedStyle.borderStyle + '; border-width: '
            + computedStyle.borderWidth + '; border-color: ' + computedStyle.borderColor + '; position: absolute; background-color: ' +
            backgroundColor + ';';
            maskRowCount = Math.floor(height / liHeight);
            maskRowCount = wrapperElem.children.length > maskRowCount ? wrapperElem.children.length : maskRowCount;
            maskItemHeight = liHeight + 'px';
        }
        const maskTemplate: string = '<div class="e-ftrchk e-mask-ftrchk">'
            + '<div class="e-checkbox-wrapper"><input class="e-chk-hidden">'
            + this.getShimmerTemplate() + this.getShimmerTemplate() + '</div></div>';
        maskList.innerHTML = '';
        if (!wrapperElem.children.length) {
            this.spinner.insertAdjacentHTML('beforebegin', maskTemplate);
            (this.spinner.parentElement.querySelector('.e-ftrchk.e-mask-ftrchk') as HTMLElement).style.cssText =
                'width: 100%; height: ' + maskItemHeight + ';';
            (this.spinner.parentElement.querySelector('.e-checkbox-wrapper') as HTMLElement).style.width = '100%';
            const maskSpan: Element[] = [].slice.call(this.spinner.parentElement
                .querySelectorAll('.e-mask:not(.e-mask-checkbox-filter-intent):not(.e-mask-checkbox-filter-span-intent)'));
            maskSpan[0].classList.add('e-mask-checkbox-filter-intent');
            maskSpan[1].classList.add('e-mask-checkbox-filter-span-intent');
        }
        this.spinner.insertBefore(maskList, this.cBox);
        for (let i: number = 0; maskRowCount && i < maskRowCount; i++) {
            maskList.innerHTML += maskTemplate;
            (maskList.lastElementChild as HTMLElement).style.cssText =
                'width: 100%; height: ' + maskItemHeight + ';';
            (maskList.lastElementChild.querySelector('.e-checkbox-wrapper') as HTMLElement).style.width = '100%';
            const maskSpan: Element[] = [].slice.call(maskList
                .querySelectorAll('.e-mask:not(.e-mask-checkbox-filter-intent):not(.e-mask-checkbox-filter-span-intent)'));
            maskSpan[0].classList.add('e-mask-checkbox-filter-intent');
            maskSpan[1].classList.add('e-mask-checkbox-filter-span-intent');
        }
        if (this.cBox) {
            maskList.scrollTop = this.cBox.scrollTop;
        }
    }

    private removeMask(): void {
        const maskLists: NodeListOf<Element> = this.dialogObj.element.querySelectorAll('.e-mask-ftrchk');
        if (maskLists.length) {
            for (let i: number = 0; i < maskLists.length; i++) {
                remove(maskLists[i as number]);
            }
        }
        const maskParent: HTMLElement = this.dialogObj.element.querySelector('.e-checkboxlist.e-masklist');
        if (maskParent) {
            remove(this.dialogObj.element.querySelector('.e-checkboxlist.e-masklist'));
        }
    }

    private infiniteScrollHandler(): void {
        const target: HTMLElement = this.cBox;
        if (target.scrollTop >= target.scrollHeight - target.offsetHeight && !this.infiniteQueryExecutionPending
            && this.infiniteLoadedElem.length <= (this.infiniteSkipCnt + this.parent.filterSettings.itemsCount)
            && this.cBox.children.length === this.parent.filterSettings.itemsCount * 3
            && (!this.infiniteDataCount || this.infiniteDataCount > (this.infiniteSkipCnt + this.parent.filterSettings.itemsCount))) {
            this.makeInfiniteScrollRequest();
            this.prevInfiniteScrollDirection = 'down';
        } else if (target.scrollTop >= target.scrollHeight - target.offsetHeight && !this.infiniteQueryExecutionPending
            && this.infiniteLoadedElem.length > (this.infiniteSkipCnt + this.parent.filterSettings.itemsCount)
            && this.cBox.children.length === this.parent.filterSettings.itemsCount * 3) {
            infiniteRemoveElements(([].slice.call(this.cBox.children)).splice(0, this.parent.filterSettings.itemsCount));
            this.infiniteSkipCnt += this.prevInfiniteScrollDirection === 'down' ? this.parent.filterSettings.itemsCount :
                (this.parent.filterSettings.itemsCount * 3);
            appendChildren(this.cBox, this.infiniteLoadedElem.slice(this.infiniteSkipCnt, this.parent.filterSettings.itemsCount +
                this.infiniteSkipCnt));
            this.prevInfiniteScrollDirection = 'down';
        }
        else if (target.scrollTop === 0 && !this.infiniteInitialLoad && !this.infiniteSearchValChange && this.infiniteSkipCnt
            && this.infiniteLoadedElem.length && this.infiniteLoadedElem.length > this.parent.filterSettings.itemsCount * 3
            && this.cBox.children.length === this.parent.filterSettings.itemsCount * 3) {
            infiniteRemoveElements(([].slice.call(this.cBox.children)).splice((this.parent.filterSettings
                .itemsCount * 2), this.parent.filterSettings.itemsCount));
            this.infiniteSkipCnt -= this.prevInfiniteScrollDirection === 'up' ? this.parent.filterSettings.itemsCount :
                (this.parent.filterSettings.itemsCount * 3);
            infiniteAppendElements([].slice.call(this.infiniteLoadedElem.slice(this.infiniteSkipCnt, this.infiniteSkipCnt +
                this.parent.filterSettings.itemsCount)), this.cBox);
            this.cBox.scrollTop = this.infiniteScrollAppendDiff;
            this.prevInfiniteScrollDirection = 'up';
        }
        else if (target.scrollTop === 0 && !this.infiniteInitialLoad && !this.infiniteSearchValChange && this.infiniteSkipCnt
            && this.infiniteLoadedElem.length && this.cBox.children.length < this.parent.filterSettings.itemsCount * 3) {
            infiniteRemoveElements(([].slice.call(this.cBox.children)).splice((this.parent.filterSettings
                .itemsCount * 2), this.infiniteDataCount % this.parent.filterSettings.itemsCount));
            this.infiniteSkipCnt = (Math.floor(this.infiniteDataCount / this.parent.filterSettings.itemsCount) - 3) *
                this.parent.filterSettings.itemsCount;
            infiniteAppendElements([].slice.call(this.infiniteLoadedElem.slice(this.infiniteSkipCnt, this.infiniteSkipCnt +
                this.parent.filterSettings.itemsCount)), this.cBox);
            this.cBox.scrollTop = this.infiniteScrollAppendDiff;
            this.prevInfiniteScrollDirection = 'up';
        }
    }

    private makeInfiniteScrollRequest(query?: Query): void {
        if (!this.infiniteInitialLoad && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
            setTimeout(() => {
                if (this.infiniteQueryExecutionPending) {
                    this.showMask();
                }
            }, 500);
        } else if (!this.infiniteInitialLoad) {
            createSpinner({ target: this.spinner, cssClass: this.parent.cssClass ? this.parent.cssClass : null }, this.parent
                .createElement);
            showSpinner(this.spinner);
        }
        const fName: string = 'fn';
        if (this.infiniteQuery && this.infiniteQuery.queries && this.infiniteQuery.queries.length) {
            for (let i: number = 0; i < this.infiniteQuery.queries.length; i++) {
                if (this.infiniteQuery.queries[i as number][`${fName}`] === 'onTake'
                || this.infiniteQuery.queries[i as number][`${fName}`] === 'onSkip') {
                    this.infiniteQuery.queries.splice(i, 1);
                    i--;
                }
            }
        }
        const existQuery: boolean = query ? true : false;
        query = query ? query : this.infiniteQuery;
        if (this.infiniteInitialLoad || this.infiniteSearchValChange) {
            this.infiniteSkipCnt = 0;
        } else  {
            this.infiniteSkipCnt += this.parent.filterSettings.itemsCount;
        }
        query.skip(this.infiniteSkipCnt);
        if (this.infiniteInitialLoad || this.infiniteSearchValChange) {
            query.take(this.parent.filterSettings.itemsCount * 3);
            this.infiniteSkipCnt += this.parent.filterSettings.itemsCount * 2;
        } else {
            query.take(this.parent.filterSettings.itemsCount);
        }
        if (!existQuery) {
            if (this.parent.dataSource && 'result' in this.parent.dataSource) {
                const args: FilterSearchBeginEventArgs = {
                    requestType: events.filterChoiceRequest, query: query, filterChoiceCount: null, filterModel: this
                };
                if (this.infiniteRenderMod && this.parent.filterSettings.itemsCount) {
                    args.filterChoiceCount = this.parent.filterSettings.itemsCount;
                }
                this.filterEvent(args, query);
            } else {
                this.processDataOperation(query);
                this.infiniteQueryExecutionPending = true;
            }
        }
    }

    private processDataOperation(query: Query, isInitial?: boolean): void {

        this.options.dataSource = this.options.dataSource instanceof DataManager ?
            this.options.dataSource : new DataManager(this.options.dataSource as JSON[]);
        const allPromise: Promise<Object>[] = [];
        const runArray: Function[] = [];
        if (this.isForeignColumn(this.options.column as Column) && isInitial) {
            const colData: DataManager = ('result' in this.options.column.dataSource) ?
                new DataManager((this.options.column.dataSource as DataResult).result) :
                this.options.column.dataSource as DataManager;
            this.foreignKeyQuery.params = query.params;
            allPromise.push(colData.executeQuery(this.foreignKeyQuery));
            runArray.push((data: Object[]) => this.foreignKeyData = data);
        }
        this.addInfiniteScrollEvent(query);
        if (this.infiniteRenderMod && this.infiniteInitialLoad && !this.options.isRemote) {
            const field: string = this.isForeignColumn(this.options.column as Column) ? this.options.foreignKeyValue :
                this.options.column.field;
            this.options.dataSource.executeQuery(new Query().sortBy(field, DataUtil.fnAscending)).then((e: ReturnOption) => {
                (this.options.dataSource as DataManager).dataSource.json = e.result as JSON[];
                this.executeQueryOperations(query, allPromise, runArray);
            });
        } else {
            this.executeQueryOperations(query, allPromise, runArray);
        }
    }
    private executeQueryOperations(query: Query, allPromise: Promise<Object>[], runArray: Function[]): void {
        allPromise.push((this.options.dataSource as DataManager).executeQuery(query));
        runArray.push(this.dataSuccess.bind(this));
        let i: number = 0;
        Promise.all(allPromise).then((e: ReturnType[]) => {
            this.infiniteQueryExecutionPending = this.infiniteRenderMod ? false : this.infiniteQueryExecutionPending;
            for (let j: number = 0; j < e.length; j++) {
                this.infiniteDataCount = this.infiniteRenderMod && !this.infiniteDataCount ? e[j as number].count : this.infiniteDataCount;
                runArray[i++](e[parseInt(j.toString(), 10)].result);
            }
        }).catch(() => {
            if (this.infiniteRenderMod && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
                this.parent.showMaskRow(undefined, this.dialogObj.element);
            }
        });
    }
    private dataSuccess(e: Object[]): void {
        if (!this.infiniteInitialLoad && this.infiniteDataCount && ((this.infiniteSkipCnt >= this.infiniteDataCount
            && !this.infiniteSearchValChange) || (e.length === 0))) {
            return;
        }
        this.fullData = e;
        const args1: CheckBoxBeforeRenderer = { dataSource: this.fullData, executeQuery: true, field: this.options.field };
        this.parent.notify(events.beforeCheckboxRenderer, args1 );
        if (args1.executeQuery) {
            const query: Query = new Query();
            if (!this.customQuery){
                this.isExecuteLocal = true;
                this.queryGenerate(query);
                this.isExecuteLocal = false;
            }
            // query.select(this.options.field);
            const result: Object[] = new DataManager(args1.dataSource as JSON[]).executeLocal(query);
            const col: Column = this.options.column as Column;
            this.filteredData = (CheckBoxFilterBase.getDistinct(result, this.options.field, col, this.foreignKeyData, this) as
                { records: Object[] }).records || [];
        }
        const data: object[] = args1.executeQuery ? this.filteredData : args1.dataSource ;
        this.processDataSource(null, true, data, args1);
        if ((this.infiniteRenderMod && this.infiniteInitialLoad) || !this.infiniteRenderMod) {
            if (this.sInput) {
                this.sInput.focus();
            } else if (this.dlg.querySelector('.e-chk-hidden') && this.dlg.querySelector('.e-ftrchk')) {
                (this.dlg.querySelector('.e-chk-hidden') as HTMLElement).focus();
                this.dlg.querySelector('.e-ftrchk').classList.add('e-chkfocus');
            }
        }
        if (this.infiniteInitialLoad || this.infiniteSearchValChange) {
            this.infiniteInitialLoad = false;
            this.infiniteSearchValChange = false;
        }
        const args: Object = {
            requestType: events.filterAfterOpen,
            columnName: this.options.field, columnType: this.options.type
        };
        const filterModel: string = 'filterModel';
        args[`${filterModel}`] = this;
        this.parent.notify(events.cBoxFltrComplete, args);
        if (this.isCheckboxFilterTemplate) {
            hideSpinner(this.spinner);
        }
    }

    private queryGenerate(query: Query): void {
        if (this.parent.searchSettings && this.parent.searchSettings.key.length) {
            const moduleName : Function = (<{ getModuleName?: Function }>this.options.dataManager.adaptor).getModuleName;
            if (!isNullOrUndefined((this.parent as IGrid).getDataModule) && moduleName && moduleName() === 'ODataV4Adaptor') {
                (this.parent as IGrid).getDataModule().searchQuery(query);
            } else {
                const searchSettings: SearchSettingsModel = this.parent.searchSettings;
                const fields: string[] = searchSettings.fields.length ? searchSettings.fields
                    : this.options.columns.map((f: Column) => f.field);
                query.search(searchSettings.key, fields, searchSettings.operator, searchSettings.ignoreCase, searchSettings.ignoreAccent);
            }
        }
        if ((this.options.filteredColumns.length)) {
            const cols: Object[] = [];
            for (let i: number = 0; i < this.options.filteredColumns.length; i++) {
                const filterColumn: { uid: string, field: string } = this.options.filteredColumns[parseInt(i.toString(), 10)] as {
                    uid: string, field: string };
                if (this.options.uid) {
                    filterColumn.uid = filterColumn.uid || this.parent.getColumnByField(filterColumn.field).uid;
                    if (filterColumn.uid !== this.options.uid) {
                        cols.push(this.options.filteredColumns[parseInt(i.toString(), 10)]);
                    }
                } else {
                    if (filterColumn.field !== this.options.field) {
                        cols.push(this.options.filteredColumns[parseInt(i.toString(), 10)]);
                    }
                }
            }
            const predicate: Predicate = this.getPredicateFromCols(cols, this.isExecuteLocal);
            if (predicate) {
                query.where(predicate);
            }
        }
    }

    private processDataSource(query?: Query, isInitial?: boolean, dataSource?: Object[], args?: CheckBoxBeforeRenderer): void {
        showSpinner(this.spinner);
        // query = query ? query : this.options.query.clone();
        // query.requiresCount();
        // let result: Object = new DataManager(dataSource as JSON[]).executeLocal(query);
        // let res: { result: Object[] } = result as { result: Object[] };
        this.isExecuteLocal = true;
        this.updateResult();
        this.isExecuteLocal = false;
        const args1: Object = { dataSource: this.fullData, isCheckboxFilterTemplate: false, column: this.options.column,
            element: this.cBox, type: this.options.type, format: this.options.type, btnObj: this.options.isResponsiveFilter ? null :
                (<{ btnObj?: Button }>(this.dialogObj as DialogModel)).btnObj[0], searchBox: this.searchBox };
        this.parent.notify(events.beforeCheckboxfilterRenderer, args1);
        this.isCheckboxFilterTemplate = (<{ isCheckboxFilterTemplate?: boolean }>args1).isCheckboxFilterTemplate;
        if (!this.isCheckboxFilterTemplate) {
            this.createFilterItems(dataSource, isInitial, args);
        } else if (this.infiniteRenderMod && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
            this.removeMask();
        }
    }

    private processSearch(query: Query): void {
        this.processDataOperation(query);
    }

    private updateResult(): void {
        this.result = {};
        const predicate: Predicate = this.infiniteRenderMod && this.existingPredicate[this.options.field] ?
            this.getPredicateFromCols(this.existingPredicate[this.options.field], this.isExecuteLocal) :
            this.getPredicateFromCols(this.options.filteredColumns, this.isExecuteLocal);
        const query: Query = new Query();
        if (predicate) {
            query.where(predicate);
        }
        this.parent.notify(events.beforeCheckboxRendererQuery, { query: query });
        const result: Object[] = new DataManager(this.fullData as JSON[]).executeLocal(query);
        for (const res of result) {
            this.result[getObject(this.options.field, res)] = true;
        }
    }

    private clickHandler(e: MouseEvent): void {
        if (!isNullOrUndefined(Global.timer)) {
            clearTimeout(Global.timer as number);
        }
        const target: Element = e.target as Element;
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer'
            && parentsUntil(target, 'e-mask-ftrchk')) { return; }
        const elem: Element = parentsUntil(target, 'e-checkbox-wrapper');
        if (parentsUntil(target, 'e-searchbox')) {
            this.searchBoxClick(e);
        }
        if (elem && !this.isCheckboxFilterTemplate) {
            const selectAll: Element = elem.querySelector('.e-selectall');
            if (selectAll) {
                this.updateAllCBoxes(!selectAll.classList.contains('e-check'));
            } else {
                toogleCheckbox(elem.parentElement);
                if (this.infiniteRenderMod && !elem.parentElement.querySelector('.e-add-current')) {
                    this.localInfiniteSelectionInteracted = true;
                    const caseSen: boolean = this.options.allowCaseSensitive;
                    const span: Element = elem.parentElement.querySelector('.e-frame');
                    const input: HTMLInputElement = span.previousSibling as HTMLInputElement;
                    const optr: string = input.checked ? 'equal' : 'notequal';
                    const pred: string = input.checked ? 'or' : 'and';
                    const defaults: { predicate?: string, field?: string, type?: string, uid?: string, operator?: string,
                        matchCase?: boolean, ignoreAccent?: boolean } = { field: this.options.field, predicate: pred, uid: this.options.uid,
                        operator: optr, type: this.options.type, matchCase: caseSen, ignoreAccent: this.options.ignoreAccent
                    };
                    const value: string = this.values[parentsUntil(input, 'e-ftrchk').getAttribute('data-uid')];
                    this.updateInfiniteManualSelectPred(defaults, value);
                    if (this.infiniteRenderMod && !this.options.isRemote && this.options.parentTotalDataCount
                        && this.infiniteUnloadParentExistPred.length) {
                        const predicate: Predicate = this.getPredicateFromCols(this.options.filteredColumns
                            .concat(...this.infiniteManualSelectMaintainPred), true);
                        const query: Query = new Query();
                        if (predicate) {
                            query.where(predicate);
                        }
                        const result: Object[] = new DataManager(this.infinitePermenantLocalData as JSON[]).executeLocal(query);
                        if (this.options.parentTotalDataCount !== result.length) {
                            this.options.parentTotalDataCount = result.length;
                        }
                        if (!this.options.parentTotalDataCount && this.infiniteUnloadParentExistPred.length) {
                            this.infiniteUnloadParentExistPred = [];
                        }
                    }
                    if (this.infiniteUnloadParentExistPred.length && (this.options.parentTotalDataCount === this.infiniteDataCount
                        || !this.options.parentTotalDataCount)) {
                        this.infiniteUnloadParentExistPred = [];
                    }
                }
            }
            this.updateIndeterminatenBtn();
            (elem.querySelector('.e-chk-hidden') as HTMLElement).focus();
        }
        this.setFocus(parentsUntil(elem, 'e-ftrchk'));
    }

    private updateInfiniteManualSelectPred(defaults: { predicate?: string, field?: string, type?: string, uid?: string, operator?: string,
        matchCase?: boolean, ignoreAccent?: boolean }, value: string): void {
        for (let i: number = 0; i < this.infiniteManualSelectMaintainPred.length; i++) {
            const predmdl: PredicateModel = this.infiniteManualSelectMaintainPred[i as number];
            if (predmdl.value + '' === value + '' && (predmdl.operator === 'equal' || predmdl.operator === 'notequal')) {
                this.infiniteManualSelectMaintainPred.splice(i, 1);
                break;
            }
        }
        if ((defaults.predicate === 'or' && (!this.localInfiniteSelectAllClicked || !this.infiniteLocalSelectAll))
        || (defaults.predicate === 'and' && (!this.localInfiniteSelectAllClicked || this.infiniteLocalSelectAll))) {
            this.infiniteManualSelectMaintainPred.push(extend({}, { value: value }, defaults) as {
                field: string, predicate: string, operator: string, matchCase: boolean, ignoreAccent: boolean, value: string
            });
            if (defaults.predicate === 'or') {
                this.options.parentTotalDataCount++;
            } else {
                this.options.parentTotalDataCount--;
            }
        }
    }

    /**
     * Method to set the next target element on keyboard navigation using arrow keys.
     *
     * @param {KeyboardEventArgs} e - Defines the Keyboard event argument
     * @param {HTMLElement[]} focusableElements - Defines the Focusable elements
     * @returns {void}
     */
    private focusNextOrPrev(e: KeyboardEventArgs, focusableElements: HTMLElement[]): void {
        const nextIndex: number = (e.key === 'ArrowUp') ? focusableElements.indexOf(document.activeElement as HTMLElement) - 1
            : focusableElements.indexOf(document.activeElement as HTMLElement) + 1;
        const nextElement: Element = focusableElements[((nextIndex + focusableElements.length) % focusableElements.length)];

        // Set focus on the next / previous element
        if (nextElement) {
            (nextElement as HTMLElement).focus();
            const target: Element = nextElement.classList.contains('e-chk-hidden') ? parentsUntil(nextElement, 'e-ftrchk') : nextElement;
            this.setFocus(target);
        }
    }

    private keyupHandler(e: KeyboardEventArgs): void {
        if (e.key === 'Tab' || ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.altKey)) {
            this.setFocus(parentsUntil(e.target as Element, 'e-ftrchk'));
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.altKey && this.parent.filterSettings
            && (<{type: string}>this.parent.filterSettings).type === 'CheckBox') {
            e.preventDefault();
            const focusableElements: HTMLElement[] = Array.from(this.dlg.querySelectorAll(
                'input, button, [tabindex]:not([tabindex="-1"])'
            ));
            this.focusNextOrPrev(e, focusableElements);
        }
    }

    private setFocus(elem?: Element): void {
        const prevElem: Element = this.dlg.querySelector('.e-chkfocus');
        if (prevElem) {
            prevElem.classList.remove('e-chkfocus');
        }
        if (elem && elem !== prevElem) {
            elem.classList.add('e-chkfocus');
        }
    }

    private updateAllCBoxes(checked: boolean): void {
        if (this.infiniteRenderMod) {
            this.localInfiniteSelectAllClicked = true;
            this.infiniteLocalSelectAll = checked;
            this.infiniteUnloadParentExistPred = [];
            this.infiniteManualSelectMaintainPred = [];
        }
        const cBoxes: Element[] = this.infiniteRenderMod ?
            this.infiniteLoadedElem.map((arr: HTMLElement) =>
                arr.querySelector('.e-frame')) : [].slice.call(this.cBox.querySelectorAll('.e-frame:not(.e-add-current)'));
        for (const cBox of cBoxes) {
            removeAddCboxClasses(cBox, checked);
            setChecked(cBox.previousSibling as HTMLInputElement, checked);
        }
    }

    private dialogOpen(): void {
        if (this.parent.element.classList.contains('e-device')) {
            this.dialogObj.element.querySelector('.e-input-group').classList.remove('e-input-focus');
            if (!this.options.isResponsiveFilter) {
                (<HTMLElement>this.dialogObj.element.querySelector('.e-btn')).focus();
            }
        }
    }

    private createCheckbox(value: string, checked: boolean, data: Object): Element {
        const elem: Element = checked ? this.cBoxTrue.cloneNode(true) as Element :
            this.cBoxFalse.cloneNode(true) as Element;
        setChecked(elem.querySelector('input'), checked);
        const label: Element = elem.querySelector('.e-label');
        const dummyData: Object = extendObjWithFn({}, data, { column: this.options.column, parent: this.parent });
        const innerText: string = this.options.disableHtmlEncode ? 'textContent' : 'innerHTML';
        label[`${innerText}`] = !isNullOrUndefined(value) && value.toString().length ?
            this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(value) : value : this.getLocalizedLabel('Blanks');
        const checkboxUid: string = getUid('cbox');
        label.setAttribute('id', checkboxUid + 'cboxLabel');
        elem.querySelector('input').setAttribute('aria-labelledby', label.id);
        if (label.innerHTML === this.getLocalizedLabel('Blanks')) {
            this.isBlanks = true;
        }
        if (typeof value === 'boolean') {
            label.innerHTML = value === true ? this.getLocalizedLabel('FilterTrue') : this.getLocalizedLabel('FilterFalse');
        }
        addClass([label], ['e-checkboxfiltertext']);
        if (this.options.template && data[this.options.column.field] !== this.getLocalizedLabel('SelectAll')
            && data[this.options.column.field] !== this.getLocalizedLabel('AddCurrentSelection')) {
            label.innerHTML = '';
            const isReactCompiler: boolean = this.parent.isReact && this.options.column.filter
                && typeof (this.options.column.filter.itemTemplate) !== 'string' &&
                !(this.options.column.filter.itemTemplate.prototype && this.options.column.filter.itemTemplate.prototype.CSPTemplate);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isReactChild: boolean = (this.parent as any).parentDetails && (this.parent as any).parentDetails.parentInstObj &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.parent as any).parentDetails.parentInstObj.isReact;
            if (isReactCompiler || isReactChild) {
                this.options.template(dummyData, this.parent, 'filterItemTemplate', null, null, null, label);
                this.parent.renderTemplates();
            } else {
                appendChildren(label, this.options.template(
                    dummyData, this.parent, 'filterItemTemplate', null, null, null, null, this.parent.root));
            }
        }
        return elem;
    }

    private updateIndeterminatenBtn(): void {
        let cnt: number = this.infiniteRenderMod ? this.infiniteLoadedElem.length : this.cBox.children.length - 1;
        let className: string[] = [];
        let disabled: boolean = false;
        const elem: Element = this.infiniteRenderMod ? this.sBox.querySelector('.e-selectall') : this.cBox.querySelector('.e-selectall');
        let selected: number = this.infiniteRenderMod ? this.infiniteLoadedElem.filter((arr: HTMLElement) => arr.querySelector('.e-check')).length :
            this.cBox.querySelectorAll('.e-check:not(.e-selectall):not(.e-add-current)').length;
        if (this.cBox.querySelector('.e-add-current')) {
            cnt -= 1;
        }
        let btn: Button;
        if (!this.options.isResponsiveFilter) {
            btn = (<{ btnObj?: Button }>(this.dialogObj as DialogModel)).btnObj[0];
            btn.disabled = false;
        }
        const input: HTMLInputElement = elem.previousSibling as HTMLInputElement;
        setChecked(input, false);
        input.indeterminate = false;
        if (this.infiniteRenderMod && this.sInput.value === '' && !this.options.parentCurrentViewDataCount && !this.localInfiniteSelectionInteracted
        && (!this.localInfiniteSelectAllClicked || (!this.infiniteLocalSelectAll && !selected)) && (cnt !== selected || cnt === selected)) {
            selected = 0;
        } else if (this.infiniteRenderMod && this.infiniteLoadedElem.length < this.infiniteDataCount
            && this.infiniteUnloadParentExistPred.length && (!selected || cnt === selected) && this.infiniteLocalSelectAll) {
            if (!selected) {
                selected += this.infiniteUnloadParentExistPred.length;
            } else {
                cnt += this.infiniteUnloadParentExistPred.length;
            }
        }
        if (cnt === selected) {
            if (this.infiniteRenderMod) {
                this.infiniteLocalSelectAll = true;
                this.localInfiniteSelectAllClicked = true;
                this.infiniteManualSelectMaintainPred = [];
            }
            className = ['e-check'];
            setChecked(input, true);
        } else if (selected) {
            className = ['e-stop'];
            input.indeterminate = true;
        } else {
            if (this.infiniteRenderMod) {
                this.infiniteLocalSelectAll = false;
                this.localInfiniteSelectAllClicked = true;
                this.infiniteManualSelectMaintainPred = [];
            }
            className = ['e-uncheck'];
            disabled = true;
            if (btn) { btn.disabled = true; }
        }
        if (btn) {
            this.filterState = !btn.disabled;
            btn.dataBind();
        }
        removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([elem], className);
        this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: disabled });
    }

    private createFilterItems(data: Object[], isInitial?: boolean, args1?: CheckBoxBeforeRenderer): void {
        const cBoxes: Element = this.parent.createElement('div');
        let btn: Button; let disabled: boolean = false;
        if (!this.options.isResponsiveFilter) {
            btn = (<{ btnObj?: Button }>(this.dialogObj as DialogModel)).btnObj[0];
        }
        let nullCounter: number = -1;
        let key: string = 'ejValue';
        if (!args1.executeQuery) {
            key = args1.field ;
        }
        for (let i: number = 0; i < data.length; i++) {
            const val: string = getValue(key, data[parseInt(i.toString(), 10)]);
            if (val === '' || isNullOrUndefined(val)) {
                nullCounter = nullCounter + 1;
            }
        }
        if (!this.infiniteRenderMod) {
            this.itemsCnt = nullCounter !== -1 ? data.length - nullCounter : data.length;
        }
        if (this.infiniteRenderMod && this.parent.filterSettings && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
            this.removeMask();
        }
        if (data.length && !this.renderEmpty) {
            const selectAllValue: string = this.getLocalizedLabel('SelectAll');
            const innerDiv: Element = this.cBox.querySelector('.e-checkfltrnmdiv');
            if (innerDiv) {
                innerDiv.classList.remove('e-checkfltrnmdiv');
            }
            const checkBox: Element = this.createCheckbox(selectAllValue, false, { [this.options.field]: selectAllValue });
            if (this.parent.cssClass) {
                if (this.parent.cssClass.indexOf(' ') !== -1) {
                    addClass([checkBox], this.parent.cssClass.split(' '));
                } else {
                    addClass([checkBox], [this.parent.cssClass]);
                }
            }
            if (this.infiniteInitialLoad || !this.infiniteRenderMod) {
                const selectAll: Element = createCboxWithWrap(getUid('cbox'), checkBox, 'e-ftrchk');
                selectAll.querySelector('.e-frame').classList.add('e-selectall');
                if (this.infiniteRenderMod) {
                    selectAll.classList.add('e-infinitescroll');
                    if ((this.parent as IGrid).enableAdaptiveUI) {
                        this.spinner.style.height  = (this.spinner.offsetHeight - getListHeight(this.cBox)) + 'px';
                    }
                    this.sBox.insertBefore(selectAll, this.spinner);
                }
                else {
                    cBoxes.appendChild(selectAll);
                }
            } else if (this.sBox.querySelector('.e-ftrchk .e-selectall')) {
                (this.sBox.querySelector('.e-ftrchk .e-selectall').previousSibling as HTMLInputElement).disabled = false;
                this.sBox.querySelector('.e-ftrchk .e-selectall').parentElement.classList.remove('e-checkbox-disabled');
            }
            let predicate: Predicate = new Predicate('field', 'equal', this.options.field);
            if (this.options.foreignKeyValue) {
                predicate = predicate.or('field', 'equal', this.options.foreignKeyValue);
            }
            const isColFiltered: number = new DataManager(this.options.filteredColumns as JSON[]).executeLocal(
                new Query().where(predicate)).length;
            if (this.sInput && this.sInput.value) {
                const predicateCheckBox: Element = this.createCheckbox(this.getLocalizedLabel('AddCurrentSelection'), false, {
                    [this.options.field]: this.getLocalizedLabel('AddCurrentSelection') });
                if (this.parent.cssClass) {
                    if (this.parent.cssClass.indexOf(' ') !== -1) {
                        addClass([predicateCheckBox], this.parent.cssClass.split(' '));
                    } else {
                        addClass([predicateCheckBox], [this.parent.cssClass]);
                    }
                }
                if ((this.infiniteRenderMod && (!isNullOrUndefined(this.sBox.children[2])
                && (this.sBox.children[2] as HTMLElement).innerText !== this.getLocalizedLabel('AddCurrentSelection'))) || !this.infiniteRenderMod) {
                    const predicateElement: Element = createCboxWithWrap(getUid('cbox'), predicateCheckBox, 'e-ftrchk');
                    predicateElement.querySelector('.e-frame').classList.add('e-add-current');
                    if (this.infiniteRenderMod) {
                        predicateElement.classList.add('e-infinitescroll');
                        this.sBox.insertBefore(predicateElement, this.spinner);
                        const checkBoxListElem: HTMLElement = this.spinner.querySelector('.e-checkboxlist');
                        const reduceHeight: number = Math.ceil(predicateElement.getBoundingClientRect().height);
                        checkBoxListElem.style.height = (parseInt(getComputedStyle(checkBoxListElem).height.split('px')[0], 10) - reduceHeight)
                        + 'px';
                        checkBoxListElem.style.minHeight = checkBoxListElem.style.height;
                    } else {
                        cBoxes.appendChild(predicateElement);
                    }
                } else if (this.sBox.querySelector('.e-ftrchk .e-add-current')) {
                    (this.sBox.querySelector('.e-ftrchk .e-add-current').previousSibling as HTMLInputElement).disabled = false;
                    this.sBox.querySelector('.e-ftrchk .e-add-current').parentElement.classList.remove('e-checkbox-disabled');
                }
            } else if (this.infiniteRenderMod && !isNullOrUndefined(this.sBox.children[2])
                && (this.sBox.children[2] as HTMLElement).innerText === this.getLocalizedLabel('AddCurrentSelection')) {
                const checkBoxListElem: HTMLElement = this.spinner.querySelector('.e-checkboxlist');
                const increaseHeight: number = Math.ceil(this.sBox.children[2].getBoundingClientRect().height);
                checkBoxListElem.style.height = (parseInt(getComputedStyle(checkBoxListElem).height.split('px')[0], 10) + increaseHeight)
                + 'px';
                checkBoxListElem.style.minHeight = checkBoxListElem.style.height;
                remove(this.sBox.children[2]);
            }
            let isRndere: boolean;
            for (let i: number = 0; i < data.length; i++) {
                const uid: string = getUid('cbox');
                this.values[`${uid}`] = getValue(key, data[parseInt(i.toString(), 10)]);
                let value: string | number = getValue(this.options.field, data[parseInt(i.toString(), 10)]);
                if (this.options.formatFn) {
                    value = this.valueFormatter.toView(value as number, this.options.formatFn) as string;
                }
                const args: { value: string | number, column: ColumnModel, data: Object }
                            = { value: value, column: this.options.column, data: data[parseInt(i.toString(), 10)] };
                this.parent.notify(events.filterCboxValue, args);
                value = args.value;
                if ((value === '' || isNullOrUndefined(value))) {
                    if (isRndere) { continue; }
                    isRndere = true;
                }
                if (this.infiniteRenderMod) {
                    this.updateInfiniteUnLoadedCheckboxExistPred(value, this.infiniteUnloadParentExistPred);
                }
                const checkbox: Element =
                this.localInfiniteSelectAllClicked ?
                    this.createCheckbox(value as string, this.infiniteLocalSelectAll, getValue('dataObj', data[i as number])) :
                    this.createCheckbox(value as string,
                                        this.getCheckedState(isColFiltered, this.values[`${uid}`]), getValue('dataObj', data[i as number]));
                cBoxes.appendChild(createCboxWithWrap(uid, checkbox, 'e-ftrchk'));
                if (this.infiniteRenderMod) {
                    (cBoxes.lastChild as HTMLElement).style.height = getListHeight(this.cBox) + 'px';
                }
            }
            const scrollTop: number = this.cBox.scrollTop;
            if (!this.infiniteRenderMod || this.infiniteSearchValChange) {
                this.cBox.innerHTML = '';
            } else if (this.infiniteRenderMod && this.cBox.children.length) {
                infiniteRemoveElements(([].slice.call(this.cBox.children)).splice(0, this.parent.filterSettings.itemsCount));
            }
            if (this.infiniteRenderMod) {
                this.infiniteLoadedElem.push(...[].slice.call(cBoxes.children));
                this.itemsCnt = nullCounter !== -1 ? this.infiniteLoadedElem.length - nullCounter : this.infiniteLoadedElem.length;
            }
            if (this.infiniteUnloadParentExistPred.length && (this.infiniteLoadedElem.length >= this.infiniteDataCount
                || !this.options.parentCurrentViewDataCount || (this.options.parentTotalDataCount === this.infiniteDataCount
                    && this.options.parentCurrentViewDataCount))) {
                this.infiniteUnloadParentExistPred = [];
            }
            appendChildren(this.cBox, [].slice.call(cBoxes.children));
            if (this.infiniteRenderMod && !this.infiniteScrollAppendDiff) {
                this.infiniteScrollAppendDiff = Math.round(scrollTop - this.cBox.scrollTop);
            }
            this.updateIndeterminatenBtn();
            if (!this.infiniteRenderMod) {
                if (btn) { btn.disabled = false; }
                disabled = false;
            } else {
                if (btn && btn.disabled) {
                    disabled = true;
                } else {
                    disabled = false;
                }
            }
        } else {
            cBoxes.appendChild(this.parent.createElement('span', { innerHTML: this.getLocalizedLabel('NoResult') }));
            this.cBox.innerHTML = '';
            if (this.infiniteRenderMod) {
                const selectAll: HTMLElement = this.sBox.querySelector('.e-ftrchk .e-selectall');
                if (selectAll) {
                    const selectAllParent: HTMLElement = selectAll.parentElement.parentElement;
                    if (selectAll.classList.contains('e-check')) {
                        toogleCheckbox(selectAllParent);
                    } else if (selectAll.classList.contains('e-stop')) {
                        toogleCheckbox(selectAllParent);
                        selectAll.classList.remove('e-stop');
                        toogleCheckbox(selectAllParent);
                    }
                    (selectAll.previousSibling as HTMLInputElement).disabled = true;
                    selectAll.parentElement.classList.add('e-checkbox-disabled');
                }
                const addCurrSelection: HTMLElement = this.sBox.querySelector('.e-ftrchk .e-add-current');
                if (addCurrSelection) {
                    const addCurrSelectionParent: HTMLElement = addCurrSelection.parentElement.parentElement;
                    if (addCurrSelection.classList.contains('e-check')) {
                        toogleCheckbox(addCurrSelectionParent);
                    }
                    (addCurrSelection.previousSibling as HTMLInputElement).disabled = true;
                    addCurrSelection.parentElement.classList.add('e-checkbox-disabled');
                }
            }
            this.cBox.appendChild(this.parent.createElement('div', { className: 'e-checkfltrnmdiv' }));
            appendChildren(this.cBox.children[0], [].slice.call(cBoxes.children));
            if (btn) { btn.disabled = true; }
            disabled = true;
            this.filterState = !disabled;
        }
        if (btn && data.length) {
            this.filterState = !btn.disabled;
            btn.dataBind();
        }
        const args: {
            dataSource?: Object[], requestType?: string,
            filterModel?: CheckBoxFilterBase
        } = { requestType: events.filterChoiceRequest, dataSource: this.renderEmpty ? [] : data };
        const filterModel: string = 'filterModel';
        args[`${filterModel}`] = this;
        this.parent.notify(events.cBoxFltrComplete, args);
        this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: disabled });
        if (this.infiniteRenderMod && this.infiniteInitialLoad) {
            this.cBox.style.marginTop = '0px';
        }
        hideSpinner(this.spinner);
    }

    private updateInfiniteUnLoadedCheckboxExistPred(value: string | number, updatePredArr: Object[]): void {
        for (let j: number = 0; j < updatePredArr.length; j++) {
            const pred: PredicateModel = updatePredArr[j as number] as PredicateModel;
            const predValue: string | number | boolean | (string | number | boolean | Date)[] = pred.value instanceof Date ?
                this.valueFormatter.toView(pred.value, this.options.formatFn) as string : pred.value;
            const column : Column = this.options.column as Column;
            if (column.isForeignColumn()) {
                const foreignDataObj: Object = getForeignData(column, {}, predValue as string | number, this.foreignKeyData)[0];
                value = getValue(column.foreignKeyField, foreignDataObj);
            }
            if (value === predValue && (pred.operator === 'equal' || pred.operator === 'notequal')) {
                this.infiniteManualSelectMaintainPred.push(updatePredArr[j as number]);
                updatePredArr.splice(j, 1);
                j--;
            }
        }
    }

    private getCheckedState(isColFiltered: number | boolean, value: string): boolean {
        if (!this.isFiltered || !isColFiltered) {
            return true;
        } else {
            const checkState: boolean = this.sInput && this.sInput.value ? true : this.result[`${value}`];
            if (this.infiniteRenderMod) {
                return checkState;
            } else {
                return this.options.operator === 'notequal' ? !checkState : checkState;
            }
        }
    }

    public static getDistinct(json: Object[], field: string, column?: Column, foreignKeyData?: Object[],
                              checkboxFilter?: CheckBoxFilterBase): Object {
        let len: number = json.length;
        const result: Object[] = [];
        let value: string;
        const ejValue: string = 'ejValue';
        const lookup: Object = {};
        const isForeignKey: boolean = column && column.isForeignColumn ? column.isForeignColumn() : false;

        while (len--) {
            value = json[parseInt(len.toString(), 10)] as string;
            if (column && column.type === 'dateonly' && typeof value[`${field}`] === 'string' && value[`${field}`]) {
                const arr: string[] = value[`${field}`].split(/[^0-9.]/);
                value[`${field}`] = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10));
            }
            value = getObject(field, value); //local remote diff, check with mdu
            const currentFilterValue: string = (typeof value === 'string') && !(isNullOrUndefined(checkboxFilter)) &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !(isNullOrUndefined((checkboxFilter.parent as any))) && !(isNullOrUndefined((checkboxFilter.parent as any).filterSettings)) &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !(isNullOrUndefined((checkboxFilter.parent as any).filterSettings.enableCaseSensitivity)) ? value.toLowerCase() : value;
            if (!(currentFilterValue in lookup)) {
                const obj: Object = {};
                obj[`${ejValue}`] = value;
                lookup[`${currentFilterValue}`] = true;
                if (isForeignKey) {
                    const foreignDataObj: Object = getForeignData(column, {}, value, foreignKeyData)[0];
                    setValue(events.foreignKeyData, foreignDataObj, json[parseInt(len.toString(), 10)]);
                    value = getValue(column.foreignKeyValue, foreignDataObj);
                }
                setValue(field, isNullOrUndefined(value) ? null : value, obj);
                setValue('dataObj', json[parseInt(len.toString(), 10)], obj);
                result.push(obj);
            }
        }
        return DataUtil.group(DataUtil.sort(result, field, DataUtil.fnAscending), 'ejValue');
    }

    public static getPredicate(columns: PredicateModel[], isExecuteLocal?: boolean): Predicate {
        const cols: PredicateModel[] = DataUtil.distinct(columns, 'field', true) || [];
        let collection: Object[] = [];
        const pred: Predicate = {} as Predicate;
        for (let i: number = 0; i < cols.length; i++) {
            collection = new DataManager(columns as JSON[]).executeLocal(
                new Query().where('field', 'equal', cols[parseInt(i.toString(), 10)].field));
            if (collection.length !== 0) {
                pred[cols[parseInt(i.toString(), 10)].field] = CheckBoxFilterBase.generatePredicate(collection, isExecuteLocal);
            }
        }
        return pred;
    }

    private static generatePredicate(cols: PredicateModel[], isExecuteLocal?: boolean): Predicate {
        const len: number = cols ? cols.length : 0;
        let predicate: Predicate;
        const operate: string = 'or';
        const first: PredicateModel = CheckBoxFilterBase.updateDateFilter(cols[0]);
        first.ignoreAccent = !isNullOrUndefined(first.ignoreAccent) ? first.ignoreAccent : false;
        if (first.type === 'date' || first.type === 'datetime' || first.type === 'dateonly') {
            predicate = getDatePredicate(first, first.type, isExecuteLocal);
        } else {
            predicate = first.ejpredicate ? first.ejpredicate as Predicate :
                new Predicate(
                    first.field, first.operator, first.value, !CheckBoxFilterBase.getCaseValue(first),
                    first.ignoreAccent) as Predicate;
        }
        for (let p: number = 1; p < len; p++) {
            cols[parseInt(p.toString(), 10)] = CheckBoxFilterBase.updateDateFilter(cols[parseInt(p.toString(), 10)]);
            if (len > 2 && p > 1 && ((cols[p as number].predicate === 'or' && cols[p as number - 1].predicate === 'or')
                || (cols[p as number].predicate === 'and' && cols[p as number - 1].predicate === 'and'))) {
                if (cols[p as number].type === 'date' || cols[p as number].type === 'datetime' || cols[p as number].type === 'dateonly') {
                    predicate.predicates.push(
                        getDatePredicate(cols[parseInt(p.toString(), 10)], cols[p as number].type, isExecuteLocal));
                } else {
                    predicate.predicates.push(new Predicate(
                        cols[p as number].field, cols[parseInt(p.toString(), 10)].operator,
                        cols[parseInt(p.toString(), 10)].value, !CheckBoxFilterBase.getCaseValue(cols[parseInt(p.toString(), 10)]),
                        cols[parseInt(p.toString(), 10)].ignoreAccent));
                }
            } else {
                if (cols[p as number].type === 'date' || cols[p as number].type === 'datetime' || cols[p as number].type === 'dateonly') {
                    if (cols[parseInt(p.toString(), 10)].predicate === 'and' && cols[parseInt(p.toString(), 10)].operator === 'equal') {
                        predicate = (predicate[`${operate}`] as Function)(
                            getDatePredicate(cols[parseInt(p.toString(), 10)], cols[parseInt(p.toString(), 10)].type, isExecuteLocal),
                            cols[parseInt(p.toString(), 10)].type, cols[parseInt(p.toString(), 10)].ignoreAccent);
                    } else {
                        predicate = (predicate[((cols[parseInt(p.toString(), 10)] as Predicate).predicate) as string] as Function)(
                            getDatePredicate(cols[parseInt(p.toString(), 10)], cols[parseInt(p.toString(), 10)].type, isExecuteLocal),
                            cols[parseInt(p.toString(), 10)].type, cols[parseInt(p.toString(), 10)].ignoreAccent);
                    }
                } else {
                    predicate = cols[parseInt(p.toString(), 10)].ejpredicate ?
                        (predicate[(cols[parseInt(p.toString(), 10)] as Predicate)
                            .predicate as string] as Function)(cols[parseInt(p.toString(), 10)].ejpredicate) :
                        (predicate[(cols[parseInt(p.toString(), 10)].predicate) as string] as Function)(
                            cols[parseInt(p.toString(), 10)].field, cols[parseInt(p.toString(), 10)].operator,
                            cols[parseInt(p.toString(), 10)].value, !CheckBoxFilterBase.getCaseValue(cols[parseInt(p.toString(), 10)]),
                            cols[parseInt(p.toString(), 10)].ignoreAccent);
                }
            }
        }
        return predicate || null;
    }
    private static getCaseValue(filter: PredicateModel): boolean {
        if (isNullOrUndefined(filter.matchCase)) {
            if (filter.type === 'string' || isNullOrUndefined(filter.type) && typeof (filter.value) === 'string') {
                return false;
            } else {
                return true;
            }
        } else {
            return filter.matchCase;
        }
    }

    private static updateDateFilter(filter: PredicateModel): PredicateModel {
        if ((filter.type === 'date' || filter.type === 'datetime' || filter.type === 'dateonly' || filter.value instanceof Date)) {
            filter.type = filter.type || 'date';
        }
        return filter;
    }

}
