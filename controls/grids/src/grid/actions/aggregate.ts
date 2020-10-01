import { remove, isBlazor, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, addClass } from '@syncfusion/ej2-base';
import { NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { IAction, IGrid, NotifyArgs, ICellRenderer, IValueFormatter } from '../base/interface';
import { CellType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { ValueFormatter } from '../services/value-formatter';
import { CellRendererFactory } from '../services/cell-render-factory';
import { uiUpdate, initialEnd, dataReady, modelChanged, refreshAggregates, refreshFooterRenderer, groupAggregates } from '../base/constant';
import { FooterRenderer } from '../renderer/footer-renderer';
import { SummaryCellRenderer } from '../renderer/summary-cell-renderer';
import { AggregateRowModel, ColumnModel } from '../models/models';
import { AggregateColumn } from '../models/aggregate';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { Grid } from '../base/grid';

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
        let type: CellType[] = [CellType.Summary, CellType.CaptionSummary, CellType.GroupSummary];
        for (let i: number = 0; i < type.length; i++) {
            cellFac.addCellRenderer(type[i], instance);
        }
        this.footerRenderer = new FooterRenderer(this.parent, this.locator);
        this.footerRenderer.renderPanel();
        this.footerRenderer.renderTable();

        let footerContent: Element = this.footerRenderer.getPanel();
        if (this.parent.element.scrollHeight >= (this.parent as Grid).getHeight(this.parent.height)
         && footerContent) {
            addClass([footerContent], ['e-footerpadding']);
        }

        this.locator.register('footerRenderer', this.footerRenderer);
        let fn: Function = () => {
            this.prepareSummaryInfo();
            this.parent.off(dataReady, fn);
        };
        this.parent.on(dataReady, fn, this);
        this.parent.on(dataReady, this.footerRenderer.refresh, this.footerRenderer);
    }

    /**
     * @hidden
     */
    public prepareSummaryInfo(): void {
        summaryIterator(this.parent.aggregates, (column: AggregateColumn) => {
            let dataColumn: ColumnModel = this.parent.getColumnByField(column.field) || {};
            let type: string = dataColumn.type;
            let cFormat: string = 'customFormat';
            if (!isNullOrUndefined(column[cFormat])) {
                column.setPropertiesSilent({format: column[cFormat]});
            }
            if (typeof (column.format) === 'object') {
                let valueFormatter: ValueFormatter = new ValueFormatter();
                column.setFormatter(valueFormatter.getFormatFunction(extend({}, column.format as DateFormatOptions)));
            } else if (typeof (column.format) === 'string') {
                let fmtr: IValueFormatter = this.locator.getService<IValueFormatter>('valueFormatter');
                column.setFormatter(fmtr.getFormatFunction({ format: column.format } as NumberFormatOptions));
            }
            column.setPropertiesSilent({columnName: column.columnName || column.field });
        });
        if (isBlazor() && this.parent.isServerRendered) {
            let bulkChanges: string = 'bulkChanges';
            let aggregates: string = 'aggregates';
            let prop: string[] = Object.keys(this.parent[bulkChanges]);
            for (let i: number = 0; i < prop.length; i++) {
                if (prop[i].startsWith(aggregates)) {
                    delete this.parent[bulkChanges][prop[i]];
                }
            }
        }
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
    for (let i: number = 0; i < aggregates.length; i++) {
        for (let j: number = 0; j < aggregates[i].columns.length; j++) {
            callback(aggregates[i].columns[j], aggregates[i]);
        }
    }
}