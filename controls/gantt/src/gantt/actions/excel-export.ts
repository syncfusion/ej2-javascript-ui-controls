import { TreeGrid, ExcelExport as TreeGridExcel } from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Excel Export module
 * @hidden
 */
export class ExcelExport {
    private parent: Gantt;
    /**
     * Constructor for Excel Export module
     */
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridExcel);
        this.parent.treeGrid.allowExcelExport = this.parent.allowExcelExport;
        this.bindEvents();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelExport';
    }
    /**
     * To bind resize events.
     * @return {void}
     * @private
     */
    private bindEvents(): void {
        this.parent.treeGrid.beforeExcelExport = (args: Object) => {
            this.parent.trigger('beforeExcelExport', args);
        };
        this.parent.treeGrid.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
            this.parent.trigger('excelQueryCellInfo', args);
        };
        this.parent.treeGrid.excelHeaderQueryCellInfo = (args: ExcelHeaderQueryCellInfoEventArgs) => {
            this.parent.trigger('excelHeaderQueryCellInfo', args);
        };
        this.parent.treeGrid.excelExportComplete = (args: ExcelExportCompleteArgs) => {
            this.parent.trigger('excelExportComplete', args);
        };
    }
}