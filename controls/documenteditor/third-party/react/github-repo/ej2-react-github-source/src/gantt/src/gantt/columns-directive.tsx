import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ColumnModel } from '@syncfusion/ej2-gantt';

export interface ColumnDirTypecast {
    template?: string | Function | any;
    toolbarTemplate?: string | Function | any;
    headerTemplate?: string | Function | any;
    editTemplate?: string | Function | any;
    filter?: any;
    filterTemplate?: string | Function | any;
    emptyRecordTemplate?: string | Function | any;
}
/**
 * `ColumnDirective` represent a column of the react Gantt. 
 * It must be contained in a Gantt component(`GanttComponent`). 
 * ```tsx
 * <GanttComponent dataSource={data} allowSelection={true} allowSorting={true}> 
 * <ColumnsDirective>
 * <ColumnDirective field='ID' width='150'></ColumnDirective>
 * <ColumnDirective field='taskName' headerText='Task Name' width='200'></ColumnDirective>
 * </ColumnsDirective>
 * </GanttComponent>
 * ```
 */
export class ColumnDirective extends ComplexBase<ColumnModel| ColumnDirTypecast & { children?: React.ReactNode }, ColumnModel| ColumnDirTypecast> {
    public static moduleName: string = 'column';
    public static complexTemplate: Object = {'filter.itemTemplate': 'filter.itemTemplate'};
}

export class ColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'columns';
}
