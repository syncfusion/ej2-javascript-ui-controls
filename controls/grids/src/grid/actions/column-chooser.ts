import { classList, addClass, removeClass, isNullOrUndefined, Browser, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { Button } from '@syncfusion/ej2-buttons';
import { EventHandler, L10n, closest } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, IAction, NotifyArgs, EJ2Intance } from '../base/interface';
import * as events from '../base/constant';
import { ShowHide } from './show-hide';
import { Dialog, calculateRelativeBasedPosition, DialogModel } from '@syncfusion/ej2-popups';
import { createCboxWithWrap, toogleCheckbox, parentsUntil, removeAddCboxClasses } from '../base/util';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { SearchBox } from '../services/focus-strategy';
import * as literals from '../base/string-literals';

/**
 * The `ColumnChooser` module is used to show or hide columns dynamically.
 */
export class ColumnChooser implements IAction {
    // internal variables
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private dlgObj: Dialog;
    private searchValue: string;
    private flag: boolean;
    private timer: number;
    public getShowHideService: ShowHide;
    private showColumn: string[] = [];
    private hideColumn: string[] = [];
    private changedColumns: string[] = [];
    private unchangedColumns: string[] = [];
    private mainDiv: HTMLElement;
    private innerDiv: HTMLElement;
    private ulElement: HTMLElement;
    private isDlgOpen: boolean = false;
    private initialOpenDlg: boolean = true;
    private stateChangeColumns: Column[] = [];
    private changedStateColumns: Column[] = [];
    private dlgDiv: HTMLElement;
    private isInitialOpen: boolean = false;
    private isCustomizeOpenCC: boolean = false;
    private cBoxTrue: Element;
    private cBoxFalse: Element;
    private searchBoxObj: SearchBox;
    private searchOperator: string = 'startswith';
    private targetdlg: Element;
    private prevShowedCols: string[] = [];
    private hideDialogFunction: Function = this.hideDialog.bind(this);

    /**
     * Constructor for the Grid ColumnChooser module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
        this.cBoxTrue = createCheckBox(this.parent.createElement, true, { checked: true, label: ' ' });
        this.cBoxFalse = createCheckBox(this.parent.createElement, true, { checked: false, label: ' ' });
        this.cBoxTrue.insertBefore(
            this.parent.createElement('input', {
                className: 'e-chk-hidden e-cc e-cc-chbox', attrs: { type: 'checkbox' }
            }),
            this.cBoxTrue.firstChild);
        this.cBoxFalse.insertBefore(
            this.parent.createElement('input', {
                className: 'e-chk-hidden e-cc e-cc-chbox', attrs: { 'type': 'checkbox' }
            }),
            this.cBoxFalse.firstChild);
        this.cBoxFalse.querySelector('.e-frame').classList.add('e-uncheck');
        if (this.parent.enableRtl) {
            addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
        }
    }

    private destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.removeEventListener();
        this.unWireEvents();
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.element && !this.dlgObj.isDestroyed) {
            this.dlgObj.destroy();
        }
    }

    private rtlUpdate(): void {
        if (this.parent.enableRtl) {
            addClass([].slice.call(this.innerDiv.getElementsByClassName('e-checkbox-wrapper')), ['e-rtl']);
        } else {
            removeClass([].slice.call(this.innerDiv.getElementsByClassName('e-checkbox-wrapper')), ['e-rtl']);
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.add(document, 'click', this.clickHandler, this);
        this.parent.on(events.uiUpdate, this.enableAfterRenderEle, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.addEventListener(events.dataBound, this.hideDialogFunction);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.rtlUpdated, this.rtlUpdate, this);
        this.parent.on(events.keyPressed, this.keyUpHandler, this);
        this.parent.on(events.resetColumns, this.onResetColumns, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.remove(document, 'click', this.clickHandler);
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.uiUpdate, this.enableAfterRenderEle);
        this.parent.off(events.rtlUpdated, this.rtlUpdate);
        this.parent.on(events.keyPressed, this.keyUpHandler, this);
        this.parent.off(events.resetColumns, this.onResetColumns);
        this.parent.removeEventListener(events.dataBound, this.hideDialogFunction);
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.renderDlgContent();
        this.getShowHideService = this.serviceLocator.getService<ShowHide>('showHideService');
    }

    private clickHandler(e: MouseEvent): void {
        const targetElement: Element = e.target as Element;
        if (!this.isCustomizeOpenCC) {
            if (!isNullOrUndefined(closest(targetElement, '.e-cc')) || !isNullOrUndefined(closest(targetElement, '.e-cc-toolbar'))) {
                if (targetElement.classList.contains('e-columnchooser-btn') || targetElement.classList.contains('e-cc-toolbar')) {
                    if ((this.initialOpenDlg && this.dlgObj.visible) || !this.isDlgOpen) {
                        this.isDlgOpen = true;
                        return;
                    }

                } else if (targetElement.classList.contains('e-cc-cancel')) {
                    (<HTMLInputElement>targetElement.parentElement.querySelector('.e-ccsearch')).value = '';
                    this.columnChooserSearch('');
                    this.removeCancelIcon();
                    this.refreshCheckboxButton();
                }
            } else {
                if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.visible && !targetElement.classList.contains('e-toolbar-items')) {
                    this.dlgObj.hide();
                    this.clearActions();
                    this.refreshCheckboxState();
                    // this.unWireEvents();
                    this.isDlgOpen = false;
                }
            }
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.targetdlg = e.target as Element;
            }
        }
        if (this.isCustomizeOpenCC && (e.target as Element).classList.contains('e-cc-cancel')) {
            this.refreshCheckboxState();
        }
        this.rtlUpdate();
    }

    private hideDialog(): void {
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.visible) {
            this.dlgObj.hide();
            // this.unWireEvents();
            this.isDlgOpen = false;
        }
    }

    /**
     * To render columnChooser when showColumnChooser enabled.
     *
     * @param {number} x - specifies the position x
     * @param {number} y - specifies the position y
     * @param {Element} target - specifies the target
     * @returns {void}
     * @hidden
     */
    public renderColumnChooser(x?: number, y?: number, target?: Element): void {
        if (!this.dlgObj.visible && (this.parent.detailTemplate || this.parent.childGrid)) {
            this.hideOpenedDialog();
        }
        if (!this.dlgObj.visible) {
            const args: object = this.beforeOpenColumnChooserEvent();
            if ((<{ cancel?: boolean }>args).cancel) {
                return;
            }
            if (target) { this.targetdlg = target; }
            this.refreshCheckboxState();
            this.dlgObj.dataBind();
            this.dlgObj.element.style.maxHeight = '430px';
            const elementVisible: string = this.dlgObj.element.style.display;
            this.dlgObj.element.style.display = 'block';
            let isSticky: boolean = this.parent.getHeaderContent().classList.contains('e-sticky');
            const toolbarItem: HTMLElement = <HTMLElement>closest(target, '.e-toolbar-item');
            let newpos: { top: number, left: number };
            if (isSticky) {
                newpos = toolbarItem.getBoundingClientRect();
                this.dlgObj.element.classList.add('e-sticky');
            } else {
                this.dlgObj.element.classList.remove('e-sticky');
                newpos = calculateRelativeBasedPosition(toolbarItem, this.dlgObj.element);
            }  
            this.dlgObj.element.style.display = elementVisible;
            this.dlgObj.element.style.top = newpos.top + closest(target, '.e-cc-toolbar').getBoundingClientRect().height + 'px';
            const dlgWidth: number = 250;
            if (!isNullOrUndefined(closest(target, '.e-bigger'))) {
                this.dlgObj.width = 258;
            }
            if (Browser.isDevice) {
                this.dlgObj.target = document.body;
                this.dlgObj.position = { X: 'center', Y: 'center' };
                this.dlgObj.refreshPosition();
                this.dlgObj.open = this.mOpenDlg.bind(this);
            } else {
                if (this.parent.enableRtl) {
                    this.dlgObj.element.style.left = (<HTMLElement>target).offsetLeft + 'px';
                } else {
                    this.dlgObj.element.style.left = ((newpos.left - dlgWidth) + closest(target, '.e-cc-toolbar').clientWidth) + 2 + 'px';
                }
            }
            this.removeCancelIcon();
            this.dlgObj.show();
            this.parent.notify(events.columnChooserOpened, { dialog: this.dlgObj });

        } else {
            // this.unWireEvents();
            this.hideDialog();
            this.addcancelIcon();
            this.clearActions();
            this.refreshCheckboxState();
        }
        this.rtlUpdate();
    }

    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     *
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */

    public openColumnChooser(X?: number, Y?: number): void {
        this.isCustomizeOpenCC = true;
        if (this.dlgObj.visible) {
            this.hideDialog();
            return;
        }
        const args: object = this.beforeOpenColumnChooserEvent();
        if ((<{ cancel?: boolean }>args).cancel) {
            return;
        }
        if (!this.isInitialOpen) {
            this.dlgObj.content = this.renderChooserList();
            this.updateIntermediateBtn();
        } else {
            this.refreshCheckboxState();
        }

        this.dlgObj.dataBind();
        this.dlgObj.position = { X: 'center', Y: 'center' };
        if (isNullOrUndefined(X)) {
            this.dlgObj.position = { X: 'center', Y: 'center' };
            this.dlgObj.refreshPosition();
        } else {
            this.dlgObj.element.style.top = '';
            this.dlgObj.element.style.left = '';
            this.dlgObj.element.style.top = Y + 'px';
            this.dlgObj.element.style.left = X + 'px';
        }
        this.dlgObj.beforeOpen = this.customDialogOpen.bind(this);
        this.dlgObj.show();
        this.isInitialOpen = true;
        this.dlgObj.beforeClose = this.customDialogClose.bind(this);
    }

    private enableAfterRenderEle(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
        }
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        if (e.action === 'escape') {
            this.hideDialog();
        }
    }

    private customDialogOpen(): void {
        const searchElement: Element = (this.dlgObj.content as Element).querySelector('input.e-ccsearch');
        EventHandler.add(searchElement, 'keyup', this.columnChooserManualSearch, this);

    }
    private customDialogClose(): void {
        const searchElement: Element = (this.dlgObj.content as Element).querySelector('input.e-ccsearch');
        EventHandler.remove(searchElement, 'keyup', this.columnChooserManualSearch);
    }

    private getColumns(): Column[] {
        const columns: Column[] = this.parent.getColumns().filter((column: Column) => (column.type !== 'checkbox'
         && column.showInColumnChooser === true) || (column.type === 'checkbox' && column.field !== undefined));
        return columns;
    }


    private renderDlgContent(): void {
        this.dlgDiv = this.parent.createElement('div', { className: 'e-ccdlg e-cc', id: this.parent.element.id + '_ccdlg' });
        this.dlgDiv.setAttribute('aria-label', this.l10n.getConstant('ColumnChooserDialogARIA'));
        this.parent.element.appendChild(this.dlgDiv);
        this.dlgObj = new Dialog({
            header: this.l10n.getConstant('ChooseColumns'),
            showCloseIcon: false,
            closeOnEscape: false,
            locale: this.parent.locale,
            visible: false,
            enableRtl: this.parent.enableRtl,
            target: document.getElementById(this.parent.element.id),
            buttons: [{
                click: this.confirmDlgBtnClick.bind(this),
                buttonModel: {
                    content: this.l10n.getConstant('OKButton'), isPrimary: true,
                    cssClass: 'e-cc e-cc_okbtn'
                }
            },
            {
                click: this.clearBtnClick.bind(this),
                buttonModel: { cssClass: 'e-flat e-cc e-cc-cnbtn', content: this.l10n.getConstant('CancelButton') }
            }],
            content: this.renderChooserList(),
            width: 250,
            cssClass: 'e-cc',
            animationSettings: { effect: 'None' }
        });
        const isStringTemplate: string = 'isStringTemplate';
        this.dlgObj[isStringTemplate] = true;
        this.dlgObj.appendTo(this.dlgDiv);
        this.wireEvents();
    }

    private renderChooserList(): HTMLElement {
        this.mainDiv = this.parent.createElement('div', { className: 'e-main-div e-cc' });
        const searchDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-searchdiv e-cc e-input-group' });
        const ccsearchele: HTMLElement = this.parent.createElement('input', {
            className: 'e-ccsearch e-cc e-input',
            attrs: { placeholder: this.l10n.getConstant('Search') }
        });
        const ccsearchicon: HTMLElement = this.parent.createElement('span', {
            className: 'e-ccsearch-icon e-icons e-cc e-input-group-icon',
            attrs: { title: this.l10n.getConstant('Search') }
        });
        const conDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-contentdiv' });
        this.innerDiv = this.parent.createElement('div', { className: 'e-innerdiv e-cc' });
        searchDiv.appendChild(ccsearchele);
        searchDiv.appendChild(ccsearchicon);
        this.searchBoxObj = new SearchBox(ccsearchele);
        const innerDivContent: HTMLElement | string[] | string = this.refreshCheckboxList(this.parent.getColumns() as Column[]);
        this.innerDiv.appendChild((innerDivContent as Element));
        conDiv.appendChild(this.innerDiv);
        this.mainDiv.appendChild(searchDiv);
        this.mainDiv.appendChild(conDiv);
        return this.mainDiv;
    }

    private confirmDlgBtnClick(args: Object): void {
        this.stateChangeColumns = [];
        this.changedStateColumns = [];
        this.changedColumns = (this.changedColumns.length > 0) ? this.changedColumns : this.unchangedColumns;
        this.changedColumnState(this.changedColumns);
        const uncheckedLength: number = this.ulElement.querySelector('.e-uncheck') &&
            this.ulElement.querySelectorAll('.e-uncheck:not(.e-selectall)').length;
        if (!isNullOrUndefined(args)) {
            if (uncheckedLength < this.parent.getColumns().length) {
                if (this.hideColumn.length) {
                    this.columnStateChange(this.hideColumn, false);
                }
                if (this.showColumn.length) {
                    this.columnStateChange(this.showColumn, true);
                }
                this.getShowHideService.setVisible(this.stateChangeColumns, this.changedStateColumns);
                this.clearActions();
                this.parent.notify(events.tooltipDestroy, { module: 'edit' });
                if (this.parent.getCurrentViewRecords().length === 0) {
                    const emptyRowCell: HTMLElement = this.parent.element.querySelector('.e-emptyrow').querySelector('td');
                    emptyRowCell.setAttribute('colSpan', this.parent.getVisibleColumns().length.toString());
                }
            }
        }
    }

    private onResetColumns(e: NotifyArgs): void {
        if (e.requestType === 'columnstate') {
            this.resetColumnState();
            return;
        }
    }

    public resetColumnState(): void {
        this.showColumn = [];
        this.hideColumn = [];
        this.hideDialog();
    }

    private changedColumnState(changedColumns: string[]): void {
        for (let index: number = 0; index < changedColumns.length; index++) {
            const colUid: string = changedColumns[index];
            const currentCol: Column = this.parent.getColumnByUid(colUid);
            this.changedStateColumns.push(currentCol);
        }
    }

    private columnStateChange(stateColumns: string[], state: boolean): void {
        for (let index: number = 0; index < stateColumns.length; index++) {
            const colUid: string = stateColumns[index];
            const currentCol: Column = this.parent.getColumnByUid(colUid);
            if (currentCol.type !== 'checkbox') {
                currentCol.visible = state;
            }
            this.stateChangeColumns.push(currentCol);
        }
    }

    private clearActions(): void {
        this.resetColumnState();
        this.addcancelIcon();
    }

    private clearBtnClick(): void {
        this.clearActions();
        this.parent.notify(events.columnChooserCancelBtnClick, { dialog: this.dlgObj });
    }

    private checkstatecolumn(isChecked: boolean, coluid: string, selectAll: boolean = false): void {
        if (isChecked) {
            if (this.hideColumn.indexOf(coluid) !== -1) {
                this.hideColumn.splice(this.hideColumn.indexOf(coluid), 1);
            }
            if (this.showColumn.indexOf(coluid) === -1) {
                this.showColumn.push(coluid);
            }
        } else {
            if (this.showColumn.indexOf(coluid) !== -1) {
                this.showColumn.splice(this.showColumn.indexOf(coluid), 1);
            }
            if (this.hideColumn.indexOf(coluid) === -1) {
                this.hideColumn.push(coluid);
            }
        }
        if (selectAll) {
            if (!isChecked) {
                this.changedColumns.push(coluid);
            } else {
                this.unchangedColumns.push(coluid);
            }
        } else if (this.changedColumns.indexOf(coluid) !== -1) {
            this.changedColumns.splice(this.changedColumns.indexOf(coluid), 1);
        } else {
            this.changedColumns.push(coluid);
        }
    }

    private columnChooserSearch(searchVal: string): void {
        let clearSearch: boolean = false;
        let fltrCol: Column[];
        let okButton: Button;
        const buttonEle: HTMLElement = this.dlgDiv.querySelector('.e-footer-content');
        const selectedCbox: number = this.ulElement.querySelector('.e-check') &&
        this.ulElement.querySelectorAll('.e-check:not(.e-selectall)').length;
        this.isInitialOpen = true;
        if (buttonEle) {
            okButton = (buttonEle.querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
        }
        if (searchVal === '') {
            this.removeCancelIcon();
            fltrCol = this.getColumns() as Column[];
            clearSearch = true;

        } else {
            fltrCol = new DataManager((this.getColumns() as Object[]) as JSON[]).executeLocal(new Query()
                .where('headerText', this.searchOperator, searchVal, true, this.parent.columnChooserSettings.ignoreAccent)) as Column[];
        }

        if (fltrCol.length) {
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.classList.remove('e-ccnmdiv');
            this.innerDiv.appendChild(<HTMLElement>this.refreshCheckboxList(fltrCol));
            if (!clearSearch) {
                this.addcancelIcon();
                this.refreshCheckboxButton();
            } else {
                if (okButton && selectedCbox) { okButton.disabled = false; }
            }
        } else {
            const nMatchele: HTMLElement = this.parent.createElement('span', { className: 'e-cc e-nmatch' });
            nMatchele.innerHTML = this.l10n.getConstant('Matchs');
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.appendChild(nMatchele);
            this.innerDiv.classList.add('e-ccnmdiv');
            if (okButton) { okButton.disabled = true; }
        }
        this.flag = true;
        this.stopTimer();
    }

    private wireEvents(): void {
        EventHandler.add(this.dlgObj.element, 'click', this.checkBoxClickHandler, this);
        EventHandler.add(this.searchBoxObj.searchBox, 'keyup', this.columnChooserManualSearch, this);
        this.searchBoxObj.wireEvent();
    }

    private unWireEvents(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.dlgObj.element) {
            EventHandler.remove(this.dlgObj.element, 'click', this.checkBoxClickHandler);
        }
        EventHandler.remove(this.searchBoxObj.searchBox, 'keyup', this.columnChooserManualSearch);
        this.searchBoxObj.unWireEvent();
    }

    private checkBoxClickHandler(e: MouseEvent): void {
        let checkstate: boolean;
        const elem: Element = parentsUntil(e.target as Element, 'e-checkbox-wrapper');
        if (elem) {
            const selectAll: Element = elem.querySelector('.e-selectall');
            if (selectAll) {
                this.updateSelectAll(!elem.querySelector('.e-check'));
            } else  {
                toogleCheckbox(elem.parentElement);
            }
            (elem.querySelector('.e-chk-hidden') as HTMLElement).focus();
            if (elem.querySelector('.e-check')) {
                checkstate = true;
            } else if (elem.querySelector('.e-uncheck')) {
                checkstate = false;
            } else {
                return;
            }
            this.updateIntermediateBtn();
            const columnUid: string = parentsUntil(elem, 'e-ccheck').getAttribute('uid');
            const column: Column[] =  this.parent.getColumns();
            if (columnUid === 'grid-selectAll') {
                this.changedColumns = [];
                this.unchangedColumns = [];
                for (let i: number = 0; i < column.length; i++) {
                    if (column[i].showInColumnChooser) {
                        this.checkstatecolumn(checkstate, column[i].uid, true);
                    }
                }
            } else {
                this.checkstatecolumn(checkstate, columnUid);
            }
            this.refreshCheckboxButton();
        }
    }

    private updateIntermediateBtn(): void {
        const cnt: number = this.ulElement.children.length - 1;
        let className: string[] = [];
        const elem: Element = this.ulElement.children[0].querySelector('.e-frame');
        const selected: number = this.ulElement.querySelectorAll('.e-check:not(.e-selectall)').length;
        const btn: Button = (<{ btnObj?: Button }>(this.dlgObj as DialogModel)).btnObj[0];
        btn.disabled = false;
        if (cnt === selected) {
            className = ['e-check'];
        } else if (selected) {
            className = ['e-stop'];
        } else {
            className = ['e-uncheck'];
            btn.disabled = true;
        }
        btn.dataBind();
        removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([elem], className);
    }

    private updateSelectAll(checked: boolean): void {
        const cBoxes: Element[] = [].slice.call(this.ulElement.getElementsByClassName('e-frame'));
        for (const cBox of cBoxes) {
            removeAddCboxClasses(cBox, checked);
        }
    }

    private refreshCheckboxButton(): void {
        const visibleCols: Column[] = this.parent.getVisibleColumns();
        for (let i: number = 0; i < visibleCols.length; i++) {
            const columnUID: string = visibleCols[i].uid;
            if (this.prevShowedCols.indexOf(columnUID) === -1) {
                this.prevShowedCols.push(columnUID);
            }
        }
        for (let i: number = 0; i < this.hideColumn.length; i++) {
            const index: number = this.prevShowedCols.indexOf(this.hideColumn[i]);
            if (index !== -1) {
                this.prevShowedCols.splice(index, 1);
            }
        }
        const selected: number = this.showColumn.length !== 0 ? 1 : this.prevShowedCols.length;
        const btn: Button = (this.dlgDiv.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
        btn.disabled = false;
        const srchShowCols: string[] = [];
        const searchData: NodeListOf<HTMLInputElement> = [].slice.call(this.parent.element.getElementsByClassName('e-cc-chbox'));
        for (let i: number = 0, itemsLen: number = searchData.length; i < itemsLen; i++) {
            const element: HTMLInputElement = searchData[i] as HTMLInputElement;
            const columnUID: string = parentsUntil(element, 'e-ccheck').getAttribute('uid');
            srchShowCols.push(columnUID);
        }
        const hideCols: string[] = this.showColumn.filter((column: string) => srchShowCols.indexOf(column) !== -1);
        if (selected === 0 && hideCols.length === 0) {
            btn.disabled = true;
        }
        btn.dataBind();
    }

    private refreshCheckboxList(gdCol: Column[]): HTMLElement {
        this.ulElement = this.parent.createElement('ul', { className: 'e-ccul-ele e-cc' });
        const selectAllValue: string = this.l10n.getConstant('SelectAll');
        const cclist: HTMLElement = this.parent.createElement('li', { className: 'e-cclist e-cc e-cc-selectall' });
        const selectAll: Element = this.createCheckBox(selectAllValue, false, 'grid-selectAll');
        if (gdCol.length) {
            selectAll.querySelector('.e-checkbox-wrapper').firstElementChild.classList.add('e-selectall');
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            this.checkState(selectAll.querySelector('.e-icons'), true);
            cclist.appendChild(selectAll);
            this.ulElement.appendChild(cclist);
        }
        for (let i: number = 0; i < gdCol.length; i++) {
            const columns: Column = (gdCol[i] as Column);
            this.renderCheckbox(columns);
        }
        return this.ulElement;
    }

    private refreshCheckboxState(): void {
        (<HTMLInputElement>this.dlgObj.element.querySelector('.e-cc.e-input')).value = '';
        this.columnChooserSearch('');
        const gridObject: IGrid = this.parent;
        const currentCheckBoxColls: NodeListOf<Element> = this.dlgObj.element.querySelectorAll('.e-cc-chbox:not(.e-selectall)');
        for (let i: number = 0, itemLen: number = currentCheckBoxColls.length; i < itemLen; i++) {
            const element: HTMLInputElement = currentCheckBoxColls[i] as HTMLInputElement;
            let columnUID: string;
            if (this.parent.childGrid || this.parent.detailTemplate) {
                columnUID = parentsUntil(this.dlgObj.element.querySelectorAll('.e-cc-chbox:not(.e-selectall)')[i],
                                         'e-ccheck').getAttribute('uid');
            } else { columnUID = parentsUntil(element, 'e-ccheck').getAttribute('uid'); }
            const column: Column = gridObject.getColumnByUid(columnUID);
            const uncheck: NodeListOf<Element> = [].slice.call(element.parentElement.getElementsByClassName('e-uncheck'));
            if (column.visible && !uncheck.length) {
                element.checked = true;
                this.checkState(element.parentElement.querySelector('.e-icons'), true);
            } else {
                element.checked = false;
                this.checkState(element.parentElement.querySelector('.e-icons'), false);
            }
        }
    }

    private checkState(element: Element, state: boolean): void {
        if (state) {
            classList(element, ['e-check'], ['e-uncheck']);
        } else {
            classList(element, ['e-uncheck'], ['e-check']);
        }
    }

    private createCheckBox(label: string, checked: boolean, uid: string): Element {
        const cbox: Element = checked ? this.cBoxTrue.cloneNode(true) as Element : this.cBoxFalse.cloneNode(true) as Element;
        cbox.querySelector('.e-label').innerHTML = label;
        return createCboxWithWrap(uid, cbox, 'e-ccheck');
    }

    private renderCheckbox(column: Column): void {
        let cclist: HTMLElement;
        let hideColState: boolean;
        let showColState: boolean;
        if (column.showInColumnChooser) {
            cclist = this.parent.createElement('li', { className: 'e-cclist e-cc', styles: 'list-style:None', id: 'e-ccli_' + column.uid });
            hideColState = this.hideColumn.indexOf(column.uid) === -1 ? false : true;
            showColState = this.showColumn.indexOf(column.uid) === -1 ? false : true;
            const cccheckboxlist: Element =
                this.createCheckBox(column.headerText, (column.visible && !hideColState) || showColState, column.uid);
            cclist.appendChild(cccheckboxlist);
            this.ulElement.appendChild(cclist);
        }
        if (this.isInitialOpen) {
            this.updateIntermediateBtn();
        }
    }

    private columnChooserManualSearch(e: MouseEvent & TouchEvent & KeyboardEvent): void {
        this.addcancelIcon();
        this.searchValue = (<HTMLInputElement>e.target).value;
        this.stopTimer();
        this.startTimer(e);
    }

    private startTimer(e: MouseEvent & TouchEvent & KeyboardEvent): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ColumnChooser = this;
        const interval: number = !proxy.flag && e.keyCode !== 13 ? 500 : 0;
        this.timer = window.setInterval(
            () => { proxy.columnChooserSearch(proxy.searchValue); }, interval);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private addcancelIcon(): void {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.add('e-cc-cancel');
    }

    private removeCancelIcon(): void {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.remove('e-cc-cancel');
    }

    private mOpenDlg(): void {
        if (Browser.isDevice) {
            this.dlgObj.element.querySelector('.e-cc-searchdiv').classList.remove('e-input-focus');
            (<HTMLElement>this.dlgObj.element.querySelectorAll('.e-cc-chbox')[0]).focus();
        }
    }

    // internally use
    private getModuleName(): string {
        return 'columnChooser';
    }
    private hideOpenedDialog(): void {
        const openCC: Element[] = [].slice.call(document.getElementsByClassName('e-ccdlg')).filter((dlgEle: Element) =>
            dlgEle.classList.contains('e-popup-open'));
        for (let i: number = 0, dlgLen: number = openCC.length; i < dlgLen; i++) {
            if (openCC[i].classList.contains('e-dialog') || this.parent.element.id + '_ccdlg' !== openCC[i].id) {
                (openCC[i] as EJ2Intance).ej2_instances[0].hide();
            }
        }
    }

    private beforeOpenColumnChooserEvent(): object {
        const args1: { requestType: string, element?: Element, columns?: Column[], cancel: boolean, searchOperator: string } = {
            requestType: 'beforeOpenColumnChooser', element: this.parent.element,
            columns: this.getColumns() as Column[], cancel: false,
            searchOperator: this.parent.columnChooserSettings.operator
        };
        this.parent.trigger(events.beforeOpenColumnChooser, args1);
        this.searchOperator = args1.searchOperator;
        return args1;
    }
}
