import { append, createElement, formatUnit, EventHandler, addClass, remove, extend } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { CardRenderedEventArgs, ColumnRenderedEventArgs, HeaderArgs } from '../base/interface';
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
    private swimlaneRow: HeaderArgs[];
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
        this.wireEvents();
    }

    private initRender(): void {
        if (this.parent.columns.length === 0) {
            return;
        }
        this.columnData = this.getColumnCards();
        this.kanbanRows = this.getRows();
        this.swimlaneData = this.getSwimlaneCards();
        if (this.parent.isAdaptive) {
            let parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            if (parent) {
                this.scrollLeft = parent.scrollLeft;
            }
        }
        this.destroy();
        this.wireEvents();
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField) {
            this.renderSwimlaneHeader();
        }
        let header: HTMLElement = createElement('div', { className: cls.HEADER_CLASS });
        this.parent.element.appendChild(header);
        this.renderHeader(header);
        this.renderContent();
        this.renderCards();
        this.renderValidation();
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            let parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            parent.scrollLeft = this.scrollLeft;
        }
        this.parent.notify(events.contentReady, {});
    }

    private renderHeader(header: HTMLElement): void {
        let headerWrap: HTMLElement = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        let headerTable: HTMLElement = createElement('table', { className: cls.TABLE_CLASS + ' ' + cls.HEADER_TABLE_CLASS });
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
                            className: cls.CARD_ITEM_COUNT,
                            innerHTML: '- ' + noOfCard.toString() + ' ' + this.parent.localeObj.getConstant('items')
                        });
                        headerTitle.appendChild(itemCount);
                    }
                }
                if (column.allowToggle) {
                    let name: string = (column.isExpanded && index === -1) ? cls.COLUMN_EXPAND : cls.COLUMN_COLLAPSE;
                    let icon: HTMLElement = createElement('div', { className: cls.HEADER_ICON_CLASS + ' ' + cls.ICON_CLASS + ' ' + name });
                    headerWrapper.appendChild(icon);
                    this.wireEvents(icon, 'columnExpandCollapse');
                }
                let dataObj: HeaderArgs[] = [{ keyField: column.keyField, textField: column.headerText }];
                let args: ColumnRenderedEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this.parent.trigger(events.columnRendered, args, (columnArgs: ColumnRenderedEventArgs) => {
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
        let contentTable: HTMLElement = createElement('table', { className: cls.TABLE_CLASS + ' ' + cls.CONTENT_TABLE_CLASS });
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
            (this.parent.element.querySelector('.' + cls.TOOLBAR_SWIMLANE_NAME)).innerHTML = this.kanbanRows[this.swimlaneIndex].textField;
        }
        for (let row of this.swimlaneRow) {
            if (this.parent.swimlaneSettings.keyField && this.parent.actionModule.swimlaneToggleArray.length !== 0) {
                let index: number = this.parent.actionModule.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? cls.CONTENT_ROW_CLASS + ' ' + cls.COLLAPSED_CLASS : cls.CONTENT_ROW_CLASS;
            let tr: HTMLElement = createElement('tr', { className: className });
            if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive) {
                this.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    let className: string = index === -1 ? cls.CONTENT_CELLS_CLASS : cls.CONTENT_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS;
                    let td: HTMLElement = createElement('td', {
                        className: className, attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], cls.COLLAPSED_CLASS);
                        td.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT, innerHTML: column.headerText }));
                    }
                    tr.appendChild(td);
                    let dataObj: HeaderArgs[] = [{ keyField: row.keyField, textField: row.textField }];
                    let args: ColumnRenderedEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
                    this.parent.trigger(events.columnRendered, args, (columnArgs: ColumnRenderedEventArgs) => {
                        if (!columnArgs.cancel) {
                            tBody.appendChild(tr);
                        }
                    });
                }
            }
        }
        this.wireEvents(content, 'scroll');
    }

    private renderSwimlaneRow(tBody: HTMLElement, row: HeaderArgs, isCollapsed: boolean): void {
        let name: string = cls.CONTENT_ROW_CLASS + ' ' + cls.SWIMLANE_ROW_CLASS;
        let className: string = isCollapsed ? ' ' + cls.COLLAPSED_CLASS : '';
        let tr: HTMLElement = createElement('tr', { className: name + className, attrs: { 'data-key': row.keyField } });
        let col: number = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        let td: HTMLElement = createElement('td', {
            className: cls.CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        let swimlaneHeader: HTMLElement = createElement('div', { className: cls.SWIMLANE_HEADER });
        td.appendChild(swimlaneHeader);
        let iconClass: string = isCollapsed ? cls.SWIMLANE_ROW_COLLAPSE : cls.SWIMLANE_ROW_EXPAND;
        let iconDiv: HTMLElement = createElement('div', { className: cls.ICON_CLASS + ' ' + iconClass });
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
                className: cls.SWIMLANE_ROW_TEXT,
                innerHTML: row.textField,
                attrs: { 'data-role': row.textField }
            }));
        }
        if (this.parent.swimlaneSettings.showItemCount) {
            swimlaneHeader.appendChild(createElement('div', {
                className: cls.CARD_ITEM_COUNT,
                innerHTML: `- ${cardCount.toString()} ${this.parent.localeObj.getConstant('items')}`
            }));
        }
        tr.appendChild(td);
        let dataObj: HeaderArgs[] = [{ keyField: row.keyField, textField: row.textField }];
        let args: ColumnRenderedEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(events.columnRendered, args, (columnArgs: ColumnRenderedEventArgs) => {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
                this.wireEvents(tr, 'rowExpandCollapse');
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
                        let className: string = cardIndex === -1 ? '' : ' ' + cls.CARD_SELECTION;
                        let cardElement: HTMLElement = createElement('div', {
                            className: cls.CARD_CLASS + className,
                            attrs: { 'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField] }
                        });
                        if (this.parent.cardSettings.template) {
                            addClass([cardElement], cls.TEMPLATE_CLASS);
                            let cardTemplate: HTMLElement[] = this.parent.templateParser(this.parent.cardSettings.template)(data);
                            append(cardTemplate, cardElement);
                        } else {
                            let tooltipClass: string = this.parent.enableTooltip ? ' ' + cls.TOOLTIP_TEXT : '';
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
                                this.wireEvents(cardElement, 'card');
                                if (this.parent.allowDragAndDrop) {
                                    this.parent.dragAndDropModule.wireDragEvents(cardElement);
                                }
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
        if (!this.parent.swimlaneSettings.showEmptyRow) {
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
                if (!this.parent.swimlaneSettings.showEmptyRow && this.parent.isAdaptive) {
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
            kanbanRows.sort((a: HeaderArgs, b: HeaderArgs) => (a.textField > b.textField) ? 1 : ((b.textField > a.textField) ? -1 : 0));
            if (this.parent.swimlaneSettings.sortBy === 'Descending') {
                kanbanRows.reverse();
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
            let swimlaneToolbar: HTMLElement = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER) as HTMLElement;
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            let cardWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
            cardWrappers.forEach((cell: HTMLElement) => {
                let cardWrapper: HTMLElement = cell.querySelector('.' + cls.CARD_WRAPPER_CLASS);
                if (!cardWrapper.classList.contains(cls.MULTI_CARD_WRAPPER)) {
                    cardWrapper.style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', this.onAdaptiveScroll, this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.childNodes).forEach((node: HTMLElement) => {
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
        if (this.parent.touchModule.tabHold) {
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
            if (target.firstElementChild.classList.contains(cls.CARD_WRAPPER_CLASS)) {
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
                colorClass = cls.MAX_COLOR;
            } else if (column.minCount && count < column.minCount) {
                colorClass = cls.MIN_COLOR;
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
                this.kanbanRows.forEach((row: HeaderArgs, index: number) => {
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
            let keyData: Object[] = dataSource.filter((cardObj: { [key: string]: Object }) =>
                cardObj[this.parent.keyField] === key.trim());
            cardData = cardData.concat(keyData);
        }
        return cardData;
    }

    private getColumnCards(): { [key: string]: Object[] } {
        let columnData: { [key: string]: Object[] } = {};
        this.columnKeys = [];
        this.parent.columns.forEach((column: ColumnsModel) => {
            this.columnKeys = this.columnKeys.concat(column.keyField.split(',').map((e: string) => e.trim()));
            let cardData: Object[] = this.getColumnData(column.keyField);
            columnData[column.keyField] = cardData;
        });
        return columnData;
    }

    private getSwimlaneCards(): { [key: string]: Object[] } {
        let swimlaneData: { [key: string]: Object[] } = {};
        if (this.parent.swimlaneSettings.keyField) {
            this.kanbanRows.forEach((row: HeaderArgs) =>
                swimlaneData[row.keyField] = this.parent.kanbanData.filter((obj: { [key: string]: Object }) =>
                    this.columnKeys.indexOf(<string>obj[this.parent.keyField]) > -1 &&
                    obj[this.parent.swimlaneSettings.keyField] === row.keyField));
        }
        return swimlaneData;
    }

    private wireEvents(element?: HTMLElement, action?: string): void {
        switch (action) {
            case 'card':
                EventHandler.add(element, 'click', this.parent.actionModule.cardClick, this.parent.actionModule);
                EventHandler.add(element, 'dblclick', this.parent.actionModule.cardDoubleClick, this.parent.actionModule);
                break;
            case 'rowExpandCollapse':
                EventHandler.add(element, 'click', this.parent.actionModule.rowExpandCollapse, this.parent.actionModule);
                break;
            case 'columnExpandCollapse':
                EventHandler.add(element, 'click', this.parent.actionModule.columnExpandCollapse, this.parent.actionModule);
                break;
            case 'scroll':
                EventHandler.add(element, 'scroll', this.onContentScroll, this);
                break;
            default:
                this.parent.on(events.dataReady, this.initRender, this);
                this.parent.on(events.contentReady, this.scrollUiUpdate, this);
                break;
        }
    }

    private unWireEvents(element?: Element, action?: string): void {
        switch (action) {
            case 'card':
                EventHandler.remove(element, 'click', this.parent.actionModule.cardClick);
                EventHandler.remove(element, 'dblclick', this.parent.actionModule.cardDoubleClick);
                break;
            case 'rowExpandCollapse':
                EventHandler.remove(element, 'click', this.parent.actionModule.rowExpandCollapse);
                break;
            case 'columnExpandCollapse':
                EventHandler.remove(element, 'click', this.parent.actionModule.columnExpandCollapse);
                break;
            case 'scroll':
                EventHandler.remove(element, 'scroll', this.onContentScroll);
                break;
            default:
                this.parent.off(events.dataReady, this.initRender);
                this.parent.off(events.contentReady, this.scrollUiUpdate);
                break;
        }
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

    public destroy(): void {
        this.unWireEvents();
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS));
        cards.forEach((card: Element) => this.unWireEvents(card, 'card'));
        let rows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.SWIMLANE_ROW_CLASS));
        rows.forEach((row: Element) => this.unWireEvents(row, 'rowExpandCollapse'));
        let columns: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.HEADER_ICON_CLASS));
        columns.forEach((column: Element) => this.unWireEvents(column, 'columnExpandCollapse'));
        let header: Element = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        if (header) {
            remove(header);
        }
        let content: Element = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        if (content) {
            this.unWireEvents(content, 'scroll');
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
        let swimlaneToolBarEle: Element = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        let swimlaneContent: Element = this.parent.element.querySelector('.' + cls.SWIMLANE_CONTENT);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    }

}
