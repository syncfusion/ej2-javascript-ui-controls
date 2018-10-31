import { remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { IAction, IGrid, NotifyArgs, ICellRenderer } from '../base/interface';
import { CellType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { CellRendererFactory } from '../services/cell-render-factory';
import { uiUpdate, initialEnd, dataReady, modelChanged, refreshAggregates, refreshFooterRenderer, groupAggregates } from '../base/constant';
import { FooterRenderer } from '../renderer/footer-renderer';
import { SummaryCellRenderer } from '../renderer/summary-cell-renderer';
import { AggregateRowModel, ColumnModel } from '../models/models';
import { AggregateColumn } from '../models/aggregate';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';

/**
 * Summary Action controller.
 */
export class Aggregate implements IAction {
    private parent: IGrid;
    private locator: ServiceLocator;
    private footerRenderer: FooterRenderer;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'aggregate';
    }

    private initiateRender(): void {
        let cellFac: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
        let instance: ICellRenderer<{}> = new SummaryCellRenderer(this.parent, this.locator);
        [CellType.Summary, CellType.CaptionSummary, CellType.GroupSummary].forEach((type: CellType) =>
            cellFac.addCellRenderer(type, instance));
        this.footerRenderer = new FooterRenderer(this.parent, this.locator);
        this.footerRenderer.renderPanel();
        this.footerRenderer.renderTable();

        this.locator.register('footerRenderer', this.footerRenderer);
        let fn: Function = () => {
            this.prepareSummaryInfo();
            this.parent.off(dataReady, fn);
        };
        this.parent.on(dataReady, fn, this);
        this.parent.on(dataReady, this.footerRenderer.refresh, this.footerRenderer);
    }

    private prepareSummaryInfo(): void {
        summaryIterator(this.parent.aggregates, (column: AggregateColumn) => {
            let dataColumn: ColumnModel = this.parent.getColumnByField(column.field) || {};
            let type: string = dataColumn.type;
            column.setPropertiesSilent({format: this.getFormatFromType(column.format, type)});
            column.setFormatter(this.parent.locale);
            column.setPropertiesSilent({columnName: column.columnName || column.field });
        });
    }

    private getFormatFromType(format: string | NumberFormatOptions | DateFormatOptions, type: string):
        string | NumberFormatOptions | DateFormatOptions {
        if (isNullOrUndefined(type) || typeof format !== 'string') {
            return format;
        }
        let obj: string | NumberFormatOptions | DateFormatOptions;
        switch (type) {
            case 'number':
                obj = { format: format };
                break;
            case 'date':
                obj = { type: type, skeleton: format };
                break;
            case 'datetime':
                obj = { type: 'dateTime', skeleton: format };
                break;
        }

        return obj;
    }

    public onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }

        if (isNullOrUndefined(this.footerRenderer)) {
            this.initiateRender();
        }
        this.prepareSummaryInfo();
        this.footerRenderer.refresh();
        let cModel: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(this.parent);
        let gModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(this.parent);
        if ((<Object[]>gModel.getData()).length !== 0 || !cModel.isEmpty()) {
            this.parent.notify(modelChanged, {});
        }
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(initialEnd, this.initiateRender, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
        this.parent.on(refreshAggregates, this.refresh, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.footerRenderer.removeEventListener();
        this.parent.off(initialEnd, this.initiateRender);
        this.parent.off(dataReady, this.footerRenderer.refresh);
        this.parent.off(uiUpdate, this.onPropertyChanged);
        this.parent.off(refreshAggregates, this.refresh);
    }

    public destroy(): void {
        this.removeEventListener();
        remove(this.parent.element.querySelector('.e-gridfooter'));
    }

    public refresh(data: Object): void {
        let editedData: Object[] = data instanceof Array ? data : [data];
        this.parent.notify(refreshFooterRenderer, editedData);
        if (this.parent.groupSettings.columns.length > 0) {
            this.parent.notify(groupAggregates, editedData);
        }
    }

}
/**
 * @private
 */
export function summaryIterator(aggregates: AggregateRowModel[], callback: Function): void {
    aggregates.forEach((row: AggregateRowModel) => {
        row.columns.forEach((column: AggregateColumn) => {
            callback(column, row);
        });
    });
}