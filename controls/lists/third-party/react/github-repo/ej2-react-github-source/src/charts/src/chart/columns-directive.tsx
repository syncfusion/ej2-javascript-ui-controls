import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ColumnModel } from '@syncfusion/ej2-charts';


/**
 * `Column` directive represent a axis column of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent> 
 * <ColumnsDirective>
 * <ColumnDirective></ColumnDirective>
 * </ColumnsDirective>
 * </ChartComponent>
 * ```
 */
export class ColumnDirective extends ComplexBase<ColumnModel & { children?: React.ReactNode }, ColumnModel> {
    public static moduleName: string = 'column';
}

export class ColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'columns';
}
