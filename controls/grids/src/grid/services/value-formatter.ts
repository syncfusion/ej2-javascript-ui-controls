import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Internationalization, setCulture, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { IValueFormatter } from '../base/interface';
/**
 * ValueFormatter class to globalize the value.
 *
 * @hidden
 */
export class ValueFormatter implements IValueFormatter {

    private intl: Internationalization = new Internationalization();

    constructor(cultureName?: string) {
        if (!isNullOrUndefined(cultureName)) {
            this.intl.culture = cultureName;
        }
    }

    public getFormatFunction(format: NumberFormatOptions | DateFormatOptions): Function {
        if (!isNullOrUndefined(<DateFormatOptions>format) && ((<DateFormatOptions>format).type === 'dateTime' || (<DateFormatOptions>format).type === 'datetime' || (<DateFormatOptions>format).type === 'date' || (<DateFormatOptions>format).type === 'time')) {
            return this.intl.getDateFormat(<DateFormatOptions>format);
        } else {
            return this.intl.getNumberFormat(<DateFormatOptions>format);
        }
    }

    public getParserFunction(format: NumberFormatOptions | DateFormatOptions): Function {
        if ((<DateFormatOptions>format).type) {
            return this.intl.getDateParser(<DateFormatOptions>format);
        } else {
            return this.intl.getNumberParser(<DateFormatOptions>format);
        }
    }

    public fromView(value: string, format: Function, type?: string): string | number | Date {
        if ((type === 'date' || type === 'datetime' || type === 'number') && (!isNullOrUndefined(format)) && !isNullOrUndefined(value)) {
            return format(value);
        } else {
            return value;
        }
    }

    public toView(value: number | Date, format: Function): string | Object {
        let result: string | Object = value;

        if (!isNullOrUndefined(format) && !isNullOrUndefined(value)) {
            result = format(value);
        }

        return result;
    }

    public setCulture(cultureName: string): void {
        if (!isNullOrUndefined(cultureName)) {
            setCulture(cultureName);
        }
    }

}
