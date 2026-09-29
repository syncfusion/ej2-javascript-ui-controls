import { ComplexBase } from '@syncfusion/ej2-react-base';
import { TreeGridColumnModel } from '@syncfusion/ej2-treegrid';

export interface TreeGridColumnDirTypecast {
    template?: string | Function | any;
    headerTemplate?: string | Function | any;
    filter?: any;
    filterTemplate?: string | Function | any;
    commandsTemplate?: string | Function | any;
    editTemplate?: string | Function | any;
}
/**
 * `ColumnDirective` represent a column of the react TreeGrid. 
 * It must be contained in a TreeGrid component(`TreeGridComponent`). 
 * ```
 * <TreeGridComponent dataSource={data} allowPaging={true} allowSorting={true}> 
 * <ColumnsDirective>
 * <ColumnDirective field='ID' width='100'></ColumnDirective>
 * <ColumnDirective field='name' headerText='Name' width='100'></ColumnDirective>
 * <ColumnsDirective>
 * </TreeGridComponent>
 * ```
 */
export class ColumnDirective extends ComplexBase<TreeGridColumnModel| TreeGridColumnDirTypecast & { children?: React.ReactNode }, TreeGridColumnModel| TreeGridColumnDirTypecast> {
    public static moduleName: string = 'column';
    public static complexTemplate: Object = {'filter.itemTemplate': 'filter.itemTemplate'};
}

export class ColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'columns';
}
