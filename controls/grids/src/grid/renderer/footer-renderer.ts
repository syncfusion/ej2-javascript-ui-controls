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
     */
    public renderPanel(): void {
        let div: Element = this.parent.createElement('div', { className: literals.gridFooter });
        let innerDiv: Element = this.parent.createElement('div', { className: 'e-summarycontent' });
        let movableContent: Element = innerDiv;
        if (this.parent.isFrozenGrid()) {
            let fDiv: Element = this.parent.createElement('div', { className: 'e-frozenfootercontent e-frozen-left-footercontent' });
            let mDiv: Element = this.parent.createElement('div', { className: 'e-movablefootercontent' });
            let frDiv: Element = this.parent.createElement('div', { className: 'e-frozenfootercontent e-frozen-right-footercontent' });
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
     */
    public renderTable(): void {
        let frzCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        let innerDiv: Element = this.createContentTable('_footer_table');
        let table: HTMLTableElement = <HTMLTableElement>innerDiv.querySelector('.' + literals.table);
        let tFoot: HTMLTableSectionElement = <HTMLTableSectionElement>this.parent.createElement('tfoot');
        table.appendChild(tFoot);
        if (this.parent.isFrozenGrid()) {
            let freezeTable: HTMLTableElement = table.cloneNode(true) as HTMLTableElement;
            let frTable: HTMLTableElement = table.cloneNode(true) as HTMLTableElement;
            if (frzCols) {
                this.frozenContent.appendChild(freezeTable);
                this.freezeTable = freezeTable;
            }
            if (this.parent.getFrozenRightColumnsCount()) {
                remove(frTable.querySelector(literals.colGroup));
                let hdr: Element = this.parent.getHeaderContent().querySelector('.e-frozen-right-header');
                let frCol: Element = (hdr.querySelector(literals.colGroup).cloneNode(true)) as Element;
                frTable.insertBefore(frCol, frTable.querySelector( literals.tbody));
                this.frozenRightContent.appendChild(frTable);
                this.frTable = frTable;
            }
            this.movableContent.appendChild(table);
            remove(table.querySelector(literals.colGroup));
            let colGroup: Element
                = ((this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector(literals.colGroup)).cloneNode(true)) as Element;
            table.insertBefore(colGroup, table.querySelector( literals.tbody));
            this.setColGroup(colGroup);
        }
        this.setTable(table);
    }

    private renderSummaryContent(e?: Object, table?: HTMLTableElement, cStart?: number, cEnd?: number): void {
        let input: Object[] = this.parent.dataSource instanceof Array ? this.parent.dataSource : this.parent.currentViewData;
        let summaries: AggregateRowModel[] = <AggregateRowModel[]>this.modelGenerator.getData();
        let dummies: Column[] = isNullOrUndefined(cStart) ? this.modelGenerator.getColumns() :
        this.modelGenerator.getColumns(cStart, cEnd);
        let rows: Row<AggregateColumnModel>[] = isNullOrUndefined(cStart) ? this.modelGenerator.generateRows(input, e || this.aggregates) :
        this.modelGenerator.generateRows(input, e || this.aggregates, cStart, cEnd);
        let fragment: DocumentFragment = <DocumentFragment>document.createDocumentFragment();

        let rowrenderer: RowRenderer<AggregateColumnModel> = new RowRenderer<AggregateColumnModel>(this.locator, null, this.parent);
        rowrenderer.element = this.parent.createElement('TR', { className: 'e-summaryrow' });

        for (let srow: number = 0, len: number = summaries.length; srow < len; srow ++) {
            let row: Row<AggregateColumnModel> = rows[srow];
            if (!row) { continue; }
            let tr: Element = rowrenderer.render(row, dummies);
            fragment.appendChild(tr);
        }

        table.tFoot.appendChild(fragment);
        this.aggregates = !isNullOrUndefined(e) ? e : this.aggregates;
    }

    public refresh(e?: { aggregates?: Object }): void {
        let frzCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        let movable: number = this.parent.getMovableColumnsCount();
        let right: number = this.parent.getFrozenRightColumnsCount();
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
            let movableLastCell: Element[] = [].slice.call(this.getTable().getElementsByClassName('e-lastsummarycell'));
            if (movableLastCell.length) {
                for (let i: number = 0; i < movableLastCell.length; i++) {
                    (movableLastCell[i] as HTMLElement).style.borderRight = '0px';
                }
            }
        }
        // check freeze content have no row case
        if (this.parent.isFrozenGrid()) {
            let movableCnt: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.e-movablefootercontent')
                .getElementsByClassName('e-summaryrow'));
            let frozenCnt: HTMLElement[];
            if (frzCols) {
                frozenCnt = [].slice.call(this.parent.element.querySelector('.e-frozen-left-footercontent')
                    .getElementsByClassName('e-summaryrow'));
                this.refreshHeight(frozenCnt, movableCnt);
                let frozenDiv: HTMLElement = <HTMLElement>this.frozenContent;
                if (!frozenDiv.offsetHeight) {
                    frozenDiv.style.height = (<HTMLElement>this.getTable()).offsetHeight + 'px';
                }
            }
            if (right) {
                let frCnt: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.e-frozen-right-footercontent')
                    .getElementsByClassName('e-summaryrow'));
                this.refreshHeight(frCnt, movableCnt);
                if (frozenCnt) {
                    this.refreshHeight(frCnt, frozenCnt);
                }
                let frDiv: HTMLElement = <HTMLElement>this.frTable;
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
            let frozenHeight: number = frozenCnt[i].getBoundingClientRect().height;
            let movableHeight: number = movableCnt[i].getBoundingClientRect().height;
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
        let fheaderCol: Node = mheaderCol = this.parent.element.querySelector('.' + literals.gridHeader).querySelector(literals.colGroup).cloneNode(true);
        if (this.parent.getFrozenColumns()) {
            let isXaxis: boolean = this.parent.enableColumnVirtualization && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis();
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
        let fCol: number = this.parent.getFrozenColumns();
        fCol = fCol && this.parent.isRowDragable() ? fCol + 1 : fCol;
        if (fCol && fCol > index) {
            return this.freezeTable.querySelector(literals.colGroup).children[index] as HTMLElement;
        }
        return this.getColGroup().children[index - fCol] as HTMLElement;
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
        let tHead: HTMLTableElement = this.parent.getHeaderTable() as HTMLTableElement;
        if (tHead && tFoot) {
            tFoot.style.width = tHead.style.width;
        }
    }
    public refreshFooterRenderer(editedData: Object[]): void {
        let aggregates: Object = this.onAggregates(editedData);
        this.refresh(aggregates);
    }
    public getIndexByKey(data: object, ds: object[]): number {
        let key: string = this.parent.getPrimaryKeyFieldNames()[0];
        for (let i: number = 0; i < ds.length; i++) {
            if (ds[i][key] === data[key]) {
                return i;
            }
        }
        return -1;
    }

    public onAggregates(editedData: Object[]): Object {
        editedData = editedData instanceof Array ? editedData : [];
        let field: string = this.parent.getPrimaryKeyFieldNames()[0];
        let dataSource: object[] = [];
        let isModified: boolean = false;
        let batchChanges: Object = {};
        let gridData: string = 'dataSource';
        let currentViewData: Object[] = this.parent.dataSource instanceof Array ?
            this.parent.dataSource : this.parent.dataSource[gridData].json.length
            ? this.parent.dataSource[gridData].json : this.parent.getCurrentViewRecords();
        if (this.parent.editModule) {
            batchChanges = this.parent.editModule.getBatchChanges();
        }
        if (Object.keys(batchChanges).length) {
            for (let i: number = 0; i < currentViewData.length; i++) {
                isModified = false;
                if (batchChanges[literals.changedRecords].length && this.getIndexByKey(currentViewData[i], batchChanges[literals.changedRecords]) > -1) {
                    isModified = true;
                    dataSource.push(batchChanges[literals.changedRecords][this.getIndexByKey(currentViewData[i], batchChanges[literals.changedRecords])]);
                }
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
                let data: Object[] = iterateExtend(currentViewData);
                dataSource = data.map((item: Object) => {
                    let idVal: Object = DataUtil.getObject(field, item);
                    let value: Object;
                    let hasVal: boolean = editedData.some((cItem: Object) => {
                        value = cItem;
                        return idVal === DataUtil.getObject(field, cItem);
                    });
                    return hasVal ? value : item;
                });
            } else {
                dataSource = currentViewData;
            }
        }
        let eData: Object = editedData;
        if (((<{ type: string }>eData).type && (<{ type: string }>eData).type === 'cancel')) {
            dataSource = currentViewData;
        }
        let aggregate: Object = {};
        let agrVal: Object;
        let aggregateRows: AggregateRow | Object[] = this.parent.aggregates;
        for (let i: number = 0; i < aggregateRows.length; i++) {
            for (let j: number = 0; j < (aggregateRows[i] as AggregateRow).columns.length; j++) {
                let data: Object[] = [];
                let type: string = (aggregateRows[i] as AggregateRow).columns[j].type.toString();
                data = dataSource;
                agrVal = calculateAggregate(type, data, (aggregateRows[i] as AggregateRow).columns[j], this.parent);
                aggregate[(aggregateRows[i] as AggregateRow).columns[j].field + ' - ' + type.toLowerCase()] = agrVal;
            }
        }
        let result: Object = {
            result: dataSource,
            count: dataSource.length,
            aggregates: aggregate
        };
        return result;
    }
}
