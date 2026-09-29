import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ColumnsModel } from '@syncfusion/ej2-querybuilder';

export interface ColumnsDirTypecast {
    ruleTemplate?: string | Function | any;
    template?: string | Function | any;
}
/**
 * `ColumnDirective` represent a column of the react QueryBuilder. 
 * It must be contained in a QueryBuilder component(`GridComponent`). 
 * ```tsx
 * <QueryBuilderComponent dataSource={data}> 
 *   <ColumnsDirective>
 *     <ColumnDirective field='ID' label='ID' type='number'></ColumnDirective>
 *     <ColumnDirective field='Date' label='Date' type='date' format='dd/MM/yyyy'></ColumnDirective>
 *   <ColumnsDirective>
 * </QueryBuilderComponent>
 * ```
 */
export class ColumnDirective extends ComplexBase<ColumnsModel| ColumnsDirTypecast & { children?: React.ReactNode }, ColumnsModel| ColumnsDirTypecast> {
    public static moduleName: string = 'column';
}

export class ColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'columns';
}
