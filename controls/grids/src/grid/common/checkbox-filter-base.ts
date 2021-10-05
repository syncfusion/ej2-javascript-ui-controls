/* tslint:disable-next-line:max-line-length */
import { EventHandler, L10n, isNullOrUndefined, extend, classList, addClass, removeClass, Browser, getValue, setValue } from '@syncfusion/ej2-base';
import { parentsUntil, getUid, appendChildren, getDatePredicate, getObject, extendObjWithFn, eventPromise, setChecked, clearReactVueTemplates } from '../base/util';
import { remove, debounce } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DataUtil, Query, DataManager, Predicate, Deferred, QueryOptions } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { ReturnType } from '../base/type';
import { IFilterArgs, FilterSearchBeginEventArgs, CheckBoxBeforeRenderer } from '../base/interface';
import * as events from '../base/constant';
import { PredicateModel } from '../base/grid-model';
import { ValueFormatter } from '../services/value-formatter';
import { getForeignData } from '../base/util';
import { Column, ColumnModel } from '../models/column';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { getFilterMenuPostion, toogleCheckbox, createCboxWithWrap, removeAddCboxClasses, getColumnByForeignKeyValue } from '../base/util';
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
    /** @hidden */
    public options: IFilterArgs;
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
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(this.dlg, 'click', this.clickHandler);
        EventHandler.remove(this.dlg, 'keyup', this.keyupHandler);
        const elem: Element = this.dialogObj.element.querySelector('.e-searchinput');
        if (elem) {
            EventHandler.remove(elem, 'keyup', this.searchHandler);
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
                    field: fpred[i].field,
                    predicate: 'or',
                    matchCase: fpred[i].ignoreCase,
                    ignoreAccent: fpred[i].ignoreAccent,
                    operator: fpred[i].operator,
                    value: <string>fpred[i].value,
                    type: this.options.type
                });
            }
            (<{ filterCollection: PredicateModel[] }>args).filterCollection = filterCollection.length ? filterCollection :
                fColl.filter((col: PredicateModel) => col.field = this.options.field);
            this.options.handler(args);
        });
    }

    private foreignFilter(args: { filterCollection?: PredicateModel[] }, value: string): void {
        const operator: string = this.options.isRemote ?
            (this.options.column.type === 'string' ? 'contains' : 'equal') : (this.options.column.type ? 'contains' : 'equal');
        const initalPredicate: Predicate =
            new Predicate(this.options.column.foreignKeyValue, operator, value, true, this.options.ignoreAccent);
        this.foreignKeyFilter(args, [args.filterCollection], initalPredicate);
    }

    private searchBoxClick(e: MouseEvent): void {
        const target: Element = e.target as Element;
        if (target.classList.contains('e-searchclear')) {
            this.sInput.value = '';
            this.refreshCheckboxes();
            this.updateSearchIcon();
            this.sInput.focus();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        this.options.dataManager = options.dataManager ? options.dataManager : options.dataSource as DataManager;
        this.updateDataSource();
        this.options.type = options.type;
        this.options.format = options.format || '';
        this.options.ignoreAccent = options.ignoreAccent || false;
        this.options.filteredColumns = options.filteredColumns || this.parent.filterSettings.columns;
        this.options.query = options.query || new Query();
        this.options.allowCaseSensitive = options.allowCaseSensitive || false;
        this.options.uid = options.column.uid;
        this.values = {};
        this.localeObj = options.localeObj;
        this.isFiltered = options.filteredColumns.length;
    }

    protected getAndSetChkElem(options: IFilterArgs): HTMLElement {
        this.dlg = this.parent.createElement('div', {
            id: this.id + this.options.type + '_excelDlg',
            attrs : { uid: this.options.column.uid},
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
            const inputargs: InputArgs = {
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
        const args: {
            requestType: string, filterModel?: CheckBoxFilterBase, columnName: string,
            columnType: string, cancel: boolean
        } = {
            requestType: events.filterBeforeOpen,
            columnName: this.options.field, columnType: this.options.type, cancel: false
        };
        const filterModel: string = 'filterModel';
        args[filterModel] = this;
        this.parent.notify(events.cBoxFltrBegin, args);
        if (args.cancel) {
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
        const isStringTemplate: string = 'isStringTemplate';
        this.dialogObj[isStringTemplate] = true;
        this.renderResponsiveFilter(options);
        this.dlg.setAttribute('aria-label', this.getLocalizedLabel('ExcelFilterDialogARIA'));
        if (options.isResponsiveFilter) {
            const responsiveCnt: HTMLElement = document.querySelector('.e-responsive-dialog > .e-dlg-content > .e-mainfilterdiv');
            responsiveCnt.appendChild(this.dlg);
        } else {
            this.parent.element.appendChild(this.dlg);
        }
        this.dialogObj.appendTo(this.dlg as HTMLElement);
        this.dialogObj.element.style.maxHeight = options.isResponsiveFilter ? 'none' : this.options.height + 'px';
        this.dialogObj.show();
        const content: HTMLElement = this.dialogObj.element.querySelector('.e-dlg-content');
        content.appendChild(this.sBox);
        this.wireEvents();
        createSpinner({ target: this.spinner }, this.parent.createElement);
        showSpinner(this.spinner);
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
                getFilterMenuPostion(this.options.target, this.dialogObj);
            } else {
                this.dialogObj.position = { X: 'center', Y: 'center' };
            }
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
            this.dialogObj.destroy();
            this.unWireEvents();
            remove(this.dlg);
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
            if ((<Element>e.target).tagName.toLowerCase() === 'input' && (<Element>e.target).classList.contains('e-searchinput')) {
                let value: string | number | Date | boolean = (<HTMLInputElement>e.target).value;
                if (this.options.column.type === 'boolean') {
                    if (value !== '' &&
                        this.getLocalizedLabel('FilterTrue').toLowerCase().indexOf((value as string).toLowerCase()) !== -1) {
                        value = true;
                    } else if (value !== '' &&
                        this.getLocalizedLabel('FilterFalse').toLowerCase().indexOf((value as string).toLowerCase()) !== -1) {
                        value = false;
                    }
                }
                if (this.options.type === 'date' || this.options.type === 'datetime') {
                    value = this.valueFormatter.fromView(value as string, this.options.parserFn, this.options.type);
                }
                const args: Object = {
                    action: 'filtering', filterCollection: {
                        field: this.options.field,
                        operator: this.options.isRemote ?
                            (this.options.column.type === 'string' ? 'contains' : 'equal') :
                            (this.options.column.type === 'date' || this.options.column.type === 'datetime' ||
                                this.options.column.type === 'boolean' ? 'equal' : 'contains'),
                        value: value, matchCase: false, type: this.options.column.type, ignoreAccent: this.options.ignoreAccent
                    },
                    field: this.options.field
                };
                if (value !== undefined && value !== null && value !== '') {
                    if (this.isBlanks && value && typeof value === 'string' &&
                        this.getLocalizedLabel('Blanks').toLowerCase().indexOf((value as string).toLowerCase()) >= 0) {
                        this.fltrBtnHandler();
                    } else {
                        if (this.isForeignColumn(this.options.column as Column)) {
                            this.foreignFilter(args, value as string);
                        } else {
                            this.options.handler(args);
                        }
                    }
                } else {
                    this.closeDialog();
                }
            } else {
                if ((<{ keyCode?: number }>e).keyCode === 13) {
                    this.fltrBtnHandler();
                } else {

                    const text: string = (e.target as HTMLElement).firstChild.textContent.toLowerCase();
                    if (this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton').toLowerCase() === text) {
                        this.fltrBtnHandler();
                    } else if (this.getLocalizedLabel('ClearButton').toLowerCase() === text) {
                        this.clearFilter();
                    }
                }
            }
            this.closeDialog();
        } else if (!((<Element>e.target).tagName.toLowerCase() === 'input')) {
            this.clearFilter();
            this.closeDialog();
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public fltrBtnHandler(): void {
        let checked: Element[] = [].slice.call(this.cBox.querySelectorAll('.e-check:not(.e-selectall)'));
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
        let value: string;
        let val: string;
        let length: number;
        let fObj: PredicateModel;
        let coll: PredicateModel[] = [];
        if (checked.length !== this.itemsCnt || (searchInput && searchInput.value && searchInput.value !== '')) {
            for (let i: number = 0; i < checked.length; i++) {
                value = this.values[parentsUntil(checked[i], 'e-ftrchk').getAttribute('uid')];
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
                const args: {
                    cancel: boolean, instance: CheckBoxFilterBase, handler: Function, arg1: string, arg2: Object, arg3: string
                    , arg4: boolean, arg5: boolean, arg6: string
                } = {
                    instance: this, handler: this.fltrBtnHandler, arg1: fObj.field, arg2: fObj.predicate, arg3: fObj.operator,
                    arg4: fObj.matchCase, arg5: fObj.ignoreAccent, arg6: fObj.value as string, cancel: false
                };
                this.parent.notify(events.fltrPrevent, args);
                if (args.cancel) {
                    return;
                }
            }
            if (this.options.type === 'date' || this.options.type === 'datetime') {
                length = check.length - 1;
                val = this.values[parentsUntil(check[length], 'e-ftrchk').getAttribute('uid')];
                if (isNullOrUndefined(val) && isNotEqual) {
                    coll.push({
                        field: defaults.field, matchCase: defaults.matchCase, operator: 'equal',
                        predicate: 'and', value: null
                    });
                }
            }
            this.initiateFilter(coll);
        } else {
            this.clearFilter();
        }
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

    private initiateFilter(fColl: PredicateModel[]): void {
        const firstVal: PredicateModel = fColl[0];
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
        if (this.options.type === 'date' || this.options.type === 'datetime') {
            parsed = this.valueFormatter.fromView(val, this.options.parserFn, this.options.type);
        }
        this.addDistinct(query);
        const args: FilterSearchBeginEventArgs = {
            requestType: events.filterSearchBegin,
            filterModel: this, columnName: field, column: column,
            operator: operator, matchCase: matchCase, ignoreAccent: ignoreAccent, filterChoiceCount: null,
            query: query, value: parsed
        };
        this.parent.trigger(events.actionBegin, args, (filterargs: FilterSearchBeginEventArgs) => {
            // eslint-disable-next-line no-self-assign
            filterargs.operator = filterargs.operator;
            predicte = new Predicate(field, filterargs.operator, parsed, filterargs.matchCase, filterargs.ignoreAccent);
            if (this.options.type === 'date' || this.options.type === 'datetime') {
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
                query.where(emptyValPredicte);
            } else if (val.length) {
                predicte = !isNullOrUndefined(pred) ? predicte.and(pred.e as Predicate) : predicte;
                query.where(predicte);
            } else if (!isNullOrUndefined(pred)) {
                query.where(pred.e as Predicate);
            }
            filterargs.filterChoiceCount = !isNullOrUndefined(filterargs.filterChoiceCount) ? filterargs.filterChoiceCount : 1000;
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
                    foreignQuery.take(filterargs.filterChoiceCount);
                    this.search(filterargs, foreignQuery);
                });
            } else {
                query.take(filterargs.filterChoiceCount);
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

    private getPredicateFromCols(columns: Object[]): Predicate {
        const predicates: Predicate = CheckBoxFilterBase.getPredicate(columns);
        const predicateList: Predicate[] = [];
        const fPredicate: { predicate?: Predicate } = {};
        const isGrid: boolean = this.parent.getForeignKeyColumns !== undefined;
        const foreignColumn: Column[] = isGrid ? this.parent.getForeignKeyColumns() : [];
        for (const prop of Object.keys(predicates)) {
            let col: Column;
            if (isGrid && this.parent.getColumnByField(prop).isForeignColumn()) {
                col = getColumnByForeignKeyValue(prop, foreignColumn);
            }
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

    protected getQuery(): Query {
        return this.parent.getQuery ? this.parent.getQuery().clone() : new Query();
    }

    private getAllData(): void {
        const query: Query = this.getQuery();
        query.requiresCount(); //consider take query
        this.addDistinct(query);
        const args: FilterSearchBeginEventArgs = {
            requestType: events.filterChoiceRequest, query: query, filterChoiceCount: null
        };
        const filterModel: string = 'filterModel';
        args[filterModel] = this;
        this.parent.trigger(events.actionBegin, args, (args: FilterSearchBeginEventArgs) => {
            args.filterChoiceCount = !isNullOrUndefined(args.filterChoiceCount) ? args.filterChoiceCount : 1000;
            query.take(args.filterChoiceCount);
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
        query.distinct(filteredColumn as string[]);
        return query;
    }

    private filterEvent(args: Object, query: Query): void {
        const defObj: FilterStateObj = eventPromise(args, query);
        this.parent.trigger(events.dataStateChange, defObj.state);
        const def: Deferred = defObj.deffered;
        def.promise.then((e: ReturnType[]) => {
            this.dataSuccess(e);
        });
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
        allPromise.push(
            this.options.dataSource.executeQuery(query)
        );
        runArray.push(this.dataSuccess.bind(this));
        let i: number = 0;
        Promise.all(allPromise).then((e: ReturnType[]) => {
            for (let j: number = 0; j < e.length; j++) {
                runArray[i++](e[j].result);
            }
        });
    }
    private dataSuccess(e: Object[]): void {
        this.fullData = e;
        const args1: CheckBoxBeforeRenderer = { dataSource: this.fullData, executeQuery: true, field: this.options.field };
        this.parent.notify(events.beforeCheckboxRenderer, args1 );
        if (args1.executeQuery) {
            const query: Query = new Query();
            if (this.parent.searchSettings && this.parent.searchSettings.key.length) {
                const sSettings: SearchSettingsModel = this.parent.searchSettings;
                const fields: string[] = sSettings.fields.length ? sSettings.fields : this.options.columns.map((f: Column) => f.field);
                query.search(sSettings.key, fields, sSettings.operator, sSettings.ignoreCase, sSettings.ignoreAccent);
            }
            if ((this.options.filteredColumns.length)) {
                const cols: Object[] = [];
                for (let i: number = 0; i < this.options.filteredColumns.length; i++) {
                    const filterColumn: { uid: string, field: string } = this.options.filteredColumns[i] as { uid: string, field: string };
                    if (this.options.uid) {
                        filterColumn.uid = filterColumn.uid || this.parent.getColumnByField(filterColumn.field).uid;
                        if (filterColumn.uid !== this.options.uid) {
                            cols.push(this.options.filteredColumns[i]);
                        }
                    } else {
                        if (filterColumn.field !== this.options.field) {
                            cols.push(this.options.filteredColumns[i]);
                        }
                    }
                }
                const predicate: Predicate = this.getPredicateFromCols(cols);
                if (predicate) {
                    query.where(predicate);
                }
            }
            // query.select(this.options.field);
            const result: Object[] = new DataManager(args1.dataSource as JSON[]).executeLocal(query);
            const col: Column = this.options.column as Column;
            this.filteredData = (CheckBoxFilterBase.getDistinct(result, this.options.field, col, this.foreignKeyData) as
                { records: Object[] }).records || [];
        }
        const data: object[] = args1.executeQuery ? this.filteredData : args1.dataSource ;
        this.processDataSource(null, true, data, args1);
        if (this.sInput) {
            this.sInput.focus();
        }
        const args: Object = {
            requestType: events.filterAfterOpen,
            columnName: this.options.field, columnType: this.options.type
        };
        const filterModel: string = 'filterModel';
        args[filterModel] = this;
        this.parent.notify(events.cBoxFltrComplete, args);
    }

    private processDataSource(query?: Query, isInitial?: boolean, dataSource?: Object[], args?: CheckBoxBeforeRenderer): void {
        showSpinner(this.spinner);
        // query = query ? query : this.options.query.clone();
        // query.requiresCount();
        // let result: Object = new DataManager(dataSource as JSON[]).executeLocal(query);
        // let res: { result: Object[] } = result as { result: Object[] };
        this.updateResult();
        this.createFilterItems(dataSource, isInitial, args);
    }

    private processSearch(query: Query): void {
        this.processDataOperation(query);
    }

    private updateResult(): void {
        this.result = {};
        const predicate: Predicate = this.getPredicateFromCols(this.options.filteredColumns);
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
        const target: Element = e.target as Element;
        const elem: Element = parentsUntil(target, 'e-checkbox-wrapper');
        if (parentsUntil(target, 'e-searchbox')) {
            this.searchBoxClick(e);
        }
        if (elem) {
            const selectAll: Element = elem.querySelector('.e-selectall');
            if (selectAll) {
                this.updateAllCBoxes(!selectAll.classList.contains('e-check'));
            } else {
                toogleCheckbox(elem.parentElement);
            }
            this.updateIndeterminatenBtn();
            (elem.querySelector('.e-chk-hidden') as HTMLElement).focus();
        }
        this.setFocus(parentsUntil(elem, 'e-ftrchk'));
    }

    private keyupHandler(e: MouseEvent): void {
        this.setFocus(parentsUntil(e.target as Element, 'e-ftrchk'));
    }

    private setFocus(elem?: Element): void {
        const prevElem: Element = this.dlg.querySelector('.e-chkfocus');
        if (prevElem) {
            prevElem.classList.remove('e-chkfocus');
        }
        if (elem) {
            elem.classList.add('e-chkfocus');
        }
    }

    private updateAllCBoxes(checked: boolean): void {
        const cBoxes: Element[] = [].slice.call(this.cBox.getElementsByClassName('e-frame'));
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
        label.innerHTML = !isNullOrUndefined(value) && value.toString().length ? value :
            this.getLocalizedLabel('Blanks');
        if (label.innerHTML === this.getLocalizedLabel('Blanks')) {
            this.isBlanks = true;
        }
        if (typeof value === 'boolean') {
            label.innerHTML = value === true ? this.getLocalizedLabel('FilterTrue') : this.getLocalizedLabel('FilterFalse');
        }
        addClass([label], ['e-checkboxfiltertext']);
        if (this.options.template && data[this.options.column.field] !== this.getLocalizedLabel('SelectAll')) {
            label.innerHTML = '';
            const isReactCompiler: boolean = this.parent.isReact && this.options.column.filter
                && typeof (this.options.column.filter.itemTemplate) !== 'string';
            if (isReactCompiler) {
                this.options.template(dummyData, this.parent, 'filterItemTemplate', null, null, null, label);
                this.parent.renderTemplates();
            } else {
                appendChildren(label, this.options.template(dummyData, this.parent, 'filterItemTemplate'));
            }
        }
        return elem;
    }

    private updateIndeterminatenBtn(): void {
        const cnt: number = this.cBox.children.length - 1;
        let className: string[] = [];
        let disabled: boolean = false;
        const elem: Element = this.cBox.querySelector('.e-selectall');
        const selected: number = this.cBox.querySelectorAll('.e-check:not(.e-selectall)').length;
        let btn: Button;
        if (!this.options.isResponsiveFilter) {
            btn = (<{ btnObj?: Button }>(this.dialogObj as DialogModel)).btnObj[0];
            btn.disabled = false;
        }
        const input: HTMLInputElement = elem.previousSibling as HTMLInputElement;
        setChecked(input, false);
        input.indeterminate = false;
        if (cnt === selected) {
            className = ['e-check'];
            setChecked(input, true);
        } else if (selected) {
            className = ['e-stop'];
            input.indeterminate = true;
        } else {
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
            const val: string = getValue(key, data[i]);
            if (val === '' || isNullOrUndefined(val)) {
                nullCounter = nullCounter + 1;
            }
        }
        this.itemsCnt = nullCounter !== -1 ? data.length - nullCounter : data.length;
        if (data.length && !this.renderEmpty) {
            const selectAllValue: string = this.getLocalizedLabel('SelectAll');
            const innerDiv: Element = this.cBox.querySelector('.e-checkfltrnmdiv');
            if (innerDiv) {
                innerDiv.classList.remove('e-checkfltrnmdiv');
            }
            const checkBox: Element = this.createCheckbox(selectAllValue, false, { [this.options.field]: selectAllValue });
            const selectAll: Element = createCboxWithWrap(getUid('cbox'), checkBox, 'e-ftrchk');
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            cBoxes.appendChild(selectAll);
            let predicate: Predicate = new Predicate('field', 'equal', this.options.field);
            if (this.options.foreignKeyValue) {
                predicate = predicate.or('field', 'equal', this.options.foreignKeyValue);
            }
            const isColFiltered: number = new DataManager(this.options.filteredColumns as JSON[]).executeLocal(
                new Query().where(predicate)).length;
            let isRndere: boolean;
            for (let i: number = 0; i < data.length; i++) {
                const uid: string = getUid('cbox');
                this.values[uid] = getValue(key, data[i]);
                let value: string | number = getValue(this.options.field, data[i]);
                if (this.options.formatFn) {
                    value = this.valueFormatter.toView(value as number, this.options.formatFn) as string;
                }
                const args: { value: string | number, column: ColumnModel, data: Object }
                            = { value: value, column: this.options.column, data: data[i] };
                this.parent.notify(events.filterCboxValue, args);
                value = args.value;
                if ((value === '' || isNullOrUndefined(value))) {
                    if (isRndere) { continue; }
                    isRndere = true;
                }
                const checkbox: Element =
                    this.createCheckbox(
                        value as string, this.getCheckedState(isColFiltered, this.values[uid]), getValue('dataObj', data[i]));
                cBoxes.appendChild(createCboxWithWrap(uid, checkbox, 'e-ftrchk'));
            }
            this.cBox.innerHTML = '';
            appendChildren(this.cBox, [].slice.call(cBoxes.children));
            this.updateIndeterminatenBtn();
            if (btn) { btn.disabled = false; }
            disabled = false;
        } else {
            cBoxes.appendChild(this.parent.createElement('span', { innerHTML: this.getLocalizedLabel('NoResult') }));
            this.cBox.innerHTML = '';
            this.cBox.appendChild(this.parent.createElement('div', { className: 'e-checkfltrnmdiv' }));
            appendChildren(this.cBox.children[0], [].slice.call(cBoxes.children));
            if (btn) { btn.disabled = true; }
            disabled = true;
        }
        if (btn) {
            this.filterState = !btn.disabled;
            btn.dataBind();
        }
        const args: {
            dataSource?: Object[], requestType?: string,
            filterModel?: CheckBoxFilterBase
        } = { requestType: events.filterChoiceRequest, dataSource: this.renderEmpty ? [] : data };
        const filterModel: string = 'filterModel';
        args[filterModel] = this;
        this.parent.notify(events.cBoxFltrComplete, args);
        this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: disabled });
        hideSpinner(this.spinner);
    }

    private getCheckedState(isColFiltered: number | boolean, value: string): boolean {
        if (!this.isFiltered || !isColFiltered) {
            return true;
        } else {
            const checkState: boolean = this.result[value];
            return this.options.operator === 'notequal' ? !checkState : checkState;
        }
    }

    public static getDistinct(json: Object[], field: string, column?: Column, foreignKeyData?: Object[]): Object {
        let len: number = json.length;
        const result: Object[] = [];
        let value: string;
        const ejValue: string = 'ejValue';
        const lookup: Object = {};
        const isForeignKey: boolean = column && column.isForeignColumn ? column.isForeignColumn() : false;

        while (len--) {
            value = json[len] as string;
            value = getObject(field, value); //local remote diff, check with mdu
            if (!(value in lookup)) {
                const obj: Object = {};
                obj[ejValue] = value;
                lookup[value] = true;
                if (isForeignKey) {
                    const foreignDataObj: Object = getForeignData(column, {}, value, foreignKeyData)[0];
                    setValue(events.foreignKeyData, foreignDataObj, json[len]);
                    value = getValue(column.foreignKeyValue, foreignDataObj);
                }
                setValue(field, isNullOrUndefined(value) ? null : value, obj);
                setValue('dataObj', json[len], obj);
                result.push(obj);
            }
        }
        return DataUtil.group(DataUtil.sort(result, field, DataUtil.fnAscending), 'ejValue');
    }

    public static getPredicate(columns: PredicateModel[]): Predicate {
        const cols: PredicateModel[] = DataUtil.distinct(columns, 'field', true) || [];
        let collection: Object[] = [];
        const pred: Predicate = {} as Predicate;
        for (let i: number = 0; i < cols.length; i++) {
            collection = new DataManager(columns as JSON[]).executeLocal(
                new Query().where('field', 'equal', cols[i].field));
            if (collection.length !== 0) {
                pred[cols[i].field] = CheckBoxFilterBase.generatePredicate(collection);
            }
        }
        return pred;
    }

    private static generatePredicate(cols: PredicateModel[]): Predicate {
        const len: number = cols ? cols.length : 0;
        let predicate: Predicate;
        const operate: string = 'or';
        const first: PredicateModel = CheckBoxFilterBase.updateDateFilter(cols[0]);
        first.ignoreAccent = !isNullOrUndefined(first.ignoreAccent) ? first.ignoreAccent : false;
        if (first.type === 'date' || first.type === 'datetime') {
            predicate = getDatePredicate(first, first.type);
        } else {
            predicate = first.ejpredicate ? first.ejpredicate as Predicate :
                new Predicate(
                    first.field, first.operator, first.value, !CheckBoxFilterBase.getCaseValue(first),
                    first.ignoreAccent) as Predicate;
        }
        for (let p: number = 1; p < len; p++) {
            cols[p] = CheckBoxFilterBase.updateDateFilter(cols[p]);
            if (len > 2 && p > 1 && cols[p].predicate === 'or') {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate.predicates.push(getDatePredicate(cols[p], cols[p].type));
                } else {
                    predicate.predicates.push(new Predicate(
                        cols[p].field, cols[p].operator, cols[p].value, !CheckBoxFilterBase.getCaseValue(cols[p]),
                        cols[p].ignoreAccent));
                }
            } else {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    if (cols[p].predicate === 'and' && cols[p].operator === 'equal') {
                        predicate = (predicate[operate] as Function)(
                            getDatePredicate(cols[p], cols[p].type), cols[p].type, cols[p].ignoreAccent);
                    } else {
                        predicate = (predicate[((cols[p] as Predicate).predicate) as string] as Function)(
                            getDatePredicate(cols[p], cols[p].type), cols[p].type, cols[p].ignoreAccent);
                    }
                } else {
                    predicate = cols[p].ejpredicate ?
                        (predicate[(cols[p] as Predicate).predicate as string] as Function)(cols[p].ejpredicate) :
                        (predicate[(cols[p].predicate) as string] as Function)(
                            cols[p].field, cols[p].operator,
                            cols[p].value, !CheckBoxFilterBase.getCaseValue(cols[p]), cols[p].ignoreAccent);
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
        if ((filter.type === 'date' || filter.type === 'datetime' || filter.value instanceof Date)) {
            filter.type = filter.type || 'date';
        }
        return filter;
    }

}
