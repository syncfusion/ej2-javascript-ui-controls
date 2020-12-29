/**
 * CheckBox Default Sample
 */
import { QueryBuilder , RuleModel, ColumnsModel} from './../../../src/query-builder/index';
import { getComponent, createElement } from '@syncfusion/ej2-base';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { Slider, SliderTickEventArgs } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
MultiSelect.Inject(CheckBoxSelection);
let elem: HTMLElement;
let dropDownObj: DropDownList;
let multiSelectObj: MultiSelect;
let filter: ColumnsModel [] = [
    { field: 'EmployeeID', label: 'EmployeeID', type: 'number', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'multiselect') as MultiSelect).destroy();
        },
        write: (args: {elements: Element, values: string[]}) => {
            multiSelectObj = new MultiSelect({
                dataSource: [1, 2, 3, 4, 5],
                value: args.values,
                mode: 'Box',
                change: (e: any) => {
                    queryBldrObj.notifyChange(e.value, e.element);
                }
            });
            multiSelectObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'CustomerID', label: 'CustomerID', type: 'string', template: {
        create: () => {
            elem = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'dropdownlist') as DropDownList).destroy();
        },
        write: (args: {elements: Element, values: string}) => {
            let ds: string [] = ['ALFKI', 'BERGS', 'BLONP', 'OTTIK'];
            dropDownObj = new DropDownList({
                dataSource: ds,
                value: args.values ? args.values: ds[0],
                change: (e: any) => {
                    queryBldrObj.notifyChange(e.itemData.value, e.element);
                }
            });
            dropDownObj.appendTo('#' + args.elements.id);
        }
    }},
    { field: 'OrderID', label: 'OrderID', type: 'number'},
    { field: 'In_stock', label: 'In_stock', type: 'boolean', template: {
        create: () => {
            return createElement("input", { attrs: { type: "checkbox" } });
          },
          destroy: (args: { elementId: string }) => {
            (getComponent(
              document.getElementById(args.elementId),
              "checkbox"
            ) as CheckBox).destroy();
          },
          write: (args: { elements: Element; values: string }) => {
            let checked: boolean = args.values === "Yes" ? true : false;
            const boxObj: CheckBox = new CheckBox({
              label: "In Stock",
              checked: checked,
              value: args.values === "Yes" ? "Yes": "No",
              change: (e: any) => {
                queryBldrObj.notifyChange(e.checked ? "Yes" : "No", e.event.target);
              }
            });
            boxObj.appendTo("#" + args.elements.id);
          }
        }
    },
    { field: 'Date', label: 'Date', type: 'date'},
    { field: 'Price', label: 'Price', type: 'number',  operators: [{key: 'equal', value: 'equal'},
     {key: 'greaterthan', value: 'greaterthan'}, {key: 'lessthan', value: 'lessthan'}], template: {
        create: () => {
            elem = document.createElement('div');
            elem.setAttribute('class', 'ticks_slider');
            return elem;
        },
        destroy: (args: {elementId: string}) => {
            (getComponent(document.getElementById(args.elementId), 'slider') as Slider).destroy();
        },
        write: (args: {elements: Element, values: string}) => {
            let ticksSlider: Slider = new Slider({
                min: 0, max: 100,
                value: 10,
                step: 20,
                type: 'MinRange',
                ticks: { placement: 'Before', largeStep:  20, smallStep:  10 },
                change: (e: any) => {
                    queryBldrObj.notifyChange(e.value, args.elements);
                },
            renderingTicks: (args: SliderTickEventArgs) => {
                if (args.tickElement.classList.contains('e-large')) {
                    args.tickElement.classList.add('e-custom');
            }
        }
    });
            ticksSlider.appendTo('#' + args.elements.id);

        }
    }}
];

let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'CustomerID',
        'field': 'CustomerID',
        'type': 'string',
        'operator': 'notequal',
        'value': 'BERGS'
    },
    {
        'condition': 'or',
        'rules': [{
            'label': 'In_stock',
                'field': 'In_stock',
                'type': 'string',
                'operator': 'equal',
                'value': 'Yes'
        },
        {
            'label': 'OrderID',
            'field': 'OrderID',
            'type': 'number',
            'operator': 'equal',
            'value': 10
        },
        {
        'condition': 'and',
            'rules': [{
                'label': 'Price',
                'field': 'Price',
                'type': 'number',
                'operator': 'equal',
                'value': 10
            }]
        }]
    }]
    };
let queryBldrObj: QueryBuilder = new QueryBuilder({ columns: filter, height: 'auto', width: '800px' , rule: importRules, summaryView: true });
queryBldrObj.appendTo('#querybuilder');