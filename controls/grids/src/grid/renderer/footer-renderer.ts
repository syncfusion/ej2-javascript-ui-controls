import { isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { formatUnit } from '@syncfusion/ej2-base';
import { IRenderer, IGrid } from '../base/interface';
import { Browser } from '@syncfusion/ej2-base';
import { colGroupRefresh, columnWidthChanged, scroll, columnVisibilityChanged, refreshFooterRenderer } from '../base/constant';
import { Column } from '../models/column';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import { Row } from '../models/row';
import { ContentRender } from './content-renderer';
import { RowRenderer } from './row-renderer';
import { ServiceLocator } from '../services/service-locator';
import { SummaryModelGenerator } from '../services/summary-model-generator';
import { renderMovable, calculateAggregate, iterateExtend, addRemoveEventListener } from '../base/util';
import { AggregateRow } from '../models/aggregate';
import { DataUtil } from '@syncfusion/ej2-data';
import * as literals from '../base/string-literals';

/**
 * Footer module is used to render grid content
 *
 * @hidden
 */
export class FooterRenderer extends ContentRender implements IRenderer {
    //private parent: Grid;
    private locator: ServiceLocator;
    protected modelGenerator: SummaryModelGenerator;
    private aggregates: Object = {};
    private freezeTable: HTMLTableElement;
    private frTable: HTMLTableElement;
    private frozenContent: Element;
    private movableContent: Element;
    private frozenRightContent: Element;
    private evtHandlers: { event: string, handler: Function }[];
    constructor(gridModule?: IGrid, serviceLocator?: ServiceLocator) {
        super(gridModule, serviceLocator);
        this.parent = gridModule;
        this.locator = serviceLocator;
        this.modelGenerator = new SummaryModelGenerator(this.parent);
        this.addEventListener();
    }

    /**
     * The function is used to render grid footer div
     *
     * @returns {void}
     */
    public renderPanel(): void {
        const div: Element = this.parent.createElement('div', { className: literals.gridFooter });
        const innerDiv: Element = this.parent.createElement('div', { className: 'e-summarycontent' });
        let movableContent: Element = innerDiv;
        if (this.parent.isFrozenGrid()) {
            const fDiv: Element = this.parent.createElement('div', { className: 'e-frozenfootercontent e-frozen-left-footercontent' });
            const mDiv: Element = this.parent.createElement('div', { className: 'e-movablefootercontent' });
            const frDiv: Element = this.parent.createElement('div', { className: 'e-frozenfootercontent e-frozen-right-footercontent' });
            if (this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount()) {
                innerDiv.appendChild(fDiv);
                this.frozenContent = fDiv;
            }
            innerDiv.appendChild(mDiv);
            this.movableContent = mDiv;
            movableContent = mDiv;
            if (this.parent.getFrozenRightColumnsCount()) {
                innerDiv.appendChild(frDiv);
                this.frozenRightContent = frDiv;
            }
        }
        if (Browser.isDevice) { (<HTMLElement>movableContent).style.overflowX = 'scroll'; }
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (this.parent.getPager() != null) {
            this.parent.element.insertBefore(div, this.parent.getPager());
        } else {
            this.parent.element.appendChild(div);
        }
    }
    /**
     * The function is used to render grid footer table
     *
     * @returns {void}
     */
    public renderTable(): void {
        const frzCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        const innerDiv: Element = this.createContentTable('_footer_table');
        const table: HTMLTableElement = <HTMLTableElement>innerDiv.querySelector('.' + literals.table);
        const tFoot: HTMLTableSectionElement = <HTMLTableSectionElement>this.parent.createElement('tfoot');
        table.appendChild(tFoot);
        if (this.parent.isFrozenGrid()) {
            const freezeTable: HTMLTableElement = table.cloneNode(true) as HTMLTableElement;
            const frTable: HTMLTableElement = table.cloneNode(true) as HTMLTableElement;
            if (frzCols) {
                this.frozenContent.appendChild(freezeTable);
                this.freezeTable = freezeTable;
            }
            if (this.parent.getFrozenRightColumnsCount()) {
                remove(frTable.querySelector(literals.colGroup));
                const hdr: Element = this.parent.getHeaderContent().querySelector('.e-frozen-right-header');
                const frCol: Element = (hdr.querySelector(literals.colGroup).cloneNode(true)) as Element;
                frTable.insertBefore(frCol, frTable.querySelector( literals.tbody));
                this.frozenRightContent.appendChild(frTable);
                this.frTable = frTable;
            }
            this.movableContent.appendChild(table);
            remove(table.querySelector(literals.colGroup));
            const colGroup: Element
                = ((this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector(literals.colGroup)).cloneNode(true)) as Element;
            table.insertBefore(colGroup, table.querySelector( literals.tbody));
            this.setColGroup(colGroup);
        }
        this.setTable(table);
    }

    private renderSummaryContent(e?: Object, table?: HTMLTableElement, cStart?: number, cEnd?: number): void {
        const input: Object[] = this.parent.dataSource instanceof Array ? this.parent.dataSource : this.parent.currentViewData;
        const summaries: AggregateRowModel[] = <AggregateRowModel[]>this.modelGenerator.getData();
        const dummies: Column[] = isNullOrUndefined(cStart) ? this.modelGenerator.getColumns() :
            this.modelGenerator.getColumns(cStart, cEnd);
        // eslint-disable-next-line max-len
        const rows: Row<AggregateColumnModel>[] = isNullOrUndefined(cStart) ? this.modelGenerator.generateRows(input, e || this.aggregates) :
            this.modelGenerator.generateRows(input, e || this.aggregates, cStart, cEnd);
        const fragment: DocumentFragment = <DocumentFragment>document.createDocumentFragment();

        const rowrenderer: RowRenderer<AggregateColumnModel> = new RowRenderer<AggregateColumnModel>(this.locator, null, this.parent);
        rowrenderer.element = this.parent.createElement('TR', { className: 'e-summaryrow' });

        for (let srow: number = 0, len: number = summaries.length; srow < len; srow ++) {
            const row: Row<AggregateColumnModel> = rows[srow];
            if (!row) { continue; }
            const tr: Element = rowrenderer.render(row, dummies);
            fragment.appendChild(tr);
        }

        table.tFoot.appendChild(fragment);
        this.aggregates = !isNullOrUndefined(e) ? e : this.aggregates;
    }

    public refresh(e?: { aggregates?: Object }): void {
        const frzCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        const movable: number = this.parent.getMovableColumnsCount();
        const right: number = this.parent.getFrozenRightColumnsCount();
        if (this.parent.isFrozenGrid()) {
            remove(this.getPanel());
            this.renderPanel();
            this.renderTable();
            if (frzCols) {
                this.freezeTable.tFoot.innerHTML = '';
                this.renderSummaryContent(e, this.freezeTable, 0, frzCols);
            }
        }
        (<HTMLTableElement>this.getTable()).tFoot.innerHTML = '';
        this.renderSummaryContent(e, <HTMLTableElement>this.getTable(), frzCols, right ? frzCols + movable : undefined);
        if (this.parent.getFrozenRightColumnsCount()) {
            this.frTable.tFoot.innerHTML = '';
            this.renderSummaryContent(e, this.frTable, frzCols + movable, frzCols + movable + right);
            const movableLastCell: Element[] = [].slice.call(this.getTable().getElementsByClassName('e-lastsummarycell'));
            if (movableLastCell.length) {
                for (let i: number = 0; i < movableLastCell.length; i++) {
                    (movableLastCell[i] as HTMLElement).style.borderRight = '0px';
                }
            }
        }
        // check freeze content have no row case
        if (this.parent.isFrozenGrid()) {
            const movableCnt: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.e-movablefootercontent')
                .getElementsByClassName('e-summaryrow'));
            let frozenCnt: HTMLElement[];
            if (frzCols) {
                frozenCnt = [].slice.call(this.parent.element.querySelector('.e-frozen-left-footercontent')
                    .getElementsByClassName('e-summaryrow'));
                this.refreshHeight(frozenCnt, movableCnt);
                const frozenDiv: HTMLElement = <HTMLElement>this.frozenContent;
                if (!frozenDiv.offsetHeight) {
                    frozenDiv.style.height = (<HTMLElement>this.getTable()).offsetHeight + 'px';
                }
            }
            if (right) {
                const frCnt: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.e-frozen-right-footercontent')
                    .getElementsByClassName('e-summaryrow'));
                this.refreshHeight(frCnt, movableCnt);
                if (frozenCnt) {
                    this.refreshHeight(frCnt, frozenCnt);
                }
                const frDiv: HTMLElement = <HTMLElement>this.frTable;
                if (!frDiv.offsetHeight) {
                    frDiv.style.height = (<HTMLElement>this.getTable()).offsetHeight + 'px';
                }
            }
            if (this.parent.allowResizing) { this.updateFooterTableWidth(this.getTable() as HTMLElement); }
        }
        this.onScroll();
    }

    private refreshHeight(frozenCnt: HTMLElement[], movableCnt: HTMLElement[]): void {
        for (let i: number = 0; i < frozenCnt.length; i++) {
            const frozenHeight: number = frozenCnt[i].getBoundingClientRect().height;
            const movableHeight: number = movableCnt[i].getBoundingClientRect().height;
            if (frozenHeight < movableHeight) {
                frozenCnt[i].classList.remove('e-hide');
                frozenCnt[i].style.height = movableHeight + 'px';
            } else if (frozenHeight > movableHeight) {
                movableCnt[i].classList.remove('e-hide');
                movableCnt[i].style.height = frozenHeight + 'px';
            }
        }
    }

    public refreshCol(): void {
        // frozen table
        let mheaderCol: Node;
        const fheaderCol: Node = mheaderCol = this.parent.element.querySelector('.' + literals.gridHeader).querySelector(literals.colGroup).cloneNode(true);
        if (this.parent.getFrozenColumns()) {
            // eslint-disable-next-line max-len
            const isXaxis: boolean = this.parent.enableColumnVirtualization && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis();
            if (isXaxis) {
                mheaderCol = this.parent.getMovableVirtualHeader().querySelector(literals.colGroup).cloneNode(true);
            } else {
                mheaderCol = renderMovable(<Element>fheaderCol, this.parent.getFrozenColumns(), this.parent);
                this.freezeTable.replaceChild(fheaderCol, this.freezeTable.querySelector(literals.colGroup));
            }
        }
        this.getTable().replaceChild(mheaderCol, this.getColGroup());
        this.setColGroup(<Element>mheaderCol);
    }

    private onWidthChange(args: { index: number, width: number, module: string }): void {
        this.getColFromIndex(args.index).style.width = formatUnit(args.width);
        if (this.parent.allowResizing && args.module === 'resize') { this.updateFooterTableWidth(this.getTable() as HTMLElement); }
    }

    private onScroll(e: { left: number } =
    {
        left: this.parent.isFrozenGrid() ? (<HTMLElement>this.parent.getContent().querySelector('.' + literals.movableContent)).scrollLeft :
            (<HTMLElement>this.parent.getContent().firstChild).scrollLeft
    }): void {
        (<HTMLElement>this.getTable().parentElement).scrollLeft = e.left;
    }

    public getColFromIndex(index?: number): HTMLElement {
        const left: number = this.parent.getVisibleFrozenLeftCount() || this.parent.getFrozenColumns();
        const movable: number = this.parent.getVisibleMovableCount();
        const right: number = this.parent.getVisibleFrozenRightCount();
        const isDrag: number = this.parent.isRowDragable() && !(this.parent.getFrozenMode() === 'Right') ? 1 : 0;
        if (left && index < (left + isDrag)) {
            return this.freezeTable.querySelector(literals.colGroup).children[index] as HTMLElement;
        } else if (right && (index >= (left + movable + isDrag))) {
            return this.frTable.querySelector(literals.colGroup).children[index - (left ? (left + movable + isDrag) :
                (left + movable))] as HTMLElement;
        }
        return this.getColGroup().children[index - (left ? (left + isDrag) : left)] as HTMLElement;
    }

    private columnVisibilityChanged(): void {
        this.refresh();
    }

    public addEventListener(): void {
        this.evtHandlers = [{event: colGroupRefresh, handler: this.refreshCol},
            {event: columnWidthChanged, handler: this.onWidthChange},
            {event: scroll, handler: this.onScroll},
            {event: columnVisibilityChanged, handler: this.columnVisibilityChanged},
            {event: refreshFooterRenderer, handler: this.refreshFooterRenderer}];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    }

    public removeEventListener(): void {
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    }
    private updateFooterTableWidth(tFoot: HTMLElement): void {
        const tHead: HTMLTableElement = this.parent.getHeaderTable() as HTMLTableElement;
        if (tHead && tFoot) {
            tFoot.style.width = tHead.style.width;
        }
    }
    public refreshFooterRenderer(editedData: Object[]): void {
        const aggregates: Object = this.onAggregates(editedData);
        this.refresh(aggregates);
    }
    public getIndexByKey(data: object, ds: object[]): number {
        const key: string = this.parent.getPrimaryKeyFieldNames()[0];
        for (let i: number = 0; i < ds.length; i++) {
            if (ds[i][key] === data[key]) {
                return i;
            }
        }
        return -1;
    }

    public onAggregates(editedData: Object[]): Object {
        editedData = editedData instanceof Array ? editedData : [];
        const field: string = this.parent.getPrimaryKeyFieldNames()[0];
        let dataSource: object[] = [];
        let isModified: boolean = false;
        let batchChanges: Object = {};
        const gridData: string = 'dataSource';
        let isFiltered: boolean = false;
        if (!this.parent.renderModule.data.isRemote() && this.parent.allowFiltering && this.parent.filterSettings.columns.length) {
            isFiltered = true;
        }
        const currentViewData: Object[] = this.parent.dataSource instanceof Array ?
            (isFiltered ? this.parent.getFilteredRecords() : this.parent.dataSource) : (this.parent.dataSource[gridData].json.length ?
                this.parent.dataSource[gridData].json : this.parent.getCurrentViewRecords());
        if (this.parent.editModule) {
            batchChanges = this.parent.editModule.getBatchChanges();
        }
        if (Object.keys(batchChanges).length) {
            for (let i: number = 0; i < currentViewData.length; i++) {
                isModified = false;
                // eslint-disable-next-line max-len
                if (batchChanges[literals.changedRecords].length && this.getIndexByKey(currentViewData[i], batchChanges[literals.changedRecords]) > -1) {
                    isModified = true;
                    // eslint-disable-next-line max-len
                    dataSource.push(batchChanges[literals.changedRecords][this.getIndexByKey(currentViewData[i], batchChanges[literals.changedRecords])]);
                }
                // eslint-disable-next-line max-len
                if (batchChanges[literals.deletedRecords].length && this.getIndexByKey(currentViewData[i], batchChanges[literals.deletedRecords]) > -1) {
                    isModified = true;
                } else if (!isModified) {
                    dataSource.push(currentViewData[i]);
                }
            }
            if (batchChanges[literals.addedRecords].length) {
                for (let i: number = 0; i < batchChanges[literals.addedRecords].length; i++) {
                    dataSource.push(batchChanges[literals.addedRecords][i]);
                }
            }
        } else {
            if (editedData.length) {
                const data: Object[] = iterateExtend(currentViewData);
                dataSource = data.map((item: Object) => {
                    const idVal: Object = DataUtil.getObject(field, item);
                    let value: Object;
                    const hasVal: boolean = editedData.some((cItem: Object) => {
                        value = cItem;
                        return idVal === DataUtil.getObject(field, cItem);
                    });
                    return hasVal ? value : item;
                });
            } else {
                dataSource = currentViewData;
            }
        }
        const eData: Object = editedData;
        if (((<{ type: string }>eData).type && (<{ type: string }>eData).type === 'cancel')) {
            dataSource = currentViewData;
        }
        const aggregate: Object = {};
        let agrVal: Object;
        const aggregateRows: AggregateRow | Object[] = this.parent.aggregates;
        for (let i: number = 0; i < aggregateRows.length; i++) {
            for (let j: number = 0; j < (aggregateRows[i] as AggregateRow).columns.length; j++) {
                let data: Object[] = [];
                const type: string = (aggregateRows[i] as AggregateRow).columns[j].type.toString();
                data = dataSource;
                agrVal = calculateAggregate(type, data, (aggregateRows[i] as AggregateRow).columns[j], this.parent);
                aggregate[(aggregateRows[i] as AggregateRow).columns[j].field + ' - ' + type.toLowerCase()] = agrVal;
            }
        }
        const result: Object = {
            result: dataSource,
            count: dataSource.length,
            aggregates: aggregate
        };
        return result;
    }
}
