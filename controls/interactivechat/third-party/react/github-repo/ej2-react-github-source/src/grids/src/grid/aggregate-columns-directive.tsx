import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AggregateColumnModel } from '@syncfusion/ej2-grids';

export interface AggregateColumnDirTypecast {
    footerTemplate?: string | Function | any;
    groupFooterTemplate?: string | Function | any;
    groupCaptionTemplate?: string | Function | any;
}
/**
 * `AggregateColumnDirective represent a aggregate column of the react Grid. 
 * ```tsx
 * <GridComponent dataSource={data} allowPaging={true} allowSorting={true}> 
 * <ColumnsDirective>
 * <ColumnDirective field='ID' width='100'></ColumnDirective>
 * <ColumnDirective field='name' headerText='Name' width='100'></ColumnDirective>
 * </ColumnsDirective>
 * <AggregatesDirective>
 * <AggregateDirective>
 * <AggregateColumnsDirective>
 * <AggregateColumnDirective field='ID' type='Min'></AggregateColumnsDirective>
 * </AggregateColumnsDirective>
 * </AggregateDirective>
 * </AggregatesDirective>
 * </GridComponent>
 * ```
 */
export class AggregateColumnDirective extends ComplexBase<AggregateColumnModel| AggregateColumnDirTypecast & { children?: React.ReactNode }, AggregateColumnModel| AggregateColumnDirTypecast> {
    public static moduleName: string = 'aggregateColumn';
}

export class AggregateColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'aggregateColumns';
}
