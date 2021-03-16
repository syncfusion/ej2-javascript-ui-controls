import { IAction, IGrid, ResponsiveDialogArgs, KeyboardEventArgs, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Dialog } from '@syncfusion/ej2-popups';
import { EventHandler, remove } from '@syncfusion/ej2-base';
import { parentsUntil, addBiggerDialog } from '../base/util';
import { Column } from '../models/column';
import * as events from '../base/constant';
import { Button } from '@syncfusion/ej2-buttons';
import { SortDirection, ResponsiveDialogAction } from '../base/enum';
import { SortDescriptorModel } from '../base/grid-model';

/**
 *
 * The `ResponsiveDialogRenderer` module is used to render the responsive dialogs.
 */
export class ResponsiveDialogRenderer implements IAction {
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private customResponsiveDlg: Dialog;
    private customFilterDlg: Dialog;
    private customColumnDiv: HTMLDivElement;
    private filterParent: HTMLElement;
    private customExcelFilterParent: HTMLElement;
    private sortedCols: string[] = [];
    private isSortApplied: boolean;
    private filterClearBtn: Button;
    private saveBtn: Button;
    private backBtn: Button;
    private sortPredicate: SortDescriptorModel[] = [];
    private filteredCol: Column;
    private isCustomDlgRender: boolean;
    private isFiltered: boolean;
    private isRowResponsive: boolean;
    private isDialogClose: boolean;
    private onActionCompleteFn: Function;
    public action: ResponsiveDialogAction;

    /**
     * Constructor for Grid Responsive dialog renderer
     * @hidden
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on(events.filterDialogClose, this.closeCustomDialog, this);
        this.parent.on(events.setCustomFilterHeader, this.setCustomFilterHeader, this);
        this.parent.on(events.refreshCustomFilterOkBtn, this.refreshCustomFilterOkBtn, this);
        this.parent.on(events.renderResponsiveCmenu, this.renderResponsiveContextMenu, this);
        this.parent.on(events.filterCmenuSelect, this.renderCustomFilterDiv, this);
        this.parent.on(events.customFilterClose, this.customExFilterClose, this);
        this.parent.on(events.refreshCustomFilterClearBtn, this.refreshCustomFilterClearBtn, this);
        this.onActionCompleteFn = this.editComplate.bind(this);
        this.parent.addEventListener(events.actionComplete, this.onActionCompleteFn);
    }

    private customExFilterClose(): void {
        this.isCustomDlgRender = false;
    }

    private renderCustomFilterDiv(): void {
        let header: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-header-content');
        let title: HTMLElement = header.querySelector('.e-dlg-custom-header');
        let closeBtn: HTMLElement = header.querySelector('.e-dlg-closeicon-btn');
        this.isCustomDlgRender = true;
        this.parent.filterModule.filterModule.closeDialog();
        this.saveBtn.element.style.display = '';
        this.refreshCustomFilterOkBtn({ disabled: false });
        this.backBtn.element.style.display = 'none';
        closeBtn.style.display = '';
        title.innerHTML = this.parent.localeObj.getConstant('CustomFilter');
        let content: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-content');
        this.customExcelFilterParent = this.parent.createElement('div', { className: 'e-xl-customfilterdiv e-default-filter' });
        content.appendChild(this.customExcelFilterParent);
    }

    private renderResponsiveContextMenu(args: { target: HTMLElement, header: string, isOpen: boolean }): void {
        if (this.action === ResponsiveDialogAction.isFilter) {
            let content: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-content');
            let header: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-header-content');
            let closeBtn: HTMLElement = header.querySelector('.e-dlg-closeicon-btn');
            let text: HTMLElement = header.querySelector('.e-dlg-custom-header');
            if (args.isOpen) {
                (content.firstChild as HTMLElement).style.display = 'none';
                content.appendChild(args.target);
                closeBtn.style.display = 'none';
                this.saveBtn.element.style.display = 'none';
                this.filterClearBtn.element.style.display = 'none';
                text.innerHTML = args.header;
                let backBtn: HTMLElement = this.parent.createElement('button');
                let span: HTMLElement = this.parent.createElement('span', { className: 'e-btn-icon e-resfilterback e-icons' });
                backBtn.appendChild(span);
                this.backBtn = new Button({
                    cssClass: 'e-res-back-btn'
                });
                this.backBtn.appendTo(backBtn);
                text.parentElement.insertBefore(backBtn, text);
            } else if (this.backBtn && !this.isCustomDlgRender) {
                (content.firstChild as HTMLElement).style.display = '';
                remove(this.backBtn.element);
                closeBtn.style.display = '';
                this.saveBtn.element.style.display = '';
                if (this.isFiltered) {
                    this.filterClearBtn.element.style.display = '';
                }
                text.innerHTML = this.getHeaderTitle({ action: ResponsiveDialogAction.isFilter });
            }
        }
    }

    private refreshCustomFilterClearBtn(args: { isFiltered: boolean }): void {
        if (this.filterClearBtn) {
            this.isFiltered = args.isFiltered;
            this.filterClearBtn.element.style.display = args.isFiltered ? '' : 'none';
        }
    }

    private refreshCustomFilterOkBtn(args: { disabled: boolean }): void {
        if (this.saveBtn) {
            this.saveBtn.disabled = args.disabled;
        }
    }

    private renderResponsiveContent(col?: Column): HTMLElement {
        let gObj: IGrid = this.parent;
        if (col) {
            this.filterParent = this.parent.createElement(
                'div',
                { className: 'e-mainfilterdiv e-default-filter', id: col.uid + '-main-filter' }
            );
            return this.filterParent;
        } else {
            let cols: Column[] = gObj.getColumns();
            this.customColumnDiv = gObj.createElement('div', { className: 'columndiv', styles: 'width: 100%' });
            let sortBtnParent: HTMLElement = gObj.createElement('div', { className: 'e-ressortbutton-parent' });
            let filteredCols: string[] = [];
            if (this.action === ResponsiveDialogAction.isFilter) {
                for (let i: number = 0; i < gObj.filterSettings.columns.length; i++) {
                    filteredCols.push(gObj.filterSettings.columns[i].field);
                }
            }
            for (let i: number = 0; i < cols.length; i++) {
                let cDiv: HTMLElement = gObj.createElement('div', { className: 'e-responsivecoldiv' });
                cDiv.setAttribute('data-e-mappingname', cols[i].field);
                cDiv.setAttribute('data-e-mappinguid', cols[i].uid);
                let span: HTMLElement = gObj.createElement('span', { innerHTML: cols[i].headerText, className: 'e-res-header-text' });
                cDiv.appendChild(span);
                this.customColumnDiv.appendChild(cDiv);
                if (this.action === ResponsiveDialogAction.isSort) {
                    let fields: string[] = this.getSortedFieldsAndDirections('field');
                    let index: number = fields.indexOf(cols[i].field);
                    let button: HTMLElement = gObj.createElement('button', { id: gObj.element.id + cols[i].field + 'sortbutton' });
                    let clone: Element = sortBtnParent.cloneNode() as Element;
                    clone.appendChild(button);
                    cDiv.appendChild(clone);
                    let btnObj: Button = new Button({
                        cssClass: 'e-ressortbutton'
                    });
                    btnObj.appendTo(button);
                    button.innerHTML = index > -1 ? this.parent.sortSettings.columns[index].direction : 'None';
                    button.onclick = (e: MouseEvent) => {
                        this.sortButtonClickHandler(e.target as Element);
                    };
                }
                if (this.action === ResponsiveDialogAction.isFilter && filteredCols.indexOf(cols[i].field) > -1) {
                    let divIcon: HTMLElement = gObj.createElement('div', { className: 'e-icons e-res-icon e-filtersetdiv' });
                    let iconSpan: HTMLElement = gObj.createElement('span', { className: 'e-icons e-res-icon e-filterset' });
                    iconSpan.setAttribute('colType', cols[i].type);
                    divIcon.appendChild(iconSpan);
                    cDiv.appendChild(divIcon);
                }
            }
            EventHandler.add(this.customColumnDiv, 'click', this.customFilterColumnClickHandler, this);
            return this.customColumnDiv;
        }
    }

    private getSortedFieldsAndDirections(name: string): string[] {
        let fields: string[] = [];
        for (let i: number = 0; i < this.parent.sortSettings.columns.length; i++) {
            fields.push(this.parent.sortSettings.columns[i][name]);
        }
        return fields;
    }

    private sortButtonClickHandler(target: Element): void {
        if (target) {
            let columndiv: Element = parentsUntil(target as Element, 'e-responsivecoldiv');
            let field: string = columndiv.getAttribute('data-e-mappingname');
            if (!this.parent.allowMultiSorting) {
                this.sortPredicate = []; this.sortedCols = []; this.isSortApplied = false;
                this.resetSortButtons(target);
            }
            let txt: string = target.textContent;
            let direction: string = txt === 'None' ? 'Ascending' : txt === 'Ascending' ? 'Descending' : 'None';
            target.innerHTML = direction;
            this.setSortedCols(field, direction);
        }
    }

    private resetSortButtons(target?: Element): void {
        let buttons: HTMLElement[] = [].slice.call(this.customColumnDiv.querySelectorAll('.e-ressortbutton'));
        for (let i: number = 0; i < buttons.length; i++) {
            if (buttons[i] !== target) {
                buttons[i].innerHTML = 'None';
            }
        }
    }

    private setSortedCols(field: string, direction: string): void {
        let fields: string[] = this.getCurrentSortedFields();
        let index: number = fields.indexOf(field);
        if (this.parent.allowMultiSorting && index > -1) {
            this.sortedCols.splice(index, 1);
            this.sortPredicate.splice(index, 1);
        }
        this.isSortApplied = true;
        if (direction !== 'None') {
            this.sortedCols.push(field);
            this.sortPredicate.push({ field: field, direction: direction as SortDirection });
        }
    }

    private getCurrentSortedFields(): string[] {
        let fields: string[] = [];
        for (let i: number = 0; i < this.sortedCols.length; i++) {
            fields.push(this.sortedCols[i]);
        }
        return fields;
    }

    private customFilterColumnClickHandler(e: MouseEvent): void {
        if (this.action !== ResponsiveDialogAction.isFilter) { return; }
        let gObj: IGrid = this.parent;
        let target: HTMLElement = e.target as HTMLElement;
        if (gObj.filterSettings.type !== 'FilterBar') {
            if (target.classList.contains('e-responsivecoldiv') || target.parentElement.classList.contains('e-responsivecoldiv')) {
                let field: string = target.getAttribute('data-e-mappingname');
                if (!field) { field = target.parentElement.getAttribute('data-e-mappingname'); }
                if (field) {
                    let col: Column = gObj.getColumnByField(field);
                    this.isRowResponsive = true;
                    this.showResponsiveDialog(col);
                }
            } else if (target.classList.contains('e-filterset') || target.parentElement.classList.contains('e-filtersetdiv')) {
                let colDiv: Element = parentsUntil(target, 'e-responsivecoldiv');
                if (colDiv) {
                    let field: string = colDiv.getAttribute('data-e-mappingname');
                    let col: Column = gObj.getColumnByField(field);
                    if (col.filter.type === 'Menu' || (!col.filter.type && gObj.filterSettings.type === 'Menu')) {
                        this.isDialogClose = true;
                    }
                    this.parent.filterModule.filterModule.clearCustomFilter(col);
                    this.removeCustomDlgFilterEle(target);
                }
            }
        }
    }

    /** 
     * To show the responsive custom filter dialog
     * @return {void}
     * @hidden
     */
    public showResponsiveDialog(col?: Column): void {
        if (this.parent.rowRenderingMode === 'Vertical' && this.action === ResponsiveDialogAction.isFilter && !this.isRowResponsive) {
            this.renderCustomFilterDialog();
            this.customFilterDlg.show(true);
            this.customFilterDlg.element.style.maxHeight = '100%';
        } else {
            this.filteredCol = col;
            this.renderResponsiveDialog(col);
            if (this.parent.enableAdaptiveUI && col) {
                this.parent.filterModule.setFilterModel(col);
                this.parent.filterModule.filterModule.openDialog(this.parent.filterModule.createOptions(col, undefined));
            }
            this.customResponsiveDlg.show(true);
            this.customResponsiveDlg.element.style.maxHeight = '100%';
            this.setTopToChildDialog(this.customResponsiveDlg.element);
        }
    }

    private setTopToChildDialog(dialogEle: Element): void {
        let child: HTMLElement = dialogEle.querySelector('.e-dialog');
        if (child) {
            let top: number = dialogEle.querySelector('.e-dlg-header-content').getBoundingClientRect().height;
            child.style.top = top + 'px';
        }
    }

    private renderCustomFilterDialog(col?: Column): void {
        let gObj: IGrid = this.parent;
        if (this.action === ResponsiveDialogAction.isFilter && gObj.filterSettings.type === 'FilterBar') { return; }
        let outerDiv: HTMLElement = this.parent.createElement(
            'div',
            {
                id: gObj.element.id + 'customfilter', className: 'e-customfilterdiv e-responsive-dialog'
            }
        );
        this.parent.element.appendChild(outerDiv);
        this.customFilterDlg = this.getDialogOptions(col, true);
        this.customFilterDlg.appendTo(outerDiv);
    }

    private getDialogOptions(col: Column, isCustomFilter: boolean, id?: string): Dialog {
        let options: Dialog = new Dialog({
            isModal: true,
            showCloseIcon: true,
            closeOnEscape: false,
            locale: this.parent.locale,
            target: this.parent.adaptiveDlgTarget ? this.parent.adaptiveDlgTarget : document.body,
            visible: false,
            enableRtl: this.parent.enableRtl,
            content: this.renderResponsiveContent(col),
            open: this.dialogOpen.bind(this),
            created: this.dialogCreated.bind(this),
            close: this.beforeDialogClose.bind(this),
            width: '100%',
            height: '100%',
            animationSettings: { effect: 'None' },
        });
        let isStringTemplate: string = 'isStringTemplate';
        options[isStringTemplate] = true;
        if (isCustomFilter) {
            options.header = this.renderResponsiveHeader(undefined, true);
            options.cssClass = 'e-customfilter';
        } else {
            options.header = this.renderResponsiveHeader();
            options.cssClass = this.parent.rowRenderingMode === 'Vertical' && this.action === ResponsiveDialogAction.isFilter
                ? 'e-res' + id + ' e-row-responsive-filter' : 'e-res' + id;
        }
        return options;
    }

    private renderResponsiveDialog(col?: Column): void {
        let gObj: IGrid = this.parent;
        if (this.action === ResponsiveDialogAction.isFilter && gObj.filterSettings.type === 'FilterBar') { return; }
        let id: string = this.action === ResponsiveDialogAction.isFilter ? 'filter' : 'sort';
        let outerDiv: HTMLElement = this.parent.createElement(
            'div',
            {
                id: gObj.element.id + 'responsive' + id, className: 'e-res' + id + 'div e-responsive-dialog'
            }
        );
        this.parent.element.appendChild(outerDiv);
        this.customResponsiveDlg = this.getDialogOptions(col, false, id);
        this.customResponsiveDlg.appendTo(outerDiv);
    }

    private dialogCreated(): void {
        addBiggerDialog(this.parent);
    }

    private dialogOpen(): void {
        if (this.action === ResponsiveDialogAction.isSort && this.parent.allowMultiSorting) {
            for (let i: number = 0; i < this.parent.sortSettings.columns.length; i++) {
                this.sortedCols.push(this.parent.sortSettings.columns[i].field);
                let sortField: string = this.parent.sortSettings.columns[i].field;
                let sortDirection: SortDirection = this.parent.sortSettings.columns[i].direction;
                this.sortPredicate.push({ field: sortField, direction: sortDirection });
            }
        }
    }

    private beforeDialogClose(args: { element: Element }): void {
        this.isDialogClose = args.element && !args.element.querySelector('.e-xl-customfilterdiv')
            && args.element.classList.contains('e-resfilterdiv');
        if (this.action === ResponsiveDialogAction.isFilter) {
            if (args.element.classList.contains('e-resfilterdiv')) {
                this.parent.filterModule.filterModule.closeResponsiveDialog(this.isCustomDlgRender);
            } else if (args.element.classList.contains('e-customfilterdiv')) {
                this.closeCustomFilter();
            }
        } else if (this.action === ResponsiveDialogAction.isSort) {
            this.closeCustomDialog();
        }
        this.parent.off(events.enterKeyHandler, this.keyHandler);
    }

    private sortColumn(): void {
        if (!this.isSortApplied) {
            this.closeCustomDialog();
            return;
        }
        if (this.sortPredicate.length) {
            this.parent.setProperties({ sortSettings: { columns: [] } }, true);
        }
        for (let i: number = 0; i < this.sortPredicate.length; i++) {
            this.parent.sortColumn(this.sortPredicate[i].field, this.sortPredicate[i].direction, this.parent.allowMultiSorting);
        }
        if (!this.sortPredicate.length) {
            this.parent.clearSorting();
        }
        this.closeCustomDialog();
    }

    private getHeaderTitle(args: ResponsiveDialogArgs): string {
        let gObj: IGrid = this.parent;
        let title: string;
        if (this.action === ResponsiveDialogAction.isEdit) {
            title = gObj.localeObj.getConstant('EditFormTitle') + args.primaryKeyValue[0];
        } else if (this.action === ResponsiveDialogAction.isAdd) {
            title = gObj.localeObj.getConstant('AddFormTitle');
        } else if (this.action === ResponsiveDialogAction.isFilter) {
            title = gObj.localeObj.getConstant('FilterButton');
        } else if (this.action === ResponsiveDialogAction.isSort) {
            title = gObj.localeObj.getConstant('Sort');
        }
        return title;
    }

    private getDialogName(action: ResponsiveDialogAction): string {
        let name: string;
        if (action === ResponsiveDialogAction.isAdd || action === ResponsiveDialogAction.isEdit) {
            name = 'dialogEdit_wrapper_title';
        } else if (action === ResponsiveDialogAction.isFilter) {
            name = 'responsive_filter_dialog_wrapper';
        }
        return name;
    }

    private getButtonText(action: ResponsiveDialogAction): string {
        let text: string;
        if (action === ResponsiveDialogAction.isAdd || action === ResponsiveDialogAction.isEdit) {
            text = 'Save';
        } else if (action === ResponsiveDialogAction.isFilter || this.action === ResponsiveDialogAction.isSort) {
            text = 'OKButton';
        }
        return text;
    }

    /** @hidden */
    public renderResponsiveHeader(args?: ResponsiveDialogArgs, isCustomFilter?: boolean): HTMLElement | string {
        let gObj: IGrid = this.parent;
        gObj.on(events.enterKeyHandler, this.keyHandler, this);
        let id: string = gObj.element.id + this.getDialogName(this.action);
        let header: HTMLElement | string = gObj.createElement('div', { className: 'e-res-custom-element' });
        let titleDiv: HTMLElement = gObj.createElement('div', { className: 'e-dlg-custom-header', id: id });
        titleDiv.innerHTML = this.getHeaderTitle(args);
        (header as Element).appendChild(titleDiv);
        let saveBtn: HTMLElement = gObj.createElement('button');
        if (!isCustomFilter) {
            this.saveBtn = new Button({
                cssClass: 'e-primary e-flat e-res-apply-btn',
            });
            saveBtn.innerHTML = gObj.localeObj.getConstant(this.getButtonText(this.action));
            this.saveBtn.appendTo(saveBtn);
            saveBtn.onclick = (e: MouseEvent) => {
                this.dialogHdrBtnClickHandler();
            };
        }
        let isSort: boolean = this.action === ResponsiveDialogAction.isSort;
        let isFilter: boolean = this.action === ResponsiveDialogAction.isFilter;
        if (isFilter || isSort) {
            let id: string = isSort ? 'sort' : 'filter';
            let clearBtn: HTMLElement = gObj.createElement('button');
            this.filterClearBtn = new Button({
                cssClass: 'e-primary e-flat e-res-' + id + '-clear-btn',
            });
            if (isFilter) {
                let span: HTMLElement = gObj.createElement('span', { className: 'e-btn-icon e-icon-filter-clear e-icons' });
                clearBtn.appendChild(span);
            } else {
                clearBtn.innerHTML = gObj.localeObj.getConstant('Clear');
            }
            (header as Element).appendChild(clearBtn);
            this.filterClearBtn.appendTo(clearBtn);
            clearBtn.onclick = (e: MouseEvent) => {
                if ((parentsUntil(e.target as HTMLElement, 'e-customfilter'))) {
                    this.parent.filterModule.clearFiltering();
                    this.removeCustomDlgFilterEle();
                } else {
                    if (isFilter) {
                        this.filterClear();
                    } else {
                        this.resetSortButtons();
                        this.sortedCols = [];
                        this.sortPredicate = [];
                        this.isSortApplied = true;
                    }
                }
            };
            (header as Element).appendChild(clearBtn);
        }
        if (!isCustomFilter) {
            (header as Element).appendChild(saveBtn);
        }
        return header;
    }

    private filterClear(): void {
        this.parent.filterModule.filterModule.clearCustomFilter(this.filteredCol);
        this.parent.filterModule.filterModule.closeResponsiveDialog();
    }

    private dialogHdrBtnClickHandler(): void {
        if (this.action === ResponsiveDialogAction.isEdit || this.action === ResponsiveDialogAction.isAdd) {
            this.parent.endEdit();
        } else if (this.action === ResponsiveDialogAction.isFilter) {
            this.parent.filterModule.filterModule.applyCustomFilter({ col: this.filteredCol, isCustomFilter: this.isCustomDlgRender });
        } else if (this.action === ResponsiveDialogAction.isSort) {
            this.sortColumn();
        }
    }

    private closeCustomDialog(): void {
        if (this.isCustomDlgRender) {
            let mainfilterdiv: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-mainfilterdiv');
            remove(mainfilterdiv);
            return;
        }
        this.isRowResponsive = false;
        this.isCustomDlgRender = false;
        this.destroyCustomFilterDialog();
    }

    private destroyCustomFilterDialog(): void {
        if (!this.customResponsiveDlg) { return; }
        let elem: Element = document.getElementById(this.customResponsiveDlg.element.id);
        if (this.customResponsiveDlg && !this.customResponsiveDlg.isDestroyed && elem) {
            this.customResponsiveDlg.destroy();
            remove(elem);
        }
        this.closeCustomFilter();
        if (this.action === ResponsiveDialogAction.isSort) {
            this.sortPredicate = [];
            this.sortedCols = [];
            this.isSortApplied = false;
        }
    }

    private closeCustomFilter(): void {
        if (!this.isDialogClose && this.customFilterDlg) {
            let customEle: Element = document.getElementById(this.customFilterDlg.element.id);
            if (this.customFilterDlg && !this.customFilterDlg.isDestroyed && customEle) {
                this.customFilterDlg.destroy();
                remove(customEle);
            }
        }
        this.isDialogClose = false;
    }

    private removeCustomDlgFilterEle(target?: Element): void {
        if (target) {
            if (target.parentElement.classList.contains('e-filtersetdiv')) {
                remove(target.parentElement);
            } else {
                remove(target);
            }
        } else {
            let child: HTMLCollection = this.customColumnDiv.children;
            for (let i: number = 0; i < child.length; i++) {
                target = child[i].querySelector('.e-filtersetdiv');
                if (target) {
                    remove(target);
                    i--;
                }
            }
        }
    }

    private setCustomFilterHeader(args: { title: string }): void {
        if (this.parent.rowRenderingMode !== 'Vertical') {
            return;
        }
        let header: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-reslabel');
        if (header && header.firstElementChild) {
            header.firstElementChild.innerHTML = args.title;
        }
    }

    private keyHandler(e: KeyboardEventArgs): void {
        if (e.keyCode === 13 && ((this.action === ResponsiveDialogAction.isFilter
            && (e.target as HTMLElement).classList.contains('e-searchinput'))
            || (this.action === ResponsiveDialogAction.isEdit || this.action === ResponsiveDialogAction.isAdd))) {
            this.dialogHdrBtnClickHandler();
        }
    }

    private editComplate(args: NotifyArgs): void {
        if (args.requestType === 'save' || args.requestType === 'cancel') {
            this.parent.off(events.enterKeyHandler, this.keyHandler);
        }
    }

    public removeEventListener(): void {
        if (this.customColumnDiv) {
            EventHandler.remove(this.customColumnDiv, 'click', this.customFilterColumnClickHandler);
        }
        this.parent.off(events.filterDialogClose, this.closeCustomDialog);
        this.parent.off(events.setCustomFilterHeader, this.setCustomFilterHeader);
        this.parent.off(events.refreshCustomFilterOkBtn, this.refreshCustomFilterOkBtn);
        this.parent.off(events.renderResponsiveCmenu, this.renderResponsiveContextMenu);
        this.parent.off(events.filterCmenuSelect, this.renderCustomFilterDiv);
        this.parent.off(events.customFilterClose, this.customExFilterClose);
        this.parent.off(events.refreshCustomFilterClearBtn, this.refreshCustomFilterClearBtn);
        this.parent.removeEventListener(events.actionComplete, this.onActionCompleteFn);
    }
}