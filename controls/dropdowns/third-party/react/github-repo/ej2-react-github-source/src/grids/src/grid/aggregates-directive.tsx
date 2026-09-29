import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AggregateRowModel } from '@syncfusion/ej2-grids';


/**
 * `AggregateDirective` represent a aggregate row of the react Grid. 
 * It must be contained in a Grid component(`GridComponent`). 
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
 * </<AggregateColumnsDirective>
* </AggregateDirective>
 * </AggregatesDirective>
 * </GridComponent>
 * ```
 */
export class AggregateDirective extends ComplexBase<AggregateRowModel & { children?: React.ReactNode }, AggregateRowModel> {
    public static moduleName: string = 'aggregate';
}

export class AggregatesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'aggregates';
    public static moduleName: string = 'aggregates';
}
