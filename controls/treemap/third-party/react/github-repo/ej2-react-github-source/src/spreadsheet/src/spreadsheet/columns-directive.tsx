import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ColumnModel } from '@syncfusion/ej2-spreadsheet';


/**
 * `ColumnDirective` represent a column of the React Spreadsheet.
 * It must be contained in a `SheetDirective`.
 * ```ts
 * <SpreadsheetComponent>
 *   <SheetsDirective>
 *    <SheetDirective>
 *    <ColumnsDirective>
 *    <ColumnDirective width='100'></ColumnDirective>
 *    </ColumnsDirective>
 *    </SheetDirective>
 *   </SheetsDirective>
 * </SpreadsheetComponent>
 * ```
 */
export class ColumnDirective extends ComplexBase<ColumnModel & { children?: React.ReactNode }, ColumnModel> {
    public static moduleName: string = 'column';
}

export class ColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'columns';
}
