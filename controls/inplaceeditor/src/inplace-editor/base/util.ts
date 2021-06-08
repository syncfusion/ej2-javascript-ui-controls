import { isNullOrUndefined as isNOU, Internationalization, isBlazor } from '@syncfusion/ej2-base';
import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';
import { DatePickerModel } from '@syncfusion/ej2-calendars';
import { DateTimePickerModel, DateRangePickerModel, TimePickerModel } from '@syncfusion/ej2-calendars';
import { NumericTextBoxModel, TextBoxModel } from '@syncfusion/ej2-inputs';
import { ColorPickerModel, MaskedTextBoxModel, SliderModel } from '@syncfusion/ej2-inputs';
import { AutoCompleteModel, ComboBoxModel, DropDownListModel, MultiSelectModel } from '@syncfusion/ej2-dropdowns';
/**
 * Exports util methods used by In-place editor.
 */

const intl: Internationalization = new Internationalization();
/* eslint-disable */
type valueType = string | number | Date | string[] | Date[] | number[];
type modelType = AutoCompleteModel | ColorPickerModel | ComboBoxModel | DatePickerModel | DateRangePickerModel | DateTimePickerModel |
/* eslint-enable */
DropDownListModel | MaskedTextBoxModel | MultiSelectModel | NumericTextBoxModel | RichTextEditorModel | SliderModel | TextBoxModel |
TimePickerModel;
/**
 * @param {string} type - specifies the string type
 * @param {valueType} val - specifies the value type
 * @param {modelType} model - specifies the model type
 * @returns {string} - returns the string
 */
export function parseValue(type: string, val: valueType, model: modelType): string {
    if (isNOU(val) || val === '') {
        return '';
    }
    let result: string;
    let tempFormat: string;
    switch (type) {
    case 'Color': {
        const hex: string = <string>val;
        result = (hex.length > 7) ? hex.slice(0, -2) : hex;
        break; }
    case 'Date':
        tempFormat = (model as DatePickerModel).format as string;
        result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' });
        break;
    case 'DateRange': {
        tempFormat = (model as DateRangePickerModel).format as string;
        const date: Date[] = <Date[]>val;
        result = intl.formatDate(date[0], { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' }) + ' - '
            + intl.formatDate(date[1], { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' });
        break; }
    case 'DateTime':
        tempFormat = (model as DateTimePickerModel).format as string;
        if (isNOU(tempFormat) || tempFormat === '') {
            result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' }) + ' '
                + intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: isBlazor() ? 't' : 'hm' });
        } else {
            result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' });
        }
        break;
    case 'Time':
        tempFormat = (model as TimePickerModel).format as string;
        result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: isBlazor() ? 't' : 'hm' });
        break;
    case 'Numeric': {
        tempFormat = isNOU((model as NumericTextBoxModel).format) ? 'n2' :
            (model as NumericTextBoxModel).format as string;
        const tempVal: number = isNOU(<string>val) ? null : (typeof (val) === 'number' ? val : intl.parseNumber(<string>val));
        result = intl.formatNumber(tempVal, { format: tempFormat });
        break; }
    default:
        result = val.toString();
        break;
    }
    return result;    
}

/**
 *
 * @param {string} type - specifies the string value
 * @param {valueType} val - specifies the value type
 * @returns {valueType} - returns the value type
 */
export function getCompValue(type: string, val: valueType): valueType {
    if (isNOU(val) || val === '') {
        return val;
    }
    if ((type === 'Date' || type === 'Time' || type === 'DateTime') && typeof (val) === 'string') {
        val = new Date(val);
    } else if (type === 'DateRange') {
        if (typeof (val) === 'object' && typeof ((<string[]>val)[0]) === 'string') {
            val = [new Date((val as string[])[0]), new Date((val as string[])[1])];
        } else if (typeof (val) === 'string') {
            const temp: string[] = (<string>val).split('-');
            val = [new Date(temp[0]), new Date(temp[1])];
        }
    }
    return val;
}

/**
 * @param {string} value - specifies the string value
 * @returns {string} - returns the string
 * @hidden
 */
 export function encode(value: string): string {
    var data = [];
    for (var i = value.length - 1; i >= 0; i--) {
        data.unshift(["&#", value[i].charCodeAt(0), ";"].join(""));
    }
    return data.join("");
}