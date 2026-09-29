import { ComplexBase } from '@syncfusion/ej2-react-base';
import { SheetModel } from '@syncfusion/ej2-spreadsheet';


/**
 * `SheetDirective` represent a sheet of the React Spreadsheet.
 * It must be contained in a Spreadsheet component(`SpreadsheetComponent`).
 * ```ts
 * <SpreadsheetComponent>
 *   <SheetsDirective>
 *    <SheetDirective></SheetDirective>
 *    <SheetDirective></SheetDirective>
 *   </SheetsDirective>
 * </SpreadsheetComponent>
 * ```
 */
export class SheetDirective extends ComplexBase<SheetModel & { children?: React.ReactNode }, SheetModel> {
    public static moduleName: string = 'sheet';
}

export class SheetsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'sheets';
    public static moduleName: string = 'sheets';
}
