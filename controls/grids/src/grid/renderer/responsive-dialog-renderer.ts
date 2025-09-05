import { IAction, IGrid, ResponsiveDialogArgs, KeyboardEventArgs, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Dialog } from '@syncfusion/ej2-popups';
import { EventHandler, isNullOrUndefined, remove, Browser } from '@syncfusion/ej2-base';
import { parentsUntil, addBiggerDialog, addRemoveEventListener } from '../base/util';
import { Column } from '../models/column';
import * as events from '../base/constant';
import { Button } from '@syncfusion/ej2-buttons';
import { SortDirection, ResponsiveDialogAction } from '../base/enum';
import { SortDescriptorModel } from '../base/grid-model';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';

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
    private menuCol: Column;
    private isCustomDlgRender: boolean;
    private isFiltered: boolean;
    private isRowResponsive: boolean;
    private isDialogClose: boolean;
    private onActionCompleteFn: Function;
    private evtHandlers: { event: string, handler: Function }[];

    /** @hidden */
    public action: ResponsiveDialogAction;
    /** @hidden */
    public isCustomDialog: boolean = false;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    public addEventListener(): void {
        this.evtHandlers = [{ event: events.filterDialogClose, handler: this.closeCustomDialog },
            { event: events.refreshCustomFilterOkBtn, handler: this.refreshCustomFilterOkBtn },
            { event: events.renderResponsiveCmenu, handler: this.renderResponsiveContextMenu },
            { event: events.filterCmenuSelect, handler: this.renderCustomFilterDiv },
            { event: events.customFilterClose, handler: this.customExFilterClose },
            { event: events.refreshCustomFilterClearBtn, handler: this.refreshCustomFilterClearBtn }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
        this.onActionCompleteFn = this.editComplate.bind(this);
        this.parent.addEventListener(events.actionComplete, this.onActionCompleteFn);
    }

    private customExFilterClose(): void {
        this.isCustomDlgRender = false;
    }

    private renderCustomFilterDiv(): void {
        const header: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-header-content');
        const title: HTMLElement = header.querySelector('.e-dlg-custom-header');
        const closeBtn: HTMLElement = header.querySelector('.e-dlg-closeicon-btn');
        this.isCustomDlgRender = true;
        this.parent.filterModule.filterModule.closeDialog();
        this.saveBtn.element.style.display = '';
        this.refreshCustomFilterOkBtn({ disabled: false });
        this.backBtn.element.style.display = 'none';
        closeBtn.style.display = '';
        title.innerHTML = this.parent.localeObj.getConstant('CustomFilter');
        const content: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-content');
        this.customExcelFilterParent = this.parent.createElement('div', { className: 'e-xl-customfilterdiv e-default-filter' });
        content.appendChild(this.customExcelFilterParent);
    }

    private renderResponsiveContextMenu(args: { target: HTMLElement, header: string, isOpen: boolean, col: Column }): void {
        if (this.action === ResponsiveDialogAction.isFilter) {
            const content: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-content');
            const header: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-dlg-header-content');
            const closeBtn: HTMLElement = header.querySelector('.e-dlg-closeicon-btn');
            const text: HTMLElement = header.querySelector('.e-dlg-custom-header');
            if (args.isOpen) {
                (content.firstChild as HTMLElement).style.display = 'none';
                content.appendChild(args.target);
                closeBtn.style.display = 'none';
                this.saveBtn.element.style.display = 'none';
                this.filterClearBtn.element.style.display = 'none';
                text.innerHTML = args.header;
                const backBtn: HTMLElement = this.parent.createElement('button');
                const span: HTMLElement = this.parent.createElement('span', { className: 'e-btn-icon e-resfilterback e-icons' });
                backBtn.appendChild(span);
                this.backBtn = new Button({
                    cssClass: this.parent.cssClass ? 'e-res-back-btn' + ' ' + this.parent.cssClass : 'e-res-back-btn'
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
                text.innerHTML = this.getHeaderTitle({ action: ResponsiveDialogAction.isFilter }, args.col);
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
        if (this.parent.columnChooserModule && this.parent.columnChooserModule.responsiveDialogRenderer.saveBtn) {
            this.parent.columnChooserModule.responsiveDialogRenderer.saveBtn.disabled = args.disabled;
        }
    }

    private columnMenuResponsiveContent(str?: string, locale?: string, disabled?: boolean): void {
        const cDiv: HTMLElement = this.parent.createElement('div', { className:  'e-responsivecoldiv e-responsive' + str.toLowerCase() + 'div' + (disabled ? ' e-disabled' : '')});
        const span: HTMLElement = this.parent.createElement('span', { className: 'e-icons e-res' + str.toLowerCase() + '-icon e-btn-icon' });
        const icon: HTMLElement = this.parent.createElement('span', { innerHTML: locale, className: 'e-rescolumn-menu e-res-header-text' });
        cDiv.appendChild(span);
        cDiv.appendChild(icon);
        this.customColumnDiv.appendChild(cDiv);
    }

    private renderResponsiveContent(col?: Column, column?: Column): HTMLElement {
        const gObj: IGrid = this.parent;
        const isColumnChooser: boolean = this.action === ResponsiveDialogAction.isColumnChooser;
        if (col || isColumnChooser) {
            this.filterParent = this.parent.createElement(
                'div',
                { className: (isColumnChooser ? 'e-maincolumnchooserdiv ' : '') + 'e-mainfilterdiv e-default-filter',
                    id: (isColumnChooser ? 'columchooser' : col.uid) + '-main-filter' }
            );
            return this.filterParent;
        } else {
            this.customColumnDiv = gObj.createElement('div', { className: 'columndiv columnmenudiv' });
            this.customColumnDiv.style.width = '100%';
            if (this.parent.showColumnMenu && this.parent.rowRenderingMode === 'Horizontal' && this.action === ResponsiveDialogAction.isColMenu) {
                this.columnMenuResponsiveContent('AutoFitAll', gObj.localeObj.getConstant('AutoFitAll'));
                this.columnMenuResponsiveContent('AutoFit', gObj.localeObj.getConstant('AutoFit'));
                if (column.allowGrouping && gObj.allowGrouping) {
                    this.columnMenuResponsiveContent('Group', gObj.localeObj.getConstant('Group'), gObj.groupSettings.columns.indexOf(column.field) >= 0);
                    this.columnMenuResponsiveContent('UnGroup', gObj.localeObj.getConstant('Ungroup'), gObj.groupSettings.columns.indexOf(column.field) < 0);
                }
                if (column.allowSorting && gObj.allowSorting) {
                    let direction: string = 'None';
                    const sortColumns: SortDescriptorModel[] = this.parent.sortSettings.columns;
                    for (let i: number = 0; i < sortColumns.length; i++) {
                        if (sortColumns[parseInt(i.toString(), 10)].field === column.field) {
                            direction = sortColumns[parseInt(i.toString(), 10)].direction;
                            break;
                        }
                    }
                    this.columnMenuResponsiveContent('ascending', gObj.localeObj.getConstant('SortAscending'), direction === 'Ascending');
                    this.columnMenuResponsiveContent('descending', gObj.localeObj.getConstant('SortDescending'), direction === 'Descending');
                }
                if (gObj.showColumnChooser) {
                    this.columnMenuResponsiveContent('Column', gObj.localeObj.getConstant('Columnchooser'));
                }
                if (column.allowFiltering && gObj.allowFiltering) {
                    this.columnMenuResponsiveContent('Filter', gObj.localeObj.getConstant('FilterMenu'));
                }
            } else {
                const cols: Column[] = gObj.getColumns();
                const sortBtnParent: HTMLElement = gObj.createElement('div', { className: 'e-ressortbutton-parent' });
                const filteredCols: string[] = [];
                const isSort: boolean = this.action === ResponsiveDialogAction.isSort;
                const isFilter: boolean = this.action === ResponsiveDialogAction.isFilter;
                if (isFilter) {
                    for (let i: number = 0; i < gObj.filterSettings.columns.length; i++) {
                        filteredCols.push(gObj.filterSettings.columns[parseInt(i.toString(), 10)].field);
                    }
                }
                for (let i: number = 0; i < cols.length; i++) {
                    if (!cols[parseInt(i.toString(), 10)].visible || (!cols[parseInt(i.toString(), 10)].allowSorting && isSort)
                        || (!cols[parseInt(i.toString(), 10)].allowFiltering && isFilter)) {
                        continue;
                    }
                    const cDiv: HTMLElement = gObj.createElement('div', { className: 'e-responsivecoldiv' });
                    cDiv.setAttribute('data-mappingname', cols[parseInt(i.toString(), 10)].field);
                    cDiv.setAttribute('data-mappinguid', cols[parseInt(i.toString(), 10)].uid);
                    const span: HTMLElement = gObj.createElement('span', { innerHTML: cols[parseInt(i.toString(), 10)].headerText, className: 'e-res-header-text' });
                    cDiv.appendChild(span);
                    this.customColumnDiv.appendChild(cDiv);
                    if (isSort) {
                        const fields: string[] = this.getSortedFieldsAndDirections('field');
                        const index: number = fields.indexOf(cols[parseInt(i.toString(), 10)].field);
                        const button: HTMLElement = gObj.createElement('button', { id: gObj.element.id + cols[parseInt(i.toString(), 10)].field + 'sortbutton' });
                        const clone: Element = sortBtnParent.cloneNode() as Element;
                        clone.appendChild(button);
                        cDiv.appendChild(clone);
                        const btnObj: Button = new Button({
                            cssClass: this.parent.cssClass ? 'e-ressortbutton' + ' ' + this.parent.cssClass : 'e-ressortbutton'
                        });
                        btnObj.appendTo(button);
                        let buttonInnerText : string;
                        if ((!isNullOrUndefined (this.parent.sortSettings.columns[parseInt(index.toString(), 10)]))) {
                            buttonInnerText = (this.parent.sortSettings.columns[parseInt(index.toString(), 10)].direction === 'Ascending') ?
                                this.parent.localeObj.getConstant('AscendingText') : this.parent.localeObj.getConstant('DescendingText');
                        }
                        button.innerHTML = index > -1 ? buttonInnerText : this.parent.localeObj.getConstant('NoneText');
                        button.onclick = (e: MouseEvent) => {
                            this.sortButtonClickHandler(e.target as Element);
                        };
                    }
                    if (isFilter && filteredCols.indexOf(cols[parseInt(i.toString(), 10)].field) > -1) {
                        const divIcon: HTMLElement = gObj.createElement('div', { className: 'e-icons e-res-icon e-filtersetdiv' });
                        const iconSpan: HTMLElement = gObj.createElement('span', { className: 'e-icons e-res-icon e-filterset' });
                        iconSpan.setAttribute('data-coltype', cols[parseInt(i.toString(), 10)].type);
                        divIcon.appendChild(iconSpan);
                        cDiv.appendChild(divIcon);
                    }
                }
            }
            EventHandler.add(this.customColumnDiv, Browser.isDevice ? 'touchend' : 'click', this.customFilterColumnClickHandler, this);
            return this.customColumnDiv;
        }
    }

    private getSortedFieldsAndDirections(name: string): string[] {
        const fields: string[] = [];
        for (let i: number = 0; i < this.parent.sortSettings.columns.length; i++) {
            fields.push(this.parent.sortSettings.columns[parseInt(i.toString(), 10)][`${name}`]);
        }
        return fields;
    }

    private sortButtonClickHandler(target: Element): void {
        if (target) {
            const columndiv: Element = parentsUntil(target as Element, 'e-responsivecoldiv');
            const field: string = columndiv.getAttribute('data-mappingname');
            if (!this.parent.allowMultiSorting) {
                this.sortPredicate = []; this.sortedCols = []; this.isSortApplied = false;
                this.resetSortButtons(target);
            }
            const txt: string = target.textContent;
            const directionTxt: string = txt === this.parent.localeObj.getConstant('NoneText') ? this.parent.localeObj.getConstant('AscendingText')
                : txt === this.parent.localeObj.getConstant('AscendingText') ? this.parent.localeObj.getConstant('DescendingText')
                    : this.parent.localeObj.getConstant('NoneText');
            const direction: string = directionTxt === this.parent.localeObj.getConstant('AscendingText') ? 'Ascending'
                : directionTxt === this.parent.localeObj.getConstant('DescendingText') ? 'Descending' : 'None';
            target.innerHTML = directionTxt;
            this.setSortedCols(field, direction);
        }
    }

    private resetSortButtons(target?: Element): void {
        const buttons: HTMLElement[] = [].slice.call(this.customColumnDiv.getElementsByClassName('e-ressortbutton'));
        for (let i: number = 0; i < buttons.length; i++) {
            if (buttons[parseInt(i.toString(), 10)] !== target) {
                buttons[parseInt(i.toString(), 10)].innerHTML = this.parent.localeObj.getConstant('NoneText');
            }
        }
    }

    private setSortedCols(field: string, direction: string): void {
        const fields: string[] = this.getCurrentSortedFields();
        const index: number = fields.indexOf(field);
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
        const fields: string[] = [];
        for (let i: number = 0; i < this.sortedCols.length; i++) {
            fields.push(this.sortedCols[parseInt(i.toString(), 10)]);
        }
        return fields;
    }

    private customFilterColumnClickHandler(e: MouseEvent): void {
        const gObj: IGrid = this.parent;
        const target: HTMLElement = e.target as HTMLElement;
        if (parentsUntil(target, 'columnmenudiv') && this.action === ResponsiveDialogAction.isColMenu && !parentsUntil(target, 'e-disabled')) {
            const column: Column = this.menuCol ? this.menuCol : this.filteredCol;
            if (parentsUntil(target, 'e-responsiveautofitalldiv')) {
                gObj.autoFitColumns([]);
                this.closeCustomFilter();
            } else if (parentsUntil(target, 'e-responsiveautofitdiv')) {
                gObj.autoFitColumns(column.field);
                this.closeCustomFilter();
            } else if (parentsUntil(target, 'e-responsivegroupdiv')) {
                gObj.groupColumn(column.field);
                this.closeCustomFilter();
            } else if (parentsUntil(target, 'e-responsiveungroupdiv')) {
                gObj.ungroupColumn(column.field);
                this.closeCustomFilter();
            } else if (parentsUntil(target, 'e-responsiveascendingdiv')) {
                gObj.sortColumn(column.field, 'Ascending');
                this.closeCustomFilter();
            } else if (parentsUntil(target, 'e-responsivedescendingdiv')) {
                gObj.sortColumn(column.field, 'Descending');
                this.closeCustomFilter();
            } else if (parentsUntil(target, 'e-responsivecolumndiv')) {
                gObj.notify(events.renderResponsiveChangeAction, { action: 5 });
                gObj.showResponsiveCustomColumnChooser();
            } else if (parentsUntil(target, 'e-responsivefilterdiv')) {
                gObj.notify(events.renderResponsiveChangeAction, { action: 3 });
                this.isRowResponsive = true;
                this.isCustomDialog = false;
                if (gObj.filterModule) {
                    gObj.filterModule.responsiveDialogRenderer.showResponsiveDialog(column);
                }
            }
            e.preventDefault();
        }
        if (this.action !== ResponsiveDialogAction.isFilter) { return; }
        if (gObj.filterSettings.type !== 'FilterBar') {
            if (target.classList.contains('e-responsivecoldiv') || target.parentElement.classList.contains('e-responsivecoldiv')) {
                let field: string = target.getAttribute('data-mappingname');
                if (!field) { field = target.parentElement.getAttribute('data-mappingname'); }
                if (field) {
                    const col: Column = gObj.getColumnByField(field);
                    this.isRowResponsive = true;
                    this.showResponsiveDialog(col);
                }
            } else if (target.classList.contains('e-filterset') || target.parentElement.classList.contains('e-filtersetdiv')) {
                const colDiv: Element = parentsUntil(target, 'e-responsivecoldiv');
                if (colDiv) {
                    const field: string = colDiv.getAttribute('data-mappingname');
                    const col: Column = gObj.getColumnByField(field);
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
     * Function to show the responsive dialog
     *
     * @param {Column} col - specifies the filter column
     * @param {Column} column - specifies the menu column
     * @returns {void}
     */
    public showResponsiveDialog(col?: Column, column?: Column): void {
        if ((this.isCustomDialog && this.action === ResponsiveDialogAction.isFilter && !this.isRowResponsive) ||
            (column && this.action === ResponsiveDialogAction.isColMenu)) {
            this.menuCol = column;
            this.renderCustomFilterDialog(null, column);
        } else {
            this.filteredCol = col;
            this.renderResponsiveDialog(col);
            if (this.parent.enableAdaptiveUI && col) {
                this.parent.filterModule.setFilterModel(col);
                this.parent.filterModule.filterModule.openDialog(this.parent.filterModule.createOptions(col, undefined));
            }
            if (this.action === ResponsiveDialogAction.isColumnChooser) {
                this.parent.notify(events.renderResponsiveColumnChooserDiv, { action: 'open'});
            }
            if (this.action === ResponsiveDialogAction.isSort) {
                const args: { cancel: boolean, dialogObj: Dialog, requestType: string } = {
                    cancel: false, dialogObj: this.customResponsiveDlg, requestType: 'beforeOpenAptiveSortDialog'
                };
                this.parent.trigger(events.beforeOpenAdaptiveDialog, args);
                if (args.cancel) {
                    return;
                }
            }
            this.customResponsiveDlg.show(true);
            this.customResponsiveDlg.element.style.maxHeight = '100%';
            this.setTopToChildDialog(this.customResponsiveDlg.element);
            if (this.parent.enableAdaptiveUI && this.parent.filterSettings && (this.parent.filterSettings.type === 'CheckBox'
            || this.parent.filterSettings.type === 'Excel') && this.parent.filterSettings.enableInfiniteScrolling
            && this.parent.filterSettings.loadingIndicator === 'Shimmer') {
                const filterBase: CheckBoxFilterBase = this.parent.filterSettings.type === 'CheckBox' ? this.parent.filterModule.filterModule.checkBoxBase : this.parent.filterModule.filterModule.excelFilterBase;
                filterBase.showMask();
            }
        }
    }

    private setTopToChildDialog(dialogEle: Element): void {
        const child: HTMLElement = dialogEle.querySelector('.e-dialog');
        if (child) {
            const top: number = dialogEle.querySelector('.e-dlg-header-content').getBoundingClientRect().height;
            child.style.top = top + 'px';
        }
    }

    private renderCustomFilterDialog(col?: Column, column?: Column): void {
        const gObj: IGrid = this.parent;
        const isColMenu: boolean = this.action === ResponsiveDialogAction.isColMenu;
        if (this.action === ResponsiveDialogAction.isFilter && gObj.filterSettings.type === 'FilterBar') { return; }
        const colMenu: string = isColMenu ? 'e-customcolumnmenudiv ' : '';
        const outerDiv: HTMLElement = this.parent.createElement(
            'div',
            {
                id: gObj.element.id + (isColMenu ? 'customcolumnmenu' : 'customfilter'),
                className: this.parent.cssClass ? colMenu +
                    'e-customfilterdiv e-responsive-dialog ' + this.parent.cssClass : colMenu + 'e-customfilterdiv e-responsive-dialog'
            }
        );
        this.parent.element.appendChild(outerDiv);
        this.customFilterDlg = this.getDialogOptions(col, true, null, column);
        const args: { cancel: boolean, dialogObj: Dialog, requestType: string } = {
            cancel: false, dialogObj: this.customFilterDlg, requestType: 'beforeOpenAptiveFilterDialog'
        };
        this.parent.trigger(events.beforeOpenAdaptiveDialog, args);
        if (args.cancel) {
            return;
        }
        this.customFilterDlg.appendTo(outerDiv);
        this.customFilterDlg.show(true);
        this.customFilterDlg.element.style.maxHeight = '100%';
    }

    private getDialogOptions(col: Column, isCustomFilter: boolean, id?: string, column?: Column): Dialog {
        const options: Dialog = new Dialog({
            isModal: true,
            showCloseIcon: (id === 'columnchooser' && this.parent.columnChooserSettings.headerTemplate &&
                !this.parent.enableColumnVirtualization) ? false : true,
            closeOnEscape: false,
            locale: this.parent.locale,
            target: this.parent.adaptiveDlgTarget ? this.parent.adaptiveDlgTarget : document.body,
            visible: false,
            enableRtl: this.parent.enableRtl,
            content: this.renderResponsiveContent(col, column),
            open: this.dialogOpen.bind(this),
            created: this.dialogCreated.bind(this),
            close: this.beforeDialogClose.bind(this),
            width: '100%',
            height: '100%',
            animationSettings: { effect: 'None' },
            cssClass: this.parent.cssClass ? this.parent.cssClass : ''
        });
        const isStringTemplate: string = 'isStringTemplate';
        options[`${isStringTemplate}`] = true;
        if (isCustomFilter) {
            options.header = this.renderResponsiveHeader(col, undefined, true);
            const colMenu: string = this.action === ResponsiveDialogAction.isColMenu ? 'e-customcolumnmenu ' : '';
            options.cssClass = colMenu + 'e-customfilter';
        } else {
            options.header = this.renderResponsiveHeader(col);
            options.cssClass = this.parent.rowRenderingMode === 'Vertical' && this.action === ResponsiveDialogAction.isFilter
                ? 'e-res' + id + ' e-row-responsive-filter' : 'e-res' + id;
        }
        return options;
    }

    private renderResponsiveDialog(col?: Column): void {
        const gObj: IGrid = this.parent;
        if (this.action === ResponsiveDialogAction.isFilter && gObj.filterSettings.type === 'FilterBar') { return; }
        let id: string = this.action === ResponsiveDialogAction.isFilter ? 'filter' : 'sort';
        id = this.action === ResponsiveDialogAction.isColumnChooser  ? 'columnchooser' : id;
        const outerDiv: HTMLElement = this.parent.createElement(
            'div',
            {
                id: gObj.element.id + 'responsive' + id,
                className: this.parent.cssClass ?
                    'e-res' + id + 'div e-responsive-dialog ' + this.parent.cssClass : 'e-res' + id + 'div e-responsive-dialog'
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
                this.sortedCols.push(this.parent.sortSettings.columns[parseInt(i.toString(), 10)].field);
                const sortField: string = this.parent.sortSettings.columns[parseInt(i.toString(), 10)].field;
                const sortDirection: SortDirection = this.parent.sortSettings.columns[parseInt(i.toString(), 10)].direction;
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
            if (this.parent.rowRenderingMode === 'Horizontal' && this.parent.showColumnMenu) {
                this.parent.notify(events.renderResponsiveChangeAction, { action: 4 });
                const custom: Element = document.querySelector('.e-resfilter');
                if (custom) {
                    remove(custom);
                }
            }
        } else if (this.action === ResponsiveDialogAction.isSort) {
            this.closeCustomDialog();
        } else if (this.action === ResponsiveDialogAction.isColMenu) {
            this.closeCustomFilter();
            const custom: Element = document.querySelector('.e-rescolummenu');
            if (custom) {
                remove(custom);
            }
        } else if (this.action === ResponsiveDialogAction.isColumnChooser) {
            this.parent.notify(events.renderResponsiveColumnChooserDiv, { action: 'clear'});
            const custom: Element = document.querySelector('.e-rescolumnchooser');
            if (custom) {
                remove(custom);
            }
            if (this.parent.rowRenderingMode === 'Horizontal' && this.parent.showColumnMenu) {
                this.parent.notify(events.renderResponsiveChangeAction, { action: 4 });
            }
            this.isCustomDialog = false;
            this.isDialogClose = false;
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
            this.parent.sortColumn(
                this.sortPredicate[parseInt(i.toString(), 10)].field,
                this.sortPredicate[parseInt(i.toString(), 10)].direction, this.parent.allowMultiSorting);
        }
        if (!this.sortPredicate.length) {
            this.parent.clearSorting();
        }
        this.closeCustomDialog();
    }

    private getHeaderTitle(args: ResponsiveDialogArgs, col: Column): string {
        const gObj: IGrid = this.parent;
        let title: string;
        if (this.action === ResponsiveDialogAction.isEdit) {
            title = gObj.localeObj.getConstant('EditFormTitle') + args.primaryKeyValue[0];
        } else if (this.action === ResponsiveDialogAction.isAdd) {
            title = gObj.localeObj.getConstant('AddFormTitle');
        } else if (this.action === ResponsiveDialogAction.isFilter) {
            title = col ? col.headerText || col.field : gObj.localeObj.getConstant('FilterTitle');
        } else if (this.action === ResponsiveDialogAction.isSort) {
            title = gObj.localeObj.getConstant('Sort');
        } else if (this.action === ResponsiveDialogAction.isColMenu) {
            title = gObj.localeObj.getConstant('ColumnMenu');
        } else if (this.action === ResponsiveDialogAction.isColumnChooser) {
            title = gObj.localeObj.getConstant('ChooseColumns');
        }
        return title;
    }

    private getDialogName(action: ResponsiveDialogAction): string {
        let name: string;
        if (action === ResponsiveDialogAction.isAdd || action === ResponsiveDialogAction.isEdit) {
            name = 'dialogEdit_wrapper_title';
        } else if (action === ResponsiveDialogAction.isFilter) {
            name = 'responsive_filter_dialog_wrapper';
        }  else if (action === ResponsiveDialogAction.isColumnChooser) {
            name = 'responsive_column_chooser_dialog_wrapper';
        }
        return name;
    }

    private getButtonText(action: ResponsiveDialogAction): string {
        let text: string;
        if (action === ResponsiveDialogAction.isAdd || action === ResponsiveDialogAction.isEdit) {
            text = 'Save';
        } else if (action === ResponsiveDialogAction.isFilter || this.action === ResponsiveDialogAction.isSort ||
            action === ResponsiveDialogAction.isColumnChooser || this.action === ResponsiveDialogAction.isColumnChooser) {
            text = 'OKButton';
        }
        return text;
    }

    /**
     * Function to render the responsive header
     *
     * @param {Column} col - specifies the column
     * @param {ResponsiveDialogArgs} args - specifies the responsive dialog arguments
     * @param {boolean} isCustomFilter - specifies whether it is custom filter or not
     * @returns {HTMLElement | string} returns the html element or string
     */
    public renderResponsiveHeader(col: Column, args?: ResponsiveDialogArgs, isCustomFilter?: boolean): HTMLElement | string {
        const gObj: IGrid = this.parent;
        gObj.on(events.enterKeyHandler, this.keyHandler, this);
        const id: string = gObj.element.id + this.getDialogName(this.action);
        if (this.parent.columnChooserSettings.headerTemplate && !this.parent.enableColumnVirtualization &&
            this.getHeaderTitle(args, col) === gObj.localeObj.getConstant('ChooseColumns')) {
            const headerTempteElement: HTMLElement | string = this.parent.columnChooserModule.renderHeader();
            return headerTempteElement;
        }
        const header: HTMLElement | string = gObj.createElement('div', { className: 'e-res-custom-element' });
        const titleDiv: HTMLElement = gObj.createElement('div', { className: 'e-dlg-custom-header', id: id });
        titleDiv.innerHTML = this.getHeaderTitle(args, col);
        (header as Element).appendChild(titleDiv);
        const saveBtn: HTMLElement = gObj.createElement('button');
        if (!isCustomFilter) {
            this.saveBtn = new Button({
                cssClass: this.parent.cssClass ?
                    'e-primary e-flat e-res-apply-btn' + ' ' + this.parent.cssClass : 'e-primary e-flat e-res-apply-btn'
            });
            saveBtn.innerHTML = gObj.localeObj.getConstant(this.getButtonText(this.action));
            this.saveBtn.appendTo(saveBtn);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            saveBtn.onclick = (e: MouseEvent) => {
                this.dialogHdrBtnClickHandler();
            };
        }
        const isSort: boolean = this.action === ResponsiveDialogAction.isSort;
        const isFilter: boolean = this.action === ResponsiveDialogAction.isFilter;
        if (isFilter || isSort) {
            const id: string = isSort ? 'sort' : 'filter';
            const clearBtn: HTMLElement = gObj.createElement('button');
            this.filterClearBtn = new Button({
                cssClass: this.parent.cssClass ? 'e-primary e-flat e-res-' + id + '-clear-btn' + ' ' + this.parent.cssClass
                    : 'e-primary e-flat e-res-' + id + '-clear-btn'
            });
            if (isFilter) {
                const span: HTMLElement = gObj.createElement('span', { className: 'e-btn-icon e-icon-filter-clear e-icons' });
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

    private removeCustomFilterElement(): void {
        const elem: Element = document.getElementById(this.parent.element.id + 'customcolumnmenu');
        if (elem) {
            remove(elem);
            const custom: Element = document.querySelector('.e-customfilter');
            if (custom) {
                remove(custom);
            }
        }
        const custommenu: Element = document.querySelector('.e-rescolumnchooser');
        if (custommenu) {
            remove(custommenu);
        }
    }

    /**
     * Function to close the Responsive Column Chooser dialog.
     * @returns {void}
     * @hidden
     */
    public hideResponsiveColumnChooser(): void {
        const columnChooserElement: Element = document.querySelector('.e-rescolumnchooser');
        if (columnChooserElement) {
            remove(columnChooserElement);
            this.isCustomDialog = false;
            this.isDialogClose = false;
        }
    }

    private dialogHdrBtnClickHandler(): void {
        if (this.action === ResponsiveDialogAction.isEdit || this.action === ResponsiveDialogAction.isAdd) {
            this.parent.endEdit();
        } else if (this.action === ResponsiveDialogAction.isFilter) {
            this.parent.filterModule.filterModule.applyCustomFilter({ col: this.filteredCol, isCustomFilter: this.isCustomDlgRender });
            this.removeCustomFilterElement();
        } else if (this.action === ResponsiveDialogAction.isSort) {
            this.sortColumn();
            this.removeCustomFilterElement();
        } else if (this.action === ResponsiveDialogAction.isColumnChooser) {
            this.parent.notify(events.renderResponsiveColumnChooserDiv, { action: 'confirm'});
            this.removeCustomFilterElement();
            this.isCustomDialog = false;
            this.isDialogClose = false;
        }
    }

    private closeCustomDialog(): void {
        if (this.isCustomDlgRender) {
            const mainfilterdiv: HTMLElement = this.customResponsiveDlg.element.querySelector('.e-mainfilterdiv');
            remove(mainfilterdiv);
            return;
        }
        this.isRowResponsive = false;
        this.isCustomDlgRender = false;
        this.destroyCustomFilterDialog();
    }

    private destroyCustomFilterDialog(): void {
        if (!this.customResponsiveDlg) { return; }
        const elem: Element = document.getElementById(this.customResponsiveDlg.element.id);
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
            const customEle: Element = document.getElementById(this.customFilterDlg.element.id);
            if (this.customFilterDlg && !this.customFilterDlg.isDestroyed && customEle) {
                this.customFilterDlg.destroy();
                remove(customEle);
            }
        }
        this.isCustomDialog = false;
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
            const child: HTMLCollection = this.customColumnDiv.children;
            for (let i: number = 0; i < child.length; i++) {
                target = child[parseInt(i.toString(), 10)].querySelector('.e-filtersetdiv');
                if (target) {
                    remove(target);
                    i--;
                }
            }
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
            EventHandler.remove(this.customColumnDiv, Browser.isDevice ? 'touchend' : 'click', this.customFilterColumnClickHandler);
        }
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
        this.parent.removeEventListener(events.actionComplete, this.onActionCompleteFn);
    }
}
