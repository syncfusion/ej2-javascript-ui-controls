import { TreeGrid, ExcelExport as TreeGridExcel } from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Gantt Excel Export module
 *
 * @hidden
 */
export class ExcelExport {
    private parent: Gantt;
    /**
     * Constructor for Excel Export module
     *
     * @param {Gantt} gantt .
     */
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridExcel);
        this.parent.treeGrid.allowExcelExport = this.parent.allowExcelExport;
        this.bindEvents();
    }
    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} .
     * @private
     */
    protected getModuleName(): string {
        return 'excelExport';
    }
    /**
     * To destroy excel export module.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
    }
    /**
     * To bind excel exporting events.
     *
     * @returns {void} .
     * @private
     */
    private bindEvents(): void {
        this.parent.treeGrid.beforeExcelExport = (args: Object) => {
            this.parent.trigger('beforeExcelExport', args);
            if (!getValue('cancel', args)) {
                if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer') {
                    this.parent.showMaskRow();
                } else {
                    this.parent.showSpinner();
                }
            }
        };
        this.parent.treeGrid.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
            this.parent.trigger('excelQueryCellInfo', args);
        };
        this.parent.treeGrid.excelHeaderQueryCellInfo = (args: ExcelHeaderQueryCellInfoEventArgs) => {
            this.parent.trigger('excelHeaderQueryCellInfo', args);
        };
        this.parent.treeGrid.excelExportComplete = (args: ExcelExportCompleteArgs) => {
            this.parent.trigger('excelExportComplete', args);
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer') {
                this.parent.hideMaskRow();
            } else {
                this.parent.hideSpinner();
            }
        };
    }
}
