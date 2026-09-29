import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ConditionalFormatModel } from '@syncfusion/ej2-spreadsheet';


/**
 * `ConditionalFormatDirective` represent a conditionalformat of the React Spreadsheet.
 * It must be contained in a `SheetDirective`.
 * ```ts
 * <SpreadsheetComponent>
 *   <SheetsDirective>
 *    <SheetDirective>
 *    <ConditionalFormatsDirective>
 *    <ConditionalFormatDirective dataSource={data}></ConditionalFormatDirective>
 *    </ConditionalFormatsDirective>
 *    </SheetDirective>
 *   </SheetsDirective>
 * </SpreadsheetComponent>
 * ```
 */
export class ConditionalFormatDirective extends ComplexBase<ConditionalFormatModel & { children?: React.ReactNode }, ConditionalFormatModel> {
    public static moduleName: string = 'conditionalFormat';
}

export class ConditionalFormatsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'conditionalFormats';
    public static moduleName: string = 'conditionalFormats';
}
