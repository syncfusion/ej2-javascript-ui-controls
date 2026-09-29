import { ComplexBase } from '@syncfusion/ej2-react-base';
import { CellModel } from '@syncfusion/ej2-spreadsheet';


/**
 * `CellDirective` represent a cell of the React Spreadsheet.
 * It must be contained in a `RowDirective`.
 * ```ts
 * <SpreadsheetComponent>
 *   <SheetsDirective>
 *    <SheetDirective>
 *    <RowsDirective>
 *    <RowDirective>
 *    <CellsDirective>
 *    <CellDirective value='A1'></CellDirective>
 *    </CellsDirective>
 *    </RowDirective>
 *    </RowsDirective>
 *    </SheetDirective>
 *   </SheetsDirective>
 * </SpreadsheetComponent>
 * ```
 */
export class CellDirective extends ComplexBase<CellModel & { children?: React.ReactNode }, CellModel> {
    public static moduleName: string = 'cell';
}

export class CellsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'cells';
    public static moduleName: string = 'cells';
}
