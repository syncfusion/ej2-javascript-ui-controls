import { ComplexBase } from '@syncfusion/ej2-react-base';
import { HeaderRowsModel } from '@syncfusion/ej2-schedule';

export interface HeaderRowsDirTypecast {
    template?: string | Function | any;
}
/**
 * `HeaderRowsDirective` represent a header rows of the react Schedule. 
 * It must be contained in a Schedule component(`SchduleComponent`). 
 * ```ts
 * <ScheduleComponent>
 *  <HeaderRowsDirective>
 *   <HeaderRowDirective option='Week'></HeaderRowDirective>
 *   <HeaderRowDirective option='Date'></HeaderRowDirective>
 *  <HeaderRowsDirective>
 * </ScheduleComponent>
 * ```
 */
export class HeaderRowDirective extends ComplexBase<HeaderRowsModel| HeaderRowsDirTypecast & { children?: React.ReactNode }, HeaderRowsModel| HeaderRowsDirTypecast> {
    public static moduleName: string = 'headerRow';
}

export class HeaderRowsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'headerRows';
    public static moduleName: string = 'headerRows';
}
