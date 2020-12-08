/**
 * CheckBox Default Sample
 */
import { QueryBuilder , ColumnsModel, RuleModel, FormatObject} from './../../../src/query-builder/index';

import { getComponent, Internationalization, DateFormatOptions } from '@syncfusion/ej2-base';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Slider } from '@syncfusion/ej2-inputs';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { Button } from '@syncfusion/ej2-buttons';

/**
 * Template sample
 */
// tslint:disable-next-line

let format: FormatObject = {skeleton: 'short'};    
let elem: HTMLElement;
let parentElem: HTMLElement[] = [];
let intl = new Internationalization();
let dateArr: string[] = [];
let filter: ColumnsModel[] = [
  { field: 'Category', label: 'Category', type: 'string' },
  { field: 'PaymentMode', label: 'Payment Mode', type: 'string' },
  { field: 'TransactionType', label: 'Transaction Type', type: 'boolean' },
  { field: 'Description', label: 'Description', type: 'string' },
  {
    field: 'Date', label: 'Date', type: 'date', format: format,
    template: {
      create: (args: { operator: string }) => {
        if (args.operator === 'between') {
          parentElem = [];
          parentElem.push(document.createElement('input'));
          parentElem.push(document.createElement('input'));
          return parentElem;
        } else {
          return document.createElement('input');
        }
      },
      destroy: (args: { elementId: string, elements: Element[] }) => {
        for (let i: number = 0, len: number = args.elements.length; i < len; i++) {
          let date: DateTimePicker = (getComponent(args.elements[i] as HTMLElement, 'datetimepicker') as DateTimePicker);
          if (date) {
            date.destroy();
          }
        }
      },
      write: (args: { elements: Element | Element[], values: string | string[], operator: string }) => {
        let format: DateFormatOptions = { type: 'dateTime', skeleton: 'short' } as DateFormatOptions;
        if (args.operator === 'between') {
          dateArr = args.values as string [];
          let dateRangeObj1: DateTimePicker = new DateTimePicker({
            value: args.values[0] ? intl.parseDate(args.values[0], format) : null,
            change: (e: any) => {
              dateArr[0] = e.value ? intl.formatDate(e.value, format): null;
              qryBldrObj.notifyChange(dateArr, e.element);
            }
          });
          let dateRangeObj2: DateTimePicker = new DateTimePicker({
            value: args.values[1] ? intl.parseDate(args.values[1], format) : null,
            change: (e: any) => {
              dateArr[1] = e.value ? intl.formatDate(e.value, format): null;
              qryBldrObj.notifyChange(dateArr, e.element);
            }
          });
          dateRangeObj1.appendTo('#' + args.elements[0].id);
          dateRangeObj2.appendTo('#' + args.elements[1].id);
        } else {
          let dateObj: DateTimePicker = new DateTimePicker({
            placeholder: 'Select value',
            value: args.values ? intl.parseDate(args.values as string, format): null,
            change: (e: any) => {
              qryBldrObj.notifyChange(e.value ? intl.formatDate(e.value, format): null, e.element);
            }
          });
          dateObj.appendTo('#' + (args.elements as HTMLElement).id);
        }
      }
    },
    operators: [
      { value: 'equal', key: 'Equal' },
      { value: 'greaterthan', key: 'Greater Than' },
      { value: 'greaterthanorequal', key: 'Greater Than Or Equal' },
      { value: 'lessthan', key: 'Less Than' },
      { value: 'lessthanorequal', key: 'Less Than Or Equal' },
      { value: 'between', key: 'Between' }
    ],
  },
  { field: 'Amount', label: 'Amount', type: 'number' }
];
let importRules: RuleModel = {
        'condition': 'and',
        'rules': [{
                'label': 'Date',
                'field': 'Date',
                'type': 'Date',
                'operator': 'equal',
                'value': '6/5/18, 12:00 AM'
            }]
        };
let qryBldrObj: QueryBuilder = new QueryBuilder({
  columns: filter,
  width: '100%',
  rule: importRules
});
qryBldrObj.appendTo('#querybuilder');

let button: Button = new Button({cssClass: `e-primary`, content:'Get predicate'}, '#predicate');

document.getElementById('predicate').onclick = (): void => {
  console.log(qryBldrObj.getPredicate(qryBldrObj.getValidRules(qryBldrObj.rule)));
}