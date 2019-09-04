import { DateFormat } from './intl/date-formatter';
import { NumberFormat } from './intl/number-formatter';
import { DateParser } from './intl/date-parser';
import { NumberParser } from './intl/number-parser';
import { IntlBase } from './intl/intl-base';
import { extend, getValue } from './util';
import { Observer } from './observer';
/**
 * Specifies the observer used for external change detection.
 */
export let onIntlChange: Observer = new Observer();
/**
 * Specifies the default rtl status for EJ2 components.
 */
export let rightToLeft: boolean = false;

/**
 * Interface for dateFormatOptions 
 *
 */
export interface DateFormatOptions {
    /**
     * Specifies the skeleton for date formatting.
     */
    skeleton?: string;
    /**
     * Specifies the type of date formatting either date, dateTime or time.
     */
    type?: string;
    /**
     * Specifies custom date formatting to be used.
     */
    format?: string;
    /**
     * Specifies the calendar mode other than gregorian
     */
    calendar?: string;
}
/**
 * Interface for numberFormatOptions
 * 
 */
export interface NumberFormatOptions {
    /**
     * Specifies minimum fraction digits in formatted value.
     */
    minimumFractionDigits?: number;
    /**
     * Specifies maximum fraction digits in formatted value.
     */
    maximumFractionDigits?: number;
    /**
     * Specifies minimum significant digits in formatted value.
     */
    minimumSignificantDigits?: number;
    /**
     * Specifies maximum significant digits in formatted value.
     */
    maximumSignificantDigits?: number;
    /**
     * Specifies whether to use grouping or not in formatted value,
     */
    useGrouping?: boolean;
    /**
     * Specifies the skeleton for perform formatting.
     */
    skeleton?: string;
    /**
     * Specifies the currency code to be used for formatting.
     */
    currency?: string;
    /**
     * Specifies minimum integer digits in formatted value.
     */
    minimumIntegerDigits?: number;
    /**
     * Specifies custom number format for formatting.
     */
    format?: string;
}
/**
 * Specifies the CLDR data loaded for internationalization functionalities.
 * @private
 */
export let cldrData: Object = {};
/**
 * Specifies the default culture value to be considered.
 * @private
 */
export let defaultCulture: string = 'en-US';
/**
 * Specifies default currency code to be considered
 * @private
 */
export let defaultCurrencyCode: string = 'USD';

const mapper: string[] = ['numericObject', 'dateObject'];
/**
 * Internationalization class provides support to parse and format the number and date object to the desired format.
 * ```typescript
 * // To set the culture globally 
 * setCulture('en-GB');
 * 
 * // To set currency code globally
 * setCurrencyCode('EUR');
 * 
 * //Load cldr data
 * loadCldr(gregorainData);
 * loadCldr(timeZoneData);
 * loadCldr(numbersData);
 * loadCldr(numberSystemData);
 * 
 * // To use formatter in component side
 * let Intl:Internationalization = new Internationalization();
 * 
 * // Date formatting
 * let dateFormatter: Function = Intl.getDateFormat({skeleton:'long',type:'dateTime'});
 * dateFormatter(new Date('11/2/2016'));
 * dateFormatter(new Date('25/2/2030'));
 * Intl.formatDate(new Date(),{skeleton:'E'});
 * 
 * //Number formatting
 * let numberFormatter: Function = Intl.getNumberFormat({skeleton:'C5'})
 * numberFormatter(24563334);
 * Intl.formatNumber(123123,{skeleton:'p2'});
 * 
 * // Date parser
 * let dateParser: Function = Intl.getDateParser({skeleton:'short',type:'time'});
 * dateParser('10:30 PM');
 * Intl.parseDate('10',{skeleton:'H'});
 * ```
 */
export class Internationalization {
    public culture: string;
    constructor(cultureName?: string) {
        if (cultureName) {
            this.culture = cultureName;
        }
    }
    /**
     * Returns the format function for given options.
     * @param {DateFormatOptions} options - Specifies the format options in which the format function will return.
     * @returns {Function}
     */
    public getDateFormat(options?: DateFormatOptions): Function {
        return DateFormat.dateFormat(this.getCulture(), options || { type: 'date', skeleton: 'short' }, cldrData);
    }
    /**
     * Returns the format function for given options.
     * @param {NumberFormatOptions} options - Specifies the format options in which the format function will return.
     * @returns {Function}
     */
    public getNumberFormat(options?: NumberFormatOptions): Function {
        if (options && !options.currency) {
            options.currency = defaultCurrencyCode;
        }
        return NumberFormat.numberFormatter(this.getCulture(), options || {}, cldrData);
    }
    /**
     * Returns the parser function for given options.
     * @param {DateFormatOptions} options - Specifies the format options in which the parser function will return.
     * @returns {Function}
     */
    public getDateParser(options?: DateFormatOptions): Function {
        return DateParser.dateParser(this.getCulture(), options || { skeleton: 'short', type: 'date' }, cldrData);
    }
    /**
     * Returns the parser function for given options.
     * @param {NumberFormatOptions} options - Specifies the format options in which the parser function will return.
     * @returns {Function}
     */
    public getNumberParser(options?: NumberFormatOptions): Function {
        return NumberParser.numberParser(this.getCulture(), options || { format: 'N' }, cldrData);
    }
    /**
     * Returns the formatted string based on format options.
     * @param {Number} value - Specifies the number to format.
     * @param {NumberFormatOptions} option - Specifies the format options in which the number will be formatted.
     * @returns {string}
     */
    public formatNumber(value: Number, option?: NumberFormatOptions): string {
        return this.getNumberFormat(option)(value);
    }
    /**
     * Returns the formatted date string based on format options.
     * @param {Number} value - Specifies the number to format.
     * @param {DateFormatOptions} option - Specifies the format options in which the number will be formatted.
     * @returns {string}
     */
    public formatDate(value: Date, option?: DateFormatOptions): string {
        return this.getDateFormat(option)(value);
    }
    /**
     * Returns the date object for given date string and options.
     * @param {string} value - Specifies the string to parse.
     * @param {DateFormatOptions} option - Specifies the parse options in which the date string will be parsed.
     * @returns {Date}
     */
    public parseDate(value: string, option?: DateFormatOptions): Date {
        return this.getDateParser(option)(value);
    }
    /**
     * Returns the number object from the given string value and options.
     * @param {string} value - Specifies the string to parse.
     * @param {NumberFormatOptions} option - Specifies the parse options in which the  string number  will be parsed.
     * @returns {number}
     */
    public parseNumber(value: string, option?: NumberFormatOptions): number {
        return this.getNumberParser(option)(value);
    }
    /**
     * Returns Native Date Time Pattern
     * @param {DateFormatOptions} option - Specifies the parse options for resultant date time pattern.
     * @param {boolean} isExcelFormat - Specifies format value to be converted to excel pattern.
     * @returns {string}
     * @private
     */
    public getDatePattern(option: DateFormatOptions, isExcelFormat?: boolean): string {
        return IntlBase.getActualDateTimeFormat(this.getCulture(), option, cldrData, isExcelFormat);
    }
    /**
     * Returns Native Number Pattern
     * @param {NumberFormatOptions} option - Specifies the parse options for resultant number pattern.
     * @returns {string}
     * @private
     */
    public getNumberPattern(option: NumberFormatOptions): string {
        return IntlBase.getActualNumberFormat(this.getCulture(), option, cldrData);
    }
    /**
     * Returns the First Day of the Week
     * @returns {number}
     */
    public getFirstDayOfWeek(): number {
        return IntlBase.getWeekData(this.getCulture(), cldrData);
    }
    private getCulture(): string {
        return this.culture || defaultCulture;
    }
}

/**
 * Set the default culture to all EJ2 components
 * @param {string} cultureName - Specifies the culture name to be set as default culture.
 */
export function setCulture(cultureName: string): void {
    defaultCulture = cultureName;
    onIntlChange.notify('notifyExternalChange', { 'locale': defaultCulture });
}

/**
 * Set the default currency code to all EJ2 components
 * @param {string} currencyCode Specifies the culture name to be set as default culture.
 * @returns {void}
 */
export function setCurrencyCode(currencyCode: string): void {
    defaultCurrencyCode = currencyCode;
    onIntlChange.notify('notifyExternalChange', { 'currencyCode': defaultCurrencyCode });
}
/**
 * Load the CLDR data into context
 * @param {Object[]} obj Specifies the CLDR data's to be used for formatting and parser.
 * @returns {void}
 */
export function loadCldr(...data: Object[]): void {
    for (let obj of data) {
        extend(cldrData, obj, {}, true);
    }
}


/**
 * To enable or disable RTL functionality for all components globally.
 * @param {boolean} status - Optional argument Specifies the status value to enable or disable rtl option.
 * @returns {void}
 */
export function enableRtl(status: boolean = true): void {
    rightToLeft = status;
    onIntlChange.notify('notifyExternalChange', { enableRtl: rightToLeft });
}

/**
 * To get the numeric CLDR object for given culture
 * @param {string} locale - Specifies the locale for which numericObject to be returned.
 * @ignore
 * @private
 */
export function getNumericObject(locale: string, type?: string): Object {
    /* tslint:disable no-any */
    let numObject: Object = (<any>IntlBase.getDependables(cldrData, locale, '', true))[mapper[0]];
    let dateObject: Object = (<any>IntlBase.getDependables(cldrData, locale, ''))[mapper[1]];
    let numSystem: string = getValue('defaultNumberingSystem', numObject);
    let symbPattern: Object = getValue('symbols-numberSystem-' + numSystem, numObject);
    let pattern: string = IntlBase.getSymbolPattern(type || 'decimal', numSystem, numObject, false);
    return extend(symbPattern, IntlBase.getFormatData(pattern, true, '', true), { 'dateSeparator': IntlBase.getDateSeparator(dateObject) });
}

/**
 * To get the numeric CLDR  number base object for given culture
 * @param {string} locale - Specifies the locale for which numericObject to be returned.
 * @param {string} currency - Specifies the currency for which numericObject to be returned.
 * @ignore
 * @private
 */
 export function getNumberDependable(locale: string, currency: string): string  {
      let numObject: Object = (<any>IntlBase.getDependables(cldrData, locale, '', true));
      return IntlBase.getCurrencySymbol((<any>numObject).numericObject, currency);
 }

/**
 * To get the default date CLDR object.
 * @ignore
 * @private
 */
export function getDefaultDateObject(mode?: string): Object {
    return (<any>IntlBase.getDependables(cldrData, '', mode, false))[mapper[1]];
}
