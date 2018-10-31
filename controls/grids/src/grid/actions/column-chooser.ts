import { classList, addClass, removeClass, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { Button } from '@syncfusion/ej2-buttons';
import { EventHandler, L10n, closest } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, IAction, NotifyArgs, EJ2Intance } from '../base/interface';
import * as events from '../base/constant';
import { ShowHide } from './show-hide';
import { Dialog, calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';
import { createCboxWithWrap, toogleCheckbox, parentsUntil } from '../base/util';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { SearchBox } from '../services/focus-strategy';
import { Grid } from '../base/grid';

/**
 * The `ColumnChooser` module is used to show or hide columns dynamically.
 */
export class ColumnChooser implements IAction {
    // internal variables
    private dataManager: DataManager;
    private column: Column;
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
    private mainDiv: HTMLElement;
    private innerDiv: HTMLElement;
    private ulElement: HTMLElement;
    private isDlgOpen: boolean = false;
    private dlghide: boolean = false;
    private initialOpenDlg: boolean = true;
    private stateChangeColumns: Column[] = [];
    private dlgDiv: HTMLElement;
    private isInitialOpen: boolean = false;
    private isCustomizeOpenCC: boolean = false;
    private cBoxTrue: Element;
    private cBoxFalse: Element;
    private searchBoxObj: SearchBox;
    private searchOperator: string = 'startswith';
    private targetdlg: Element;
    /**
     * Constructor for the Grid ColumnChooser module
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
        let gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.removeEventListener();
        this.unWireEvents();
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.element && !this.dlgObj.isDestroyed) {
            this.dlgObj.destroy();
        }
    }

    private rtlUpdate(): void {
        if (this.parent.enableRtl) {
            addClass(this.innerDiv.querySelectorAll('.e-checkbox-wrapper'), ['e-rtl']);
        } else {
            removeClass(this.innerDiv.querySelectorAll('.e-checkbox-wrapper'), ['e-rtl']);
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.uiUpdate, this.enableAfterRenderEle, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.addEventListener(events.dataBound, this.hideDialog.bind(this));
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.rtlUpdated, this.rtlUpdate, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.uiUpdate, this.enableAfterRenderEle);
        this.parent.off(events.rtlUpdated, this.rtlUpdate);
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.renderDlgContent();
        this.getShowHideService = this.serviceLocator.getService<ShowHide>('showHideService');
    }

    private clickHandler(e: MouseEvent): void {
        let targetElement: Element = e.target as Element;
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
     * @return {void}  
     * @hidden
     */
    public renderColumnChooser(x?: number, y?: number, target?: Element): void {
        if (!this.dlgObj.visible && (this.parent.detailTemplate || this.parent.childGrid)) {
            this.hideOpenedDialog();
        }
        if (!this.dlgObj.visible) {
            let pos: { X: number, Y: number } = { X: null, Y: null };
            let args1: { requestType: string, element?: Element, columns?: Column[], cancel: boolean, searchOperator: string } = {
                requestType: 'beforeOpenColumnChooser', element: this.parent.element,
                columns: this.getColumns() as Column[], cancel: false, searchOperator: this.searchOperator
            };
            this.parent.trigger(events.beforeOpenColumnChooser, args1);
            if (args1.cancel) {
                return;
            }
            this.searchOperator = args1.searchOperator;
            if (target) { this.targetdlg = target; }
            this.refreshCheckboxState();
            this.dlgObj.dataBind();
            this.dlgObj.element.style.maxHeight = '430px';
            let elementVisible: string = this.dlgObj.element.style.display;
            this.dlgObj.element.style.display = 'block';
            let newpos: { top: number, left: number } = calculateRelativeBasedPosition
                ((<HTMLElement>closest(target, '.e-toolbar-item')), this.dlgObj.element);
            this.dlgObj.element.style.display = elementVisible;
            this.dlgObj.element.style.top = newpos.top + closest(target, '.e-cc-toolbar').getBoundingClientRect().height + 'px';
            let dlgWidth: number = 250;
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

        } else {
            // this.unWireEvents();
            this.hideDialog();
            this.addcancelIcon();
        }
        this.rtlUpdate();
    }


    /** 
     * Column chooser can be displayed on screen by given position(X and Y axis). 
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
        if (!this.isInitialOpen) {
            this.dlgObj.content = this.renderChooserList();
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

    private customDialogOpen(): void {
        let searchElement: Element = (this.dlgObj.content as Element).querySelector('input.e-ccsearch');
        EventHandler.add(searchElement, 'keyup', this.columnChooserManualSearch, this);

    }
    private customDialogClose(): void {
        let searchElement: Element = (this.dlgObj.content as Element).querySelector('input.e-ccsearch');
        EventHandler.remove(searchElement, 'keyup', this.columnChooserManualSearch);
    }

    private getColumns(): Column[] {
         let columns: Column[] = this.parent.getColumns().filter((column: Column) => (column.type !== 'checkbox'
         && column.showInColumnChooser === true) || (column.type === 'checkbox' && column.field !== undefined));
         return columns;
    }


    private renderDlgContent(): void {
        let y: number;
        this.dlgDiv = this.parent.createElement('div', { className: 'e-ccdlg e-cc', id: this.parent.element.id + '_ccdlg' });
        this.parent.element.appendChild(this.dlgDiv);
        let xpos: number = this.parent.element.getBoundingClientRect().width - 250;
        let dialoPos: string = this.parent.enableRtl ? 'left' : 'right';
        let tarElement: Element = this.parent.element.querySelector('.e-ccdiv');
        if (!isNullOrUndefined(tarElement)) {
            y = tarElement.getBoundingClientRect().top;
        }
        let pos: { X: number, Y: number } = { X: null, Y: null };
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
                    cssClass: 'e-cc e-cc_okbtn',
                }
            },
            {
                click: this.clearActions.bind(this),
                buttonModel: { cssClass: 'e-flat e-cc e-cc-cnbtn', content: this.l10n.getConstant('CancelButton') }
            }],
            content: this.renderChooserList(),
            width: 250,
            cssClass: 'e-cc',
            animationSettings: { effect: 'None' },
        });
        this.dlgObj.appendTo(this.dlgDiv);
        this.wireEvents();
    }

    private renderChooserList(): HTMLElement {
        this.mainDiv = this.parent.createElement('div', { className: 'e-main-div e-cc' });
        let searchDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-searchdiv e-cc e-input-group' });
        let ccsearchele: HTMLElement = this.parent.createElement('input', {
            className: 'e-ccsearch e-cc e-input',
            attrs: { placeholder: this.l10n.getConstant('Search') }
        });
        let ccsearchicon: HTMLElement = this.parent.createElement('span', { className: 'e-ccsearch-icon e-icons e-cc e-input-group-icon',
        attrs: {title : this.l10n.getConstant('Search')} });
        let conDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-contentdiv' });
        this.innerDiv = this.parent.createElement('div', { className: 'e-innerdiv e-cc' });
        searchDiv.appendChild(ccsearchele);
        searchDiv.appendChild(ccsearchicon);
        this.searchBoxObj = new SearchBox(ccsearchele);
        let innerDivContent: HTMLElement | string[] | string = this.refreshCheckboxList(this.parent.getColumns() as Column[]);
        this.innerDiv.appendChild((innerDivContent as Element));
        conDiv.appendChild(this.innerDiv);
        this.mainDiv.appendChild(searchDiv);
        this.mainDiv.appendChild(conDiv);
        return this.mainDiv;
    }

    private confirmDlgBtnClick(args: Object): void {
        this.stateChangeColumns = [];
        if (!isNullOrUndefined(args)) {
            if (this.hideColumn.length) {
                this.columnStateChange(this.hideColumn, false);
            }
            if (this.showColumn.length) {
                this.columnStateChange(this.showColumn, true);
            }
            let params: { requestType: string, element?: Element, position?: Object, columns?: Column[], dialogInstance: Dialog } = {
                requestType: 'columnstate', element: this.parent.element,
                columns: this.stateChangeColumns as Column[], dialogInstance: this.dlgObj
            };
            this.parent.trigger(events.actionComplete, params);
            this.getShowHideService.setVisible(this.stateChangeColumns);
            this.clearActions();
            this.parent.notify(events.tooltipDestroy, { module: 'edit' });
        }
    }

    private columnStateChange(stateColumns: string[], state: boolean): void {
        for (let index: number = 0; index < stateColumns.length; index++) {
            let colUid: string = stateColumns[index];
            let currentCol: Column = this.parent.getColumnByUid(colUid);
            currentCol.visible = state;
            this.stateChangeColumns.push(currentCol);
        }
    }

    private clearActions(): void {
        this.hideColumn = [];
        this.showColumn = [];
        // this.unWireEvents();
        this.hideDialog();
        this.addcancelIcon();
    }

    private checkstatecolumn(isChecked: boolean, coluid: string): void {
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
    }

    private columnChooserSearch(searchVal: string): void {
        let clearSearch: boolean = false;
        let fltrCol: Column[];
        let okButton: Button;
        let buttonEle: HTMLElement = this.dlgDiv.querySelector('.e-footer-content');
        if (buttonEle) {
            okButton = (buttonEle.querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
        }
        if (searchVal === '') {
            this.removeCancelIcon();
            fltrCol = this.getColumns() as Column[];
            clearSearch = true;

        } else {
            fltrCol = new DataManager((this.getColumns() as Object[]) as JSON[]).executeLocal(new Query()
                .where('headerText', this.searchOperator, searchVal, true)) as Column[];
        }

        if (fltrCol.length) {
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.classList.remove('e-ccnmdiv');
            this.innerDiv.appendChild(<HTMLElement>this.refreshCheckboxList(fltrCol, searchVal));
            if (!clearSearch) {
                this.addcancelIcon();
                this.refreshCheckboxButton();
            } else {
                if (okButton) { okButton.disabled = false; }
            }
        } else {
            let nMatchele: HTMLElement = this.parent.createElement('span', { className: 'e-cc e-nmatch' });
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
        let elem: Element = parentsUntil(e.target as Element, 'e-checkbox-wrapper');
        if (elem) {
            toogleCheckbox(elem.parentElement);
            (elem.querySelector('.e-chk-hidden') as HTMLElement).focus();
            if (elem.querySelector('.e-check')) {
                checkstate = true;
            } else if (elem.querySelector('.e-uncheck')) {
                checkstate = false;
            } else {
                return;
            }
            let columnUid: string = parentsUntil(elem, 'e-ccheck').getAttribute('uid');
            this.checkstatecolumn(checkstate, columnUid);
            this.refreshCheckboxButton();
        }
    }

    private refreshCheckboxButton(): void {
        let searchValue: string = (<HTMLInputElement>this.dlgObj.element.querySelector('.e-cc.e-input')).value;
        let selected: number = this.innerDiv.querySelectorAll('.e-check').length;
        let btn: Button = (this.dlgDiv.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
        btn.disabled = false;
        let srchShowCols: string[] = [];
        let searchData: NodeListOf<HTMLInputElement> = this.parent.element.querySelectorAll('.e-cc-chbox');
        for (let i: number = 0, itemsLen: number = searchData.length; i < itemsLen; i++) {
            let element: HTMLInputElement = searchData[i] as HTMLInputElement;
            let columnUID: string = parentsUntil(element, 'e-ccheck').getAttribute('uid');
            srchShowCols.push(columnUID);
        }
        let hideCols: string[] = this.showColumn.filter((column: string) => srchShowCols.indexOf(column) !== -1);
        if (selected === 0 && hideCols.length === 0) {
            btn.disabled = true;
        }
        btn.dataBind();
    }

    private refreshCheckboxList(gdCol: Column[], searchVal?: string): HTMLElement {
        this.ulElement = this.parent.createElement('ul', { className: 'e-ccul-ele e-cc' });
        for (let i: number = 0; i < gdCol.length; i++) {
            let columns: Column = (gdCol[i] as Column);
            this.renderCheckbox(columns);
        }
        return this.ulElement;
    }

    private refreshCheckboxState(): void {
        (<HTMLInputElement>this.dlgObj.element.querySelector('.e-cc.e-input')).value = '';
        this.columnChooserSearch('');
        let gridObject: IGrid = this.parent;
        let currentCheckBoxColls: NodeListOf<Element> = this.dlgObj.element.querySelectorAll('.e-cc-chbox');
        for (let i: number = 0, itemLen: number = currentCheckBoxColls.length; i < itemLen; i++) {
            let element: HTMLInputElement = currentCheckBoxColls[i] as HTMLInputElement;
            let columnUID: string;
            if (this.parent.childGrid || this.parent.detailTemplate) {
                columnUID = parentsUntil(this.dlgObj.element.querySelectorAll('.e-cc-chbox')[i], 'e-ccheck').getAttribute('uid');
            } else { columnUID = parentsUntil(element, 'e-ccheck').getAttribute('uid'); }
            let column: Column = gridObject.getColumnByUid(columnUID);
            if (column.visible) {
                element.checked = true;
                this.checkState(element.parentElement.querySelector('.e-icons'), true);
            } else {
                element.checked = false;
                this.checkState(element.parentElement.querySelector('.e-icons'), false);
            }
        }

    }

    private checkState(element: Element, state: boolean): void {
        state ? classList(element, ['e-check'], ['e-uncheck']) : classList(element, ['e-uncheck'], ['e-check']);
    }

    private createCheckBox(label: string, checked: boolean, uid: string): Element {
        let cbox: Element = checked ? this.cBoxTrue.cloneNode(true) as Element : this.cBoxFalse.cloneNode(true) as Element;
        cbox.querySelector('.e-label').innerHTML = label;
        return createCboxWithWrap(uid, cbox, 'e-ccheck');
    }

    private renderCheckbox(column: Column): void {
        let cclist: HTMLElement;
        let hideColState: boolean;
        let showColState: boolean;
        let checkBoxObj: CheckBox;
        if (column.showInColumnChooser) {
            cclist = this.parent.createElement('li', { className: 'e-cclist e-cc', styles: 'list-style:None', id: 'e-ccli_' + column.uid });
            hideColState = this.hideColumn.indexOf(column.uid) === -1 ? false : true;
            showColState = this.showColumn.indexOf(column.uid) === -1 ? false : true;
            let cccheckboxlist: Element =
                this.createCheckBox(column.headerText, (column.visible && !hideColState) || showColState, column.uid);
            cclist.appendChild(cccheckboxlist);
            this.ulElement.appendChild(cclist);
        }
    }

    private columnChooserManualSearch(e: MouseEvent & TouchEvent & KeyboardEvent): void {
        this.addcancelIcon();
        this.searchValue = (<HTMLInputElement>e.target).value;
        let proxy: ColumnChooser = this;
        this.stopTimer();
        this.startTimer(e);
    }

    private startTimer(e: MouseEvent & TouchEvent & KeyboardEvent): void {
        let proxy: ColumnChooser = this;
        let interval: number = !proxy.flag && e.keyCode !== 13 ? 500 : 0;
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
        let openCC: Element[] = [].slice.call(document.getElementsByClassName('e-ccdlg')).filter((dlgEle: Element) =>
            dlgEle.classList.contains('e-popup-open'));
        for (let i: number = 0, dlgLen: number = openCC.length; i < dlgLen; i++) {
            if (openCC[i].classList.contains('e-dialog') || this.parent.element.id + '_ccdlg' !== openCC[i].id) {
                (openCC[i] as EJ2Intance).ej2_instances[0].hide();
            }
        }
    }
}