/**
 * CheckBox Default Sample
 */
import { QueryBuilder , ColumnsModel } from './../../../src/query-builder/index';
import { getComponent, Internationalization } from '@syncfusion/ej2-base';
import { TimePicker } from "@syncfusion/ej2-calendars";

	let intl = new Internationalization();
    let columnData: ColumnsModel[] = [
      {
        field: "Query_timestamp",
        label: "Query timestamp",
        category: "Query Related",
        type: "string",
        operators: [
          { key: "notbetween", value: "notbetween" },
          { key: "between", value: "between" }
        ],
        template: {
          create: (args: {operator: string}) => {
              var parentElem = [];
              parentElem.push(document.createElement("input"));
              parentElem.push(document.createElement("input"));
              return parentElem;
          },

          destroy: (args: {elements: NodeListOf<Element>}) => {
            for (let i = 0, len = args.elements.length; i < len; i++) {
              let date: TimePicker = getComponent(args.elements[i] as HTMLElement, "timepicker") as TimePicker;
              if (date) {
                date.destroy();
              }
            }
          },
		  
          write: (args: {elements: NodeListOf<Element>, values: any, operator: string}) => {
            let format = { type: "dateTime", skeleton: "hm" };
            if (args.operator.indexOf("between") > -1) {
              var dateArr = args.values ? args.values : [];
              let dateRangeObj1 = new TimePicker({
                placeholder: "Select Time",
                value: args.values[0] ? intl.parseDate(args.values[0], format) : null,
                min: new Date("3/8/2017 0:00 AM"),
                max: new Date("3/8/2017 2:00 AM"),
                change: e => {
                  dateArr[0] = e.value ? intl.formatDate(e.value, format) : null;
                  queryBldrObj.notifyChange(dateArr, e.element);
                }
              });
              let dateRangeObj2 = new TimePicker({
                placeholder: "Select Time",
                value: args.values[1] ? intl.parseDate(args.values[1], format) : null,
                min: new Date("3/8/2017 0:00 AM"),
                max: new Date("3/8/2017 2:00 AM"),
                change: e => {
                  dateArr[1] = e.value ? intl.formatDate(e.value, format) : null;
                  queryBldrObj.notifyChange(dateArr, e.element);
                }
              });
              dateRangeObj1.appendTo("#" + args.elements[0].id);
              dateRangeObj2.appendTo("#" + args.elements[1].id);
            }
          }
        }
      }
    ];

let queryBldrObj: QueryBuilder = new QueryBuilder({ columns: columnData, height: 'auto', width: '800px'  });
queryBldrObj.appendTo('#querybuilder');