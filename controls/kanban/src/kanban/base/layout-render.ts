/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    append, createElement, formatUnit, EventHandler, addClass, remove, extend, Browser, isNullOrUndefined as isNoU,
    removeClass, closest, setStyleAttribute
} from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { CardRenderedEventArgs, QueryCellInfoEventArgs, HeaderArgs, ScrollOffset } from '../base/interface';
import { ColumnsModel, StackedHeadersModel } from '../models/index';
import { MobileLayout } from './mobile-layout';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Kanban layout rendering module
 *
 */
export class LayoutRender extends MobileLayout {
    public parent: Kanban;
    public kanbanRows: HeaderArgs[] = [];
    public columnKeys: string[];
    public swimlaneIndex: number;
    public scrollLeft: number;
    private swimlaneRow: HeaderArgs[];
    public columnData: { [key: string]: any[] };
    public swimlaneData: { [key: string]: any[] };
    public frozenSwimlaneRow: HTMLElement;
    public frozenOrder: number;
    public isSelectedCard: boolean;

    constructor(parent: Kanban) {
        super(parent);
        this.parent = parent;
        this.columnKeys = [];
        this.swimlaneIndex = 0;
        this.swimlaneData = {};
        this.scrollLeft = 0;
        this.frozenOrder = 0;
        this.parent.on(events.dataReady, this.initRender, this);
        this.parent.on(events.contentReady, this.scrollUiUpdate, this);
    }

    private initRender(): void {
        if (this.parent.columns.length === 0) {
            return;
        }
        this.columnData = this.getColumnCards();
        this.kanbanRows = this.getRows();
        this.swimlaneData = this.getSwimlaneCards();
        if (this.parent.isAdaptive) {
            const parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
            if (parent) {
                this.scrollLeft = parent.scrollLeft;
            }
        }
        this.destroy();
        this.parent.on(events.dataReady, this.initRender, this);
        this.parent.on(events.contentReady, this.scrollUiUpdate, this);
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField && this.parent.kanbanData.length !== 0) {
            this.renderSwimlaneHeader();
        }
        const header: HTMLElement = createElement('div', { className: cls.HEADER_CLASS });
        this.parent.element.appendChild(header);
        this.renderHeader(header);
        this.renderContent();
        this.renderCards();
        this.renderValidation();
        this.parent.renderTemplates();
        this.parent.notify(events.contentReady, {});
        this.wireEvents();
        if (this.parent.isInitialRender) {
            this.parent.isInitialRender = false;
        }
    }

    private renderHeader(header: HTMLElement): void {
        const headerWrap: HTMLElement = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        const headerTable: HTMLElement = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.HEADER_TABLE_CLASS
        });
        headerWrap.appendChild(headerTable);
        this.renderColGroup(headerTable);
        const tableHead: HTMLElement = createElement('thead');
        const tableBody: HTMLElement = createElement('tbody', { className: 'e-hide', innerHTML: '<tr><td></td></tr>', attrs: {'role': 'rowgroup'} });
        headerTable.appendChild(tableBody);
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
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField.toString() , 'scope': 'col'}
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
                this.columnData = this.getColumnCards(this.parent.kanbanData);
                const noOfCard: number = this.columnData[column.keyField].length;
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
                        attrs: { 'tabindex': '0', 'role': 'button' }
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
            className: cls.TABLE_CLASS + ' ' + cls.CONTENT_TABLE_CLASS, attrs: { 'role': 'presentation' }
        });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        const tHead: HTMLElement = createElement('thead', { className: 'e-hide', attrs: {'role': 'none'}});
        for (const column of this.parent.columns) {
            const thElem: HTMLElement = createElement('th', {id: column.keyField as string , innerHTML: column.keyField as string, attrs: { 'scope': 'col'}});
            thElem.style.display = 'none';
            tHead.appendChild(thElem);
        }
        contentTable.appendChild(tHead);
        const tBody: HTMLElement = createElement('tbody', {attrs: { 'role': 'treegrid' , 'aria-label': 'Kanban Content'}});
        contentTable.appendChild(tBody);
        let isCollaspsed: boolean = false;
        this.swimlaneRow = this.kanbanRows;
        this.initializeSwimlaneTree();
        for (const row of this.swimlaneRow) {
            if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneToggleArray.length !== 0) {
                const index: number = this.parent.swimlaneToggleArray.indexOf(row.keyField as string);
                isCollaspsed = index !== -1;
            }
            if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive) {
                this.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            this.renderSingleContent(tBody, row, isCollaspsed);
        }
    }

    private renderSingleContent(tBody: HTMLElement, row: HeaderArgs, isCollaspsed: boolean): void {
        const className: string = isCollaspsed ? cls.CONTENT_ROW_CLASS + ' ' + cls.COLLAPSED_CLASS : cls.CONTENT_ROW_CLASS;
        const tr: HTMLElement = createElement('tr', { className: className,
            attrs: {'role': 'row', 'aria-label' : row.keyField as string + 'row content'}});
        for (const column of this.parent.columns) {
            if (this.isColumnVisible(column)) {
                const index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField.toString());
                const className: string = index === -1 ? cls.CONTENT_CELLS_CLASS : cls.CONTENT_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS;
                const dragClass: string = (column.allowDrag ? ' ' + cls.DRAG_CLASS : '') + (column.allowDrop ? ' ' + cls.DROP_CLASS
                    + ' ' + cls.DROPPABLE_CLASS : '');
                const td: HTMLElement = createElement('td', {
                    className: className + dragClass, attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField.toString(), 'tabindex': '0',
                        'aria-describedby': column.keyField.toString(), 'role': 'gridcell'}
                });
                if (column.allowToggle && !column.isExpanded || index !== -1) {
                    addClass([td], cls.COLLAPSED_CLASS);
                    const text: string = (column.showItemCount ? '[' +
                        this.getColumnData(column.keyField, this.swimlaneData[row.keyField]).length + '] ' : '') + column.headerText;
                    td.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                    td.setAttribute('aria-expanded', 'false');
                }
                if (column.showAddButton) {
                    const button: HTMLElement = createElement('div', { className: cls.SHOW_ADD_BUTTON, attrs: { 'tabindex': '-1' } });
                    button.appendChild(createElement('div', { className: cls.SHOW_ADD_ICON + ' ' + cls.ICON_CLASS }));
                    td.appendChild(button);
                }
                tr.appendChild(td);
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

    private initializeSwimlaneTree(): void {
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive && this.parent.kanbanData.length !== 0) {
            this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
            this.renderSwimlaneTree();
            this.parent.element.querySelector('.' + cls.TOOLBAR_SWIMLANE_NAME_CLASS).innerHTML = this.swimlaneRow[0].textField;
        }
    }

    private renderSwimlaneRow(tBody: HTMLElement, row: HeaderArgs, isCollapsed: boolean): void {
        const name: string = cls.CONTENT_ROW_CLASS + ' ' + cls.SWIMLANE_ROW_CLASS;
        const className: string = isCollapsed ? ' ' + cls.COLLAPSED_CLASS : '';
        const tr: HTMLElement = createElement('tr', {
            className: name + className, attrs: { 'aria-label': row.keyField as string + ' row header',
                'role': 'row', 'data-key': row.keyField as string , 'aria-expanded': (!isCollapsed).toString()}});
        const col: number = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        const td: HTMLElement = createElement('td', { className: cls.CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'role': 'gridcell', colspan: col.toString() }});
        const swimlaneHeader: HTMLElement = createElement('div', { className: cls.SWIMLANE_HEADER_CLASS });
        td.appendChild(swimlaneHeader);
        const iconClass: string = isCollapsed ? cls.SWIMLANE_ROW_COLLAPSE_CLASS : cls.SWIMLANE_ROW_EXPAND_CLASS;
        const iconDiv: HTMLElement = createElement('div', {
            className: cls.ICON_CLASS + ' ' + iconClass, attrs: {
                'tabindex': '0', 'role': 'button', 'aria-label': isCollapsed ? row.keyField + ' Collapse' : row.keyField + ' Expand'
            }
        });
        swimlaneHeader.appendChild(iconDiv);
        const headerWrap: HTMLElement = createElement('div', { className: cls.HEADER_WRAP_CLASS });
        swimlaneHeader.appendChild(headerWrap);
        const cardCount: number = this.swimlaneData[row.keyField].length;
        if (this.parent.swimlaneSettings.template) {
            const templateArgs: HeaderArgs = extend({}, row, { count: cardCount }, true) as HeaderArgs;
            addClass([td], cls.TEMPLATE_CLASS);
            const templateId: string = this.parent.element.id + '_swimlaneTemplate';
            const swimlaneTemplate: HTMLElement[] = this.parent.templateParser(
                this.parent.swimlaneSettings.template)(templateArgs, this.parent, 'swimlaneTemplate', templateId, false);
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
        const dataObj: HeaderArgs[] = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
        const args: QueryCellInfoEventArgs = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
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

    private renderCards(): void {
        const rows: HeaderArgs[] = this.swimlaneRow;
        const cardRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        const swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-content-row.e-swimlane-row'));
        const removeTrs: HTMLElement[] = [];
        let columnTransition: boolean = false;
        cardRows.forEach((tr: HTMLElement, index: number) => {
            let dataCount: number = 0;
            for (const column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    const columnData: Record<string, any>[] = this.parent.swimlaneSettings.keyField ?
                        this.getColumnData(column.keyField, this.swimlaneData[rows[index as number].keyField]) :
                        this.columnData[column.keyField];
                    dataCount += columnData.length;
                    const columnWrapper: HTMLElement = tr.querySelector('[data-key="' + column.keyField + '"]');
                    const cardWrapper: HTMLElement = createElement('div', {
                        className: cls.CARD_WRAPPER_CLASS, attrs: { 'role': 'listbox' , 'tabindex': '0',
                            'aria-label': column.keyField.toString()
                        }});
                    if (column.transitionColumns.length > 0) {
                        columnTransition = true;
                    }
                    if (!columnTransition && isNoU(this.parent.swimlaneSettings.keyField)) {
                        const borderElem: HTMLElement = createElement('div', { className: cls.BORDER_CLASS });
                        columnWrapper.appendChild(borderElem);
                    }
                    columnWrapper.appendChild(cardWrapper);
                    if (columnData.length > 0) {
                        for (const data of columnData as Record<string, string>[]) {
                            const cardText: string = data[this.parent.cardSettings.headerField] as string;
                            const cardIndex: number = this.parent.actionModule.selectionArray.indexOf(cardText);
                            const cardElement: HTMLElement = this.renderCard(data);
                            if (cardIndex !== -1) {
                                cardElement.setAttribute('aria-selected', 'true');
                                addClass([cardElement], cls.CARD_SELECTION_CLASS);
                            }
                            const args: CardRenderedEventArgs = { data: data, element: cardElement, cancel: false };
                            this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
                                if (!cardArgs.cancel) {
                                    cardWrapper.appendChild(cardElement);
                                }
                            });
                        }
                    } else {
                        cardWrapper.appendChild(this.renderEmptyCard());
                    }
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
            attrs: { 'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField],
                'aria-selected': 'false', 'tabindex': '-1', 'role': 'option', 'aria-roledescription': 'Card'
            }});
        if (this.parent.cardHeight !== 'auto') {
            cardElement.style.height = formatUnit(this.parent.cardHeight);
        }
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
            className: cls.EMPTY_CARD_CLASS, innerHTML: this.parent.localeObj.getConstant('noCard'),
            attrs: {'aria-label': this.parent.localeObj.getConstant('noCard'), 'role': 'option'}
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

    public getRows(): HeaderArgs[] {
        let kanbanRows: HeaderArgs[] = [];
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.kanbanData.map((obj: { [key: string]: string }): void => {
                if (!this.parent.swimlaneSettings.showEmptyRow) {
                    if ((isNoU(obj[this.parent.keyField])) || (obj[this.parent.keyField] === '') ||
                    (obj[this.parent.keyField] && this.columnKeys.indexOf(obj[this.parent.keyField].toString()) === -1)) {
                        return;
                    }
                }
                let textField: string = obj[this.parent.swimlaneSettings.textField] || obj[this.parent.swimlaneSettings.keyField];
                let keyField: string = obj[this.parent.swimlaneSettings.keyField];
                if (!obj[this.parent.swimlaneSettings.keyField]) {
                    if (this.parent.swimlaneSettings.showUnassignedRow) {
                        textField = this.parent.localeObj.getConstant('unassigned');
                        keyField = '';
                    } else {
                        return;
                    }
                }
                kanbanRows.push({ keyField: keyField, textField: textField });
            });
            kanbanRows = kanbanRows.filter((item: HeaderArgs, index: number, arr: HeaderArgs[]) =>
                index === arr.map((item: HeaderArgs) => item.keyField).indexOf(item.keyField));
            kanbanRows = this.swimlaneSorting(kanbanRows);
            kanbanRows.forEach((row: HeaderArgs) => {
                row.count = this.parent.kanbanData.filter((obj: Record<string, any>) =>
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

    private swimlaneSorting(rows: HeaderArgs[]): HeaderArgs[] {
        if (this.parent.swimlaneSettings.sortComparer) {
            rows = this.parent.swimlaneSettings.sortComparer.call(this.parent, rows);
        } else {
            rows.sort((a: HeaderArgs, b: HeaderArgs) => a.textField.localeCompare(b.textField, undefined, { numeric: true }));
            if (this.parent.swimlaneSettings.sortDirection === 'Descending') {
                rows.reverse();
            }
        }
        return rows;
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
                attrs: { 'colspan': colSpan.toString(), 'scope': 'col' }
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
        if (!isNoU(this.parent.swimlaneSettings.keyField) && this.parent.swimlaneSettings.enableFrozenRows) {
            this.frozenRows(e);
        }
    }

    private addFrozenSwimlaneDataKey(currentElem: HTMLElement): void {
        const frozenKey: string = currentElem.getAttribute('data-key');
        if (!isNoU(frozenKey)) {
            this.frozenSwimlaneRow.setAttribute('data-key', frozenKey);
        }
    }

    public frozenRows(e?: Event): void {
        const firstSwimlane: HTMLElement =  this.parent.element.querySelector('.' + cls.SWIMLANE_ROW_CLASS) as HTMLElement;
        const header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (isNoU(this.frozenSwimlaneRow)) {
            this.frozenSwimlaneRow = createElement('div', { className: cls.FROZEN_SWIMLANE_ROW_CLASS });
            const frozenRow: HTMLElement = createElement('div', { className: cls.FROZEN_ROW_CLASS });
            this.frozenSwimlaneRow.appendChild(frozenRow);
            this.parent.element.insertBefore(this.frozenSwimlaneRow, this.parent.element.firstElementChild);
            frozenRow.appendChild(firstSwimlane.querySelector('.' + cls.SWIMLANE_HEADER_CLASS).cloneNode(true));
            this.addFrozenSwimlaneDataKey(firstSwimlane);
            setStyleAttribute(this.frozenSwimlaneRow, { height: formatUnit(firstSwimlane.getBoundingClientRect().height),
                width: formatUnit(content.querySelector('.e-swimlane').getBoundingClientRect().width),
                top: formatUnit(header.getBoundingClientRect().height.toString())
            });
            setStyleAttribute(header, { position: 'relative', top: formatUnit((-this.frozenSwimlaneRow.getBoundingClientRect().height)) });
            setStyleAttribute(content, { position: 'relative', top: formatUnit((-this.frozenSwimlaneRow.getBoundingClientRect().height)) });
        } else {
            const swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.SWIMLANE_ROW_CLASS));
            const curSwim: HTMLElement = swimlaneRows[this.frozenOrder];
            const prevSwim: HTMLElement = swimlaneRows[this.frozenOrder - 1];
            const nextSwim: HTMLElement = swimlaneRows[this.frozenOrder + 1];
            let curSwimHeight: number;
            let prevSwimHeight: number;
            let nextSwimHeight: number;
            if (curSwim) {
                curSwimHeight = curSwim.getBoundingClientRect().top + curSwim.getBoundingClientRect().height;
            }
            if (prevSwim) {
                prevSwimHeight = prevSwim.getBoundingClientRect().top + prevSwim.getBoundingClientRect().height;
            }
            if (nextSwim) {
                nextSwimHeight = nextSwim.getBoundingClientRect().top + nextSwim.getBoundingClientRect().height;
            }
            const frozenSwimHeight: number = content.getBoundingClientRect().top + this.frozenSwimlaneRow.getBoundingClientRect().height;
            const frozenRowsElement: HTMLElement = this.frozenSwimlaneRow.querySelector('.' + cls.FROZEN_ROW_CLASS);
            if (nextSwimHeight && frozenSwimHeight >= nextSwimHeight && this.frozenOrder < swimlaneRows.length - 1) {
                if (frozenRowsElement) {
                    remove(frozenRowsElement.querySelector('.' + cls.SWIMLANE_HEADER_CLASS));
                    frozenRowsElement.appendChild(nextSwim.querySelector('.' + cls.SWIMLANE_HEADER_CLASS).cloneNode(true));
                    this.addFrozenSwimlaneDataKey(nextSwim);
                }
                ++this.frozenOrder;
            }
            else if (prevSwimHeight && frozenSwimHeight < curSwimHeight && frozenSwimHeight > prevSwimHeight && this.frozenOrder > 0) {
                if (frozenRowsElement) {
                    remove(frozenRowsElement.querySelector('.' + cls.SWIMLANE_HEADER_CLASS));
                    frozenRowsElement.appendChild(prevSwim.querySelector('.' + cls.SWIMLANE_HEADER_CLASS).cloneNode(true));
                    this.addFrozenSwimlaneDataKey(prevSwim);
                }
                --this.frozenOrder;
            }
        }
        if (e && (e.target as HTMLElement).scrollTop === 0) {
            this.removeFrozenRows();
        }
    }

    public removeFrozenRows(): void {
        remove(this.frozenSwimlaneRow);
        this.frozenSwimlaneRow = null;
        const header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        setStyleAttribute(header, { position: '', top: '' });
        setStyleAttribute(content, { position: '', top: '' });
        this.parent.scrollPosition.content = { left: this.parent.scrollPosition.content.left, top: 0 };
        content.scrollTop = 0;
        this.frozenOrder = 0;
    }
    private onColumnScroll(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (target.offsetParent) {
            const columnKey: string = target.offsetParent.getAttribute('data-key');
            this.parent.scrollPosition.column[`${columnKey}`] = { left: target.scrollLeft, top: target.scrollTop };
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
     * @returns {boolean}
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
            if (this.parent.constraintType === 'Swimlane' && this.parent.swimlaneSettings.keyField) {
                this.swimlaneRow.forEach((row: HeaderArgs, index: number) => {
                    this.renderLimits(column, rowCells[index as number]);
                    const rowCards: Record<string, any>[] = cardData.filter((card: Record<string, any>) =>
                        card[this.parent.swimlaneSettings.keyField] === row.keyField);
                    const colorClass: string = this.getValidationClass(column, rowCards.length);
                    if (colorClass) {
                        addClass([rowCells[index as number]], colorClass);
                    }
                });
            } else {
                this.renderLimits(column, headerCell);
                const colorClass: string = this.getValidationClass(column, cardData.length);
                if (colorClass) {
                    addClass(rowCells.concat(headerCell), colorClass);
                }
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

    public getColumnData(columnValue: string | number, dataSource: Record<string, any>[] = this.parent.kanbanData): Record<string, any>[] {
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
            isNumeric = typeof (this.parent.kanbanData[0])[`${key}`] === 'number';
        }
        if (!isNumeric && this.parent.sortSettings.sortBy === 'Index') {
            return cardData;
        }
        let first: string | number;
        let second: string | number;
        cardData = cardData.sort((firstData: { [key: string]: string | number }, secondData: { [key: string]: string | number }) => {
            if (!isNumeric) {
                first = (firstData[`${key}`] as string).toLowerCase();
                second = (secondData[`${key}`] as string).toLowerCase();
            } else {
                first = (firstData[`${key}`] as number);
                second = (secondData[`${key}`] as number);
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

    public getSwimlaneCards(): Record<string, any[]> {
        const swimlaneData: Record<string, any[]> = {};
        if (this.parent.swimlaneSettings.keyField) {
            this.kanbanRows.forEach((row: HeaderArgs) =>
                swimlaneData[row.keyField] = this.parent.kanbanData.filter((obj: Record<string, any>) =>
                    !isNoU(obj[this.parent.keyField]) &&
                     this.columnKeys.indexOf(<string>obj[this.parent.keyField].toString()) > -1 &&
                    ((!obj[this.parent.swimlaneSettings.keyField] && this.parent.swimlaneSettings.showUnassignedRow) ?
                        '' : obj[this.parent.swimlaneSettings.keyField]) === row.keyField));
        }
        return swimlaneData;
    }

    public refreshHeaders(): void {
        const header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        [].slice.call(header.children).forEach((child: HTMLElement) => remove(child));
        this.renderHeader(header);
    }

    public refreshCards(): void {
        this.parent.resetTemplates(['cardTemplate']);
        const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
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
                    const isNumeric: boolean = typeof column.keyField === 'number';
                    let cardLength: number = 0;
                    if (isNumeric) {
                        // eslint-disable-next-line no-useless-escape
                        cardLength = ([].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS + '[data-key=\"' + column.keyField + '\"]'))).length;
                    } else {
                        const keys: string[] = (column.keyField as string).split(',');
                        for (const key of keys) {
                            // eslint-disable-next-line no-useless-escape
                            const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS + '[data-key=\"' + key.trim() + '\"]'));
                            cardLength = cards.length + cardLength;
                        }
                    }
                    itemCount.innerHTML = '- ' + cardLength + ' ' + this.parent.localeObj.getConstant('items');
                }
            }
        });
        if (this.parent.swimlaneSettings.keyField) {
            const swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.SWIMLANE_ROW_CLASS}`));
            swimlaneRows.forEach((swimlane: HTMLElement) => {
                const swimlaneKey: string = swimlane.getAttribute('data-key');
                const itemCount: Element = swimlane.querySelector(`.${cls.CARD_ITEM_COUNT_CLASS}`);
                if (itemCount && swimlaneKey) {
                    const cards : HTMLElement[] = [].slice.call(swimlane.nextElementSibling.querySelectorAll('.' + cls.CARD_CLASS));
                    itemCount.innerHTML = '- ' + cards.length + ' ' + this.parent.localeObj.getConstant('items');
                }
            });
        }
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

    public renderCardBasedOnIndex(data: Record<string, any>, index?: number): void {
        const key: string = data[this.parent.keyField] as string;
        let cardRow: HTMLElement = this.parent.element.querySelector('.e-content-row:not(.e-swimlane-row)') as HTMLElement;
        if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive) {
            const rowSelector: string = `.e-content-row.e-swimlane-row[data-key="${data[this.parent.swimlaneSettings.keyField]}"]`;
            if (this.parent.element.querySelector(rowSelector)) {
                cardRow = this.parent.element.querySelector(rowSelector).nextElementSibling as HTMLElement;
            } else {
                const columnIndex: number = this.columnKeys.indexOf(key);
                if (columnIndex !== -1 && this.parent.actionModule.hideColumnKeys.indexOf(key) === -1) {
                    const index: number = (this.kanbanRows as Record<string, any>[]).findIndex(
                        (rowData: Record<string, any>) => rowData['keyField'] === data[this.parent.swimlaneSettings.keyField]);
                    const swim: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.e-swimlane-row'));
                    let swimRow: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS + ' tbody');
                    if (swim[index as number]) {
                        swimRow = swim[index as number];
                    }
                    this.renderSwimlaneRow(swimRow, this.kanbanRows[index as number], false);
                    this.renderSingleContent(swimRow, this.kanbanRows[index as number], false);
                }
                cardRow = this.parent.element.querySelector(rowSelector).nextElementSibling as HTMLElement;
                [].slice.call(cardRow.children).forEach((cell: HTMLElement) => {
                    const cardWrapper: HTMLElement = createElement('div', { className: cls.CARD_WRAPPER_CLASS });
                    cell.appendChild(cardWrapper);
                    cardWrapper.appendChild(this.renderEmptyCard());
                });
            }
        }
        if (this.parent.sortSettings.sortBy !== 'Index') {
            let field: string = this.parent.cardSettings.headerField;
            if (this.parent.sortSettings.sortBy === 'Custom') {
                field = this.parent.sortSettings.field;
            }
            if (isNoU(this.parent.swimlaneSettings.keyField)) {
                index = (this.getColumnData(key, this.parent.kanbanData) as Record<string, any>[]).findIndex(
                    (colData: Record<string, any>) =>
                        colData[`${field}`] === data[`${field}`]);
            } else {
                const swimlaneDatas: Record<string, any>[] =
                    this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField] as string);
                index = (this.getColumnData(key, swimlaneDatas) as Record<string, any>[]).findIndex(
                    (colData: Record<string, any>) => colData[`${field}`] === data[`${field}`]);
            }
        } else if (this.parent.sortSettings.sortBy === 'Index' &&
            this.parent.sortSettings.field && this.parent.sortSettings.direction === 'Ascending') {
            index = (data[this.parent.sortSettings.field] as number) - 1;
        }
        if (cardRow) {
            const td: HTMLElement = [].slice.call(cardRow.children).filter((e: Element) =>
                e.getAttribute('data-key').replace(/\s/g, '').split(',').indexOf(key.toString().replace(/\s/g, '')) !== -1)[0];
            const cardWrapper: Element = td.querySelector('.' + cls.CARD_WRAPPER_CLASS);
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
                if (!cardArgs.cancel) {
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
        this.isSelectedCard = cardElement.classList.contains(cls.CARD_SELECTION_CLASS) ? true : false;
        const cardContainer: HTMLElement = cardElement.parentElement;
        if (cardElement) {
            remove(cardElement);
        }
        if (cardContainer.querySelectorAll('.' + cls.CARD_CLASS + ':not(.' + cls.CLONED_CARD_CLASS + ')').length === 0) {
            cardContainer.appendChild(this.renderEmptyCard());
        }
    }

    public wireEvents(): void {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        const cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper: HTMLElement) => {
            if (this.parent.isInitialRender && wrapper.offsetParent) {
                this.parent.scrollPosition.column[wrapper.offsetParent.getAttribute('data-key')] = { left: 0, top: 0 };
            }
            EventHandler.add(wrapper, 'scroll', this.onColumnScroll, this);
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
        const content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        const cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        if (cardWrapper.length > 0) {
            cardWrapper.forEach((wrapper: HTMLElement) => { EventHandler.remove(wrapper, 'scroll', this.onColumnScroll); });
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
            cards.forEach((card: HTMLElement) => this.parent.dragAndDropModule.wireDragEvents(card));
        }
    }

    public unWireDragEvent(): void {
        const cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS
            + '.' + cls.DRAG_CLASS + ' .' + cls.CARD_CLASS));
        removeClass(cards, cls.DROPPABLE_CLASS);
        cards.forEach((card: HTMLElement) => this.parent.dragAndDropModule.unWireDragEvents(card));
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
