import { ComplexBase } from '@syncfusion/ej2-react-base';
import { DefineNameModel } from '@syncfusion/ej2-spreadsheet';


/**
 * `DefinedNameDirective` represent a defined name of the React Spreadsheet.
 * It must be contained in a Spreadsheet component(`SpreadsheetComponent`).
 * ```ts
 * <SpreadsheetComponent>
 *   <DefinedNamesDirective>
 *    <DefinedNameDirective></DefinedNameDirective>
 *    <DefinedNameDirective></DefinedNameDirective>
 *   </DefinedNamesDirective>
 * </SpreadsheetComponent>
 * ```
 */
export class DefinedNameDirective extends ComplexBase<DefineNameModel & { children?: React.ReactNode }, DefineNameModel> {
    public static moduleName: string = 'definedName';
}

export class DefinedNamesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'definedNames';
    public static moduleName: string = 'definedNames';
}
