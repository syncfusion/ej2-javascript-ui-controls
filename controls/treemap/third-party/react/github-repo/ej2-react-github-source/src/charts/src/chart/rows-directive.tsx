import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RowModel } from '@syncfusion/ej2-charts';


/**
 * `Row` directive represent a axis row of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent> 
 * <RowsDirective>
 * <RowDirective></RowDirective>
 * </RowsDirective>
 * </ChartComponent>
 * ```
 */
export class RowDirective extends ComplexBase<RowModel & { children?: React.ReactNode }, RowModel> {
    public static moduleName: string = 'row';
}

export class RowsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rows';
    public static moduleName: string = 'rows';
}
