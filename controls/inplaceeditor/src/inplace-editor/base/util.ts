import { isNullOrUndefined as isNOU, Internationalization } from '@syncfusion/ej2-base';
import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';
import { DatePickerModel } from '@syncfusion/ej2-calendars';
import { DateTimePickerModel, DateRangePickerModel, TimePickerModel } from '@syncfusion/ej2-calendars';
import { NumericTextBoxModel, TextBoxModel } from '@syncfusion/ej2-inputs';
import { ColorPickerModel, MaskedTextBoxModel, SliderModel } from '@syncfusion/ej2-inputs';
import { AutoCompleteModel, ComboBoxModel, DropDownListModel, MultiSelectModel } from '@syncfusion/ej2-dropdowns';
/**
 * Exports util methods used by In-place editor.
 */

let intl: Internationalization = new Internationalization();
type valueType = string | number | Date | string[] | Date[] | number[];
type modelType = AutoCompleteModel | ColorPickerModel | ComboBoxModel | DatePickerModel | DateRangePickerModel | DateTimePickerModel |
    DropDownListModel | MaskedTextBoxModel | MultiSelectModel | NumericTextBoxModel | RichTextEditorModel | SliderModel | TextBoxModel |
    TimePickerModel;
/**
 * @hidden
 */
export function parseValue(type: string, val: valueType, model: modelType): string {
    if (isNOU(val) || val === '') { return ''; }
    let result: string;
    let tempFormat: string;
    switch (type) {
        case 'Color':
            let hex: string = <string>val;
            result = (hex.length > 7) ? hex.slice(0, -2) : hex;
            break;
        case 'Date':
            tempFormat = (model as DatePickerModel).format as string;
            result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: 'yMd' });
            break;
        case 'DateRange':
            tempFormat = (model as DateRangePickerModel).format as string;
            let date: Date[] = <Date[]>val;
            result = intl.formatDate(date[0], { format: tempFormat, type: type, skeleton: 'yMd' }) + ' - '
                + intl.formatDate(date[1], { format: tempFormat, type: type, skeleton: 'yMd' });
            break;
        case 'DateTime':
            tempFormat = (model as DateTimePickerModel).format as string;
            if (isNOU(tempFormat) || tempFormat === '') {
                result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: 'yMd' }) + ' '
                    + intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: 'hm' });
            } else {
                result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: 'yMd' });
            }
            break;
        case 'Time':
            tempFormat = (model as TimePickerModel).format as string;
            result = intl.formatDate(<Date>val, { format: tempFormat, type: type, skeleton: 'hm' });
            break;
        case 'Numeric':
            tempFormat = isNOU((model as NumericTextBoxModel).format) ? 'n2' :
                (model as NumericTextBoxModel).format as string;
            let tempVal: number = isNOU(<string>val) ? null : (typeof (val) === 'number' ? val : intl.parseNumber(<string>val));
            result = intl.formatNumber(tempVal, { format: tempFormat });
            break;
        default:
            result = val.toString();
            break;
    }
    return result;
}

export function getCompValue(type: string, val: valueType): valueType {
    if (isNOU(val) || val === '') { return val; }
    if ((type === 'Date' || type === 'Time' || type === 'DateTime') && typeof (val) === 'string') {
        val = new Date(val);
    } else if (type === 'DateRange') {
        if (typeof (val) === 'object' && typeof ((<string[]>val)[0]) === 'string') {
            val = [new Date((val as string[])[0]), new Date((val as string[])[1])];
        } else if (typeof (val) === 'string') {
            let temp: string[] = (<string>val).split('-');
            val = [new Date(temp[0]), new Date(temp[1])];
        }
    }
    return val;
}