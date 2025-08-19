import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { formatUnit, removeClass } from '@syncfusion/ej2-base';
import { IRenderer, IGrid } from '../base/interface';
import { colGroupRefresh, columnWidthChanged, scroll, columnVisibilityChanged, refreshFooterRenderer } from '../base/constant';
import { Column } from '../models/column';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import { Row } from '../models/row';
import { ContentRender } from './content-renderer';
import { RowRenderer } from './row-renderer';
import { HeaderRender } from './header-renderer';
import { ServiceLocator } from '../services/service-locator';
import { SummaryModelGenerator } from '../services/summary-model-generator';
import { calculateAggregate, iterateExtend, addRemoveEventListener, applyStickyLeftRightPosition } from '../base/util';
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
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (this.parent.allowPaging && this.parent.getPager() != null) {
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
        const innerDiv: Element = this.createContentTable('_footer_table');
        const table: HTMLTableElement = <HTMLTableElement>innerDiv.querySelector('.' + literals.table);
        const tFoot: HTMLTableSectionElement = <HTMLTableSectionElement>this.parent.createElement('tfoot');
        table.appendChild(tFoot);
        this.setTable(table);
    }

    private renderSummaryContent(e?: Object, table?: HTMLTableElement, cStart?: number, cEnd?: number): void {
        const input: Object[] = this.parent.dataSource instanceof Array ? !this.parent.getDataModule().isRemote() &&
            this.parent.parentDetails ? this.getData() : this.parent.dataSource : this.parent.currentViewData;
        const summaries: AggregateRowModel[] = <AggregateRowModel[]>this.modelGenerator.getData();
        const dummies: Column[] = isNullOrUndefined(cStart) ? this.modelGenerator.getColumns() :
            this.modelGenerator.getColumns(cStart);
        // eslint-disable-next-line max-len
        const rows: Row<AggregateColumnModel>[] = isNullOrUndefined(cStart) ? this.modelGenerator.generateRows(input, e || this.aggregates) :
            this.modelGenerator.generateRows(input, e || this.aggregates, cStart, cEnd);
        const fragment: DocumentFragment = <DocumentFragment>document.createDocumentFragment();

        const rowrenderer: RowRenderer<AggregateColumnModel> = new RowRenderer<AggregateColumnModel>(this.locator, null, this.parent);
        rowrenderer.element = this.parent.createElement('TR', { className: 'e-summaryrow', attrs: { role: 'row' } });

        for (let srow: number = 0, len: number = summaries.length; srow < len; srow ++) {
            const row: Row<AggregateColumnModel> = rows[parseInt(srow.toString(), 10)];
            if (!row) { continue; }
            const tr: Element = rowrenderer.render(row, dummies);
            if (tr.querySelectorAll('.e-leftfreeze').length && tr.querySelectorAll('.e-indentcell').length) {
                const td: NodeListOf<Element> = tr.querySelectorAll('.e-indentcell');
                for (let i: number = 0; i < td.length; i++) {
                    td[parseInt(i.toString(), 10)].classList.add('e-leftfreeze');
                    applyStickyLeftRightPosition(td[parseInt(i.toString(), 10)] as HTMLElement, i * 30, this.parent.enableRtl, 'Left');
                }
            }
            if (this.parent.isFrozenGrid() && tr.querySelectorAll('.e-summarycell').length) {
                removeClass([].slice.call(tr.querySelectorAll('.e-summarycell')), ['e-freezeleftborder', 'e-freezerightborder']);
            }
            fragment.appendChild(tr);
        }
        const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
            this.parent.parentDetails.parentInstObj.isReact;
        if ((this.parent.isReact || isReactChild) && summaries.length && this.parent.isInitialLoad) {
            this.parent.renderTemplates(function(): void {
                table.tFoot.innerHTML = '';
                table.tFoot.appendChild(fragment);
            });
        } else {
            table.tFoot.appendChild(fragment);
        }
        this.aggregates = !isNullOrUndefined(e) ? e : this.aggregates;
    }

    public refresh(e?: { aggregates?: Object }): void {
        const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
            this.parent.parentDetails.parentInstObj.isReact;
        if (!(this.parent.isReact || isReactChild) || !this.parent.isInitialLoad) {
            (<HTMLTableElement>this.getTable()).tFoot.innerHTML = '';
        }
        this.renderSummaryContent(e, <HTMLTableElement>this.getTable(), undefined, undefined);
        if (isNullOrUndefined(e) && this.parent.isAutoFitColumns) {
            this.parent.autoFitColumns();
        }
        this.onScroll();
    }

    public refreshCol(): void {
        // frozen table
        const mheaderCol: Node = this.parent.enableColumnVirtualization ? (<HeaderRender>this.parent.headerModule).getColGroup() :
            this.parent.element.querySelector('.' + literals.gridHeader).querySelector(literals.colGroup).cloneNode(true);
        this.getTable().replaceChild(mheaderCol, this.getColGroup());
        this.setColGroup(<Element>mheaderCol);
    }

    private onWidthChange(args: { index: number, width: number, module: string }): void {
        this.getColFromIndex(args.index).style.width = formatUnit(args.width);
        if (this.parent.allowResizing && args.module === 'resize') { this.updateFooterTableWidth(this.getTable() as HTMLElement); }
    }

    private onScroll(e: { left: number } =
    {
        left: (<HTMLElement>this.parent.getContent().firstChild).scrollLeft
    }): void {
        (<HTMLElement>this.getTable().parentElement).scrollLeft = e.left;
    }

    public getColFromIndex(index?: number): HTMLElement {
        return this.getColGroup().children[parseInt(index.toString(), 10)] as HTMLElement;
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
            if (ds[parseInt(i.toString(), 10)][`${key}`] === data[`${key}`]) {
                return i;
            }
        }
        return -1;
    }

    private getData(): object[] {
        return this.parent.getDataModule().dataManager.executeLocal(this.parent.getDataModule().generateQuery(true));
    }

    public onAggregates(editedData: Object[]): Object {
        editedData = editedData instanceof Array ? editedData : [];
        const field: string = this.parent.getPrimaryKeyFieldNames()[0];
        let dataSource: object[] = [];
        let isModified: boolean = false;
        let batchChanges: Object = {};
        const gridData: string = 'dataSource';
        let isFiltered: boolean = false;
        if (!(this.parent.renderModule.data.isRemote() || (!isNullOrUndefined(this.parent.dataSource)
            && (<{result: object[]}>this.parent.dataSource).result)) && ((this.parent.allowFiltering
            && this.parent.filterSettings.columns.length) || this.parent.searchSettings.key.length)) {
            isFiltered = true;
        }
        let currentViewData: Object[];
        if (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result) {
            currentViewData = this.parent.getCurrentViewRecords();
        } else {
            currentViewData = this.parent.dataSource instanceof Array ?
                (isFiltered ? this.parent.getFilteredRecords() : this.parent.dataSource) : (this.parent.dataSource[`${gridData}`].json.length ?
                    (isFiltered ? this.parent.getFilteredRecords() : this.parent.dataSource[`${gridData}`].json)
                    : this.parent.getCurrentViewRecords());
        }
        if (this.parent.parentDetails && !this.parent.getDataModule().isRemote()) {
            currentViewData = this.getData();
        }
        if (this.parent.editModule) {
            batchChanges = this.parent.editModule.getBatchChanges();
        }
        if (Object.keys(batchChanges).length) {
            for (let i: number = 0; i < currentViewData.length; i++) {
                isModified = false;
                // eslint-disable-next-line max-len
                if (batchChanges[literals.changedRecords].length && this.getIndexByKey(currentViewData[parseInt(i.toString(), 10)], batchChanges[literals.changedRecords]) > -1) {
                    isModified = true;
                    // eslint-disable-next-line max-len
                    dataSource.push(batchChanges[literals.changedRecords][this.getIndexByKey(currentViewData[parseInt(i.toString(), 10)], batchChanges[literals.changedRecords])]);
                }
                // eslint-disable-next-line max-len
                if (batchChanges[literals.deletedRecords].length && this.getIndexByKey(currentViewData[parseInt(i.toString(), 10)], batchChanges[literals.deletedRecords]) > -1) {
                    isModified = true;
                } else if (!isModified) {
                    dataSource.push(currentViewData[parseInt(i.toString(), 10)]);
                }
            }
            if (batchChanges[literals.addedRecords].length) {
                for (let i: number = 0; i < batchChanges[literals.addedRecords].length; i++) {
                    dataSource.push(batchChanges[literals.addedRecords][parseInt(i.toString(), 10)]);
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
            for (let j: number = 0; j < (aggregateRows[parseInt(i.toString(), 10)] as AggregateRow).columns.length; j++) {
                let data: Object[] = [];
                const type: string = (aggregateRows[parseInt(i.toString(), 10)] as AggregateRow)
                    .columns[parseInt(j.toString(), 10)].type.toString();
                data = dataSource;
                const types: string[] = type.split(',').map((t: string) => t.trim());
                for (const aggregateType of types) {
                    agrVal = calculateAggregate(aggregateType, data, (aggregateRows[parseInt(i.toString(), 10)] as AggregateRow)
                        .columns[parseInt(j.toString(), 10)], this.parent);
                    aggregate[(aggregateRows[parseInt(i.toString(), 10)] as AggregateRow).columns[parseInt(j.toString(), 10)].field + ' - ' + aggregateType.toLowerCase()] = agrVal;
                }
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
