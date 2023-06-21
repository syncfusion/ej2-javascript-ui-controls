import { PivotView } from '../base/pivotview';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { createElement, remove, select, EventHandler, MouseEventArgs, isNullOrUndefined, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { Pager as GridPager } from '@syncfusion/ej2-grids';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PagerSettingsModel } from '../base/pivotview-model';
import { NumericTextBox, ChangeEventArgs as TextBoxChangeEventArgs } from '@syncfusion/ej2-inputs';

/**
 * Module for Pager rendering
 */
/** @hidden */
export class Pager {
    /** @hidden */
    public pager: GridPager;
    /** @hidden */
    public parent: PivotView;

    /**
     * Internal variables.
     */
    private columnPagerTextBox: NumericTextBox;
    private rowPagerTextBox: NumericTextBox;
    private columnPageSizeDropDown: DropDownList;
    private rowPageSizeDropDown: DropDownList;

    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.pagerModule = this;
        this.addEventListener();
    }

    /**
     * It returns the Module name.
     *
     * @returns {string} - string
     * @hidden
     */
    public getModuleName(): string {
        return 'pager';
    }

    /**
     *
     * @hidden
     *
     */

    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initPivotPager, this.createPager, this);
    }

    /**
     *
     * @hidden
     */

    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        if (isNullOrUndefined(this.parent.pagerSettings.template)) {
            this.unWireEvent();
        }
        this.parent.off(events.initPivotPager, this.createPager);
    }

    private createPager(): void {
        if (select('#' + this.parent.element.id + 'pivot-pager', this.parent.element) !== null) {
            remove(select('#' + this.parent.element.id + 'pivot-pager', this.parent.element));
            this.destroy();
            this.addEventListener();
        }
        const tableWidth: number = (this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber());
        const pagerOptions: PagerSettingsModel = this.parent.pagerSettings;
        if (this.parent.enablePaging) {
            const pagerElement: HTMLElement = createElement('div', {
                id: this.parent.element.id + 'pivot-pager',
                className: cls.GRID_PAGER + ' ' + (((this.parent.isAdaptive || tableWidth < 650) ? cls.DEVICE : '') + ' ' + (this.parent.enableRtl ? cls.RTL : '') + ' ' + (this.parent.pagerSettings.position === 'Top' ? ' ' + cls.GRID_PAGER_TOP : ' ' + cls.GRID_PAGER_BOTTOM)
          + ' ' + ((pagerOptions.enableCompactView || tableWidth < 400) ? cls.COMPACT_VIEW : '')),
                styles: 'width:' + (this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber()) + 'px'
            });
            if (this.parent.showFieldList && select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element) && pagerOptions.position === 'Top') {
                this.parent.element.insertBefore(pagerElement, select('#' + this.parent.element.id + '_PivotFieldList', this.parent.element));
            } else if (this.parent.showGroupingBar && select('#' + this.parent.element.id + ' .' + cls.GRID_GROUPING_BAR_CLASS, this.parent.element) && pagerOptions.position === 'Top') {
                this.parent.element.insertBefore(pagerElement, select('#' + this.parent.element.id + ' .' + cls.GRID_GROUPING_BAR_CLASS, this.parent.element));
            } else {
                if (this.parent.pagerSettings.position === 'Top') {
                    this.parent.element.insertBefore(pagerElement, select('#' + this.parent.element.id + '_grid', this.parent.element));
                } else {
                    this.parent.element.append(pagerElement);
                }
            }
            let _this: this = this;
            let tempFunc: Function = function() {
                return _this.createPagerContainer();
            };
            this.pager = new GridPager({
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale, // eslint-disable-next-line @typescript-eslint/no-explicit-any
                template: pagerOptions.template === '' || pagerOptions.template ? pagerOptions.template : initializeCSPTemplate(tempFunc) as any,
                cssClass: this.parent.cssClass
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.pager.isVue = (this.parent as any).isVue;
            this.pager.appendTo('#' + this.parent.element.id + 'pivot-pager');
            if (isNullOrUndefined(pagerOptions.template)) {
                if (pagerOptions.showRowPager) {
                    if (!pagerOptions.enableCompactView && tableWidth > 400) {
                        this.rowPagerTextBox = new NumericTextBox({
                            min: 1,
                            max: this.parent.engineModule.rowPageCount,
                            showSpinButton: false,
                            format: '#',
                            validateDecimalOnType: true,
                            decimals: 0,
                            strictMode: true,
                            value: this.parent.pageSettings.currentRowPage,
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            width: tableWidth < 669 ? '50px' : '64px',
                            change: this.rowPageChange.bind(this),
                            cssClass: this.parent.cssClass
                        });
                        this.rowPagerTextBox.appendTo('#' + this.parent.element.id + '_row_textbox');
                    }
                    if (pagerOptions.showRowPageSize) {
                        const rowPages: number[] = this.parent.pagerSettings.rowPageSizes.slice(0);
                        if (this.parent.pagerSettings.rowPageSizes.indexOf(this.parent.pageSettings.rowPageSize) === -1) {
                            rowPages.push(this.parent.pageSettings.rowPageSize);
                            rowPages.sort(function (a: number, b: number): number { return a - b; });
                        }
                        this.rowPageSizeDropDown = new DropDownList({
                            dataSource: rowPages,
                            value: this.parent.pageSettings.rowPageSize,
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            change: this.rowPageSizeChange.bind(this),
                            popupHeight: '300px',
                            popupWidth: '100%',
                            width: '64px',
                            cssClass: this.parent.cssClass
                        });
                        this.rowPageSizeDropDown.appendTo('#' + this.parent.element.id + '_' + 'row' + '_size_list');
                    }
                }
                if (pagerOptions.showColumnPager) {
                    if (!pagerOptions.enableCompactView && tableWidth > 400) {
                        this.columnPagerTextBox = new NumericTextBox({
                            min: 1,
                            max: this.parent.engineModule.columnPageCount,
                            showSpinButton: false,
                            format: '#',
                            validateDecimalOnType: true,
                            decimals: 0,
                            strictMode: true,
                            value: this.parent.pageSettings.currentColumnPage,
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            width: tableWidth < 669 ? '50px' : '64px',
                            change: this.columnPageChange.bind(this),
                            cssClass: this.parent.cssClass
                        });
                        this.columnPagerTextBox.appendTo('#' + this.parent.element.id + '_column_textbox');
                    }
                    if (pagerOptions.showColumnPageSize) {
                        const columnPages: number[] = this.parent.pagerSettings.columnPageSizes.slice(0);
                        if (this.parent.pagerSettings.columnPageSizes.indexOf(this.parent.pageSettings.columnPageSize) === -1) {
                            columnPages.push(this.parent.pageSettings.columnPageSize);
                            columnPages.sort(function (a: number, b: number): number { return a - b; });
                        }
                        this.columnPageSizeDropDown = new DropDownList({
                            dataSource: columnPages,
                            value: this.parent.pageSettings.columnPageSize,
                            enableRtl: this.parent.enableRtl,
                            locale: this.parent.locale,
                            change: this.columnPageSizeChange.bind(this),
                            popupHeight: '300px',
                            popupWidth: '100%',
                            width: '64px',
                            cssClass: this.parent.cssClass
                        });
                        this.columnPageSizeDropDown.appendTo('#' + this.parent.element.id + '_' + 'column' + '_size_list');
                    }
                }
                this.unWireEvent();
                this.wireEvent();
            }
        }
    }

    private wireEvent(): void {
        const elements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.FIRST_PAGER_ICON + ', .' + cls.PREV_PAGER_ICON + ', .' + cls.NEXT_PAGER_ICON + ', .' + cls.LAST_PAGER_ICON));
        for (let i: number = 0; i < elements.length; i++) {
            EventHandler.add(elements[i as number], 'click', this.updatePageSettings, this);
        }
    }
    private unWireEvent(): void {
        const elements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.FIRST_PAGER_ICON + ', .' + cls.PREV_PAGER_ICON + ', .' + cls.NEXT_PAGER_ICON + ', .' + cls.LAST_PAGER_ICON));
        for (let i: number = 0; i < elements.length; i++) {
            EventHandler.remove(elements[i as number], 'click', this.updatePageSettings);
        }
    }

    private columnPageChange(args: TextBoxChangeEventArgs): void {
        this.parent.pageSettings.currentColumnPage = args.value;
    }

    private rowPageChange(args: TextBoxChangeEventArgs): void {
        this.parent.pageSettings.currentRowPage = args.value;
    }

    private columnPageSizeChange(args: ChangeEventArgs): void {
        this.parent.pageSettings.columnPageSize = Number(args.value);
    }

    private rowPageSizeChange(args: ChangeEventArgs): void {
        this.parent.pageSettings.rowPageSize = Number(args.value);
    }

    private updatePageSettings(args: MouseEventArgs): void {
        const targetId: string = (args.target as HTMLElement).id;
        switch (targetId) {
        case this.parent.element.id + '_row_firstIcon':
            this.parent.pageSettings.currentRowPage = 1;
            break;
        case this.parent.element.id + '_row_prevIcon':
            this.parent.pageSettings.currentRowPage = this.parent.pageSettings.currentRowPage > 1
                ? this.parent.pageSettings.currentRowPage - 1 : this.parent.pageSettings.currentRowPage;
            break;
        case this.parent.element.id + '_row_nextIcon':
            this.parent.pageSettings.currentRowPage = this.parent.pageSettings.currentRowPage < this.parent.engineModule.rowPageCount
                ? this.parent.pageSettings.currentRowPage + 1 : this.parent.pageSettings.currentRowPage;
            break;
        case this.parent.element.id + '_row_lastIcon':
            this.parent.pageSettings.currentRowPage = this.parent.engineModule.rowPageCount;
            break;
        case this.parent.element.id + '_column_firstIcon':
            this.parent.pageSettings.currentColumnPage = 1;
            break;
        case this.parent.element.id + '_column_prevIcon':
            this.parent.pageSettings.currentColumnPage = this.parent.pageSettings.currentColumnPage > 1
                ? this.parent.pageSettings.currentColumnPage - 1 : this.parent.pageSettings.currentColumnPage;
            break;
        case this.parent.element.id + '_column_nextIcon':
            this.parent.pageSettings.currentColumnPage = this.parent.pageSettings.currentColumnPage
                < this.parent.engineModule.columnPageCount ? this.parent.pageSettings.currentColumnPage + 1
                : this.parent.pageSettings.currentColumnPage;
            break;
        case this.parent.element.id + '_column_lastIcon':
            this.parent.pageSettings.currentColumnPage = this.parent.engineModule.columnPageCount;
            break;
        }
        if (targetId.indexOf('_row') !== -1) {
            this.parent.actionObj.actionName = events.rowPageNavigation;
        } else if (targetId.indexOf('_column') !== -1) {
            this.parent.actionObj.actionName = events.columnPageNavigation;
        }
    }

    private createPagerContainer(): string {
        const tableWidth: number = (this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber());
        const pagerOptions: PagerSettingsModel = this.parent.pagerSettings;
        let rowMainDiv: HTMLElement;
        let columnMainDiv: HTMLElement;
        if (pagerOptions.showRowPager) {
            rowMainDiv = this.createPagerItems('row', pagerOptions, tableWidth);
        }
        if (pagerOptions.showColumnPager) {
            columnMainDiv = this.createPagerItems('column', pagerOptions, tableWidth);
        }
        const mainDivPagerSettings: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + 'mainDiv',
            className: (cls.GRID_PAGER_DIV + ' ' + ((!pagerOptions.showRowPager || !pagerOptions.showColumnPager) ? cls.GRID_PAGER_SINGLE_DIV : '') + ' ' + (pagerOptions.isInversed ? cls.INVERSE : ''))
        });
        const vertiSeparator: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + 'vertical' + '_separator',
            className: (this.parent.isAdaptive || tableWidth < 650) ? cls.PIVOT_H_SEPARATOR : cls.PIVOT_V_SEPARATOR
        });
        if (pagerOptions.isInversed && pagerOptions.showColumnPager && pagerOptions.showRowPager) {
            mainDivPagerSettings.append(columnMainDiv, vertiSeparator, rowMainDiv);
        } else if (pagerOptions.showColumnPager && pagerOptions.showRowPager) {
            mainDivPagerSettings.append(rowMainDiv, vertiSeparator, columnMainDiv);
        } else if (pagerOptions.showRowPager && !pagerOptions.showColumnPager) {
            mainDivPagerSettings.append(rowMainDiv);
        } else if (!pagerOptions.showRowPager && pagerOptions.showColumnPager) {
            mainDivPagerSettings.append(columnMainDiv);
        }
        return mainDivPagerSettings.outerHTML;
    }

    private createPagerItems(axis: string, pagerOptions: PagerSettingsModel, tableWidth: number): HTMLElement {
        const isSinglePagerEnabled: boolean = (!pagerOptions.showRowPager || !pagerOptions.showColumnPager);
        const pagerAxisMainDiv: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_mainDiv',
            className: (axis === 'row' ? (cls.PIVOT_ROW_PAGER_DIV + ' ' + (!pagerOptions.showRowPageSize ? cls.PAGE_SIZE_DISABLE : '')) : (cls.PIVOT_COLUMN_PAGER_DIV + ' ' + (!pagerOptions.showColumnPageSize ? cls.PAGE_SIZE_DISABLE : '')))
        });
        const pagerIconContainer: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_pagerSettings',
            className: (axis === 'row' ? cls.PIVOT_ROW_PAGER_SETTINGS : cls.PIVOT_COLUMN_PAGER_SETTINGS)
        });
        const isFirstDisable: boolean = (axis === 'column' && this.parent.pageSettings.currentColumnPage === 1) || (axis === 'row' && this.parent.pageSettings.currentRowPage === 1);
        const isLastDisable: boolean = (axis === 'column' && this.parent.pageSettings.currentColumnPage === this.parent.engineModule.columnPageCount) || (axis === 'row' && this.parent.pageSettings.currentRowPage === this.parent.engineModule.rowPageCount);
        const navIconContainer: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_NavContainer',
            attrs: {
                class: cls.PIVOT_PAGER_NAV_CONTAINER + ' ' + cls.PIVOT_PAGER_CONTAINER
            }
        });
        const pageInfoContainer: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_PageInfoContainer',
            attrs: {
                class: cls.PIVOT_PAGER_INFO_CONTAINER + ' ' + cls.PIVOT_PAGER_CONTAINER
            }
        });
        const firstIcon: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_firstIcon',
            attrs: {
                class: cls.PIVOT_FIRST_ICON_DEFAULT + (isFirstDisable ? (' ' + cls.DISABLE_FIRST_PAGE + ' ' + cls.ICON_DISABLE) : ' ' + cls.PIVOT_FIRST_ICON_ENABLE),
                title: this.parent.localeObj.getConstant('gotofirstpage'),
                'aria-label': this.parent.localeObj.getConstant('gotofirstpage'),
                tabindex: '-1',
                role: 'button'
            }
        });
        const prevIcon: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_prevIcon',
            attrs: {
                class: cls.PIVOT_PREV_ICON_DEFAULT + (isFirstDisable ? (' ' + cls.DISABLE_PREV_PAGE + ' ' + cls.ICON_DISABLE) : ' ' + cls.PIVOT_PREV_ICON_ENABLE),
                title: this.parent.localeObj.getConstant('gotopreviouspage'),
                'aria-label': this.parent.localeObj.getConstant('gotopreviouspage'),
                tabindex: '-1',
                role: 'button'
            }
        });
        const pagerString: HTMLElement = createElement('span', {
            id: this.parent.element.id + '_' + axis + '_pagerString',
            className: axis === 'row' ? cls.PIVOT_ROW_PAGER_STRING : cls.PIVOT_COLUMN_PAGER_STRING
        });
        pagerString.innerText = axis === 'row' ? this.parent.localeObj.getConstant('rowPage') : this.parent.localeObj.getConstant('columnPage');
        const pagerTextBoxDiv: HTMLElement = createElement('input', {
            id: this.parent.element.id + '_' + axis + '_textbox',
            className: axis === 'row' ? cls.PIVOT_ROW_DROPDOWN : cls.PIVOT_COLUMN_DROPDOWN
        });
        const mainOfStringDiv: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_of_string_mainDiv',
            className: axis === 'row' ? cls.PIVOT_ROW_OF_STRING_MAINDIV : cls.PIVOT_COLUMN_OF_STRING_MAINDIV
        });
        const ofString: HTMLElement = createElement('span', {
            id: this.parent.element.id + '_' + axis + '_ofString',
            className: axis === 'row' ? cls.PIVOT_ROW_OF_STRING : cls.PIVOT_COLUMN_OF_STRING
        });
        ofString.innerText = this.parent.localeObj.getConstant('of') + ' ';
        const pagerNumber: HTMLElement = createElement('span', {
            id: this.parent.element.id + '_' + axis + '_pagerNumber',
            className: axis === 'row' ? cls.PIVOT_ROW_PAGER_NUMBER : cls.PIVOT_COLUMN_PAGER_NUMBER
        });
        pagerNumber.innerText = (axis === 'row' ? this.parent.engineModule.rowPageCount : this.parent.engineModule.columnPageCount).toString();
        const nextIcon: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_nextIcon',
            attrs: {
                class: cls.PIVOT_NEXT_ICON_DEFAULT + (isLastDisable ? (' ' + cls.DISABLE_NEXT_PAGE + ' ' + cls.ICON_DISABLE) : ' ' + cls.PIVOT_NEXT_ICON_ENABLE),
                title: this.parent.localeObj.getConstant('gotonextpage'),
                'aria-label': this.parent.localeObj.getConstant('gotonextpage'),
                tabindex: '-1',
                role: 'button'
            }
        });
        const lastIcon: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_lastIcon',
            attrs: {
                class: cls.PIVOT_LAST_ICON_DEFAULT + (isLastDisable ? (' ' + cls.DISABLE_LAST_PAGE + ' ' + cls.ICON_DISABLE) : ' ' + cls.PIVOT_LAST_ICON_ENABLE),
                title: this.parent.localeObj.getConstant('gotolastpage'),
                'aria-label': this.parent.localeObj.getConstant('gotolastpage'),
                tabindex: '-1',
                role: 'button'
            }
        });
        const pageSize: HTMLElement = createElement('span', {
            id: this.parent.element.id + '_' + axis + '_size',
            className: axis === 'row' ? cls.PIVOT_ROW_SIZE : cls.PIVOT_COLUMN_SIZE
        });
        pageSize.innerText = axis === 'row' ? this.parent.localeObj.getConstant('rowPerPage') : this.parent.localeObj.getConstant('columnPerPage');
        const pageSizeDropDownMainDiv: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_size_list_maindiv',
            className: cls.PIVOT_PAGE_SIZE_LIST_MAINDIV + ' ' + cls.PIVOT_PAGER_CONTAINER
        });
        const pageSizeDropDown: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_size_list',
            className: axis === 'row' ? cls.PIVOT_ROW_SIZE_LIST : cls.PIVOT_COLUMN_SIZE_LIST
        });
        const pagerStringContainer: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_text_div',
            className: cls.PIVOT_TEXT_DIV
        });
        const pagerElementContainer: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_' + axis + '_text_div_1',
            className: cls.PIVOT_TEXT_DIV_1
        });
        pageSizeDropDownMainDiv.append(pageSizeDropDown);
        if (pagerOptions.enableCompactView || tableWidth < 400) {
            navIconContainer.append(prevIcon, nextIcon);
            pagerIconContainer.append(navIconContainer);
        } else {
            mainOfStringDiv.append(ofString, pagerNumber);
            navIconContainer.append(firstIcon, prevIcon, nextIcon, lastIcon);
            pageInfoContainer.append(pagerTextBoxDiv, mainOfStringDiv);
            pagerIconContainer.append(navIconContainer, pageInfoContainer);
        }
        if ((axis === 'row' && pagerOptions.showRowPager) || (axis === 'column' && pagerOptions.showColumnPager)) {
            if (((axis === 'column' && !pagerOptions.showRowPager) || (axis === 'row' && !pagerOptions.showColumnPager)) && (isSinglePagerEnabled)) {
                pagerElementContainer.append(pageSize, pageSizeDropDownMainDiv);
            }
            if ((!pagerOptions.showColumnPager || !pagerOptions.showRowPager) && (isSinglePagerEnabled)) {
                if (axis === 'row') {
                    if (pagerOptions.showRowPageSize) {
                        pagerAxisMainDiv.append(pagerIconContainer, pagerString, pagerElementContainer);
                    } else {
                        pagerAxisMainDiv.append(pagerIconContainer, pagerString);
                    }
                }
                if (axis === 'column') {
                    if (pagerOptions.showColumnPageSize) {
                        pagerAxisMainDiv.append(pagerIconContainer, pagerString, pagerElementContainer);
                    } else {
                        pagerAxisMainDiv.append(pagerIconContainer, pagerString);
                    }
                }
            } else {
                if ((axis === 'row' && pagerOptions.showRowPageSize) || (axis === 'column' && pagerOptions.showColumnPageSize)) {
                    if (!pagerOptions.enableCompactView && tableWidth > 400) {
                        pagerStringContainer.append(pagerString, pageSize);
                        pagerElementContainer.append(pagerIconContainer, pageSizeDropDownMainDiv);
                    } else {
                        pagerStringContainer.append(pagerString, pagerIconContainer);
                        pagerElementContainer.append(pageSize, pageSizeDropDownMainDiv);
                    }
                } else if ((axis === 'row' && !pagerOptions.showRowPageSize) || (axis === 'column' && !pagerOptions.showColumnPageSize)) {
                    pagerStringContainer.append(pagerString);
                    pagerElementContainer.append(pagerIconContainer);
                }
                pagerAxisMainDiv.append(pagerStringContainer, pagerElementContainer);
            }
        }
        return pagerAxisMainDiv;
    }

    /**
     * To destroy the pager.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.parent.pagerModule) {
            if (this.columnPagerTextBox) {
                this.columnPagerTextBox.destroy();
            }
            if (this.rowPagerTextBox) {
                this.rowPagerTextBox.destroy();
            }
            if (this.columnPageSizeDropDown) {
                this.columnPageSizeDropDown.destroy();
            }
            if (this.rowPageSizeDropDown) {
                this.rowPageSizeDropDown.destroy();
            }
            if (this.pager) {
                this.pager.destroy();
            }
            this.columnPagerTextBox = null;
            this.rowPagerTextBox = null;
            this.columnPageSizeDropDown = null;
            this.rowPageSizeDropDown = null;
            this.pager = null;
        } else {
            return;
        }
    }
}
