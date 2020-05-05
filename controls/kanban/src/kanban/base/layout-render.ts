import { append, createElement, formatUnit, EventHandler, addClass, remove, extend, Browser } from '@syncfusion/ej2-base';
import { removeClass, closest } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { CardRenderedEventArgs, QueryCellInfoEventArgs, HeaderArgs } from '../base/interface';
import { ColumnsModel, StackedHeadersModel } from '../models/index';
import { MobileLayout } from './mobile-layout';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Kanban layout rendering module
 */
export class LayoutRender extends MobileLayout {
    public parent: Kanban;
    public kanbanRows: HeaderArgs[] = [];
    public columnKeys: string[];
    public swimlaneIndex: number;
    public scrollLeft: number;
    public swimlaneRow: HeaderArgs[];
    private columnData: { [key: string]: Object[] };
    private swimlaneData: { [key: string]: Object[] };
    /**
     * Constructor for layout module
     */
    constructor(parent: Kanban) {
        super(parent);
        this.parent = parent;
        this.columnKeys = [];
        this.swimlaneIndex = 0;
        this.swimlaneData = {};
        this.scrollLeft = 0;
        this.parent.on(events.dataReady, this.initRender, this);
        this.parent.on(events.contentReady, this.scrollUiUpdate, this);
    }

    private initRender(): void {
        if (!this.parent.isBlazorRender()) {
            if (this.parent.columns.length === 0) {
                return;
            }
            this.columnData = this.getColumnCards();
            this.kanbanRows = this.getRows();
            this.swimlaneData = this.getSwimlaneCards();
        }
        if (this.parent.isAdaptive) {
            let parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            if (parent) {
                this.scrollLeft = parent.scrollLeft;
            }
        }
        if (!this.parent.isBlazorRender()) {
            this.destroy();
            this.parent.on(events.dataReady, this.initRender, this);
            this.parent.on(events.contentReady, this.scrollUiUpdate, this);
            if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField) {
                this.renderSwimlaneHeader();
            }
            let header: HTMLElement = createElement('div', { className: cls.HEADER_CLASS });
            this.parent.element.appendChild(header);
            this.renderHeader(header);
            this.renderContent();
            this.renderCards();
            this.renderValidation();
        }
        this.parent.notify(events.contentReady, {});
        this.wireEvents();
    }

    private renderHeader(header: HTMLElement): void {
        let headerWrap: HTMLElement = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        let headerTable: HTMLElement = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.HEADER_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        headerWrap.appendChild(headerTable);
        this.renderColGroup(headerTable);
        let tableHead: HTMLElement = createElement('thead');
        headerTable.appendChild(tableHead);
        if (this.parent.stackedHeaders.length > 0) {
            tableHead.appendChild(this.createStackedRow(this.parent.stackedHeaders));
        }
        let tr: HTMLElement = createElement('tr', { className: cls.HEADER_ROW_CLASS });
        tableHead.appendChild(tr);
        for (let column of this.parent.columns) {
            if (this.isColumnVisible(column)) {
                let index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                let th: HTMLElement = createElement('th', {
                    className: index === -1 ? cls.HEADER_CELLS_CLASS : cls.HEADER_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS,
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                });
                let classList: string[] = [];
                if (column.allowToggle) {
                    classList.push(cls.HEADER_ROW_TOGGLE_CLASS);
                    if (!column.isExpanded) {
                        classList.push(cls.COLLAPSED_CLASS);
                    }
                }
                addClass([th], classList);
                let headerWrapper: HTMLElement = createElement('div', { className: cls.HEADER_WRAP_CLASS });
                th.appendChild(headerWrapper);
                let noOfCard: number = this.columnData[column.keyField].length;
                let headerTitle: HTMLElement = createElement('div', { className: cls.HEADER_TITLE_CLASS });
                headerWrapper.appendChild(headerTitle);
                if (column.template) {
                    let templateArgs: Object = {
                        keyField: column.keyField, headerText: column.headerText, minCount: column.minCount, maxCount: column.maxCount,
                        allowToggle: column.allowToggle, isExpanded: column.isExpanded, showItemCount: column.showItemCount, count: noOfCard
                    };
                    addClass([th], cls.TEMPLATE_CLASS);
                    let templateHeader: HTMLElement[] = this.parent.templateParser(column.template)(templateArgs);
                    append(templateHeader, headerTitle);
                } else {
                    let header: HTMLElement = createElement('div', { className: cls.HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerTitle.appendChild(header);
                    if (column.showItemCount) {
                        let itemCount: HTMLElement = createElement('div', {
                            className: cls.CARD_ITEM_COUNT_CLASS,
                            innerHTML: '- ' + noOfCard.toString() + ' ' + this.parent.localeObj.getConstant('items')
                        });
                        headerTitle.appendChild(itemCount);
                    }
                }
                if (column.allowToggle) {
                    let isExpand: boolean = (column.isExpanded && index === -1) ? true : false;
                    let name: string = (isExpand) ? cls.COLUMN_EXPAND_CLASS : cls.COLUMN_COLLAPSE_CLASS;
                    let icon: HTMLElement = createElement('div', {
                        className: cls.HEADER_ICON_CLASS + ' ' + cls.ICON_CLASS + ' ' + name,
                        attrs: { 'tabindex': '0' }
                    });
                    icon.setAttribute('aria-label', isExpand ? column.keyField + ' Expand' : column.keyField + ' Collapse');
                    th.setAttribute('aria-expanded', isExpand.toString());
                    headerWrapper.appendChild(icon);
                }
                let dataObj: HeaderArgs[] = [{ keyField: column.keyField, textField: column.headerText, count: noOfCard }];
                let args: QueryCellInfoEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this.parent.trigger(events.queryCellInfo, args, (columnArgs: QueryCellInfoEventArgs) => {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th);
                    }
                });
            }
        }
    }

    private renderContent(): void {
        let content: HTMLElement = createElement('div', { className: cls.CONTENT_CLASS });
        this.parent.element.appendChild(content);
        let contentWrap: HTMLElement = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        content.appendChild(contentWrap);
        let contentTable: HTMLElement = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.CONTENT_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        let tBody: HTMLElement = createElement('tbody');
        contentTable.appendChild(tBody);
        let className: string;
        let isCollaspsed: boolean = false;
        this.swimlaneRow = this.kanbanRows;
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive) {
            this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
            this.renderSwimlaneTree();
            this.parent.element.querySelector('.' + cls.TOOLBAR_SWIMLANE_NAME_CLASS).innerHTML = this.swimlaneRow[0].textField;
        }
        for (let row of this.swimlaneRow) {
            if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneToggleArray.length !== 0) {
                let index: number = this.parent.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? cls.CONTENT_ROW_CLASS + ' ' + cls.COLLAPSED_CLASS : cls.CONTENT_ROW_CLASS;
            let tr: HTMLElement = createElement('tr', { className: className, attrs: { 'aria-expanded': 'true' } });
            if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive && row.keyField !== '') {
                this.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    let className: string = index === -1 ? cls.CONTENT_CELLS_CLASS : cls.CONTENT_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS;
                    let td: HTMLElement = createElement('td', {
                        className: className,
                        attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField, 'aria-expanded': 'true', 'tabindex': '0' }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], cls.COLLAPSED_CLASS);
                        td.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT_CLASS, innerHTML: column.headerText }));
                        td.setAttribute('aria-expanded', 'false');
                    }
                    if (column.showAddButton) {
                        let button: HTMLElement = createElement('div', { className: cls.SHOW_ADD_BUTTON, attrs: { 'tabindex': '-1' } });
                        button.appendChild(createElement('div', { className: cls.SHOW_ADD_ICON + ' ' + cls.ICON_CLASS }));
                        td.appendChild(button);
                    }
                    tr.appendChild(td);
                }
            }
            let dataObj: HeaderArgs[] = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
            let args: QueryCellInfoEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
            this.parent.trigger(events.queryCellInfo, args, (columnArgs: QueryCellInfoEventArgs) => {
                if (!columnArgs.cancel) {
                    tBody.appendChild(tr);
                }
            });
        }
    }

    private renderSwimlaneRow(tBody: HTMLElement, row: HeaderArgs, isCollapsed: boolean): void {
        let name: string = cls.CONTENT_ROW_CLASS + ' ' + cls.SWIMLANE_ROW_CLASS;
        let className: string = isCollapsed ? ' ' + cls.COLLAPSED_CLASS : '';
        let tr: HTMLElement = createElement('tr', {
            className: name + className, attrs: {
                'data-key': row.keyField,
                'aria-expanded': (!isCollapsed).toString()
            }
        });
        let col: number = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        let td: HTMLElement = createElement('td', {
            className: cls.CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        let swimlaneHeader: HTMLElement = createElement('div', { className: cls.SWIMLANE_HEADER_CLASS });
        td.appendChild(swimlaneHeader);
        let iconClass: string = isCollapsed ? cls.SWIMLANE_ROW_COLLAPSE_CLASS : cls.SWIMLANE_ROW_EXPAND_CLASS;
        let iconDiv: HTMLElement = createElement('div', {
            className: cls.ICON_CLASS + ' ' + iconClass, attrs: {
                'tabindex': '0',
                'aria-label': isCollapsed ? row.keyField + ' Collapse' : row.keyField + ' Expand'
            }
        });
        swimlaneHeader.appendChild(iconDiv);
        let headerWrap: HTMLElement = createElement('div', { className: cls.HEADER_WRAP_CLASS });
        swimlaneHeader.appendChild(headerWrap);
        let cardCount: number = this.swimlaneData[row.keyField].length;
        if (this.parent.swimlaneSettings.template) {
            let templateArgs: Object = extend({}, row, { count: cardCount }, true);
            addClass([td], cls.TEMPLATE_CLASS);
            let swimlaneTemplate: HTMLElement[] = this.parent.templateParser(this.parent.swimlaneSettings.template)(templateArgs);
            append(swimlaneTemplate, headerWrap);
        } else {
            headerWrap.appendChild(createElement('div', {
                className: cls.SWIMLANE_ROW_TEXT_CLASS,
                innerHTML: row.textField,
                attrs: { 'data-role': row.textField }
            }));
        }
        if (this.parent.swimlaneSettings.showItemCount) {
            swimlaneHeader.appendChild(createElement('div', {
                className: cls.CARD_ITEM_COUNT_CLASS,
                innerHTML: `- ${cardCount.toString()} ${this.parent.localeObj.getConstant('items')}`
            }));
        }
        tr.appendChild(td);
        let dataObj: HeaderArgs[] = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
        let args: QueryCellInfoEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(events.queryCellInfo, args, (columnArgs: QueryCellInfoEventArgs) => {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
            }
        });
    }

    private renderCards(): void {
        let rows: HeaderArgs[] = this.swimlaneRow;
        let cardRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        let swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row.e-swimlane-row'));
        let removeTrs: HTMLElement[] = [];
        cardRows.forEach((tr: HTMLElement, index: number) => {
            let dataCount: number = 0;
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let columnData: Object[] = this.parent.swimlaneSettings.keyField ?
                        this.getColumnData(column.keyField, this.swimlaneData[rows[index].keyField]) : this.columnData[column.keyField];
                    dataCount += columnData.length;
                    let columnWrapper: HTMLElement = tr.querySelector('[data-key="' + column.keyField + '"]');
                    let cardWrapper: HTMLElement = createElement('div', { className: cls.CARD_WRAPPER_CLASS });
                    columnWrapper.appendChild(cardWrapper);
                    for (let data of columnData as { [key: string]: string }[]) {
                        let cardText: string = data[this.parent.cardSettings.headerField] as string;
                        let cardIndex: number = this.parent.actionModule.selectionArray.indexOf(cardText);
                        let className: string = cardIndex === -1 ? '' : ' ' + cls.CARD_SELECTION_CLASS;
                        let cardElement: HTMLElement = createElement('div', {
                            className: cls.CARD_CLASS + className,
                            attrs: {
                                'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField],
                                'aria-selected': 'false', 'tabindex': '-1'
                            }
                        });
                        if (cardIndex !== -1) {
                            cardElement.setAttribute('aria-selected', 'true');
                        }
                        if (this.parent.cardSettings.template) {
                            addClass([cardElement], cls.TEMPLATE_CLASS);
                            let cardTemplate: HTMLElement[] = this.parent.templateParser(this.parent.cardSettings.template)(data);
                            append(cardTemplate, cardElement);
                        } else {
                            let tooltipClass: string = this.parent.enableTooltip ? ' ' + cls.TOOLTIP_TEXT_CLASS : '';
                            if (this.parent.cardSettings.showHeader) {
                                let cardHeader: HTMLElement = createElement('div', { className: cls.CARD_HEADER_CLASS });
                                let cardCaption: HTMLElement = createElement('div', { className: cls.CARD_HEADER_TEXT_CLASS });
                                let cardText: HTMLElement = createElement('div', {
                                    className: cls.CARD_HEADER_TITLE_CLASS + tooltipClass,
                                    innerHTML: data[this.parent.cardSettings.headerField] || ''
                                });
                                cardHeader.appendChild(cardCaption);
                                cardCaption.appendChild(cardText);
                                cardElement.appendChild(cardHeader);
                            }
                            let cardContent: HTMLElement = createElement('div', {
                                className: cls.CARD_CONTENT_CLASS + tooltipClass,
                                innerHTML: data[this.parent.cardSettings.contentField] || ''
                            });
                            cardElement.appendChild(cardContent);
                        }
                        let args: CardRenderedEventArgs = { data: data, element: cardElement, cancel: false };
                        this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
                            if (!cardArgs.cancel) {
                                cardWrapper.appendChild(cardElement);
                            }
                        });
                    }
                }
            }
            if (dataCount === 0) {
                removeTrs.push(tr);
                if (swimlaneRows.length > 0) {
                    removeTrs.push(swimlaneRows[index]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow && (this.parent.kanbanData.length === 0 && !this.parent.showEmptyColumn)) {
            removeTrs.forEach((tr: HTMLElement) => remove(tr));
        }
    }

    private renderColGroup(table: HTMLElement): void {
        let colGroup: HTMLElement = createElement('colgroup');
        this.parent.columns.forEach((column: ColumnsModel) => {
            if (this.isColumnVisible(column)) {
                let index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                let isToggle: boolean = column.allowToggle && !column.isExpanded;
                let className: string = index === -1 ? (isToggle ? cls.COLLAPSED_CLASS : '') : cls.COLLAPSED_CLASS;
                let col: HTMLElement = createElement('col', {
                    className: className,
                    attrs: { 'data-key': column.keyField },
                    styles: this.parent.isAdaptive ? 'width: ' +
                        (isToggle ? formatUnit(events.toggleWidth) : formatUnit(this.getWidth())) : ''
                });
                colGroup.appendChild(col);
            }
        });
        table.appendChild(colGroup);
    }

    private getRows(): HeaderArgs[] {
        let kanbanRows: HeaderArgs[] = [];
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.kanbanData.map((obj: { [key: string]: string }): void => {
                if (!this.parent.swimlaneSettings.showEmptyRow) {
                    if (this.columnKeys.indexOf(obj[this.parent.keyField]) === -1) {
                        return;
                    }
                }
                kanbanRows.push({
                    keyField: obj[this.parent.swimlaneSettings.keyField],
                    textField: obj[this.parent.swimlaneSettings.textField] || obj[this.parent.swimlaneSettings.keyField]
                });
            });
            kanbanRows = kanbanRows.filter((item: HeaderArgs, index: number, arr: Object[]) =>
                index === arr.map((item: HeaderArgs) => item.keyField).indexOf(item.keyField));
            kanbanRows.sort((firstRow: HeaderArgs, secondRow: HeaderArgs): number => {
                let first: string = firstRow.textField.toLowerCase();
                let second: string = secondRow.textField.toLowerCase();
                return (first > second) ? 1 : ((second > first) ? -1 : 0);
            });
            if (this.parent.swimlaneSettings.sortBy === 'Descending') {
                kanbanRows.reverse();
            }
            kanbanRows.forEach((row: HeaderArgs) => {
                row.count = this.parent.kanbanData.filter((obj: { [key: string]: Object }) =>
                    this.columnKeys.indexOf(<string>obj[this.parent.keyField]) > -1 &&
                    obj[this.parent.swimlaneSettings.keyField] === row.keyField).length;
            });
            if (kanbanRows.length === 0) {
                kanbanRows.push({ keyField: '', textField: '' });
            }
        } else {
            kanbanRows.push({ keyField: '', textField: '' });
        }
        return kanbanRows;
    }

    private createStackedRow(rows: StackedHeadersModel[]): HTMLElement {
        let tr: HTMLElement = createElement('tr', { className: cls.HEADER_ROW_CLASS + ' ' + cls.STACKED_HEADER_ROW_CLASS });
        let stackedHeaders: string[] = [];
        this.parent.columns.forEach((column: ColumnsModel) => {
            let headerText: string = '';
            for (let row of rows) {
                if (row.keyFields.indexOf(column.keyField) !== -1) {
                    headerText = row.text;
                }
            }
            stackedHeaders.push(headerText);
        });
        for (let h: number = 0; h < stackedHeaders.length; h++) {
            let colSpan: number = 1;
            for (let j: number = h + 1; j < stackedHeaders.length; j++) {
                if ((stackedHeaders[h] !== '') && (stackedHeaders[j] !== '') && stackedHeaders[h] === stackedHeaders[j]) {
                    colSpan++;
                } else {
                    break;
                }
            }
            let div: HTMLElement = createElement('div', { className: cls.HEADER_TEXT_CLASS, innerHTML: stackedHeaders[h] });
            let th: HTMLElement = createElement('th', {
                className: cls.HEADER_CELLS_CLASS + ' ' + cls.STACKED_HEADER_CELL_CLASS,
                attrs: { 'colspan': colSpan.toString() }
            });
            tr.appendChild(th).appendChild(div);
            h += colSpan - 1;
        }
        return tr;
    }

    private scrollUiUpdate(): void {
        let header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        let height: number = this.parent.element.offsetHeight - header.offsetHeight;
        if (this.parent.isAdaptive) {
            height = window.innerHeight - (header.offsetHeight + events.bottomSpace);
            let swimlaneToolbar: HTMLElement = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS) as HTMLElement;
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            let cardWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
            cardWrappers.forEach((cell: HTMLElement) => {
                let cardWrapper: HTMLElement = cell.querySelector('.' + cls.CARD_WRAPPER_CLASS);
                if (!cardWrapper.classList.contains(cls.MULTI_CARD_WRAPPER_CLASS)) {
                    cardWrapper.style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', this.onAdaptiveScroll, this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.children).forEach((node: HTMLElement) => {
            let paddingValue: number = 0;
            if ((content.offsetWidth - content.clientWidth) > 0) {
                paddingValue = 17;
                if ((content.offsetHeight - content.clientHeight) > 0) {
                    node.style.width = formatUnit(content.clientWidth);
                }
            }
            if (this.parent.enableRtl) {
                node.style.paddingLeft = formatUnit(paddingValue);
            } else {
                node.style.paddingRight = formatUnit(paddingValue);
            }
        });
    }

    private onContentScroll(e: Event): void {
        let header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS + ' div');
        header.scrollLeft = (<HTMLElement>e.target).scrollLeft;
    }

    private onAdaptiveScroll(e: Event): void {
        if (this.parent.touchModule.tabHold && !this.parent.touchModule.mobilePopup) {
            e.preventDefault();
        }
    }

    private isColumnVisible(column: ColumnsModel): boolean {
        let isVisible: boolean = false;
        column.keyField.split(',').forEach((key: string) => { isVisible = this.parent.actionModule.hideColumnKeys.indexOf(key) === -1; });
        return isVisible;
    }

    private renderLimits(column: ColumnsModel, target: HTMLElement): void {
        let limits: HTMLElement = createElement('div', { className: cls.LIMITS_CLASS });
        if (column.minCount) {
            limits.appendChild(createElement('div', {
                className: cls.MIN_COUNT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('min') + ': ' + column.minCount.toString()
            }));
        }
        if (column.maxCount) {
            limits.appendChild(createElement('div', {
                className: cls.MAX_COUNT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('max') + ': ' + column.maxCount.toString()
            }));
        }
        if (limits.childElementCount > 0) {
            if (target.querySelector('.' + cls.CARD_WRAPPER_CLASS)) {
                target.insertBefore(limits, target.firstElementChild);
            } else {
                target.appendChild(limits);
            }
        }
    }

    private renderValidation(): void {
        let getValidationClass: Function = (column: ColumnsModel, count: number): string => {
            let colorClass: string;
            if (column.maxCount && count > column.maxCount) {
                colorClass = cls.MAX_COLOR_CLASS;
            } else if (column.minCount && count < column.minCount) {
                colorClass = cls.MIN_COLOR_CLASS;
            }
            return colorClass;
        };
        this.parent.columns.forEach((column: ColumnsModel) => {
            if (!column.minCount && !column.maxCount) {
                return;
            }
            let cardData: Object[] = this.columnData[column.keyField];
            let keySelector: string = `[data-key="${column.keyField}"]`;
            let headerCell: HTMLElement = this.parent.element.querySelector(`.${cls.HEADER_CELLS_CLASS + keySelector}`) as HTMLElement;
            let rowCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.CONTENT_CELLS_CLASS + keySelector}`));
            if (this.parent.constraintType === 'Swimlane' && this.parent.swimlaneSettings.keyField) {
                this.swimlaneRow.forEach((row: HeaderArgs, index: number) => {
                    this.renderLimits(column, rowCells[index]);
                    let rowCards: Object[] = cardData.filter((card: { [key: string]: Object }) =>
                        card[this.parent.swimlaneSettings.keyField] === row.keyField);
                    let colorClass: string = getValidationClass(column, rowCards.length);
                    if (colorClass) {
                        addClass([rowCells[index]], colorClass);
                    }
                });
            } else {
                this.renderLimits(column, headerCell);
                let colorClass: string = getValidationClass(column, cardData.length);
                if (colorClass) {
                    addClass(rowCells.concat(headerCell), colorClass);
                }
            }
        });
    }

    private getColumnData(columnValue: string, dataSource: Object[] = this.parent.kanbanData): Object[] {
        let cardData: Object[] = [];
        let columnKeys: string[] = columnValue.split(',');
        for (let key of columnKeys) {
            let keyData: Object[] = dataSource.filter((cardObj: { [key: string]: Object }) => cardObj[this.parent.keyField] === key.trim());
            cardData = cardData.concat(keyData);
        }
        if (this.parent.cardSettings.priority) {
            cardData = cardData.sort((data1: { [key: string]: string }, data2: { [key: string]: string }) =>
                parseInt(data1[this.parent.cardSettings.priority], 10) - parseInt(data2[this.parent.cardSettings.priority], 10));
        }
        return cardData;
    }

    private documentClick(args: Event): void {
        if ((args.target as HTMLElement).classList.contains(cls.SWIMLANE_OVERLAY_CLASS) &&
            this.parent.element.querySelector('.' + cls.SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        if (closest(args.target as HTMLElement, `.${cls.ROOT_CLASS}`)) {
            return;
        }
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.CARD_CLASS}.${cls.CARD_SELECTION_CLASS}`));
        removeClass(cards, cls.CARD_SELECTION_CLASS);
        this.disableAttributeSelection(cards);
    }

    public disableAttributeSelection(cards: HTMLElement[] | Element): void {
        if (cards instanceof Element) {
            cards.setAttribute('aria-selected', 'false');
        } else {
            cards.forEach((card: HTMLElement) => {
                card.setAttribute('aria-selected', 'false');
            });
        }
    }

    public getColumnCards(data?: Object[]): { [key: string]: Object[] } {
        let columnData: { [key: string]: Object[] } = {};
        this.columnKeys = [];
        this.parent.columns.forEach((column: ColumnsModel) => {
            this.columnKeys = this.columnKeys.concat(column.keyField.split(',').map((e: string) => e.trim()));
            let cardData: Object[] = this.getColumnData(column.keyField, data);
            columnData[column.keyField] = cardData;
        });
        return columnData;
    }

    public getSwimlaneCards(): { [key: string]: Object[] } {
        let swimlaneData: { [key: string]: Object[] } = {};
        if (this.parent.swimlaneSettings.keyField) {
            this.kanbanRows.forEach((row: HeaderArgs) =>
                swimlaneData[row.keyField] = this.parent.kanbanData.filter((obj: { [key: string]: Object }) =>
                    this.columnKeys.indexOf(<string>obj[this.parent.keyField]) > -1 &&
                    obj[this.parent.swimlaneSettings.keyField] === row.keyField));
        }
        return swimlaneData;
    }

    public refreshHeaders(): void {
        let header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        [].slice.call(header.children).forEach((child: HTMLElement) => remove(child));
        this.renderHeader(header);
    }

    public refreshCards(): void {
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cards.forEach((card: HTMLElement) => remove(card));
        this.renderCards();
    }

    public wireEvents(): void {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            content.scrollLeft = this.scrollLeft;
        }
        this.wireDragEvent();
    }

    public unWireEvents(): void {
        EventHandler.remove(this.parent.element, 'click', this.parent.actionModule.clickHandler);
        EventHandler.remove(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler);
        EventHandler.remove(document, Browser.touchStartEvent, this.documentClick);
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        if (this.parent.isAdaptive) {
            this.parent.touchModule.unWireTouchEvents();
        }
    }

    public wireDragEvent(): void {
        if (this.parent.allowDragAndDrop) {
            this.parent.dragAndDropModule.wireDragEvents(this.parent.element.querySelector('.' + cls.CONTENT_CLASS));
        }
    }

    public unWireDragEvent(): void {
        this.parent.dragAndDropModule.unWireDragEvents(this.parent.element.querySelector('.' + cls.CONTENT_CLASS));
    }

    public destroy(): void {
        this.parent.off(events.dataReady, this.initRender);
        this.parent.off(events.contentReady, this.scrollUiUpdate);
        this.unWireEvents();
        let header: Element = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        if (header) {
            remove(header);
        }
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            remove(content);
        }
        if (this.treeViewObj) {
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
        }
        let swimlaneToolBarEle: Element = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        let swimlaneContent: Element = this.parent.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    }

}
