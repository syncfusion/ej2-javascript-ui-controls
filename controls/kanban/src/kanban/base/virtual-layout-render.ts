/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    append, createElement, formatUnit, EventHandler, addClass, remove, extend, Browser, isNullOrUndefined as isNoU,
    removeClass, closest, detach, debounce
} from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { DataManager, Query, Deferred, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { CardRenderedEventArgs, QueryCellInfoEventArgs, HeaderArgs, ScrollOffset, VirtualScrollInfo,
    DataStateChangeEventArgs, ActionEventArgs } from '../base/interface';
import { ColumnsModel, StackedHeadersModel } from '../models/index';
import { MobileLayout } from './mobile-layout';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import { ReturnType } from './type';

/**
 * Kanban layout rendering module
 *
 */
export class VirtualLayoutRender extends MobileLayout {
    public parent: Kanban;
    public kanbanRows: HeaderArgs[];
    public columnKeys: string[];
    public scrollLeft: number;
    public columnData: { [key: string]: any[] };
    public frozenSwimlaneRow: HTMLElement;
    public frozenOrder: number;
    public isSelectedCard: boolean;
    public currentStatus: VirtualScrollInfo;
    public scrollStatus: { [key: string]: VirtualScrollInfo };
    private offsets: { [x: number]: number };
    private tempOffsets: { [x: number]: number };
    private offsetKeys: string[];
    private query: Query;
    private isSwimlane: boolean;
    private singleIndexSwimlaneCardCount: number;
    private cardHeight: number;
    private winResize: EventListenerOrEventListenerObject;
    constructor(parent: Kanban) {
        super(parent);
        this.parent = parent;
        this.kanbanRows = [];
        this.scrollStatus = {};
        this.offsets = {};
        this.tempOffsets = {};
        this.offsetKeys = [];
        this.columnKeys = [];
        this.scrollLeft = 0;
        this.frozenOrder = 0;
        this.winResize = this.windowResize.bind(this);
        if (this.parent.enableVirtualization) {
            this.parent.on(events.dataReady, this.initRender, this);
            this.parent.on(events.contentReady, this.scrollUiUpdate, this);
        }
    }

    private initRender(): void {
        this.isSwimlane = !isNoU(this.parent.swimlaneSettings.keyField) &&
            this.parent.swimlaneSettings.keyField.trim().length > 1 ? true : false;
        this.query = this.parent.query instanceof Query ? this.parent.query : new Query();
        if (this.parent.columns.length === 0) {
            return;
        }
        this.cardHeight = this.cardHeightCalculate();
        this.columnData = this.getColumnCards();
        this.kanbanRows = this.getRows();
        if (this.parent.isAdaptive) {
            const parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            if (parent) {
                this.scrollLeft = parent.scrollLeft;
            }
        }
        this.destroy();
        this.parent.on(events.dataReady, this.initRender, this);
        this.parent.on(events.contentReady, this.scrollUiUpdate, this);
        const header: HTMLElement = createElement('div', { className: cls.HEADER_CLASS });
        this.parent.element.appendChild(header);
        this.renderHeader(header);
        if (!this.isSwimlane) {
            this.renderContent();
            this.renderCards();
        }
        this.renderValidation();
        this.parent.renderTemplates();
        this.parent.notify(events.contentReady, {});
        this.wireEvents();
        if (this.parent.isInitialRender) {
            this.parent.isInitialRender = false;
        }
    }

    private cardHeightCalculate(): number {
        let cardHeight: number;
        if (this.parent.cardHeight === 'auto') {
            cardHeight = 100 + 8; // 8 is the margin bottom value of the card.
        } else {
            cardHeight = parseInt(formatUnit(this.parent.cardHeight).split('px')[0], 10) + 8;
        }
        return cardHeight;
    }

    private renderHeader(header: HTMLElement): void {
        const headerWrap: HTMLElement = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        const headerTable: HTMLElement = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.HEADER_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        headerWrap.appendChild(headerTable);
        this.renderColGroup(headerTable);
        const tableHead: HTMLElement = createElement('thead');
        headerTable.appendChild(tableHead);
        if (this.parent.stackedHeaders.length > 0) {
            tableHead.appendChild(this.createStackedRow(this.parent.stackedHeaders));
        }
        const tr: HTMLElement = createElement('tr', { className: cls.HEADER_ROW_CLASS });
        tableHead.appendChild(tr);
        for (const column of this.parent.columns) {
            if (this.isColumnVisible(column)) {
                const index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField.toString());
                const th: HTMLElement = createElement('th', {
                    className: index === -1 ? cls.HEADER_CELLS_CLASS : cls.HEADER_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS,
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField.toString() }
                });
                const classList: string[] = [];
                if (column.allowToggle) {
                    classList.push(cls.HEADER_ROW_TOGGLE_CLASS);
                    if (!column.isExpanded) {
                        classList.push(cls.COLLAPSED_CLASS);
                    }
                }
                addClass([th], classList);
                const headerWrapper: HTMLElement = createElement('div', { className: cls.HEADER_WRAP_CLASS });
                th.appendChild(headerWrapper);
                const noOfCard: number = this.parent.dataModule.isRemote() ?
                    this.parent.columnDataCount[column.keyField] : this.columnData[column.keyField].length;
                const headerTitle: HTMLElement = createElement('div', { className: cls.HEADER_TITLE_CLASS });
                headerWrapper.appendChild(headerTitle);
                if (column.template) {
                    const templateArgs: Record<string, any> = {
                        keyField: column.keyField, headerText: column.headerText, minCount: column.minCount, maxCount: column.maxCount,
                        allowToggle: column.allowToggle, isExpanded: column.isExpanded, showItemCount: column.showItemCount, count: noOfCard
                    };
                    addClass([th], cls.TEMPLATE_CLASS);
                    const templateId: string = this.parent.element.id + '_columnTemplate';
                    const templateHeader: HTMLElement[] =
                        this.parent.templateParser(column.template)(templateArgs, this.parent, 'columnTemplate', templateId, false);
                    append(templateHeader, headerTitle);
                } else {
                    const header: HTMLElement = createElement('div', { className: cls.HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerTitle.appendChild(header);
                    if (column.showItemCount) {
                        const itemCount: HTMLElement = createElement('div', {
                            className: cls.CARD_ITEM_COUNT_CLASS,
                            innerHTML: '- ' + noOfCard.toString() + ' ' + this.parent.localeObj.getConstant('items')
                        });
                        headerTitle.appendChild(itemCount);
                    }
                }
                if (column.allowToggle) {
                    const isExpand: boolean = (column.isExpanded && index === -1) ? true : false;
                    const name: string = (isExpand) ? cls.COLUMN_EXPAND_CLASS : cls.COLUMN_COLLAPSE_CLASS;
                    const icon: HTMLElement = createElement('div', {
                        className: cls.HEADER_ICON_CLASS + ' ' + cls.ICON_CLASS + ' ' + name,
                        attrs: { 'tabindex': '0' }
                    });
                    icon.setAttribute('aria-label', isExpand ? column.keyField + ' Expand' : column.keyField + ' Collapse');
                    th.setAttribute('aria-expanded', isExpand.toString());
                    headerWrapper.appendChild(icon);
                }
                const dataObj: HeaderArgs[] = [{ keyField: column.keyField, textField: column.headerText, count: noOfCard }];
                const args: QueryCellInfoEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this.parent.trigger(events.queryCellInfo, args, (columnArgs: QueryCellInfoEventArgs) => {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th);
                    }
                });
            }
        }
    }

    private renderContent(): void {
        const content: HTMLElement = createElement('div', { className: cls.CONTENT_CLASS });
        this.parent.element.appendChild(content);
        const contentWrap: HTMLElement = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        content.appendChild(contentWrap);
        const contentTable: HTMLElement = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.CONTENT_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        const tBody: HTMLElement = createElement('tbody');
        contentTable.appendChild(tBody);
        let isCollaspsed: boolean = false;
        for (const row of this.kanbanRows) {
            if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneToggleArray.length !== 0) {
                const index: number = this.parent.swimlaneToggleArray.indexOf(row.keyField as string);
                isCollaspsed = index !== -1;
            }
            this.renderSingleContent(tBody, row, isCollaspsed);
        }
    }

    private renderSingleContent(tBody: HTMLElement, row: HeaderArgs, isCollaspsed: boolean): void {
        const className: string = isCollaspsed ? cls.CONTENT_ROW_CLASS + ' ' + cls.COLLAPSED_CLASS : cls.CONTENT_ROW_CLASS;
        const tr: HTMLElement = createElement('tr', { className: className, attrs: { 'aria-expanded': 'true' } });
        for (const column of this.parent.columns) {
            if (this.isColumnVisible(column)) {
                const index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField.toString());
                const className: string = index === -1 ? cls.CONTENT_CELLS_CLASS : cls.CONTENT_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS;
                const dragClass: string = (column.allowDrag ? ' ' + cls.DRAG_CLASS : '') + (column.allowDrop ? ' ' + cls.DROP_CLASS
                    + ' ' + cls.DROPPABLE_CLASS : '');
                const td: HTMLElement = createElement('td', {
                    className: className + dragClass,
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField.toString(), 'aria-expanded': 'true',
                        'tabindex': '0', 'role': 'navigation' }
                });
                if (column.allowToggle && !column.isExpanded || index !== -1) {
                    addClass([td], cls.COLLAPSED_CLASS);
                    const text: string = (column.showItemCount ? '[' + (this.parent.dataModule.isRemote() ?
                        this.parent.columnDataCount[column.keyField] : this.getColumnData(column.keyField).length) +
                        '] ' : '') + column.headerText;
                    td.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                    td.setAttribute('aria-expanded', 'false');
                }
                if (column.showAddButton) {
                    const button: HTMLElement = createElement('div', { className: cls.SHOW_ADD_BUTTON, attrs: { 'tabindex': '-1' } });
                    button.appendChild(createElement('div', { className: cls.SHOW_ADD_ICON + ' ' + cls.ICON_CLASS }));
                    td.appendChild(button);
                }
                tr.appendChild(td);
                if (this.parent.enableVirtualization) {
                    const headerHeight: number = this.parent.element.querySelector('.e-kanban-header').getBoundingClientRect().height;
                    //'15' is reduced for optimal padding in the bottom and to avoid page scrollbar appear in the height auto case.
                    if (this.parent.height === 'auto') {
                        td.style.height = window.innerHeight - (headerHeight + this.parent.element.getBoundingClientRect().top + 15) + 'px';
                    } else {
                        td.style.height = parseInt(formatUnit(this.parent.height).split('px')[0], 10) - (headerHeight + 15) + 'px';
                    }
                }
            }
        }
        const dataObj: HeaderArgs[] = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
        const args: QueryCellInfoEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
        this.parent.trigger(events.queryCellInfo, args, (columnArgs: QueryCellInfoEventArgs) => {
            if (!columnArgs.cancel) {
                if (tBody.classList.contains('e-swimlane-row')) {
                    tBody.insertAdjacentElement('beforebegin', tr);
                } else {
                    tBody.appendChild(tr);
                }
            }
        });
    }

    private windowResize(): void {
        const cloumnsTDElem: NodeListOf<Element> = this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS);
        const headerHeight: number = this.parent.element.querySelector('.e-kanban-header').getBoundingClientRect().height;
        for (let j: number = 0; j < cloumnsTDElem.length; j++) {
            if (this.parent.height === 'auto') {
                (cloumnsTDElem[j as number] as HTMLElement).style.height = window.innerHeight - (headerHeight + this.parent.element.getBoundingClientRect().top + 15) + 'px';
            } else {
                (cloumnsTDElem[j as number] as HTMLElement).style.height = parseInt(formatUnit(this.parent.height).split('px')[0], 10) - (headerHeight + 15) + 'px';
            }
        }
    }

    public refreshColumnData(draggedColumnKey: string, droppedColumnKey: string, requestType?: string, crudKeyField?: string): void {
        const cardRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        const isCRUD: boolean = (requestType === 'cardChanged' || requestType === 'cardCreated' || requestType === 'cardRemoved')
            && !isNoU(crudKeyField);
        cardRows.forEach((tr: HTMLElement) => {
            for (const column of this.parent.columns) {
                if (this.isColumnVisible(column) && (column.keyField === draggedColumnKey || column.keyField === droppedColumnKey)
                    || isCRUD) {
                    let cards: number = 0;
                    let blocks: number[] = [];
                    const columnData: Record<string, any>[] = this.getColumnCards()[column.keyField];
                    const currentColumnDataCount: number = this.parent.dataModule.isRemote() ?
                        this.parent.columnDataCount[column.keyField] : columnData.length;
                    const overallHeight: number = this.cardHeight * currentColumnDataCount;
                    // eslint-disable-next-line prefer-spread
                    blocks = Array.apply(null, Array(currentColumnDataCount)).map(() => ++cards);
                    const columnWrapper: HTMLElement = tr.querySelector('[data-key="' + column.keyField + '"]');
                    const singleIndexCardCount: number = Math.ceil(parseInt(columnWrapper.style.height.split('px')[0], 10) / this.cardHeight);
                    this.offsets[1] = singleIndexCardCount * this.cardHeight;
                    for (let i: number = 1; i < blocks.length; i++) {
                        this.offsets[blocks[i as number]] = (this.offsets[blocks[i - 1]]) + (singleIndexCardCount * this.cardHeight);
                        this.tempOffsets[blocks[i as number]] = this.offsets[blocks[i as number] - 1] | 0;
                    }
                    const cardWrapper: HTMLElement = columnWrapper.querySelector('.' +  cls.CARD_WRAPPER_CLASS);
                    const maxBlock: number = currentColumnDataCount % 2 === 0 ? currentColumnDataCount - 2 : currentColumnDataCount - 1;
                    const viewInfo: VirtualScrollInfo = this.getInfoFromView(this.scrollStatus[column.keyField]);
                    const transformY: number = this.getTranslateY(viewInfo);
                    const cardVirtualElement: HTMLElement = cardWrapper.querySelector('.' + cls.CARD_VIRTUAL_WRAPPER_CLASS);
                    cardVirtualElement.style.maxHeight = currentColumnDataCount * this.cardHeight + 'px';
                    this.setPadding(transformY, cardVirtualElement, currentColumnDataCount);
                    this.currentStatus = {
                        column: column.keyField,
                        columnOverAllHeight: overallHeight,
                        columnHeight: parseInt(columnWrapper.style.height.split('px')[0], 10),
                        previousScrollTop: this.scrollStatus[column.keyField].currentScrollTop,
                        currentScrollTop: cardWrapper.scrollTop,
                        scrollDirection: this.scrollStatus[column.keyField].scrollDirection,
                        currentBlockIndex: this.scrollStatus[column.keyField].currentBlockIndex,
                        oldBlockIndex: this.scrollStatus[column.keyField].oldBlockIndex,
                        offsets: this.offsets,
                        tempOffsets: this.tempOffsets,
                        totalColumnData: currentColumnDataCount,
                        singleIndexCardCount: singleIndexCardCount,
                        maxBlock: maxBlock
                    };
                    this.scrollStatus[column.keyField] = this.currentStatus;
                }
            }
        });
    }

    private renderCards(): void {
        const cardRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        const swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row.e-swimlane-row'));
        const removeTrs: HTMLElement[] = [];
        let columnTransition: boolean = false;
        cardRows.forEach((tr: HTMLElement, index: number) => {
            let dataCount: number = 0;
            for (const column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let cards: number = 0;
                    const currentScrollIndex: number = 0;
                    let blocks: number[] = [];
                    this.offsets = {};
                    this.tempOffsets = {};
                    const columnData: Record<string, any>[] = this.columnData[column.keyField];
                    const currentColumnDataCount: number = this.parent.dataModule.isRemote()
                        ? this.parent.columnDataCount[column.keyField] : columnData.length;
                    dataCount += currentColumnDataCount;
                    const overallHeight: number = (this.cardHeight * currentColumnDataCount) + 7; //7 is difference between top space of the scroll element
                    const columnWrapper: HTMLElement = tr.querySelector('[data-key="' + column.keyField + '"]');
                    const singleIndexCardCount: number = Math.ceil(parseFloat(columnWrapper.style.height.split('px')[0]) / this.cardHeight);
                    const currentColumnBlock: number = singleIndexCardCount > currentColumnDataCount ? currentColumnDataCount :
                        Math.floor(currentColumnDataCount / singleIndexCardCount);
                    // eslint-disable-next-line prefer-spread
                    blocks = Array.apply(null, Array(currentColumnDataCount)).map(() => ++cards);
                    this.offsets[1] = singleIndexCardCount * this.cardHeight + 7;
                    for (let i: number = 1; i < blocks.length; i++) {
                        this.offsets[blocks[i as number]] = (this.offsets[blocks[i - 1]]) + (singleIndexCardCount * this.cardHeight);
                        this.tempOffsets[blocks[i as number]] = this.offsets[blocks[i as number] - 1] | 0;
                    }
                    const cardWrapper: HTMLElement = createElement('div', {
                        className: cls.CARD_WRAPPER_CLASS, attrs: { 'role': 'listbox' }
                    });
                    const cardVirtualWrapper: HTMLElement = createElement('div', {
                        className: cls.CARD_VIRTUAL_WRAPPER_CLASS, attrs: { 'role': 'listbox' }
                    });
                    cardWrapper.appendChild(cardVirtualWrapper);
                    const maxBlock: number = currentColumnBlock % 2 === 0 ? currentColumnBlock : currentColumnBlock + 1;
                    this.currentStatus = {
                        column: column.keyField,
                        columnOverAllHeight: overallHeight,
                        columnHeight: parseInt(columnWrapper.style.height.split('px')[0], 10),
                        previousScrollTop: null,
                        currentScrollTop: cardWrapper.scrollTop,
                        scrollDirection: null,
                        currentBlockIndex: [1, 2],
                        oldBlockIndex: [1, 2],
                        offsets: this.offsets,
                        tempOffsets: this.tempOffsets,
                        totalColumnData: currentColumnDataCount,
                        singleIndexCardCount: singleIndexCardCount,
                        maxBlock: maxBlock
                    };
                    this.scrollStatus[column.keyField] = this.currentStatus;
                    if (column.transitionColumns.length > 0) {
                        columnTransition = true;
                    }
                    if (!columnTransition && isNoU(this.parent.swimlaneSettings.keyField)) {
                        const borderElem: HTMLElement = createElement('div', { className: cls.BORDER_CLASS });
                        columnWrapper.appendChild(borderElem);
                    }
                    columnWrapper.appendChild(cardWrapper);
                    if (currentColumnDataCount > 0) {
                        for (let i: number = currentScrollIndex; i < singleIndexCardCount * 2 && i < columnData.length; i++) {
                            const cardText: string = columnData[i as number][this.parent.cardSettings.headerField] as string;
                            const cardIndex: number = this.parent.actionModule.selectionArray.indexOf(cardText);
                            const cardElement: HTMLElement = this.renderCard(columnData[i as number]);
                            if (cardIndex !== -1) {
                                cardElement.setAttribute('aria-selected', 'true');
                                addClass([cardElement], cls.CARD_SELECTION_CLASS);
                            }
                            const args: CardRenderedEventArgs = { data: columnData[i as number], element: cardElement, cancel: false };
                            this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
                                if (!cardArgs.cancel) {
                                    cardVirtualWrapper.appendChild(cardElement);
                                }
                            });
                        }
                        cardVirtualWrapper.style.maxHeight = this.cardHeight * currentColumnDataCount + 'px';
                    } else {
                        cardVirtualWrapper.appendChild(this.renderEmptyCard());
                    }
                    this.setPadding(0, cardVirtualWrapper, currentColumnDataCount);
                }
            }
            if (dataCount === 0) {
                removeTrs.push(tr);
                if (swimlaneRows.length > 0) {
                    removeTrs.push(swimlaneRows[index as number]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow && (this.parent.kanbanData.length === 0 && !this.parent.showEmptyColumn)) {
            removeTrs.forEach((tr: HTMLElement) => remove(tr));
        }
    }

    private renderCard(data: { [key: string]: string }): HTMLElement {
        const cardElement: HTMLElement = createElement('div', {
            className: cls.CARD_CLASS,
            attrs: {
                'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField],
                'aria-selected': 'false', 'tabindex': '-1', 'role': 'option'
            }
        });
        cardElement.style.height = this.cardHeight - 8 + 'px'; // Since in the public card height calculation margin bottom is added, so it reduced here.
        if (this.parent.cardSettings.template) {
            addClass([cardElement], cls.TEMPLATE_CLASS);
            const templateId: string = this.parent.element.id + '_cardTemplate';
            const cardTemplate: HTMLElement[] = this.parent.templateParser(
                this.parent.cardSettings.template)(data, this.parent, 'cardTemplate', templateId, false);
            append(cardTemplate, cardElement);
        } else {
            const tooltipClass: string = this.parent.enableTooltip ? ' ' + cls.TOOLTIP_TEXT_CLASS : '';
            if (this.parent.cardSettings.showHeader) {
                const cardHeader: HTMLElement = createElement('div', { className: cls.CARD_HEADER_CLASS });
                const cardCaption: HTMLElement = createElement('div', { className: cls.CARD_HEADER_TEXT_CLASS });
                const cardText: HTMLElement = createElement('div', {
                    className: cls.CARD_HEADER_TITLE_CLASS + tooltipClass,
                    innerHTML: data[this.parent.cardSettings.headerField] || ''
                });
                cardHeader.appendChild(cardCaption);
                cardCaption.appendChild(cardText);
                cardElement.appendChild(cardHeader);
            }
            const cardContent: HTMLElement = createElement('div', {
                className: cls.CARD_CONTENT_CLASS + tooltipClass,
                innerHTML: data[this.parent.cardSettings.contentField] || ''
            });
            cardElement.appendChild(cardContent);
            if (this.parent.cardSettings.tagsField && data[this.parent.cardSettings.tagsField]) {
                const cardTags: HTMLElement = createElement('div', { className: cls.CARD_TAGS_CLASS });
                const tags: string[] = data[this.parent.cardSettings.tagsField].toString().split(',');
                for (const tag of tags) {
                    cardTags.appendChild(createElement('div', {
                        className: cls.CARD_TAG_CLASS + ' ' + cls.CARD_LABEL_CLASS, innerHTML: tag
                    }));
                }
                cardElement.appendChild(cardTags);
            }
            if (this.parent.cardSettings.grabberField && data[this.parent.cardSettings.grabberField]) {
                addClass([cardElement], cls.CARD_COLOR_CLASS);
                cardElement.style.borderLeftColor = data[this.parent.cardSettings.grabberField];
            }
            if (this.parent.cardSettings.footerCssField) {
                const cardFields: HTMLElement = createElement('div', { className: cls.CARD_FOOTER_CLASS });
                const keys: string[] = data[this.parent.cardSettings.footerCssField].split(',');
                for (const key of keys) {
                    cardFields.appendChild(createElement('div', {
                        className: key.trim() + ' ' + cls.CARD_FOOTER_CSS_CLASS
                    }));
                }
                cardElement.appendChild(cardFields);
            }
        }
        return cardElement;
    }

    private renderEmptyCard(): HTMLElement {
        const emptyCard: HTMLElement = createElement('span', {
            className: cls.EMPTY_CARD_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noCard')
        });
        return emptyCard;
    }

    private renderColGroup(table: HTMLElement): void {
        const colGroup: HTMLElement = createElement('colgroup');
        this.parent.columns.forEach((column: ColumnsModel) => {
            if (this.isColumnVisible(column)) {
                const index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField.toString());
                const isToggle: boolean = column.allowToggle && !column.isExpanded;
                const className: string = index === -1 ? (isToggle ? cls.COLLAPSED_CLASS : '') : cls.COLLAPSED_CLASS;
                const col: HTMLElement = createElement('col', {
                    className: className,
                    attrs: { 'data-key': column.keyField.toString() },
                    styles: this.parent.isAdaptive ? 'width: ' +
                        (isToggle ? formatUnit(events.toggleWidth) : formatUnit(this.getWidth())) : ''
                });
                colGroup.appendChild(col);
            }
        });
        table.appendChild(colGroup);
    }

    private getRows(): HeaderArgs[] {
        const kanbanRows: HeaderArgs[] = [];
        kanbanRows.push({ keyField: '', textField: '' });
        return kanbanRows;
    }

    private createStackedRow(rows: StackedHeadersModel[]): HTMLElement {
        const tr: HTMLElement = createElement('tr', { className: cls.HEADER_ROW_CLASS + ' ' + cls.STACKED_HEADER_ROW_CLASS });
        const stackedHeaders: string[] = [];
        this.parent.columns.forEach((column: ColumnsModel) => {
            let headerText: string = '';
            for (const row of rows) {
                if (row.keyFields.indexOf(column.keyField.toString()) !== -1) {
                    headerText = row.text;
                }
            }
            stackedHeaders.push(headerText);
        });
        for (let h: number = 0; h < stackedHeaders.length; h++) {
            let colSpan: number = 1;
            for (let j: number = h + 1; j < stackedHeaders.length; j++) {
                if ((stackedHeaders[h as number] !== '') && (stackedHeaders[j as number] !== '') && stackedHeaders[h as number] === stackedHeaders[j as number]) {
                    colSpan++;
                } else {
                    break;
                }
            }
            const div: HTMLElement = createElement('div', { className: cls.HEADER_TEXT_CLASS, innerHTML: stackedHeaders[h as number] });
            const th: HTMLElement = createElement('th', {
                className: cls.HEADER_CELLS_CLASS + ' ' + cls.STACKED_HEADER_CELL_CLASS,
                attrs: { 'colspan': colSpan.toString() }
            });
            tr.appendChild(th).appendChild(div);
            h += colSpan - 1;
        }
        return tr;
    }

    private scrollUiUpdate(): void {
        const header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        let height: number = this.parent.element.offsetHeight - header.offsetHeight;
        if (this.parent.isAdaptive) {
            height = window.innerHeight - (header.offsetHeight + events.bottomSpace);
            const swimlaneToolbar: HTMLElement = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS) as HTMLElement;
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            const cardWrappers: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
            cardWrappers.forEach((cell: HTMLElement) => {
                const cardWrapper: HTMLElement = cell.querySelector('.' + cls.CARD_WRAPPER_CLASS);
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
        this.updateScrollPosition();
    }

    private onContentScroll(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        const header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        [].slice.call(header.children).forEach((node: HTMLElement) => { node.scrollLeft = target.scrollLeft; });
        this.parent.scrollPosition.content = { left: target.scrollLeft, top: target.scrollTop };
    }

    private getOffset(block: number, viewInfo: VirtualScrollInfo): number {
        return Math.min(viewInfo.offsets[block as number] | 0, viewInfo.offsets[viewInfo.maxBlock] | 0);
    }

    private getTranslateY(viewInfo: VirtualScrollInfo): number {
        const block: number = (viewInfo.newBlockIndex[0] || 1) - 1;
        const translate: number = this.getOffset(block, viewInfo);
        const endTranslate: number = this.getOffset(viewInfo.newBlockIndex[viewInfo.newBlockIndex.length - 1], viewInfo);
        const result: number = translate > viewInfo.currentScrollTop ?
            this.getOffset(block - 1, viewInfo) : endTranslate < (viewInfo.currentScrollTop + viewInfo.columnHeight) ?
                this.getOffset(block + 1, viewInfo) : translate;
        return result;
    }

    private setPadding(
        paddingTop: number, scrollElem: HTMLElement, dataCount: number, isScrolledToLast?: boolean, direction?: string
    ): void {
        if (isScrolledToLast && direction === 'down') {
            scrollElem.style.paddingTop = `${paddingTop}px` ;
            scrollElem.style.paddingBottom = '0px';
        } else {
            scrollElem.style.paddingTop = `${paddingTop}px`;
            scrollElem.style.paddingBottom = `${this.cardHeight * dataCount  - paddingTop}px`;
        }
    }

    private getData(keyField: string, column: string, take: number, skip: number): Promise<Object> {
        const query: Query = this.query.clone();
        const predicate: Predicate = new Predicate(keyField, 'equal', column, true);
        query.where(predicate);
        query.take(take);
        query.skip(skip);
        query.addParams('KanbanVirtualScroll', 'KanbanVirtualScroll');
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            const def: Deferred = this.eventPromise({ requestType: '' }, query);
            return def.promise;
        }
        return this.parent.dataModule.dataManager.executeQuery(query);
    }

    private eventPromise(args: ActionEventArgs, query: Query): Deferred {
        const state: DataStateChangeEventArgs = this.getStateEventArgument(query);
        const def: Deferred = new Deferred();
        state.updateData = def.resolve;
        state.action = args;
        return def;
    }

    private getStateEventArgument(query: Query): Object {
        const adaptr: UrlAdaptor = new UrlAdaptor();
        const dm: DataManager = new DataManager({ url: '', adaptor: new UrlAdaptor });
        const state: { data?: string, pvtData?: Object[] } = adaptr.processQuery(dm, query);
        const data: Object = JSON.parse(state.data);
        return extend(data, state.pvtData);
    }

    private dataManagerSuccess(e: ReturnType, type?: string): Record<string, any>[] {
        let resultData: Record<string, any>[];
        if (type) {
            resultData = extend([], !isNoU((e.result as any).result) ?
                (e.result as Record<string, any>).result : e.result, null, true) as Record<string, any>[];
        }
        else{
            this.parent.trigger(events.dataBinding, e, (args: ReturnType) => {
                resultData = extend([], !isNoU((args.result as any).result) ?
                    (args.result as any).result : args.result, null, true) as Record<string, any>[];
                this.parent.trigger(events.dataBound, null, () => this.parent.hideSpinner());
            });
        }
        return resultData;
    }

    private dataManagerFailure(e: ReturnType): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }

    private onColScrollShowSkeleton(args: Event): void {
        const target: HTMLElement = args.target as HTMLElement;
        if (this.parent.element.querySelectorAll('.e-card-skeleton-wrapper').length > 0) {
            return;
        }
        const key: string = target.parentElement.getAttribute('data-key');
        const previousScrollTop: number = this.scrollStatus[key as string].previousScrollTop;
        const parentElemHeight: number = target.parentElement.clientHeight;
        if ((target.scrollTop - previousScrollTop) > parentElemHeight || (previousScrollTop - target.scrollTop) > parentElemHeight) {
            this.showSkeleton(target as HTMLElement, this.scrollStatus[key as string].singleIndexCardCount);
        }
    }

    private showSkeleton(cardWrapper: HTMLElement, skeletonCount: number): void {
        const cardVirtualSkeletonWrapper: HTMLElement = createElement('div', {
            className: 'e-card-virtual-skeleton-wrapper', attrs: { 'role': 'listbox' }
        });
        cardWrapper.parentElement.insertBefore(cardVirtualSkeletonWrapper, cardWrapper);
        cardVirtualSkeletonWrapper.style.position = 'absolute';
        cardVirtualSkeletonWrapper.style.zIndex = '10';
        for (let j: number = 0; j < skeletonCount; j++) {
            const skeletonWrapper: HTMLElement = createElement('div', {className: 'e-card-skeleton-wrapper'});
            const skeleton: HTMLElement = createElement('span', {className: 'e-skeleton e-skeleton-text e-shimmer-wave'});
            skeleton.style.height = this.cardHeight + 'px';
            // Assumption fix, issue reproduce in rare cases only .
            if (!isNoU(cardWrapper.querySelector('.e-card'))) {
                skeleton.style.width = cardWrapper.querySelector('.e-card').getBoundingClientRect().width + 'px';
            }
            skeletonWrapper.appendChild(skeleton);
            cardVirtualSkeletonWrapper.appendChild(skeletonWrapper);
        }
    }

    private hideSkeleton(cardWrapper: HTMLElement): void {
        setTimeout(() => {
            const skeletonWrapper: NodeListOf<Element> = cardWrapper.querySelectorAll('.e-card-virtual-skeleton-wrapper');
            for (let i: number = 0; i < skeletonWrapper.length; i++) {
                detach(skeletonWrapper[i as number]);
            }
        }, 50);
    }

    private onColumnScroll(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        const currentScrolledHeight: number = target.scrollTop;
        let columnKey: string;
        if (target.offsetParent) {
            columnKey = target.offsetParent.getAttribute('data-key');
            this.parent.scrollPosition.column[columnKey as string] = { left: target.scrollLeft, top: target.scrollTop };
        }
        if (this.parent.enableVirtualization) {
            const cardWrapper: HTMLElement = target;
            let dataCount: number = 0;
            const columnData: Record<string, any>[] = this.getColumnCards()[columnKey as string];
            const currentColumnDataCount: number = this.parent.dataModule.isRemote() ?
                this.parent.columnDataCount[columnKey as string] : columnData.length;
            dataCount += currentColumnDataCount;
            const overallHeight: number = this.cardHeight * dataCount;
            let removeIndex: number[] = [];
            let addIndex: number[] = [];
            this.checkScrollDirection(columnKey as string, currentScrolledHeight);
            if (this.findScrollSpeed(target, columnKey as string) === 'fast' && currentScrolledHeight > overallHeight) {
                this.hideSkeleton(cardWrapper.parentElement);
                return;
            }
            const maxBlock: number = this.scrollStatus[columnKey as string].maxBlock;
            const isLastBlockRendered: boolean = this.scrollStatus[columnKey as string].currentBlockIndex.indexOf(maxBlock) > -1;
            const isDuplicateScroll: boolean = e.timeStamp - this.scrollStatus[columnKey as string].previousTimeStamps < 300;
            if (isLastBlockRendered && !isNoU(this.scrollStatus[columnKey as string].previousTimeStamps) && isDuplicateScroll) {
                this.hideSkeleton(cardWrapper.parentElement);
                return;
            }
            this.scrollStatus[columnKey as string].previousTimeStamps = e.timeStamp;
            const viewInfo: VirtualScrollInfo = this.getInfoFromView(this.scrollStatus[columnKey as string]);
            removeIndex = viewInfo.currentBlockIndex.filter(function(val: number): boolean {
                return viewInfo.newBlockIndex.indexOf(val) === -1;
            });
            addIndex = viewInfo.newBlockIndex.filter(function(val: number): boolean  {
                return viewInfo.currentBlockIndex.indexOf(val) === -1;
            });
            const isScrolledToLast: boolean = currentScrolledHeight + target.clientHeight >= overallHeight;
            const transformY: number = isScrolledToLast ? overallHeight - (cardWrapper.querySelector('.' + cls.CARD_VIRTUAL_WRAPPER_CLASS).childElementCount * this.cardHeight)
                : this.getTranslateY(viewInfo);
            const cardVirtualElement: HTMLElement = cardWrapper.querySelector('.' + cls.CARD_VIRTUAL_WRAPPER_CLASS);
            if (removeIndex.length > 0) {
                let removeStartIndex: number;
                let removeEndIndex: number;
                if (removeIndex[0] === 1) {
                    removeStartIndex = 0;
                    removeEndIndex = (removeIndex.length * this.scrollStatus[columnKey as string].singleIndexCardCount) - 1;
                } else {
                    removeStartIndex = ((removeIndex[0] - 1) * this.scrollStatus[columnKey as string].singleIndexCardCount);
                    removeEndIndex = removeStartIndex + (removeIndex.length * this.scrollStatus[columnKey as string].singleIndexCardCount);
                }
                this.removeCardsOnScroll(
                    cardVirtualElement, this.scrollStatus[columnKey as string].scrollDirection === 'down' ? true : false, removeStartIndex, removeEndIndex
                );
            }
            if (addIndex.length > 0) {
                if (this.parent.dataModule.isRemote()) {
                    const visibleStartIndex: number = ((addIndex[0] - 1) * this.scrollStatus[columnKey as string].singleIndexCardCount);
                    let resultData: Record<string, any>[] = [];
                    const dataManager: Promise<Object> = this.getData(
                        this.parent.keyField, columnKey, (this.scrollStatus[columnKey as string].singleIndexCardCount * addIndex.length
                        ), visibleStartIndex);
                    dataManager.then((e: ReturnType) => {
                        resultData = this.dataManagerSuccess(e);
                        this.scrollCardInsert(
                            columnKey, cardVirtualElement,
                            target, currentScrolledHeight, cardWrapper,
                            this.scrollStatus[columnKey as string].scrollDirection === 'down' ? 0 : (resultData.length - 1),
                            true, resultData, null);
                    }
                    ).catch((e: ReturnType) => this.dataManagerFailure(e));
                } else {
                    const visibleStartIndex: number = this.scrollStatus[columnKey as string].scrollDirection === 'down' ? ((addIndex[0] - 1) * this.scrollStatus[columnKey as string].singleIndexCardCount) :
                        ((addIndex[0] - 1) * this.scrollStatus[columnKey as string].singleIndexCardCount)
                        + (this.scrollStatus[columnKey as string].singleIndexCardCount * addIndex.length) - 1;
                    const visibleLength: number = this.scrollStatus[columnKey as string].scrollDirection === 'down' ? visibleStartIndex + (this.scrollStatus[columnKey as string].singleIndexCardCount * addIndex.length) :
                        ((addIndex[0] - 1) * this.scrollStatus[columnKey as string].singleIndexCardCount);
                    this.scrollCardInsert(
                        columnKey, cardVirtualElement,
                        target, currentScrolledHeight, cardWrapper,
                        visibleStartIndex,
                        false, columnData, visibleLength);
                }
            }
            this.scrollStatus[columnKey as string].currentBlockIndex = this.scrollStatus[columnKey as string].newBlockIndex;
            this.setPadding(transformY, cardVirtualElement, currentColumnDataCount, isScrolledToLast,
                            this.scrollStatus[columnKey as string].scrollDirection);
            viewInfo.currentBlockIndex = viewInfo.newBlockIndex;
            this.parent.renderTemplates();
            this.hideSkeleton(cardWrapper.parentElement);
        }
    }

    private checkScrollDirection(columnKey: string, currentScrolledHeight: number): void {
        // Update the previous and current scroll top value
        this.scrollStatus[columnKey as string].previousScrollTop = this.scrollStatus[columnKey as string].currentScrollTop;
        this.scrollStatus[columnKey as string].currentScrollTop = currentScrolledHeight;
        // Check the scroll direction
        if (currentScrolledHeight > this.scrollStatus[columnKey as string].previousScrollTop) {
            this.scrollStatus[columnKey as string].scrollDirection = 'down';
        }
        else {
            this.scrollStatus[columnKey as string].scrollDirection = 'up';
        }
    }

    private findScrollSpeed(target: HTMLElement , columnKey: string): string {
        // Find the scroll speed
        if (this.scrollStatus[columnKey as string].scrollDirection === 'down' &&
        (target.scrollTop - this.scrollStatus[columnKey as string].previousScrollTop > target.clientHeight)) {
            return 'fast';
        } else if (this.scrollStatus[columnKey as string].scrollDirection === 'up' &&
        (this.scrollStatus[columnKey as string].previousScrollTop - target.scrollTop > target.clientHeight)) {
            return 'fast';
        }
        return 'slow';
    }

    private removeCardsOnScroll(cardVirtualElement: HTMLElement, isDown: boolean, removeStartIndex: number, removeEndIndex: number): void {
        const columnKey: string = cardVirtualElement.parentElement.parentElement.getAttribute('data-key');
        const columnCardCount: number = this.scrollStatus[columnKey as string].totalColumnData;
        const columnThreshold: number = 30;
        if (columnCardCount <= columnThreshold) {
            return;
        }
        for (let j: number = removeStartIndex; j < removeEndIndex; j++) {
            let removableElem: HTMLElement = isDown ? cardVirtualElement.firstChild as HTMLElement
                : cardVirtualElement.lastChild as HTMLElement;
            while (!isNoU(removableElem) && (removableElem.classList.contains(cls.DRAGGED_CARD_CLASS) ||
            removableElem.classList.contains(cls.DRAGGED_CLONE_CLASS) ||
            removableElem.classList.contains(cls.DROPPED_CLONE_CLASS) ||
            removableElem.classList.contains(cls.CLONED_CARD_CLASS))) {
                removableElem = isDown ? removableElem.nextSibling as HTMLElement : removableElem.previousSibling as HTMLElement;
            }
            if (!isNoU(removableElem)) {
                detach(removableElem);
            }
        }
    }

    private scrollCardInsert(
        columnKey: string, cardVirtualElement: HTMLElement,
        target: HTMLElement, currentScrolledHeight: number, cardWrapper: HTMLElement,
        startNumber: number, isRemote: boolean, resultData: Record<string, any>[], visibleLength?: number): void {
        const conditonsScrollDownCase: number = isRemote ? resultData.length : visibleLength;
        const conditonsScrollUpCase: number = isRemote ? 0 : visibleLength;
        if (resultData.length > 0) {
            for (let j: number = startNumber; this.scrollStatus[columnKey as string].scrollDirection === 'down' ? (j < conditonsScrollDownCase) :
                j >= conditonsScrollUpCase; this.scrollStatus[columnKey as string].scrollDirection === 'down' ? j++ : j--) {
                if (!isNoU(resultData[j as number])) {
                    const cardText: string = resultData[j as number][this.parent.cardSettings.headerField] as string;
                    const cardIndex: number = this.parent.actionModule.selectionArray.indexOf(cardText);
                    const cardElement: HTMLElement = this.renderCard(resultData[j as number]);
                    if (cardIndex !== -1) {
                        cardElement.setAttribute('aria-selected', 'true');
                        addClass([cardElement], cls.CARD_SELECTION_CLASS);
                    }
                    const args: CardRenderedEventArgs = { data: resultData[j as number], element: cardElement, cancel: false };
                    this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
                        if (!cardArgs.cancel) {
                            if (this.scrollStatus[columnKey as string].scrollDirection === 'down') {
                                cardVirtualElement.appendChild(cardElement);
                            } else {
                                cardVirtualElement.insertBefore(cardElement, cardVirtualElement.firstChild);
                            }
                            this.parent.dragAndDropModule.wireDragEvents(cardElement);
                            addClass([cardElement], cls.DROPPABLE_CLASS);
                        }
                    });
                }
            }
            target.scrollTop = currentScrolledHeight;
        } else {
            cardWrapper.appendChild(this.renderEmptyCard());
        }
    }

    public ensureColumnNotEmpty(draggedColumnKey: string): void {
        const singleIndexCardCount: number = this.scrollStatus[draggedColumnKey as string].singleIndexCardCount;
        const draggedColumnData: Record<string, any>[] = this.columnData[draggedColumnKey as string];
        const draggedTdColummElement: HTMLElement = this.parent.element.querySelector('.e-content-row:not(.e-swimlane-row) [data-key="' + draggedColumnKey + '"]');
        const wrapperELement: HTMLElement = draggedTdColummElement.querySelector('.' + cls.CARD_VIRTUAL_WRAPPER_CLASS);
        const cardsList: NodeList = wrapperELement.querySelectorAll('.' + cls.CARD_CLASS);
        if (cardsList.length > 0) {
            const lastCardDataId: string = (cardsList[cardsList.length - 1] as HTMLElement).getAttribute('data-id');
            const firstCardDataId: string = (cardsList[0] as HTMLElement).getAttribute('data-id');
            let lastCardIndex: number;
            let firstCardIndex: number;
            if (cardsList.length < singleIndexCardCount * 2) {
                for (let i: number = 0; i < draggedColumnData.length; i++) {
                    if (lastCardDataId === (draggedColumnData[i as number][this.parent.cardSettings.headerField]).toString()) {
                        lastCardIndex = i;
                    }
                    if (firstCardDataId === (draggedColumnData[i as number][this.parent.cardSettings.headerField]).toString()) {
                        firstCardIndex = i;
                    }
                }
                const cardCount: number = cardsList.length;
                for (let i: number = cardCount; i < singleIndexCardCount * 2; i++) {
                    const isLast: boolean = lastCardIndex === draggedColumnData.length - 1 ? true : false;
                    const nextCardIndex: number = lastCardIndex < draggedColumnData.length ? lastCardIndex + 1 : firstCardIndex - 1;
                    if (nextCardIndex <= draggedColumnData.length) {
                        const nextCardData: Record<string, any> = draggedColumnData[nextCardIndex as number];
                        if (!isNoU(nextCardData)) {
                            const nextCard: HTMLElement = this.renderCard(nextCardData);
                            this.triggerCardRendering(nextCard, nextCardIndex, draggedColumnData, wrapperELement, isLast);
                            if (isLast) {
                                firstCardIndex = nextCardIndex;
                            } else {
                                lastCardIndex = nextCardIndex;
                            }
                        }
                    }
                }
            }
        }
    }

    private triggerCardRendering(
        nextCard: HTMLElement, nextCardIndex: number, draggedColumnData: Record<string, any>[], wrapperELement: HTMLElement,
        isLast: boolean): void {
        const cardText: string = draggedColumnData[nextCardIndex as number][this.parent.cardSettings.headerField] as string;
        const cardIndex: number = this.parent.actionModule.selectionArray.indexOf(cardText);
        if (cardIndex !== -1) {
            nextCard.setAttribute('aria-selected', 'true');
            addClass([nextCard], cls.CARD_SELECTION_CLASS);
        }
        const args: CardRenderedEventArgs = { data: draggedColumnData[nextCardIndex as number], element: nextCard, cancel: false };
        this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
            if (!cardArgs.cancel) {
                if (!isLast) {
                    wrapperELement.appendChild(nextCard);
                } else {
                    wrapperELement.insertBefore(nextCard, wrapperELement.querySelectorAll('.' + cls.CARD_CLASS)[0] as HTMLElement);
                }
                this.parent.dragAndDropModule.wireDragEvents(nextCard);
                addClass([nextCard], cls.DROPPABLE_CLASS);
            }
        });
    }


    private ensureBlocks(info: VirtualScrollInfo): number[] {
        let index: number = info.newBlockIndex[info.block];
        const maxPage: number = Math.ceil(info.totalColumnData / info.singleIndexCardCount);
        const max: Function = Math.max;
        let indexes: number[];
        if (info.scrollDirection === 'down') {
            indexes = index >= maxPage ? [max(index, 1), --index, --index].reverse() :
                (index + 1 >= maxPage ? [max(index - 1, 1),  index, ++index] :
                    [max(index, 1), ++index, ++index]);
        } else {
            indexes = index === maxPage ? [max(index - 2, 1), max(index - 1, 1), index] :
                [max(index - 1, 1), index, index + 1];
        }
        // eslint-disable-next-line
        return indexes.filter(indexRemoveZero => indexRemoveZero > 0);
    }

    private getInfoFromView(scrollStatus: VirtualScrollInfo): VirtualScrollInfo {
        let isBlockAdded: boolean = false;
        const infoType: VirtualScrollInfo = scrollStatus;
        infoType.page = this.getPageFromTop(scrollStatus);
        infoType.newBlockIndex = this.getBlockIndexes(infoType.page);
        const blocks: number[] = this.ensureBlocks(infoType);
        if (infoType.newBlockIndex.toString() !== blocks.toString()) {
            // To avoid dupilcate row index problem in key focus support
            const newBlock: number = blocks[blocks.length - 1];
            if (infoType.newBlockIndex.indexOf(newBlock) === -1) {
                isBlockAdded = true;
            }
        }
        infoType.newBlockIndex = isBlockAdded ? blocks : infoType.newBlockIndex;
        return infoType;
    }

    private getBlockIndexes(page: number): number[] {
        return [page + (page - 1), page * 2];
    }

    private getPageFromTop(info: VirtualScrollInfo): number {
        const total: number = info.totalColumnData;
        let page: number = 0;
        this.offsetKeys = Object.keys(info.offsets);
        this.offsetKeys.some((offset: string) => {
            let iOffset: number = Number(offset);
            const border: boolean = info.currentScrollTop <= info.offsets[parseInt(offset, 10)]
                || (iOffset === total && info.currentScrollTop > info.offsets[parseInt(offset, 10)]);
            if (border) {
                const maxPage: number = Math.ceil(total / info.singleIndexCardCount);
                if (this.offsetKeys.length % 2 !== 0 && iOffset.toString() === this.offsetKeys[this.offsetKeys.length - 2]
                    && info.currentScrollTop <= info.offsets[this.offsetKeys.length - 1]) {
                    iOffset = (iOffset + 1) > maxPage ? maxPage : iOffset + 1;
                }
                iOffset = iOffset > maxPage ? maxPage : iOffset;
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(this.getPage(iOffset, maxPage), maxPage));
            }
            return border;
        });
        return page;
    }

    private getPage(block: number, maxPage: number): number {
        if (block + 1 > maxPage) {
            return block % 2 === 0 ? block / 2 : (block - 1) / 2;
        } else {
            return block % 2 === 0 ? block / 2 : (block + 1) / 2;
        }
    }

    private onAdaptiveScroll(e: Event): void {
        if (this.parent.touchModule.tabHold && !this.parent.touchModule.mobilePopup) {
            e.preventDefault();
        }
    }

    /**
     * Check column is visible or not.
     *
     * @param {ColumnsModel} column - specifies the column.
     * @returns {boolean} - Check column is visible or not.
     * @private
     * @hidden
     */
    public isColumnVisible(column: ColumnsModel): boolean {
        let isVisible: boolean = false;
        const isNumeric: boolean = typeof column.keyField === 'number';
        if (isNumeric) {
            isVisible = this.parent.actionModule.hideColumnKeys.indexOf(column.keyField.toString()) === -1;
        } else {
            (column.keyField as string).split(',').forEach((key: string) => { isVisible = this.parent.actionModule.hideColumnKeys.indexOf(key) === -1; });
        }
        return isVisible;
    }

    private renderLimits(column: ColumnsModel, target: HTMLElement): void {
        const limits: HTMLElement = createElement('div', { className: cls.LIMITS_CLASS });
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
        this.parent.columns.forEach((column: ColumnsModel) => {
            if (!column.minCount && !column.maxCount) {
                return;
            }
            const cardData: Record<string, any>[] = this.columnData[column.keyField];
            const keySelector: string = `[data-key="${column.keyField}"]`;
            const headerCell: HTMLElement = this.parent.element.querySelector(`.${cls.HEADER_CELLS_CLASS + keySelector}`) as HTMLElement;
            const rowCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.CONTENT_CELLS_CLASS + keySelector}`));
            this.renderLimits(column, headerCell);
            const colorClass: string = this.getValidationClass(column, cardData.length);
            if (colorClass) {
                addClass(rowCells.concat(headerCell), colorClass);
            }
        });
    }

    private getValidationClass(column: ColumnsModel, count: number): string {
        let colorClass: string;
        if (column.maxCount && count > column.maxCount) {
            colorClass = cls.MAX_COLOR_CLASS;
        } else if (column.minCount && count < column.minCount) {
            colorClass = cls.MIN_COLOR_CLASS;
        }
        return colorClass;
    }

    private refreshValidation(): void {
        const validations: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.LIMITS_CLASS));
        validations.forEach((node: HTMLElement) => { remove(node); });
        const minClass: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MIN_COLOR_CLASS));
        removeClass(minClass, cls.MIN_COLOR_CLASS);
        const maxClass: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MAX_COLOR_CLASS));
        removeClass(maxClass, cls.MAX_COLOR_CLASS);
        this.renderValidation();
    }

    public getColumnData(columnValue: string | number, dataSource: Record<string, any>[] = this.parent.kanbanData)
        : Record<string, any>[] {
        let cardData: Record<string, any>[] = [];
        const isNumeric: boolean = typeof columnValue === 'number';
        if (isNumeric) {
            const keyData: Record<string, any>[] = dataSource.filter((cardObj: Record<string, any>) =>
                cardObj[this.parent.keyField] === columnValue);
            cardData = cardData.concat(keyData);
        } else {
            const columnKeys: string[] = (columnValue as string).split(',');
            for (const key of columnKeys) {
                const keyData: Record<string, any>[] = dataSource.filter((cardObj: Record<string, any>) =>
                    cardObj[this.parent.keyField] === key.trim());
                cardData = cardData.concat(keyData);
            }
        }
        this.sortCategory(cardData);
        return cardData;
    }

    private sortCategory(cardData: Record<string, any>[]): Record<string, any>[] {
        let key: string = this.parent.cardSettings.headerField;
        const direction: string = this.parent.sortSettings.direction;
        switch (this.parent.sortSettings.sortBy) {
        case 'DataSourceOrder':
            this.sortOrder(key, direction, cardData);
            break;
        case 'Custom':
        case 'Index':
            if (this.parent.sortSettings.field) {
                key = this.parent.sortSettings.field;
            }
            this.sortOrder(key, direction, cardData);
            break;
        }
        return cardData;
    }

    public sortOrder(key: string, direction: string, cardData: Record<string, any>[]): Record<string, any>[] {
        let isNumeric: boolean = true;
        if (this.parent.kanbanData.length > 0) {
            isNumeric = typeof (this.parent.kanbanData[0])[key as string] === 'number';
        }
        if (!isNumeric && this.parent.sortSettings.sortBy === 'Index') {
            return cardData;
        }
        let first: string | number;
        let second: string | number;
        cardData = cardData.sort((firstData: { [key: string]: string | number }, secondData: { [key: string]: string | number }) => {
            if (!isNumeric) {
                first = (firstData[key as string] as string).toLowerCase();
                second = (secondData[key as string] as string).toLowerCase();
            } else {
                first = (firstData[key as string] as number);
                second = (secondData[key as string] as number);
            }
            return (first > second) ? 1 : ((second > first) ? -1 : 0);
        });
        if (direction === 'Descending') {
            cardData.reverse();
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
        const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.CARD_CLASS}.${cls.CARD_SELECTION_CLASS}`));
        removeClass(cards, cls.CARD_SELECTION_CLASS);
        this.disableAttributeSelection(cards);
    }

    public disableAttributeSelection(cards: HTMLElement[] | Element): void {
        if (cards instanceof Element) {
            cards.setAttribute('aria-selected', 'false');
        } else {
            cards.forEach((card: HTMLElement) => { card.setAttribute('aria-selected', 'false'); });
        }
    }

    public getColumnCards(data?: Record<string, any>[]): Record<string, any[]> {
        const columnData: Record<string, any[]> = {};
        this.columnKeys = [];
        this.parent.columns.forEach((column: ColumnsModel) => {
            const isNumeric: boolean = typeof column.keyField === 'number';
            if (isNumeric) {
                this.columnKeys = this.columnKeys.concat(column.keyField.toString());
            } else {
                this.columnKeys = this.columnKeys.concat((column.keyField as string).split(',').map((e: string) => e.trim()));
            }
            const cardData: Record<string, any>[] = this.getColumnData(column.keyField, data);
            columnData[column.keyField] = cardData;
        });
        return columnData;
    }

    public refreshHeaders(): void {
        const header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        [].slice.call(header.children).forEach((child: HTMLElement) => remove(child));
        this.renderHeader(header);
    }

    public refreshCards(): void {
        this.parent.resetTemplates(['cardTemplate']);
        const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_VIRTUAL_WRAPPER_CLASS));
        cards.forEach((card: HTMLElement) => remove(card));
        this.renderCards();
        this.wireDragEvent();
        this.parent.renderTemplates();
    }

    public refresh(): void {
        let isColumnTemplateRefreshed: boolean = false;
        this.parent.columns.forEach((column: ColumnsModel) => {
            if (column.showItemCount) {
                if (column && column.template && !isColumnTemplateRefreshed) {
                    this.refreshHeaders();
                    isColumnTemplateRefreshed = true;
                }
                const countSelector: string = `.${cls.HEADER_CELLS_CLASS}[data-key="${column.keyField}"] .${cls.CARD_ITEM_COUNT_CLASS}`;
                const itemCount: Element = this.parent.element.querySelector(countSelector);
                if (itemCount) {
                    const columnDataLength: number = this.parent.dataModule.isRemote() ? this.parent.columnDataCount[column.keyField]
                        : this.columnData[column.keyField].length;
                    const isNumeric: boolean = typeof column.keyField === 'number';
                    let cardLength: number = 0;
                    if (isNumeric) {
                        cardLength = ([].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS + '[data-key="' + column.keyField + '"]'))).length;
                    } else {
                        const keys: string[] = (column.keyField as string).split(',');
                        for (const key of keys) {
                            const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS + '[data-key="' + key.trim() + '"]'));
                            cardLength = cards.length + cardLength;
                        }
                    }
                    itemCount.innerHTML = '- ' + columnDataLength + ' ' + this.parent.localeObj.getConstant('items');
                }
            }
        });
        this.refreshValidation();
    }

    public updateScrollPosition(): void {
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            if (!Browser.isIE) {
                content.scrollTo(this.parent.scrollPosition.content.left, this.parent.scrollPosition.content.top);
            } else {
                content.scrollTop = this.parent.scrollPosition.content.top;
                content.scrollLeft = this.parent.scrollPosition.content.left;
            }
        }
        const cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper: HTMLElement) => {
            if (wrapper.offsetParent) {
                const scrollData: ScrollOffset = this.parent.scrollPosition.column[wrapper.offsetParent.getAttribute('data-key')];
                if (scrollData) {
                    if (!Browser.isIE) {
                        wrapper.scrollTo(scrollData.left, scrollData.top);
                    } else {
                        wrapper.scrollTop = scrollData.top;
                        wrapper.scrollLeft = scrollData.left;
                    }
                }
            }
        });
    }

    public renderCardBasedOnIndex(data: Record<string, any>, index?: number, isDropped?: boolean , requestType?: string): void {
        const key: string = data[this.parent.keyField] as string;
        const cardRow: HTMLElement = this.parent.element.querySelector('.e-content-row:not(.e-swimlane-row)') as HTMLElement;
        if (this.parent.sortSettings.sortBy !== 'Index') {
            let field: string = this.parent.cardSettings.headerField;
            if (this.parent.sortSettings.sortBy === 'Custom') {
                field = this.parent.sortSettings.field;
            }
            if (isNoU(this.parent.swimlaneSettings.keyField)) {
                index = (this.getColumnData(key, this.parent.kanbanData) as Record<string, any>[]).findIndex(
                    (colData: Record<string, any>) =>
                        colData[field as string] === data[field as string]);
            } else {
                const swimlaneDatas: Record<string, any>[] =
                    this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField] as string);
                index = (this.getColumnData(key, swimlaneDatas) as Record<string, any>[]).findIndex(
                    (colData: Record<string, any>) => colData[field as string] === data[field as string]);
            }
        } else if (this.parent.sortSettings.sortBy === 'Index' &&
            this.parent.sortSettings.field && this.parent.sortSettings.direction === 'Ascending') {
            index = (data[this.parent.sortSettings.field] as number) - 1;
        }
        if (cardRow) {
            const td: HTMLElement = [].slice.call(cardRow.children).filter((e: Element) =>
                e.getAttribute('data-key').replace(/\s/g, '').split(',').indexOf(key.toString().replace(/\s/g, '')) !== -1)[0];
            const cardWrapper: Element = td.querySelector('.' + cls.CARD_VIRTUAL_WRAPPER_CLASS);
            const emptyCard: Element = cardWrapper.querySelector('.' + cls.EMPTY_CARD_CLASS);
            if (emptyCard) {
                remove(emptyCard);
            }
            const cardElement: HTMLElement = this.renderCard(data as { [key: string]: string });
            if (this.parent.allowDragAndDrop && td.classList.contains(cls.DRAG_CLASS)) {
                this.parent.dragAndDropModule.wireDragEvents(cardElement);
                addClass([cardElement], cls.DROPPABLE_CLASS);
            }
            const args: CardRenderedEventArgs = { data: data, element: cardElement, cancel: false };
            this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
                const addCardCondition: boolean = isDropped ? true : cardWrapper.childNodes.length
                    < this.scrollStatus[key as string].singleIndexCardCount;
                if (!cardArgs.cancel && addCardCondition || !isNoU(requestType)) {
                    if (isNoU(index) || cardWrapper.children.length === 0) {
                        cardWrapper.appendChild(cardElement);
                    } else {
                        cardWrapper.insertBefore(cardElement, cardWrapper.childNodes[index as number]);
                    }
                }
            });
        }
    }

    public removeCard(data: Record<string, any>): void {
        const cardKey: string = data[this.parent.cardSettings.headerField] as string;
        const cardElement: Element = this.parent.element.querySelector(`.${cls.CARD_CLASS}[data-id="${cardKey}"]`);
        if (cardElement) {
            this.isSelectedCard = cardElement.classList.contains(cls.CARD_SELECTION_CLASS) ? true : false;
            const cardContainer: HTMLElement = cardElement.parentElement;
            remove(cardElement);
            if (cardContainer.querySelectorAll('.' + cls.CARD_CLASS + ':not(.' + cls.CLONED_CARD_CLASS + ')').length === 0) {
                cardContainer.appendChild(this.renderEmptyCard());
            }
        }
    }

    public wireEvents(): void {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        window.addEventListener('resize', this.winResize);
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        const cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper: HTMLElement) => {
            if (this.parent.isInitialRender && wrapper.offsetParent) {
                this.parent.scrollPosition.column[wrapper.offsetParent.getAttribute('data-key')] = { left: 0, top: 0 };
            }
            EventHandler.add(wrapper, 'scroll', this.onColScrollShowSkeleton, this);
            EventHandler.add(wrapper, 'scroll', debounce(this.onColumnScroll, 200), this);
        });
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
        window.removeEventListener('resize', this.winResize);
        this.winResize = null;
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            EventHandler.remove(content, 'scroll', this.onColScrollShowSkeleton);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        const cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        if (cardWrapper.length > 0) {
            cardWrapper.forEach((wrapper: HTMLElement) => { EventHandler.remove(wrapper, 'scroll', debounce(this.onColumnScroll, 200)); });
        }
        if (this.parent.isAdaptive) {
            this.parent.touchModule.unWireTouchEvents();
        }
    }

    public wireDragEvent(): void {
        if (this.parent.allowDragAndDrop) {
            const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS
                + '.' + cls.DRAG_CLASS + ' .' + cls.CARD_CLASS));
            addClass(cards, cls.DROPPABLE_CLASS);
            if (cards.length > 0) {
                cards.forEach((card: HTMLElement) => this.parent.dragAndDropModule.wireDragEvents(card));
            }
        }
    }

    public unWireDragEvent(): void {
        const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS
            + '.' + cls.DRAG_CLASS + ' .' + cls.CARD_CLASS));
        removeClass(cards, cls.DROPPABLE_CLASS);
        if (cards.length > 0) {
            cards.forEach((card: HTMLElement) => this.parent.dragAndDropModule.unWireDragEvents(card));
        }
    }

    public destroy(): void {
        this.parent.resetTemplates();
        this.parent.off(events.dataReady, this.initRender);
        this.parent.off(events.contentReady, this.scrollUiUpdate);
        this.unWireEvents();
        const header: Element = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        if (header) {
            remove(header);
        }
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
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
        const swimlaneToolBarEle: Element = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        const swimlaneContent: Element = this.parent.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    }
}
