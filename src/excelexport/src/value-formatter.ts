import { isNullOrUndefined} from '@syncfusion/ej2-base';
import { Internationalization, setCulture, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
// import { IValueFormatter } from '../base/interface';
/**
 * ValueFormatter class to globalize the value.
 * @private
 */
export class ValueFormatter {

    private intl: Internationalization = new Internationalization();

    constructor(cultureName?: string) {
        // if (!isNullOrUndefined(cultureName)) {
        //     this.intl.culture = cultureName;
        // }
    }

    public getFormatFunction(format: NumberFormatOptions | DateFormatOptions, isServerRendered: boolean): Function {
        if ((<DateFormatOptions>format).type) {
            if (isServerRendered) {
                (<DateFormatOptions>format).isServerRendered = true;
            }
            return this.intl.getDateFormat(<DateFormatOptions>format);
        } else {
            return this.intl.getNumberFormat(<DateFormatOptions>format);
        }
    }

    // public getParserFunction(format: NumberFormatOptions | DateFormatOptions): Function {
    //     if ((<DateFormatOptions>format).type) {
    //         return this.intl.getDateParser(<DateFormatOptions>format);
    //     } else {
    //         return this.intl.getNumberParser(<DateFormatOptions>format);
    //     }
    // }

    // public fromView(value: string, format: Function, type?: string): string | number | Date {
    //     if (type === 'date' || type === 'datetime' || type === 'number') {
    //         return format(value);
    //     } else {
    //         return value;
    //     }
    // }

    public toView(value: number | Date, format: Function): string | Object {
        let result: string | Object = value;

        if (!isNullOrUndefined(format) && !isNullOrUndefined(value)) {
            result = format(value);
        }

        return result;
    }

    // public setCulture(cultureName: string): void {
    //     if (!isNullOrUndefined(cultureName)) {
    //         setCulture(cultureName);
    //     }
    // }
    /* tslint:disable:no-any */
    public displayText(value: any, format: NumberFormatOptions | DateFormatOptions, isServerRendered: boolean): string {
        return this.toView(value, this.getFormatFunction(format, isServerRendered)) as string;
    }
}