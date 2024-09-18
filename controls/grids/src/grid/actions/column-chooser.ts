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
import { createCboxWithWrap, toogleCheckbox, parentsUntil, removeAddCboxClasses, setChecked, resetDialogAppend } from '../base/util';
import { ResponsiveDialogAction } from '../base/enum';
import { ResponsiveDialogRenderer } from '../renderer/responsive-dialog-renderer';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { SearchBox } from '../services/focus-strategy';
import * as literals from '../base/string-literals';

/**
 * The `ColumnChooser` module is used to show or hide columns dynamically.
 */
export class ColumnChooser implements IAction {
    // internal variables
    private l10n: L10n;
    private dlgObj: Dialog;
    private searchValue: string;
    private flag: boolean;
    private timer: number;
    public getShowHideService: ShowHide;
    private filterColumns: Column[] = [];
    private showColumn: string[] = [];
    private hideColumn: string[] = [];
    private changedColumns: string[] = [];
    private unchangedColumns: string[] = [];
    private mainDiv: HTMLElement;
    private innerDiv: HTMLElement;
    private ulElement: HTMLElement;
    private isDlgOpen: boolean = false;
    private isColumnChooserOpen: boolean = false;
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

    //Module declarations
    /** @hidden */
    public parent: IGrid;
    /** @hidden */
    public responsiveDialogRenderer: ResponsiveDialogRenderer;
    /** @hidden */
    public serviceLocator: ServiceLocator;

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
        this.cBoxTrue = createCheckBox(this.parent.createElement, false, { checked: true, label: ' ' });
        this.cBoxFalse = createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
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
        if (this.parent.cssClass) {
            if (this.parent.cssClass.indexOf(' ') !== -1) {
                addClass([this.cBoxTrue, this.cBoxFalse], this.parent.cssClass.split(' '));
            } else {
                addClass([this.cBoxTrue, this.cBoxFalse], [this.parent.cssClass]);
            }
        }
        if (this.parent.enableAdaptiveUI) {
            this.setFullScreenDialog();
        }
    }

    private destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement.querySelector( '.' + literals.gridContent) && (!gridElement.querySelector('.' + literals.gridHeader)) || !gridElement) { return; }
        this.removeEventListener();
        this.unWireEvents();
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.element && !this.dlgObj.isDestroyed) {
            this.dlgObj.destroy();
        }
    }

    private setFullScreenDialog(): void {
        if (this.serviceLocator) {
            this.serviceLocator.registerAdaptiveService(this, this.parent.enableAdaptiveUI, ResponsiveDialogAction.isColumnChooser);
        }
        if (this.parent.enableAdaptiveUI) {
            this.parent.on(events.renderResponsiveColumnChooserDiv, this.renderResponsiveColumnChooserDiv, this);
            this.parent.on(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction, this);
        }
    }

    private rtlUpdate(): void {
        if (!isNullOrUndefined(this.innerDiv)) {
            if (this.parent.enableRtl) {
                addClass([].slice.call(this.innerDiv.getElementsByClassName('e-checkbox-wrapper')), ['e-rtl']);
            } else {
                removeClass([].slice.call(this.innerDiv.getElementsByClassName('e-checkbox-wrapper')), ['e-rtl']);
            }
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
        this.parent.on(events.resetColumns, this.onResetColumns, this);
        this.parent.on(events.setFullScreenDialog, this.setFullScreenDialog, this);
        if (this.parent.enableAdaptiveUI) {
            this.parent.on(events.renderResponsiveColumnChooserDiv, this.renderResponsiveColumnChooserDiv, this);
            this.parent.on(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction, this);
        }
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
        this.parent.off(events.resetColumns, this.onResetColumns);
        this.parent.removeEventListener(events.dataBound, this.hideDialogFunction);
        this.parent.off(events.setFullScreenDialog, this.setFullScreenDialog);
        if (this.parent.enableAdaptiveUI) {
            this.parent.off(events.setFullScreenDialog, this.setFullScreenDialog);
            this.parent.off(events.renderResponsiveColumnChooserDiv, this.renderResponsiveColumnChooserDiv);
            this.parent.off(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction);
        }
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        if (!this.parent.enableAdaptiveUI) {
            this.renderDlgContent();
        }
        this.getShowHideService = this.serviceLocator.getService<ShowHide>('showHideService');
    }

    private clickHandler(e: MouseEvent): void {
        const targetElement: Element = e.target as Element;
        if (!this.isCustomizeOpenCC) {
            if (!isNullOrUndefined(closest(targetElement, '.e-cc-toolbar')) || !isNullOrUndefined(closest(targetElement, '.e-cc'))) {
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
        if (!this.parent.enableAdaptiveUI) {
            this.rtlUpdate();
        } else {
            if (this.parent.enableRtl) {
                addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
            }
        }
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
            const isSticky: boolean = this.parent.getHeaderContent().classList.contains('e-sticky');
            const toolbarItem: HTMLElement = <HTMLElement>closest(target, '.e-toolbar-item');
            let newpos: { top: number, left: number };
            if (document.getElementById(this.parent.element.id + '_e-popup') && document.getElementById(this.parent.element.id + '_e-popup').querySelector('.e-ccdlg')) {
                this.parent.element.appendChild(this.dlgObj.element);
            }
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
            if ((this.parent.getContent().firstElementChild as HTMLElement).offsetHeight < this.dlgObj.element.offsetHeight &&
                !this.parent.element.classList.contains('e-drillthrough-grid')) {
                resetDialogAppend(this.parent, this.dlgObj);
                (this.dlgObj.element.querySelector('.e-ccsearch') as HTMLInputElement).select();
            }
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
        if (this.parent.enableAdaptiveUI) {
            if (!this.isColumnChooserOpen) {
                this.parent.showResponsiveCustomColumnChooser();
            }
            this.isColumnChooserOpen = false;
            this.renderDlgContent();
        }
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
            if (this.parent.enableAdaptiveUI) {
                this.dlgObj.position = { X: '', Y: '' };
            }
            this.dlgObj.refreshPosition();
        } else {
            this.dlgObj.element.style.top = '';
            this.dlgObj.element.style.left = '';
            this.dlgObj.element.style.top = Y + 'px';
            this.dlgObj.element.style.left = X + 'px';
        }
        this.dlgObj.beforeOpen = this.customDialogOpen.bind(this);
        this.dlgObj.show();
        if ((this.parent.getContent().firstElementChild as HTMLElement).offsetHeight < this.dlgObj.element.offsetHeight &&
            !this.parent.element.classList.contains('e-drillthrough-grid')) {
            resetDialogAppend(this.parent, this.dlgObj);
        }
        this.isInitialOpen = true;
        this.dlgObj.beforeClose = this.customDialogClose.bind(this);
    }

    private enableAfterRenderEle(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
        }
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        if (e.key === 'Escape') {
            this.resetColumnState();
        }
        this.setFocus(parentsUntil(e.target as Element, 'e-cclist'));
    }

    private setFocus(elem: Element): void {
        const prevElem: Element = this.dlgDiv.querySelector('.e-colfocus');
        if (prevElem) {
            prevElem.classList.remove('e-colfocus');
        }
        if (elem) {
            elem.classList.add('e-colfocus');
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
        const isAdaptive: boolean = this.parent.enableAdaptiveUI;
        this.dlgDiv = this.parent.createElement('div', { className: 'e-ccdlg e-cc', id: this.parent.element.id + '_ccdlg' });
        if (!isAdaptive) {
            this.parent.element.appendChild(this.dlgDiv);
        }
        this.dlgObj = new Dialog({
            header: this.parent.enableAdaptiveUI ? null : this.l10n.getConstant('ChooseColumns'),
            showCloseIcon: false,
            closeOnEscape: false,
            locale: this.parent.locale,
            visible: false,
            enableRtl: this.parent.enableRtl,
            target: document.getElementById(this.parent.element.id),
            content: this.renderChooserList(),
            width: 250,
            cssClass: this.parent.cssClass ? 'e-cc' + ' ' + this.parent.cssClass : 'e-cc',
            animationSettings: { effect: 'None' }
        });
        if (!isAdaptive) {
            this.dlgObj.buttons = [{
                click: this.confirmDlgBtnClick.bind(this),
                buttonModel: {
                    content: this.l10n.getConstant('OKButton'), isPrimary: true,
                    cssClass: this.parent.cssClass ? 'e-cc e-cc_okbtn' + ' ' + this.parent.cssClass : 'e-cc e-cc_okbtn'
                }
            },
            {
                click: this.clearBtnClick.bind(this),
                buttonModel: {
                    cssClass: this.parent.cssClass ?
                        'e-flat e-cc e-cc-cnbtn' + ' ' + this.parent.cssClass : 'e-flat e-cc e-cc-cnbtn',
                    content: this.l10n.getConstant('CancelButton')
                }
            }];
        }
        const isStringTemplate: string = 'isStringTemplate';
        this.dlgObj[`${isStringTemplate}`] = true;
        this.dlgObj.appendTo(this.dlgDiv);
        if (isAdaptive) {
            const responsiveCnt: HTMLElement = document.querySelector('.e-responsive-dialog > .e-dlg-content > .e-mainfilterdiv');
            if (responsiveCnt) {
                responsiveCnt.appendChild(this.dlgDiv);
            }
            this.dlgObj.open = this.mOpenDlg.bind(this);
            this.dlgObj.target = document.querySelector('.e-rescolumnchooser > .e-dlg-content > .e-mainfilterdiv') as HTMLElement;
        }
        this.wireEvents();
    }

    private renderChooserList(): HTMLElement {
        this.mainDiv = this.parent.createElement('div', { className: 'e-main-div e-cc' });
        const searchDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-searchdiv e-cc e-input-group' });
        const ccsearchele: HTMLElement = this.parent.createElement('input', {
            className: 'e-ccsearch e-cc e-input',
            attrs: { placeholder: this.l10n.getConstant('Search'), cssClass: this.parent.cssClass }
        });
        const ccsearchicon: HTMLElement = this.parent.createElement('span', {
            className: 'e-ccsearch-icon e-icons e-cc e-input-group-icon',
            attrs: { title: this.l10n.getConstant('Search') }
        });
        const conDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-contentdiv' });
        this.innerDiv = this.parent.createElement('div', { className: 'e-innerdiv e-cc' });
        searchDiv.appendChild(ccsearchele);
        searchDiv.appendChild(ccsearchicon);
        this.searchBoxObj = new SearchBox(ccsearchele, this.serviceLocator);
        const innerDivContent: HTMLElement | string[] | string = this.refreshCheckboxList(this.parent.getColumns() as Column[]);
        this.innerDiv.appendChild((innerDivContent as Element));
        conDiv.appendChild(this.innerDiv);
        if (this.parent.enableAdaptiveUI) {
            const searchBoxDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cc-searchBox' });
            searchBoxDiv.appendChild(searchDiv);
            this.mainDiv.appendChild(searchBoxDiv);
        } else {
            this.mainDiv.appendChild(searchDiv);
        }
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
            if (this.parent.enableAdaptiveUI && this.parent.scrollModule) {
                this.parent.scrollModule.refresh();
            }
            if (this.parent.editSettings.showAddNewRow) {
                this.parent.notify(events.showAddNewRowFocus, {});
            }
        }
    }

    private onResetColumns(e: NotifyArgs): void {
        if (e.requestType === 'columnstate') {
            this.resetColumnState();
            return;
        }
    }

    private renderResponsiveColumnChooserDiv(args: { action?: string }): void {
        if (args.action === 'open') {
            this.isColumnChooserOpen = true;
            this.openColumnChooser();
        } else if (args.action === 'clear') {
            this.clearBtnClick();
        } else if (args.action === 'confirm') {
            this.confirmDlgBtnClick(true);
        }
    }

    public resetColumnState(): void {
        this.showColumn = [];
        this.hideColumn = [];
        this.changedColumns = [];
        this.filterColumns = [];
        this.searchValue = '';
        this.hideDialog();
    }

    private changedColumnState(changedColumns: string[]): void {
        for (let index: number = 0; index < changedColumns.length; index++) {
            const colUid: string = changedColumns[parseInt(index.toString(), 10)];
            const currentCol: Column = this.parent.getColumnByUid(colUid);
            this.changedStateColumns.push(currentCol);
        }
    }

    private columnStateChange(stateColumns: string[], state: boolean): void {
        for (let index: number = 0; index < stateColumns.length; index++) {
            const colUid: string = stateColumns[parseInt(index.toString(), 10)];
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
        const currentCol: Column = this.parent.getColumnByUid(coluid);
        if (isChecked) {
            if (this.hideColumn.indexOf(coluid) !== -1) {
                this.hideColumn.splice(this.hideColumn.indexOf(coluid), 1);
            }
            if (this.showColumn.indexOf(coluid) === -1 && !(currentCol && currentCol.visible)) {
                this.showColumn.push(coluid);
            }
        } else {
            if (this.showColumn.indexOf(coluid) !== -1) {
                this.showColumn.splice(this.showColumn.indexOf(coluid), 1);
            }
            if (this.hideColumn.indexOf(coluid) === -1 && (currentCol && currentCol.visible)) {
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
            this.filterColumns = this.getColumns() as Column[];
            clearSearch = true;

        } else {
            this.filterColumns = new DataManager((this.getColumns() as Object[]) as JSON[]).executeLocal(new Query()
                .where('headerText', this.searchOperator, searchVal, true, this.parent.columnChooserSettings.ignoreAccent)) as Column[];
        }

        if (this.filterColumns.length) {
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.classList.remove('e-ccnmdiv');
            this.innerDiv.appendChild(<HTMLElement>this.refreshCheckboxList(this.filterColumns));
            if (!clearSearch) {
                this.addcancelIcon();
                this.refreshCheckboxButton();
            } else {
                if (okButton && selectedCbox) { okButton.disabled = false; }
                if (selectedCbox && this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                    this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: false });
                }
            }
        } else {
            const nMatchele: HTMLElement = this.parent.createElement('span', { className: 'e-cc e-nmatch' });
            nMatchele.innerHTML = this.l10n.getConstant('Matchs');
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.appendChild(nMatchele);
            this.innerDiv.classList.add('e-ccnmdiv');
            if (okButton) { okButton.disabled = true; }
            if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: true });
            }
        }
        this.flag = true;
        this.stopTimer();
    }

    private wireEvents(): void {
        EventHandler.add(this.dlgObj.element, 'click', this.checkBoxClickHandler, this);
        EventHandler.add(this.searchBoxObj.searchBox, 'keyup', this.columnChooserManualSearch, this);
        EventHandler.add(this.dlgObj.element, 'keyup', this.keyUpHandler, this);
        this.searchBoxObj.wireEvent();
    }

    private unWireEvents(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.dlgObj && this.dlgObj.element) {
            EventHandler.remove(this.dlgObj.element, 'click', this.checkBoxClickHandler);
            EventHandler.remove(this.dlgObj.element, 'keyup', this.keyUpHandler);
        }
        if (this.searchBoxObj) {
            EventHandler.remove(this.searchBoxObj.searchBox, 'keyup', this.columnChooserManualSearch);
            this.searchBoxObj.unWireEvent();
        }
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
            }
            this.updateIntermediateBtn();
            const columnUid: string = parentsUntil(elem, 'e-ccheck').getAttribute('uid');
            const column: Column[] =  (this.searchValue && this.searchValue.length) ? this.filterColumns : this.parent.getColumns();
            if (columnUid === this.parent.element.id + '-selectAll') {
                this.changedColumns = [];
                this.unchangedColumns = [];
                for (let i: number = 0; i < column.length; i++) {
                    if (column[parseInt(i.toString(), 10)].showInColumnChooser) {
                        this.checkstatecolumn(checkstate, column[parseInt(i.toString(), 10)].uid, true);
                    }
                }
            } else {
                this.checkstatecolumn(checkstate, columnUid);
            }
            this.refreshCheckboxButton();
            this.setFocus(parentsUntil(e.target as Element, 'e-cclist'));
        }
    }

    private updateIntermediateBtn(): void {
        const cnt: number = this.ulElement.children.length - 1;
        let className: string[] = [];
        const elem: Element = this.ulElement.children[0].querySelector('.e-frame');
        const selected: number = this.ulElement.querySelectorAll('.e-check:not(.e-selectall)').length;
        let btn: Button;
        if (!this.parent.enableAdaptiveUI) {
            btn = (<{ btnObj?: Button }>(this.dlgObj as DialogModel)).btnObj[0];
            btn.disabled = false;
        } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
            this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: false });
        }
        const inputElem: HTMLInputElement = elem.parentElement.querySelector('input');
        if (cnt === selected) {
            className = ['e-check'];
            setChecked(inputElem, true);
        } else if (selected) {
            className = ['e-stop'];
            inputElem.indeterminate = true;
        } else {
            className = ['e-uncheck'];
            setChecked(inputElem, false);
            if (!this.parent.enableAdaptiveUI) {
                btn.disabled = true;
            } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: true });
            }
        }
        if (!this.parent.enableAdaptiveUI) {
            btn.dataBind();
        }
        removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([elem], className);
    }

    private updateSelectAll(checked: boolean): void {
        const cBoxes: Element[] = [].slice.call(this.ulElement.getElementsByClassName('e-frame'));
        for (const cBox of cBoxes) {
            removeAddCboxClasses(cBox, checked);
            const cBoxInput: HTMLInputElement = cBox.parentElement.querySelector('input');
            if (cBox.classList.contains('e-check')) {
                setChecked(cBoxInput, true);
            }
            else if (cBox.classList.contains('e-uncheck')) {
                setChecked(cBoxInput, false);
            }
        }
    }

    private refreshCheckboxButton(): void {
        const visibleCols: Column[] = this.parent.getVisibleColumns();
        for (let i: number = 0; i < visibleCols.length; i++) {
            const columnUID: string = visibleCols[parseInt(i.toString(), 10)].uid;
            if (this.prevShowedCols.indexOf(columnUID) === -1 && visibleCols[parseInt(i.toString(), 10)].type !== 'checkbox') {
                this.prevShowedCols.push(columnUID);
            }
        }
        for (let i: number = 0; i < this.hideColumn.length; i++) {
            const index: number = this.prevShowedCols.indexOf(this.hideColumn[parseInt(i.toString(), 10)]);
            if (index !== -1) {
                this.prevShowedCols.splice(index, 1);
            }
        }
        const selected: number = this.showColumn.length !== 0 ? 1 : this.prevShowedCols.length;
        let btn: Button;
        if (!this.parent.enableAdaptiveUI) {
            btn = (this.dlgDiv.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
            btn.disabled = false;
        } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
            this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: false });
        }
        const srchShowCols: string[] = [];
        const searchData: NodeListOf<HTMLInputElement> = [].slice.call(this.parent.element.getElementsByClassName('e-cc-chbox'));
        for (let i: number = 0, itemsLen: number = searchData.length; i < itemsLen; i++) {
            const element: HTMLInputElement = searchData[parseInt(i.toString(), 10)] as HTMLInputElement;
            const columnUID: string = parentsUntil(element, 'e-ccheck').getAttribute('uid');
            srchShowCols.push(columnUID);
        }
        const hideCols: string[] = this.showColumn.filter((column: string) => srchShowCols.indexOf(column) !== -1);
        if (selected === 0 && hideCols.length === 0) {
            if (!this.parent.enableAdaptiveUI) {
                btn.disabled = true;
            } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: true });
            }
        }
        if (!this.parent.enableAdaptiveUI) {
            btn.dataBind();
        }
    }

    private refreshCheckboxList(gdCol: Column[]): HTMLElement {
        this.ulElement = this.parent.createElement('ul', { className: 'e-ccul-ele e-cc' });
        const selectAllValue: string = this.l10n.getConstant('SelectAll');
        const cclist: HTMLElement = this.parent.createElement('li', { className: 'e-cclist e-cc e-cc-selectall' });
        const selectAll: Element = this.createCheckBox(selectAllValue, false, this.parent.element.id + '-selectAll');
        if (gdCol.length) {
            selectAll.querySelector('.e-checkbox-wrapper').firstElementChild.classList.add('e-selectall');
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            this.checkState(selectAll.querySelector('.e-icons'), true);
            cclist.appendChild(selectAll);
            this.ulElement.appendChild(cclist);
        }
        if (this.parent.cssClass) {
            if (this.parent.cssClass.indexOf(' ') !== -1) {
                addClass([selectAll], this.parent.cssClass.split(' '));
            } else {
                addClass([selectAll], [this.parent.cssClass]);
            }
        }
        for (let i: number = 0; i < gdCol.length; i++) {
            const columns: Column = (gdCol[parseInt(i.toString(), 10)] as Column);
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
            const element: HTMLInputElement = currentCheckBoxColls[parseInt(i.toString(), 10)] as HTMLInputElement;
            let columnUID: string;
            if (this.parent.childGrid || this.parent.detailTemplate) {
                columnUID = parentsUntil(this.dlgObj.element.querySelectorAll('.e-cc-chbox:not(.e-selectall)')[parseInt(i.toString(), 10)],
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
        if (!this.parent.enableAdaptiveUI && this.parent.enableRtl && !cbox.classList.contains('e-rtl')) {
            cbox.classList.add('e-rtl');
        }
        const cboxLabel: HTMLElement = cbox.querySelector('.e-label');
        const inputcbox: HTMLInputElement = cbox.querySelector('input');
        setChecked(inputcbox, checked);
        cboxLabel.setAttribute('id', uid + 'label');
        cboxLabel.innerHTML = label;
        inputcbox.setAttribute('aria-labelledby', cboxLabel.id);
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
            if (this.parent.cssClass) {
                if (this.parent.cssClass.indexOf(' ') !== -1) {
                    addClass([cccheckboxlist], this.parent.cssClass.split(' '));
                } else {
                    addClass([cccheckboxlist], [this.parent.cssClass]);
                }
            }
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
        this.dlgDiv.querySelector('.e-cc-cancel').setAttribute('title', this.l10n.getConstant('Clear'));
    }

    private removeCancelIcon(): void {
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.remove('e-cc-cancel');
        this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').setAttribute('title', this.l10n.getConstant('Search'));
    }

    private mOpenDlg(): void {
        if (Browser.isDevice) {
            this.dlgObj.element.querySelector('.e-cc-searchdiv').classList.remove('e-input-focus');
            (<HTMLElement>this.dlgObj.element.querySelectorAll('.e-cc-chbox')[0]).focus();
        }
        if (this.parent.enableAdaptiveUI) {
            this.dlgObj.element.querySelector('.e-cc-searchdiv').classList.add('e-input-focus');
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
            if (this.parent.element.id + '_ccdlg' !== openCC[parseInt(i.toString(), 10)].id || openCC[parseInt(i.toString(), 10)].classList.contains('e-dialog')) {
                (openCC[parseInt(i.toString(), 10)] as EJ2Intance).ej2_instances[0].hide();
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

    private renderResponsiveChangeAction(args: { action?: number }): void {
        this.responsiveDialogRenderer.action = args.action;
    }

    /**
     * To show the responsive custom sort dialog
     *
     * @param {boolean} enable - specifes dialog open
     * @returns {void}
     * @hidden
     */
    public showCustomColumnChooser(enable: boolean): void {
        this.responsiveDialogRenderer.isCustomDialog = enable;
        this.responsiveDialogRenderer.showResponsiveDialog();
    }
}
