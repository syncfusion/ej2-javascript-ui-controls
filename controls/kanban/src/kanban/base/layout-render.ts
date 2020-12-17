import {
    append, createElement, formatUnit, EventHandler, addClass, remove, extend, Browser, isNullOrUndefined, removeClass, closest
} from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { CardRenderedEventArgs, QueryCellInfoEventArgs, HeaderArgs, ScrollOffset } from '../base/interface';
import { ColumnsModel, StackedHeadersModel } from '../models/index';
import { MobileLayout } from './mobile-layout';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Kanban layout rendering module
 * @hidden
 */
export class LayoutRender extends MobileLayout {
    public parent: Kanban;
    public kanbanRows: HeaderArgs[] = [];
    public columnKeys: string[];
    public swimlaneIndex: number;
    public scrollLeft: number;
    private swimlaneRow: HeaderArgs[];
    public columnData: { [key: string]: Object[] };
    public swimlaneData: { [key: string]: Object[] };

    /**
     * Constructor for layout module
     * @private
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
        this.parent.on(events.dataReady, this.initRender, this);
        this.parent.on(events.contentReady, this.scrollUiUpdate, this);
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField && this.parent.kanbanData.length !== 0) {
            this.renderSwimlaneHeader();
        }
        let header: HTMLElement = createElement('div', { className: cls.HEADER_CLASS });
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
                    let templateId: string = this.parent.element.id + '_columnTemplate';
                    let templateHeader: HTMLElement[] =
                        this.parent.templateParser(column.template)(templateArgs, this.parent, 'template', templateId, false);
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
        this.initializeSwimlaneTree();
        for (let row of this.swimlaneRow) {
            if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneToggleArray.length !== 0) {
                let index: number = this.parent.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? cls.CONTENT_ROW_CLASS + ' ' + cls.COLLAPSED_CLASS : cls.CONTENT_ROW_CLASS;
            let tr: HTMLElement = createElement('tr', { className: className, attrs: { 'aria-expanded': 'true' } });
            if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive) {
                this.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let index: number = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    let className: string = index === -1 ? cls.CONTENT_CELLS_CLASS : cls.CONTENT_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS;
                    let dragClass: string = (column.allowDrag ? ' ' + cls.DRAG_CLASS : '') + (column.allowDrop ? ' ' + cls.DROP_CLASS
                        + ' ' + cls.DROPPABLE_CLASS : '');
                    let td: HTMLElement = createElement('td', {
                        className: className + dragClass,
                        attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField, 'aria-expanded': 'true', 'tabindex': '0' }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], cls.COLLAPSED_CLASS);
                        let text: string = (column.showItemCount ? '[' +
                            this.getColumnData(column.keyField, this.swimlaneData[row.keyField]).length + '] ' : '') + column.headerText;
                        td.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
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

    private initializeSwimlaneTree(): void {
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive && this.parent.kanbanData.length !== 0) {
            this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
            this.renderSwimlaneTree();
            this.parent.element.querySelector('.' + cls.TOOLBAR_SWIMLANE_NAME_CLASS).innerHTML = this.swimlaneRow[0].textField;
        }
    }

    private renderSwimlaneRow(tBody: HTMLElement, row: HeaderArgs, isCollapsed: boolean): void {
        let name: string = cls.CONTENT_ROW_CLASS + ' ' + cls.SWIMLANE_ROW_CLASS;
        let className: string = isCollapsed ? ' ' + cls.COLLAPSED_CLASS : '';
        let tr: HTMLElement = createElement('tr', {
            className: name + className, attrs: { 'data-key': row.keyField, 'aria-expanded': (!isCollapsed).toString() }
        });
        let col: number = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        let td: HTMLElement = createElement('td', {
            className: cls.CONTENT_CELLS_CLASS, attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
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
            let templateId: string = this.parent.element.id + '_swimlaneTemplate';
            let swimlaneTemplate: HTMLElement[] = this.parent.templateParser(
                this.parent.swimlaneSettings.template)(templateArgs, this.parent, 'template', templateId, false);
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
                    if (columnData.length > 0) {
                        for (let data of columnData as { [key: string]: string }[]) {
                            let cardText: string = data[this.parent.cardSettings.headerField] as string;
                            let cardIndex: number = this.parent.actionModule.selectionArray.indexOf(cardText);
                            let cardElement: HTMLElement = this.renderCard(data);
                            if (cardIndex !== -1) {
                                cardElement.setAttribute('aria-selected', 'true');
                                addClass([cardElement], cls.CARD_SELECTION_CLASS);
                            }
                            let args: CardRenderedEventArgs = { data: data, element: cardElement, cancel: false };
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
                    removeTrs.push(swimlaneRows[index]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow && (this.parent.kanbanData.length === 0 && !this.parent.showEmptyColumn)) {
            removeTrs.forEach((tr: HTMLElement) => remove(tr));
        }
    }

    private renderCard(data: { [key: string]: string }): HTMLElement {
        let cardElement: HTMLElement = createElement('div', {
            className: cls.CARD_CLASS,
            attrs: {
                'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField],
                'aria-selected': 'false', 'tabindex': '-1'
            }
        });
        if (this.parent.cardSettings.template) {
            addClass([cardElement], cls.TEMPLATE_CLASS);
            let templateId: string = this.parent.element.id + '_cardTemplate';
            let cardTemplate: HTMLElement[] = this.parent.templateParser(
                this.parent.cardSettings.template)(data, this.parent, 'template', templateId, false);
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
            if (this.parent.cardSettings.tagsField && data[this.parent.cardSettings.tagsField]) {
                let cardTags: HTMLElement = createElement('div', { className: cls.CARD_TAGS_CLASS });
                let tags: string[] = data[this.parent.cardSettings.tagsField].toString().split(',');
                for (let tag of tags) {
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
                let cardFields: HTMLElement = createElement('div', { className: cls.CARD_FOOTER_CLASS });
                let keys: string[] = data[this.parent.cardSettings.footerCssField].split(',');
                for (let key of keys) {
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
        let emptyCard: HTMLElement = createElement('span', {
            className: cls.EMPTY_CARD_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noCard')
        });
        return emptyCard;
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
                let textField: string = obj[this.parent.swimlaneSettings.textField] || obj[this.parent.swimlaneSettings.keyField];
                let keyField: string = obj[this.parent.swimlaneSettings.keyField];
                if (!obj[this.parent.swimlaneSettings.keyField]) {
                    if (this.parent.swimlaneSettings.showUnassignedRow) {
                        textField = 'Unassigned';
                        keyField = '';
                    } else {
                        return;
                    }
                }
                kanbanRows.push({ keyField: keyField, textField: textField });
            });
            kanbanRows = kanbanRows.filter((item: HeaderArgs, index: number, arr: Object[]) =>
                index === arr.map((item: HeaderArgs) => item.keyField).indexOf(item.keyField));
            kanbanRows = this.swimlaneSorting(kanbanRows);
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
        this.updateScrollPosition();
    }

    private onContentScroll(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
        let header: HTMLElement = this.parent.element.querySelector('.' + cls.HEADER_CLASS) as HTMLElement;
        [].slice.call(header.children).forEach((node: HTMLElement) => { node.scrollLeft = target.scrollLeft; });
        this.parent.scrollPosition.content = { left: target.scrollLeft, top: target.scrollTop };
    }

    private onColumnScroll(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (target.offsetParent) {
            let columnKey: string = target.offsetParent.getAttribute('data-key');
            this.parent.scrollPosition.column[columnKey] = { left: target.scrollLeft, top: target.scrollTop };
        }
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

    private refreshValidation(): void {
        let validations: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.LIMITS_CLASS));
        validations.forEach((node: HTMLElement) => { remove(node); });
        let minClass: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MIN_COLOR_CLASS));
        removeClass(minClass, cls.MIN_COUNT_CLASS);
        let maxClass: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MAX_COLOR_CLASS));
        removeClass(maxClass, cls.MAX_COLOR_CLASS);
        this.renderValidation();
    }

    public getColumnData(columnValue: string, dataSource: Object[] = this.parent.kanbanData): Object[] {
        let cardData: Object[] = [];
        let columnKeys: string[] = columnValue.split(',');
        for (let key of columnKeys) {
            let keyData: Object[] = dataSource.filter((cardObj: { [key: string]: Object }) => cardObj[this.parent.keyField] === key.trim());
            cardData = cardData.concat(keyData);
        }
        this.sortCategory(cardData);
        return cardData;
    }

    private sortCategory(cardData: Object[]): Object[] {
        let key: string = this.parent.cardSettings.headerField;
        let direction: string = this.parent.sortSettings.direction;
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

    public sortOrder(key: string, direction: string, cardData: Object[]): Object[] {
        let isNumeric: boolean = true;
        if (this.parent.kanbanData.length > 0) {
            isNumeric = typeof (this.parent.kanbanData[0] as { [key: string]: Object })[key] === 'number';
        }
        if (!isNumeric && this.parent.sortSettings.sortBy === 'Index') {
            return cardData;
        }
        let first: string | number;
        let second: string | number;
        cardData = cardData.sort((firstData: { [key: string]: string | number }, secondData: { [key: string]: string | number }) => {
            if (!isNumeric) {
                first = (firstData[key] as string).toLowerCase();
                second = (secondData[key] as string).toLowerCase();
            } else {
                first = (firstData[key] as number);
                second = (secondData[key] as number);
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
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.CARD_CLASS}.${cls.CARD_SELECTION_CLASS}`));
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
                    ((!obj[this.parent.swimlaneSettings.keyField] && this.parent.swimlaneSettings.showUnassignedRow) ?
                        '' : obj[this.parent.swimlaneSettings.keyField]) === row.keyField));
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

    public refresh(): void {
        this.parent.columns.forEach((column: ColumnsModel) => {
            if (column.showItemCount) {
                let countSelector: string = `.${cls.HEADER_CELLS_CLASS}[data-key="${column.keyField}"] .${cls.CARD_ITEM_COUNT_CLASS}`;
                let itemCount: Element = this.parent.element.querySelector(countSelector);
                if (itemCount) {
                    itemCount.innerHTML = `- ${this.columnData[column.keyField].length} ${this.parent.localeObj.getConstant('items')}`;
                }
            }
        });
        if (this.parent.swimlaneSettings.keyField) {
            let swimlaneRows: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(`.${cls.SWIMLANE_ROW_CLASS}`));
            swimlaneRows.forEach((swimlane: HTMLElement) => {
                let swimlaneKey: string = swimlane.getAttribute('data-key');
                let itemCount: Element = swimlane.querySelector(`.${cls.CARD_ITEM_COUNT_CLASS}`);
                if (itemCount) {
                    itemCount.innerHTML = `- ${this.swimlaneData[swimlaneKey].length} ${this.parent.localeObj.getConstant('items')}`;
                }
            });
        }
        this.refreshValidation();
    }

    public updateScrollPosition(): void {
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            content.scrollTo(this.parent.scrollPosition.content.left, this.parent.scrollPosition.content.top);
        }
        let cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper: HTMLElement) => {
            if (wrapper.offsetParent) {
                let scrollData: ScrollOffset = this.parent.scrollPosition.column[wrapper.offsetParent.getAttribute('data-key')];
                if (scrollData) {
                    wrapper.scrollTo(scrollData.left, scrollData.top);
                }
            }
        });
    }

    public renderCardBasedOnIndex(data: { [key: string]: Object }, index?: number): void {
        let key: string = data[this.parent.keyField] as string;
        let cardRow: HTMLElement = this.parent.element.querySelector('.e-content-row:not(.e-swimlane-row)') as HTMLElement;
        if (this.parent.swimlaneSettings.keyField) {
            let rowSelector: string = `.e-content-row.e-swimlane-row[data-key="${data[this.parent.swimlaneSettings.keyField]}"]`;
            cardRow = this.parent.element.querySelector(rowSelector).nextElementSibling as HTMLElement;
        }
        if (this.parent.sortSettings.sortBy !== 'Index') {
            let field: string = this.parent.cardSettings.headerField;
            if (this.parent.sortSettings.sortBy === 'Custom') {
                field = this.parent.sortSettings.field;
            }
            if (isNullOrUndefined(this.parent.swimlaneSettings.keyField)) {
                index = (this.getColumnData(key, this.parent.kanbanData) as { [key: string]: Object }[]).findIndex(
                    (colData: { [key: string]: Object }) =>
                        colData[field] === data[field]);
            } else {
                let swimlaneDatas: Object[] = this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField] as string);
                index = (this.getColumnData(key, swimlaneDatas) as { [key: string]: Object }[]).findIndex(
                    (colData: { [key: string]: Object }) => colData[field] === data[field]);
            }
        } else if (this.parent.sortSettings.sortBy === 'Index' &&
            this.parent.sortSettings.field && this.parent.sortSettings.direction === 'Ascending') {
            index = (data[this.parent.sortSettings.field] as number) - 1;
        }
        if (cardRow) {
            let td: HTMLElement = [].slice.call(cardRow.children).filter((e: Element) =>
                e.getAttribute('data-key').replace(/\s/g, '').split(',').indexOf(key.replace(/\s/g, '')) !== -1)[0];
            let cardWrapper: Element = td.querySelector('.' + cls.CARD_WRAPPER_CLASS);
            let emptyCard: Element = cardWrapper.querySelector('.' + cls.EMPTY_CARD_CLASS);
            if (emptyCard) {
                remove(emptyCard);
            }
            let cardElement: HTMLElement = this.renderCard(data as { [key: string]: string });
            if (this.parent.allowDragAndDrop && td.classList.contains(cls.DRAG_CLASS)) {
                this.parent.dragAndDropModule.wireDragEvents(cardElement);
                addClass([cardElement], cls.DROPPABLE_CLASS);
            }
            let args: CardRenderedEventArgs = { data: data, element: cardElement, cancel: false };
            this.parent.trigger(events.cardRendered, args, (cardArgs: CardRenderedEventArgs) => {
                if (!cardArgs.cancel) {
                    if (isNullOrUndefined(index) || cardWrapper.children.length === 0) {
                        cardWrapper.appendChild(cardElement);
                    } else {
                        cardWrapper.insertBefore(cardElement, cardWrapper.childNodes[index]);
                    }
                }
            });
        }
    }

    public removeCard(data: { [key: string]: Object }): void {
        let cardKey: string = data[this.parent.cardSettings.headerField] as string;
        let cardElement: Element = this.parent.element.querySelector(`.${cls.CARD_CLASS}[data-id="${cardKey}"]`);
        let cardContainer: HTMLElement = cardElement.parentElement;
        if (cardElement) {
            remove(cardElement);
        }
        if (cardContainer.childElementCount === 0) {
            cardContainer.appendChild(this.renderEmptyCard());
        }
    }

    public wireEvents(): void {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        let cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
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
        let content: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_CLASS) as HTMLElement;
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        let cardWrapper: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper: HTMLElement) => { EventHandler.remove(wrapper, 'scroll', this.onColumnScroll); });
        if (this.parent.isAdaptive) {
            this.parent.touchModule.unWireTouchEvents();
        }
    }

    public wireDragEvent(): void {
        if (this.parent.allowDragAndDrop) {
            let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS
                + '.' + cls.DRAG_CLASS + ' .' + cls.CARD_CLASS));
            addClass(cards, cls.DROPPABLE_CLASS);
            cards.forEach((card: HTMLElement) => this.parent.dragAndDropModule.wireDragEvents(card));
        }
    }

    public unWireDragEvent(): void {
        let cards: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS
            + '.' + cls.DRAG_CLASS + ' .' + cls.CARD_CLASS));
        removeClass(cards, cls.DROPPABLE_CLASS);
        cards.forEach((card: HTMLElement) => this.parent.dragAndDropModule.unWireDragEvents(card));
    }

    public destroy(): void {
        this.parent.resetTemplates();
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
