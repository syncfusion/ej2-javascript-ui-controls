import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RowModel } from '@syncfusion/ej2-spreadsheet';


/**
 * `RowDirective` represent a row of the React Spreadsheet.
 * It must be contained in a `SheetDirective`.
 * ```ts
 * <SpreadsheetComponent>
 *   <SheetsDirective>
 *    <SheetDirective>
 *    <RowsDirective>
 *    <RowDirective></RowDirective>
 *    </RowsDirective>
 *    </SheetDirective>
 *   </SheetsDirective>
 * </SpreadsheetComponent>
 * ```
 */
export class RowDirective extends ComplexBase<RowModel & { children?: React.ReactNode }, RowModel> {
    public static moduleName: string = 'row';
}

export class RowsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rows';
    public static moduleName: string = 'rows';
}
