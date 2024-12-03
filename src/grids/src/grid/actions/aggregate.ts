import { remove, extend, getValue } from '@syncfusion/ej2-base';
import { isNullOrUndefined, addClass } from '@syncfusion/ej2-base';
import { NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { IAction, IGrid, NotifyArgs, ICellRenderer, IValueFormatter } from '../base/interface';
import { CellType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { ValueFormatter } from '../services/value-formatter';
import { CellRendererFactory } from '../services/cell-render-factory';
import { uiUpdate, initialEnd, dataReady, modelChanged, refreshAggregates, refreshFooterRenderer, groupAggregates, destroy } from '../base/constant';
import { FooterRenderer } from '../renderer/footer-renderer';
import { SummaryCellRenderer } from '../renderer/summary-cell-renderer';
import { AggregateRowModel } from '../models/models';
import { AggregateColumn } from '../models/aggregate';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { Grid } from '../base/grid';
import * as literals from '../base/string-literals';

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
        const cellFac: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
        const instance: ICellRenderer<{}> = new SummaryCellRenderer(this.parent, this.locator);
        const type: CellType[] = [CellType.Summary, CellType.CaptionSummary, CellType.GroupSummary];
        for (let i: number = 0; i < type.length; i++) {
            cellFac.addCellRenderer(type[parseInt(i.toString(), 10)], instance);
        }
        this.footerRenderer = new FooterRenderer(this.parent, this.locator);
        this.footerRenderer.renderPanel();
        this.footerRenderer.renderTable();

        const footerContent: Element = this.footerRenderer.getPanel();
        if (this.parent.element.scrollHeight >= (this.parent as Grid).getHeight(this.parent.height)
         && footerContent) {
            addClass([footerContent], ['e-footerpadding']);
        }

        this.locator.register('footerRenderer', this.footerRenderer);
        const fn: Function = () => {
            this.prepareSummaryInfo();
            this.parent.off(dataReady, fn);
        };
        this.parent.on(dataReady, fn, this);
        this.parent.on(dataReady, this.footerRenderer.refresh, this.footerRenderer);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public prepareSummaryInfo(): void {
        summaryIterator(this.parent.aggregates, (column: AggregateColumn) => {
            const cFormat: string = getValue('customFormat', column);
            if (!isNullOrUndefined(cFormat)) {
                column.setPropertiesSilent({format: cFormat});
            }
            if (typeof (column.format) === 'object') {
                const valueFormatter: ValueFormatter = new ValueFormatter();
                column.setFormatter(valueFormatter.getFormatFunction(extend({}, column.format as DateFormatOptions)));
            } else if (typeof (column.format) === 'string') {
                const fmtr: IValueFormatter = this.locator.getService<IValueFormatter>('valueFormatter');
                column.setFormatter(fmtr.getFormatFunction({ format: column.format } as NumberFormatOptions));
            }
            column.setPropertiesSilent({columnName: column.columnName || column.field });
        });
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
        const cModel: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(this.parent);
        const gModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(this.parent);
        if ((<Object[]>gModel.getData()).length !== 0 || !cModel.isEmpty()) {
            this.parent.notify(modelChanged, {});
        }
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(initialEnd, this.initiateRender, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
        this.parent.on(refreshAggregates, this.refresh, this);
        this.parent.on(destroy, this.destroy, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.footerRenderer.removeEventListener();
        this.parent.off(initialEnd, this.initiateRender);
        this.parent.off(dataReady, this.footerRenderer.refresh);
        this.parent.off(uiUpdate, this.onPropertyChanged);
        this.parent.off(refreshAggregates, this.refresh);
        this.parent.off(destroy, this.destroy);
        if (this.parent.element.querySelector('.' + literals.gridFooter)) {
            remove(this.parent.element.querySelector('.' + literals.gridFooter));
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }

    public refresh(data: Object, element?: Element): void {
        const editedData: Object[] = data instanceof Array ? data : [data];
        this.parent.notify(refreshFooterRenderer, editedData);
        if (element) {
            (<{row?: Element}>editedData).row = element;
        }
        if (this.parent.groupSettings.columns.length > 0) {
            this.parent.notify(groupAggregates, editedData);
        }
    }

}

/**
 * @param {AggregateRowModel[]} aggregates - specifies the AggregateRowModel
 * @param {Function} callback - specifies the Function
 * @returns {void}
 * @private
 */
export function summaryIterator(aggregates: AggregateRowModel[], callback: Function): void {
    for (let i: number = 0; i < aggregates.length; i++) {
        for (let j: number = 0; j < aggregates[parseInt(i.toString(), 10)].columns.length; j++) {
            callback(aggregates[parseInt(i.toString(), 10)].columns[parseInt(j.toString(), 10)], aggregates[parseInt(i.toString(), 10)]);
        }
    }
}
