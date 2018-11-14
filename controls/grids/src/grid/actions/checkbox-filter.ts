/* tslint:disable-next-line:max-line-length */
import { EventHandler, L10n, isNullOrUndefined, extend, classList, addClass, removeClass, Browser, getValue, setValue } from '@syncfusion/ej2-base';
import { parentsUntil, getUid, isActionPrevent, appendChildren, getDatePredicate } from '../base/util';
import { remove, debounce } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DataUtil, Query, DataManager, Predicate, UrlAdaptor, Deferred } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { ReturnType } from '../base/type';
import { FilterSettings } from '../base/grid';
import { IGrid, IFilterArgs, FilterSearchBeginEventArgs, DataStateChangeEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { PredicateModel } from '../base/grid-model';
import { ValueFormatter } from '../services/value-formatter';
import { getForeignData } from '../base/util';
import { Column } from '../models/column';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { getFilterMenuPostion, toogleCheckbox, createCboxWithWrap, removeAddCboxClasses, getColumnByForeignKeyValue } from '../base/util';
import { InputArgs }  from '@syncfusion/ej2-inputs';
/**
 * @hidden
 * `CheckBoxFilter` module is used to handle filtering action.
 */
export class CheckBoxFilter {
    //Internal variables     
    protected sBox: HTMLElement;
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
    protected options: IFilterArgs;
    protected filterSettings: FilterSettings;
    protected existingPredicate: { [key: string]: PredicateModel[] } = {};
    protected foreignKeyData: Object[];
    protected foreignKeyQuery: Query = new Query();
    protected filterState: boolean = true;
    protected values: Object = {};
    private cBoxTrue: Element;
    private cBoxFalse: Element;
    private itemsCnt: number;
    private result: Object;
    protected renderEmpty: boolean = false;
    //Module declarations
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected localeObj: L10n;
    protected valueFormatter: ValueFormatter;
    private searchHandler: Function;
    /**
     * Constructor for checkbox filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.id = this.parent.element.id;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
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
    }

    /** 
     * To destroy the filter bar. 
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        this.closeDialog();
    }


    private wireEvents(): void {
        EventHandler.add(this.dlg, 'click', this.clickHandler, this);
        this.searchHandler = debounce(this.searchBoxKeyUp, 200);
        EventHandler.add(this.dlg.querySelector('.e-searchinput'), 'keyup', this.searchHandler, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.dlg, 'click', this.clickHandler);
        let elem: Element = this.dlg.querySelector('.e-searchinput');
        if (elem) {
            EventHandler.remove(elem, 'keyup', this.searchHandler);
        }
    }

    protected foreignKeyFilter(args: Object, fColl?: Object[], mPredicate?: Predicate): void {
        let fPredicate: { predicate?: Predicate } = {};
        let filterCollection: PredicateModel[] = [];
        let query: Query = this.foreignKeyQuery.clone();
        (<Promise<Object>>(<DataManager>this.options.column.dataSource).
            executeQuery(query.where(mPredicate))).then((e: ReturnType) => {
                this.options.column.columnData = e.result;
                this.parent.notify(events.generateQuery, { predicate: fPredicate, column: this.options.column });
                (<{ ejpredicate: Predicate[] }>args).ejpredicate = fPredicate.predicate.predicates;
                fPredicate.predicate.predicates.forEach((fpred: Predicate) => {
                    filterCollection.push({
                        field: fpred.field,
                        predicate: 'or',
                        matchCase: fpred.ignoreCase,
                        ignoreAccent: fpred.ignoreAccent,
                        operator: fpred.operator,
                        value: <string>fpred.value,
                        type: this.options.type
                    });
                });
                (<{ filterCollection: PredicateModel[] }>args).filterCollection = filterCollection.length ? filterCollection :
                    fColl.filter((col: PredicateModel) => col.field = this.options.field);
                this.options.handler(args);
            });
    }

    private foreignFilter(args: {filterCollection?: PredicateModel[]}, value: string): void {
        let operator: string = this.parent.getDataModule().isRemote() ?
            (this.options.column.type === 'string' ? 'contains' : 'equal') : (this.options.column.type ? 'startswith' : 'contains');
        let initalPredicate: Predicate =
        new Predicate(this.options.column.foreignKeyValue, operator, value, true,
                      this.parent.filterSettings.ignoreAccent);
        this.foreignKeyFilter(args, [args.filterCollection], initalPredicate);
    }

    private searchBoxClick(e: MouseEvent): void {
        let target: Element = e.target as Element;
        if (target.classList.contains('e-searchclear')) {
            this.sInput.value = '';
            this.refreshCheckboxes();
            this.updateSearchIcon();
            this.sInput.focus();
        }
    }

    private searchBoxKeyUp(e?: KeyboardEvent): void {
        this.refreshCheckboxes();
        this.updateSearchIcon();
    }

    private updateSearchIcon(): void {
        if (this.sInput.value.length) {
            classList(this.sIcon, ['e-chkcancel-icon'], ['e-search-icon']);
        } else {
            classList(this.sIcon, ['e-search-icon'], ['e-chkcancel-icon']);
        }
    }

    /** 
     * Gets the localized label by locale keyword. 
     * @param  {string} key  
     * @return {string}  
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObj.getConstant(key);
    }

    private updateDataSource(): void {
        let dataSource: Object[] = this.options.dataSource as Object[];
        let str : string = 'object';
        if (!(dataSource instanceof DataManager)) {
            for (let i: number = 0; i < dataSource.length; i++) {
                if (typeof dataSource !== str) {
                    let obj: Object = {};
                    obj[this.options.field] = dataSource[i];
                    dataSource[i] = obj;
                }
            }
        }
    }

    protected updateModel(options: IFilterArgs): void {
        this.options = options;
        this.existingPredicate = options.actualPredicate || {};
        this.options.dataSource = options.dataSource;
        this.updateDataSource();
        this.options.type = options.type || 'string';
        this.options.format = options.format || '';
        this.options.filteredColumns = options.filteredColumns || this.parent.filterSettings.columns;
        this.options.sortedColumns = options.sortedColumns || this.parent.sortSettings.columns as string[];
        this.options.query = options.query || new Query();
        this.options.allowCaseSensitive = options.allowCaseSensitive || false;
        this.values = {};
        this.localeObj = options.localeObj;
        this.isFiltered = options.filteredColumns.length;
    }

    protected getAndSetChkElem(options: IFilterArgs): HTMLElement {
        this.dlg = this.parent.createElement('div', {
            id: this.id + this.options.type + '_excelDlg',
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
            let inputargs: InputArgs = {
                element: this.sInput as HTMLInputElement, floatLabelType: 'Never', properties: {
                    placeholder: this.getLocalizedLabel('Search')
                }
            };
            Input.createInput(inputargs, this.parent.createElement);
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
        let args: {
            requestType: string, filterModel: CheckBoxFilter, columnName: string,
            columnType: string, cancel: boolean
        } = {
                requestType: events.filterBeforeOpen, filterModel: this,
                columnName: this.options.field, columnType: this.options.type, cancel: false
            };
        this.parent.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        this.dialogObj = new Dialog({
            visible: false, content: this.sBox as HTMLElement,
            close: this.closeDialog.bind(this),
            width: (!isNullOrUndefined(parentsUntil(options.target, 'e-bigger')))
                || this.parent.element.classList.contains('e-device') ? 260 : 255,
            target: this.parent.element, animationSettings:
                { effect: 'None' },
            buttons: [{
                click: this.btnClick.bind(this),
                buttonModel: {
                    content: this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton'),
                    cssClass: 'e-primary', isPrimary: true
                }
            },
            {
                click: this.btnClick.bind(this),
                buttonModel: { cssClass: 'e-flat', content: this.getLocalizedLabel(this.isExcel ? 'CancelButton' : 'ClearButton') }
            }],
            created: this.dialogCreated.bind(this),
            open: this.dialogOpen.bind(this)
        });
        this.dialogObj.appendTo(this.dlg as HTMLElement);
        this.dialogObj.element.style.maxHeight = '800px';
        this.dialogObj.show();
        this.wireEvents();
        createSpinner({ target: this.spinner }, this.parent.createElement);
        showSpinner(this.spinner);
        this.getAllData();
    }

    private dialogCreated(e: {}): void {
        if (!Browser.isDevice) {
            getFilterMenuPostion(this.options.target, this.dialogObj, this.parent);
        } else {
            this.dialogObj.position = { X: 'center', Y: 'center' };
        }
        this.parent.notify(events.filterDialogCreated, e);
    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
    }

    public closeDialog(): void {
        if (this.dialogObj && !this.dialogObj.isDestroyed) {
            let filterTemplateCol: Column[] = this.parent.getColumns().filter((col: Column) => col.getFilterItemTemplate());
            if (filterTemplateCol.length) {
                this.parent.destroyTemplate(['filterItemTemplate']);
            }
            this.parent.notify(events.filterMenuClose, { field: this.options.field });
            this.dialogObj.destroy();
            this.unWireEvents();
            remove(this.dlg);
            this.dlg = null;
        }
    }

    protected clearFilter(): void {
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.clearFilter });
            return;
        }
        this.options.handler({ action: 'clear-filter', field: this.options.field });
    }

    private btnClick(e: MouseEvent): void {
        if (this.filterState) {
            if ((<Element>e.target).tagName.toLowerCase() === 'input') {
                let value: string = (<HTMLInputElement>e.target).value;
                let args: Object = {
                    action: 'filtering', filterCollection: {
                        field: this.options.field,
                        operator: this.parent.getDataModule().isRemote() ?
                        (this.options.column.type === 'string' ? 'contains' : 'equal') :
                            (this.options.column.type === 'date' || this.options.column.type === 'datetime' ||
                                this.options.column.type === 'boolean' ? 'equal' : 'contains'),
                        value: value, matchCase: false, type: this.options.column.type
                    },
                    field: this.options.field
                };
                value ? this.options.column.isForeignColumn() ? this.foreignFilter(args, value) :
                this.options.handler(args) : this.closeDialog();
            } else {
                let text: string = (e.target as HTMLElement).firstChild.textContent.toLowerCase();
                if (this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton').toLowerCase() === text) {
                    this.fltrBtnHandler();
                } else if (this.getLocalizedLabel('ClearButton').toLowerCase() === text) {
                    this.clearFilter();
                }
            }
            this.closeDialog();
        } else if (!((<Element>e.target).tagName.toLowerCase() === 'input')) {
            this.clearFilter();
            this.closeDialog();
        }
    }

    private fltrBtnHandler(): void {
        let checked: Element[] = [].slice.call(this.cBox.querySelectorAll('.e-check:not(.e-selectall)'));
        let optr: string = 'equal';
        let caseSen: boolean = this.options.type === 'string' ?
            this.options.allowCaseSensitive : true;
        let defaults: { predicate?: string, field?: string, type?: string,
            operator?: string, matchCase?: boolean, ignoreAccent?: boolean } = {
            field: this.options.field, predicate: 'or',
            operator: optr, type: this.options.type, matchCase: caseSen, ignoreAccent: this.parent.filterSettings.ignoreAccent
        };
        let isNotEqual: boolean = this.itemsCnt !== checked.length && this.itemsCnt - checked.length < checked.length;
        if (isNotEqual) {
            optr = 'notequal';
            checked = [].slice.call(this.cBox.querySelectorAll('.e-uncheck:not(.e-selectall)'));
            defaults.predicate = 'and';
            defaults.operator = 'notequal';
        }
        let value: string;
        let fObj: PredicateModel;
        let coll: PredicateModel[] = [];
        let searchInput: HTMLInputElement = this.searchBox.querySelector('.e-searchinput') as HTMLInputElement;
        if (checked.length !== this.itemsCnt || (searchInput.value && searchInput.value !== '')) {
            for (let i: number = 0; i < checked.length; i++) {
                value = this.values[parentsUntil(checked[i], 'e-ftrchk').getAttribute('uid')];
                fObj = extend({}, { value: value }, defaults) as {
                    field: string, predicate: string, operator: string, matchCase: boolean, ignoreAccent: boolean, value: string
                };
                if (value && !value.toString().length) {
                    fObj.operator = isNotEqual ? 'notequal' : 'equal';
                }
                coll.push(fObj);
                if (isActionPrevent(this.parent)) {
                    this.parent.notify(events.preventBatch, {
                        instance: this, handler: this.fltrBtnHandler, arg1: fObj.field, arg2: fObj.predicate, arg3: fObj.operator,
                        arg4: fObj.matchCase, arg5: fObj.ignoreAccent, arg6: fObj.value
                    });
                    return;
                }
            }
            this.initiateFilter(coll);
        } else {
            this.clearFilter();
        }
    }

    private initiateFilter(fColl: PredicateModel[]): void {
        let firstVal: PredicateModel = fColl[0];
        let predicate: PredicateModel;
        if (!isNullOrUndefined(firstVal)) {
            predicate = firstVal.ejpredicate ? firstVal.ejpredicate :
                new Predicate(firstVal.field, firstVal.operator, firstVal.value, !firstVal.matchCase, firstVal.ignoreAccent);
            for (let j: number = 1; j < fColl.length; j++) {
                predicate = fColl[j].ejpredicate !== undefined ?
                    predicate[fColl[j].predicate](fColl[j].ejpredicate) :
                    predicate[fColl[j].predicate](
                        fColl[j].field, fColl[j].operator, fColl[j].value, !fColl[j].matchCase, fColl[j].ignoreAccent
                    );
            }
            let args: Object = {
                action: 'filtering', filterCollection: fColl, field: this.options.field,
                ejpredicate: Predicate.or(predicate)
            };
            this.options.handler(args);
        }
    }

    private refreshCheckboxes(): void {
        let val: string = this.sInput.value;
        let column: Column = this.options.column;
        let query: Query = column.isForeignColumn() ? this.foreignKeyQuery.clone() : this.options.query.clone();
        let foreignQuery: Query = this.options.query.clone();
        let parsed: string | number | Date | boolean = (this.options.type !== 'string' && parseFloat(val)) ? parseFloat(val) : val;
        let operator: string = this.parent.getDataModule().isRemote() ?
            (this.options.type === 'string' ? 'contains' : 'equal') : (this.options.type ? 'startswith' : 'contains');
        let matchCase: boolean = true;
        let ignoreAccent: boolean = this.parent.filterSettings.ignoreAccent;
        let field: string = column.isForeignColumn() ? column.foreignKeyValue : column.field;
        parsed = (parsed === '' || parsed === undefined) ? undefined : parsed;
        let predicte: Predicate;
        if (this.options.type === 'boolean') {
            if (parsed !== undefined &&
                this.getLocalizedLabel('FilterTrue').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1) {
                parsed = 'true';
            } else if (parsed !== undefined &&
                this.getLocalizedLabel('FilterFalse').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1) {
                parsed = 'false';
            }
            parsed = parsed === 'true';
            operator = 'equal';
        }
        this.addDistinct(query);
        let args: FilterSearchBeginEventArgs = {
            requestType: events.filterSearchBegin,
            filterModel: this, columnName: field, column: column,
            operator: operator, matchCase: matchCase, ignoreAccent: ignoreAccent, filterChoiceCount: null,
            query: query
        };
        this.parent.trigger(events.actionBegin, args);
        predicte = new Predicate(field, args.operator, parsed, args.matchCase, args.ignoreAccent);
        if (this.options.type === 'date' || this.options.type === 'datetime') {
            parsed = this.valueFormatter.fromView(val, this.options.parserFn, this.options.type);
            operator = 'equal';
            if (isNullOrUndefined(parsed) && val.length) {
                return;
            }
            let filterObj: Object = {
                field: field, operator: operator, value: parsed, matchCase: matchCase,
                ignoreAccent: ignoreAccent
            };
            predicte = getDatePredicate(filterObj, this.options.type);
        }
        if (val.length) {
            query.where(predicte);
        }
        args.filterChoiceCount = !isNullOrUndefined(args.filterChoiceCount) ? args.filterChoiceCount : 1000;
        let fPredicate: { predicate?: Predicate } = {};
        showSpinner(this.spinner);
        this.renderEmpty = false;
        if (column.isForeignColumn() && val.length) {
            // tslint:disable-next-line:no-any
            (column.dataSource as DataManager).executeQuery(query).then((e: any) => {
                let columnData: Object[] = this.options.column.columnData;
                this.options.column.columnData = e.result;
                this.parent.notify(events.generateQuery, { predicate: fPredicate, column: column });
                if (fPredicate.predicate.predicates.length) {
                    foreignQuery.where(fPredicate.predicate);
                } else {
                    this.renderEmpty = true;
                }
                this.options.column.columnData = columnData;
                foreignQuery.take(args.filterChoiceCount);
                this.search(args, foreignQuery);
            });
        } else {
            query.take(args.filterChoiceCount);
            this.search(args, query);
        }
    }

    protected search(args: FilterSearchBeginEventArgs, query: Query): void {
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.filterEvent(args, query);
        } else {
            this.processSearch(query);
        }
    }

    private getPredicateFromCols(columns: Object[]): Predicate {
        let predicates: Predicate = CheckBoxFilter.getPredicate(columns);
        let predicateList: Predicate[] = [];
        let fPredicate: { predicate?: Predicate } = {};
        let foreignColumn: Column[] = this.parent.getForeignKeyColumns();
        for (let prop of Object.keys(predicates)) {
            let col: Column = getColumnByForeignKeyValue(prop, foreignColumn);
            if (col) {
                this.parent.notify(events.generateQuery, { predicate: fPredicate, column: col });
                if (fPredicate.predicate.predicates.length) {
                    predicateList.push(Predicate.or(fPredicate.predicate.predicates));
                }
            } else {
                predicateList.push(<Predicate>predicates[prop]);
            }
        }
        return predicateList.length && Predicate.and(predicateList);
    }

    private addDistinct(query: Query): Query {
        let filteredColumn: Object[] = DataUtil.distinct(this.parent.filterSettings.columns, 'field');
        if (filteredColumn.indexOf(this.options.column.field) <= -1) {
            filteredColumn = filteredColumn.concat(this.options.column.field);
        }
        query.distinct(filteredColumn as string []);
        return query;
    }

    private getAllData(): void {
        let query: Query = this.parent.getQuery().clone();
        query.requiresCount(); //consider take query
        this.addDistinct(query);
        let args: {
            dataSource?: Object[], requestType?: string,
            filterModel: CheckBoxFilter, query: Query, filterChoiceCount: number
        } = {
                requestType: events.filterChoiceRequest, filterModel: this, query: query, filterChoiceCount: null
            };
        this.parent.trigger(events.actionBegin, args);
        args.filterChoiceCount = !isNullOrUndefined(args.filterChoiceCount) ? args.filterChoiceCount : 1000;
        query.take(args.filterChoiceCount);
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.filterEvent(args, query);
        } else {
            this.processDataOperation(query, true);
        }
    }

    private filterEvent(args: Object, query: Query): void {
        let def: Deferred = this.eventPromise(args, query);
        def.promise.then((e: ReturnType[]) => {
            this.dataSuccess(e);
        });
    }

    private eventPromise(args: Object, query: Query): Deferred {
        let state: DataStateChangeEventArgs;
        state = this.getStateEventArgument(query);
        let def: Deferred = new Deferred();
        state.dataSource = def.resolve;
        state.action = args;
        this.parent.trigger(events.dataStateChange, state);
        return def;
    };

    public getStateEventArgument(query: Query): Object {
        let adaptr: UrlAdaptor = new UrlAdaptor();
        let dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
        let state: { data?: string } = adaptr.processQuery(dm, query);
        let data: Object = JSON.parse(state.data);
        return data;
    };

    private processDataOperation(query: Query, isInitial?: boolean): void {

        this.options.dataSource = this.options.dataSource instanceof DataManager ?
            this.options.dataSource : new DataManager(this.options.dataSource as JSON[]);
        let allPromise: Promise<Object>[] = [];
        let runArray: Function[] = [];
        if (this.options.column.isForeignColumn() && isInitial) {
            allPromise.push((<DataManager>this.options.column.dataSource).executeQuery(this.foreignKeyQuery));
            runArray.push((data: Object[]) => this.foreignKeyData = data);
        }
        allPromise.push(
            this.options.dataSource.executeQuery(query)
        );
        runArray.push(this.dataSuccess.bind(this));
        let i: number = 0;
        Promise.all(allPromise).then((e: ReturnType[]) => {
            e.forEach((data: ReturnType) => {
                runArray[i++](data.result);
            });
        });
    }
    private dataSuccess(e: Object[]): void {
        this.fullData = e;
        let query: Query = new Query();
        if ((this.options.filteredColumns.length)) {
            let cols: Object[] = [];
            for (let i: number = 0; i < this.options.filteredColumns.length; i++) {
                if (!((this.options.filteredColumns[i] as { field: string }).field === this.options.field ||
                    (this.options.filteredColumns[i] as { field: string }).field === this.options.foreignKeyValue)) {
                    cols.push(this.options.filteredColumns[i]);
                }
            }
            let predicate: Predicate = this.getPredicateFromCols(cols);
            if (predicate) {
                query.where(predicate);
            }
        }
        // query.select(this.options.field);
        let result: Object[] = new DataManager(this.fullData as JSON[]).executeLocal(query);
        let col: Column = this.options.column;
        this.filteredData = (CheckBoxFilter.
            getDistinct(result, this.options.field, col, this.foreignKeyData)as { records: Object[] }).records || [];
        this.processDataSource(null, true, this.filteredData);
        this.sInput.focus();
        let args: Object = {
            requestType: events.filterAfterOpen,
            filterModel: this, columnName: this.options.field, columnType: this.options.type
        };
        this.parent.trigger(events.actionComplete, args);
    }

    private processDataSource(query?: Query, isInitial?: boolean, dataSource?: Object[]): void {
        showSpinner(this.spinner);
        // query = query ? query : this.options.query.clone();
        // query.requiresCount();
        // let result: Object = new DataManager(dataSource as JSON[]).executeLocal(query);
        // let res: { result: Object[] } = result as { result: Object[] };
        this.updateResult();
        this.createFilterItems(dataSource, isInitial);
    }

    private processSearch(query: Query): void {
        this.processDataOperation(query);
    }

    private updateResult(): void {
        this.result = {};
        let predicate: Predicate = this.getPredicateFromCols(this.options.filteredColumns);
        let query: Query = new Query();
        if (predicate) {
            query.where(predicate);
        }
        let result: Object[] = new DataManager(this.fullData as JSON[]).executeLocal(query);
        for (let res of result) {
            this.result[getValue(this.options.field, res)] = true;
        }
    }

    private clickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let elem: Element = parentsUntil(target, 'e-checkbox-wrapper');
        if (parentsUntil(target, 'e-searchbox')) {
            this.searchBoxClick(e);
        }
        if (elem) {
            let selectAll: Element = elem.querySelector('.e-selectall');
            if (selectAll) {
                this.updateAllCBoxes(!selectAll.classList.contains('e-check'));
            } else {
                toogleCheckbox(elem.parentElement);
            }
            this.updateIndeterminatenBtn();
            (elem.querySelector('.e-chk-hidden') as HTMLElement).focus();
        }
    }

    private updateAllCBoxes(checked: boolean): void {
        let cBoxes: Element[] = [].slice.call(this.cBox.querySelectorAll('.e-frame'));
        for (let cBox of cBoxes) {
            removeAddCboxClasses(cBox, checked);
        }
    }

    private dialogOpen(): void {
        if (this.parent.element.classList.contains('e-device')) {
            this.dialogObj.element.querySelector('.e-input-group').classList.remove('e-input-focus');
            (<HTMLElement>this.dialogObj.element.querySelector('.e-btn')).focus();
        }
    }

    private createCheckbox(value: string, checked: boolean, data: Object): Element {
        let elem: Element = checked ? this.cBoxTrue.cloneNode(true) as Element :
            this.cBoxFalse.cloneNode(true) as Element;
        let label: Element = elem.querySelector('.e-label');
        label.innerHTML = !isNullOrUndefined(value) && value.toString().length ? value :
            this.getLocalizedLabel('Blanks');
        addClass([label], ['e-checkboxfiltertext']);
        if (this.options.template) {
            label.innerHTML = '';
            appendChildren(label, this.options.template(data, this.parent, 'filterItemTemplate'));
        }
        return elem;
    }

    private updateIndeterminatenBtn(): void {
        let cnt: number = this.cBox.children.length - 1;
        let className: string[] = [];
        let elem: Element = this.cBox.querySelector('.e-selectall');
        let selected: number = this.cBox.querySelectorAll('.e-check:not(.e-selectall)').length;
        let btn: Button = (<{btnObj?: Button}>(this.dialogObj as DialogModel)).btnObj[0];
        btn.disabled = false;
        if (cnt === selected) {
            className = ['e-check'];
        } else if (selected) {
            className = ['e-stop'];
        } else {
            className = ['e-uncheck'];
            btn.disabled = true;
        }
        this.filterState = !btn.disabled;
        btn.dataBind();
        removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([elem], className);
    }

    private createFilterItems(data: Object[], isInitial?: boolean): void {
        let cBoxes: Element = this.parent.createElement('div');
        let btn: Button = (<{btnObj?: Button}>(this.dialogObj as DialogModel)).btnObj[0];
        this.itemsCnt = data.length;
        if (data.length && !this.renderEmpty) {
            let selectAllValue: string = this.getLocalizedLabel('SelectAll');
            let checkBox: Element = this.createCheckbox(selectAllValue, false, {[this.options.field]: selectAllValue});
            let selectAll: Element = createCboxWithWrap(getUid('cbox'), checkBox, 'e-ftrchk');
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            cBoxes.appendChild(selectAll);
            let predicate: Predicate = new Predicate('field', 'equal', this.options.field);
            if (this.options.foreignKeyValue) {
                predicate = predicate.or('field', 'equal', this.options.foreignKeyValue);
            }
            let isColFiltered: number = new DataManager(this.options.filteredColumns as JSON[]).executeLocal(
                new Query().where(predicate)).length;
            for (let i: number = 0; i < data.length; i++) {
                let uid: string = getUid('cbox');
                this.values[uid] = getValue('ejValue', data[i]);
                let value: string = this.valueFormatter.toView(getValue(this.options.field, data[i]), this.options.formatFn) as string;
                let checkbox: Element =
                this.createCheckbox(value, this.getCheckedState(isColFiltered, this.values[uid]), getValue('dataObj', data[i]));
                cBoxes.appendChild(createCboxWithWrap(uid, checkbox, 'e-ftrchk'));
            }
            this.cBox.innerHTML = '';
            appendChildren(this.cBox, [].slice.call(cBoxes.children));
            this.updateIndeterminatenBtn();
            btn.disabled = false;
        } else {
            cBoxes.appendChild(this.parent.createElement('span', { innerHTML: this.getLocalizedLabel('NoResult') }));
            this.cBox.innerHTML = '';
            appendChildren(this.cBox, [].slice.call(cBoxes.children));
            btn.disabled = true;
        }
        this.filterState = !btn.disabled;
        btn.dataBind();
        let args: {
            dataSource?: Object[], requestType?: string,
            filterModel: CheckBoxFilter
        } = { requestType: events.filterChoiceRequest, filterModel: this, dataSource: this.renderEmpty ? [] : data };
        this.parent.trigger(events.actionComplete, args);
        hideSpinner(this.spinner);
    }

    private getCheckedState(isColFiltered: number | boolean, value: string): boolean {
        if (!this.isFiltered || !isColFiltered) {
            return true;
        } else {
            return this.result[value];
        }
    }

    public static getDistinct(json: Object[], field: string, column?: Column, foreignKeyData?: Object[]): Object {
        let len: number = json.length;
        let result: Object[] = [];
        let value: string;
        let ejValue: string = 'ejValue';
        let lookup: Object = {};
        let isForeignKey: boolean = column && column.isForeignColumn();

        while (len--) {
            value = json[len] as string;
            value = getValue(field, value); //local remote diff, check with mdu           
            if (!isNullOrUndefined(value)) {
                if (!(value in lookup)) {
                    let obj: Object = {};
                    obj[ejValue] = value;
                    lookup[value] = true;
                    if (isForeignKey) {
                        let foreignDataObj: Object = getForeignData(column, {}, value, foreignKeyData)[0];
                        setValue(events.foreignKeyData, foreignDataObj, json[len]);
                        value = getValue(column.foreignKeyValue, foreignDataObj);
                    }
                    setValue(field, isNullOrUndefined(value) ? null : value, obj);
                    setValue('dataObj', json[len], obj);
                    result.push(obj);
                }
            }
        }
        return DataUtil.group(DataUtil.sort(result, field, DataUtil.fnAscending), 'ejValue');
    }

    public static getPredicate(columns: PredicateModel[]): Predicate {
        let cols: PredicateModel[] = DataUtil.distinct(columns, 'field', true) || [];
        let collection: Object[] = [];
        let pred: Predicate = {} as Predicate;
        for (let i: number = 0; i < cols.length; i++) {
            collection = new DataManager(columns as JSON[]).executeLocal(
                new Query().where('field', 'equal', cols[i].field));
            if (collection.length !== 0) {
                pred[cols[i].field] = CheckBoxFilter.generatePredicate(collection);
            }
        }
        return pred;
    }

    private static generatePredicate(cols: PredicateModel[]): Predicate {
        let len: number = cols ? cols.length : 0;
        let predicate: Predicate;
        let first: PredicateModel;
        first = CheckBoxFilter.updateDateFilter(cols[0]);
        first.ignoreAccent = !isNullOrUndefined(first.ignoreAccent) ? first.ignoreAccent : false;
        if (first.type === 'date' || first.type === 'datetime') {
            predicate = getDatePredicate(first, first.type);
        } else {
            predicate = first.ejpredicate ? first.ejpredicate as Predicate :
                new Predicate(
                    first.field, first.operator, first.value, !CheckBoxFilter.getCaseValue(first),
                    first.ignoreAccent) as Predicate;
        }
        for (let p: number = 1; p < len; p++) {
            cols[p] = CheckBoxFilter.updateDateFilter(cols[p]);
            if (len > 2 && p > 1 && cols[p].predicate === 'or') {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate.predicates.push(getDatePredicate(cols[p], cols[p].type));
                } else {
                    predicate.predicates.push(new Predicate(
                        cols[p].field, cols[p].operator, cols[p].value, !CheckBoxFilter.getCaseValue(cols[p]),
                        cols[p].ignoreAccent));
                }
            } else {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate = (predicate[((cols[p] as Predicate).predicate) as string] as Function)(
                        getDatePredicate(cols[p]), cols[p].type, cols[p].ignoreAccent);
                } else {
                    predicate = cols[p].ejpredicate ?
                        (predicate[(cols[p] as Predicate).predicate as string] as Function)(cols[p].ejpredicate) :
                        (predicate[(cols[p].predicate) as string] as Function)(
                            cols[p].field, cols[p].operator, cols[p].value, !CheckBoxFilter.getCaseValue(cols[p]), cols[p].ignoreAccent);
                }
            }
        }
        return predicate || null;
    }
    private static getCaseValue(filter: PredicateModel): boolean {
        if (isNullOrUndefined(filter.matchCase)) {
            return true;
        } else {
            return filter.matchCase;
        }
    }

    private static updateDateFilter(filter: PredicateModel): PredicateModel {
        if ((filter.type === 'date' || filter.type === 'datetime' || filter.value instanceof Date)) {
            filter.type = filter.type || 'date';
        }
        return filter;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'checkboxFilter';
    }

}
