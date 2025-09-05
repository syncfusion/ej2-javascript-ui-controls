import { classList, addClass, removeClass, isNullOrUndefined, Browser, KeyboardEventArgs, updateCSSText, remove } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { Button } from '@syncfusion/ej2-buttons';
import { EventHandler, L10n, closest } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, IAction, NotifyArgs, EJ2Intance, ColumnChooserActionArgs } from '../base/interface';
import * as events from '../base/constant';
import { ShowHide } from './show-hide';
import { Dialog, calculateRelativeBasedPosition, DialogModel } from '@syncfusion/ej2-popups';
import { createCboxWithWrap, toogleCheckbox, parentsUntil, removeAddCboxClasses, setChecked, resetDialogAppend, Global, appendChildren, getListHeight, infiniteRemoveElements, infiniteAppendElements, clearReactVueTemplates, getObject } from '../base/util';
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
    private infiniteDiv: HTMLElement;
    private infiniteLoadedElement:  HTMLElement[] = [];
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
    private sortDirection: string = 'None';
    private selectedColumnModels: Column[] = [];
    private selectedColumns: string[] = [];
    private targetdlg: Element;
    private itemsCount: number = 50;
    private infiniteSkipCount: number = 0;
    private infiniteColumns: Column[] = [];
    private infiniteInitialLoad: boolean = false;
    private prevInfiniteScrollDirection: string = '';
    private infiniteScrollAppendDiff: number;
    private prevShowedCols: string[] = [];
    private hideDialogFunction: Function = this.hideDialog.bind(this);
    private infiniteRenderMode: boolean = false;


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
        this.infiniteRenderMode = this.parent.enableColumnVirtualization ? true : false;
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
        this.infiniteLoadedElement = null;
        this.infiniteDiv = null;
        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.element && !this.dlgObj.isDestroyed) {
            if (this.parent.isReact && this.parent.columnChooserSettings.template) {
                if (!Global.timer) {
                    Global.timer = (setTimeout(() => {
                        if (!isNullOrUndefined(this.dlgObj) && this.dlgObj.element && !this.dlgObj.isDestroyed) {
                            this.dlgObj.destroy();
                        }
                    }, 0));
                } else {
                    clearTimeout(Global.timer as number);
                    Global.timer = null;
                }
            } else {
                this.dlgObj.destroy();
            }
            let gridPopup: HTMLElement = document.getElementById(this.parent.element.id + '_e-popup');
            if (!isNullOrUndefined(gridPopup)) {
                remove(gridPopup);
                gridPopup = null;
            }
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
            this.parent.on(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction, this);
        }
        if (this.infiniteRenderMode || this.parent.enableAdaptiveUI) {
            this.parent.on(events.renderResponsiveColumnChooserDiv, this.renderResponsiveColumnChooserDiv, this);
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
        if (this.infiniteDiv) {
            EventHandler.remove(this.infiniteDiv, 'scroll', this.infiniteScrollHandler);
            EventHandler.remove(this.infiniteDiv, 'mouseup', this.infiniteScrollMouseKeyUpHandler);
            EventHandler.remove(this.infiniteDiv, 'mousedown', this.infiniteScrollMouseKeyDownHandler);
        }
        if (this.parent.enableAdaptiveUI) {
            this.parent.off(events.setFullScreenDialog, this.setFullScreenDialog);
            this.parent.off(events.renderResponsiveChangeAction, this.renderResponsiveChangeAction);
        }
        if (this.infiniteRenderMode || this.parent.enableAdaptiveUI) {
            this.parent.off(events.renderResponsiveColumnChooserDiv, this.renderResponsiveColumnChooserDiv);
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
                    this.columnChooserSearch('', false);
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
            if (this.parent.enableAdaptiveUI) {
                this.responsiveDialogRenderer.hideResponsiveColumnChooser();
            } else {
                this.dlgObj.hide();
                // this.unWireEvents();
                this.isDlgOpen = false;
            }
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
            if (!this.infiniteRenderMode && this.selectedColumns.length && this.sortDirection === 'None' &&
                !this.parent.columnChooserSettings.template) {
                this.setOrderedColumns();
            }
            (<{ columns?: Column[] }>args).columns = null;
            if (target) { this.targetdlg = target; }
            if (this.infiniteRenderMode) {
                this.dlgObj.show();
            }
            this.refreshCheckboxState();
            this.dlgObj.dataBind();
            this.dlgObj.element.style.maxHeight = '430px';
            const elementVisible: string = this.dlgObj.element.style.display;
            if (!this.parent.columnChooserSettings.enableSearching) {
                const contentElement: HTMLElement = this.dlgObj.element.querySelector('.e-dlg-content');
                contentElement.style.margin = '0px';
            }
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
            if (!this.infiniteRenderMode) {
                this.dlgObj.show();
            }
            if ((this.parent.getContent().firstElementChild as HTMLElement).offsetHeight < this.dlgObj.element.offsetHeight &&
                !this.parent.element.classList.contains('e-drillthrough-grid')) {
                resetDialogAppend(this.parent, this.dlgObj);
                if (this.dlgObj.element.querySelector('.e-ccsearch')) {
                    (this.dlgObj.element.querySelector('.e-ccsearch') as HTMLInputElement).select();
                }
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
                return;
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
        if (!this.infiniteRenderMode && this.selectedColumns.length && this.sortDirection === 'None' &&
            !this.parent.columnChooserSettings.template) {
            this.setOrderedColumns();
        }
        (<{ columns?: Column[] }>args).columns = null;
        if (this.infiniteRenderMode) {
            this.dlgObj.show();
        }
        if (!this.isInitialOpen) {
            this.dlgObj.content = this.renderChooserList();
            if (!this.parent.columnChooserSettings.template) {
                this.updateIntermediateBtn();
            }
        } else {
            this.refreshCheckboxState();
        }
        this.dlgObj.dataBind();
        if (this.infiniteRenderMode) {
            this.refreshCheckboxState();
        }
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
        if (!this.parent.columnChooserSettings.enableSearching) {
            const contentElement: HTMLElement = this.dlgObj.element.querySelector('.e-dlg-content');
            contentElement.style.margin = '0px';
        }
        this.dlgObj.beforeOpen = this.customDialogOpen.bind(this);
        if (!this.infiniteRenderMode) {
            this.dlgObj.show();
        }
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
        if (e && e.target && !isNullOrUndefined(closest(e.target as Element, '.e-grid-popup'))) {
            this.parent.trigger('keyPressed', e);
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
        const columns: Column[] = (this.infiniteRenderMode ? this.infiniteColumns : this.parent.getColumns()).filter((column: Column) => (column.type !== 'checkbox'
         && column.showInColumnChooser === true) || (column.type === 'checkbox' && column.field !== undefined));
        return columns;
    }

    private setOrderedColumns(): void {
        this.selectedColumnModels = [];
        for (let i: number = 0; i < this.selectedColumns.length; i++) {
            const column: Column = this.parent.getColumnByField(this.selectedColumns[parseInt(i.toString(), 10)]);
            if (column.showInColumnChooser) {
                this.selectedColumnModels.push(column);
            }
        }
    }

    private renderDlgContent(): void {
        const isAdaptive: boolean = this.parent.enableAdaptiveUI;
        this.dlgDiv = this.parent.createElement('div', { className: 'e-ccdlg e-cc', id: this.parent.element.id + '_ccdlg' });
        if (!isAdaptive) {
            this.parent.element.appendChild(this.dlgDiv);
        }
        this.dlgObj = new Dialog({
            header: this.parent.enableAdaptiveUI ? null : this.renderHeader(),
            showCloseIcon: false,
            closeOnEscape: false,
            locale: this.parent.locale,
            visible: false,
            enableRtl: this.parent.enableRtl,
            target: document.getElementById(this.parent.element.id),
            content: this.renderChooserList(),
            width: 250,
            cssClass: this.parent.cssClass ? 'e-cc' + ' ' + this.parent.cssClass : 'e-cc',
            animationSettings: { effect: 'None' },
            footerTemplate: this.parent.enableAdaptiveUI ? null : this.renderFooter()
        });
        if (!isAdaptive && (this.infiniteRenderMode || !this.parent.columnChooserSettings.footerTemplate)) {
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

    /**
     * To render the header template for the column chooser.
     * @returns {HTMLElement | string} This method return HTMLElement or string.
     * @hidden
     */
    public renderHeader(): HTMLElement | string {
        const gridInstance: IGrid = this.parent;
        if (gridInstance.columnChooserSettings.headerTemplate && !this.infiniteRenderMode) {
            const templateDiv: HTMLElement = this.parent.createElement('div', { className: 'e-columnChooserHeaderTemplate' });
            const templateID: string = this.parent.element.id + 'columnChooserHeaderTemplate';
            if (this.parent.isReact) {
                this.parent.getColumnChooserHeaderTemplate()(
                    null, this.parent, 'columnChooserHeaderTemplate', templateID, null, null, templateDiv);
                this.parent.renderTemplates();
            } else {
                appendChildren(templateDiv, this.parent.getColumnChooserHeaderTemplate()(
                    null, this.parent, 'columnChooserHeaderTemplate', templateID));
            }
            return templateDiv;
        }
        return this.l10n.getConstant('ChooseColumns');
    }

    /**
     * To render the footer template for the column chooser.
     * @returns {HTMLElement | string} This method return HTMLElement or string.
     */
    private renderFooter(): HTMLElement | string {
        const gridInstance: IGrid = this.parent;
        if (gridInstance.columnChooserSettings.footerTemplate && !this.infiniteRenderMode) {
            const templateDiv: HTMLElement = this.parent.createElement('div', { className: 'e-columnChooserFooterTemplate' });
            const templateID: string = this.parent.element.id + 'columnChooserFooterTemplate';
            if (this.parent.isReact) {
                this.parent.getColumnChooserFooterTemplate()(
                    null, this.parent, 'columnChooserFooterTemplate', templateID, null, null, templateDiv);
                this.parent.renderTemplates();
            } else {
                appendChildren(
                    templateDiv, this.parent.getColumnChooserFooterTemplate()(null, this.parent, 'columnChooserFooterTemplate', templateID));
            }
            return templateDiv;
        }
        return null;
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
        let columns: Column[] = this.getColumns();
        const showColumns: string[] = [];
        const hideColumns: string[] = [];
        columns.forEach((column: Column) => {
            if (column.visible) {
                showColumns.push(column.headerText);
            } else {
                hideColumns.push(column.headerText);
            }
        });
        if (this.infiniteRenderMode && !this.isInitialOpen) {
            columns = this.parent.columns as Column[];
            for (let i: number = 0; i < columns.length; i++) {
                if (columns[parseInt(i.toString(), 10)].showInColumnChooser) {
                    this.infiniteColumns.push(columns[parseInt(i.toString(), 10)] as Column);
                }
            }
        }
        if (this.parent.columnChooserSettings.template && !this.infiniteRenderMode) {
            const templateDiv: Element = this.parent.createElement('div', { className: 'e-columnChooserTemplate' });
            (templateDiv as HTMLElement).style.cssText = this.parent.enableAdaptiveUI ?
                'height: 90%; min-height: 160px; overflow-y: auto;' : 'height: 196px; overflow-y: auto;';
            const TemplateID: string = this.parent.element.id + 'columnChooserTemplate';
            const argsData: Object = { columns : columns, hideColumns: hideColumns, showColumns: showColumns };
            if (this.parent.isReact) {
                this.parent.getColumnChooserTemplate()(argsData, this.parent, 'columnChooserTemplate', TemplateID, null, null, templateDiv);
                this.parent.renderTemplates();
            } else {
                appendChildren(templateDiv, this.parent.getColumnChooserTemplate()(
                    argsData, this.parent, 'columnChooserTemplate', TemplateID, null, null, null, this.parent.root));
            }
            if (this.parent.columnChooserSettings.renderCustomColumnChooser) {
                if (typeof this.parent.columnChooserSettings.renderCustomColumnChooser === 'function') {
                    this.parent.columnChooserSettings.renderCustomColumnChooser(templateDiv, columns);
                } else if (typeof this.parent.columnChooserSettings.renderCustomColumnChooser === 'string') {
                    this.parent.columnChooserSettings.renderCustomColumnChooser =
                        getObject(this.parent.columnChooserSettings.renderCustomColumnChooser, window);
                    (this.parent.columnChooserSettings.renderCustomColumnChooser as Function)(templateDiv, columns);
                }
            }
            this.mainDiv.appendChild(searchDiv);
            this.mainDiv.appendChild(templateDiv);
        } else {
            const innerDivContent: HTMLElement | string[] | string = this.refreshCheckboxList(columns);
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
        }
        if (!this.parent.columnChooserSettings.enableSearching) {
            searchDiv.style.display = 'none';
        }
        return this.mainDiv;
    }

    private confirmDlgBtnClick(args: Object): void {
        const onActionBeginArgs: ColumnChooserActionArgs = {
            requestType: 'columnVisibilityUpdate',
            columns: this.getColumns() as Column[],
            cancel: false
        };
        this.parent.trigger(events.actionBegin, onActionBeginArgs);
        if (onActionBeginArgs.cancel) {
            return;
        }
        this.stateChangeColumns = [];
        this.changedStateColumns = [];
        const columns: Column[] = this.infiniteRenderMode ? this.infiniteColumns : this.parent.getColumns();
        this.changedColumns = (this.changedColumns.length > 0) ? this.changedColumns : this.unchangedColumns;
        this.changedColumnState(this.changedColumns);
        const uncheckedLength: number = this.infiniteRenderMode ? this.infiniteLoadedElement.filter(
            (arr: HTMLElement) => arr.querySelector('.e-uncheck')).length : this.ulElement &&
                this.ulElement.querySelector('.e-uncheck') && this.ulElement.querySelectorAll('.e-uncheck:not(.e-selectall)').length;
        if (!isNullOrUndefined(args)) {
            if (uncheckedLength < columns.length) {
                this.changeColumnVisibility({visibleColumns: this.showColumn, hiddenColumns: this.hideColumn}, 'uid');
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
        const onActionCompleteArgs: ColumnChooserActionArgs = {
            requestType: 'columnVisibilityUpdate',
            columns: this.getColumns() as Column[],
            cancel: false
        };
        this.parent.trigger(events.actionComplete, onActionCompleteArgs);
    }

    /**
     * Toggles the visibility of specified columns in the grid.
     * @param {Object} columns - An object specifying the columns to show or hide.
     * @param {string[]} columns.visibleColumns - An array of column identifiers specifying the columns to show.
     * @param {string[]} columns.hiddenColumns - An array of column identifiers specifying the columns to hide.
     * @param {string} columnKey - Defines the column key as a UID, field name, or header text.
     * @returns {void}
     * The 'columns' object contains the properties 'visibleColumns' and 'hiddenColumns' as arrays of column identifiers.
     */
    public changeColumnVisibility(columns: { visibleColumns: string[], hiddenColumns: string[]}, columnKey?: string): void {
        columnKey = columnKey ? columnKey : 'headerText';
        if (columnKey !== 'uid') {
            if (columns.visibleColumns || columns.hiddenColumns) {
                this.stateChangeColumns = [];
                this.changedStateColumns = [];
                const columnChooserColumns: Column[] = this.getColumns();
                columns.hiddenColumns = columnChooserColumns.filter((column: Column) =>
                    columns.hiddenColumns.indexOf(column[columnKey as keyof Column] as string) !== -1).map((column: Column) => column.uid);
                columns.visibleColumns = columnChooserColumns.filter((column: Column) =>
                    columns.visibleColumns.indexOf(column[columnKey as keyof Column] as string) !== -1).map((column: Column) => column.uid);
            }
        }
        if (columns.hiddenColumns.length) {
            this.columnStateChange(columns.hiddenColumns, false);
        }
        if (columns.visibleColumns.length) {
            this.columnStateChange(columns.visibleColumns, true);
        }
        this.getShowHideService.setVisible(this.stateChangeColumns, this.changedStateColumns);
        this.clearActions();
        this.parent.notify(events.tooltipDestroy, { module: 'edit' });
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
        this.selectedColumnModels = [];
        this.selectedColumns = [];
        this.sortDirection = '';
        if (this.infiniteRenderMode) {
            const focusListElement: HTMLElement = this.dlgDiv.querySelector('.e-cclist.e-cc-selectall.e-colfocus');
            if (focusListElement) {
                focusListElement.classList.remove('e-colfocus');
            }
        }
        this.hideDialog();
    }

    private changedColumnState(changedColumns: string[]): void {
        for (let index: number = 0; index < changedColumns.length; index++) {
            const colUid: string = changedColumns[parseInt(index.toString(), 10)];
            const currentColumn: Column = this.parent.getColumnByUid(colUid, this.infiniteRenderMode);
            this.changedStateColumns.push(currentColumn);
        }
    }

    private columnStateChange(stateColumns: string[], state: boolean): void {
        for (let index: number = 0; index < stateColumns.length; index++) {
            const colUid: string = stateColumns[parseInt(index.toString(), 10)];
            const currentColumn: Column = this.parent.getColumnByUid(colUid,  this.infiniteRenderMode);
            if (currentColumn) {
                if (currentColumn.type !== 'checkbox') {
                    currentColumn.visible = state;
                }
                this.stateChangeColumns.push(currentColumn);
            }
        }
    }

    private clearActions(): void {
        this.resetColumnState();
        this.addcancelIcon();
    }

    private clearBtnClick(): void {
        const onActionBeginArgs: ColumnChooserActionArgs = {
            requestType: 'columnChooserClose',
            cancel: false
        };
        this.parent.trigger(events.actionBegin, onActionBeginArgs);
        if (onActionBeginArgs.cancel) {
            return;
        }
        this.clearActions();
        this.parent.notify(events.columnChooserCancelBtnClick, { dialog: this.dlgObj });
        const onActionCompleteArgs: ColumnChooserActionArgs = {
            requestType: 'columnChooserClose',
            cancel: false
        };
        this.parent.trigger(events.actionComplete, onActionCompleteArgs);
    }

    private checkstatecolumn(isChecked: boolean, coluid: string, selectAll: boolean = false): void {
        const currentColumn: Column = this.parent.getColumnByUid(coluid, this.infiniteRenderMode);
        if (isChecked) {
            if (this.hideColumn.indexOf(coluid) !== -1) {
                this.hideColumn.splice(this.hideColumn.indexOf(coluid), 1);
            }
            if (this.showColumn.indexOf(coluid) === -1 && !(currentColumn && currentColumn.visible)) {
                this.showColumn.push(coluid);
            }
        } else {
            if (this.showColumn.indexOf(coluid) !== -1) {
                this.showColumn.splice(this.showColumn.indexOf(coluid), 1);
            }
            if (this.hideColumn.indexOf(coluid) === -1 && (currentColumn && currentColumn.visible)) {
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

    private columnChooserSearch(searchVal: string, check: boolean): void {
        if (check) {
            const onActionBeginArgs: ColumnChooserActionArgs = {
                requestType: 'columnChooserSearch',
                columns: this.getColumns() as Column[],
                cancel: false
            };
            this.parent.trigger(events.actionBegin, onActionBeginArgs);
            if (onActionBeginArgs.cancel) {
                return;
            }
        }
        let clearSearch: boolean = false;
        let okButton: Button;
        const buttonEle: HTMLElement = this.dlgDiv.querySelector('.e-footer-content');
        let selectedCheckbox: number = this.ulElement && this.ulElement.querySelector('.e-check') &&
        this.ulElement.querySelectorAll('.e-check:not(.e-selectall)').length;
        if (this.infiniteRenderMode) {
            selectedCheckbox = this.infiniteLoadedElement.filter((arr: HTMLElement) => arr.querySelector('.e-check')).length;
        }
        this.isInitialOpen = true;
        if (buttonEle && buttonEle.querySelector('.e-btn')) {
            okButton = (buttonEle.querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
        }
        if (searchVal === '') {
            this.removeCancelIcon();
            this.filterColumns = this.selectedColumnModels.length ? this.selectedColumnModels : this.getColumns() as Column[];
            clearSearch = true;
        } else {
            const filterColumns: Column[] = this.selectedColumnModels.length ? this.selectedColumnModels : this.getColumns() as Column[];
            this.filterColumns = new DataManager((filterColumns as Object[]) as JSON[]).executeLocal(new Query()
                .where('headerText', this.searchOperator, searchVal, true, this.parent.columnChooserSettings.ignoreAccent)) as Column[];
        }
        if (this.selectedColumnModels.length === 0 && this.sortDirection !== 'None' && !this.parent.columnChooserSettings.template) {
            this.filterColumns = this.sortColumnChooser(this.filterColumns, this.sortDirection);
        }
        if (this.infiniteRenderMode) {
            this.updateIfiniteSelectAll();
        }
        if (this.parent.columnChooserSettings.template && !this.infiniteRenderMode) {
            let TemplateElement: Element;
            const isReactCompiler: boolean = this.parent.isReact;
            if (isReactCompiler) {
                clearReactVueTemplates(this.parent, ['columnChooserTemplate']);
                TemplateElement = this.mainDiv.querySelector('.e-columnChooserTemplate');
            } else {
                this.mainDiv.querySelector('.e-columnChooserTemplate').remove();
                TemplateElement = this.parent.createElement('div', { className: 'e-columnChooserTemplate' });
                (TemplateElement as HTMLElement).style.cssText = this.parent.enableAdaptiveUI ?
                    'height: 90%; min-height: 160px; overflow-y: auto;' : 'height: 196px; overflow-y: auto;';
            }
            const TemplateID: string = this.parent.element.id + 'columnChooserTemplate';
            const chooserColumns: Column[] = this.filterColumns;
            const searchedValue: string = searchVal;
            const showColumns: string[] = [];
            const hideColumns: string[] = [];
            chooserColumns.forEach((column: Column) => {
                if (column.visible) {
                    showColumns.push(column.headerText);
                } else {
                    hideColumns.push(column.headerText);
                }
            });
            const argsData: Object = {
                columns: chooserColumns,
                hideColumns: hideColumns,
                showColumns: showColumns,
                searchValue: searchedValue
            };
            if (isReactCompiler) {
                this.parent.getColumnChooserTemplate()(argsData, this.parent, 'columnChooserTemplate', TemplateID, null, null, TemplateElement);
                this.parent.renderTemplates();
            } else {
                appendChildren(TemplateElement, this.parent.getColumnChooserTemplate()(
                    argsData, this.parent, 'columnChooserTemplate', TemplateID, null, null, null, this.parent.root));
            }
            if (this.parent.columnChooserSettings.renderCustomColumnChooser) {
                if (typeof this.parent.columnChooserSettings.renderCustomColumnChooser === 'function') {
                    this.parent.columnChooserSettings.renderCustomColumnChooser(TemplateElement, this.filterColumns);
                } else if (typeof this.parent.columnChooserSettings.renderCustomColumnChooser === 'string') {
                    this.parent.columnChooserSettings.renderCustomColumnChooser =
                        getObject(this.parent.columnChooserSettings.renderCustomColumnChooser, window);
                    (this.parent.columnChooserSettings.renderCustomColumnChooser as Function)(TemplateElement, this.filterColumns);
                }
            }
            this.mainDiv.appendChild(TemplateElement);
        } else if (this.filterColumns.length) {
            this.innerDiv.innerHTML = ' ';
            this.innerDiv.classList.remove('e-ccnmdiv');
            this.infiniteInitialLoad = true;
            this.infiniteLoadedElement = [];
            this.innerDiv.appendChild(<HTMLElement>this.refreshCheckboxList(this.filterColumns));
            if (this.infiniteRenderMode) {
                this.mainDiv.querySelector('.e-ccheck .e-selectall').parentElement.classList.remove('e-checkbox-disabled');
                this.updateIntermediateBtn();
            }
            if (!clearSearch) {
                this.addcancelIcon();
                this.refreshCheckboxButton();
            } else {
                if (okButton && selectedCheckbox) { okButton.disabled = false; }
                if (selectedCheckbox && this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                    this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: false });
                }
            }
        } else {
            const nMatchele: HTMLElement = this.parent.createElement('span', { className: 'e-cc e-nmatch' });
            nMatchele.innerHTML = this.l10n.getConstant('Matchs');
            this.innerDiv.innerHTML = ' ';
            if (this.infiniteRenderMode) {
                removeClass([this.mainDiv.querySelector('.e-frame.e-selectall')], ['e-check', 'e-stop', 'e-uncheck']);
                this.mainDiv.querySelector('.e-ccheck .e-selectall').parentElement.classList.add('e-checkbox-disabled');
            }
            this.innerDiv.appendChild(nMatchele);
            this.innerDiv.classList.add('e-ccnmdiv');
            if (okButton) { okButton.disabled = true; }
            if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: true });
            }
        }
        this.flag = true;
        this.stopTimer();
        if (check) {
            const onActionCompleteArgs: ColumnChooserActionArgs = {
                requestType: 'columnChooserSearch',
                columns: this.getColumns() as Column[],
                cancel: false
            };
            this.parent.trigger(events.actionComplete, onActionCompleteArgs);
        }
    }

    private sortColumnChooser(columns: Column[], order: string): Column[] {
        if (order === 'Ascending') {
            return [...columns].sort((reference: Column, comparer: Column) =>
                reference.field.toLowerCase() < comparer.field.toLowerCase() ? -1 : 1
            );
        } else if (order === 'Descending') {
            return [...columns].sort((reference: Column, comparer: Column) =>
                reference.field.toLowerCase() > comparer.field.toLowerCase() ? -1 : 1
            );
        } else {
            return columns;
        }
    }

    private updateIfiniteSelectAll(): void {
        this.changedColumns = [];
        this.hideColumn = [];
        this.showColumn = [];
        const unCheckItem: HTMLElement[] = this.infiniteLoadedElement.filter((arr: HTMLElement) => arr.querySelector('.e-uncheck'));
        for (let i: number = 0; i < unCheckItem.length; i++) {
            this.checkState(unCheckItem[parseInt(i.toString(), 10)].querySelector('.e-frame'), true);
        }
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
        if (this.parent.columnChooserSettings.template && !this.infiniteRenderMode) {
            return;
        }
        let checkstate: boolean;
        const selectAllElement: Element = parentsUntil(e.target as Element, 'e-checkbox-wrapper');
        const columns: Column[] = this.infiniteRenderMode ? this.infiniteColumns : this.parent.getColumns();
        if (selectAllElement) {
            const selectAll: Element = selectAllElement.querySelector('.e-selectall');
            if (selectAll) {
                this.updateSelectAll(!selectAllElement.querySelector('.e-check'));
            } else  {
                toogleCheckbox(selectAllElement.parentElement);
            }
            (selectAllElement.querySelector('.e-chk-hidden') as HTMLElement).focus();
            if (selectAllElement.querySelector('.e-check')) {
                checkstate = true;
            } else if (selectAllElement.querySelector('.e-uncheck')) {
                checkstate = false;
            }
            if (!this.infiniteRenderMode) {
                this.updateIntermediateBtn();
            }
            const columnUid: string = parentsUntil(selectAllElement, 'e-ccheck').getAttribute('data-uid');
            const column: Column[] =  (this.searchValue && this.searchValue.length) || this.selectedColumnModels.length ?
                this.filterColumns : columns;
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
            const isSelectAll: boolean = this.infiniteRenderMode && selectAllElement.querySelector('.e-selectall') &&
                selectAllElement.querySelector('.e-uncheck') ? true : false;
            if (!this.parent.columnChooserSettings.footerTemplate) {
                this.refreshCheckboxButton(isSelectAll);
            }
            this.setFocus(parentsUntil(e.target as Element, 'e-cclist'));
            if (this.infiniteRenderMode) {
                this.updateIntermediateBtn();
            }
        }
    }

    private updateIntermediateBtn(): void {
        const count: number = this.infiniteRenderMode ? this.infiniteLoadedElement.length : this.ulElement.children.length - 1;
        let className: string[] = [];
        let hideColumnsCount: number = 0;
        let showColumnsCount: number = 0;
        ((this.searchValue && this.searchValue.length) || this.sortDirection !== 'None' ?
            this.filterColumns : this.infiniteColumns).filter((column: Column) => {
            if (column.visible === false) {
                hideColumnsCount++;
            } else {
                showColumnsCount++;
            }
        });
        const selectAllElement: Element =  (this.infiniteRenderMode && this.mainDiv.querySelector('.e-cc-selectall') ?
            this.mainDiv.querySelector('.e-cc-selectall') : this.ulElement.children[0]).querySelector('.e-frame');
        const selected: number = this.infiniteRenderMode ? this.infiniteLoadedElement.filter(
            (arr: HTMLElement) => arr.querySelector('.e-check')).length : this.ulElement.querySelectorAll('.e-check:not(.e-selectall)').length;
        let btn: Button;
        if (!this.parent.enableAdaptiveUI && !this.parent.columnChooserSettings.footerTemplate) {
            btn = (<{ btnObj?: Button }>(this.dlgObj as DialogModel)).btnObj[0];
            btn.disabled = false;
        } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
            this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: false });
        }
        const inputElem: HTMLInputElement = selectAllElement.parentElement.querySelector('input');
        if (count === selected && (!this.infiniteRenderMode || (this.infiniteRenderMode &&
            hideColumnsCount === this.showColumn.length))) {
            className = ['e-check'];
            setChecked(inputElem, true);
        } else if (selected || (this.infiniteRenderMode && !selected && showColumnsCount !== this.hideColumn.length)) {
            className = ['e-stop'];
            inputElem.indeterminate = true;
        } else {
            className = ['e-uncheck'];
            setChecked(inputElem, false);
            if (btn && !this.parent.enableAdaptiveUI) {
                btn.disabled = true;
            } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
                this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: true });
            }
        }
        if (btn && !this.parent.enableAdaptiveUI) {
            btn.dataBind();
        }
        removeClass([selectAllElement], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([selectAllElement], className);
    }

    private updateSelectAll(checked: boolean): void {
        let checkBoxItems: Element[] = [].slice.call(this.ulElement.getElementsByClassName('e-frame'));
        if (this.infiniteRenderMode) {
            checkBoxItems = [];
            this.infiniteLoadedElement.map((arr: HTMLElement) => checkBoxItems.push(arr.querySelector('.e-frame')));
            checkBoxItems.unshift(this.mainDiv.querySelector('.e-cc-selectall').querySelector('.e-frame'));
        }
        for (const checkBoxItem of checkBoxItems) {
            removeAddCboxClasses(checkBoxItem, checked);
            const cBoxInput: HTMLInputElement = checkBoxItem.parentElement.querySelector('input');
            if (checkBoxItem.classList.contains('e-check')) {
                setChecked(cBoxInput, true);
            }
            else if (checkBoxItem.classList.contains('e-uncheck')) {
                setChecked(cBoxInput, false);
            }
        }
    }

    private refreshCheckboxButton(checkstate?: boolean): void {
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
        let selected: number = this.showColumn.length !== 0 ? 1 : this.prevShowedCols.length;
        if (this.infiniteRenderMode) {
            selected = this.infiniteLoadedElement.filter((arr: HTMLElement) => arr.querySelector('.e-uncheck')).length;
        }
        let btn: Button;
        if (!this.parent.enableAdaptiveUI) {
            btn = (this.dlgDiv.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
            btn.disabled = false;
        } else if (this.parent.enableAdaptiveUI && this.responsiveDialogRenderer) {
            this.parent.notify(events.refreshCustomFilterOkBtn, { disabled: false });
        }
        const sreachShowColumns: string[] = [];
        const searchData: NodeListOf<HTMLInputElement> = [].slice.call(document.getElementsByClassName('e-cc-chbox'));
        for (let i: number = 0, itemsLen: number = searchData.length; i < itemsLen; i++) {
            const element: HTMLInputElement = searchData[parseInt(i.toString(), 10)] as HTMLInputElement;
            if (this.infiniteRenderMode && element.classList.contains('e-selectall')) {
                continue;
            }
            const columnUID: string = parentsUntil(element, 'e-ccheck').getAttribute('data-uid');
            sreachShowColumns.push(columnUID);
        }
        const hideColumns: string[] = this.showColumn.filter((column: string) => sreachShowColumns.indexOf(column) !== -1);
        if ((this.infiniteRenderMode && (checkstate || sreachShowColumns.length === selected)) ||
            (!this.infiniteRenderMode && selected === 0 && hideColumns.length === 0)) {
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

    private refreshCheckboxList(chooserColumns: Column[]): HTMLElement {
        this.ulElement = this.parent.createElement('ul', { className: 'e-ccul-ele e-cc' });
        const selectAllValue: string = this.l10n.getConstant('SelectAll');
        const columnChooserList: HTMLElement = this.parent.createElement('li', { className: 'e-cclist e-cc e-cc-selectall' });
        updateCSSText(columnChooserList, this.infiniteRenderMode ? 'list-style: None;' : '');
        const selectAll: Element = this.createCheckBox(selectAllValue, false, this.parent.element.id + '-selectAll');
        if (chooserColumns.length) {
            selectAll.querySelector('.e-checkbox-wrapper').firstElementChild.classList.add('e-selectall');
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            this.checkState(selectAll.querySelector('.e-icons'), true);
            columnChooserList.appendChild(selectAll);
            if (this.infiniteRenderMode) {
                if (this.mainDiv.querySelector('.e-cc-contentdiv') && !this.mainDiv.querySelector('.e-cc-selectall')) {
                    this.infiniteDiv = this.mainDiv.querySelector('.e-cc-contentdiv');
                    this.mainDiv.insertBefore(columnChooserList, this.infiniteDiv);
                    this.infiniteDiv.classList.add('e-checkbox-infinitescroll');
                    EventHandler.add(this.infiniteDiv, 'scroll', this.infiniteScrollHandler, this);
                    EventHandler.add(this.infiniteDiv, 'mouseup', this.infiniteScrollMouseKeyUpHandler, this);
                    EventHandler.add(this.infiniteDiv, 'mousedown', this.infiniteScrollMouseKeyDownHandler, this);
                }
            } else {
                this.ulElement.appendChild(columnChooserList);
            }
        }
        if (this.parent.cssClass) {
            if (this.parent.cssClass.indexOf(' ') !== -1) {
                addClass([selectAll], this.parent.cssClass.split(' '));
            } else {
                addClass([selectAll], [this.parent.cssClass]);
            }
        }
        if (this.infiniteRenderMode && chooserColumns.length > (this.itemsCount * 3)) {
            this.infiniteSkipCount = this.itemsCount * 2;
        }
        this.renderCheckbox(chooserColumns.slice(0, this.infiniteRenderMode ? this.itemsCount * 3 : chooserColumns.length));
        return this.ulElement;
    }

    private infiniteScrollMouseKeyDownHandler(): void {
        EventHandler.remove(this.infiniteDiv, 'scroll', this.infiniteScrollHandler);
    }

    private infiniteScrollMouseKeyUpHandler(e: MouseEvent): void {
        EventHandler.add(this.infiniteDiv, 'scroll', this.infiniteScrollHandler, this);
        const target: HTMLElement = this.infiniteDiv;
        if (this.ulElement.children.length > 1 && (target.scrollTop >= target.scrollHeight - target.offsetHeight ||
            target.scrollTop <= 0)) {
            this.infiniteScrollHandler();
        }
        Global.timer = (setTimeout(() => { this.clickHandler(e); Global.timer = null; }, 0) as Object);
    }


    private infiniteScrollHandler(): void {
        const target: HTMLElement = this.infiniteDiv;
        const columns: Column[] = (this.searchValue && this.searchValue.length) || this.sortDirection !== 'None' ?
            this.filterColumns : this.infiniteColumns;
        if (target.scrollTop >= target.scrollHeight - target.offsetHeight
            && this.infiniteLoadedElement.length <= (this.infiniteSkipCount + this.itemsCount)
            && this.ulElement.children.length === this.itemsCount * 3
            && (!columns.length || columns.length > (this.infiniteSkipCount + this.itemsCount))) {
            const diffcount: number = columns.length - (this.infiniteSkipCount + this.itemsCount);
            let count: number = 0;
            if (diffcount < this.itemsCount) {
                count = diffcount;
            }
            infiniteRemoveElements(([].slice.call(this.ulElement.children)).splice(0, this.itemsCount));
            this.infiniteInitialLoad = true;
            this.infiniteSkipCount += this.itemsCount;
            this.renderCheckbox(columns.slice(this.infiniteSkipCount, this.infiniteSkipCount + (count + this.itemsCount)));
            this.prevInfiniteScrollDirection = 'down';
        } else if (target.scrollTop >= target.scrollHeight - target.offsetHeight && this.infiniteLoadedElement.length > (
            this.infiniteSkipCount + this.itemsCount) && this.ulElement.children.length === this.itemsCount * 3) {
            infiniteRemoveElements(([].slice.call(this.ulElement.children)).splice(0, this.itemsCount));
            this.infiniteSkipCount += this.prevInfiniteScrollDirection === 'down' ? this.itemsCount :
                (this.itemsCount * 3);
            appendChildren(this.ulElement, this.infiniteLoadedElement.slice(this.infiniteSkipCount, this.itemsCount +
                this.infiniteSkipCount));
            this.prevInfiniteScrollDirection = 'down';
        } else if (target.scrollTop === 0 && !this.infiniteInitialLoad && this.infiniteSkipCount
            && this.infiniteLoadedElement.length && this.infiniteLoadedElement.length > this.itemsCount * 3
            && this.ulElement.children.length === this.itemsCount * 3) {
            infiniteRemoveElements(([].slice.call(this.ulElement.children)).splice(this.itemsCount * 2, this.itemsCount));
            this.infiniteSkipCount -= this.prevInfiniteScrollDirection === 'up' ? this.itemsCount : this.itemsCount * 3;
            infiniteAppendElements([].slice.call(this.infiniteLoadedElement.slice(this.infiniteSkipCount, this.infiniteSkipCount +
                this.itemsCount)), this.ulElement);
            this.prevInfiniteScrollDirection = 'up';
            this.infiniteDiv.scrollTop = this.infiniteScrollAppendDiff;
        } else if (target.scrollTop === 0 && !this.infiniteInitialLoad && this.infiniteSkipCount &&
            (this.infiniteSkipCount > this.itemsCount * 2) && this.infiniteLoadedElement.length &&
            this.ulElement.children.length < this.itemsCount * 3) {
            infiniteRemoveElements(([].slice.call(this.ulElement.children)).splice(
                (this.itemsCount * 2), columns.length % this.itemsCount));
            this.infiniteSkipCount = (Math.floor(columns.length / this.itemsCount) - 3) *
                this.itemsCount;
            infiniteAppendElements([].slice.call(this.infiniteLoadedElement.slice(this.infiniteSkipCount, this.infiniteSkipCount +
                this.itemsCount)), this.ulElement);
            this.infiniteDiv.scrollTop = this.infiniteScrollAppendDiff;
            this.prevInfiniteScrollDirection = 'up';
        }
    }

    private refreshCheckboxState(): void {
        if (!this.parent.columnChooserSettings.enableSearching && !this.selectedColumnModels.length && this.sortDirection === 'None') {
            return;
        }
        (<HTMLInputElement>this.dlgObj.element.querySelector('.e-cc.e-input')).value = '';
        this.columnChooserSearch('', false);
        const gridObject: IGrid = this.parent;
        const currentCheckBoxColls: NodeListOf<Element> = this.dlgObj.element.querySelectorAll('.e-cc-chbox:not(.e-selectall)');
        for (let i: number = 0, itemLen: number = currentCheckBoxColls.length; i < itemLen; i++) {
            const element: HTMLInputElement = currentCheckBoxColls[parseInt(i.toString(), 10)] as HTMLInputElement;
            let columnUID: string;
            if (this.parent.childGrid || this.parent.detailTemplate) {
                columnUID = parentsUntil(this.dlgObj.element.querySelectorAll('.e-cc-chbox:not(.e-selectall)')[parseInt(i.toString(), 10)],
                                         'e-ccheck').getAttribute('data-uid');
            } else { columnUID = parentsUntil(element, 'e-ccheck').getAttribute('data-uid'); }
            const column: Column = gridObject.getColumnByUid(columnUID, this.infiniteRenderMode);
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

    private renderCheckbox(columns: Column[]): void {
        const checkBoxItems: HTMLElement = this.parent.createElement('div');
        const offsetHeight: number = this.ulElement.offsetHeight;
        for (let i: number = 0; i < columns.length; i++) {
            const column: Column = columns[parseInt(i.toString(), 10)];
            if (column.showInColumnChooser) {
                const columnChooserList: HTMLElement = this.parent.createElement('li', { className: 'e-cclist e-cc', id: 'e-ccli_' + column.uid });
                columnChooserList.style.listStyle = 'none';
                const hideColumnState: boolean = this.hideColumn.indexOf(column.uid) === -1 ? false : true;
                const showColumnState: boolean = this.showColumn.indexOf(column.uid) === -1 ? false : true;
                const columnchooserccheckboxlist: Element =
                    this.createCheckBox(column.headerText, (column.visible && !hideColumnState) || showColumnState, column.uid);
                columnChooserList.appendChild(columnchooserccheckboxlist);
                if (this.parent.cssClass) {
                    if (this.parent.cssClass.indexOf(' ') !== -1) {
                        addClass([columnchooserccheckboxlist], this.parent.cssClass.split(' '));
                    } else {
                        addClass([columnchooserccheckboxlist], [this.parent.cssClass]);
                    }
                }
                if (this.infiniteRenderMode && this.infiniteDiv) {
                    columnChooserList.style.height = getListHeight(this.infiniteDiv, true) + 'px';
                }
                checkBoxItems.appendChild(columnChooserList);
            }
        }
        if (this.infiniteRenderMode && this.infiniteInitialLoad) {
            this.infiniteLoadedElement.push(...[].slice.call(checkBoxItems.children));
            this.infiniteInitialLoad = false;
        }
        appendChildren(this.ulElement, [].slice.call(checkBoxItems.children));
        if (this.infiniteRenderMode && !this.infiniteScrollAppendDiff) {
            this.infiniteScrollAppendDiff = this.ulElement.offsetHeight - offsetHeight;
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
            () => { proxy.columnChooserSearch(proxy.searchValue, true); }, interval);
    }

    private stopTimer(): void {
        window.clearInterval(this.timer);
    }

    private addcancelIcon(): void {
        if (this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon')) {
            this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.add('e-cc-cancel');
            this.dlgDiv.querySelector('.e-cc-cancel').setAttribute('title', this.l10n.getConstant('Clear'));
        }
    }

    private removeCancelIcon(): void {
        if (this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon')) {
            this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').classList.remove('e-cc-cancel');
            this.dlgDiv.querySelector('.e-cc.e-ccsearch-icon').setAttribute('title', this.l10n.getConstant('Search'));
        }
    }

    private mOpenDlg(): void {
        if (Browser.isDevice) {
            if (this.dlgObj.element.querySelector('.e-cc-searchdiv')) {
                this.dlgObj.element.querySelector('.e-cc-searchdiv').classList.remove('e-input-focus');
            }
            if (<HTMLElement>this.dlgObj.element.querySelectorAll('.e-cc-chbox')[0]) {
                (<HTMLElement>this.dlgObj.element.querySelectorAll('.e-cc-chbox')[0]).focus();
            }
        }
        if (this.parent.enableAdaptiveUI) {
            if (this.dlgObj.element.querySelector('.e-cc-searchdiv')) {
                this.dlgObj.element.querySelector('.e-cc-searchdiv').classList.add('e-input-focus');
            }
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
        const args: { requestType: string, element?: Element, columns?: Column[], cancel: boolean, searchOperator: string,
            sortDirection: string, selectedColumns?: string[] } = {
            requestType: 'beforeOpenColumnChooser', element: this.parent.element,
            columns: this.getColumns() as Column[], cancel: false,
            searchOperator: this.parent.columnChooserSettings.operator,
            sortDirection: 'None',
            ...(!this.parent.enableColumnVirtualization ? { selectedColumns: [] } : {})
        };
        this.parent.trigger(events.beforeOpenColumnChooser, args);
        this.searchOperator = args.searchOperator;
        this.sortDirection = args.sortDirection;
        if (!this.parent.enableColumnVirtualization) {
            this.selectedColumns = args.selectedColumns;
        }
        return args;
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
